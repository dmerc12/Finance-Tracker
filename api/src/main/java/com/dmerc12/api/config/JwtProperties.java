package com.dmerc12.api.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for JWT authentication
 * <p>Binds properties prefixed with {@code jwt} from {@code application.yml}
 * <p>These properties are used by the JWT service to:
 * <ul>
 *     <li>Sign and validate JWT tokens using the configured secret</li>
 *     <li>Set token expiration time</li>
 * </ul>
 * <p><b>Security Note:</b>
 * <ul>
 *     <li>The secret should be at least 256 bits (32 characters) for HS256</li>
 *     <li>In production, use environment variables or a secret manager</li>
 *     <li>Never commit the actual secret to version control</li>
 * </ul>
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * The secret key used for signing JWT tokens.
     * <p>Should be at least 256 bits (32 characters) for HS256 algorithm.
     * <p>Default value is provided via {@code JWT_SECRET} environment variable
     * or fallback to {@code defaultSecurityKeyForDevOnly} for development.
     */
    private String secret;

    /**
     * The expiration time for JWT tokens in milliseconds.
     * <p>Default is 86400000 (24 hours).
     * <p>When a token expires, the user must re-authenticate to obtain a new one.
     */
    private long expiration;
}
