import type { FastifyInstance } from "fastify";
import type { FromSchema } from "json-schema-to-ts";
import validator from "validator";
import { getUsersPaginated, getUserById, insertUser, updateUser, deleteUser } from "../db/repository";

/**
 * --- Schemas ---
 */
const PaginationQuerystringSchema = {
  type: "object",
  properties: {
    page: { type: "number" },
    limit: { type: "number" },
  },
} as const;

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

const SecuritySchema = [{
  jwt: [],
}] as const;

const GetUsersResponseSchema = {
  200: {
    description: "Successful response",
    type: "object",
    properties: {
      pagination: {
        type: "object",
        properties: {
          totalData: { type: "number" },
          currentPage: { type: "number" },
          totalPages: { type: "number" },
          nextPage: { type: "number" },
        },
      },
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    },
  },
  500: {
    description: "Internal Server Error",
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
} as const;

const UserDataResponseSchema = {
  200: {
    description: "Successful response",
    type: "object",
    properties: {
      user: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string" },
          name: { type: "string" },
        },
      },
    },
  },
  400: {
    description: "Bad Request",
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
  404: {
    description: "Not Found",
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
  500: {
    description: "Internal Server Error",
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
} as const;

const UserDeletedResponseSchema = {
  200: {
    description: "Successful response",
    type: "object",
    properties: {
      id: { type: "string" },
      deleted: { default: "OK", type: "string" },
    },
  },
  404: {
    description: "Not Found",
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
  500: {
    description: "Internal Server Error",
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
} as const;

/**
 * --- Routes ---
 */
export async function userRoutes(app: FastifyInstance) {
  // Get users
  app.get<{ Querystring: FromSchema<typeof PaginationQuerystringSchema> }>("/", {
    schema: { querystring: PaginationQuerystringSchema, response: GetUsersResponseSchema, security: SecuritySchema },
    onRequest: [app.authenticate],
  }, async (request, reply) => {
    try {
      const { page, limit } = request.query;

      const { pagination, data } = await getUsersPaginated(page, limit);

      return reply.send({ pagination, data });
    } catch (err) {
      return reply.status(500).send({ message: err });
    }
  });

  // Get user by ID
  app.get<{ Params: FromSchema<typeof ParamSchema> }>("/:id", {
    schema: { params: ParamSchema, response: UserDataResponseSchema, security: SecuritySchema },
    onRequest: [app.authenticate],
  }, async (request, reply) => {
    try {
      const user = await getUserById(request.params.id);

      return reply.send({ user });
    } catch (err) {
      return reply.status(500).send({ message: err });
    }
  });

  // Create user
  app.post<{ Body: FromSchema<typeof BodySchema> }>("/create", {
    schema: { body: BodySchema, response: UserDataResponseSchema, security: SecuritySchema },
    onRequest: [app.authenticate],
  }, async (request, reply) => {
    try {
      const { email, password, name } = request.body;

      if (!validator.isEmail(email)) {
        return reply.status(400).send({ message: "Invalid email" });
      }

      const user = await insertUser(email, password, name);
      return reply.send({ user });
    } catch (err) {
      return reply.status(500).send({ message: err });
    }
  });

  // Update user
  app.patch<{
    Body: FromSchema<typeof UpdateBodySchema>
    Params: FromSchema<typeof ParamSchema>
  }>("/:id", {
    schema: { body: UpdateBodySchema, params: ParamSchema, response: UserDataResponseSchema, security: SecuritySchema },
    onRequest: [app.authenticate],
  }, async (request, reply) => {
    const { email, password, name } = request.body;
    try {
      const user = await updateUser(request.params.id, email, password, name);

      if (!user) return reply.status(404).send({ message: "User not found" });

      return reply.send({ user });
    } catch (err) {
      return reply.status(500).send({ message: err });
    }
  });

  // Delete user
  app.delete<{ Params: FromSchema<typeof ParamSchema> }>("/:id", {
    schema: { params: ParamSchema, response: UserDeletedResponseSchema, security: SecuritySchema },
    onRequest: [app.authenticate],
  }, async (request, reply) => {
    try {
      const user = await deleteUser(request.params.id);

      if (!user) return reply.status(404).send({ message: "User not found" });

      return reply.send({ id: user.id, deleted: "OK" });
    } catch (err) {
      return reply.status(500).send({ message: err });
    }
  });
}

export default userRoutes;
