package com.ck.CloudBalance.aws;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.SdkClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.model.AssumeRoleRequest;
import software.amazon.awssdk.services.sts.model.AssumeRoleResponse;

import java.lang.reflect.InvocationTargetException;

@Configuration
public class AWSConfig {

    @Bean
    public StsClient stsClient() {
        return StsClient.builder().build();
    }

    public static <T extends SdkClient> T getClientWithAssumeRole(Class<T> clientClass,
                                                                  String roleArn,
                                                                  String region)
            throws NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
        StsClient stsClient = StsClient.builder().build();

        AssumeRoleResponse roleResponse = stsClient.assumeRole(AssumeRoleRequest.builder()
                .roleArn(roleArn)
                .roleSessionName("cloud-keeper-session")
                .build());

        AwsCredentials credentials = AwsSessionCredentials.create(
                roleResponse.credentials().accessKeyId(),
                roleResponse.credentials().secretAccessKey(),
                roleResponse.credentials().sessionToken());

        return (T) clientClass.getDeclaredConstructor().newInstance().getClass().getMethod("builder")
                .invoke(null).getClass().getMethod("credentialsProvider", AwsCredentialsProvider.class)
                .invoke(null, StaticCredentialsProvider.create(credentials)).getClass()
                .getMethod("region", Region.class).invoke(null, Region.of(region)).getClass()
                .getMethod("build").invoke(null);
    }
}