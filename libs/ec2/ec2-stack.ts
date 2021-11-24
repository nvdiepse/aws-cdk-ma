import { Instance, Vpc } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';

export interface Ec2StackProps extends cdk.StackProps {
  readonly props: Ec2StackProps;

}

export class Ec2Stack extends cdk.Stack {
  public ec2: Instance;
  public props: Ec2StackProps;

  constructor(scope: cdk.Construct, id: string, props: Ec2StackProps) {
    super(scope, id, props);

    this.props = props;
    this.buildEc2Stack();
  }
  buildEc2Stack() {
    // this.ec2 = new Instance(this, 'Instance', {
    //   vpc: this.props.vpc,
    // });
  }
}