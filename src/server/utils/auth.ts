import { twitter } from "@/constants";

const buf = Buffer.from(`${twitter.clientId}:${twitter.secretId}`);
export const auth = buf.toString("base64");
