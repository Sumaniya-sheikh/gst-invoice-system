
package com.gstcompliance.gstinvoicesystem.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.gstcompliance.gstinvoicesystem.entity.EmailActionToken;
import com.gstcompliance.gstinvoicesystem.entity.User;
import com.gstcompliance.gstinvoicesystem.repository.EmailActionTokenRepository;
import com.gstcompliance.gstinvoicesystem.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailActionService {

    private static final String VERIFY = "VERIFY_EMAIL";
    private static final String RESET = "RESET_PASSWORD";

    private final JavaMailSender mailSender;
    private final EmailActionTokenRepository tokenRepository;
    private final UserRepository userRepository;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.email-verification.expiry-minutes:30}")
    private long verificationExpiry;

    @Value("${app.password-reset.expiry-minutes:15}")
    private long resetExpiry;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    @Transactional
    public void sendVerification(User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException(
                    "Please add an email address first.");
        }

        send(user, VERIFY, verificationExpiry, "/verify-email?token=");
    }

    @Transactional
    public void sendPasswordReset(User user) {
        if (user.getEmail() == null || !user.isEmailVerified()) {
            throw new IllegalArgumentException(
                    "A verified email address is required for password recovery.");
        }

        send(user, RESET, resetExpiry, "/reset-password?token=");
    }

    private void send(User user, String purpose, long expiry, String path) {

        if (fromAddress == null || fromAddress.isBlank()) {
            throw new IllegalStateException(
                    "Email is not configured. Set MAIL_USERNAME and MAIL_PASSWORD.");
        }

        tokenRepository.deleteByUser_IdAndPurpose(user.getId(), purpose);

        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);

        String rawToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        EmailActionToken token = new EmailActionToken();
        token.setUser(user);
        token.setTokenHash(hash(rawToken));
        token.setPurpose(purpose);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(expiry));

        tokenRepository.save(token);

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromAddress);
        message.setTo(user.getEmail());

        message.setSubject(
                VERIFY.equals(purpose)
                        ? "Verify your GST Invoice System email"
                        : "Reset your GST Invoice System password");

        message.setText(
                "Hello " + user.getUsername() + ",\n\n"
                        + (VERIFY.equals(purpose)
                                ? "Verify your email address"
                                : "Reset your password")
                        + " using this link:\n"
                        + frontendUrl + path + rawToken
                        + "\n\nThis link expires in " + expiry
                        + " minutes. If you did not request this, ignore this email.");

        try {
            mailSender.send(message);

            log.info("Email sent successfully to {}", user.getEmail());

        } catch (MailException ex) {

            log.error("SMTP email sending failed: {}", ex.getMessage(), ex);

            throw new IllegalStateException(
                    "Email sending failed: " + ex.getMessage(), ex);
        }
    }

    @Transactional
    public void verifyEmail(String rawToken) {

        EmailActionToken token = getValidToken(rawToken, VERIFY);

        User user = token.getUser();
        user.setEmailVerified(true);

        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);
    }

    @Transactional
    public void resetPassword(String rawToken, String encodedPassword) {

        EmailActionToken token = getValidToken(rawToken, RESET);

        User user = token.getUser();
        user.setPassword(encodedPassword);

        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);
    }

    private EmailActionToken getValidToken(String rawToken, String purpose) {

        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("Invalid or expired link.");
        }

        EmailActionToken token = tokenRepository
                .findByTokenHashAndPurposeAndUsedFalse(hash(rawToken), purpose)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid or expired link."));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {

            token.setUsed(true);
            tokenRepository.save(token);

            throw new IllegalArgumentException(
                    "This link has expired. Please request a new one.");
        }

        return token;
    }

    private String hash(String value) {

        try {
            return HexFormat.of().formatHex(
                    MessageDigest.getInstance("SHA-256")
                            .digest(value.getBytes(StandardCharsets.UTF_8)));

        } catch (Exception ex) {

            throw new IllegalStateException(
                    "Could not process security token.", ex);
        }
    }
}
