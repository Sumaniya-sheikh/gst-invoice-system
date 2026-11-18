
package com.gstcompliance.gstinvoicesystem.controller;

import com.gstcompliance.gstinvoicesystem.entity.User;
import com.gstcompliance.gstinvoicesystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserManagementController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Create a Business User
    @PostMapping
    public ResponseEntity<?> createUser(
            @RequestBody CreateUserRequest request) {

        if (request.username() == null
                || request.username().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username is required"));
        }

        if (request.password() == null
                || !isValidPassword(request.password())) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                        "error",
                        "Password must be 8-12 characters and include uppercase, lowercase, number and special character."
                    ));
        }

        String username = request.username().trim();

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already exists"));
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("BUSINESS_USER");
        user.setActive(true);

        User savedUser = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new UserResponse(
                    savedUser.getId(),
                    savedUser.getUsername(),
                    savedUser.getRole(),
                    savedUser.isActive()
                ));
    }

    // View all registered users
    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getRole(),
                    user.isActive()
                ))
                .toList();
    }

    // Activate or deactivate a Business User
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        if (!"BUSINESS_USER".equals(user.getRole())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Admin accounts cannot be deactivated here"));
        }

        if (request.active() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Account status is required"));
        }

        user.setActive(request.active());

        User updatedUser = userRepository.save(user);

        return ResponseEntity.ok(new UserResponse(
            updatedUser.getId(),
            updatedUser.getUsername(),
            updatedUser.getRole(),
            updatedUser.isActive()
        ));
    }

    private boolean isValidPassword(String password) {

        return password.length() >= 8
                && password.length() <= 12
                && password.matches(".*[A-Z].*")
                && password.matches(".*[a-z].*")
                && password.matches(".*[0-9].*")
                && password.matches(".*[^a-zA-Z0-9].*");
    }

    public record CreateUserRequest(
            String username,
            String password) {}

    public record UpdateStatusRequest(
            Boolean active) {}

    public record UserResponse(
            Long id,
            String username,
            String role,
            boolean active) {}
}
