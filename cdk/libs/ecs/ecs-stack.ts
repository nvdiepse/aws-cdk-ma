import { Cluster } from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { getServiceName } from '../../helper/common';

export interface EcsStackProps extends cdk.StackProps {}

export class EcsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: EcsStackProps) {
    super(scope, id, props);
    this.buildCluster();
  }

  private buildCluster(): void {
    const cluster = new Cluster(this, getServiceName('cluster'));
  }
}
