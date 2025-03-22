from rest_framework import serializers
from .models import Profissional, Modelo, Vies
from .models import Produto

class ProfissionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profissional
        fields = '__all__'
class ModeloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modelo
        fields = '__all__'

class ViesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vies
        fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'