package com.dmerc12.api.entity;

import com.dmerc12.api.audit.JpaAuditEventRepository;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.boot.actuate.audit.AuditEvent;

import java.time.Instant;
import java.util.Map;

/**
 * Represents an audit log entry for tracking security and system events.
 * <p>This entity stores detailed audit records for compliance, security monitoring, and forensic analysis.
 * Each entry captures:
 * <ul>
 *     <li>The type of event that occurred</li>
 *     <li>Which user (principal) performed the action</li>
 *     <li>When the event happened</li>
 *     <li>Additional context data in JSON format</li>
 *     <li>Request metadata (IP address and user agent)</li>
 * </ul>
 * <p>Audit logs are stored in the {@code audit_log} table and are used by the {@link JpaAuditEventRepository}
 * to persist Spring Security audit events.
 * <p>The {@code data} field uses PostgreSQL's JSONB type (via Hibernate's {@link JdbcTypeCode})
 * to store flexible, structured event details.
 *
 * @see JpaAuditEventRepository
 * @see AuditEvent
 */
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "audit_log")
public class AuditLog {

    /**
     * The primary key identifier for the audit entry.
     * Generated automatically using database identity column.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The type of audit event (e.g., "AUTHENTICATION_SUCCESS", "ACCESS_DENIED").
     * This is a required field and maps to {@code event_type} in the database.
     */
    @Column(name = "event_type", nullable = false)
    private String eventType;

    /**
     * The username or principal that performs the action.
     * May be {@code null} for anonymous or system events.
     */
    private String principal;

    /**
     * The timestamp when the event occurred.
     * This is a required field and maps to {@code timestamp} in the database.
     * Stored as {@link Instant} for precise time tracking.
     */
    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    /**
     * Additional event-specific data stored as a JSON map.
     * <p>Uses PostgreSQL's JSONB type for flexible, queryable JSON storage.
     * This field can contain arbitrary key-value pairs such as:
     * <ul>
     *     <li>Request URI</li>
     *     <li>HTTP method</li>
     *     <li>Error messages</li>
     *     <li>Custom event properties</li>
     * </ul>
     */
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> data;

    /**
     * The IP address of the client that initiated the event.
     * Used for security analysis and fraud detection.
     */
    @Column(name = "ip_address")
    private String ipAddress;

    /**
     * The User-Agent header from the client request.
     * Provides information about the client application, browser, and operating system.
     */
    @Column(name = "user_agent")
    private String userAgent;
}
