import { eq, sql } from "drizzle-orm";
import { v5 } from "uuid";
import crypto from "node:crypto";

import { db } from "./connection";
import { users, User } from "./schema";
import type { Pagination } from "../types";

export async function getUserById(id: string) {
  const data = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return data[0];
}

export async function getUserWithPasswordByEmail(email: string) {
  const data = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return data[0];
}

export async function getUsersPaginated(page: number = 1, limit: number = 1) {
  const [data, countResult] = await Promise.all([
    db.select().from(users).limit(limit).offset((page - 1) * limit),
    db.select({ count: sql<number>`count(*)` }).from(users),
  ]);

  const totalPages = Math.ceil(countResult[0].count / limit);

  const pagination: Pagination<User> = {
    pagination: {
      totalData: countResult[0].count,
      currentPage: page,
      totalPages: totalPages,
      nextPage: page < totalPages ? page + 1 : null,
    },
    data,
  };

  return pagination;
}

export async function insertUser(email: string, password: string, name?: string) {
  const id = v5(email, process.env.UUID_NAMESPACE!);
  const hashedPass = crypto.scryptSync(password, process.env.SALT!, 64).toString("hex");
  const data = await db.insert(users).values({ id, email, password: hashedPass, name }).returning();
  return data[0];
}

export async function updateUser(id: string, email?: string, password?: string, name?: string) {
  const dataToUpdate: { email?: string, password?: string, name?: string } = { name };

  if (email) {
    dataToUpdate["email"] = email;
  }

  if (password) {
    const hashedPass = crypto.scryptSync(password!, process.env.SALT!, 64).toString("hex");
    dataToUpdate["password"] = hashedPass;
  }

  const data = await db.update(users).set(dataToUpdate).where(eq(users.id, id)).returning();
  return data[0];
}

export async function deleteUser(id: string) {
  const data = await db.delete(users).where(eq(users.id, id)).returning();
  return data[0];
}
