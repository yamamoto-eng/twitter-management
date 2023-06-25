import { Base } from "./base";

/**
 * @property {string} id - id
 * @property {string} GSI1HASH - `CREDENTIAL|${id}`
 * @property {string} GSI1RANGE - createdAt
 */
export type CredentialAPP = {
  id: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
};

export type CredentialDB = Base & {
  accessToken: string;
  refreshToken: string;
  updatedAt: string;
};
