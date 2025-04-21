package com.ck.CloudBalance.service;

import com.ck.CloudBalance.dto.*;
import com.ck.CloudBalance.entity.RoleEntity;
import com.ck.CloudBalance.entity.UserAccount;
import com.ck.CloudBalance.entity.UserCloudAccount;
import com.ck.CloudBalance.entity.UsersEntity;
import com.ck.CloudBalance.repository.CloudAccountRepository;
import com.ck.CloudBalance.repository.RoleRepository;
import com.ck.CloudBalance.repository.UserAccountRepository;
import com.ck.CloudBalance.repository.UserRepository;
import com.ck.CloudBalance.utils.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CloudAccountRepository cloudAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserAccountRepository userAccountRepository;


    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );


        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().getRoleName());

        var jwtToken = jwtService.generateToken(extraClaims, user);


        return new LoginResponse(
                jwtToken,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().getRoleName()
        );
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        RoleEntity role = roleRepository.findByRoleName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        UsersEntity user = new UsersEntity();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        List<UserAccount> accountAssignments = new ArrayList<>();
        if (request.getCloudIds() != null && !request.getCloudIds().isEmpty()) {
            for (Long cloudAccountId : request.getCloudIds()) {
                UserCloudAccount cloudAccount = cloudAccountRepository.findById(cloudAccountId)
                        .orElseThrow(() -> new RuntimeException("Cloud account not found"));

                UserAccount assignment = UserAccount.builder()
                        .user(user)
                        .userCloudAccount(cloudAccount)
                        .build();

                accountAssignments.add(assignment);
            }
        }
        user.setUserAccounts(accountAssignments);
        UsersEntity savedUser = userRepository.save(user);

        return UserResponse.fromUser(savedUser);
    }

    public void createCloudAccount(CloudAccountRequest request){
        if (cloudAccountRepository.existsByCloudAccountId(request.getCloudAccountId())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cloud account already exists");
        } else {
            UserCloudAccount cloudAccount = UserCloudAccount.builder()
                    .cloudAccountId(request.getCloudAccountId())
                    .cloudAccountName(request.getCloudAccountName())
                    .arn(request.getArn())
                    .region(request.getRegion())
                    .orphan(true)
                    .build();
            cloudAccountRepository.save(cloudAccount);
        }
    }

    public void updateUserAndAccounts(Long id, UserUpdateRequest request) {
        UsersEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RoleEntity role = roleRepository.findByRoleName(request.getRoleName())
                .orElseThrow(() -> new RuntimeException("Invalid role: " + request.getRoleName()));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(role);

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);

        List<UserAccount> oldLinks = userAccountRepository.findByUser(user);
        for (UserAccount ua : oldLinks) {
            UserCloudAccount acc = ua.getUserCloudAccount();
            userAccountRepository.delete(ua);
            if (userAccountRepository.countByUserCloudAccount(acc) == 0) {
                acc.setOrphan(true);
                cloudAccountRepository.save(acc);
            }
        }

        if (request.getCloudAccountIds() != null && !request.getCloudAccountIds().isEmpty()) {
            if (!"CUSTOMER".equalsIgnoreCase(request.getRoleName())) {
                throw new RuntimeException("Only CUSTOMER users can have cloud accounts assigned.");
            }
            for (Long accountId : request.getCloudAccountIds()) {
                UserCloudAccount acc = cloudAccountRepository.findById(accountId)
                        .orElseThrow(() -> new RuntimeException("Cloud account not found: " + accountId));

                acc.setOrphan(false);
                cloudAccountRepository.save(acc);

                UserAccount userAccount = UserAccount.builder()
                        .user(user)
                        .userCloudAccount(acc)
                        .build();

                userAccountRepository.save(userAccount);
            }
        }
    }
}

