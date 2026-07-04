# -*- coding: utf-8 -*-
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken


def build_token_for_user(user):
    """
    Genera refresh + access tokens con claims extendidos compatibles con Spring Boot:
      uid   → UUID del usuario  (Spring Boot lee uid / user_id como fallback)
      sub   → email             (Spring Boot lee sub)
      roles → lista de nombres  (Spring Boot lee roles)
    """
    refresh = RefreshToken.for_user(user)
    roles = list(user.roles.values_list('name', flat=True))

    for token in (refresh, refresh.access_token):
        token['sub'] = user.email
        token['uid'] = str(user.id)
        token['roles'] = roles

    return refresh


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        roles = list(user.roles.values_list('name', flat=True))
        token['sub'] = user.email
        token['uid'] = str(user.id)
        token['roles'] = roles
        return token
