# pafin-user-service

A technical assignment for Pafin based from this file: [G Drive Link](https://drive.google.com/file/d/1LmthPz-z6-mzKjFHpB0WjvpDoESLuXNJ/view)

## Getting Started

- Pre-requisites:

  - Docker
  - Docker Compose
  - NodeJS
  - NPM / Yarn
  - Git

- Steps:

  - Clone this repository
  - Run `yarn install` to install dependencies
  - Run `yarn run dev` to start the development server

  After the development server is started, you can access the API at `http://localhost:8081`

  Additional commands:

  - Run `yarn run generate-drizzle` to generate the drizzle migration folder
  - Run `yarn run migrate` to migrate the schema
  - Run `yarn run seed` to seed the database

- Migration

  - The migration is done using [drizzle](https://orm.drizzle.team/)
  - The migration files are located in `drizzle` folder
  - The migration files are generated using `yarn run generate-drizzle`
  - The migration files are generated based on the schema in `src/schema.ts`

- Seed Data

  - The seed data is located in `src/seed.ts`
  - The seed data is generated using [faker.js](https://fakerjs.dev/)
  - There is 1 fixed user for testing purposes
    - Email: `tester@mail.com`
    - Password: `password`

- API Routes

  | Method | Route             | Description                   | JWT Protected |
  | ------ | ----------------- | ----------------------------- | ------------- |
  | GET    | /                 | Health check                  | No            |
  | GET    | /docs             | OpenAPI v3 Docs               | No            |
  | POST   | /auth/login       | Login                         | No            |
  | GET    | /users            | Get all users with pagination | Yes           |
  | GET    | /users/:id        | Get user by id                | Yes           |
  | POST   | /users/create     | Create a new user             | Yes           |
  | PATCH  | /users/update/:id | Update a user by id           | Yes           |
  | DELETE | /users/delete/:id | Delete a user by id           | Yes           |
  | GET    | /\*               | Not Found                     | No            |

- Authentication

  - The authentication is done using JWT
  - The JWT secret is located in docker-compose.yaml environment
  - The JWT token is valid for 1 hour
  - Protected routes are using the `Authorization` header with the value of `Bearer <token>`
