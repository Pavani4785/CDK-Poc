"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfraPocAwsStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const s3 = __importStar(require("aws-cdk-lib/aws-s3"));
const ec2 = __importStar(require("aws-cdk-lib/aws-ec2"));
const ecr = __importStar(require("aws-cdk-lib/aws-ecr"));
class InfraPocAwsStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
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
            lifecycleRules: [{ expiration: aws_cdk_lib_1.Duration.days(30) }],
            encryption: s3.BucketEncryption.S3_MANAGED,
            enforceSSL: true,
        });
        // 3) ECR Repository (secure defaults + lifecycle)
        const repo = new ecr.Repository(this, 'PocRepo', {
            repositoryName: 'poc-app',
            imageScanOnPush: true,
            encryption: ecr.RepositoryEncryption.KMS,
            // POC-friendly cleanup; for production you typically keep RETAIN:
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
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
exports.InfraPocAwsStack = InfraPocAwsStack;
