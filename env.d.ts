declare namespace NodeJS {
  interface ProcessEnv
    extends Readonly<{
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      COOKIE_PASSWORD_1: string;
      COOKIE_PASSWORD_2: string;
      COOKIE_NAME: string;
      BASE_URL: string;
    }> {}
}
