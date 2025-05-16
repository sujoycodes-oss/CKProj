package com.ck.CloudBalance.service;

import com.ck.CloudBalance.dto.CustomerResponse;
import com.ck.CloudBalance.entity.UsersEntity;
import com.ck.CloudBalance.repository.UserRepository;
import com.ck.CloudBalance.utils.UserResponse;
import org.hibernate.sql.ast.tree.update.Assignment;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoginService {

    private final UserRepository userRepository;

    public LoginService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAllUsers() {
        List<UsersEntity> users = userRepository.findAll();
        return users.stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }

    public List<CustomerResponse> getCustomers() {
        List<UsersEntity> users = userRepository.findAll();
        return users.stream()
                .filter(user-> "CUSTOMER".equals(user.getRole().getRoleName()))
                .map(CustomerResponse::fromUser)
                .collect(Collectors.toList());
    }

    public void deleteUser(Long id){
        UsersEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }


}
