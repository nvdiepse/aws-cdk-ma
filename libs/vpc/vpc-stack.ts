import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { getServiceName } from "../../helper/common";
import { SubnetType, Vpc } from "@aws-cdk/aws-ec2";

export class VpcStack extends Stack {
  public vpc: Vpc;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.buildVpcStack();
  }
  private buildVpcStack() {
    this.vpc = new Vpc(this, getServiceName("vpc"), {
      cidr: "10.0.0.0/16",
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 28,
          name: "public-subnet",
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 28,
          name: "private-subnet",
          subnetType: SubnetType.PRIVATE_WITH_NAT,
        },
      ],
    });
  }
}


// import { SubnetType, Vpc } from '@aws-cdk/aws-ec2'
// import { Stack, Construct, StackProps } from '@aws-cdk/core'

// export class VpcStack extends Stack {
//   public vpc: Vpc

//   constructor(scope: Construct, id: string, props: StackProps) {
//     super(scope, id, props)
//     this.buildVpc()
//   }

//   private buildVpc() {
//     const cidrMask = Number(process.env.CIDR_MASK)
//     this.vpc = new Vpc(this, 'vpc', {
//       cidr: process.env.VPC_CIDR,
//       maxAzs: 2,
//       natGateways: 1,
//       enableDnsHostnames: true,
//       enableDnsSupport: true,
//       subnetConfiguration: [
//         {
//           cidrMask,
//           name: 'public',
//           subnetType: SubnetType.PUBLIC,
//         },
//         {
//           cidrMask,
//           name: 'private',
//           subnetType: SubnetType.PRIVATE_WITH_NAT,
//         },
//         {
//           cidrMask,
//           name: 'isolate',
//           subnetType: SubnetType.PRIVATE_ISOLATED,
//         },
//       ],
//     })
//   }
// }