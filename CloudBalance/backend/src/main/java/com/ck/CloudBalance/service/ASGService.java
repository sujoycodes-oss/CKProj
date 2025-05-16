package com.ck.CloudBalance.service;

import com.ck.CloudBalance.dto.ASGInstanceDTO;
import com.ck.CloudBalance.enumFiles.AwsRegionName;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.autoscaling.AutoScalingClient;
import software.amazon.awssdk.services.autoscaling.model.*;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.model.AssumeRoleRequest;
import software.amazon.awssdk.services.sts.model.AssumeRoleResponse;
import software.amazon.awssdk.services.sts.model.GetCallerIdentityResponse;

import java.util.ArrayList;
import java.util.List;

@Service
public class ASGService {

    public List<ASGInstanceDTO> fetchInstances(String roleArn, String region) {
        // Use ~/.aws/credentials
        StsClient stsClient = StsClient.builder()
                .region(Region.of(region))
                .credentialsProvider(ProfileCredentialsProvider.create()) // uses default profile
                .build();

        AssumeRoleRequest assumeRoleRequest = AssumeRoleRequest.builder()
                .roleArn(roleArn)
                .roleSessionName("fetchAsgSession")
                .build();

        AssumeRoleResponse assumeRoleResponse = stsClient.assumeRole(assumeRoleRequest);

        AwsSessionCredentials tempCredentials = AwsSessionCredentials.create(
                assumeRoleResponse.credentials().accessKeyId(),
                assumeRoleResponse.credentials().secretAccessKey(),
                assumeRoleResponse.credentials().sessionToken()
        );

        AutoScalingClient asgClient = AutoScalingClient.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(tempCredentials))
                .build();

        String accountId = getAwsAccountId(stsClient);

        DescribeAutoScalingGroupsRequest request = DescribeAutoScalingGroupsRequest.builder().build();
        DescribeAutoScalingGroupsResponse response = asgClient.describeAutoScalingGroups(request);

        List<ASGInstanceDTO> asgInstances = new ArrayList<>();

        for (AutoScalingGroup asg : response.autoScalingGroups()) {
            String asgArn = String.format("arn:aws:autoscaling:%s:%s:autoScalingGroup:*:autoScalingGroupName/%s",
                    region, accountId, asg.autoScalingGroupName());

            String resourceName = asg.tags().stream()
                    .filter(tag -> "Name".equals(tag.key()))
                    .map(TagDescription::value)
                    .findFirst()
                    .orElse(asg.autoScalingGroupName());

            String status = "Active";
            if (asg.instances().isEmpty()) {
                status = "Empty";
            } else {
                boolean allInService = asg.instances().stream()
                        .allMatch(instance -> "InService".equals(instance.lifecycleState()));
                if (!allInService) {
                    status = "RUNNING";
                }
            }

            ASGInstanceDTO asgInstance = ASGInstanceDTO.builder()
                    .resourceId(asgArn)
                    .resourceName(resourceName)
                    .minSize(asg.minSize())
                    .maxSize(asg.maxSize())
                    .desiredCapacity(asg.desiredCapacity())
                    .region(AwsRegionName.getFriendlyName(region))
                    .status(status)
                    .build();

            asgInstances.add(asgInstance);
        }

        return asgInstances;
    }

    private String getAwsAccountId(StsClient stsClient) {
        try {
            GetCallerIdentityResponse identity = stsClient.getCallerIdentity();
            return identity.account();
        } catch (Exception e) {
            return "unknown-account";
        }
    }
}

