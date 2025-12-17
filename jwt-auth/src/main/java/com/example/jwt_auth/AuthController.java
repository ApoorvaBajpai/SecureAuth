package com.example.jwt_auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.jsonwebtoken.Jwts;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")

@RestController
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {

    // Fetch user from DB
    User user = userService.getUserById(request.getId());

    // Validate password
    if (user == null || !user.getPassword().equals(request.getPassword())) {
        return ResponseEntity.status(401).body("Invalid ID or password");
    }

    // Generate tokens
    String accessToken = jwtService.generateAccessToken(user.getId());
    String idToken = jwtService.generateIdToken(user);

    return ResponseEntity.ok(
            Map.of(
                    "access_token", accessToken,
                    "id_token", idToken
            )
    );
}

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        // Validate JWT
        if (!jwtService.validateToken(token)) {
            return ResponseEntity.status(401).body("Invalid or expired token");
        }

        return ResponseEntity.ok("Profile data accessed successfully!");
    }

    @GetMapping("/userinfo")
public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String authHeader) {

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(401).body("Missing or invalid token");
    }

    String idToken = authHeader.substring(7); // remove "Bearer "

    try {
        var claims = Jwts.parser()
                .setSigningKey("qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM123456")
                .parseClaimsJws(idToken)
                .getBody();

        String userId = claims.getSubject(); // extract the ID from token

        User user = userService.getUserById(userId);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok(
                Map.of(
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "designation", user.getDesignation(),
                        "department", user.getDepartment()
                )
        );

    } catch (Exception e) {
        return ResponseEntity.status(401).body("Invalid or expired ID token");
    }
}

@PutMapping("/updateProfile")
public ResponseEntity<?> updateProfile(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody Map<String, String> updates) {

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return ResponseEntity.status(401).body("Missing or invalid token");
    }

    String idToken = authHeader.substring(7);

    try {
        // Extract userId from token
        var claims = Jwts.parser()
                .setSigningKey("qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM123456")
                .parseClaimsJws(idToken)
                .getBody();

        String userId = claims.getSubject();

        // Load user from DB
        User user = userService.getUserById(userId);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        // Update allowed fields
        if (updates.containsKey("name")) user.setName(updates.get("name"));
        if (updates.containsKey("email")) user.setEmail(updates.get("email"));
        if (updates.containsKey("designation")) user.setDesignation(updates.get("designation"));
        if (updates.containsKey("department")) user.setDepartment(updates.get("department"));

        // Save updated user
        userService.saveUser(user);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Profile updated",
                        "user", user
                )
        );

    } catch (Exception e) {
        return ResponseEntity.status(401).body("Invalid or expired ID token");
    }
}
@GetMapping("/users")
public ResponseEntity<?> getUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

    return ResponseEntity.ok(userService.getUsers(page, size));
}

}
