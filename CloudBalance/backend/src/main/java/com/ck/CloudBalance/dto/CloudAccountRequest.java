package com.ck.CloudBalance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CloudAccountRequest {
    private Long cloudAccountId;
    private String cloudAccountName;
    private String region;
    private String arn;
}
