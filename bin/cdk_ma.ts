import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { VpcStack } from "../libs/vpc/vpc-stack";
import { SgStack } from "../libs/vpc/sg-stack";

import { Peer, Port } from "@aws-cdk/aws-ec2";
// import { Ec2Stack } from "../libs/ecs/ec2-stack";
const app = new cdk.App();

const env = {
  account: "877952896194",
  region: "ap-southeast-1",
}

const vpcStack = new VpcStack(app, "VpcStack", {
  env,
  description: "Build vpc",
});

//sg for bastion public
const sgBastion = new SgStack(app, "SgBastionStack", {
  env,
  description: "Sg bastion",
  vpc: vpcStack.vpc,
});
sgBastion.securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(22), 'SSH frm anywhere');
sgBastion.securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80), 'PORT 80 for HTTP');

// // sg for Ald
// const sgAlb = new SgStack(app, getServiceName("sg-alb"), {
//   description: "Sg alb",
//   vpc: vpcStack.vpc,
//   allowAllOutbound: true,
// });
// sgAlb.addIngressRule(Peer.anyIpv4(), Port.tcp(80), 'PORT 80 for HTTP');

// // sg for private
// const sgForPrivate = new SgStack(app, getServiceName("sg-for-private"), {
//   description: "Sg-for-private",
//   vpc: vpcStack.vpc,
//   allowAllOutbound: true,
// });
// sgForPrivate.addIngressRule(Peer.anyIpv4(), Port.tcp(22), 'SSH frm anywhere');
// sgForPrivate.addIngressRule(Peer.anyIpv4(), Port.tcp(80), 'PORT 80 for HTTP');

