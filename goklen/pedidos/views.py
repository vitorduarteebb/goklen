from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction, IntegrityError
from django.utils import timezone
from math import ceil
from pagamentos.models import HistoricoPagamento
from .models import Corte, Pedido, Confecao, Embalagem
from .serializers import (
    CorteSerializer,
    PedidoSerializer,
    ConfecaoWriteSerializer,
    ConfecaoReadSerializer,
    EmbalagemWriteSerializer,
    EmbalagemReadSerializer
)
from cadastro.models import Produto, ModeloAviamento

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
            serializer = self.get_serializer(data=request.data)
            try:
                serializer.is_valid(raise_exception=True)
            except Exception as e:
                print("Serializer errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            validated_data = serializer.validated_data

            try:
                quantidade_inicial = int(validated_data.get('quantidade_inicial'))
            except (TypeError, ValueError):
                return Response({"error": "Quantidade inicial inválida."},
                                status=status.HTTP_400_BAD_REQUEST)

            quantidade_utilizada = validated_data.get('quantidade_utilizada')
            if quantidade_utilizada is not None:
                try:
                    quantidade_utilizada = int(quantidade_utilizada)
                except (TypeError, ValueError):
                    return Response({"error": "Quantidade utilizada inválida."},
                                    status=status.HTTP_400_BAD_REQUEST)

            try:
                pedido = serializer.save()
            except IntegrityError as e:
                print("Error saving pedido:", str(e))
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            if pedido.produto and quantidade_utilizada is not None:
                produto = pedido.produto
                if produto.quantidade < quantidade_utilizada:
                    return Response({"error": "Estoque insuficiente para o produto selecionado."},
                                    status=status.HTTP_400_BAD_REQUEST)
                produto.quantidade -= quantidade_utilizada
                produto.save()

            # Deduction logic for aviamento consumption using ModeloAviamento
            consumo_info = {}
            if pedido.corte and pedido.corte.modelo:
                modelo = pedido.corte.modelo
                # We assume here that the linked aviamento is the one for which the modelaviamento was created.
                modelo_aviamento = ModeloAviamento.objects.filter(
                    modelo=modelo,
                    aviamento__nome__icontains="elastico"
                ).first()
                if modelo_aviamento:
                    consumo_por_peca = modelo_aviamento.quantidade_por_peca
                    total_consumo = consumo_por_peca * pedido.quantidade_inicial
                    aviamento = modelo_aviamento.aviamento
                    if aviamento.tipo_envio == 'rolo' and aviamento.metragem_por_rolo:
                        rolos_utilizados = ceil(total_consumo / aviamento.metragem_por_rolo)
                        if aviamento.quantidade_em_estoque < rolos_utilizados:
                            return Response({"error": "Estoque insuficiente para o aviamento."},
                                            status=status.HTTP_400_BAD_REQUEST)
                        aviamento.quantidade_em_estoque -= rolos_utilizados
                        aviamento.save()
                        consumo_info = {
                           "aviamento": aviamento.nome,
                           "tipo": "rolo",
                           "consumo_total": total_consumo,
                           "rolos_utilizados": rolos_utilizados
                        }
                    elif aviamento.tipo_envio == 'pacote' and aviamento.quantidade_por_pacote:
                        pacotes_utilizados = ceil(total_consumo / aviamento.quantidade_por_pacote)
                        if aviamento.quantidade_em_estoque < pacotes_utilizados:
                            return Response({"error": "Estoque insuficiente para o aviamento."},
                                            status=status.HTTP_400_BAD_REQUEST)
                        aviamento.quantidade_em_estoque -= pacotes_utilizados
                        aviamento.save()
                        consumo_info = {
                           "aviamento": aviamento.nome,
                           "tipo": "pacote",
                           "consumo_total": total_consumo,
                           "pacotes_utilizados": pacotes_utilizados
                        }
                else:
                    print("Nenhum vínculo de aviamento vinculado encontrado.")
                    consumo_info = {}
            updated_serializer = self.get_serializer(pedido)
            response_data = updated_serializer.data
            response_data['consumo_info'] = consumo_info
            headers = self.get_success_headers(response_data)
            return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'])
    def conferir(self, request, pk=None):
        pedido = self.get_object()
        if pedido.status != "Aguardando Conferencia":
            return Response({"error": "Esse pedido não está aguardando conferência."},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            quantidade_conferida = int(request.data.get("quantidade_conferida"))
        except (TypeError, ValueError):
            return Response({"error": "Quantidade conferida inválida."},
                            status=status.HTTP_400_BAD_REQUEST)
        pedido.quantidade_conferida = quantidade_conferida
        pedido.diferenca = quantidade_conferida - pedido.quantidade_inicial
        pedido.save()

        if pedido.diferenca < 0:
            diff = abs(pedido.diferenca)
            for conf in pedido.confecoes.all():
                valor_negativo = conf.valor_por_peca_confecao * diff
                HistoricoPagamento.objects.create(
                    profissional=conf.profissional,
                    pedido=pedido,
                    valor=-valor_negativo,
                    data_pagamento=timezone.now()
                )
            for emb in pedido.embalagens.all():
                valor_negativo = emb.valor_por_peca_embalagem * diff
                HistoricoPagamento.objects.create(
                    profissional=emb.profissional,
                    pedido=pedido,
                    valor=-valor_negativo,
                    data_pagamento=timezone.now()
                )

        pedido.status = "Conferido"
        pedido.save()
        serializer = self.get_serializer(pedido)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ConfecaoViewSet(viewsets.ModelViewSet):
    queryset = Confecao.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve', 'lancar_saldo', 'pagar']:
            return ConfecaoReadSerializer
        return ConfecaoWriteSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            print("Confecção serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        pedido = serializer.validated_data.get('pedido')
        if not pedido:
            return Response({"error": "O campo 'pedido' é obrigatório."},
                            status=status.HTTP_400_BAD_REQUEST)
        if pedido.status != "Criado":
            return Response(
                {"error": f"Pedido #{pedido.id} já está em confecção ou finalizado. Status atual: {pedido.status}."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if Confecao.objects.filter(pedido=pedido).exists():
            return Response(
                {"error": f"Pedido #{pedido.id} já foi confeccionado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        pedido.status = "Em Confecção"
        pedido.save()
        confecao = serializer.save()
        read_serializer = ConfecaoReadSerializer(confecao)
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'])
    def lancar_saldo(self, request, pk=None):
        confecao = self.get_object()
        pedido = confecao.pedido
        if pedido.status != "Em Confecção":
            return Response({"error": "O pedido não está em confecção, portanto não pode lançar saldo."},
                            status=status.HTTP_400_BAD_REQUEST)
        valor = confecao.valor_por_peca_confecao * pedido.quantidade_inicial
        HistoricoPagamento.objects.create(
            profissional=confecao.profissional,
            pedido=pedido,
            valor=valor,
            data_pagamento=timezone.now()
        )
        # Update the order status to the next step: Aguardando Embaladeira
        pedido.status = "Aguardando Embaladeira"
        pedido.save()
        return Response({"message": "Saldo lançado para confecção", "valor": valor},
                        status=status.HTTP_200_OK)


class CorteViewSet(viewsets.ModelViewSet):
    queryset = Corte.objects.all()
    serializer_class = CorteSerializer


class EmbalagemViewSet(viewsets.ModelViewSet):
    queryset = Embalagem.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve', 'lancar_saldo']:
            return EmbalagemReadSerializer
        return EmbalagemWriteSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pedido = serializer.validated_data.get('pedido')
        if not pedido:
            return Response({"error": "O campo 'pedido' é obrigatório."},
                            status=status.HTTP_400_BAD_REQUEST)
        if pedido.status != "Aguardando Embaladeira":
            return Response({"error": "Esse pedido não está aguardando embalagem."},
                            status=status.HTTP_400_BAD_REQUEST)
        if Embalagem.objects.filter(pedido=pedido).exists():
            return Response({"error": "Esse pedido já foi embalado."},
                            status=status.HTTP_400_BAD_REQUEST)
        pedido.status = "Em Embalagem"
        pedido.save()
        embalagem = serializer.save()
        read_serializer = EmbalagemReadSerializer(embalagem)
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'])
    def lancar_saldo(self, request, pk=None):
        embalagem = self.get_object()
        pedido = embalagem.pedido
        if pedido.status != "Em Embalagem":
            return Response({"error": "O pedido não está em embalagem, portanto não pode lançar saldo."},
                            status=status.HTTP_400_BAD_REQUEST)
        valor = embalagem.valor_por_peca_embalagem * pedido.quantidade_inicial
        from pagamentos.models import HistoricoPagamento
        HistoricoPagamento.objects.create(
            profissional=embalagem.profissional,
            pedido=pedido,
            valor=valor,
            data_pagamento=timezone.now()
        )
        # Update order status to final (Conferido)
        pedido.status = "Conferido"
        pedido.save()
        return Response({"message": "Saldo lançado para embalagem", "valor": valor},
                        status=status.HTTP_200_OK)
