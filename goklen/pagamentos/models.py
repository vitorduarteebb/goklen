from django.db import models
from cadastro.models import Profissional
from pedidos.models import Pedido

class HistoricoPagamento(models.Model):
    profissional = models.ForeignKey(Profissional, on_delete=models.CASCADE, related_name='pagamentos')
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data_pagamento = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pagamento {self.pk} - {self.profissional.nome} - Pedido {self.pedido.id}"
