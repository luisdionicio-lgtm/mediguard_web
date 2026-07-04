# -*- coding: utf-8 -*-
"""
Autenticacion JWT compatible con tokens emitidos por Spring Boot.

Los tokens que genera Spring Boot (login/refresh en usuario/) no incluyen
el claim "user_id" que SimpleJWT espera por defecto (ver USER_ID_CLAIM en
settings.SIMPLE_JWT); en su lugar usan "uid", el mismo claim que Django
agrega a sus propios tokens para que Spring Boot los pueda leer (ver
users/tokens.py:build_token_for_user). Ambos lados ya comparten el mismo
JWT_SECRET (ver .env / application.properties) — lo unico que faltaba era
que Django supiera leer "uid" cuando "user_id" no esta presente.

Para que sea facil de mantener, esta clase NO reimplementa nada de la
verificacion de firma/expiracion/blacklist: solo agrega el claim que falta
y delega el resto al comportamiento estandar de SimpleJWT.
"""
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.settings import api_settings


class SpringCompatibleJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id_claim = api_settings.USER_ID_CLAIM  # 'user_id' por defecto
        if user_id_claim not in validated_token and 'uid' in validated_token:
            validated_token[user_id_claim] = validated_token['uid']
        return super().get_user(validated_token)
