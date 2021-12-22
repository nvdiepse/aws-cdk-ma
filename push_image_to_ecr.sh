source $(dirname $0)/variable.config

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ECR

docker tag $SERVICE_NAME:latest $AWS_ECR/$SERVICE_NAME:latest
docker push $AWS_ECR/$SERVICE_NAME:latest

