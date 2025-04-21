package com.ck.CloudBalance.repository;

import com.ck.CloudBalance.dto.RegisterRequest;
import com.ck.CloudBalance.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
    Optional<RoleEntity> findByRoleName(String roleName);
}
