import { pgTable, text, timestamp, uuid, real, integer, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

// Tabella utenti 
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Tabella dei siti monitorati
export const sites = pgTable("sites", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Collegamento con gli utenti
  slug: text("slug").notNull().unique(),
  url: text("url").notNull().unique(),
  monitoringCode: text("monitoring_code").notNull().unique(),
  status: text("status").notNull(), // healthy, warning, error
  lastUpdate: timestamp("last_update").default(sql`now()`),
});

// Tabella delle metriche di performance (legata ai siti)
export const performanceMetrics = pgTable("performance_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteId: uuid("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }), // Legato al sito
  time: text("time").notNull(), // Esempio: '00:00', '04:00'
  loadTime: real("load_time").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Tabella degli errori JavaScript (legata ai siti)
export const errors = pgTable("errors", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteId: uuid("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }), // Legato al sito
  type: text("type").notNull(),
  message: text("message").notNull(),
  filename: text("filename").notNull(),
  lineNumber: integer("line_number").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Tabella dei log della console (legata ai siti)
export const consoleEntries = pgTable("console_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteId: uuid("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }), // Legato al sito
  type: text("type").notNull(), // log, info, warn, error
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Tabella dei problemi con le immagini (legata ai siti)
export const imageIssues = pgTable("image_issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  siteId: uuid("site_id").notNull().references(() => sites.id, { onDelete: "cascade" }), // Legato al sito
  url: text("url").notNull(),
  originalSize: jsonb("original_size").notNull(), // { width: 1920, height: 1080 }
  displaySize: jsonb("display_size").notNull(),  // { width: 480, height: 270 }
  createdAt: timestamp("created_at").default(sql`now()`),
});
