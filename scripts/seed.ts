#!/usr/bin/env -S DB_URL=postgres://user_service:postgres@localhost:5432/user tsx
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { v5 } from "uuid";
import { faker } from "@faker-js/faker";
import crypto from "node:crypto";

import * as schema from "../src/db/schema";

const queryClient = postgres(process.env.DB_URL!);
const db = drizzle(queryClient, { schema });

async function seed() {
  const UUID_NAMESPACE = "00000000-0000-0000-0000-000000000000";
  // insert 1 fixed user
  await db.insert(schema.users).values({
    id: v5("tester@mail.com", UUID_NAMESPACE),
    email: "tester@mail.com",
    password: crypto.scryptSync("password", "10", 64).toString("hex"),
    name: "Tester",
  }).execute();

  for (let i = 0; i < 9; i++) {
    const email = faker.internet.email();
    const id = v5(email, UUID_NAMESPACE);
    const password = crypto.scryptSync("password", "10", 64).toString("hex");
    const name = faker.internet.userName();
    await db.insert(schema.users).values({ id, email, password, name }).execute();
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
