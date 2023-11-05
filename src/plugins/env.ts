import path from "node:path";
import { fileURLToPath } from "node:url";
import fp from "fastify-plugin";
import env from "@fastify/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare module "fastify" {
  interface FastifyInstance {
    config: Record<string, string>
  }
}

const schema = {
  type: "object",
  required: [ "DB_URL", "UUID_NAMESPACE", "JWT_SECRET", "SALT" ],
  properties: {
    DB_URL: {
      type: "string",
      default: "postgres://root:postgres@localhost:5432/postgres"
    },
    UUID_NAMESPACE: {
      type: "string",
      default: "00000000-0000-0000-0000-000000000000"
    },
    JWT_SECRET: {
      type: "string",
      default: "secretkey"
    },
    SALT: {
      type: "string",
      default: "10"
    }
  }
};

export default fp(async (fastify) => {
  fastify.register(env, {
    confKey: "config",
    schema,
    dotenv: {
      path: `${__dirname}/../../.env`,
      debug: process.env.NODE_ENV !== "production",
    }
  });
});
