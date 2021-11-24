import { SecurityGroup, Vpc } from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";
import { getServiceName } from "../../helper/common";

export interface SgStackProps extends cdk.StackProps {
  readonly vpc: Vpc;
}

export class SgStack extends cdk.Stack {
  public securityGroup: SecurityGroup;
  public props: SgStackProps;

  constructor(scope: cdk.Construct, id: string, props: SgStackProps) {
    super(scope, id, props);
    this.props = props;
    this.buildSgStack();
  }

  buildSgStack() {
    this.securityGroup = new SecurityGroup(this, "sg-bastion", {
      vpc: this.props.vpc,
      allowAllOutbound: true,
      securityGroupName: "Sg-bastion",
      description: "Sg for bastion",
    });
  }
}
