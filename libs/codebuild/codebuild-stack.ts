import { Vpc } from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { LinuxBuildImage, Project, BuildSpec } from '@aws-cdk/aws-codebuild';
import { getServiceName } from '../../helper/common';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';

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
    const sitePublisherCodeBuild = new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
      roleName: codeBuildIamPrincipal,
    });
    new Project(this, 'codebuild', {
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              'echo "=== CODE BUILD ==="',
              'apt update -y',
              'apt install nodejs -y',
              'npm i -g aws-cdk',
              'cdk --version',
              'npm i -g typescript',
              'node --version',
              'git --version',
              'git clone https://github.com/nvdiepse/aws-cdk-ma.git',
              'cd aws-cdk-ma && npm install',
              'cdk deploy WebStack --require-approval never',

              // "export VERSION=$(date +\\%Y\\%m\\%d\\%H\\%M\\%S)",
              // "git clone https://github.com/nvdiepse/aws-cdk-ma.git",
              // "cd aws-cdk-ma && npm install",
            ],
          },
        },
      }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_5_0,
      },
      projectName: `${getServiceName('codebuild')}`,
      role: sitePublisherCodeBuild,
    });
  }
}
