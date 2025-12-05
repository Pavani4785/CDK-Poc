
#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { InfraPocAwsStack } from '../lib/infra-poc-aws-cdk-stack';

const app = new App();

new InfraPocAwsStack(app, 'InfraPocAwsStack', {
  /* If you need a specific account/region, uncomment and set:
  env: { account: '123456789012', region: 'ap-south-1' },
  */
});
