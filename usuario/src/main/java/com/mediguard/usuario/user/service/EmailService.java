package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.entity.UserEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Envío de correos transaccionales (verificación de email por ahora).
 *
 * Si no hay credenciales SMTP configuradas (app.mail.username vacío), el envío
 * se omite sin lanzar error: así el registro nunca falla por un problema de
 * correo, y los tests/entornos locales sin Gmail configurado siguen
 * funcionando. En producción, basta con definir MAIL_USERNAME y
 * MAIL_APP_PASSWORD en el .env para que el envío real se active.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String frontendBaseUrl;
    private final boolean mailConfigured;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${app.mail.from}") String fromAddress,
            @Value("${app.frontend.base-url}") String frontendBaseUrl,
            @Value("${spring.mail.username:}") String mailUsername) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.frontendBaseUrl = frontendBaseUrl;
        this.mailConfigured = mailUsername != null && !mailUsername.isBlank();
    }

    public void sendVerificationEmail(UserEntity user, String token) {
        if (!mailConfigured) {
            log.warn("SMTP no configurado (MAIL_USERNAME vacío); se omite el correo de verificación para {}",
                    user.getEmail());
            return;
        }

        String verificationLink = frontendBaseUrl + "/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(user.getEmail());
        message.setSubject("Verifica tu cuenta de MediGuard AI");
        message.setText("""
                Hola %s,

                Gracias por registrarte en MediGuard AI. Confirma tu correo entrando a este enlace:

                %s

                Este enlace vence en 24 horas. Si no creaste esta cuenta, ignora este mensaje.
                """.formatted(user.getFirstName(), verificationLink));

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            log.error("No se pudo enviar el correo de verificación a {}: {}", user.getEmail(), ex.getMessage());
        }
    }
}
