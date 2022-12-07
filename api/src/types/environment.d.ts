export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HTTPHOST: string;
      HTTPPORT: number;
      PGHOST: string;
      PGUSER: string;
      PGPASSWORD: string;
      PGDATABASE: string;
    }
  }
}
