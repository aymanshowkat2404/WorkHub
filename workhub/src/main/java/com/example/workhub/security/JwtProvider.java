package com.example.workhub.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import com.example.workhub.model.User;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtProvider.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expirationInMs}")
    private int jwtExpirationInMs;

    @Value("${app.jwt.refreshSecret}")
    private String refreshSecret;

    @Value("${app.jwt.refreshExpirationInMs}")
    private int refreshExpirationInMs;

    // === ACCESS TOKEN ===
    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return generateTokenWithUserId(userPrincipal.getId());
    }

    public String generateTokenForUser(User user) {
        return generateTokenWithUserId(user.getId());
    }

    private String generateTokenWithUserId(Long userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(Long.toString(userId))
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(jwtSecret), SignatureAlgorithm.HS512)
                .compact();
    }

    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey(jwtSecret))
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String token) {
        return validate(token, jwtSecret);
    }

    // === REFRESH TOKEN ===
    public String generateRefreshToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshExpirationInMs);

        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(refreshSecret), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getEmailFromRefreshToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey(refreshSecret))
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateRefreshToken(String token) {
        return validate(token, refreshSecret);
    }

    // === COMMON ===
    private boolean validate(String token, String secret) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey(secret)).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            logger.error("Expired JWT token");
        } catch (MalformedJwtException e) {
            logger.error("Malformed JWT token");
        } catch (UnsupportedJwtException e) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException e) {
            logger.error("Empty JWT claims");
        }
        return false;
    }

    private Key getSigningKey(String secret) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
