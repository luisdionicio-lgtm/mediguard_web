# -*- coding: utf-8 -*-
"""
Script de datos iniciales (seed) para el curso piloto de Educacion:
"Primeros Auxilios y Respuesta ante Emergencias en el Entorno Institucional".

Guia gratuita dirigida a toda la comunidad de una institucion privada
(ej. Tecsup): estudiantes, docentes y personal administrativo
(Recursos Humanos, Psicologia, Marketing, etc.).

Ejecutar con (usando el python del venv, desde backend_django/):
  .venv\\Scripts\\python.exe manage.py shell -c "exec(open('seed_curso_primeros_auxilios.py', encoding='utf-8').read())"

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
        slug='primeros-auxilios-institucional',
        defaults={
            'name': 'Primeros Auxilios y Bienestar Institucional',
        },
    )
    print(('CREADA' if cat_creada else 'YA EXISTE') + ' categoria: ' + category.name)

    # ─── Curso ──────────────────────────────────────────────────────────────
    course, curso_creado = Course.objects.get_or_create(
        slug='primeros-auxilios-entorno-institucional',
        defaults={
            'category': category,
            'author': author,
            'title': 'Primeros Auxilios y Respuesta ante Emergencias en el Entorno Institucional',
            'description': (
                'Guia gratuita dirigida a toda la comunidad de instituciones como Tecsup: '
                'estudiantes, docentes y personal administrativo (Recursos Humanos, Psicologia, '
                'Marketing y otras areas). Aprende a reconocer una emergencia, actuar en los '
                'primeros minutos criticos, brindar apoyo psicologico inmediato y conocer el '
                'protocolo institucional de respuesta, sin necesidad de ser personal medico.'
            ),
            'level': CourseLevel.BASICO,
            'is_published': True,
            'published_at': timezone.now(),
            # Generada con ChatGPT (DALL-E) y guardada en frontend_react/public/images/.
            # URL absoluta porque thumbnail_url es URLField; en otro entorno hay que
            # cambiar el host (localhost:5173 = servidor de Vite en desarrollo local).
            'thumbnail_url': 'http://localhost:5173/images/primeros_auxilios_course.png',
        },
    )
    print(('CREADO' if curso_creado else 'YA EXISTE') + ' curso: ' + course.title)

    # ─── Lecciones ──────────────────────────────────────────────────────────
    lecciones = [
        {
            'order_index': 1,
            'title': '¿Por qué todos en la institución deben saber primeros auxilios?',
            'duration_min': 10,
            'content': (
                'En una emergencia, los primeros minutos son los que mas importan. A esto se le '
                'llama la "hora dorada": el periodo inicial tras un accidente o una crisis de salud '
                'en el que actuar rapido y bien puede salvar una vida o evitar que una lesion empeore. '
                'La ambulancia o el personal medico especializado puede tardar varios minutos en '
                'llegar, y en ese tiempo, la persona que este presente —un companero de clase, un '
                'docente, alguien de Recursos Humanos— es quien realmente puede marcar la diferencia.\n\n'
                'Esta guia no busca convertirte en paramedico. Busca darte las herramientas minimas '
                'para reconocer una emergencia, mantener la calma, proteger a la persona afectada y a '
                'quienes la rodean, y activar correctamente el sistema de ayuda: companeros, '
                'enfermeria, servicios de emergencia, y la app MediGuard AI.\n\n'
                'Cada rol dentro de la institucion aporta de una forma distinta:\n'
                '- Los estudiantes suelen ser los primeros testigos de un incidente, ya sea en un '
                'laboratorio, un taller o un espacio comun.\n'
                '- Los docentes son responsables de la seguridad del grupo a su cargo durante clases '
                'y practicas.\n'
                '- Recursos Humanos gestiona los protocolos de seguridad laboral y el seguimiento de '
                'incidentes del personal.\n'
                '- Psicologia interviene en el apoyo emocional inmediato tras una crisis o un evento '
                'traumatico.\n'
                '- Marketing y Comunicaciones es responsable de la comunicacion interna y externa '
                'correcta durante una emergencia, evitando rumores o informacion incorrecta.\n\n'
                'Saber primeros auxilios no es responsabilidad exclusiva del personal de salud: es '
                'una competencia que protege a toda la comunidad institucional.'
            ),
        },
        {
            'order_index': 2,
            'title': 'Evaluación de la escena y RCP básico',
            'duration_min': 15,
            'content': (
                'Antes de actuar, evalua. Acercarte sin pensar a una persona herida puede convertirte '
                'tambien en victima (cables sueltos, gases, trafico, una persona agresiva por el '
                'shock). Los tres pasos antes de tocar a alguien son: 1) Verificar que el lugar sea '
                'seguro para ti y para la persona afectada. 2) Verificar si la persona responde '
                '(hablale, tocale el hombro). 3) Pedir ayuda de inmediato —grita, pide a alguien que '
                'llame a emergencias o active el SOS de MediGuard AI— antes de iniciar cualquier '
                'maniobra.\n\n'
                'Si la persona no responde y no respira con normalidad, inicia compresiones toracicas: '
                'coloca el talon de tu mano en el centro del pecho, entrelaza la otra mano, y '
                'comprime fuerte y rapido (unas 100 a 120 veces por minuto, hundiendo el pecho unos '
                '5 cm). No te detengas hasta que llegue ayuda profesional o la persona reaccione.\n\n'
                'Para el atragantamiento en una persona consciente que no puede toser, hablar ni '
                'respirar: ponte detras de ella, rodea su abdomen con los brazos, cierra una mano en '
                'puño justo arriba del ombligo, sujetala con la otra mano y haz compresiones firmes '
                'hacia adentro y arriba (maniobra de Heimlich) hasta que expulse el objeto.\n\n'
                'Recuerda: esto es soporte basico, no un reemplazo de la atencion medica '
                'profesional. Actuar imperfectamente pero rapido es mejor que no actuar.'
            ),
        },
        {
            'order_index': 3,
            'title': 'Heridas, hemorragias y quemaduras comunes',
            'duration_min': 12,
            'content': (
                'Ante una herida con sangrado, lo primero es aplicar presion directa con un paño o '
                'gasa limpia sobre la herida, sin retirarla aunque se empape (agregar mas capas '
                'encima si es necesario). Si el sangrado es muy abundante y no se controla, mantén la '
                'presion y eleva la zona afectada por encima del nivel del corazon si es posible, '
                'mientras llega ayuda.\n\n'
                'Para quemaduras leves (enrojecimiento, dolor, sin ampollas grandes), enfria la zona '
                'con agua corriente a temperatura ambiente durante varios minutos —nunca con hielo '
                'directo, que daña mas el tejido—. Cubre con un paño limpio sin apretar. No apliques '
                'pasta dental, mantequilla, ni remedios caseros: retrasan la curacion y aumentan el '
                'riesgo de infeccion.\n\n'
                'Que NO hacer nunca: no retires objetos incrustados en una herida (cuchillos, vidrios, '
                'astillas) —puedes provocar un sangrado mayor—; en su lugar, estabiliza el objeto y '
                'espera ayuda profesional. No revientes ampollas de quemaduras. No uses torniquetes '
                'salvo que estes entrenado especificamente y el sangrado sea masivo e incontrolable.\n\n'
                'En cualquiera de estos casos, activa el protocolo institucional y, si aplica, el SOS '
                'de MediGuard AI para dejar registro y notificar a tus contactos de emergencia.'
            ),
        },
        {
            'order_index': 4,
            'title': 'Primeros auxilios psicológicos: apoyo en crisis y shock emocional',
            'duration_min': 12,
            'content': (
                'No toda emergencia es fisica. Un accidente, una mala noticia o una situacion de '
                'mucha presion pueden generar una crisis de ansiedad, un shock emocional o una '
                'reaccion de panico —tanto en la persona afectada como en quienes presencian el '
                'evento—. Reconocer estas señales (respiracion acelerada, temblor, llanto '
                'incontrolable, sensacion de irrealidad, bloqueo) es el primer paso para ayudar.\n\n'
                'La actitud correcta no es minimizar ("tranquilo, no es para tanto") ni presionar a la '
                'persona a "controlarse". Funciona mejor: hablar con voz calmada y pausada, ponerte a '
                'su altura fisica, validar lo que siente ("entiendo que esto te este afectando"), y '
                'guiarla con instrucciones simples y concretas, como respirar contando hasta cuatro al '
                'inhalar y hasta seis al exhalar.\n\n'
                'Esto es especialmente relevante para el area de Psicologia, que suele ser el punto de '
                'contencion formal, pero tambien para docentes (que enfrentan crisis de estudiantes en '
                'el aula) y para Recursos Humanos (que acompaña a colaboradores tras un incidente '
                'laboral).\n\n'
                'Sabe cuando derivar: si la persona menciona querer hacerse daño, tiene una crisis que '
                'no cede, o el evento fue muy grave (accidente serio, perdida humana), el siguiente '
                'paso es contactar al area de Psicologia o a un profesional de salud mental de forma '
                'inmediata —tu rol es contener en el momento, no reemplazar la atencion '
                'especializada.'
            ),
        },
        {
            'order_index': 5,
            'title': 'Protocolos institucionales de emergencia y comunicación de crisis',
            'duration_min': 10,
            'content': (
                'Saber primeros auxilios no sirve de mucho si la institucion no tiene un protocolo '
                'claro de a quien avisar y en que orden. Una cadena de notificacion tipica funciona '
                'asi: 1) La persona presente en el lugar activa el SOS (verbalmente, por telefono, o '
                'desde la app MediGuard AI). 2) Seguridad/enfermeria de la institucion responde en el '
                'lugar. 3) Recursos Humanos (si involucra a personal) o Direccion Academica (si '
                'involucra estudiantes) recibe el reporte formal. 4) Si es necesario, se contacta a '
                'servicios de emergencia externos (SAMU, bomberos, policia).\n\n'
                'El area de Recursos Humanos tiene un rol clave en documentar el incidente '
                '—que paso, quienes estuvieron involucrados, que acciones se tomaron— tanto por '
                'razones legales como para prevenir que se repita.\n\n'
                'El area de Marketing y Comunicaciones, por su parte, es responsable de que la '
                'informacion que sale de la institucion (a familias, medios, redes sociales) sea '
                'precisa, oportuna y este centralizada en un solo vocero o canal oficial. Durante una '
                'crisis, la informacion contradictoria o los rumores no verificados generan mas daño '
                'que la emergencia misma.\n\n'
                'La app MediGuard AI ayuda a esta coordinacion: cada evento SOS activado queda '
                'registrado con hora, ubicacion aproximada y contactos notificados, sirviendo como '
                'respaldo objetivo del incidente para todas las areas involucradas.'
            ),
        },
        {
            'order_index': 6,
            'title': 'Evaluación final y certificación',
            'duration_min': 8,
            'content': (
                'Has recorrido los fundamentos para responder ante una emergencia dentro de tu '
                'institucion: por que importa actuar rapido, como evaluar la escena y aplicar RCP '
                'basico, como manejar heridas y quemaduras comunes, como brindar apoyo psicologico '
                'inmediato, y como funciona el protocolo institucional de notificacion y '
                'comunicacion.\n\n'
                'Ninguna de estas tecnicas reemplaza la atencion medica o psicologica profesional: '
                'son el puente entre que ocurra la emergencia y que llegue esa ayuda especializada. '
                'Ese puente —los primeros minutos— es exactamente donde tu, sin importar tu area '
                'dentro de la institucion, puedes salvar una vida o evitar que una situacion '
                'empeore.\n\n'
                'Responde el cuestionario final para repasar los puntos clave de cada leccion. Al '
                'completarlo, tu certificado de finalizacion se genera automaticamente en la '
                'plataforma y queda disponible en tu perfil.'
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
            'question': '¿Cuál es la primera acción al encontrar a una persona inconsciente?',
            'options': [
                {'key': 'A', 'text': 'Empezar RCP de inmediato sin evaluar nada más'},
                {'key': 'B', 'text': 'Verificar que la escena sea segura y pedir ayuda antes de actuar'},
                {'key': 'C', 'text': 'Moverla a otro lugar primero'},
                {'key': 'D', 'text': 'Darle agua para que reaccione'},
            ],
            'correct_option': 'B',
            'explanation': 'Evaluar la seguridad de la escena y pedir ayuda evita que te conviertas tú también en víctima y activa la cadena de auxilio antes de iniciar cualquier maniobra.',
        },
        3: {
            'question': '¿Qué debes hacer ante una quemadura leve?',
            'options': [
                {'key': 'A', 'text': 'Aplicar hielo directo sobre la quemadura'},
                {'key': 'B', 'text': 'Aplicar pasta dental o mantequilla'},
                {'key': 'C', 'text': 'Enfriar con agua corriente a temperatura ambiente por varios minutos'},
                {'key': 'D', 'text': 'Reventar las ampollas que se formen'},
            ],
            'correct_option': 'C',
            'explanation': 'El agua corriente a temperatura ambiente reduce el daño en el tejido sin agravarlo. El hielo directo y los remedios caseros retrasan la curación y aumentan el riesgo de infección.',
        },
        4: {
            'question': 'Ante una persona en crisis de ansiedad, ¿cuál es la actitud correcta?',
            'options': [
                {'key': 'A', 'text': 'Decirle que se calme y minimizar lo que siente'},
                {'key': 'B', 'text': 'Escuchar activamente, hablar con voz calmada y acompañarla sin juzgar'},
                {'key': 'C', 'text': 'Dejarla sola hasta que se calme por sí misma'},
                {'key': 'D', 'text': 'Tomar fotos o video para reportar el incidente'},
            ],
            'correct_option': 'B',
            'explanation': 'Validar lo que la persona siente y guiarla con calma (por ejemplo, con respiración pausada) ayuda a contener la crisis. Minimizar o ignorar la situación puede agravarla.',
        },
        5: {
            'question': '¿Cuál es el primer paso correcto del protocolo institucional ante una emergencia?',
            'options': [
                {'key': 'A', 'text': 'Publicarlo de inmediato en redes sociales'},
                {'key': 'B', 'text': 'Activar el SOS y notificar al canal oficial de seguridad definido por la institución'},
                {'key': 'C', 'text': 'Esperar a que otra persona se encargue'},
                {'key': 'D', 'text': 'Comentarlo en un grupo de chat informal antes de avisar a alguien responsable'},
            ],
            'correct_option': 'B',
            'explanation': 'Seguir la cadena de notificación oficial evita confusión, asegura una respuesta coordinada y previene que se difunda información incorrecta antes de confirmar los hechos.',
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
