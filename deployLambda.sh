# !/bin/bash

export $(grep -v '^#' .env.local | xargs)

# TODO: jsファイル削除・パッケージテンプレート削除・s3削除・定数化
esbuild ./src/lambda/*.ts --bundle --platform=node --target=es2020 --minify --outdir=./dist/lambda --format=cjs
aws cloudformation package --s3-bucket twitter-management-lambda --template-file ./template/lambda.yml --output-template-file ./template/lambda-packaged.yml
aws cloudformation deploy --template-file ./template/lambda-packaged.yml --stack-name twitter-management-lambda --capabilities CAPABILITY_NAMED_IAM CAPABILITY_IAM --parameter-overrides CLIENTID=$CLIENT_ID CLIENTSECRET=$CLIENT_SECRET ENCRYPTIONKEY=$ENCRYPTION_KEY APPAWSACCESSKEYID=$APP_AWS_ACCESS_KEY_ID APPAWSSECRETACCESSKEY=$APP_AWS_SECRET_ACCESS_KEY
aws lambda update-function-event-invoke-config --function-name twitter-management-tweet --maximum-retry-attempts 0