#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const infra_poc_aws_cdk_stack_1 = require("../lib/infra-poc-aws-cdk-stack");
const app = new aws_cdk_lib_1.App();
new infra_poc_aws_cdk_stack_1.InfraPocAwsStack(app, 'InfraPocAwsStack', {
/* If you need a specific account/region, uncomment and set:
env: { account: '123456789012', region: 'ap-south-1' },
*/
});
