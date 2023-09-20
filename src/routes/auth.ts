import type { FastifyInstance } from "fastify";
import type { FromSchema } from "json-schema-to-ts";
import validator from "validator";
import crypto from "node:crypto";

import { getUserWithPasswordByEmail } from "../db";

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

const loginResponseSchema = {
  200: {
    description: "Successful response",
    type: "object",
    properties: {
      token: { type: "string" },
    }
  },
  400: {
    description: "Bad Request",
    type: "object",
    properties: {
      message: { type: "string" },
    }
  },
  500: {
    description: "Internal Server Error",
    type: "object",
    properties: {
      message: { type: "string" },
    }
  },
} as const;

/**
 * --- Routes ---
 */
async function authRoutes(app: FastifyInstance) {
  // Login
  app.post<{ Body: FromSchema<typeof loginBodySchema> }>("/login", {
    schema: { body: loginBodySchema, response: loginResponseSchema },
  }, async (request, reply) => {
    try {
      const { email, password } = request.body;

      if (!validator.isEmail(email)) {
        return reply.status(400).send({ message: "Invalid email or password" });
      }

      const user = await getUserWithPasswordByEmail(email);

      if (!user) {
        return reply.status(400).send({ message: "Invalid email or password" });
      }

      const hashedPass = crypto.scryptSync(password, process.env.SALT!, 64).toString("hex");
      if (hashedPass !== user.password) {
        return reply.status(400).send({ message: "Invalid email or password" });
      }

      const token = app.jwt.sign({ id: user.id }, { expiresIn: "1h" });
      return reply.send({ token });
    } catch (err) {
      return reply.status(500).send({ message: err });
    }
  });
}

export default authRoutes;
