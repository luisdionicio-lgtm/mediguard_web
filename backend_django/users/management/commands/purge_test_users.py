# -*- coding: utf-8 -*-
from django.conf import settings
from django.contrib.sessions.models import Session
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.db.models.deletion import PROTECT, RESTRICT, SET_NULL, CASCADE, DO_NOTHING
from django.utils import timezone

from users.models import Rol, Usuario


ON_DELETE_LABELS = {
    CASCADE: 'CASCADE: se eliminaria',
    PROTECT: 'PROTECT: bloquearia borrado',
    RESTRICT: 'RESTRICT: bloquearia borrado',
    SET_NULL: 'SET_NULL: quedaria sin usuario',
    DO_NOTHING: 'DO_NOTHING: podria quedar afectado',
}


class Command(BaseCommand):
    help = 'Limpia usuarios de prueba por email con dry-run seguro por defecto.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--emails',
            nargs='+',
            required=True,
            help='Lista de emails de usuarios de prueba a revisar o eliminar.',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Muestra lo que se haria sin borrar. Es el comportamiento por defecto.',
        )
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Ejecuta el borrado real. Sin esta bandera, no se borra nada.',
        )
        parser.add_argument(
            '--allow-production',
            action='store_true',
            help='Permite ejecutar con DEBUG=False. Usar solo con revision explicita.',
        )
        parser.add_argument(
            '--include-staff',
            action='store_true',
            help='Permite incluir usuarios staff/superuser. Nunca borra el ultimo superusuario.',
        )

    def handle(self, *args, **options):
        emails = [email.strip().lower() for email in options['emails'] if email.strip()]
        if not emails:
            raise CommandError('Debes proporcionar al menos un email valido en --emails.')

        confirm = options['confirm']
        dry_run = not confirm or options['dry_run']

        if confirm and options['dry_run']:
            raise CommandError('No combines --confirm con --dry-run.')

        if not settings.DEBUG and not options['allow_production']:
            raise CommandError('Bloqueado: DEBUG=False. Usa --allow-production solo si entiendes el riesgo.')

        users = list(Usuario.objects.filter(email__in=emails).order_by('email'))
        found_emails = {user.email.lower() for user in users}
        missing_emails = [email for email in emails if email not in found_emails]

        self.stdout.write(self.style.WARNING('Modo: DRY-RUN. No se borrara nada.') if dry_run else self.style.ERROR('Modo: CONFIRMADO. Se borraran usuarios permitidos.'))
        self.stdout.write('')

        if missing_emails:
            self.stdout.write(self.style.WARNING('Emails no encontrados:'))
            for email in missing_emails:
                self.stdout.write(f'  - {email}')
            self.stdout.write('')

        if not users:
            self.stdout.write('No hay usuarios encontrados para procesar.')
            return

        active_session_user_ids = self.get_active_session_user_ids()
        superuser_count = self.superuser_queryset().count()
        users_to_delete = []

        for user in users:
            self.print_user_report(user)
            self.validate_user_can_be_deleted(
                user=user,
                include_staff=options['include_staff'],
                active_session_user_ids=active_session_user_ids,
                superuser_count=superuser_count,
            )
            users_to_delete.append(user)

        if dry_run:
            self.stdout.write('')
            self.stdout.write(self.style.SUCCESS('Dry-run finalizado. Agrega --confirm para borrar realmente.'))
            return

        with transaction.atomic():
            for user in users_to_delete:
                email = user.email
                user.delete()
                self.stdout.write(self.style.SUCCESS(f'Usuario eliminado: {email}'))

    def validate_user_can_be_deleted(self, user, include_staff, active_session_user_ids, superuser_count):
        if str(user.pk) in active_session_user_ids:
            raise CommandError(f'Bloqueado: {user.email} tiene una sesion activa detectada.')

        if (user.is_staff or user.is_superuser) and not include_staff:
            raise CommandError(
                f'Bloqueado: {user.email} es staff/superuser. Usa --include-staff si realmente corresponde.'
            )

        if user.is_superuser and superuser_count <= 1:
            raise CommandError(f'Bloqueado: {user.email} es el ultimo superusuario.')

    def print_user_report(self, user):
        self.stdout.write(self.style.MIGRATE_HEADING(f'Usuario encontrado: {user.email}'))
        self.stdout.write(f'  id: {user.id}')
        self.stdout.write(f'  nombre: {user.get_full_name()}')
        self.stdout.write(f'  is_active: {user.is_active}')
        self.stdout.write(f'  is_staff: {user.is_staff}')
        self.stdout.write(f'  is_superuser: {user.is_superuser}')
        self.stdout.write('  Relaciones relacionadas:')

        relations = self.get_relation_report(user)
        if not relations:
            self.stdout.write('    - Sin relaciones relacionadas detectadas.')
        else:
            for relation in relations:
                self.stdout.write(
                    f"    - {relation['model']} via {relation['accessor']}: "
                    f"{relation['count']} registro(s), {relation['on_delete']}"
                )
        self.stdout.write('')

    def get_relation_report(self, user):
        relations = []
        for relation in user._meta.related_objects:
            accessor = relation.get_accessor_name()
            if not accessor:
                continue

            related = getattr(user, accessor, None)
            if related is None:
                continue

            if not relation.related_model._meta.managed:
                count = 'no calculado (modelo no administrado por Django)'
            else:
                try:
                    count = related.count()
                except TypeError:
                    count = 1 if related is not None else 0

            if count == 0:
                continue

            on_delete = ON_DELETE_LABELS.get(relation.on_delete, getattr(relation.on_delete, '__name__', 'desconocido'))
            relations.append({
                'model': relation.related_model._meta.label,
                'accessor': accessor,
                'count': count,
                'on_delete': on_delete,
            })
        return relations

    def get_active_session_user_ids(self):
        active_user_ids = set()
        for session in Session.objects.filter(expire_date__gte=timezone.now()):
            user_id = session.get_decoded().get('_auth_user_id')
            if user_id:
                active_user_ids.add(str(user_id))
        return active_user_ids

    def superuser_queryset(self):
        return Usuario.objects.filter(roles__name=Rol.Nombre.ADMIN).distinct()
