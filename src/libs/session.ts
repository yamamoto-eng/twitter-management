import type { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  password: {
    1: process.env.COOKIE_PASSWORD_1,
    2: process.env.COOKIE_PASSWORD_2,
  },
  cookieName: process.env.COOKIE_NAME,
  ttl: 0,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    accessToken: string;
    refreshToken: string;
    id: string;
    state: string;
    codeVerifier: string;
    code: string;
  }
}
