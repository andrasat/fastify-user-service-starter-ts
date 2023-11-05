#!/usr/bin/env -S DB_URL=postgres://user_service:postgres@localhost:5432/user node
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const queryClient = postgres(process.env.DB_URL);
const db = drizzle(queryClient);

migrate(db, { migrationsFolder: "drizzle" })
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
