# Generated by Django 5.1.7 on 2025-03-20 03:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cadastro', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Estoque',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantidade_atual', models.IntegerField(default=0)),
                ('data_atualizacao', models.DateTimeField(auto_now=True)),
                ('modelo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='estoque', to='cadastro.modelo')),
            ],
        ),
    ]
