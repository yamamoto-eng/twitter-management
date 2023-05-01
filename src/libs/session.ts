import type { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  password: {
    1: "8HDplabQPHikfrG2Y4JwqoJXL7Taethf",
    2: "8HDplabQPHikfrG2Y4JwqoJXL7Taethf",
  },
  cookieName: "test-name",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    accessToken: string;
    refreshToken: string;
    state: string;
    codeVerifier: string;
    code: string;
  }
}
