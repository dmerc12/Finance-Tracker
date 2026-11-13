package com.dmerc12.api.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for rate limiting.
 *
 * <p>Binds properties prefixed with {@code rate-limit} from {@code application.yml}.
 * Values are overridable in tests via {@code @TestPropertySource}
 * so the throttle can be exercised with small capacities.
 *
 * <p><b>Defaults:</b>
 * <ul>
 *     <li>Login per email: 5 attempts per 15 minutes</li>
 *     <li>Login per IP: 20 attempts per 15 minutes</li>
 *     <li>Register per IP: 5 attempts per hour</li>
 * </ul>
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "rate-limit")
public class RateLimitProperties {

    private Login login = new Login();
    private Register register = new Register();

    /**
     * Rate limits applied to login endpoint.
     */
    @Getter
    @Setter
    public static class Login {

        /**
         * Maximum login attempts per email address within the window.
         */
        private int emailCapacity = 5;

        /**
         * Length of the per-email window, in seconds.
         */
        private long emailWindowSeconds = 900;

        /**
         * Maximum login attempts per client IP within the window.
         */
        private int ipCapacity = 20;

        /**
         * Length of the per-IP window, in seconds.
         */
        private long ipWindowSeconds = 900;
    }

    /**
     * Rate limits applied to the registration endpoint.
     */
    @Getter
    @Setter
    public static class Register {

        /**
         * Maximum registration attempts per client IP within the window.
         */
        private int ipCapacity = 5;

        /**
         * Length of the per-IP window, in seconds.
         */
        private long ipWindowSeconds = 3600;
    }
}
