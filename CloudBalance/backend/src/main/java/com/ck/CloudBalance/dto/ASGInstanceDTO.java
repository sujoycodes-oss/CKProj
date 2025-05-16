package com.ck.CloudBalance.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ASGInstanceDTO {
    private String resourceId;
    private String resourceName;
    private Integer minSize;
    private Integer maxSize;
    private Integer desiredCapacity;
    private String region;
    private String status;
}
