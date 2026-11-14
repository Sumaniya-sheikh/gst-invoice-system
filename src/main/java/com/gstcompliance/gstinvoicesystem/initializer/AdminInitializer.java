package com.gstcompliance.gstinvoicesystem.initializer;

import com.gstcompliance.gstinvoicesystem.entity.User;
import com.gstcompliance.gstinvoicesystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {

        // Create the first Admin only when no users exist.
        if (userRepository.count() > 0) {
            return;
        }

        String username = System.getenv("APP_ADMIN_USERNAME");
        String password = System.getenv("APP_ADMIN_PASSWORD");

        if (username == null || username.isBlank()
                || password == null || password.isBlank()) {
            throw new IllegalStateException(
                    "Set APP_ADMIN_USERNAME and APP_ADMIN_PASSWORD "
                    + "before starting the application."
            );
        }

      if (password.length() < 8
        || password.length() > 12
        || !password.matches(".*[A-Z].*")
        || !password.matches(".*[a-z].*")
        || !password.matches(".*[0-9].*")
        || !password.matches(".*[^a-zA-Z0-9].*")) {
            throw new IllegalStateException(
                    "Admin password must be 8-12 characters and include uppercase, lowercase, number and special character."
            );
        }

        User admin = new User();
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole("ADMIN");

        userRepository.save(admin);

        System.out.println("Initial Admin account created successfully.");
    }
}