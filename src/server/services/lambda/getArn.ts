import { AWS_CONFIG } from "@/constants";
import { lambdaClient } from "@/libs";

type Args = {
  functionName: (typeof AWS_CONFIG.LAMBDA_FUNCTION_NAME)[keyof typeof AWS_CONFIG.LAMBDA_FUNCTION_NAME];
};

export const getArn = async (args: Args) => {
  const { Configuration } = await lambdaClient.getFunction({ FunctionName: args.functionName });

  return { arn: Configuration?.FunctionArn };
};
