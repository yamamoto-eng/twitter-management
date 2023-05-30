import { AWS_CONFIG } from "@/constants";
import { Lambda } from "@aws-sdk/client-lambda";

export const lambdaClient = new Lambda({
  region: AWS_CONFIG.REGION,
  credentials: {
    accessKeyId: AWS_CONFIG.ACCESS_KEY_ID,
    secretAccessKey: AWS_CONFIG.SECRET_ACCESS_KEY_ID,
  },
});
