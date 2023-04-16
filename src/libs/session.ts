import type { IronSessionOptions } from "iron-session";

type Authorize = {
  state: string;
  codeVerifier: string;
  referer: string;
  code?: string;
};

export const sessionOptions: IronSessionOptions = {
  password: {
    1: process.env.COOKIE_PASSWORD_1 ?? "",
    2: process.env.COOKIE_PASSWORD_2 ?? "",
  },
  cookieName: process.env.COOKIE_NAME ?? "",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    authorize: Authorize;
    accessToken: string;
    refreshToken: string;
  }
}
