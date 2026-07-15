package com.dmerc12.api.unit.entity;

import com.dmerc12.api.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "test_entities")
public class TestEntity extends BaseEntity {
    private String name;
}
