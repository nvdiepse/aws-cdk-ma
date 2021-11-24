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
} from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";

export interface Ec2BastionStackProps extends cdk.StackProps {
  readonly vpc: Vpc;
}

export class Ec2BastionStack extends cdk.Stack {
  public instance: Instance;
  public sgBastion: SecurityGroup;
  public userData: UserData;
  public props: Ec2BastionStackProps;

  constructor(scope: cdk.Construct, id: string, props: Ec2BastionStackProps) {
    super(scope, id, props);
    this.props = props;

    this.initUserData();
    this.buildSgBastion();
    this.buildEc2Bastion();
  }
  private initUserData() {
    this.userData = UserData.forLinux();
    this.userData.addCommands(
      "sudo -i",
      "yum install -y httpd",
      "systemctl start httpd",
      "systemctl enable httpd",
      'echo "<h1>Hello World!</h1>" > /var/www/html/index.html'
    );
  }

  private buildSgBastion() {
    this.sgBastion = new SecurityGroup(this, "SgBastion", {
      vpc: this.props.vpc,
      allowAllOutbound: true,
    });
    this.sgBastion.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
    this.sgBastion.addIngressRule(Peer.anyIpv4(), Port.tcp(22));
  }
  private buildEc2Bastion() {
    this.instance = new Instance(this, "Ec2 Bastion", {
      vpc: this.props.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      machineImage: new AmazonLinuxImage({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      securityGroup: this.sgBastion,
      keyName: "aws_diepnv",
      userData: this.userData,
    });
  }
}
