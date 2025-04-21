package com.ck.CloudBalance.service;

import com.ck.CloudBalance.entity.RoleEntity;
import com.ck.CloudBalance.entity.UsersEntity;
import com.ck.CloudBalance.repository.RoleRepository;
import com.ck.CloudBalance.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class DataInitializer {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        RoleEntity adminRole = roleRepository.findByRoleName("ADMIN")
                .orElseGet(() -> roleRepository.save(RoleEntity.builder()
                        .roleName("ADMIN")
                        .build()));

        RoleEntity customerRole = roleRepository.findByRoleName("CUSTOMER")
                .orElseGet(() -> roleRepository.save(RoleEntity.builder()
                        .roleName("CUSTOMER")
                        .build()));

        RoleEntity readOnlyRole = roleRepository.findByRoleName("READ_ONLY")
                .orElseGet(() -> roleRepository.save(RoleEntity.builder()
                        .roleName("READ_ONLY")
                        .build()));

        if (!userRepository.existsByEmail("admin@example.com")) {
            UsersEntity admin = UsersEntity.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(adminRole)
                    .build();
            userRepository.save(admin);
        }
    }
}