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
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

        List<Long> cloudAccountIds = user.getUserAccounts().stream()
                .map(userAccount -> userAccount.getUserCloudAccount().getId())
                .collect(Collectors.toList());

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
                user.getRole().getRoleName(),
                cloudAccountIds
        );
    }

    // Switch account Logic ----->>>>>>
    public LoginResponse switchAccount(String targetEmail) {
        String loggedInEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        UsersEntity admin = userRepository.findByEmail(loggedInEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!"ADMIN".equalsIgnoreCase(admin.getRole().getRoleName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can switch accounts.");
        }

        UsersEntity customer = userRepository.findByEmail(targetEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        if (!"CUSTOMER".equalsIgnoreCase(customer.getRole().getRoleName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only customers can be switched.");
        }
        Map<String, Object> claims = new HashMap<>();
        claims.put("impersonating", true);
        claims.put("impersonatedBy", admin.getEmail());
        claims.put("role", customer.getRole().getRoleName());
        claims.put("actualRole", admin.getRole().getRoleName());

        List<Long> cloudAccountIds = customer.getUserAccounts().stream()
                .map(userAccount -> userAccount.getUserCloudAccount().getId())
                .collect(Collectors.toList());

        String jwtToken = jwtService.generateToken(claims, customer);

        return new LoginResponse(
                jwtToken,
                customer.getEmail(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getRole().getRoleName(),
                cloudAccountIds
        );

    }

    public LoginResponse stopImpersonation(HttpServletRequest request) {
        Boolean isImpersonating = (Boolean) request.getAttribute("impersonating");
        String impersonatedBy = (String) request.getAttribute("impersonatedBy");

        if (!Boolean.TRUE.equals(isImpersonating) || impersonatedBy == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not currently impersonating.");
        }

        UsersEntity admin = userRepository.findByEmail(impersonatedBy)
                .orElseThrow(() -> new UsernameNotFoundException("Original admin not found"));

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", admin.getRole().getRoleName());
        claims.put("impersonating", false);
        claims.put("impersonatedBy", null);

        List<Long> cloudAccountIds = admin.getUserAccounts().stream()
                .map(a -> a.getUserCloudAccount().getId())
                .collect(Collectors.toList());

        String jwtToken = jwtService.generateToken(claims, admin);

        return new LoginResponse(
                jwtToken,
                admin.getEmail(),
                admin.getFirstName(),
                admin.getLastName(),
                admin.getRole().getRoleName(),
                cloudAccountIds
        );
    }


    public void updateUserAndAccounts(Long id, UserUpdateRequest request) {
        String loggedInEmail = SecurityContextHolder.getContext().getAuthentication().getName(); // fetching email from security context

        UsersEntity loggedInUser = userRepository.findByEmail(loggedInEmail)
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));

        if (loggedInUser.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to modify your own account.");
        }

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

    public void createCloudAccount(CloudAccountRequest request) {
        if (cloudAccountRepository.existsByCloudAccountId(request.getCloudAccountId())) {
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
}

