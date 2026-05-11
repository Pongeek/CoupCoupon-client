package com.johnbryce.coupcouponpt2.Security;

import com.johnbryce.coupcouponpt2.Utils.JWT;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JWT jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token) || !jwtUtil.isAccessToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Claims claims = jwtUtil.extractAllClaims(token);
            String email = claims.getSubject();
            String userType = (String) claims.get("userType");
            int userId = ((Number) claims.get("id")).intValue();

            UserPrincipal principal = new UserPrincipal(userId, email, userType);
            List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(userType));

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(principal, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception e) {
            log.warn("Failed to set authentication from JWT: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
