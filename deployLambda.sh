# !/bin/bash

esbuild ./src/lambda/*.ts --bundle --platform=node --target=es2020 --minify --outdir=./dist/lambda --format=cjs
aws cloudformation package --s3-bucket twitter-management-lambda --template-file ./template/lambda.yml --output-template-file ./template/lambda-packaged.yml
aws cloudformation deploy --template-file ./template/lambda-packaged.yml --stack-name twitter-management-lambda --capabilities CAPABILITY_NAMED_IAM CAPABILITY_IAM
