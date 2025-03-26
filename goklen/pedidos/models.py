from django.db import models
from cadastro.models import Modelo, Produto

class Corte(models.Model):
    codigo_mesa = models.CharField(max_length=100)
    data_corte = models.DateTimeField()  # Data real do corte
    modelo = models.ForeignKey(Modelo, on_delete=models.CASCADE, related_name='cortes')
    quantidade_cortada = models.IntegerField()  # Total de peças cortadas e disponíveis

    def __str__(self):
        return f"Corte {self.codigo_mesa} - {self.modelo.nome}"

class Pedido(models.Model):
    corte = models.ForeignKey(Corte, on_delete=models.CASCADE, related_name='pedidos')
    quantidade_inicial = models.IntegerField()
    quantidade_conferida = models.IntegerField(blank=True, null=True)
    diferenca = models.IntegerField(blank=True, null=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='Criado')
    produto = models.ForeignKey(Produto, on_delete=models.PROTECT, null=True, blank=True)
    quantidade_utilizada = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"Pedido #{self.id} - Corte: {self.corte.codigo_mesa}"

class Confecao(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='confecoes')
    profissional = models.ForeignKey('cadastro.Profissional', on_delete=models.CASCADE, related_name='confecoes')
    valor_por_peca_confecao = models.DecimalField(max_digits=10, decimal_places=2)
    valor_total_confecao = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def save(self, *args, **kwargs):
        self.valor_total_confecao = self.pedido.quantidade_inicial * self.valor_por_peca_confecao
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Confecção do Pedido #{self.pedido.id} - {self.profissional.nome}"

class Embalagem(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='embalagens')
    profissional = models.ForeignKey('cadastro.Profissional', on_delete=models.CASCADE, related_name='embalagens')
    quantidade_embalada = models.IntegerField()
    valor_por_peca_embalagem = models.DecimalField(max_digits=10, decimal_places=2)
    valor_total_embalagem = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def save(self, *args, **kwargs):
        self.valor_total_embalagem = self.quantidade_embalada * self.valor_por_peca_embalagem
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Embalagem do Pedido #{self.pedido.id} - {self.profissional.nome}"
