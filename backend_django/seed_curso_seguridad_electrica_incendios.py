# -*- coding: utf-8 -*-
"""
Script de datos iniciales (seed) para el curso:
"Seguridad Eléctrica y Prevención de Incendios en el Entorno Institucional".

Guia gratuita dirigida a toda la comunidad de una institucion privada
(ej. Tecsup): estudiantes, docentes y personal administrativo
(mantenimiento, seguridad, Recursos Humanos, etc.).

Ejecutar con (usando el python del venv, desde backend_django/):
  .venv\\Scripts\\python.exe manage.py shell -c "exec(open('seed_curso_seguridad_electrica_incendios.py', encoding='utf-8').read())"

No uses "manage.py shell < archivo.py": el shell interactivo de Django
ejecuta el archivo linea por linea y rompe la indentacion de los bloques
if/else de este script. El comando -c con exec() lo corre como un solo
bloque, sin ese problema.

Es idempotente: se puede correr varias veces sin duplicar datos
(usa get_or_create por slug/order_index).
"""
from django.contrib.auth import get_user_model
from django.utils import timezone
from categorias.models import Category
from cursos.models import Course, Lesson, Quiz, CourseLevel, MediaType

Usuario = get_user_model()

# ─── Autor del curso ──────────────────────────────────────────────────────
# Se usa un usuario con rol ADMIN existente. Si no existe, el script avisa
# y no continua (Course.author no puede ser nulo).
AUTHOR_EMAIL = 'admin123@gmail.com'
author = Usuario.objects.filter(email=AUTHOR_EMAIL).first()
if author is None:
    print('ERROR: no existe el usuario ' + AUTHOR_EMAIL + '. Cambia AUTHOR_EMAIL por un admin real y vuelve a correr.')
else:
    # ─── Categoria ──────────────────────────────────────────────────────────
    category, cat_creada = Category.objects.get_or_create(
        slug='seguridad-prevencion-riesgos',
        defaults={
            'name': 'Seguridad y Prevención de Riesgos',
        },
    )
    print(('CREADA' if cat_creada else 'YA EXISTE') + ' categoria: ' + category.name)

    # ─── Curso ──────────────────────────────────────────────────────────────
    course, curso_creado = Course.objects.get_or_create(
        slug='seguridad-electrica-prevencion-incendios',
        defaults={
            'category': category,
            'author': author,
            'title': 'Seguridad Eléctrica y Prevención de Incendios en el Entorno Institucional',
            'description': (
                'Guia gratuita dirigida a toda la comunidad de instituciones como Tecsup: '
                'estudiantes, docentes y personal administrativo. Aprende a reconocer riesgos '
                'electricos comunes, que hacer ante un cortocircuito o inicio de incendio, como '
                'usar un extintor correctamente y como ejecutar un plan de evacuacion seguro.'
            ),
            'level': CourseLevel.BASICO,
            'is_published': True,
            'published_at': timezone.now(),
            'thumbnail_url': None,
        },
    )
    print(('CREADO' if curso_creado else 'YA EXISTE') + ' curso: ' + course.title)

    # ─── Lecciones ──────────────────────────────────────────────────────────
    lecciones = [
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
                'los extintores mas cercanos a tu area de trabajo o estudio.\n\n'
                'Cada area aporta de forma distinta: estudiantes y docentes reportan riesgos '
                'visibles en aulas y talleres; el personal de laboratorio sigue protocolos '
                'estrictos con materiales inflamables; y Seguridad/Mantenimiento revisa '
                'periodicamente extintores, detectores de humo y rutas de evacuacion.'
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
                'cercana sin correr y sin usar ascensores.\n\n'
                'Si hay humo denso en el ambiente, agachate y desplazate cerca del piso '
                'donde el aire es mas limpio, cubre tu nariz y boca con tela si es posible, '
                'y antes de abrir una puerta verifica si esta caliente al tacto —si lo esta, '
                'no la abras y busca una ruta alterna.'
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
                'En el punto de encuentro, cada area institucional tiene un rol: los '
                'docentes verifican que todos sus estudiantes esten presentes y reportan '
                'ausencias; Recursos Humanos hace el conteo del personal; y el coordinador '
                'de seguridad centraliza la informacion y la comunica a los servicios de '
                'emergencia si es necesario.\n\n'
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
                'Ninguna de estas tecnicas reemplaza al personal especializado de seguridad o '
                'a los bomberos: son el conocimiento minimo para reaccionar bien en los '
                'primeros segundos de una emergencia, proteger tu vida y la de quienes te '
                'rodean, y facilitar una evacuacion ordenada.\n\n'
                'Responde el cuestionario final para repasar los puntos clave de cada leccion. '
                'Al completarlo, tu certificado de finalizacion se genera automaticamente en '
                'la plataforma y queda disponible en tu perfil.'
            ),
        },
    ]

    total_duracion = 0
    for leccion_data in lecciones:
        leccion, leccion_creada = Lesson.objects.get_or_create(
            course=course,
            order_index=leccion_data['order_index'],
            defaults={
                'title': leccion_data['title'],
                'content': leccion_data['content'],
                'media_type': MediaType.NINGUNO,
                'duration_min': leccion_data['duration_min'],
                'is_free': True,
            },
        )
        total_duracion += leccion.duration_min
        print(('  CREADA' if leccion_creada else '  YA EXISTE') + ' leccion ' + str(leccion_data['order_index']) + ': ' + leccion.title)

    course.duration_min = total_duracion
    course.save(update_fields=['duration_min'])

    # ─── Quizzes ────────────────────────────────────────────────────────────
    quizzes_por_leccion = {
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

    for order_index, quiz_data in quizzes_por_leccion.items():
        leccion = Lesson.objects.get(course=course, order_index=order_index)
        quiz, quiz_creado = Quiz.objects.get_or_create(
            lesson=leccion,
            question=quiz_data['question'],
            defaults={
                'options': quiz_data['options'],
                'correct_option': quiz_data['correct_option'],
                'explanation': quiz_data['explanation'],
            },
        )
        print(('    CREADO' if quiz_creado else '    YA EXISTE') + ' quiz de la leccion ' + str(order_index))

    print('\nSeed completado. Curso "' + course.title + '" con ' + str(course.lessons.count()) + ' lecciones, ' + str(total_duracion) + ' min totales, publicado=' + str(course.is_published) + '.')
