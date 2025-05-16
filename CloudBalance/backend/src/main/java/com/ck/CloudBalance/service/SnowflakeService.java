package com.ck.CloudBalance.service;

import com.ck.CloudBalance.dto.SnowflakeRequest;
import com.ck.CloudBalance.enumFiles.SnowflakeColumn;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class SnowflakeService {

    private final JdbcTemplate snowflakeJdbcTemplate;

    public SnowflakeService(@Qualifier("snowflakeJdbcTemplate") JdbcTemplate snowflakeJdbcTemplate) {
        this.snowflakeJdbcTemplate = snowflakeJdbcTemplate;
    }


    public List<Map<String, Object>> getSnowflakeData(String accountId, SnowflakeRequest request) {
        String groupCol = SnowflakeColumn.fromKey(request.getGroupBy())
                .filter(SnowflakeColumn::isGroupable)
                .map(SnowflakeColumn::getDbColumn)
                .orElseThrow(() -> new IllegalArgumentException("Invalid groupBy"));

        StringBuilder sql = new StringBuilder()
                .append("SELECT ")
                .append("TO_CHAR(USAGESTARTDATE, 'YYYY-MM') AS USAGE_MONTH, ")
                .append(groupCol)
                .append(", SUM(LINEITEM_USAGEAMOUNT) AS TOTAL_USAGE_COST ")
                .append("FROM cost_explorer WHERE 1=1 ");

        List<Object> params = new ArrayList<>();

        // Account ID filter
        sql.append(" AND LINKEDACCOUNTID = ? ");
        params.add(accountId);

        // Dynamic filters
        if (request.getFilters() != null) {
            request.getFilters().forEach((key, val) -> {
                SnowflakeColumn.fromKey(key)
                        .filter(SnowflakeColumn::isFilterable)
                        .ifPresent(col -> {
                            String db = col.getDbColumn();
                            if (val instanceof List<?> list) {
                                @SuppressWarnings("unchecked")
                                List<String> items = (List<String>) list;
                                String placeholders = items.stream().map(i -> "?").collect(Collectors.joining(","));
                                sql.append(" AND ").append(db).append(" IN (").append(placeholders).append(") ");
                                params.addAll(items);
                            } else {
                                sql.append(" AND ").append(db).append(" = ? ");
                                params.add(val.toString());
                            }
                        });
            });
        }

        // Date range filters
        if (request.getStartDate() != null && request.getEndDate() != null) {
            sql.append(" AND USAGESTARTDATE BETWEEN ? AND ? ");
            params.add(request.getStartDate());
            params.add(request.getEndDate());
        } else if (request.getStartDate() != null) {
            sql.append(" AND USAGESTARTDATE >= ? ");
            params.add(request.getStartDate());
        } else if (request.getEndDate() != null) {
            sql.append(" AND USAGESTARTDATE <= ? ");
            params.add(request.getEndDate());
        }

        // Grouping
        sql.append(" GROUP BY TO_CHAR(USAGESTARTDATE, 'YYYY-MM'), ").append(groupCol)
                .append(" ORDER BY USAGE_MONTH, TOTAL_USAGE_COST DESC LIMIT 1000");

        return snowflakeJdbcTemplate.queryForList(sql.toString(), params.toArray());
    }


    public List<String> getDistinctValues(String columnKey) {
        Optional<SnowflakeColumn> columnOpt = SnowflakeColumn.fromKey(columnKey);
        if (columnOpt.isEmpty()) return List.of();

        String sql = "SELECT DISTINCT " + columnOpt.get().getDbColumn() + " FROM cost_explorer LIMIT 100";
        return snowflakeJdbcTemplate.queryForList(sql, String.class);
    }
}
