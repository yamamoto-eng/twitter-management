import { Base } from "./base";

export type CredentialAPP = {
  id: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * @property {string} HASH - id
 * @property {string} GSI1HASH - `CREDENTIAL|${id}`
 * @property {string} GSI1RANGE - createdAt
 */
export type CredentialDB = Base & {
  accessToken: string;
  refreshToken: string;
  updatedAt: string;
};
