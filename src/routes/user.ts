import type { FastifyInstance } from "fastify";
import type { FromSchema } from "json-schema-to-ts";
import { getUserById, insertUser, updateUser, deleteUser } from "@db";

/**
 * --- Schemas ---
 */
const ParamSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string" },
  },
} as const;

const BodySchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string" },
    password: { type: "string" },
    name: { type: "string" },
  },
} as const;

const UpdateBodySchema = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
    name: { type: "string" },
  },
} as const;

/**
 * --- Routes ---
 */
async function userRoutes(app: FastifyInstance) {
  // Get user by ID
  app.get<{ Params: FromSchema<typeof ParamSchema> }>("/:id", {
    schema: { params: ParamSchema },
  }, async (request, reply) => {
    const user = await getUserById(request.params.id);
    return reply.send({ data: user });
  });

  // Create user
  app.post<{ Body: FromSchema<typeof BodySchema> }>("/create", {
    schema: { body: BodySchema },
  }, async (request, reply) => {
    const { email, password, name } = request.body;
    const user = await insertUser(email, password, name);
    return reply.send({ data: user });
  });

  // Update user
  app.patch<{
    Body: FromSchema<typeof UpdateBodySchema>
    Params: FromSchema<typeof ParamSchema>
  }>("/:id", {
    schema: { body: UpdateBodySchema, params: ParamSchema },
  }, async (request, reply) => {
    const { email, password, name } = request.body;
    const user = await updateUser(request.params.id, email, password, name);
    return reply.send({ data: user });
  });

  // Delete user
  app.delete<{ Params: FromSchema<typeof ParamSchema> }>("/:id", {
    schema: { params: ParamSchema },
  }, async (request, reply) => {
    const user = await deleteUser(request.params.id);
    if (!user) return reply.status(404).send({ message: "User not found" });
    return reply.send({ data: { id: user.id, deleted: "OK" } });
  });
}

export default userRoutes;
