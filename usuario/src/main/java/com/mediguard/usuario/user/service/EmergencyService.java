package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.dto.EmergencyContactRequest;
import com.mediguard.usuario.user.dto.EmergencyContactResponse;
import com.mediguard.usuario.user.dto.EmergencyResponse;
import com.mediguard.usuario.user.dto.SosEventRequest;
import com.mediguard.usuario.user.dto.SosEventResponse;
import com.mediguard.usuario.user.entity.EmergencyContactEntity;
import com.mediguard.usuario.user.entity.EmergencyEntity;
import com.mediguard.usuario.user.entity.SosEventEntity;
import com.mediguard.usuario.user.entity.UserEntity;
import com.mediguard.usuario.user.exception.ApiFieldException;
import com.mediguard.usuario.user.notification.NotificationResult;
import com.mediguard.usuario.user.notification.NotificationService;
import com.mediguard.usuario.user.repository.EmergencyContactRepository;
import com.mediguard.usuario.user.repository.EmergencyRepository;
import com.mediguard.usuario.user.repository.SosEventRepository;
import com.mediguard.usuario.user.repository.UserRepository;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class EmergencyService {

    private final EmergencyRepository emergencyRepository;
    private final EmergencyContactRepository emergencyContactRepository;
    private final SosEventRepository sosEventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public EmergencyService(
            EmergencyRepository emergencyRepository,
            EmergencyContactRepository emergencyContactRepository,
            SosEventRepository sosEventRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.emergencyRepository = emergencyRepository;
        this.emergencyContactRepository = emergencyContactRepository;
        this.sosEventRepository = sosEventRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<EmergencyResponse> getEmergencies() {
        return emergencyRepository.findByActiveTrueOrderByPriorityAscNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private EmergencyResponse toResponse(EmergencyEntity emergency) {
        return new EmergencyResponse(
                emergency.getId(),
                emergency.getName(),
                emergency.getPhone(),
                emergency.getServiceType(),
                emergency.getCountryCode(),
                emergency.getPriority()
        );
    }

    @Transactional(readOnly = true)
    public List<EmergencyContactResponse> getContacts() {
        UserEntity user = currentUser();
        return emergencyContactRepository.findByUser_IdOrderByPrimaryContactDescNameAsc(user.getId())
                .stream()
                .map(this::toContactResponse)
                .toList();
    }

    public EmergencyContactResponse createContact(EmergencyContactRequest request) {
        UserEntity user = currentUser();
        String phone = request.phone().trim();
        if (emergencyContactRepository.existsByUser_IdAndPhone(user.getId(), phone)) {
            throw new ApiFieldException(
                    HttpStatus.BAD_REQUEST,
                    "Error de validación",
                    Map.of("phone", List.of("El teléfono del contacto de emergencia ya está registrado.")));
        }

        EmergencyContactEntity contact = new EmergencyContactEntity();
        contact.setUser(user);
        applyContactRequest(contact, request);
        return toContactResponse(emergencyContactRepository.save(contact));
    }

    public EmergencyContactResponse updateContact(Long id, EmergencyContactRequest request) {
        UserEntity user = currentUser();
        EmergencyContactEntity contact = emergencyContactRepository.findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Contacto de emergencia no encontrado."));
        String phone = request.phone().trim();
        if (emergencyContactRepository.existsByUser_IdAndPhoneAndIdNot(user.getId(), phone, id)) {
            throw new ApiFieldException(
                    HttpStatus.BAD_REQUEST,
                    "Error de validación",
                    Map.of("phone", List.of("El teléfono del contacto de emergencia ya está registrado.")));
        }

        applyContactRequest(contact, request);
        return toContactResponse(emergencyContactRepository.save(contact));
    }

    public void deleteContact(Long id) {
        UserEntity user = currentUser();
        EmergencyContactEntity contact = emergencyContactRepository.findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Contacto de emergencia no encontrado."));
        emergencyContactRepository.delete(contact);
    }

    @Transactional(readOnly = true)
    public List<SosEventResponse> getSosEvents() {
        currentUser();
        return sosEventRepository.findAllByOrderByActivatedAtDesc()
                .stream()
                .map(event -> toSosEventResponse(
                        event,
                        notificationService.summarize(event, contactsFor(event.getUser()))))
                .toList();
    }

    public SosEventResponse createSosEvent(SosEventRequest request) {
        UserEntity user = currentUser();
        SosEventEntity event = new SosEventEntity();
        event.setUser(user);
        applySosEventRequest(event, request, true);
        event.setNotifiedContacts(0);
        event = sosEventRepository.save(event);

        NotificationResult notificationResult = notificationService.notifySos(
                event,
                contactsFor(user));
        event.setNotifiedContacts(notificationResult.notifiedContacts());
        event = sosEventRepository.save(event);
        return toSosEventResponse(event, notificationResult);
    }

    public SosEventResponse updateSosEvent(Long id, SosEventRequest request) {
        currentUser();
        SosEventEntity event = sosEventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Evento SOS no encontrado."));
        if (request.status() != null) {
            event.setStatus(normalizeStatus(request.status()));
        }
        if (request.notes() != null) {
            event.setNotes(request.notes().trim());
        }
        event.resolveIfTerminal();
        event = sosEventRepository.save(event);
        return toSosEventResponse(
                event,
                notificationService.summarize(event, contactsFor(event.getUser())));
    }

    private void applyContactRequest(EmergencyContactEntity contact, EmergencyContactRequest request) {
        contact.setName(request.name().trim());
        contact.setPhone(request.phone().trim());
        contact.setRelationship(normalizeRelationship(request.relationship()));
        contact.setPrimaryContact(Boolean.TRUE.equals(request.primary()));
        contact.setEmail(blankToNull(request.email()));
        contact.setNotes(blankToEmpty(request.notes()));
    }

    private void applySosEventRequest(SosEventEntity event, SosEventRequest request, boolean creating) {
        if (request.status() != null || creating) {
            event.setStatus(normalizeStatus(request.status()));
        }
        if (request.latitude() != null) {
            event.setLatitude(request.latitude());
        }
        if (request.longitude() != null) {
            event.setLongitude(request.longitude());
        }
        if (request.notes() != null) {
            event.setNotes(request.notes());
        }
        if (request.device() != null) {
            event.setDevice(request.device());
        }
        if (request.approximateAddress() != null) {
            event.setApproximateAddress(request.approximateAddress());
        }
    }

    private EmergencyContactResponse toContactResponse(EmergencyContactEntity contact) {
        return new EmergencyContactResponse(
                contact.getId(),
                contact.getName(),
                contact.getPhone(),
                contact.getRelationship(),
                contact.getPrimaryContact(),
                contact.getEmail(),
                contact.getNotes(),
                contact.getCreatedAt(),
                contact.getUpdatedAt());
    }

    private SosEventResponse toSosEventResponse(
            SosEventEntity event,
            NotificationResult notificationResult) {
        return new SosEventResponse(
                event.getId(),
                event.getStatus(),
                event.getLatitude(),
                event.getLongitude(),
                event.getNotes(),
                event.getDevice(),
                event.getApproximateAddress(),
                event.getDurationSeconds(),
                event.getNotifiedContacts(),
                event.getActivatedAt(),
                event.getResolvedAt(),
                event.getUser().getId(),
                event.getLatitude() != null && event.getLongitude() != null,
                notificationResult.contactsFound(),
                notificationResult.notifiableContacts(),
                notificationResult.simulatedContacts(),
                notificationResult.realNotificationEnabled(),
                notificationResult.status(),
                notificationResult.message());
    }

    private List<EmergencyContactEntity> contactsFor(UserEntity user) {
        return emergencyContactRepository.findByUser_IdOrderByPrimaryContactDescNameAsc(user.getId());
    }

    private UserEntity currentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Autenticación requerida.");
        }
        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .filter(user -> Boolean.TRUE.equals(user.getActive()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuario no encontrado."));
    }

    private String normalizeRelationship(String relationship) {
        String normalized = blankToEmpty(relationship).toLowerCase();
        if (normalized.isBlank()) {
            return "otro";
        }
        return switch (normalized) {
            case "familiar", "amigo", "medico", "vecino", "otro" -> normalized;
            default -> throw new ApiFieldException(
                    HttpStatus.BAD_REQUEST,
                    "Error de validación",
                    Map.of("relationship", List.of("La relación del contacto no es válida.")));
        };
    }

    private String normalizeStatus(String status) {
        String normalized = blankToEmpty(status).toLowerCase();
        if (normalized.isBlank()) {
            return SosEventEntity.STATUS_ACTIVE;
        }
        return switch (normalized) {
            case SosEventEntity.STATUS_ACTIVE, SosEventEntity.STATUS_RESOLVED, SosEventEntity.STATUS_FALSE_ALARM -> normalized;
            default -> throw new ApiFieldException(
                    HttpStatus.BAD_REQUEST,
                    "Error de validación",
                    Map.of("status", List.of("Estado de evento SOS inválido.")));
        };
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String blankToEmpty(String value) {
        return value == null ? "" : value.trim();
    }
}
