package com.ck.CloudBalance.utils;

import com.ck.CloudBalance.entity.UsersEntity;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private LocalDateTime lastLogin;
    private List<Long> assignedCloudAccountIds;

    public static UserResponse fromUser(UsersEntity user) {
        List<Long> cloudAccountIds = user.getUserAccounts()
                .stream()
                .map(assignment -> assignment.getUserCloudAccount().getId())
                .collect(Collectors.toList());

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().getRoleName(),
                user.getLastLogin(),
                cloudAccountIds
        );
    }
}
