import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class InfraPocAwsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1) VPC (2 AZs, no NAT to keep costs minimal)
    const vpc = new ec2.Vpc(this, 'PocVpc', {
      maxAzs: 2,
      natGateways: 0,
    });

    // 2) S3 Bucket (secure defaults)
    const bucket = new s3.Bucket(this, 'PocBucket', {
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      lifecycleRules: [{ expiration: Duration.days(30) }],
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
    });

    // 3) ECR Repository (secure defaults + lifecycle)
    const repo = new ecr.Repository(this, 'PocRepo', {
      repositoryName: 'poc-app',
      imageScanOnPush: true,
      encryption: ecr.RepositoryEncryption.KMS,
      // POC-friendly cleanup; for production you typically keep RETAIN:
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteImages: true,
      lifecycleRules: [
        {
          tagStatus: ecr.TagStatus.ANY,
          maxImageCount: 10, // keep latest 10 images
        },
      ],
    });

    // Useful outputs
    this.exportValue(vpc.vpcId, { name: 'VpcId' });
    this.exportValue(bucket.bucketName, { name: 'BucketName' });
    this.exportValue(repo.repositoryName, { name: 'EcrRepoName' });
    this.exportValue(repo.repositoryUri, { name: 'EcrRepoUri' });
  }
}
