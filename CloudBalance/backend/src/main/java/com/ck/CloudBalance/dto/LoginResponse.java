package com.ck.CloudBalance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private List<Long> cloudAccountIds = new ArrayList<>();
}
