import { twitterConfig } from "@/constants";

const buf = Buffer.from(`${twitterConfig.clientId}:${twitterConfig.secretId}`);
export const auth = buf.toString("base64");
