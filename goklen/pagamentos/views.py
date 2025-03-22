from rest_framework import viewsets
from .models import HistoricoPagamento
from .serializers import HistoricoPagamentoSerializer

class HistoricoPagamentoViewSet(viewsets.ReadOnlyModelViewSet):
    # Define a default queryset so the router can automatically determine the basename.
    queryset = HistoricoPagamento.objects.all()
    serializer_class = HistoricoPagamentoSerializer

    def get_queryset(self):
        prof_id = self.request.query_params.get('profissional')
        if prof_id:
            return HistoricoPagamento.objects.filter(profissional_id=prof_id).order_by('-data_pagamento')
        return super().get_queryset()
