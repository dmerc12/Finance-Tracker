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

@Component
public class JpaAuditEventRepository implements AuditEventRepository {

    private final AuditLogRepository repository;

    public JpaAuditEventRepository(AuditLogRepository repository) {
        this.repository = repository;
    }

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

    @Override
    public List<AuditEvent> find(@Nullable String principal, @Nullable Instant after, @Nullable String type) {
        // Implement query logic if needed, otherwise can return empty or use repositry methods.
        return Collections.emptyList();
    }
}
