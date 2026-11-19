
package com.gstcompliance.gstinvoicesystem.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.gstcompliance.gstinvoicesystem.entity.User;
import com.gstcompliance.gstinvoicesystem.repository.UserRepository;
import com.gstcompliance.gstinvoicesystem.service.EmailActionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class EmailAccountController {

    private final UserRepository userRepository;
    private final EmailActionService emailActionService;
    private final PasswordEncoder passwordEncoder;

    // Update the signed-in user's email address.
    @PutMapping("/email")
    public ResponseEntity<?> updateEmail(
            @RequestBody EmailRequest request,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Please sign in."));
        }

        if (!isValidEmail(request.email())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Enter a valid email address."));
        }

        String email = request.email().trim().toLowerCase();

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow();

        if (userRepository.existsByEmailAndIdNot(email, user.getId())) {
            return ResponseEntity.status(409)
                    .body(Map.of("error", "This email address is already used."));
        }

        user.setEmail(email);
        user.setEmailVerified(false);
        userRepository.save(user);

        try {
            emailActionService.sendVerification(user);
            return ResponseEntity.ok(Map.of(
                    "message", "Verification email sent. Please check your inbox."
            ));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", safeMessage(ex)));
        }
    }

    // Public endpoint: request a verification email without logging in.
    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationByEmail(
            @RequestBody EmailRequest request) {

        String responseMessage =
                "If this email belongs to an unverified account, a verification link will be sent.";

        if (!isValidEmail(request.email())) {
            return ResponseEntity.ok(Map.of("message", responseMessage));
        }

        String email = request.email().trim().toLowerCase();

        userRepository.findByEmail(email).ifPresent(user -> {
            if (!user.isEmailVerified()) {
                try {
                    emailActionService.sendVerification(user);
                } catch (Exception ignored) {
                    // Keep the public response generic.
                }
            }
        });

        return ResponseEntity.ok(Map.of("message", responseMessage));
    }

    // Change password while signed in.
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Please sign in."));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow();

        if (request.currentPassword() == null ||
                !passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Current password is incorrect."));
        }

        if (request.newPassword() == null ||
                !isValidPassword(request.newPassword())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "New password must be 8-12 characters and include uppercase, lowercase, number and special character."
            ));
        }

        if (!request.newPassword().equals(request.confirmPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "New passwords do not match."));
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of("message", "Password changed successfully.")
        );
    }

    // Resend verification for the signed-in user.
    @PostMapping("/send-verification")
    public ResponseEntity<?> resendVerification(Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Please sign in."));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow();

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Add your email address first."));
        }

        if (user.isEmailVerified()) {
            return ResponseEntity.ok()
                    .body(Map.of("message", "Email is already verified."));
        }

        try {
            emailActionService.sendVerification(user);
            return ResponseEntity.ok()
                    .body(Map.of("message", "Verification email sent."));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", safeMessage(ex)));
        }
    }

    // Verify email using the token in the email link.
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {

        try {
            emailActionService.verifyEmail(token);

            return ResponseEntity.ok().body(Map.of(
                    "message", "Email verified successfully. You can now use password recovery."
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", safeMessage(ex)));
        }
    }

    // Request password reset.
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody EmailRequest request) {

        if (request.email() != null && !request.email().isBlank()) {
            userRepository.findByEmail(request.email().trim().toLowerCase())
                    .ifPresent(user -> {
                        if (user.isEmailVerified()) {
                            try {
                                emailActionService.sendPasswordReset(user);
                            } catch (Exception ignored) {
                                // Do not expose account or mail details.
                            }
                        }
                    });
        }

        return ResponseEntity.ok(Map.of(
                "message", "If that verified email is registered, a password-reset link will be sent."
        ));
    }

    // Reset password using the emailed token.
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        if (request.password() == null ||
                !isValidPassword(request.password())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Password must be 8-12 characters and include uppercase, lowercase, number and special character."
            ));
        }

        if (!request.password().equals(request.confirmPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Passwords do not match."));
        }

        try {
            emailActionService.resetPassword(
                    request.token(),
                    passwordEncoder.encode(request.password())
            );

            return ResponseEntity.ok()
                    .body(Map.of("message", "Password reset successful. Please sign in."));
        } catch (Exception ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", safeMessage(ex)));
        }
    }

    private boolean isValidEmail(String email) {
        return email != null &&
                email.trim().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }

    private boolean isValidPassword(String password) {
        return password.length() >= 8 &&
                password.length() <= 12 &&
                password.matches(".*[A-Z].*") &&
                password.matches(".*[a-z].*") &&
                password.matches(".*[0-9].*") &&
                password.matches(".*[^a-zA-Z0-9].*");
    }

    private String safeMessage(Exception ex) {
        return ex.getMessage() == null
                ? "Request could not be completed."
                : ex.getMessage();
    }

    public record EmailRequest(String email) {}

    public record ChangePasswordRequest(
            String currentPassword,
            String newPassword,
            String confirmPassword) {}

    public record ResetPasswordRequest(
            String token,
            String password,
            String confirmPassword) {}
}
