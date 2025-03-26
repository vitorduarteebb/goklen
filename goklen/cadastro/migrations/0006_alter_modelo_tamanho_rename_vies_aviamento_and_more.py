# Generated by Django 5.1.7 on 2025-03-24 21:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cadastro", "0005_vies_cor_vies_marca"),
    ]

    operations = [
        migrations.AlterField(
            model_name="modelo",
            name="tamanho",
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.RenameModel(
            old_name="Vies",
            new_name="Aviamento",
        ),
        migrations.CreateModel(
            name="ModeloAviamento",
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
                    "aviamento",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="cadastro.aviamento",
                    ),
                ),
                (
                    "modelo",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="cadastro.modelo",
                    ),
                ),
            ],
        ),
        migrations.DeleteModel(
            name="ModeloVies",
        ),
    ]
