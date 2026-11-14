package com.gstcompliance.gstinvoicesystem.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.gstcompliance.gstinvoicesystem.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

}