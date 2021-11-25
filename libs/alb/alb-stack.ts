import { Instance, SubnetType, Vpc } from "@aws-cdk/aws-ec2";
import { ApplicationLoadBalancer } from "@aws-cdk/aws-elasticloadbalancingv2";
import * as cdk from "@aws-cdk/core";
import { SgAlbStack } from "./sg-alb-stack";
import { InstanceIdTarget } from "@aws-cdk/aws-elasticloadbalancingv2-targets";
export interface AlbStackProps extends cdk.StackProps {
  readonly vpc: Vpc;
  readonly privateStack: Instance;
}

export class AlbStack extends cdk.Stack {
  public props: AlbStackProps;
  public alb: ApplicationLoadBalancer;

  constructor(scope: cdk.Construct, id: string, props: AlbStackProps) {
    super(scope, id, props);
    this.props = props;

    this.buildAlbStack();
    const listener = this.alb.addListener("Listener", {
      port: 80,
      open: true,
    });

    // Create an AutoScaling group and add it as a load balancing
    // target to the listener.
    listener.addTargets("Alb-target", {
      port: 80,
      targets: [new InstanceIdTarget(this.props.privateStack.instanceId)],
      healthCheck: {
        healthyHttpCodes: "200",
        path: "/",
      },
    });
  }
  private buildAlbStack() {
    this.alb = new ApplicationLoadBalancer(this, "Alb-loadBalancer", {
      vpc: this.props.vpc,
      internetFacing: true,
      securityGroup: SgAlbStack.prototype.securityGroup,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
    });
  }
}
