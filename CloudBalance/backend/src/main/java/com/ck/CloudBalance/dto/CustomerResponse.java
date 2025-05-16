package com.ck.CloudBalance.dto;

import com.ck.CloudBalance.entity.UsersEntity;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomerResponse {
    private Long id;
    private String fullName;
    private String email;

    public static CustomerResponse fromUser(UsersEntity user) {
        return new CustomerResponse(
                user.getId(),
                user.getFirstName() + " " + user.getLastName(),
                user.getEmail()
        );
    }
}
