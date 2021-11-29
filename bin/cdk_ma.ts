import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VpcStack } from '../libs/vpc/vpc-stack';
// import { SgStack } from "../libs/vpc/sg-stack";

// import { Peer, Port } from "@aws-cdk/aws-ec2";
// import { Ec2Stack } from "../libs/ec2/ec2-stack";
import { Ec2BastionStack } from '../libs/ec2/ec2-bastion-stack';
import { Ec2PrivateStack } from '../libs/ec2/ec2-private-stack';
import { AlbStack } from '../libs/alb/alb-stack';
// import { AutoScalingGroupStack } from '../libs/autoScale/auto-scale-stack';

const app = new cdk.App();

const env = {
  account: '877952896194',
  region: 'ap-southeast-1',
};

const vpcStack = new VpcStack(app, 'VpcStack', {
  env,
  description: 'Build VPC',
});

const bastionStack = new Ec2BastionStack(app, 'Ec2BastionStack', {
  env,
  vpc: vpcStack.vpc,
  description: 'EC2 BastionStack',
});

const privateStack = new Ec2PrivateStack(app, 'Ec2PrivateStack', {
  env,
  vpc: vpcStack.vpc,
  description: 'EC2 PrivateStack',
});

const albStack = new AlbStack(app, 'AlbStack', {
  env,
  vpc: vpcStack.vpc,
  description: 'AlbStack',
  privateStack: privateStack.instance,
});

// const autoScalingGroupStack = new AutoScalingGroupStack(
//   app,
//   "AutoScalingGroupAlbStack",
//   {
//     env,
//     vpc: vpcStack.vpc,
//     description: "AutoScalingGroupAlbStack",
//   }
// );
