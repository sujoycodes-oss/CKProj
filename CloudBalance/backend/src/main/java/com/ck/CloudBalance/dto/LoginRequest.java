package com.ck.CloudBalance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.management.relation.RelationNotification;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    public String email;
    public String password;
//    public String roleName;
}
