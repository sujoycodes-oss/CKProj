package com.ck.CloudBalance.enumFiles;

public enum AwsRegionName {
    US_EAST_1("us-east-1", "N. Virginia"),
    US_EAST_2("us-east-2", "Ohio"),
    US_WEST_1("us-west-1", "N. California"),
    US_WEST_2("us-west-2", "Oregon"),
    AP_SOUTH_1("ap-south-1", "Mumbai"),
    AP_NORTHEAST_1("ap-northeast-1", "Tokyo"),
    AP_NORTHEAST_2("ap-northeast-2", "Seoul"),
    AP_NORTHEAST_3("ap-northeast-3", "Osaka"),
    AP_SOUTHEAST_1("ap-southeast-1", "Singapore"),
    AP_SOUTHEAST_2("ap-southeast-2", "Sydney"),
    CA_CENTRAL_1("ca-central-1", "Central Canada"),
    EU_CENTRAL_1("eu-central-1", "Frankfurt"),
    EU_WEST_1("eu-west-1", "Ireland"),
    EU_WEST_2("eu-west-2", "London"),
    EU_WEST_3("eu-west-3", "Paris"),
    EU_NORTH_1("eu-north-1", "Stockholm"),
    SA_EAST_1("sa-east-1", "São Paulo");

    private final String code;
    private final String name;

    AwsRegionName(String code, String name) {
        this.code = code;
        this.name = name;
    }

    public static String getFriendlyName(String regionCode) {
        for (AwsRegionName region : values()) {
            if (region.code.equalsIgnoreCase(regionCode)) {
                return region.name;
            }
        }
        return regionCode;
    }
}
