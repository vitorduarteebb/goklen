from rest_framework import serializers
from .models import HistoricoPagamento

class HistoricoPagamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricoPagamento
        fields = '__all__'
