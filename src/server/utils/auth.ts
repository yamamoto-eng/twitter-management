import { TWITTER_CONFIG } from "@/constants";

const buf = Buffer.from(`${TWITTER_CONFIG.CLIENT_ID}:${TWITTER_CONFIG.SECRET_ID}`);
export const auth = buf.toString("base64");
