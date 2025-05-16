package com.ck.CloudBalance.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "BlackListedToken")
public class BlackListedToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private LocalDateTime blacklistedAt;

    public BlackListedToken() {}

    public BlackListedToken(String token, LocalDateTime blacklistedAt) {
        this.token = token;
        this.blacklistedAt = blacklistedAt;
    }

}
