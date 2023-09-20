import crypto from "node:crypto";
import buildApp from "../src/index";

export function build() {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(() => app.close());

  return app;
}

export function mockRepository() {
  jest.mock("../src/db");
  const repository = require("../src/db");

  const userData = {
    id: "00000000-0000-0000-0000-000000000000",
    email: "test@mail.com",
    password: crypto.scryptSync("password", "10", 64),
    name: "Test User",
  };

  repository.getUserById = jest.fn().mockImplementation((id: string) => {
    if (id !== userData.id) return null;
    return userData;
  });
  repository.getUserByEmail = jest.fn().mockImplementation((email: string) => {
    if (email !== userData.email) return null;
    return userData;
  });
  repository.insertUser = jest.fn().mockImplementation((email: string, password: string, name: string) => {
    userData.email = email;
    userData.password = crypto.scryptSync(password, "10", 64);
    userData.name = name;
    return userData;
  });
  repository.updateUser = jest.fn().mockImplementation((id: string, email?: string, password?: string, name?: string) => {
    if (id !== userData.id) return null;
    if (email) userData.email = email;
    if (password) userData.password = crypto.scryptSync(password, "10", 64);
    if (name) userData.name = name;

    return userData;
  });
  repository.deleteUser = jest.fn().mockImplementation((id: string) => {
    if (id !== userData.id) return null;
    return userData;
  });

  return { userData };
}
