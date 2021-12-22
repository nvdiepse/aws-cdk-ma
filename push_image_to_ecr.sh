source $(dirname $0)/variable.config

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ECR

docker pull node:14.1.0-alpine
docker tag node:14.1.0-alpine $AWS_ECR/$SERVICE_NAME
docker push $AWS_ECR/$SERVICE_NAME

