package com.ck.CloudBalance.controller;

import com.ck.CloudBalance.dto.ASGInstanceDTO;
import com.ck.CloudBalance.dto.EC2InstanceDTO;
import com.ck.CloudBalance.dto.RDSInstanceDTO;
import com.ck.CloudBalance.entity.UserCloudAccount;
import com.ck.CloudBalance.repository.CloudAccountRepository;
import com.ck.CloudBalance.service.ASGService;
import com.ck.CloudBalance.service.EC2Service;
import com.ck.CloudBalance.service.RDSService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/aws")
public class AwsController {

    private final EC2Service ec2Service;
    private final ASGService asgService;
    private final RDSService rdsService;
    private final CloudAccountRepository cloudAccountRepository;

    public AwsController(EC2Service ec2Service, ASGService asgService, RDSService rdsService, CloudAccountRepository cloudAccountRepository) {
        this.ec2Service = ec2Service;
        this.asgService = asgService;
        this.rdsService = rdsService;
        this.cloudAccountRepository = cloudAccountRepository;
    }

    @GetMapping("/instances")
    public List<EC2InstanceDTO> getEC2Instances() {
        return ec2Service.getAllEC2Instances();
    }

    @GetMapping("/asg/{cloudAccountId}")
    public ResponseEntity<List<ASGInstanceDTO>> getAutoScalingGroups(@PathVariable Long cloudAccountId) {
        UserCloudAccount cloudAccount = cloudAccountRepository.findByCloudAccountId(cloudAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Cloud account not found"));
        List<ASGInstanceDTO> asgInstances = asgService.fetchInstances(cloudAccount.getArn(), cloudAccount.getRegion());
        return ResponseEntity.ok(asgInstances);
    }


    @GetMapping("/rds")
    public ResponseEntity<List<RDSInstanceDTO>> getAllRdsInstances() {
        return ResponseEntity.ok(rdsService.getAllRDSInstances());
    }

    @GetMapping("/rds/{cloudAccountId}")
    public ResponseEntity<List<RDSInstanceDTO>> getRdsInstances(@PathVariable Long cloudAccountId) {
        UserCloudAccount cloudAccount = cloudAccountRepository.findByCloudAccountId(cloudAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Cloud account not found"));

        List<RDSInstanceDTO> rdsInstances = rdsService.fetchInstances(cloudAccount.getArn(), cloudAccount.getRegion());

        return ResponseEntity.ok(rdsInstances);
    }

    @GetMapping("/ec2/{cloudAccountId}")
    public ResponseEntity<List<EC2InstanceDTO>> getEc2Instances(@PathVariable Long cloudAccountId) {
        UserCloudAccount cloudAccount = cloudAccountRepository.findByCloudAccountId(cloudAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Cloud account not found"));

        List<EC2InstanceDTO> ec2Instances = ec2Service.fetchInstances(cloudAccount.getArn(), cloudAccount.getRegion());

        return ResponseEntity.ok(ec2Instances);
    }
}
