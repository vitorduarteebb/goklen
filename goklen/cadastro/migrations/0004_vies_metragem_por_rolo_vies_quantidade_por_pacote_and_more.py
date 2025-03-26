# Generated by Django 5.1.7 on 2025-03-24 01:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cadastro", "0003_produto"),
    ]

    operations = [
        migrations.AddField(
            model_name="vies",
            name="metragem_por_rolo",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="vies",
            name="quantidade_por_pacote",
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="vies",
            name="tipo_envio",
            field=models.CharField(
                choices=[
                    ("unitario", "Unitário"),
                    ("rolo", "Rolo"),
                    ("pacote", "Pacote"),
                ],
                default="unitario",
                max_length=10,
            ),
        ),
        migrations.CreateModel(
            name="ModeloVies",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("quantidade_por_peca", models.FloatField()),
                (
                    "modelo",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="cadastro.modelo",
                    ),
                ),
                (
                    "vies",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="cadastro.vies"
                    ),
                ),
            ],
        ),
    ]
