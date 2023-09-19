import type { FastifyInstance } from "fastify";
import type { FromSchema } from "json-schema-to-ts";
import { getUserById, insertUser } from "@db";

/**
 * --- Schemas ---
 */
const getUserByIdParamSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string" },
  },
} as const;

const createUserBodySchema = {
  type: "object",
  required: ["email", "password"],
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
  app.get<{ Params: FromSchema<typeof getUserByIdParamSchema> }>("/:id", {
    schema: { params: getUserByIdParamSchema },
  }, async (request, reply) => {
    const user = await getUserById(request.params.id);
    return reply.send({ data: user });
  });


  // Create user
  app.post<{ Body: FromSchema<typeof createUserBodySchema> }>("/create", {
    schema: { body: createUserBodySchema },
  }, async (request, reply) => {
    const { email, password, name } = request.body;
    const user = await insertUser(email, password, name);
    return reply.send({ data: user });
  });
}

export default userRoutes;
