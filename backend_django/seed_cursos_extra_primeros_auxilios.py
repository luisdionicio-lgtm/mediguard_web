# -*- coding: utf-8 -*-
"""
Script de datos iniciales (seed) para cinco cursos adicionales de la
categoria "Primeros Auxilios y Bienestar Institucional":

  - Primeros Auxilios Pediatricos
  - Control de Hemorragias
  - Manejo de Quemaduras
  - RCP basica para adultos
  - Fracturas y Traumatismos

Ejecutar con (usando el python del venv, desde backend_django/):
  .venv\\Scripts\\python.exe manage.py shell -c "exec(open('seed_cursos_extra_primeros_auxilios.py', encoding='utf-8').read())"

No uses "manage.py shell < archivo.py": el shell interactivo de Django
ejecuta el archivo linea por linea y rompe la indentacion de los bloques
if/else de este script. El comando -c con exec() lo corre como un solo
bloque, sin ese problema.

Es idempotente: se puede correr varias veces sin duplicar datos
(usa get_or_create por slug/order_index/pregunta).
"""
from django.contrib.auth import get_user_model
from django.utils import timezone
from categorias.models import Category
from cursos.models import Course, Lesson, Quiz, CourseLevel, MediaType

Usuario = get_user_model()

# ─── Autor de los cursos ────────────────────────────────────────────────────
# Se usa un usuario con rol ADMIN existente. Si no existe, el script avisa
# y no continua (Course.author no puede ser nulo).
AUTHOR_EMAIL = 'admin123@gmail.com'
author = Usuario.objects.filter(email=AUTHOR_EMAIL).first()

if author is None:
    print('ERROR: no existe el usuario ' + AUTHOR_EMAIL + '. Cambia AUTHOR_EMAIL por un admin real y vuelve a correr.')
else:
    # ─── Categoria ──────────────────────────────────────────────────────────
    category, cat_creada = Category.objects.get_or_create(
        slug='primeros-auxilios-institucional',
        defaults={
            'name': 'Primeros Auxilios y Bienestar Institucional',
        },
    )
    print(('CREADA' if cat_creada else 'YA EXISTE') + ' categoria: ' + category.name)

    # ─── Datos de los cursos ────────────────────────────────────────────────
    CURSOS = [
        {
            'slug': 'primeros-auxilios-pediatricos',
            'title': 'Primeros Auxilios Pediátricos',
            'level': CourseLevel.INTERMEDIO,
            'thumbnail_url': '/images/primeros_auxilios_course.png',
            'description': (
                'Atencion inicial de emergencias en bebes y niños: evaluacion segura, fiebre, '
                'convulsiones febriles, atragantamiento y señales de alarma.'
            ),
            'lecciones': [
                {
                    'title': 'Evaluación segura en bebés y niños',
                    'duration_min': 10,
                    'content': (
                        'Antes de actuar con un bebe o un niño, observa el entorno y evalua si hay '
                        'peligro real (caida, objeto pequeño cerca, agua, enchufes). Acercate con calma: '
                        'los niños perciben el estres del adulto y eso puede empeorar su reaccion.\n\n'
                        'Verifica su nivel de respuesta hablandole por su nombre y observando si te mira, '
                        'llora o reacciona al tacto suave. En bebes, revisa si respira con normalidad '
                        'observando el pecho y escuchando cerca de la boca y nariz.\n\n'
                        'Si no responde o no respira con normalidad, pide ayuda de inmediato: activa el '
                        'SOS de MediGuard AI o pide a alguien cercano que llame a emergencias mientras tu '
                        'te quedas con el niño o bebe.'
                    ),
                },
                {
                    'title': 'Fiebre y convulsiones febriles',
                    'duration_min': 10,
                    'content': (
                        'La fiebre en niños suele ser una respuesta normal del cuerpo ante una infeccion. '
                        'Si el niño esta activo y bebe liquidos, generalmente basta con quitar exceso de '
                        'ropa, ofrecer liquidos frescos y vigilar la temperatura.\n\n'
                        'Si aparece una convulsion febril, protege al niño de golpes retirando objetos '
                        'cercanos, colocalo de lado si es posible, no le sujetes los movimientos ni le '
                        'metas nada en la boca, y cronometra cuanto dura la convulsion.\n\n'
                        'Busca atencion medica urgente si la convulsion dura mas de 5 minutos, se repite, '
                        'el niño tiene dificultad para respirar despues, o es su primera convulsion febril.'
                    ),
                },
                {
                    'title': 'Atragantamiento infantil y señales de alarma',
                    'duration_min': 10,
                    'content': (
                        'Si el niño tose con fuerza, dejalo toser: la tos efectiva es la mejor forma de '
                        'expulsar el objeto. Solo interviene si no puede toser, hablar ni respirar, o si '
                        'sus labios se ponen azulados.\n\n'
                        'En niños mayores de un año, las compresiones abdominales (maniobra de Heimlich '
                        'adaptada) se aplican de forma similar a un adulto pero con menor fuerza. En bebes '
                        'menores de un año se usan golpes en la espalda y compresiones en el pecho, nunca '
                        'compresiones abdominales.\n\n'
                        'Señales de alarma que requieren emergencia inmediata: perdida de conciencia, '
                        'coloracion azulada persistente, o dificultad respiratoria que no mejora. Activa '
                        'el protocolo institucional y el SOS de MediGuard AI sin demora.'
                    ),
                },
            ],
            'quiz': {
                'lesson_index': 2,
                'question': '¿Qué debes hacer primero si un niño puede toser con fuerza tras atragantarse?',
                'options': [
                    {'key': 'A', 'text': 'Aplicar compresiones abdominales de inmediato'},
                    {'key': 'B', 'text': 'Dejarlo toser y observar de cerca'},
                    {'key': 'C', 'text': 'Darle agua para que pase el objeto'},
                    {'key': 'D', 'text': 'Voltearlo boca abajo y golpear la espalda con fuerza'},
                ],
                'correct_option': 'B',
                'explanation': 'Si el niño tose con fuerza, la tos efectiva es la mejor forma de expulsar el objeto. Solo se interviene si deja de poder toser, hablar o respirar.',
            },
        },
        {
            'slug': 'control-hemorragias',
            'title': 'Control de Hemorragias',
            'level': CourseLevel.BASICO,
            'thumbnail_url': '/images/controlh.jpg',
            'description': (
                'Tecnicas basicas para controlar sangrados externos, aplicar presion directa, '
                'reconocer signos de gravedad y activar ayuda.'
            ),
            'lecciones': [
                {
                    'title': 'Cómo reconocer una hemorragia externa grave',
                    'duration_min': 8,
                    'content': (
                        'No toda herida sangrante es una emergencia, pero algunas señales indican '
                        'gravedad: sangrado que empapa rapidamente la ropa o los apositos, sangre que sale '
                        'a chorros o pulsatil, o una herida profunda con un objeto incrustado.\n\n'
                        'Antes de ayudar, verifica que el lugar sea seguro y, si es posible, usa una '
                        'barrera limpia entre tus manos y la herida (guantes, una bolsa, un paño).\n\n'
                        'Si la persona presenta palidez, sudor frio, confusion o debilidad extrema junto '
                        'al sangrado, trata la situacion como una emergencia y pide ayuda de inmediato.'
                    ),
                },
                {
                    'title': 'Presión directa y elevación: técnica básica',
                    'duration_min': 10,
                    'content': (
                        'La tecnica principal para controlar un sangrado externo es la presion directa: '
                        'coloca una gasa o tela limpia sobre la herida y presiona firme y continuamente '
                        'con la palma de la mano.\n\n'
                        'Si la tela se empapa, no la retires: agrega otra capa encima y sigue presionando. '
                        'Retirar el primer apósito puede desprender el coagulo que se esta formando y '
                        'reiniciar el sangrado.\n\n'
                        'Si es posible y no hay sospecha de fractura, eleva la zona afectada por encima '
                        'del nivel del corazon mientras mantienes la presion. Mantén a la persona quieta y '
                        'abrigada mientras esperas ayuda.'
                    ),
                },
                {
                    'title': 'Cuándo activar el protocolo de emergencia',
                    'duration_min': 8,
                    'content': (
                        'Activa el protocolo de emergencia y el SOS de MediGuard AI cuando el sangrado no '
                        'se controla con presion continua, la herida esta en cabeza, cuello, pecho o '
                        'abdomen, o hay un objeto incrustado que no debe retirarse.\n\n'
                        'No apliques sustancias caseras sobre la herida ni intentes limpiarla en '
                        'profundidad: eso corresponde al personal medico. Tu prioridad es controlar el '
                        'sangrado y mantener a la persona estable hasta que llegue ayuda.\n\n'
                        'Documenta mentalmente la hora aproximada en que inicio el sangrado y que '
                        'medidas aplicaste: esa informacion es util para el personal de salud que '
                        'atienda despues.'
                    ),
                },
            ],
            'quiz': {
                'lesson_index': 1,
                'question': '¿Qué debes hacer si el apósito se empapa de sangre?',
                'options': [
                    {'key': 'A', 'text': 'Retirarlo y colocar uno nuevo'},
                    {'key': 'B', 'text': 'Agregar otra capa encima sin retirar la primera'},
                    {'key': 'C', 'text': 'Dejar de presionar por un momento'},
                    {'key': 'D', 'text': 'Lavar la herida con agua antes de continuar'},
                ],
                'correct_option': 'B',
                'explanation': 'Retirar el primer apósito puede desprender el coágulo que se está formando y reiniciar el sangrado; lo correcto es agregar capas encima sin dejar de presionar.',
            },
        },
        {
            'slug': 'manejo-quemaduras',
            'title': 'Manejo de Quemaduras',
            'level': CourseLevel.BASICO,
            'thumbnail_url': '/images/manejoquemaduras.jpg',
            'description': (
                'Cómo actuar ante quemaduras leves, electricas o quimicas, que evitar y cuando '
                'buscar atencion medica.'
            ),
            'lecciones': [
                {
                    'title': 'Tipos de quemaduras: leves, eléctricas y químicas',
                    'duration_min': 8,
                    'content': (
                        'Las quemaduras leves (enrojecimiento, dolor, sin ampollas grandes) suelen '
                        'tratarse con medidas basicas. Las quemaduras electricas y quimicas requieren '
                        'precauciones adicionales antes de acercarte.\n\n'
                        'Ante una quemadura electrica, corta la fuente de energia antes de tocar a la '
                        'persona; nunca la toques directamente si sigue en contacto con la corriente.\n\n'
                        'Ante una quemadura quimica, aleja a la persona del producto y evita el contacto '
                        'directo con el quimico usando guantes o una barrera si estan disponibles.'
                    ),
                },
                {
                    'title': 'Enfriar, cubrir y qué evitar',
                    'duration_min': 10,
                    'content': (
                        'Para quemaduras leves, enfria la zona con agua corriente a temperatura ambiente '
                        'durante varios minutos; el hielo directo daña mas el tejido. Para quemaduras '
                        'quimicas, enjuaga con abundante agua durante al menos 20 minutos.\n\n'
                        'Cubre la zona con un paño limpio o gasa esteril sin apretar, sin usar algodon '
                        'directo sobre la herida. Retira anillos, pulseras o ropa cercana antes de que la '
                        'zona se inflame, siempre que no este pegada a la piel.\n\n'
                        'Nunca uses mantequilla, pasta dental, aceite ni remedios caseros sobre una '
                        'quemadura: retrasan la curacion y aumentan el riesgo de infeccion. No revientes '
                        'las ampollas que se formen.'
                    ),
                },
                {
                    'title': 'Cuándo buscar atención médica urgente',
                    'duration_min': 8,
                    'content': (
                        'Busca atencion medica de inmediato si la quemadura es electrica o quimica, si '
                        'hay ampollas grandes o piel de color blanco, marron o negro, o si afecta cara, '
                        'manos, pies, genitales o articulaciones.\n\n'
                        'Tambien es urgente si la persona es un niño o un adulto mayor, o si la zona '
                        'quemada es mayor al tamaño de la palma de la mano de la persona afectada.\n\n'
                        'Mientras llega ayuda, activa el protocolo institucional y el SOS de MediGuard AI, '
                        'y manten a la persona abrigada y en calma.'
                    ),
                },
            ],
            'quiz': {
                'lesson_index': 1,
                'question': '¿Qué debes usar para enfriar una quemadura leve?',
                'options': [
                    {'key': 'A', 'text': 'Hielo directo sobre la piel'},
                    {'key': 'B', 'text': 'Agua corriente a temperatura ambiente'},
                    {'key': 'C', 'text': 'Pasta dental'},
                    {'key': 'D', 'text': 'Mantequilla o aceite'},
                ],
                'correct_option': 'B',
                'explanation': 'El agua corriente a temperatura ambiente reduce el daño en el tejido sin agravarlo. El hielo directo y los remedios caseros retrasan la curación.',
            },
        },
        {
            'slug': 'rcp-basico',
            'title': 'RCP básica para adultos',
            'level': CourseLevel.BASICO,
            'thumbnail_url': '/images/rcpbasica.jpg',
            'description': (
                'Pasos iniciales para evaluar respuesta, activar emergencias y realizar '
                'compresiones toracicas basicas en adultos.'
            ),
            'lecciones': [
                {
                    'title': 'Evaluar respuesta y activar el sistema de emergencia',
                    'duration_min': 8,
                    'content': (
                        'Antes de acercarte, verifica que el lugar sea seguro. Luego, comprueba si la '
                        'persona responde: hablale en voz alta y agita suavemente sus hombros.\n\n'
                        'Si no responde y no respira con normalidad, pide ayuda de inmediato: activa el '
                        'SOS de MediGuard AI o pide a alguien que llame a los servicios de emergencia '
                        'mientras te preparas para iniciar RCP.\n\n'
                        'Si estas solo, activa el altavoz del telefono y llama mientras comienzas las '
                        'compresiones: no dejes a la persona sola para ir a pedir ayuda salvo que no haya '
                        'otra opcion.'
                    ),
                },
                {
                    'title': 'Compresiones torácicas: técnica y ritmo',
                    'duration_min': 12,
                    'content': (
                        'Coloca a la persona boca arriba sobre una superficie firme. Arrodillate a su '
                        'lado y coloca el talon de una mano en el centro del pecho, entrelazando la otra '
                        'mano encima.\n\n'
                        'Con los brazos estirados, comprime el pecho unos 5 a 6 centimetros de '
                        'profundidad, a un ritmo de 100 a 120 compresiones por minuto. Permite que el '
                        'pecho vuelva a su posicion entre cada compresion.\n\n'
                        'No te detengas hasta que llegue ayuda profesional, la persona muestre señales '
                        'claras de vida, o aparezca un desfibrilador (DEA) disponible para usar.'
                    ),
                },
                {
                    'title': 'Errores comunes al aplicar RCP',
                    'duration_min': 8,
                    'content': (
                        'Un error frecuente es comprimir con los brazos doblados: esto reduce la '
                        'profundidad de la compresion y cansa mas rapido a quien la realiza. Manten los '
                        'brazos rectos y usa el peso de tu cuerpo.\n\n'
                        'Otro error es detenerse para comprobar si la persona reacciona: las '
                        'interrupciones reducen la efectividad de la RCP. Continua hasta que llegue ayuda '
                        'o la persona reaccione claramente.\n\n'
                        'Una RCP imperfecta es mucho mejor que no hacer nada. No temas aplicarla aunque no '
                        'te sientas completamente seguro de la tecnica.'
                    ),
                },
            ],
            'quiz': {
                'lesson_index': 2,
                'question': '¿A qué ritmo aproximado se realizan las compresiones torácicas en un adulto?',
                'options': [
                    {'key': 'A', 'text': '20 a 30 compresiones por minuto'},
                    {'key': 'B', 'text': '100 a 120 compresiones por minuto'},
                    {'key': 'C', 'text': '200 compresiones por minuto'},
                    {'key': 'D', 'text': 'No importa el ritmo, solo la fuerza'},
                ],
                'correct_option': 'B',
                'explanation': 'El ritmo recomendado es de 100 a 120 compresiones por minuto, con una profundidad de 5 a 6 centímetros, permitiendo que el pecho vuelva a su posición entre cada una.',
            },
        },
        {
            'slug': 'fracturas-traumatismos',
            'title': 'Fracturas y Traumatismos',
            'level': CourseLevel.INTERMEDIO,
            'thumbnail_url': '/images/fracturaytraumatismo.jpg',
            'description': (
                'Primeras acciones ante golpes, caidas, sospecha de fracturas, inmovilizacion '
                'basica y señales de emergencia.'
            ),
            'lecciones': [
                {
                    'title': 'Reconocer una posible fractura o traumatismo',
                    'duration_min': 8,
                    'content': (
                        'Sospecha de una fractura cuando hay dolor intenso, deformidad visible, '
                        'hinchazon rapida o incapacidad para mover o apoyar la zona afectada.\n\n'
                        'Tambien son señales de alarma el entumecimiento, la piel fria o el cambio de '
                        'color por debajo de la lesion, asi como una herida abierta con hueso visible.\n\n'
                        'Antes de ayudar, verifica que el lugar sea seguro y pregunta que ocurrio y donde '
                        'duele, sin pedir a la persona que mueva la zona para "comprobar" la lesion.'
                    ),
                },
                {
                    'title': 'Inmovilización básica: qué hacer y qué no',
                    'duration_min': 10,
                    'content': (
                        'Manten la zona lesionada quieta y en la posicion en que la encontraste. No '
                        'intentes enderezar la extremidad ni recolocar una articulacion.\n\n'
                        'Retira anillos o accesorios cercanos antes de que aumente la hinchazon, solo si '
                        'se puede hacer sin causar dolor. Si hay una herida con sangrado alrededor, '
                        'controla el sangrado con un material limpio sin presionar directamente un hueso '
                        'expuesto.\n\n'
                        'Puedes aplicar frio envuelto en una tela por periodos cortos, sin contacto '
                        'directo con la piel, para reducir la hinchazon mientras llega ayuda.'
                    ),
                },
                {
                    'title': 'Señales de emergencia que requieren traslado inmediato',
                    'duration_min': 8,
                    'content': (
                        'Busca ayuda de emergencia de inmediato si hay deformidad marcada, hueso visible, '
                        'sangrado abundante o dolor muy intenso.\n\n'
                        'Tambien es urgente si la extremidad esta fria, palida, azulada o sin '
                        'sensibilidad, o si se sospecha una lesion en cabeza, cuello, espalda o pelvis: en '
                        'estos casos, no muevas a la persona salvo peligro inmediato.\n\n'
                        'Activa el protocolo institucional y el SOS de MediGuard AI, y explica al personal '
                        'de salud como ocurrio la lesion y que medidas aplicaste mientras esperaban ayuda.'
                    ),
                },
            ],
            'quiz': {
                'lesson_index': 1,
                'question': '¿Qué debes hacer ante una posible fractura?',
                'options': [
                    {'key': 'A', 'text': 'Intentar enderezar la extremidad'},
                    {'key': 'B', 'text': 'Mantener la zona quieta en la posición encontrada'},
                    {'key': 'C', 'text': 'Pedir a la persona que mueva la zona para comprobar el dolor'},
                    {'key': 'D', 'text': 'Presionar directamente sobre el hueso visible'},
                ],
                'correct_option': 'B',
                'explanation': 'Mover o recolocar una posible fractura puede agravar el daño en huesos, vasos o nervios. Lo correcto es mantener la zona quieta en la posición en que se encontró.',
            },
        },
    ]

    # ─── Creación de cursos, lecciones y quizzes ────────────────────────────
    total_cursos_creados = 0
    total_lecciones_creadas = 0
    total_quizzes_creados = 0

    for curso_data in CURSOS:
        course, curso_creado = Course.objects.get_or_create(
            slug=curso_data['slug'],
            defaults={
                'category': category,
                'author': author,
                'title': curso_data['title'],
                'description': curso_data['description'],
                'level': curso_data['level'],
                'is_published': True,
                'published_at': timezone.now(),
                'thumbnail_url': curso_data['thumbnail_url'],
            },
        )
        if curso_creado:
            total_cursos_creados += 1
        elif course.thumbnail_url != curso_data['thumbnail_url']:
            # El curso ya existia (por ejemplo, creado antes de tener la
            # imagen definitiva): actualiza solo thumbnail_url sin tocar el
            # resto de sus datos.
            course.thumbnail_url = curso_data['thumbnail_url']
            course.save(update_fields=['thumbnail_url'])
            print('  ACTUALIZADO thumbnail_url de: ' + course.title)
        print(('CREADO' if curso_creado else 'YA EXISTE') + ' curso: ' + course.title)

        total_duracion = 0
        for i, leccion_data in enumerate(curso_data['lecciones'], start=1):
            leccion, leccion_creada = Lesson.objects.get_or_create(
                course=course,
                order_index=i,
                defaults={
                    'title': leccion_data['title'],
                    'content': leccion_data['content'],
                    'media_type': MediaType.NINGUNO,
                    'duration_min': leccion_data['duration_min'],
                    'is_free': True,
                },
            )
            total_duracion += leccion.duration_min
            if leccion_creada:
                total_lecciones_creadas += 1
            print(('  CREADA' if leccion_creada else '  YA EXISTE') + ' leccion ' + str(i) + ': ' + leccion.title)

        course.duration_min = total_duracion
        course.save(update_fields=['duration_min'])

        quiz_data = curso_data['quiz']
        leccion_quiz = Lesson.objects.get(course=course, order_index=quiz_data['lesson_index'])
        quiz, quiz_creado = Quiz.objects.get_or_create(
            lesson=leccion_quiz,
            question=quiz_data['question'],
            defaults={
                'options': quiz_data['options'],
                'correct_option': quiz_data['correct_option'],
                'explanation': quiz_data['explanation'],
            },
        )
        if quiz_creado:
            total_quizzes_creados += 1
        print(('    CREADO' if quiz_creado else '    YA EXISTE') + ' quiz de la leccion ' + str(quiz_data['lesson_index']))

    print(
        '\nSeed completado. Cursos nuevos: ' + str(total_cursos_creados)
        + ', lecciones nuevas: ' + str(total_lecciones_creadas)
        + ', quizzes nuevos: ' + str(total_quizzes_creados) + '.'
    )
