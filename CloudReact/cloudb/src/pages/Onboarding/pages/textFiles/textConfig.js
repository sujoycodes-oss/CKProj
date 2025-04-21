export const trustPolicyText = `{
  "Version": "2012-10-17",
  "Statement": [
  {
  "Effect": "Allow",
  "Principal": {
      "AWS": "arn:aws:iam::951485052809:root"
  },
  "Action": "sts:AssumeRole",
  "Condition": {
      "StringEquals": {
          "sts:ExternalId": "Um9oaXRDS19ERUZBVUxUZDIzOTJkZTgtN2E0OS00NWQ3LTg3MzItODkyM2ExZTIzMjQw"
          }
      }
  },
  {
      "Effect": "Allow",
      "Principal": {
          "Service": "s3.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
          }
      ]
}`;

export const roleName = "CK-Tuner-Role-dev2";

export const steps = [
  {
    number: 1,
    instruction: "Log into AWS account & <a href=\"www.google.com\">Create an IAM Role.</a>"
  },
  {
    number: 2,
    instruction: "In the <i>Trusted entity type</i> section, select <strong>Custom trust policy.</strong> Replace the prefilled policy with the policy provided below -",
    hasCopyableText: true,
    copyableText: trustPolicyText,
    textareaClass: "policy-textarea",
    buttonClass: "copy-button"
  },
  {
    number: 3,
    instruction: "Click on <strong>Next</strong> to go to the <i>Add permissions page.</i> We would not be adding any permissions for now because the permission policy content will be dependent on the AWS Account ID retrieved from the IAM Role. Click on <strong>Next.</strong>"
  },
  {
    number: 4,
    instruction: "In the <i>Role name field</i>, enter the below-mentioned role name, and click on <strong>Create Role -</strong>",
    hasCopyableText: true,
    copyableText: roleName,
    textareaClass: "role-textarea",
    buttonClass: "role-copy-button"
  },
  {
    number: 5,
    instruction: "Go to the newly create IAM Role and copy the Role ARN -",
    hasImage: true,
    imageSrc: "cktuner",
    imageAlt: "cktuner image",
    imageClass: "cktuner-image"
  },
  {
    number: 6,
    instruction: "Paste the copied Role ARN below -",
    hasForm: true
  }
];