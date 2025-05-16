package com.ck.CloudBalance.service;

import com.ck.CloudBalance.dto.RDSInstanceDTO;
import com.ck.CloudBalance.enumFiles.AwsRegionName;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.rds.RdsClient;
import software.amazon.awssdk.services.rds.model.*;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.model.AssumeRoleRequest;
import software.amazon.awssdk.services.sts.model.AssumeRoleResponse;

import java.util.ArrayList;
import java.util.List;

@Service
public class RDSService {

    public List<RDSInstanceDTO> fetchInstances(String roleArn, String region) {
        StsClient stsClient = StsClient.builder()
                .region(Region.of(region))
                .build();

        AssumeRoleRequest assumeRoleRequest = AssumeRoleRequest.builder()
                .roleArn(roleArn)
                .roleSessionName("fetchRdsSession")
                .build();

        AssumeRoleResponse assumeRoleResponse = stsClient.assumeRole(assumeRoleRequest);

        AwsSessionCredentials tempCredentials = AwsSessionCredentials.create(
                assumeRoleResponse.credentials().accessKeyId(),
                assumeRoleResponse.credentials().secretAccessKey(),
                assumeRoleResponse.credentials().sessionToken()
        );

        RdsClient rdsClient = RdsClient.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(tempCredentials))
                .build();

        DescribeDbInstancesResponse response = rdsClient.describeDBInstances();

        List<RDSInstanceDTO> instanceList = new ArrayList<>();
        for (DBInstance dbInstance : response.dbInstances()) {
            String resourceId = dbInstance.dbInstanceArn();
            String resourceName = dbInstance.dbInstanceIdentifier(); // fallback
            try {
                ListTagsForResourceResponse tagResponse = rdsClient.listTagsForResource(
                        ListTagsForResourceRequest.builder()
                                .resourceName(resourceId)
                                .build()
                );
                resourceName = tagResponse.tagList().stream()
                        .filter(tag -> "Name".equals(tag.key()))
                        .map(Tag::value)
                        .findFirst()
                        .orElse(dbInstance.dbInstanceIdentifier());
            } catch (Exception e) {
                System.out.println("Failed to fetch tags for RDS instance: " + dbInstance.dbInstanceIdentifier());
            }

            instanceList.add(new RDSInstanceDTO(
                    resourceId,
                    resourceName,
                    dbInstance.engine(),
                    AwsRegionName.getFriendlyName(region),
                    dbInstance.dbInstanceStatus()
            ));
        }

        return instanceList;
    }


    public List<RDSInstanceDTO> getAllRDSInstances() {
        RdsClient rdsClient = RdsClient.create();
        DescribeDbInstancesRequest request = DescribeDbInstancesRequest.builder().build();
        DescribeDbInstancesResponse response = rdsClient.describeDBInstances(request);

        List<RDSInstanceDTO> rdsInstances = new ArrayList<>();

        for (DBInstance dbInstance : response.dbInstances()) {
            RDSInstanceDTO rdsInstance = RDSInstanceDTO.builder()
                    .resourceId(dbInstance.dbInstanceArn())
                    .resourceName(dbInstance.dbName() != null ? dbInstance.dbName() : "N/A")
                    .engine(dbInstance.engine())
                    .region(dbInstance.availabilityZone())
                    .status(dbInstance.dbInstanceStatus())
                    .build();

            rdsInstances.add(rdsInstance);
        }

        return rdsInstances;
    }
}