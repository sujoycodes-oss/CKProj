package com.ck.CloudBalance.repository;

import com.ck.CloudBalance.entity.UserAccount;
import com.ck.CloudBalance.entity.UserCloudAccount;
import com.ck.CloudBalance.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    List<UserAccount> findByUser(UsersEntity user);
    void delete(UserAccount userAccount);
    long countByUserCloudAccount(UserCloudAccount userCloudAccount);

}
