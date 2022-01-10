import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VpcStack } from '../libs/vpc/vpc-stack';
import { Ec2BastionStack } from '../libs/ec2/ec2-bastion-stack';
import { Ec2PrivateStack } from '../libs/ec2/ec2-private-stack';
import { AlbStack } from '../libs/alb/alb-stack';
import { CodeBuildStack } from '../libs/codebuild/codebuild-stack';
import { AutoScalingGroupStack } from '../libs/autoScale/auto-scale-stack';
import { EcsStack } from '../libs/ecs/ecs-stack';

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

const codebuild = new CodeBuildStack(app, 'CodeBuildStack', {
  env,
  vpc: vpcStack.vpc,
  description: 'Codebuild Stack',
});

const autoScalingGroupStack = new AutoScalingGroupStack(
  app,
  'AutoScalingGroupAlbStack',
  {
    env,
    vpc: vpcStack.vpc,
    description: 'AutoScalingGroupAlbStack',
  },
);

const albStack = new AlbStack(app, 'AlbStack', {
  env,
  vpc: vpcStack.vpc,
  description: 'AlbStack',
  asg: autoScalingGroupStack.autoscaling,
});

const ec2Stack = new EcsStack(app, 'EC2Stack', {
  env,
  vpc: vpcStack.vpc,
  description: 'ECSStack',
});
