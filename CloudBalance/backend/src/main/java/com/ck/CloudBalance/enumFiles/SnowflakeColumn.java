package com.ck.CloudBalance.enumFiles;

import java.util.Arrays;
import java.util.Optional;

public enum SnowflakeColumn {

    SERVICES("PRODUCT_PRODUCTNAME", true, true),
    ACCOUNT_ID("LINKEDACCOUNTID", true, true),
    OPERATION("LINEITEM_OPERATION", true, true),
    USAGE_TYPE("LINEITEM_USAGETYPE", true, true),
    INSTANCE_TYPE("MYCLOUD_INSTANCETYPE", true, true),
    OPERATING_SYSTEM("MYCLOUD_OPERATINGSYSTEM", true, true),
    PRICING_TYPE("MYCLOUD_PRICINGTYPE", true, true),
    REGION("MYCLOUD_REGIONNAME", true, true),
    USAGE_START_DATE("USAGESTARTDATE", true, true),
    DATABASE_ENGINE("PRODUCT_DATABASEENGINE", true, true),
    UNBLENDED_COST("LINEITEM_UNBLENDEDCOST", false, false),
    USAGE_AMOUNT("LINEITEM_USAGEAMOUNT", false, false),
    COST_EXPLORER_USAGE_GROUP_TYPE("MYCLOUD_COST_EXPLORER_USAGE_GROUP_TYPE", true, true),
    PRICING_UNIT("PRICING_UNIT", true, true),
    CHARGE_TYPE("CHARGE_TYPE", true, true),
    AVAILABILITY_ZONE("AVAILABILITYZONE", true, true),
    TENANCY("TENANCY", true, true),
    ;

    private final String dbColumn;
    private final boolean filterable;
    private final boolean groupable;

    SnowflakeColumn(String dbColumn, boolean filterable, boolean groupable) {
        this.dbColumn = dbColumn;
        this.filterable = filterable;
        this.groupable = groupable;
    }

    public String getDbColumn() {
        return dbColumn;
    }

    public boolean isFilterable() {
        return filterable;
    }

    public boolean isGroupable() {
        return groupable;
    }

    public static Optional<SnowflakeColumn> fromKey(String key) {
        return Arrays.stream(values())
                .filter(col -> col.name().equalsIgnoreCase(key)
                        || col.getDbColumn().equalsIgnoreCase(key))
                .findFirst();
    }
}
