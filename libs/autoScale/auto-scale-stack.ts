import { AutoScalingGroup } from "@aws-cdk/aws-autoscaling";
import { AmazonLinuxImage, InstanceClass, InstanceSize, InstanceType, SecurityGroup, Vpc } from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";

export interface AutoScalingGroupStackProps extends cdk.StackProps {
  readonly vpc: Vpc;
}

export class AutoScalingGroupStack extends cdk.Stack {
  public autoscaling: AutoScalingGroup;
  public props: AutoScalingGroupStackProps;
  public securityGroup: SecurityGroup;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: AutoScalingGroupStackProps
  ) {
    super(scope, id, props);
    this.props = props;

    this.buildAutoScalingGroup();
  }

  private buildAutoScalingGroup() {
    this.autoscaling = new AutoScalingGroup(this, "ASG", {
      vpc: this.props.vpc,
      instanceType: InstanceType.of(
        InstanceClass.BURSTABLE2,
        InstanceSize.MICRO
      ),
      machineImage: new AmazonLinuxImage(),
      securityGroup: this.securityGroup,
    });
  }
}
