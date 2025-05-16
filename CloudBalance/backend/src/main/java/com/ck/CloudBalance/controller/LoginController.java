package com.ck.CloudBalance.controller;

import com.ck.CloudBalance.dto.*;
import com.ck.CloudBalance.entity.BlackListedToken;
import com.ck.CloudBalance.entity.UserCloudAccount;
import com.ck.CloudBalance.repository.BlackListedTokenRepository;
import com.ck.CloudBalance.repository.CloudAccountRepository;
import com.ck.CloudBalance.service.AuthService;
import com.ck.CloudBalance.service.LoginService;
import com.ck.CloudBalance.utils.UserResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class LoginController {

    private final AuthService authService;
    private final LoginService loginService;
    private final BlackListedTokenRepository blackListedTokenRepository;
    private final CloudAccountRepository cloudAccountRepository;

    public LoginController(AuthService authService,
                           LoginService loginService,
                           BlackListedTokenRepository blackListedTokenRepository,
                           CloudAccountRepository cloudAccountRepository) {
        this.loginService = loginService;
        this.authService = authService;
        this.blackListedTokenRepository = blackListedTokenRepository;
        this.cloudAccountRepository = cloudAccountRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/admin/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
//        log.info("Admin {} is registering a new user {}", authentication.getName(), request.getEmail());
//        String adminEmail = authentication.getName();
        return ResponseEntity.ok(authService.register(request));
    }


    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('READ_ONLY')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(loginService.getAllUsers());
    }

    //Filter Customers ----->>>>>
    @GetMapping("/admin/users/customers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CustomerResponse>> getCustomerUsers() {
        return ResponseEntity.ok(loginService.getCustomers());
    }


//    @DeleteMapping("/admin/users/{myId}")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<Void> deleteUser(@PathVariable Long myId){
//        loginService.deleteUser(myId);
//        return ResponseEntity.noContent().build();
//    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            blackListedTokenRepository.save(new BlackListedToken(token, LocalDateTime.now()));
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out successfully");
    }

    @PutMapping("/admin/users/{id}")
    public ResponseEntity<String> updateUserAndAccounts(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        authService.updateUserAndAccounts(id, request);
        return ResponseEntity.ok("User updated successfully");
    }


    @PostMapping("/admin/cloudAccount")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createCloudAccount(@RequestBody CloudAccountRequest request) {
        authService.createCloudAccount(request);
        return ResponseEntity.ok("Cloud account created successfully");
    }

    @GetMapping("/cloudAccounts")
    public ResponseEntity<List<UserCloudAccount>> getAllCloudAccounts() {
        return ResponseEntity.ok(cloudAccountRepository.findAll());
    }

    @PostMapping("/impersonate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoginResponse> impersonate(@RequestParam String targetEmail) {
        return ResponseEntity.ok(authService.switchAccount(targetEmail));
    }

    @PostMapping("/stop-impersonation")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<LoginResponse> stopImpersonation(HttpServletRequest request) {
        return ResponseEntity.ok(authService.stopImpersonation(request));
    }

}
