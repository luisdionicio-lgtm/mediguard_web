package com.mediguard.usuario.aprendizaje.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.mediguard.usuario.aprendizaje.entity.CertificateEntity;
import com.mediguard.usuario.user.entity.UserEntity;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

/**
 * Genera el PDF de un certificado de finalización de curso. No depende de
 * ningún curso en particular: recibe el nombre del usuario, el título del
 * curso y los datos del certificado, así sirve igual para cualquier curso
 * que se agregue al catálogo en el futuro.
 *
 * El diseño (panel lateral oscuro + tarjeta con borde verde + QR de
 * verificación) está adaptado de una maqueta entregada por el equipo. Los
 * colores y posiciones están como constantes al inicio de la clase para que
 * sea fácil ajustar el diseño sin tener que leer toda la lógica de dibujo.
 */
@Service
public class CertificatePdfService {

    // ── Colores ──────────────────────────────────────────────────────────
    private static final float[] NAVY_DARK = rgb(14, 32, 51);
    private static final float[] GREEN = rgb(34, 197, 94);
    private static final float[] TEAL = rgb(20, 184, 166);
    private static final float[] MINT_BG = rgb(213, 250, 230);
    private static final float[] GRAY_BOX = rgb(241, 245, 249);
    private static final float[] NAVY_TEXT = rgb(15, 23, 42);
    private static final float[] GRAY_TEXT = rgb(100, 116, 139);
    private static final float[] WHITE = rgb(255, 255, 255);

    // ── Layout (pt, página A4 horizontal 842x595) ───────────────────────
    private static final float PAGE_W = PDRectangle.A4.getHeight();
    private static final float PAGE_H = PDRectangle.A4.getWidth();
    private static final float MARGIN = 20f;
    private static final float SIDEBAR_W = 170f;
    private static final float PANEL_X = MARGIN + SIDEBAR_W + 10f;
    private static final float PANEL_W = PAGE_W - MARGIN - PANEL_X;
    private static final float INNER_PAD = 30f;

    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("dd/MM/yyyy", new Locale("es", "PE"));

    public byte[] generate(UserEntity user, String courseTitle, CertificateEntity certificate) {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(new PDRectangle(PAGE_W, PAGE_H));
            document.addPage(page);

            String fullName = (user.getFirstName() + " " + user.getLastName()).trim();
            String issuedDate = certificate.getIssuedAt().atZone(ZoneOffset.UTC).format(DATE_FORMAT);
            PDImageXObject qrImage = buildQrImage(document, certificate.getCode());

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                drawSidebar(content);
                drawMainPanel(content, fullName, courseTitle, certificate.getCode(), issuedDate, qrImage);
            }

            ByteArrayOutputStream output = new ByteArrayOutputStream();
            document.save(output);
            return output.toByteArray();
        } catch (IOException ex) {
            throw new IllegalStateException("No se pudo generar el PDF del certificado.", ex);
        }
    }

    // ── Panel lateral oscuro ─────────────────────────────────────────────
    private void drawSidebar(PDPageContentStream content) throws IOException {
        float x = MARGIN;
        float y = MARGIN;
        float w = SIDEBAR_W;
        float h = PAGE_H - 2 * MARGIN;

        fillRect(content, x, y, w, h, NAVY_DARK);

        // Ícono: cuadrado verde con una cruz blanca encima
        float iconSize = 60f;
        float iconX = x + (w - iconSize) / 2;
        float iconY = y + h - 110f;
        fillRoundedRect(content, iconX, iconY, iconSize, iconSize, 14f, GREEN);
        drawCross(content, iconX + iconSize / 2, iconY + iconSize / 2, 17f, 7f, WHITE);

        drawCenteredText(content, PDType1Font.HELVETICA_BOLD, 16, x, x + w, iconY - 28, "MediGuard AI", WHITE);
        drawCenteredText(content, PDType1Font.HELVETICA, 9, x, x + w, iconY - 44, "Formación institucional", WHITE);

        // Lista de valores (bullets)
        String[] bullets = { "Preparación", "Comunidad", "Confianza" };
        float bulletY = y + 175f;
        for (String bullet : bullets) {
            fillCircle(content, x + 36, bulletY + 3, 3f, GREEN);
            drawText(content, PDType1Font.HELVETICA, 11, x + 48, bulletY, bullet, WHITE);
            bulletY -= 30f;
        }
    }

    // ── Panel principal (tarjeta blanca con borde verde) ────────────────
    private void drawMainPanel(
            PDPageContentStream content,
            String fullName,
            String courseTitle,
            String code,
            String issuedDate,
            PDImageXObject qrImage) throws IOException {
        float x = PANEL_X;
        float y = MARGIN;
        float w = PANEL_W;
        float h = PAGE_H - 2 * MARGIN;
        float top = y + h;

        fillRoundedRect(content, x, y, w, h, 18f, WHITE);
        strokeRoundedRect(content, x, y, w, h, 18f, GREEN, 2.2f);

        float innerX = x + INNER_PAD;
        float innerRight = x + w - INNER_PAD;
        float innerW = innerRight - innerX;

        // Etiqueta superior
        float labelBarY = top - 55f;
        fillRect(content, x + 6, labelBarY, w - 12, 32f, MINT_BG);
        drawText(content, PDType1Font.HELVETICA_BOLD, 9, innerX, labelBarY + 12, "CERTIFICADO INSTITUCIONAL", TEAL);

        // Título
        float titleY = top - 110f;
        drawText(content, PDType1Font.HELVETICA_BOLD, 26, innerX, titleY, "Certificado de Finalización", NAVY_TEXT);
        fillRect(content, innerX, titleY - 14, 90f, 4f, GREEN);
        fillRect(content, innerX + 96, titleY - 14, 55f, 4f, TEAL);

        // "Se certifica que" + nombre
        float certifyY = titleY - 60f;
        drawCenteredText(content, PDType1Font.HELVETICA, 12, innerX, innerRight, certifyY, "Se certifica que", GRAY_TEXT);

        float nameY = certifyY - 42f;
        drawCenteredText(content, PDType1Font.HELVETICA_BOLD, 24, innerX, innerRight, nameY, fullName, NAVY_TEXT);
        float nameWidth = PDType1Font.HELVETICA_BOLD.getStringWidth(fullName) / 1000 * 24;
        fillRect(content, innerX + (innerW - nameWidth) / 2, nameY - 12, nameWidth, 3f, MINT_BG);

        // "ha completado..." + caja del curso
        float courseLabelY = nameY - 38f;
        drawCenteredText(content, PDType1Font.HELVETICA, 12, innerX, innerRight, courseLabelY,
                "ha completado satisfactoriamente el curso", GRAY_TEXT);

        List<String> courseLines = wrapText(courseTitle, PDType1Font.HELVETICA_BOLD, 15, innerW - 40);
        float boxHeight = 24f + courseLines.size() * 19f;
        float boxY = courseLabelY - 22 - boxHeight;
        fillRoundedRect(content, innerX, boxY, innerW, boxHeight, 10f, MINT_BG);
        float lineY = boxY + boxHeight - 28f;
        for (String line : courseLines) {
            drawCenteredText(content, PDType1Font.HELVETICA_BOLD, 15, innerX, innerRight, lineY, line, NAVY_TEXT);
            lineY -= 19f;
        }

        // Firmas
        float signLineY = boxY - 35f;
        float colWidth = innerW / 2 - 10;
        fillRect(content, innerX, signLineY, colWidth, 1f, GRAY_TEXT);
        fillRect(content, innerX + colWidth + 20, signLineY, colWidth, 1f, GRAY_TEXT);

        drawCenteredText(content, PDType1Font.HELVETICA_BOLD, 11, innerX, innerX + colWidth, signLineY - 18,
                "Coordinación académica", NAVY_TEXT);
        drawCenteredText(content, PDType1Font.HELVETICA, 9, innerX, innerX + colWidth, signLineY - 32,
                "Validación del curso", GRAY_TEXT);

        float col2X = innerX + colWidth + 20;
        drawCenteredText(content, PDType1Font.HELVETICA_BOLD, 11, col2X, col2X + colWidth, signLineY - 18,
                "MediGuard AI", NAVY_TEXT);
        drawCenteredText(content, PDType1Font.HELVETICA, 9, col2X, col2X + colWidth, signLineY - 32,
                "Plataforma institucional", GRAY_TEXT);

        // Caja gris: fecha + código, y QR a la derecha
        float qrSize = 78f;
        float infoBoxY = y + 22f;
        float infoBoxH = 70f;
        float infoBoxW = innerW - qrSize - 24;
        fillRoundedRect(content, innerX, infoBoxY, infoBoxW, infoBoxH, 8f, GRAY_BOX);

        drawText(content, PDType1Font.HELVETICA_BOLD, 8, innerX + 16, infoBoxY + infoBoxH - 24, "EMITIDO EL", GRAY_TEXT);
        drawText(content, PDType1Font.HELVETICA_BOLD, 12, innerX + 16, infoBoxY + infoBoxH - 42, issuedDate, NAVY_TEXT);

        float codeColX = innerX + infoBoxW * 0.42f;
        drawText(content, PDType1Font.HELVETICA_BOLD, 8, codeColX, infoBoxY + infoBoxH - 24, "CÓDIGO DE VERIFICACIÓN", GRAY_TEXT);
        List<String> codeLines = wrapMonospace(code, 7.5f, infoBoxW - (codeColX - innerX) - 16);
        float codeLineY = infoBoxY + infoBoxH - 38;
        for (String line : codeLines) {
            drawText(content, PDType1Font.HELVETICA, 7.5f, codeColX, codeLineY, line, GRAY_TEXT);
            codeLineY -= 11f;
        }

        if (qrImage != null) {
            float qrX = innerX + infoBoxW + 24;
            content.drawImage(qrImage, qrX, infoBoxY + (infoBoxH - qrSize) / 2 + 8, qrSize, qrSize);
            drawCenteredText(content, PDType1Font.HELVETICA, 7, qrX - 10, qrX + qrSize + 10,
                    infoBoxY + (infoBoxH - qrSize) / 2 - 4, "Código QR de verificación", GRAY_TEXT);
        }

        drawCenteredText(content, PDType1Font.HELVETICA_OBLIQUE, 9, innerX, innerRight, y + 6,
                "Proyecto Integrador — TECSUP 2026", GRAY_TEXT);
    }

    private PDImageXObject buildQrImage(PDDocument document, String content) throws IOException {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(content, BarcodeFormat.QR_CODE, 300, 300);
            BufferedImage image = MatrixToImageWriter.toBufferedImage(matrix);
            return LosslessFactory.createFromImage(document, image);
        } catch (WriterException ex) {
            return null;
        }
    }

    private void drawCross(PDPageContentStream content, float centerX, float centerY, float arm, float thickness, float[] color)
            throws IOException {
        fillRect(content, centerX - thickness / 2, centerY - arm, thickness, arm * 2, color);
        fillRect(content, centerX - arm, centerY - thickness / 2, arm * 2, thickness, color);
    }

    private List<String> wrapText(String text, PDFont font, float fontSize, float maxWidth) throws IOException {
        List<String> lines = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        for (String word : text.split(" ")) {
            String candidate = current.isEmpty() ? word : current + " " + word;
            if (font.getStringWidth(candidate) / 1000 * fontSize > maxWidth && !current.isEmpty()) {
                lines.add(current.toString());
                current = new StringBuilder(word);
            } else {
                current = new StringBuilder(candidate);
            }
        }
        if (!current.isEmpty()) {
            lines.add(current.toString());
        }
        return lines;
    }

    private List<String> wrapMonospace(String text, float fontSize, float maxWidth) throws IOException {
        return wrapText(text, PDType1Font.HELVETICA, fontSize, maxWidth);
    }

    private void drawText(PDPageContentStream content, PDFont font, float size, float x, float y, String text, float[] color)
            throws IOException {
        content.beginText();
        content.setFont(font, size);
        content.setNonStrokingColor(color[0], color[1], color[2]);
        content.newLineAtOffset(x, y);
        content.showText(text);
        content.endText();
    }

    private void drawCenteredText(
            PDPageContentStream content, PDFont font, float size, float left, float right, float y, String text, float[] color)
            throws IOException {
        float textWidth = font.getStringWidth(text) / 1000 * size;
        float x = left + ((right - left) - textWidth) / 2;
        drawText(content, font, size, x, y, text, color);
    }

    private void fillRect(PDPageContentStream content, float x, float y, float w, float h, float[] color) throws IOException {
        content.setNonStrokingColor(color[0], color[1], color[2]);
        content.addRect(x, y, w, h);
        content.fill();
    }

    private void fillCircle(PDPageContentStream content, float cx, float cy, float r, float[] color) throws IOException {
        content.setNonStrokingColor(color[0], color[1], color[2]);
        float k = 0.5523f * r;
        content.moveTo(cx - r, cy);
        content.curveTo(cx - r, cy + k, cx - k, cy + r, cx, cy + r);
        content.curveTo(cx + k, cy + r, cx + r, cy + k, cx + r, cy);
        content.curveTo(cx + r, cy - k, cx + k, cy - r, cx, cy - r);
        content.curveTo(cx - k, cy - r, cx - r, cy - k, cx - r, cy);
        content.fill();
    }

    private void fillRoundedRect(PDPageContentStream content, float x, float y, float w, float h, float r, float[] color)
            throws IOException {
        content.setNonStrokingColor(color[0], color[1], color[2]);
        roundedRectPath(content, x, y, w, h, r);
        content.fill();
    }

    private void strokeRoundedRect(
            PDPageContentStream content, float x, float y, float w, float h, float r, float[] color, float lineWidth)
            throws IOException {
        content.setStrokingColor(color[0], color[1], color[2]);
        content.setLineWidth(lineWidth);
        roundedRectPath(content, x, y, w, h, r);
        content.stroke();
    }

    private void roundedRectPath(PDPageContentStream content, float x, float y, float w, float h, float r) throws IOException {
        float k = 0.5523f * r;
        content.moveTo(x + r, y);
        content.lineTo(x + w - r, y);
        content.curveTo(x + w - r + k, y, x + w, y + r - k, x + w, y + r);
        content.lineTo(x + w, y + h - r);
        content.curveTo(x + w, y + h - r + k, x + w - r + k, y + h, x + w - r, y + h);
        content.lineTo(x + r, y + h);
        content.curveTo(x + r - k, y + h, x, y + h - r + k, x, y + h - r);
        content.lineTo(x, y + r);
        content.curveTo(x, y + r - k, x + r - k, y, x + r, y);
        content.closePath();
    }

    private static float[] rgb(int r, int g, int b) {
        return new float[] { r / 255f, g / 255f, b / 255f };
    }
}
