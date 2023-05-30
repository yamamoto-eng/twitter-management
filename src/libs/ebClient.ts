import { AWS_CONFIG } from "@/constants";
import { EventBridgeClient } from "@aws-sdk/client-eventbridge";

export const ebClient = new EventBridgeClient({
  region: AWS_CONFIG.REGION,
  credentials: {
    accessKeyId: AWS_CONFIG.ACCESS_KEY_ID,
    secretAccessKey: AWS_CONFIG.SECRET_ACCESS_KEY_ID,
  },
});
