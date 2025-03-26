from rest_framework import serializers
from .models import Corte, Pedido, Confecao, Embalagem
from cadastro.models import Modelo, Produto, ModeloAviamento, Aviamento
from cadastro.serializers import ModeloSerializer  # Assumed to be configured

class CorteSerializer(serializers.ModelSerializer):
    modelo = ModeloSerializer(read_only=True)
    modelo_id = serializers.PrimaryKeyRelatedField(
        queryset=Modelo.objects.all(),
        write_only=True,
        source="modelo"
    )
    class Meta:
        model = Corte
        fields = ['id', 'codigo_mesa', 'data_corte', 'modelo', 'modelo_id', 'quantidade_cortada']

class ConfecaoWriteSerializer(serializers.ModelSerializer):
    from cadastro.models import Profissional
    pedido = serializers.PrimaryKeyRelatedField(queryset=Pedido.objects.all(), required=True)
    profissional = serializers.PrimaryKeyRelatedField(queryset=Profissional.objects.all(), required=True)
    valor_por_peca_confecao = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    class Meta:
        model = Confecao
        fields = '__all__'
        extra_kwargs = {
            'quantidade_confeccionada': {'read_only': True},
            'data_confeccao': {'read_only': True},
        }

class ConfecaoReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Confecao
        fields = '__all__'
        depth = 2

class EmbalagemWriteSerializer(serializers.ModelSerializer):
    from cadastro.models import Profissional
    pedido = serializers.PrimaryKeyRelatedField(queryset=Pedido.objects.all(), required=True)
    profissional = serializers.PrimaryKeyRelatedField(queryset=Profissional.objects.all(), required=True)
    quantidade_embalada = serializers.IntegerField(required=False, default=0)
    class Meta:
        model = Embalagem
        fields = '__all__'

class EmbalagemReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Embalagem
        fields = '__all__'
        depth = 2

class PedidoSerializer(serializers.ModelSerializer):
    corte = serializers.PrimaryKeyRelatedField(queryset=Corte.objects.all())
    corte_detail = CorteSerializer(source='corte', read_only=True)
    confecoes = ConfecaoReadSerializer(many=True, read_only=True)
    embalagens = EmbalagemReadSerializer(many=True, read_only=True)
    class Meta:
        model = Pedido
        fields = [
            'id', 'corte', 'corte_detail', 'quantidade_inicial',
            'quantidade_conferida', 'diferenca', 'data_criacao',
            'status', 'produto', 'quantidade_utilizada',
            'confecoes', 'embalagens'
        ]
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['corte'] = CorteSerializer(instance.corte).data if instance.corte else None
        return ret

class AviamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aviamento
        fields = '__all__'

class ModeloAviamentoSerializer(serializers.ModelSerializer):
    aviamento_id = serializers.PrimaryKeyRelatedField(
        queryset=Aviamento.objects.all(),
        write_only=True,
        source='aviamento'
    )
    aviamento = AviamentoSerializer(read_only=True)
    class Meta:
        model = ModeloAviamento
        fields = ['modelo', 'aviamento', 'aviamento_id', 'quantidade_por_peca']
