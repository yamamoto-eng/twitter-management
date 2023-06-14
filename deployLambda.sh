# !/bin/bash

export $(grep -v '^#' .env.local | xargs)

BUCKET_NAME=twitter-management-lambda-bucket-$(openssl rand -hex 12)
OUTPUT_TEMPLATE_YML=./lambda/lambda-packaged.yml

aws s3 mb s3://$BUCKET_NAME
mkdir ./lambda

esbuild ./src/lambda/*.ts --bundle --platform=node --target=es2020 --minify --outdir=./lambda/bundle --format=cjs
  aws cloudformation package --s3-bucket $BUCKET_NAME --template-file ./template/lambda.yml --output-template-file $OUTPUT_TEMPLATE_YML
aws cloudformation deploy --template-file $OUTPUT_TEMPLATE_YML --stack-name twitter-management-lambda --capabilities CAPABILITY_NAMED_IAM CAPABILITY_IAM --parameter-overrides CLIENTID=$CLIENT_ID CLIENTSECRET=$CLIENT_SECRET ENCRYPTIONKEY=$ENCRYPTION_KEY APPAWSACCESSKEYID=$APP_AWS_ACCESS_KEY_ID APPAWSSECRETACCESSKEY=$APP_AWS_SECRET_ACCESS_KEY
aws lambda update-function-event-invoke-config --function-name twitter-management-tweet --maximum-retry-attempts 0
aws lambda update-function-event-invoke-config --function-name twitter-management-deleteTweet --maximum-retry-attempts 0

aws s3 rb s3://$BUCKET_NAME --force
rm -r ./lambda