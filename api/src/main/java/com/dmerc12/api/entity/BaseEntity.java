package com.dmerc12.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Abstract base class for all JPA entities in the application.
 * <p>This class provides common fields and auditing capabilities that are automatically
 * inherited by all concrete entity classes.
 * <p>It uses JPA's {@link MappedSuperclass} so that each subclass maps its own table but includes these columns.
 * The {@link EntityListeners} annotation enables automatic population of {@code createdAt} and {@code updatedAt}
 * via Spring Data JPA auditing.
 */
@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    /**
     * The primary key identifier for the entity.
     * Generated automatically using the database's identity column (auto-increment).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The timestamp when this entity was first created.
     * <p>Automatically set by Spring Data auditing before the entity is persisted.
     * This field is immutable after creation.
     */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * The timestamp when this entity was last updated.
     * <p>Automatically updated by Spring Data auditing every time the entity is modified and saved.
     * It is updated on each {@code merge} or {@code save} operation.
     */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
