package com.ck.CloudBalance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class EC2InstanceDTO {
    private String resourceId;
    private String resourceName;
    private String region;
    private String state;
}
