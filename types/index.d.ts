declare namespace NodeJS {
  interface ProcessEnv {
    HASH_SALT: string;
    DATABASE_URL: string;
    API_HOST: string;
    JWT_SECRET: string;
    REFRESH_JWT_SECRET: string;
    NODE_ENV: string;
    MAILER_PASSWORD: string;
    ORIGIN1: string;
  }
}
