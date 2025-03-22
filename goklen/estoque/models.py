from django.db import models
from cadastro.models import Modelo

class Estoque(models.Model):
    modelo = models.ForeignKey(Modelo, on_delete=models.CASCADE, related_name='estoque')
    quantidade_atual = models.IntegerField(default=0)
    data_atualizacao = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Estoque de {self.modelo.nome}: {self.quantidade_atual}"
