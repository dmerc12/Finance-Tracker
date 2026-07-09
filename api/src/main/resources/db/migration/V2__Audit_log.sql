CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    principal VARCHAR(255),
    timestamp TIMESTAMP NOT NULL,
    data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE INDEX idx_audit_principal ON audit_log(principal);
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_ip_address ON audit_log(ip_address);
