import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL non è definita!");
  }
  

export const db = drizzle(sql);
