# -*- coding: utf-8 -*-
"""
Script de datos iniciales (seed) para el curso:
"Respuesta ante Sismos y Terremotos en el Entorno Institucional".

Guia gratuita dirigida a toda la comunidad de una institucion privada
(ej. Tecsup): estudiantes, docentes y personal administrativo.

Ejecutar con (usando el python del venv, desde backend_django/):
  .venv\\Scripts\\python.exe manage.py shell -c "exec(open('seed_curso_respuesta_sismos.py', encoding='utf-8').read())"

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
    # Reutiliza la misma categoria del curso de seguridad electrica/incendios,
    # ya que ambos cursos pertenecen al mismo eje de "Seguridad y Prevencion".
    category, cat_creada = Category.objects.get_or_create(
        slug='seguridad-prevencion-riesgos',
        defaults={
            'name': 'Seguridad y Prevención de Riesgos',
        },
    )
    print(('CREADA' if cat_creada else 'YA EXISTE') + ' categoria: ' + category.name)

    # ─── Curso ──────────────────────────────────────────────────────────────
    course, curso_creado = Course.objects.get_or_create(
        slug='respuesta-ante-sismos-terremotos',
        defaults={
            'category': category,
            'author': author,
            'title': 'Respuesta ante Sismos y Terremotos en el Entorno Institucional',
            'description': (
                'Guia gratuita dirigida a toda la comunidad de instituciones como Tecsup: '
                'estudiantes, docentes y personal administrativo. Aprende a prepararte antes '
                'de un sismo, que hacer durante el movimiento, como actuar despues, y como '
                'apoyar a otras personas cuando no sabes por donde empezar.'
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
            'title': 'Antes del sismo: preparación individual e institucional',
            'duration_min': 10,
            'content': (
                'La mejor respuesta ante un sismo se prepara antes de que ocurra. Identifica '
                'con anticipacion, en cada espacio donde pasas tiempo (aula, taller, oficina, '
                'casa), las zonas seguras —cerca de columnas estructurales, debajo de mesas '
                'resistentes— y las zonas de riesgo —ventanas, estanterias altas sin fijar, '
                'objetos colgantes pesados, vidrios.\n\n'
                'Conoce de memoria la ruta de evacuacion y el punto de encuentro de cada '
                'edificio que frecuentas dentro de la institucion; no es lo mismo el punto de '
                'encuentro de un aula que el de un laboratorio o taller.\n\n'
                'Ten siempre accesible, tanto en casa como en tu mochila, una pequeña '
                'mochila de emergencia con: agua, una linterna, silbato, copia de documentos '
                'de identidad y medicamentos basicos si los necesitas. La app MediGuard AI '
                'tambien permite tener tus contactos de emergencia configurados de antemano '
                'para activarlos con un solo toque en el SOS.\n\n'
                'A nivel institucional, participar activamente en los simulacros no es solo '
                'un tramite: es la unica forma de que tu cuerpo y tu mente reaccionen por '
                'costumbre, sin pánico, cuando ocurra un sismo real.'
            ),
        },
        {
            'order_index': 2,
            'title': 'Durante el sismo: qué hacer y qué NO hacer',
            'duration_min': 12,
            'content': (
                'Cuando sientas que el suelo tiembla, la prioridad es protegerte donde estas, '
                'no correr hacia la salida. La mayoria de lesiones durante un sismo ocurren '
                'por caidas de objetos o por intentar correr y caer durante el movimiento, no '
                'por el colapso del edificio en si.\n\n'
                'Que SI hacer: agachate de inmediato, cubrete la cabeza y el cuello, y '
                'sujetate a un mueble resistente o ubicate junto a una columna; si estas en '
                'la calle, alejate de postes, cables electricos, fachadas y ventanas; si '
                'conduces, detente en un lugar abierto y permanece dentro del vehiculo con el '
                'cinturon puesto.\n\n'
                'Que NUNCA hacer: no uses el ascensor; no corras hacia las escaleras ni hacia '
                'la salida mientras el suelo se sigue moviendo; no te pares cerca de '
                'ventanas, vitrinas o estanterias altas; no enciendas fosforos ni nada con '
                'llama abierta por el riesgo de fuga de gas.\n\n'
                'Mantente en la posicion de proteccion hasta que el movimiento termine por '
                'completo. Un sismo fuerte suele durar segundos, aunque se sienta mucho mas '
                'largo —no te muevas de tu zona segura antes de que el temblor se detenga.'
            ),
        },
        {
            'order_index': 3,
            'title': 'Técnica "Agáchate, Cúbrete y Sujétate"',
            'duration_min': 8,
            'content': (
                'Esta es la tecnica internacional recomendada para protegerte durante un '
                'sismo y se resume en tres pasos simples que cualquier persona puede '
                'recordar y aplicar, sin importar su area o experiencia previa.\n\n'
                '1) Agachate: baja tu centro de gravedad de inmediato, ponte en el suelo o lo '
                'mas cerca posible de el, para reducir el riesgo de caerte por el movimiento.\n\n'
                '2) Cubrete: protege tu cabeza y cuello con los brazos, o mejor aun, ubicate '
                'debajo de una mesa o escritorio resistente que te proteja de objetos que '
                'caigan.\n\n'
                '3) Sujetate: si estas bajo una mesa, sujetala con una mano para que no se '
                'desplace contigo dentro; si no tienes mueble cerca, mantente agachado junto '
                'a una pared interior o columna, lejos de ventanas.\n\n'
                'Practica esta tecnica en los simulacros institucionales hasta que se vuelva '
                'automatica. En una emergencia real no hay tiempo para pensar el procedimiento '
                'paso a paso —el cuerpo debe reaccionar por habito.'
            ),
        },
        {
            'order_index': 4,
            'title': 'Después del sismo: evaluación y primeros auxilios básicos',
            'duration_min': 12,
            'content': (
                'Cuando el movimiento termine, no asumas que todo paso. Evalua tu propio '
                'estado primero (¿estoy herido?, ¿puedo moverme?), y luego el de las personas '
                'a tu alrededor, antes de iniciar cualquier desplazamiento.\n\n'
                'Si alguien esta herido: aplica los principios basicos de primeros auxilios '
                '—no muevas a una persona con sospecha de lesion en la columna salvo que '
                'corra peligro inmediato (incendio, derrumbe), controla hemorragias con '
                'presion directa, y mantén la calma de quien esta en shock hablandole con voz '
                'pausada mientras llega ayuda.\n\n'
                'Antes de salir del edificio, revisa rapidamente si hay riesgos visibles: '
                'olor a gas, cables electricos caidos o expuestos, grietas grandes en muros '
                'o columnas, vidrios rotos en el suelo. Si detectas alguno de estos riesgos, '
                'evita esa zona y reportalo de inmediato a Seguridad o Mantenimiento.\n\n'
                'Activa el SOS de MediGuard AI si necesitas ayuda, si hay una persona herida, '
                'o simplemente para que tus contactos de emergencia sepan que estas a salvo '
                'despues del evento.'
            ),
        },
        {
            'order_index': 5,
            'title': 'Réplicas, evacuación segura y zonas de riesgo',
            'duration_min': 10,
            'content': (
                'Despues de un sismo fuerte es comun que ocurran replicas —movimientos '
                'menores pero que tambien pueden causar daño, especialmente en estructuras '
                'ya debilitadas. No bajes la guardia apenas termina el primer movimiento.\n\n'
                'Si la institucion activa la evacuacion (por instruccion del personal de '
                'seguridad o por daño visible en la estructura): camina, no corras, sigue las '
                'rutas señalizadas, usa siempre las escaleras nunca el ascensor, y dirigete '
                'directamente al punto de encuentro asignado sin detenerte por objetos '
                'personales.\n\n'
                'Mantente alejado de: edificios con grietas visibles o que parezcan '
                'inestables, cables electricos caidos, postes inclinados, y zonas con olor a '
                'gas —en este ultimo caso, no enciendas ningun dispositivo electrico ni uses '
                'fosforos cerca del area.\n\n'
                'En el punto de encuentro, los docentes verifican la presencia de sus '
                'estudiantes, Recursos Humanos hace el conteo del personal, y el coordinador '
                'de seguridad centraliza la informacion del estado del edificio y de las '
                'personas antes de decidir si se puede regresar o si se debe contactar a '
                'servicios de emergencia externos.'
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
                'Ningun curso reemplaza la calma que da la practica real en los simulacros '
                'institucionales: la teoria te da las herramientas, pero es la repeticion la '
                'que hace que reacciones bien en el momento, incluso si nunca habias vivido '
                'un sismo fuerte antes.\n\n'
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
