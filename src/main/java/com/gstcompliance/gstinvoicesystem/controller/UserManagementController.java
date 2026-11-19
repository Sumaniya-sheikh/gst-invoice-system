package com.gstcompliance.gstinvoicesystem.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.gstcompliance.gstinvoicesystem.entity.User;
import com.gstcompliance.gstinvoicesystem.repository.UserRepository;
import com.gstcompliance.gstinvoicesystem.service.EmailActionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserManagementController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailActionService emailActionService;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        if (request.username() == null || request.username().isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
        if (request.email() == null || !request.email().trim().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"))
            return ResponseEntity.badRequest().body(Map.of("error", "A valid email address is required."));
        if (!isValidPassword(request.password()))
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be 8-12 characters and include uppercase, lowercase, number and special character."));

        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();
        if (userRepository.findByUsername(username).isPresent())
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Username already exists"));
        if (userRepository.existsByEmail(email))
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email address already exists"));

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("BUSINESS_USER");
        user.setActive(true);
        user.setEmailVerified(false);
        User saved = userRepository.save(user);

        String message = "Business User created. Email verification is pending.";
        try { emailActionService.sendVerification(saved); }
        catch (Exception ex) { message += " Verification email could not be sent: " + ex.getMessage(); }

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", saved.getId(), "username", saved.getUsername(), "email", saved.getEmail(),
                "role", saved.getRole(), "active", saved.isActive(),
                "emailVerified", saved.isEmailVerified(), "message", message));
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(user -> new UserResponse(
                user.getId(), user.getUsername(), user.getEmail(), user.getRole(),
                user.isActive(), user.isEmailVerified())).toList();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        if (!"BUSINESS_USER".equals(user.getRole()))
            return ResponseEntity.badRequest().body(Map.of("error", "Admin profile must be managed from Account Settings"));

        String username = request.username() == null ? "" : request.username().trim();
        String email = request.email() == null ? "" : request.email().trim().toLowerCase();
        if (username.isBlank()) return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"))
            return ResponseEntity.badRequest().body(Map.of("error", "A valid email address is required."));
        if (userRepository.findByUsername(username).filter(u -> !u.getId().equals(id)).isPresent())
            return ResponseEntity.status(409).body(Map.of("error", "Username already exists"));
        if (userRepository.existsByEmailAndIdNot(email, id))
            return ResponseEntity.status(409).body(Map.of("error", "Email address already exists"));

        boolean emailChanged = !email.equalsIgnoreCase(user.getEmail() == null ? "" : user.getEmail());
        user.setUsername(username);
        user.setEmail(email);
        if (emailChanged) user.setEmailVerified(false);
        User saved = userRepository.save(user);
        String message = "User details updated.";
        if (emailChanged) {
            try { emailActionService.sendVerification(saved); message += " Verification email sent."; }
            catch (Exception ex) { message += " Verification email could not be sent."; }
        }
        return ResponseEntity.ok(Map.of("id", saved.getId(), "username", saved.getUsername(),
                "email", saved.getEmail(), "role", saved.getRole(), "active", saved.isActive(),
                "emailVerified", saved.isEmailVerified(), "message", message));
    }

    @PostMapping("/{id}/resend-verification")
    public ResponseEntity<?> resendUserVerification(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        if (user.getEmail() == null || user.getEmail().isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "User has no email address."));
        if (user.isEmailVerified())
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already verified."));
        try {
            emailActionService.sendVerification(user);
            return ResponseEntity.ok(Map.of("message", "Verification email sent."));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Could not send verification email. Check SMTP configuration."));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        if (!"BUSINESS_USER".equals(user.getRole()))
            return ResponseEntity.badRequest().body(Map.of("error", "Admin accounts cannot be deactivated here"));
        if (request.active() == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Account status is required"));
        user.setActive(request.active());
        userRepository.save(user);
        return ResponseEntity.ok(new UserResponse(user.getId(), user.getUsername(), user.getEmail(),
                user.getRole(), user.isActive(), user.isEmailVerified()));
    }

    private boolean isValidPassword(String p) {
        return p != null && p.length() >= 8 && p.length() <= 12 && p.matches(".*[A-Z].*")
                && p.matches(".*[a-z].*") && p.matches(".*[0-9].*")
                && p.matches(".*[^a-zA-Z0-9].*");
    }

    public record CreateUserRequest(String username, String email, String password) {}
    public record UpdateStatusRequest(Boolean active) {}
    public record UpdateUserRequest(String username, String email) {}
    public record UserResponse(Long id, String username, String email, String role, boolean active, boolean emailVerified) {}
}
