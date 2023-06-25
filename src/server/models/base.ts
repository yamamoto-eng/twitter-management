import { AWS_CONFIG } from "@/constants";

export type Base = {
  HASH: string;
  GSI1HASH: `${(typeof AWS_CONFIG.LOGICAL_TABLES)[keyof typeof AWS_CONFIG.LOGICAL_TABLES]}|${string}`;
  GSI1RANGE: string;
};
