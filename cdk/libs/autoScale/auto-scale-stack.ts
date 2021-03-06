import { AutoScalingGroup } from '@aws-cdk/aws-autoscaling';
import {
  AmazonLinuxImage,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  Peer,
  Port,
  SecurityGroup,
  Vpc,
} from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { getServiceName } from '../../helper/common';

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
    props: AutoScalingGroupStackProps,
  ) {
    super(scope, id, props);
    this.props = props;

    const AMI_NAME = <string>process.env.AMI_NAME;
    this.buildSecurityGroup();
    this.buildAutoScalingGroup(AMI_NAME);
  }

  private buildSecurityGroup() {
    this.securityGroup = new SecurityGroup(this, getServiceName('sg-auto-scale'), {
      vpc: this.props.vpc,
      allowAllOutbound: true,
    });
    this.securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
    this.securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(22));
  }

  private buildAutoScalingGroup(amiName: string) {
    this.autoscaling = new AutoScalingGroup(this, 'ASG', {
      vpc: this.props.vpc,
      instanceType: InstanceType.of(
        InstanceClass.BURSTABLE2,
        InstanceSize.MICRO,
      ),
      machineImage: MachineImage.lookup({
        name: amiName,
      }),
      securityGroup: this.securityGroup,
      minCapacity: 1,
      maxCapacity: 2,
    });
  }
}
