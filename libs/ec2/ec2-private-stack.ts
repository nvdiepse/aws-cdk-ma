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
import { SgAlbStack } from "../alb/sg-alb-stack";
import { Ec2BastionStack } from "../ec2/ec2-bastion-stack";
// import * as Ec2BastionStack from "../ec2/ec2-bastion-stack";

export interface Ec2PrivateStackProps extends cdk.StackProps {
  readonly vpc: Vpc;
}

export class Ec2PrivateStack extends cdk.Stack {
  public instance: Instance;
  public sgPrivate: SecurityGroup;
  public userData: UserData;
  public props: Ec2PrivateStackProps;

  constructor(scope: cdk.Construct, id: string, props: Ec2PrivateStackProps) {
    super(scope, id, props);
    this.props = props;

    this.initUserData();
    this.buildSgPrivate();
    this.buildEc2Private();
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

  private buildSgPrivate() {
    this.sgPrivate = new SecurityGroup(this, "SgPrivate", {
      vpc: this.props.vpc,
      allowAllOutbound: true,
    });
    this.sgPrivate.addIngressRule(Peer.anyIpv4(), Port.tcp(22));
    this.sgPrivate.connections.allowFrom(
      // Ec2BastionStack.prototype.sgBastion,
      Peer.anyIpv4(),
      Port.tcp(22)
    );
    this.sgPrivate.connections.allowFrom(
      // SgAlbStack.prototype.securityGroup,
      Peer.anyIpv4(),
      Port.tcp(80)
    );
  }
  private buildEc2Private() {
    this.instance = new Instance(this, "Ec2 Private", {
      vpc: this.props.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_NAT,
      },
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      machineImage: new AmazonLinuxImage({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      securityGroup: this.sgPrivate,
      keyName: "aws_diepnv",
      userData: this.userData,
    });
  }
}
