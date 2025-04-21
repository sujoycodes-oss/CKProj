package com.ck.CloudBalance.repository;


import com.ck.CloudBalance.entity.UserCloudAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CloudAccountRepository extends JpaRepository<UserCloudAccount, Long> {
    Optional<UserCloudAccount> findById(Long accountId);
    boolean existsByCloudAccountId(Long cloudAccountId);

}
