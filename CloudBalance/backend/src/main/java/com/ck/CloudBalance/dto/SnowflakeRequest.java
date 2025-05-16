package com.ck.CloudBalance.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class SnowflakeRequest {
    private Map<String, Object> filters;
    private String groupBy;
    private String startDate;
    private String endDate;
}
