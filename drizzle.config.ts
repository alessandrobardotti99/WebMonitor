import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "db/schema.ts",  // Percorso dello schema
  out: "./drizzle",  // Cartella delle migrazioni
  dialect: "postgresql",  // Dialetto corretto per PostgreSQL
  dbCredentials: {
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string, 10),
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    ssl: "require",  // Neon richiede SSL abilitato
  },
});
