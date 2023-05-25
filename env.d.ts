declare namespace NodeJS {
  interface ProcessEnv
    extends Readonly<{
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      COOKIE_PASSWORD_1: string;
      COOKIE_PASSWORD_2: string;
      COOKIE_NAME: string;
      BASE_URL: string;
      CALLBACK_URL: string;
      APP_AWS_ACCESS_KEY_ID: string;
      APP_AWS_SECRET_ACCESS_KEY: string;
      ENCRYPTION_KEY: string;
    }> {}
}
