# Generated by Django 5.1.7 on 2025-03-24 01:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cadastro", "0004_vies_metragem_por_rolo_vies_quantidade_por_pacote_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="vies",
            name="cor",
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name="vies",
            name="marca",
            field=models.CharField(default="Sem marca", max_length=255),
            preserve_default=False,
        ),
    ]
