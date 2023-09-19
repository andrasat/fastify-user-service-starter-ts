import type { FastifyInstance } from "fastify";

async function authRoutes(app: FastifyInstance) {
  app.post("/login", async (request, reply) => {
    return reply.send({});
  });
}

export default authRoutes;
