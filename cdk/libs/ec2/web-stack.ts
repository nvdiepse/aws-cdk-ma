import {
  AmazonLinuxGeneration,
  AmazonLinuxImage,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  UserData,
  Vpc,
} from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { getServiceName } from '../../helper/common';

export interface WebStackProps extends cdk.StackProps {
  readonly vpc: Vpc;
}

export class WebStack extends cdk.Stack {
  public instance: Instance;
  public sg: SecurityGroup;
  public userData: UserData;
  public props: WebStackProps;

  constructor(scope: cdk.Construct, id: string, props: WebStackProps) {
    super(scope, id, props);
    this.props = props;

    this.initUserData();
    this.buildSg();
    this.buildEc2();

    new cdk.CfnOutput(this, 'web-instance-id', {
      value: this.instance.instanceId,
      exportName: 'webInstanceId',
    });
  }
  private initUserData() {
    this.userData = UserData.forLinux();
    this.userData.addCommands(
      'sudo -i',
      'echo "INSTALL NODE"',
      'curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -',
      'sudo yum install -y nodejs',
      'sudo yum -y install gcc-c++ make',
      'node -v',
      'echo "INSTALL PHP"',
      'sudo yum install -y amazon-linux-extras',
      'sudo amazon-linux-extras enable php7.4',
      'sudo yum clean metadata',
      'sudo yum install php php-{pear,cgi,common,curl,mbstring,gd,mysqlnd,gettext,bcmath,json,xml,fpm,intl,zip,imap} --require-approval never',
      'php --version',
      'yum install -y httpd',
      'systemctl start httpd',
      'systemctl enable httpd',
      'echo "<h1>Hello Worldsdasd!</h1>" > /var/www/html/index.html',
    );
  }

  private buildSg() {
    this.sg = new SecurityGroup(this, getServiceName('sg-for-web'), {
      vpc: this.props.vpc,
      allowAllOutbound: true,
    });
    this.sg.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
    this.sg.addIngressRule(Peer.anyIpv4(), Port.tcp(22));
  }
  private buildEc2() {
    this.instance = new Instance(this, 'Ec2', {
      vpc: this.props.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_NAT,
      },
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      machineImage: new AmazonLinuxImage({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      securityGroup: this.sg,
      keyName: 'aws_diepnv',
      userData: this.userData,
    });
  }
}
