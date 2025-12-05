
# AWS CDK TypeScript POC

This project provisions a minimal AWS infrastructure using **AWS CDK (v2) with TypeScript**:

- **VPC** with up to 2 Availability Zones, no NAT Gateway (lower cost)
- **S3 Bucket** with versioning, encryption, SSL-only, and public access blocked

## Prerequisites
- Node.js >= 18
- AWS CLI configured (`aws configure`)
- AWS CDK installed globally (`npm i -g aws-cdk`) or use `npx cdk`
- An AWS account with sufficient permissions

## Quickstart
```bash
npm install
# optional: set AWS profile
export AWS_PROFILE=default

# First time per account/region only
npx cdk bootstrap aws://<ACCOUNT_ID>/<REGION>

# synthesize and deploy
npm run synth
npm run deploy
```

To destroy the stack:
```bash
npm run destroy
```

## Region
By default, CDK uses your CLI default region. To pin, edit `bin/infra-poc-aws-cdk.ts` and set:
```ts
env: { account: '<ACCOUNT_ID>', region: 'ap-south-1' }
```

## Notes
- VPC without NAT is great for POCs; consider NAT for workloads needing outbound internet from private subnets.
- S3 bucket name is auto-generated; to fix a custom name, add `bucketName: 'my-unique-bucket'`.
- Costs: VPC subnets/route tables are free; data transfer and NAT (if enabled) costs; S3 storage costs per GB.
