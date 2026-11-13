package com.dmerc12.api.service.impl;

import com.dmerc12.api.config.RateLimitProperties;
import com.dmerc12.api.exception.RateLimitExceededException;
import com.dmerc12.api.service.RateLimitService;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.audit.AuditEvent;
import org.springframework.boot.actuate.audit.AuditEventRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * Implementation of {@link RateLimitService}.
 */
@Slf4j
@Service
public class RateLimitServiceImpl implements RateLimitService {

    private final RateLimitProperties properties;
    private final AuditEventRepository auditEventRepository;
    private final Map<String, Bucket> loginByEmail = new ConcurrentHashMap<>();
    private final Map<String, Bucket> loginByIp = new ConcurrentHashMap<>();
    private final Map<String, Bucket> registerByIp = new ConcurrentHashMap<>();

    /**
     * Constructs a new rate limit service.
     *
     * @param properties the configured capacities and windows
     * @param auditEventRepository the repository used to record {@code RATE_LIMIT_EXCEEDED} events
     */
    public RateLimitServiceImpl(RateLimitProperties properties, AuditEventRepository auditEventRepository) {
        this.properties = properties;
        this.auditEventRepository = auditEventRepository;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void checkLogin(String email, String ipAddress) {
        RateLimitProperties.Login login = properties.getLogin();
        String normalized = normalizeEmail(email);
        consume(
                loginByEmail,
                normalized,
                login.getEmailCapacity(),
                login.getEmailWindowSeconds(),
                "login attempts for this email", normalized, "email"
        );
        consume(
                loginByIp,
                ipAddress,
                login.getIpCapacity(),
                login.getIpWindowSeconds(),
                "login attempts for this IP", "anonymous", "ip"
        );
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void checkRegister(String ipAddress) {
        RateLimitProperties.Register register = properties.getRegister();
        consume(
                registerByIp,
                ipAddress,
                register.getIpCapacity(),
                register.getIpWindowSeconds(),
                "register attempts for this IP", "anonymous", "ip"
        );
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void reset() {
        loginByEmail.clear();
        loginByIp.clear();
        registerByIp.clear();
    }

    private void consume(Map<String, Bucket> buckets, String key, int capacity,
                         long windowSeconds, String description, String auditPrincipal, String limitType) {
        Bucket bucket = buckets.computeIfAbsent(key, k -> newBucket(capacity, windowSeconds));
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (!probe.isConsumed()) {
            long retryAfterSeconds = Math.max(
                    1,
                    TimeUnit.NANOSECONDS.toSeconds(probe.getNanosToWaitForRefill())
            );
            log.warn("Rate limit exceeded: {} (key={})", description, maskKey(key));
            recordRateLimitAudit(auditPrincipal, description, limitType);
            throw new RateLimitExceededException("Too many " + description +
                    ". Please try again later.", retryAfterSeconds);
        }
    }

    private void recordRateLimitAudit(String principal, String description, String limitType) {
        try {
            auditEventRepository.add(new AuditEvent(principal, "RATE_LIMIT_EXCEEDED",
                    Map.of("reason", description, "limitType", limitType)));
        } catch (Exception e) {
            log.error("Failed to record RATE_LIMIT_EXCEEDED audit event", e);
        }
    }

    private Bucket newBucket(int capacity, long windowSeconds) {
        return Bucket.builder()
                .addLimit(limit -> limit.capacity(capacity)
                        .refillGreedy(capacity, Duration.ofSeconds(windowSeconds)))
                .build();
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.toLowerCase(Locale.ROOT).trim();
    }

    /**
     * Partially masks a key before logging.
     * IP addresses and email addresses are personally identifying;
     * full values belong in the audit log, not in warn-level service logs.
     */
    private String maskKey(String key) {
        if (key.isBlank()) {
            return "<empty>";
        }
        if (key.length() <= 4){
            return "***";
        }
        return key.charAt(0) + "***" + key.charAt(key.length() - 1);
    }
}
