# fastify user service starter ts

This is a starter project to create your own user backend service with JWT authentication.

## Getting Started

- Pre-requisites:

  - Docker (Not required if you have your own database)
  - Docker Compose (Not required if you have your own database)
  - NodeJS
  - NPM / Yarn

- ENVs

  If you are running this app without using docker, you might need to set a few environment variables, env needed:

  - `DB_URL` // postgres://user:password@host:port/database
  - `UUID_NAMESPACE` // UUID namespace for generating UUID v5
  - `JWT_SECRET` // JWT secret for generating JWT token
  - `SALT` // Salt for hashing password

- Steps:

  - Clone this repository
  - Run `yarn install` to install dependencies
  - Run `yarn dev` to start the development server
  - Run `yarn docker:dev` to start the development server with docker

  After the development server is started, you can access the API at `http://localhost:8081`

  Additional commands:

  - Run `yarn run generate-drizzle` to generate the drizzle migration folder
  - Run `yarn run migrate` to migrate the schema
  - Run `yarn run seed` to seed the database

- Migration

  - The migration is done using [drizzle](https://orm.drizzle.team/)
  - The migration files are located in `drizzle` folder
  - The migration files are generated using `yarn run generate-drizzle`, it is saved in git to track the changes
  - The migration files are generated based on the schema in `src/db/schema.ts`

- Seed Data

  - The seed data is located in `scripts/seed.ts`
  - The seed data is generated using [faker.js](https://fakerjs.dev/)
  - There is 1 fixed user for testing purposes
    - Email: `tester@mail.com`
    - Password: `password`

- API Routes

  | Method | Route       | Description                   | JWT Protected |
  | ------ | ----------- | ----------------------------- | ------------- |
  | GET    | /           | Health check                  | No            |
  | GET    | /docs       | OpenAPI v3 Docs               | No            |
  | POST   | /auth/login | Login                         | No            |
  | GET    | /users      | Get all users with pagination | Yes           |
  | GET    | /users/:id  | Get user by id                | Yes           |
  | POST   | /users/     | Create a new user             | Yes           |
  | PATCH  | /users/:id  | Update a user by id           | Yes           |
  | DELETE | /users/:id  | Delete a user by id           | Yes           |
  | GET    | /\*         | Not Found                     | No            |

- Authentication

  - The authentication is done using JWT
  - The JWT secret is located in docker-compose.yaml environment
  - The JWT token is valid for 1 hour
  - Protected routes are using the `Authorization` header with the value of `Bearer <token>`
