package com.ck.CloudBalance.service;

import com.ck.CloudBalance.dto.EC2InstanceDTO;
import com.ck.CloudBalance.enumFiles.AwsRegionName;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.ec2.model.*;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.model.AssumeRoleRequest;
import software.amazon.awssdk.services.sts.model.AssumeRoleResponse;

import java.util.ArrayList;
import java.util.List;

@Service
public class EC2Service {

    public List<EC2InstanceDTO> fetchInstances(String roleArn, String region) {
        StsClient stsClient = StsClient.builder()
                .region(Region.of(region))
                .credentialsProvider(ProfileCredentialsProvider.create())
                .build();

        AssumeRoleRequest assumeRoleRequest = AssumeRoleRequest.builder()
                .roleArn(roleArn)
                .roleSessionName("fetchEc2Session")
                .build();

        AssumeRoleResponse assumeRoleResponse = stsClient.assumeRole(assumeRoleRequest);

        AwsSessionCredentials tempCredentials = AwsSessionCredentials.create(
                assumeRoleResponse.credentials().accessKeyId(),
                assumeRoleResponse.credentials().secretAccessKey(),
                assumeRoleResponse.credentials().sessionToken()
        );

        Ec2Client ec2Client = Ec2Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(tempCredentials))
                .build();

        DescribeInstancesResponse response = ec2Client.describeInstances();

        List<EC2InstanceDTO> ec2Instances = new ArrayList<>();

        for (Reservation reservation : response.reservations()) {
            for (Instance instance : reservation.instances()) {
                EC2InstanceDTO ec2Instance = EC2InstanceDTO.builder()
                        .resourceId(instance.instanceId())
                        .resourceName(instance.tags().stream()
                                .filter(tag -> tag.key().equals("Name"))
                                .findFirst()
                                .map(Tag::value)
                                .orElse("N/A"))
                        .region(AwsRegionName.getFriendlyName(
                                instance.placement().availabilityZone().substring
                                        (0, instance.placement().availabilityZone().length() - 1)
                        ))
                        .state(instance.state().name().toString())
                        .build();

                ec2Instances.add(ec2Instance);
            }
        }

        return ec2Instances;
    }

    public List<EC2InstanceDTO> getAllEC2Instances() {
        Ec2Client ec2Client = Ec2Client.create();

        DescribeInstancesResponse response = ec2Client.describeInstances();

        List<EC2InstanceDTO> ec2Instances = new ArrayList<>();

        for (Reservation reservation : response.reservations()) {
            for (Instance instance : reservation.instances()) {
                EC2InstanceDTO ec2Instance = EC2InstanceDTO.builder()
                        .resourceId(instance.instanceId())
                        .resourceName(instance.tags().stream()
                                .filter(tag -> tag.key().equals("Name"))
                                .findFirst()
                                .map(Tag::value)
                                .orElse("N/A"))
                        .region(AwsRegionName.getFriendlyName(
                                instance.placement().availabilityZone().substring(0, instance.placement().availabilityZone().length() - 1)
                        ))
                        .state(instance.state().name().toString())
                        .build();

                ec2Instances.add(ec2Instance);
            }
        }

        return ec2Instances;
    }
}
