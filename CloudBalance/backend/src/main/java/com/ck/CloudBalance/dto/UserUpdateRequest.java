package com.ck.CloudBalance.dto;

import com.ck.CloudBalance.entity.RoleEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateRequest {
    private String firstName;
    private String lastName;
    private String password;
    private String roleName;
    private List<Long> cloudAccountIds = new ArrayList<>();
}
