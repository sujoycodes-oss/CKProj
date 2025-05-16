package com.ck.CloudBalance.controller;

import com.ck.CloudBalance.dto.SnowflakeRequest;
import com.ck.CloudBalance.enumFiles.SnowflakeColumn;
import com.ck.CloudBalance.service.SnowflakeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/snowflake")
public class SnowflakeController {

    private final SnowflakeService snowflakeService;

    public SnowflakeController(SnowflakeService snowflakeService) {
        this.snowflakeService = snowflakeService;
    }

    @PostMapping("/query/{accountId}")
    public ResponseEntity<List<Map<String, Object>>> query(
            @PathVariable String accountId,
            @RequestBody SnowflakeRequest req
    ) {
        List<Map<String, Object>> data = snowflakeService.getSnowflakeData(
                accountId,
                req
        );
        return ResponseEntity.ok(data);
    }

    @GetMapping("/columns")
    public ResponseEntity<List<String>> getGroupabIeColumns() {
        return ResponseEntity.ok(
                Arrays.stream(SnowflakeColumn.values())
                        .filter(SnowflakeColumn::isGroupable)
                        .map(Enum::name)
                        .toList()
        );
    }

    @GetMapping("/column-values")
    public ResponseEntity<List<String>> getDistinctColumnValues(@RequestParam String column) {
        return ResponseEntity.ok(snowflakeService.getDistinctValues(column));
    }
}