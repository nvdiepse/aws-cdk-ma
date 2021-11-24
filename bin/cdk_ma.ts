import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { VpcStack } from "../libs/vpc/vpc-stack";
// import { SgStack } from "../libs/vpc/sg-stack";

// import { Peer, Port } from "@aws-cdk/aws-ec2";
// import { Ec2Stack } from "../libs/ec2/ec2-stack";
import { Ec2BastionStack } from "../libs/ec2/ec2-bastion-stack";

const app = new cdk.App();

const env = {
  account: "877952896194",
  region: "ap-southeast-1",
};

const vpcStack = new VpcStack(app, "VpcStack", {
  env,
  description: "Build VPC",
});

const bastionStack = new Ec2BastionStack(app, "Ec2BastionStack", {
  env,
  vpc: vpcStack.vpc,
  description: "EC2 BastionStack",
});

// //sg for bastion public
// const sgBastion = new SgStack(app, "SgForBastionStack", {
//   env,
//   description: "Sg for bastion",
//   vpc: vpcStack.vpc,
//   name: "SgForBastionStack",
//   securityGroupName: "SgForBastionStack"
// });
// sgBastion.securityGroup.addIngressRule(
//   Peer.anyIpv4(),
//   Port.tcp(22),
//   "SSH frm anywhere"
// );
// sgBastion.securityGroup.addIngressRule(
//   Peer.anyIpv4(),
//   Port.tcp(80),
//   "PORT 80 for HTTP"
// );

// // // sg for Alb
// const sgAlb = new SgStack(app, "SgForAlbStack", {
//   env,
//   description: "Sg for alb",
//   vpc: vpcStack.vpc,
//   name: "SgForAlbStack",
//   securityGroupName: "SgForAlbStack"
// });
// sgBastion.securityGroup.addIngressRule(
//   Peer.anyIpv4(),
//   Port.tcp(80),
//   "PORT 80 for HTTP"
// );

// // sg for private
// const sgPrivate = new SgStack(app, "SgForPrivate", {
//   env,
//   description: "Sg for private",
//   vpc: vpcStack.vpc,
//   name: "SgForPrivate",
//   securityGroupName: "SgForPrivate"
// });
// sgPrivate.securityGroup.addIngressRule(
//   Peer.anyIpv4(),
//   Port.tcp(22),
//   "SSH frm anywhere"
// );
// sgPrivate.securityGroup.addIngressRule(
//   Peer.anyIpv4(),
//   Port.tcp(80),
//   "PORT 80 for HTTP"
// );

// // // create ec2 bastion
// // const ec2Bastion = new Ec2Stack(app, "Ec2Bastion", {
// //   env,
// //   vpc: vpcStack.vpc,
// //   description: "Ec2 bastion",
// //   securityGroup: sgBastion,
// //   useData: userData,
// // });

// // // create ec2 private
// // const ec2Private = new Ec2Stack(app, "Ec2Private", {
// //   env,
// //   vpc: vpcStack.vpc,
// //   description: "Ec2 private",
// //   securityGroup: sgBastion,
// //   useData: userData,
// // });
