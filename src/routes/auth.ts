import type { FastifyInstance } from "fastify";
import type { FromSchema } from "json-schema-to-ts";
import crypto from "node:crypto";

import { getUserByEmail } from "../db";

/**
 * --- Schemas ---
 */
const loginBodySchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
} as const;

/**
 * --- Routes ---
 */
async function authRoutes(app: FastifyInstance) {
  // Login
  app.post<{ Body: FromSchema<typeof loginBodySchema> }>("/login", {
    schema: { body: loginBodySchema },
  }, async (request, reply) => {
    try {
      const { email, password } = request.body;

      const user = await getUserByEmail(email);

      if (!user) {
        return reply.status(401).send({ message: "Invalid email or password" });
      }

      const hashedPass = crypto.scryptSync(password, process.env.SALT!, 64).toString("hex");
      if (hashedPass !== user.password) {
        return reply.status(401).send({ message: "Invalid email or password" });
      }

      const token = app.jwt.sign({ id: user.id }, { expiresIn: "1h" });
      return reply.send({ data: { token } });
    } catch (err) {
      return reply.status(500).send({ message: err });
    }
  });
}

export default authRoutes;
