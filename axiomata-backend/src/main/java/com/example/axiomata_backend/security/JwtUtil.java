package com.example.axiomata_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    private final Key key;

    @Value("${jwt.expiration:86400000}") // Default to 24 hours
    private long expiration;

    // Read jwt.secret from application.properties
    public JwtUtil(@Value("${jwt.secret}") String secret) {
        // Use a Base64-decoded key from properties
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        // creates a proper Key object for JWT
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // Generate JWT token for a username
    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setSubject(username)         // "sub" claim
                .setIssuedAt(now)             // "iat" claim
                .setExpiration(expiryDate)    // "exp" claim
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // extract username from JWT token - reads "sub" claim
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // extract expiration date from JWT token - reads "exp" claim
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Generic method to extract any claim using a claims resolver function
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Parse the token and extract all claims - throws exceptions if token is invalid
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Validate JWT token - only check structure & expiration
    public boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // MVP version - validate token against username and expiration
    public boolean validateToken(String token, String username) {
        String tokenUsername = extractUsername(token);
        return tokenUsername.equals(username) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

}
