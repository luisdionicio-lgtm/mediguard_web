# -*- coding: utf-8 -*-
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_seed_roles'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='avatar_url',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='usuario',
            name='bio',
            field=models.TextField(blank=True, null=True),
        ),
    ]
