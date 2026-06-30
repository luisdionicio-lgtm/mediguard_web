package com.mediguard.usuario.user.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * El envío de correo es best-effort: el token ya quedó persistido antes de llamar
 * a este servicio, y el controlador nunca debe revelar si el envío falló o si el
 * correo existe en el sistema (evita enumeración de cuentas).
 */
@Service
public class PasswordResetMailService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetMailService.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String resetUrlBase;

    public PasswordResetMailService(
            JavaMailSender mailSender,
            @Value("${app.mail.from:no-reply@mediguard.local}") String fromAddress,
            @Value("${app.frontend.reset-password-url:http://localhost:5173/reset-password}") String resetUrlBase) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.resetUrlBase = resetUrlBase;
    }

    public void sendPasswordResetEmail(String toEmail, String firstName, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("MediGuard AI — Restablece tu contraseña");
        message.setText(buildBody(firstName, token));

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            log.warn("No se pudo enviar el correo de restablecimiento de contraseña.", ex);
        }
    }

    private String buildBody(String firstName, String token) {
        String link = resetUrlBase + "?token=" + token;
        return """
                Hola %s,

                Recibimos una solicitud para restablecer tu contraseña en MediGuard AI.
                Si fuiste tú, usa el siguiente enlace (válido por 1 hora):

                %s

                Si no solicitaste esto, ignora este correo.
                """.formatted(firstName, link);
    }
}
