package com.ck.CloudBalance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RDSInstanceDTO {
    private String resourceId;
    private String resourceName;
    private String engine;
    private String region;
    private String status;
}
