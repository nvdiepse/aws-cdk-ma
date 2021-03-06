import { Vpc } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { LinuxBuildImage, Project, BuildSpec } from '@aws-cdk/aws-codebuild';
import { getServiceName } from '../../helper/common';
import {
  Effect,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from '@aws-cdk/aws-iam';

export interface CodeBuildStackProps extends cdk.StackProps {
  readonly vpc: Vpc;
}

export class CodeBuildStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CodeBuildStackProps) {
    super(scope, id, props);

    this.initCodebuild();
  }

  public initCodebuild() {
    // codeBuildIamPrincipal is shared across stacks.
    const codeBuildIamPrincipal = 'site-publisher';

    // Create a role for our Codebuild so it can be used by other stacks.branchOrRef: '*', // * Covers all branches, tags, commit IDs, etc...
    const adminAccessRole = new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
      roleName: codeBuildIamPrincipal,
    });
    adminAccessRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ['*'], //
        actions: ['*'], // role
      }),
      // managedPolicies: [] //
    );
    new Project(this, 'codebuild', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              'apt update -y',
              'apt install nodejs -y',
              'npm i -g aws-cdk',
              'npm i -g typescript',
              'git clone https://github.com/nvdiepse/aws-cdk-ma.git',
              'cd aws-cdk-ma && npm install',
              'git checkout -b ecs-ecr',
              'git pull',
              'cdk deploy WebStack --require-approval never',
              `export INSTANCE_ID=$(aws cloudformation describe-stacks --stack-name WebStack --output text --query="Stacks[0].Outputs[?OutputKey=='webinstanceid'].OutputValue")`,
              'export AMI_NAME=web-ami-$VERSION_ID',
              `export AMI_ID=$(aws ec2 create-image --instance-id $INSTANCE_ID --name $AMI_NAME --output text)`,
              `aws ec2 wait image-available --image-ids $AMI_ID`, // time init
              `export WEB_STACK_NAME=WebStack-$VERSION_ID`,
              'cdk destroy WebStack --force',
              'cdk deploy AutoScalingGroupAlbStack --require-approval never',
              'cdk deploy AlbStack --require-approval never',
            ],
          },
        },
      }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_5_0,
      },
      environmentVariables: {
        VERSION_ID: {
          value: 'YYYYMMDDHHIISS',
        },
      },
      projectName: `${getServiceName('codebuild')}`,
      role: adminAccessRole,
    });
  }
}
