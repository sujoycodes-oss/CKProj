package com.ck.CloudBalance.repository;

import com.ck.CloudBalance.dto.LoginRequest;
import com.ck.CloudBalance.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UsersEntity, Long> {
    Optional<UsersEntity> findByEmail(String email);
    boolean existsByEmail(String email);
}
