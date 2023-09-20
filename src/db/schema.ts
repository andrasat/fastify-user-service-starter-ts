import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  name: text("name"),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
});

export type User = typeof users.$inferSelect;
