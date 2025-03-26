from rest_framework import serializers
from .models import Profissional, Modelo, Aviamento, Produto, ModeloAviamento

class ProfissionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profissional
        fields = '__all__'

class ModeloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modelo
        fields = '__all__'

class AviamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aviamento
        fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'

class ModeloAviamentoSerializer(serializers.ModelSerializer):
    # For writes, expect aviamento_id; for reads, include full aviamento info.
    aviamento_id = serializers.PrimaryKeyRelatedField(
        queryset=Aviamento.objects.all(),
        write_only=True,
        source='aviamento'
    )
    aviamento = AviamentoSerializer(read_only=True)
    
    class Meta:
        model = ModeloAviamento
        fields = ['modelo', 'aviamento', 'aviamento_id', 'quantidade_por_peca']
