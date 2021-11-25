import { Peer, Port, SecurityGroup, Vpc } from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";

export interface SgAlbStackProps extends cdk.StackProps {
  readonly vpc: Vpc;
}

export class SgAlbStack extends cdk.Stack {
  public securityGroup: SecurityGroup;
  public props: SgAlbStackProps;

  constructor(scope: cdk.Construct, id: string, props: SgAlbStackProps) {
    super(scope, id, props);
    this.props = props;

    this.buildSgAlbStacks();
  }
  private buildSgAlbStacks() {
    this.securityGroup = new SecurityGroup(this, "SgAlb", {
      vpc: this.props.vpc,
      allowAllOutbound: true,
    });
    this.securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
  }
}
