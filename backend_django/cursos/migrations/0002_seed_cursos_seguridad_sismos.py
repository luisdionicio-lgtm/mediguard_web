# -*- coding: utf-8 -*-
"""
Migración de datos: crea los cursos de Seguridad y Prevención de Riesgos.

Cursos incluidos:
  1. Seguridad Eléctrica y Prevención de Incendios en el Entorno Institucional
  2. Respuesta ante Sismos y Terremotos en el Entorno Institucional

Requisito: debe existir al menos un superusuario en la base de datos antes de
correr esta migración. Si no hay ninguno, la migración se omite silenciosamente
y los cursos no se crean — en ese caso, crea primero el superusuario con:

    python manage.py createsuperuser

y luego vuelve a aplicar solo esta migración con:

    python manage.py migrate cursos 0002

Es idempotente: si los cursos ya existen (por haber corrido los seed scripts
manualmente) esta migración detecta que no hay nada que hacer y termina sin
tocar la base de datos.
"""
from django.db import migrations
from django.utils import timezone


# ─── Datos del curso 1 ────────────────────────────────────────────────────────

CURSO_ELECTRICA = {
    'slug': 'seguridad-electrica-prevencion-incendios',
    'title': 'Seguridad Eléctrica y Prevención de Incendios en el Entorno Institucional',
    'description': (
        'Guia gratuita dirigida a toda la comunidad de instituciones como Tecsup: '
        'estudiantes, docentes y personal administrativo. Aprende a reconocer riesgos '
        'electricos comunes, que hacer ante un cortocircuito o inicio de incendio, como '
        'usar un extintor correctamente y como ejecutar un plan de evacuacion seguro.'
    ),
}

LECCIONES_ELECTRICA = [
    {
        'order_index': 1,
        'title': 'Riesgos eléctricos comunes en el entorno institucional',
        'duration_min': 10,
        'content': (
            'La electricidad es invisible y por eso se subestima: cables pelados, '
            'enchufes sobrecargados, equipos sin mantenimiento o agua cerca de '
            'instalaciones electricas son causas frecuentes de accidentes en laboratorios, '
            'talleres y oficinas.\n\n'
            'Señales de alerta que debes reportar de inmediato: cables con el forro '
            'roto o quemado, tomacorrientes calientes al tacto, olor a plastico quemado '
            'sin causa aparente, luces que parpadean sin motivo, o equipos que generan '
            'chispas al conectarse.\n\n'
            'Reglas basicas de prevencion: no sobrecargar un mismo tomacorriente con '
            'multiples equipos de alto consumo, no usar cables o extensiones dañadas, '
            'mantener liquidos lejos de tableros e instalaciones electricas, y nunca '
            'intentar reparar una instalacion electrica si no estas capacitado para ello '
            '—ese es trabajo del personal de mantenimiento.\n\n'
            'Cada persona en la institucion tiene un rol: estudiantes y docentes deben '
            'reportar anomalias apenas las detectan; el personal de mantenimiento da '
            'seguimiento tecnico; y Seguridad/Recursos Humanos asegura que el reporte '
            'se atienda a tiempo antes de que se convierta en un riesgo mayor.'
        ),
    },
    {
        'order_index': 2,
        'title': 'Qué hacer ante un cortocircuito o descarga eléctrica',
        'duration_min': 12,
        'content': (
            'Si ves chispas, humo o escuchas un estallido en un tablero o equipo '
            'electrico: no te acerques. Aleja a las personas del area, y si es seguro '
            'hacerlo sin tocar nada metalico o humedo, corta la energia desde el '
            'interruptor general o llave termica mas cercana.\n\n'
            'Si una persona esta en contacto con una fuente electrica (por ejemplo, '
            'tocando un cable energizado): NUNCA la toques directamente. Primero corta '
            'la corriente. Si no puedes cortarla de inmediato, usa un objeto seco y no '
            'conductor (madera, plastico rigido) para alejarla de la fuente, nunca con '
            'las manos desnudas ni con objetos metalicos o humedos.\n\n'
            'Una vez que la persona esta a salvo y la corriente esta cortada: verifica '
            'si respira y responde. Si no responde y no respira con normalidad, inicia '
            'RCP y pide ayuda de inmediato (activa el SOS de MediGuard AI o llama a '
            'emergencias). Las quemaduras electricas pueden no verse graves por fuera '
            'pero causar daño interno serio, asi que toda descarga electrica relevante '
            'requiere evaluacion medica, aunque la persona parezca estar bien.\n\n'
            'Nunca uses agua para apagar un incendio de origen electrico mientras el '
            'circuito siga energizado: el agua conduce electricidad y puede electrocutar '
            'a quien la use.'
        ),
    },
    {
        'order_index': 3,
        'title': 'Prevención de incendios: causas y señales de alerta',
        'duration_min': 10,
        'content': (
            'La mayoria de incendios institucionales comienzan por las mismas causas: '
            'fallas electricas, materiales inflamables mal almacenados cerca de fuentes '
            'de calor, equipos de laboratorio sin supervision, o negligencia con '
            'cigarrillos y fuentes de fuego abierto en zonas no permitidas.\n\n'
            'Reconocer las señales tempranas marca la diferencia: olor a quemado sin '
            'origen claro, humo —incluso en poca cantidad—, calor inusual en paredes o '
            'pisos, y alarmas de deteccion de humo activandose son señales que nunca '
            'deben ignorarse, aunque parezcan una falsa alarma.\n\n'
            'La prevencion es responsabilidad de todos: mantener despejadas las rutas de '
            'evacuacion y salidas de emergencia, no bloquear extintores ni gabinetes '
            'contraincendios, no almacenar material inflamable (papel, solventes, gas) '
            'cerca de tableros electricos o fuentes de calor, y conocer la ubicacion de '
            'los extintores mas cercanos a tu area de trabajo o estudio.'
        ),
    },
    {
        'order_index': 4,
        'title': 'Uso correcto de extintores y primeras acciones ante un incendio',
        'duration_min': 12,
        'content': (
            'Ante un inicio de incendio pequeño y controlable, la tecnica para usar un '
            'extintor se resume en la sigla PASS: Pull (jala el seguro), Aim (apunta la '
            'boquilla a la base del fuego, no a las llamas), Squeeze (aprieta la palanca '
            'con firmeza) y Sweep (mueve la boquilla de lado a lado cubriendo la base).\n\n'
            'Antes de usar un extintor, evalua: ¿el fuego es pequeño y reciente?, '
            '¿tengo una ruta de escape detras de mi?, ¿se que tipo de extintor necesito? '
            '(los extintores ABC sirven para la mayoria de incendios comunes; nunca uses '
            'agua en un incendio de origen electrico). Si alguna respuesta es no, no lo '
            'intentes: evacua y deja que el personal capacitado o los bomberos actuen.\n\n'
            'Si el fuego crece rapido, genera mucho humo, o no logras controlarlo en los '
            'primeros segundos: abandona el intento de inmediato, activa la alarma, '
            'avisa a las personas cercanas y dirigete a la ruta de evacuacion mas '
            'cercana sin correr y sin usar ascensores.'
        ),
    },
    {
        'order_index': 5,
        'title': 'Plan de evacuación: rutas, puntos de encuentro y roles',
        'duration_min': 10,
        'content': (
            'Todo plan de evacuacion institucional define tres elementos clave que debes '
            'conocer de memoria: la ruta de evacuacion mas cercana a tu aula o area de '
            'trabajo, el punto de encuentro asignado fuera del edificio, y la señal de '
            'alarma que indica que se debe evacuar (sonido, megafono, instruccion verbal).\n\n'
            'Durante una evacuacion: camina, no corras; sigue las señaleticas y al '
            'personal de seguridad; nunca uses ascensores, usa siempre las escaleras; '
            'ayuda a quien lo necesite si puedes hacerlo sin ponerte en riesgo tu mismo; '
            'y una vez fuera, dirigete directamente al punto de encuentro asignado sin '
            'detenerte ni regresar por objetos personales.\n\n'
            'La app MediGuard AI puede usarse para activar el SOS y dejar registro de la '
            'situacion, especialmente si alguien quedo separado del grupo, resulto herido, '
            'o si la emergencia requiere notificar a contactos fuera de la institucion.'
        ),
    },
    {
        'order_index': 6,
        'title': 'Evaluación final y certificación',
        'duration_min': 8,
        'content': (
            'Has recorrido los fundamentos de seguridad electrica y prevencion de '
            'incendios: como reconocer riesgos electricos comunes, que hacer ante un '
            'cortocircuito o descarga, como prevenir un incendio y reconocer sus señales '
            'de alerta, como usar un extintor correctamente, y como actuar dentro de un '
            'plan de evacuacion institucional.\n\n'
            'Responde el cuestionario final para repasar los puntos clave de cada leccion. '
            'Al completarlo, tu certificado de finalizacion se genera automaticamente en '
            'la plataforma y queda disponible en tu perfil.'
        ),
    },
]

QUIZZES_ELECTRICA = {
    2: {
        'question': '¿Qué debes hacer primero si una persona está en contacto con un cable energizado?',
        'options': [
            {'key': 'A', 'text': 'Tomarla de la mano y alejarla rápidamente'},
            {'key': 'B', 'text': 'Cortar la corriente antes de tocarla, o usar un objeto seco no conductor'},
            {'key': 'C', 'text': 'Echarle agua para apagar la chispa'},
            {'key': 'D', 'text': 'Esperar a que ella misma se suelte'},
        ],
        'correct_option': 'B',
        'explanation': 'Tocar directamente a una persona electrocutada puede electrocutarte también. Siempre corta la corriente primero o usa un objeto seco y no conductor.',
    },
    4: {
        'question': '¿Qué significa la sigla PASS para usar un extintor?',
        'options': [
            {'key': 'A', 'text': 'Presionar, Apuntar, Soltar, Salir'},
            {'key': 'B', 'text': 'Jalar el seguro, Apuntar a la base, Apretar la palanca, mover de lado a lado (Sweep)'},
            {'key': 'C', 'text': 'Pedir ayuda, Avisar, Salir, Seguir esperando'},
            {'key': 'D', 'text': 'Proteger, Aislar, Sofocar, Salir'},
        ],
        'correct_option': 'B',
        'explanation': 'PASS resume la técnica correcta: Pull (jalar el seguro), Aim (apuntar a la base del fuego), Squeeze (apretar la palanca) y Sweep (barrer de lado a lado).',
    },
    5: {
        'question': 'Durante una evacuación por incendio, ¿qué debes hacer?',
        'options': [
            {'key': 'A', 'text': 'Usar el ascensor para salir más rápido'},
            {'key': 'B', 'text': 'Correr lo más rápido posible sin seguir las señaléticas'},
            {'key': 'C', 'text': 'Caminar siguiendo las rutas señalizadas y usar las escaleras, sin correr'},
            {'key': 'D', 'text': 'Regresar por tus objetos personales antes de salir'},
        ],
        'correct_option': 'C',
        'explanation': 'Los ascensores pueden fallar o quedar atrapados durante un incendio. Siempre se debe caminar, seguir las rutas señalizadas y usar las escaleras.',
    },
}


# ─── Datos del curso 2 ────────────────────────────────────────────────────────

CURSO_SISMOS = {
    'slug': 'respuesta-ante-sismos-terremotos',
    'title': 'Respuesta ante Sismos y Terremotos en el Entorno Institucional',
    'description': (
        'Guia gratuita dirigida a toda la comunidad de instituciones como Tecsup: '
        'estudiantes, docentes y personal administrativo. Aprende a prepararte antes '
        'de un sismo, que hacer durante el movimiento, como actuar despues, y como '
        'apoyar a otras personas cuando no sabes por donde empezar.'
    ),
}

LECCIONES_SISMOS = [
    {
        'order_index': 1,
        'title': 'Antes del sismo: preparación individual e institucional',
        'duration_min': 10,
        'content': (
            'La mejor respuesta ante un sismo se prepara antes de que ocurra. Identifica '
            'con anticipacion, en cada espacio donde pasas tiempo (aula, taller, oficina, '
            'casa), las zonas seguras —cerca de columnas estructurales, debajo de mesas '
            'resistentes— y las zonas de riesgo —ventanas, estanterias altas sin fijar, '
            'objetos colgantes pesados, vidrios.\n\n'
            'Conoce de memoria la ruta de evacuacion y el punto de encuentro de cada '
            'edificio que frecuentas dentro de la institucion.\n\n'
            'Ten siempre accesible una pequeña mochila de emergencia con: agua, linterna, '
            'silbato, copia de documentos de identidad y medicamentos basicos. La app '
            'MediGuard AI tambien permite tener tus contactos de emergencia configurados '
            'de antemano para activarlos con un solo toque en el SOS.'
        ),
    },
    {
        'order_index': 2,
        'title': 'Durante el sismo: qué hacer y qué NO hacer',
        'duration_min': 12,
        'content': (
            'Cuando sientas que el suelo tiembla, la prioridad es protegerte donde estas, '
            'no correr hacia la salida. La mayoria de lesiones durante un sismo ocurren '
            'por caidas de objetos o por intentar correr y caer durante el movimiento.\n\n'
            'Que SI hacer: agachate de inmediato, cubrete la cabeza y el cuello, y '
            'sujetate a un mueble resistente o ubicate junto a una columna.\n\n'
            'Que NUNCA hacer: no uses el ascensor; no corras hacia las escaleras ni hacia '
            'la salida mientras el suelo se sigue moviendo; no te pares cerca de ventanas '
            'o estanterias altas; no enciendas fosforos ni nada con llama abierta por '
            'el riesgo de fuga de gas.'
        ),
    },
    {
        'order_index': 3,
        'title': 'Técnica "Agáchate, Cúbrete y Sujétate"',
        'duration_min': 8,
        'content': (
            'Esta es la tecnica internacional recomendada para protegerte durante un '
            'sismo y se resume en tres pasos:\n\n'
            '1) Agachate: baja tu centro de gravedad de inmediato para reducir el riesgo '
            'de caerte por el movimiento.\n\n'
            '2) Cubrete: protege tu cabeza y cuello con los brazos, o ubicate debajo de '
            'una mesa o escritorio resistente.\n\n'
            '3) Sujetate: si estas bajo una mesa, sujetala con una mano para que no se '
            'desplace contigo; si no tienes mueble cerca, mantente agachado junto a una '
            'pared interior o columna, lejos de ventanas.'
        ),
    },
    {
        'order_index': 4,
        'title': 'Después del sismo: evaluación y primeros auxilios básicos',
        'duration_min': 12,
        'content': (
            'Cuando el movimiento termine, evalua tu propio estado primero, y luego el '
            'de las personas a tu alrededor, antes de iniciar cualquier desplazamiento.\n\n'
            'Si alguien esta herido: no muevas a una persona con sospecha de lesion en '
            'la columna salvo que corra peligro inmediato, controla hemorragias con '
            'presion directa, y manten la calma de quien esta en shock.\n\n'
            'Antes de salir del edificio, revisa si hay riesgos visibles: olor a gas, '
            'cables electricos caidos, grietas grandes en muros o columnas, vidrios rotos '
            'en el suelo. Activa el SOS de MediGuard AI si necesitas ayuda o si hay una '
            'persona herida.'
        ),
    },
    {
        'order_index': 5,
        'title': 'Réplicas, evacuación segura y zonas de riesgo',
        'duration_min': 10,
        'content': (
            'Despues de un sismo fuerte es comun que ocurran replicas. No bajes la '
            'guardia apenas termina el primer movimiento.\n\n'
            'Si la institucion activa la evacuacion: camina, no corras, sigue las rutas '
            'señalizadas, usa siempre las escaleras nunca el ascensor, y dirigete '
            'directamente al punto de encuentro asignado.\n\n'
            'Mantente alejado de: edificios con grietas visibles, cables electricos '
            'caidos, postes inclinados, y zonas con olor a gas —en este ultimo caso, '
            'no enciendas ningun dispositivo electrico ni uses fosforos cerca del area.'
        ),
    },
    {
        'order_index': 6,
        'title': 'Evaluación final y certificación',
        'duration_min': 8,
        'content': (
            'Has recorrido los fundamentos para responder ante un sismo: como prepararte '
            'antes de que ocurra, que hacer durante el movimiento con la tecnica '
            '"Agachate, Cubrete y Sujetate", como evaluar la situacion y brindar primeros '
            'auxilios basicos despues, y como actuar de forma segura ante replicas y '
            'evacuaciones.\n\n'
            'Responde el cuestionario final para repasar los puntos clave de cada leccion. '
            'Al completarlo, tu certificado de finalizacion se genera automaticamente en '
            'la plataforma y queda disponible en tu perfil.'
        ),
    },
]

QUIZZES_SISMOS = {
    2: {
        'question': '¿Qué debes hacer apenas sientes que comienza un sismo?',
        'options': [
            {'key': 'A', 'text': 'Correr de inmediato hacia la salida más cercana'},
            {'key': 'B', 'text': 'Agacharte, cubrirte y sujetarte donde estás, lejos de ventanas'},
            {'key': 'C', 'text': 'Usar el ascensor para bajar rápido'},
            {'key': 'D', 'text': 'Quedarte de pie junto a una ventana para ver qué pasa'},
        ],
        'correct_option': 'B',
        'explanation': 'La mayoría de lesiones ocurren por caídas de objetos o al intentar correr durante el movimiento. Protegerte donde estás es más seguro que intentar salir.',
    },
    3: {
        'question': '¿Cuáles son los tres pasos de la técnica recomendada ante un sismo?',
        'options': [
            {'key': 'A', 'text': 'Correr, gritar, esperar'},
            {'key': 'B', 'text': 'Agáchate, Cúbrete y Sujétate'},
            {'key': 'C', 'text': 'Parar, mirar, avisar'},
            {'key': 'D', 'text': 'Saltar, cubrirte, llamar'},
        ],
        'correct_option': 'B',
        'explanation': '"Agáchate, Cúbrete y Sujétate" es la técnica internacional recomendada: reduce tu exposición a caídas y objetos que puedan golpearte durante el movimiento.',
    },
    5: {
        'question': '¿Qué debes hacer si notas olor a gas después de un sismo?',
        'options': [
            {'key': 'A', 'text': 'Encender la luz para ver mejor el área'},
            {'key': 'B', 'text': 'Alejarte de la zona y evitar encender cualquier dispositivo eléctrico o fósforo'},
            {'key': 'C', 'text': 'Acercarte a investigar de dónde viene'},
            {'key': 'D', 'text': 'Ignorarlo si no ves daños visibles'},
        ],
        'correct_option': 'B',
        'explanation': 'Una fuga de gas cerca de una chispa puede provocar una explosión. Lo correcto es alejarse del área y reportarlo, sin encender nada eléctrico ni usar fósforos.',
    },
}


# ─── Función principal ────────────────────────────────────────────────────────

def seed_cursos(apps, schema_editor):
    Course   = apps.get_model('cursos',    'Course')
    Lesson   = apps.get_model('cursos',    'Lesson')
    Quiz     = apps.get_model('cursos',    'Quiz')
    Category = apps.get_model('categorias','Category')
    Usuario  = apps.get_model('users',     'Usuario')

    # Necesitamos un autor para los cursos. Si no hay ningún admin, se omite.
    author = (
        Usuario.objects.filter(is_superuser=True).first()
        or Usuario.objects.filter(is_staff=True).first()
    )
    if author is None:
        print(
            '\n[AVISO] No se encontró ningún superusuario. '
            'Los cursos de seguridad NO fueron creados.\n'
            'Crea un superusuario con: python manage.py createsuperuser\n'
            'Luego aplica solo esta migración con: '
            'python manage.py migrate cursos 0002 --fake && '
            'python manage.py migrate cursos 0002\n'
        )
        return

    category, _ = Category.objects.get_or_create(
        slug='seguridad-prevencion-riesgos',
        defaults={'name': 'Seguridad y Prevención de Riesgos'},
    )

    for curso_meta, lecciones_data, quizzes_data in [
        (CURSO_ELECTRICA, LECCIONES_ELECTRICA, QUIZZES_ELECTRICA),
        (CURSO_SISMOS,    LECCIONES_SISMOS,    QUIZZES_SISMOS),
    ]:
        # Idempotente: si el curso ya existe (ej: se corrió el seed script) no lo duplica
        course, created = Course.objects.get_or_create(
            slug=curso_meta['slug'],
            defaults={
                'category':    category,
                'author':      author,
                'title':       curso_meta['title'],
                'description': curso_meta['description'],
                'level':       'BASICO',
                'is_published': True,
                'published_at': timezone.now(),
                'thumbnail_url': None,
            },
        )

        total_min = 0
        for ld in lecciones_data:
            lesson, _ = Lesson.objects.get_or_create(
                course=course,
                order_index=ld['order_index'],
                defaults={
                    'title':        ld['title'],
                    'content':      ld['content'],
                    'media_type':   'NINGUNO',
                    'duration_min': ld['duration_min'],
                    'is_free':      True,
                },
            )
            total_min += lesson.duration_min

            if ld['order_index'] in quizzes_data:
                qd = quizzes_data[ld['order_index']]
                Quiz.objects.get_or_create(
                    lesson=lesson,
                    question=qd['question'],
                    defaults={
                        'options':        qd['options'],
                        'correct_option': qd['correct_option'],
                        'explanation':    qd['explanation'],
                    },
                )

        if created:
            course.duration_min = total_min
            course.save()


class Migration(migrations.Migration):

    dependencies = [
        ('cursos',    '0001_initial'),
        ('categorias','0001_initial'),
        ('users',     '0002_seed_roles'),
    ]

    operations = [
        migrations.RunPython(seed_cursos, migrations.RunPython.noop),
    ]
