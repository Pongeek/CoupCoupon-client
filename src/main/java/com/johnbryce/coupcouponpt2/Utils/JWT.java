package com.johnbryce.coupcouponpt2.Utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

@Component
public class JWT {

    private static final Logger log = LoggerFactory.getLogger(JWT.class);

    private final SecretKey secretKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JWT(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiration}") long accessTokenExpiration,
            @Value("${jwt.refresh-token-expiration}") long refreshTokenExpiration) {
        this.secretKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    public String generateAccessToken(int userId, String email, String name, String userType) {
        return buildToken(Map.of(
                "id", userId,
                "name", name,
                "userType", userType,
                "tokenType", "ACCESS"
        ), email, accessTokenExpiration);
    }

    public String generateRefreshToken(int userId, String email, String userType) {
        return buildToken(Map.of(
                "id", userId,
                "userType", userType,
                "tokenType", "REFRESH"
        ), email, refreshTokenExpiration);
    }

    private String buildToken(Map<String, Object> claims, String subject, long expiration) {
        Date now = new Date();
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiration))
                .signWith(secretKey)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public int extractUserId(String token) {
        return ((Number) extractAllClaims(token).get("id")).intValue();
    }

    public String extractUserType(String token) {
        return (String) extractAllClaims(token).get("userType");
    }

    public String extractTokenType(String token) {
        return (String) extractAllClaims(token).get("tokenType");
    }

    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.debug("JWT expired: {}", e.getMessage());
        } catch (JwtException e) {
            log.warn("Invalid JWT: {}", e.getMessage());
        }
        return false;
    }

    public boolean isAccessToken(String token) {
        try {
            return "ACCESS".equals(extractTokenType(token));
        } catch (JwtException e) {
            return false;
        }
    }

    public boolean isRefreshToken(String token) {
        try {
            return "REFRESH".equals(extractTokenType(token));
        } catch (JwtException e) {
            return false;
        }
    }
}
