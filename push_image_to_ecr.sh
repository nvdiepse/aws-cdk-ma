source $(dirname $0)/variable.config

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ECR
docker build -t docker-image-ma .
docker tag docker-image-ma:latest $AWS_ECR/docker-image-ma:latest
docker push $AWS_ECR/docker-image-ma:latest
