# Generated by Django 5.1.7 on 2025-03-20 14:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cadastro', '0002_rename_localizacao_profissional_endereco_and_more'),
        ('pedidos', '0002_remove_confecao_quantidade_confeccionada'),
    ]

    operations = [
        migrations.CreateModel(
            name='HistoricoPagamento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valor', models.DecimalField(decimal_places=2, max_digits=10)),
                ('data_pagamento', models.DateTimeField(auto_now_add=True)),
                ('pedido', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pedidos.pedido')),
                ('profissional', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pagamentos', to='cadastro.profissional')),
            ],
        ),
    ]
