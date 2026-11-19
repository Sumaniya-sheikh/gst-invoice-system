package com.gstcompliance.gstinvoicesystem.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.gstcompliance.gstinvoicesystem.entity.EmailActionToken;

public interface EmailActionTokenRepository extends JpaRepository<EmailActionToken, Long> {
    Optional<EmailActionToken> findByTokenHashAndPurposeAndUsedFalse(String tokenHash, String purpose);
    void deleteByUser_IdAndPurpose(Long userId, String purpose);
}
