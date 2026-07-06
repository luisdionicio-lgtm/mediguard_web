from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cursos', '0002_seed_cursos_seguridad_sismos'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='thumbnail_url',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
