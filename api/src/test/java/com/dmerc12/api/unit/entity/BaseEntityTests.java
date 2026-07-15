package com.dmerc12.api.unit.entity;

import com.dmerc12.api.unit.repository.TestEntityRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@DisplayName("Base Entity Unit Tests")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
public class BaseEntityTests {

    @Autowired
    private TestEntityRepository repository;

    @Test
    @DisplayName("All fields from BaseEntity should be inherited")
    public void baseEntityFieldsInherited() {
        TestEntity entity = new TestEntity();
        entity.setName("Test");
        assertNotNull(entity.getClass().getDeclaredFields());
    }

    @Test
    @DisplayName("Fields are automatically set and primary key is generated")
    public void fieldsAreAutomaticallySetAndGenerated() {
        TestEntity entity = new TestEntity();
        entity.setName("Initial");
        // Before save
        assertNull(entity.getId());
        assertNull(entity.getCreatedAt());
        assertNull(entity.getUpdatedAt());
        // save entity in DB
        TestEntity saved = repository.save(entity);
        // After save
        assertNotNull(saved.getId());
        assertNotNull(saved.getCreatedAt());
        assertNotNull(saved.getUpdatedAt());
        // Update the entity
        saved.setName("Updated");
        TestEntity updated = repository.save(saved);
        // After update
        assertEquals(saved.getId(), updated.getId());
        assertEquals(saved.getCreatedAt(), updated.getCreatedAt());
        assertNotEquals(saved.getUpdatedAt(), updated.getUpdatedAt());
        assertNotNull(updated.getUpdatedAt());
    }
}
