declare module "bcryptjs";
declare module "dockerode";
declare module "node-ssh";
declare module "sqlite3";
declare module "jsonwebtoken";
declare module "otplib";
declare module "axios";
declare module "cheerio";
declare module "pdf-parse";
declare module "mammoth";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
    }
  }
}
