package com.dmerc12.api.audit;

import com.dmerc12.api.entity.AuditLog;
import com.dmerc12.api.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.jspecify.annotations.Nullable;
import org.springframework.boot.actuate.audit.AuditEvent;
import org.springframework.boot.actuate.audit.AuditEventRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

/**
 * JPA-based implementation of Spring Boot's {@link AuditEventRepository}.
 * <p>This repository persists audit events to the database using JPA,
 * providing a persistent audit trail for security and compliance purposes.
 * <p>Each audit event is stored in the {@code audit_log} table as an {@link AuditLog} entity.
 * This implementation captures additional request context such as the client's IP address and
 * User-Agent header for enhanced security auditing.
 * <p>The repository is registered as a Spring {@link Component} and automatically replaces the default
 * in-memory audit repository provided by Spring Boot Actuator.
 *
 * @see AuditLog
 * @see AuditEvent
 * @see AuditLogRepository
 * @see AuditEventRepository
 */
@Component
public class JpaAuditEventRepository implements AuditEventRepository {

    private final AuditLogRepository repository;

    /**
     * Constructs a new JPA audit event repository with the specified {@link AuditLogRepository}.
     *
     * @param repository the JPA repository used to persist audit log entities
     */
    public JpaAuditEventRepository(AuditLogRepository repository) {
        this.repository = repository;
    }

    /**
     * Persists an audit event to the database.
     * <p>This method converts the provided {@link AuditEvent} into an {@link AuditLog} entity and
     * saves it using the {@link AuditLogRepository}.
     * <p>In addition to the event data, this method captures:
     * <ul>
     *     <li>The client's IP address from the current HTTP request</li>
     *     <li>The User-Agent header from the current HTTP request</li>
     * </ul>
     * <p>If no HTTP request context is available (e.g., during application startup),
     * the IP address and User-Agent will remain {@code null}.
     *
     * @param event the audit event to persist
     */
    @Override
    public void add(AuditEvent event) {
        AuditLog log = new AuditLog();
        log.setEventType(event.getType());
        log.setPrincipal(event.getPrincipal());
        log.setTimestamp(event.getTimestamp());
        log.setData(event.getData());
        // Capture request context (IP, User-Agent)
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            log.setIpAddress(request.getRemoteAddr());
            log.setUserAgent(request.getHeader("User-Agent"));
        }
        repository.save(log);
    }

    /**
     * Queries audit events based on optional filters.
     * <p>Currently, this method returns an empty list as a placeholder implementation.
     * Future enhancements may include querying the database for specific audit events based on principal,
     * time range, or event type.
     * <p>When implemented, this method will be used to retrieve audit history for compliance reporting,
     * security investigations, and the {@code /acuator/auditevents} endpoint.
     *
     * @param principal the username to filter events by (may be {@code null})
     * @param after the earliest timestamp to include (may be {@code null})
     * @param type the event type to filter by (may be {@code null})
     * @return a list of matching audit events, currently always empty
     */
    @Override
    public List<AuditEvent> find(@Nullable String principal, @Nullable Instant after, @Nullable String type) {
        // TODO: Implement query logic for the /acuator/auditevents endpoint
        // Implement query logic if needed, otherwise can return empty or use repositry methods.
        return Collections.emptyList();
    }
}
