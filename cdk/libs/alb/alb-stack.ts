import {
  Instance,
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc,
} from '@aws-cdk/aws-ec2';
import { ApplicationLoadBalancer } from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
// import { SgAlbStack } from "./sg-alb-stack";
// import { InstanceIdTarget } from '@aws-cdk/aws-elasticloadbalancingv2-targets';
import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
export interface AlbStackProps extends cdk.StackProps {
  readonly vpc: Vpc;
  readonly asg: AutoScalingGroup;
}

export class AlbStack extends cdk.Stack {
  public props: AlbStackProps;
  public alb: ApplicationLoadBalancer;
  public sgForAlb: SecurityGroup;

  constructor(scope: cdk.Construct, id: string, props: AlbStackProps) {
    super(scope, id, props);
    this.props = props;

    this.buildSgForAlb();
    this.buildAlbStack();
    const listener = this.alb.addListener('Listener', {
      port: 80,
      open: true,
    });

    // Create an AutoScaling group and add it as a load balancing
    // target to the listener.
    listener.addTargets('Alb-target', {
      port: 80,
      targets: [this.props.asg],
      healthCheck: {
        healthyHttpCodes: '200',
        path: '/',
      },
    });
  }

  private buildSgForAlb() {
    this.sgForAlb = new SecurityGroup(this, 'SgAlb', {
      vpc: this.props.vpc,
      allowAllOutbound: true,
    });
    this.sgForAlb.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
  }
  private buildAlbStack() {
    this.alb = new ApplicationLoadBalancer(this, 'Alb-loadBalancer', {
      vpc: this.props.vpc,
      internetFacing: true,
      securityGroup: this.sgForAlb,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
    });
  }
}
