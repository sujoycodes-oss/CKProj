package com.ck.CloudBalance.repository;

import com.ck.CloudBalance.entity.BlackListedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlackListedTokenRepository extends JpaRepository<BlackListedToken, String> {
    boolean existsByToken(String token);
}
