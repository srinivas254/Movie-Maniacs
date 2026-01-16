package com.taskforge.backend.config;

import com.taskforge.backend.entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


@Component
public class JwtUtil {
    private final SecretKey key;
    private final long expirationTime;


    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expirationTime}") long expirationTime){
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationTime = expirationTime;
    }

    public String generateToken(String id,String userName, Role role){
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", id);
        claims.put("userName", userName);
        claims.put("role", role.name());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key,SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getUserName(Claims claims){
        return claims.get("userName").toString();
    }

    public String getUserId(Claims claims){
        return claims.get("id").toString();
    }

    public String getUserRole(Claims claims){
        return claims.get("role").toString();
    }

}
