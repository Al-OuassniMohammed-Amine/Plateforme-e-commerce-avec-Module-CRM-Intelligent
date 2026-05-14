import dotenv from "dotenv";
import { type Env, envSchema } from "../validators/env.validator";

dotenv.config();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.flatten().fieldErrors);
  throw new Error("Environment validation failed");
}

export const env: Env = parsedEnv.data;
