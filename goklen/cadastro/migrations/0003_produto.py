# Generated by Django 5.1.7 on 2025-03-20 20:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cadastro', '0002_rename_localizacao_profissional_endereco_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Produto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('marca', models.CharField(max_length=255)),
                ('quantidade', models.PositiveIntegerField(default=0)),
            ],
        ),
    ]
