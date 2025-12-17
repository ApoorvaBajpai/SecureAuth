package com.example.jwt_auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private final String SECRET_KEY = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM123456";

    public String generateAccessToken(String userId) {
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 30 * 60 * 1000)) // 30 min
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public String generateIdToken(User user) {
    return Jwts.builder()
            .setSubject(user.getId())
            .claim("name", user.getName())
            .claim("email", user.getEmail())
            .claim("designation", user.getDesignation())
            .claim("department", user.getDepartment())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 30 * 60 * 1000)) // 30 min expiry
            .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
            .compact();
}


    public boolean validateToken(String token) {
    try {
        Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token);  // <-- No build()
        return true;
    } catch (Exception e) {
        return false;
    }
}
}
