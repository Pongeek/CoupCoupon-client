package com.johnbryce.coupcouponpt2.Security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            throw new SecurityException("No authenticated user found");
        }
        return (UserPrincipal) auth.getPrincipal();
    }

    public static int getCurrentUserId() {
        return getCurrentUser().getId();
    }
}
