package com.autocare.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.autocare.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String SECRET =
            "AutoCareSuperSecretKeyForJWTAuthentication2026";

    private final SecretKey key = Keys.hmacShaKeyFor(
            SECRET.getBytes(StandardCharsets.UTF_8)
    );

    // ========================================
    // GENERATE TOKEN
    // ========================================

    public String generateToken(User user) {

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("role", user.getRole())
                .claim("name", user.getName())
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + (24 * 60 * 60 * 1000L)
                        )
                )
                .signWith(key)
                .compact();
    }

    // ========================================
    // EXTRACT EMAIL
    // ========================================

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    // ========================================
    // EXTRACT ROLE
    // ========================================

    public String extractRole(String token) {
        return extractClaims(token)
                .get("role", String.class);
    }

    // ========================================
    // EXTRACT USER ID
    // ========================================

    public Long extractUserId(String token) {

        Number userId = extractClaims(token)
                .get("userId", Number.class);

        return userId != null
                ? userId.longValue()
                : null;
    }

    // ========================================
    // VALIDATE TOKEN
    // ========================================

    public boolean isTokenValid(String token) {

        try {

            Claims claims = extractClaims(token);

            return claims.getExpiration()
                    .after(new Date());

        } catch (Exception e) {

            return false;
        }
    }

    // ========================================
    // READ TOKEN
    // ========================================

    private Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}