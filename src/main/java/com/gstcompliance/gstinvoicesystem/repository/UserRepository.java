package com.gstcompliance.gstinvoicesystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gstcompliance.gstinvoicesystem.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{
    
}
