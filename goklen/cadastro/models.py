from django.db import models
from math import ceil

TAMANHO_CHOICES = [
    ('P', 'P'),
    ('M', 'M'),
    ('G', 'G'),
    ('GG', 'GG'),
    ('48', '48'),
    ('50', '50'),
    ('52', '52'),
    ('54', '54'),
]

class Profissional(models.Model):
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=14, unique=True)
    endereco = models.CharField(max_length=255)
    categoria = models.CharField(
        max_length=20,
        choices=[("FACCIONISTA", "FACCIONISTA"), ("EMBALADEIRA", "EMBALADEIRA")]
    )
    dados_bancarios = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.nome

class Modelo(models.Model):
    nome = models.CharField(max_length=255)
    observacao = models.TextField(blank=True, null=True)
    cor = models.CharField(max_length=50, blank=True, null=True)
    tamanho = models.CharField(max_length=10, blank=True, null=True)
    
    def __str__(self):
        return self.nome

TIPO_ENVIO_CHOICES = [
    ('unitario', 'Unitário'),
    ('rolo', 'Rolo'),
    ('pacote', 'Pacote'),
]

class Aviamento(models.Model):
    nome = models.CharField(max_length=255)
    marca = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    cor = models.CharField(max_length=50, blank=True, null=True)
    quantidade_em_estoque = models.IntegerField(default=0)
    tipo_envio = models.CharField(max_length=10, choices=TIPO_ENVIO_CHOICES, default='unitario')
    metragem_por_rolo = models.FloatField(null=True, blank=True)
    quantidade_por_pacote = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.nome

class ModeloAviamento(models.Model):
    modelo = models.ForeignKey(Modelo, on_delete=models.CASCADE)
    aviamento = models.ForeignKey(Aviamento, on_delete=models.CASCADE)
    quantidade_por_peca = models.FloatField()

    def __str__(self):
        return f"{self.modelo.nome} - {self.aviamento.nome}"

    def calcular_envio(self, num_pecas):
        total_necessario = self.quantidade_por_peca * num_pecas
        if self.aviamento.tipo_envio == 'rolo' and self.aviamento.metragem_por_rolo:
            return ceil(total_necessario / self.aviamento.metragem_por_rolo)
        elif self.aviamento.tipo_envio == 'pacote' and self.aviamento.quantidade_por_pacote:
            return ceil(total_necessario / self.aviamento.quantidade_por_pacote)
        return total_necessario

class Produto(models.Model):
    nome = models.CharField(max_length=255)
    marca = models.CharField(max_length=255)
    quantidade = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.nome} - {self.marca}"
