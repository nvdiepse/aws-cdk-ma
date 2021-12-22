# Aws cdk typescript for Staterit

## create file variable.config
```
AWS_ACCOUNT=xxxxx
AWS_REGION=xxxxx
AWS_ECR=xxxxx
SERVICE_NAME=xxxxx
```

## build image
```
bash docker/dev/start.sh
```
## push image to ecr
```
bash push_image_to_ecr.sh
```
## stop docker
```
bash docker/dev/stop.sh
```