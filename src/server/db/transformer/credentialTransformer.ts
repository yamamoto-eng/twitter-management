import { AWS_CONFIG } from "@/constants";
import { CredentialAPP, CredentialDB } from "@/server/models";
import { encryption } from "@/server/utils";

export const credentialTransformer = () => {
  const { encrypt, decrypt } = encryption();

  return {
    toDB: (data: CredentialAPP): CredentialDB => ({
      HASH: data.id,
      GSI1HASH: `${AWS_CONFIG.LOGICAL_TABLES.CREDENTIAL}|${data.id}`,
      GSI1RANGE: data.createdAt,
      accessToken: encrypt(data.accessToken),
      refreshToken: encrypt(data.refreshToken),
      updatedAt: data.updatedAt,
    }),

    toAPP: (data: CredentialDB): CredentialAPP => ({
      id: data.HASH,
      accessToken: decrypt(data.accessToken),
      refreshToken: decrypt(data.refreshToken),
      createdAt: data.GSI1RANGE,
      updatedAt: data.updatedAt,
    }),
  };
};
