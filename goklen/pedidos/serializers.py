from rest_framework import serializers
from .models import Corte, Pedido, Confecao, Embalagem
from cadastro.models import Profissional, Produto

class CorteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Corte
        fields = '__all__'
        depth = 1  # includes related fields like Modelo

class ConfecaoWriteSerializer(serializers.ModelSerializer):
    pedido = serializers.PrimaryKeyRelatedField(queryset=Pedido.objects.all(), required=True)
    profissional = serializers.PrimaryKeyRelatedField(queryset=Profissional.objects.all(), required=True)
    valor_por_peca_confecao = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    
    class Meta:
        model = Confecao
        fields = '__all__'
        extra_kwargs = {
            'quantidade_confeccionada': {'read_only': True, 'required': False},
            'data_confeccao': {'read_only': True, 'required': False},
        }

class ConfecaoReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Confecao
        fields = '__all__'
        depth = 2  # includes pedido, corte, modelo, and profissional

class EmbalagemWriteSerializer(serializers.ModelSerializer):
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
    # For write operations, 'corte' accepts a primary key.
    corte = serializers.PrimaryKeyRelatedField(queryset=Corte.objects.all())
    confecoes = ConfecaoReadSerializer(many=True, read_only=True)
    embalagens = EmbalagemReadSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pedido
        fields = [
            'id', 'corte', 'quantidade_inicial', 'quantidade_conferida', 
            'diferenca', 'data_criacao', 'status', 'produto', 'quantidade_utilizada', 
            'confecoes', 'embalagens'
        ]
    
    def to_representation(self, instance):
        # Get the default representation
        ret = super().to_representation(instance)
        # Replace the 'corte' field with the nested representation using CorteSerializer
        ret['corte'] = CorteSerializer(instance.corte).data if instance.corte else None
        return ret
