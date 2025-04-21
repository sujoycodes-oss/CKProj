package com.ck.CloudBalance.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cloud_account")
public class UserCloudAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cloud_account_id", nullable = false, unique = true)
    private Long cloudAccountId;

    @Column(name = "cloud_account_name")
    private String cloudAccountName;

    @Column(name = "arn")
    private String arn;

    @Column(name = "region")
    private String region;

    @Column(name = "orphan")
    private Boolean orphan = true;

    @OneToMany(mappedBy = "userCloudAccount", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<UserAccount> userAccounts = new ArrayList<>();
}
