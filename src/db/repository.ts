import { eq } from "drizzle-orm";
import { v5 } from "uuid";
import crypto from "node:crypto";

import { db } from "./connection";
import { users } from "./schema";

export async function getUserById(id: string) {
  const data = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return data[0];
}

export async function insertUser(email: string, password: string, name?: string) {
  const id = v5(email, process.env.UUID_NAMESPACE!);
  const hashedPass = crypto.scryptSync(password, process.env.SALT!, 64).toString("hex");
  const data = await db.insert(users).values({ id, email, password: hashedPass, name }).returning();
  return data[0];
}
