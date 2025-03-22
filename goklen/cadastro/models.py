from django.db import models

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
        choices=[
            ("FACCIONISTA", "FACCIONISTA"),
            ("EMBALADEIRA", "EMBALADEIRA")
        ]
    )
    dados_bancarios = models.JSONField(null=True, blank=True)

    def __str__(self):
        return self.nome
    

class Modelo(models.Model):
    nome = models.CharField(max_length=255)
    observacao = models.TextField(blank=True, null=True)  # substitui "descrição"
    cor = models.CharField(max_length=50, blank=True, null=True)  # nova opção
    tamanho = models.CharField(max_length=10, choices=TAMANHO_CHOICES, blank=True, null=True)  # nova opção

    def __str__(self):
        return self.nome

class Vies(models.Model):
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    quantidade_em_estoque = models.IntegerField(default=0)

    def __str__(self):
        return self.nome


class Produto(models.Model):
    nome = models.CharField(max_length=255)
    marca = models.CharField(max_length=255)
    quantidade = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.nome} - {self.marca}"
