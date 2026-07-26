const request = require("supertest");
const app = require("../app");

describe("Authentication", () => {
  //login test
  test("Login with valid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "admin@inventory.pk",
      password: "Admin@123",
    });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);
  });

  //Wrong Password
  test("Login with invalid password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "admin@inventory.pk",
      password: "WrongPassword",
    });

    expect(response.statusCode).toBe(401);
  });

  //Validation Test
  test("Login without email", async () => {
    const response = await request(app).post("/api/auth/login").send({
      password: "Admin@123",
    });

    expect(response.statusCode).toBe(400);
  });

  //Unauthorized Test
  test("Get user without token", async () => {
    const response = await request(app).get("/api/auth/getUser");

    expect(response.statusCode).toBe(401);
  });

  //Logout Test
  test("Logout", async () => {
    const login = await request(app).post("/api/auth/login").send({
      email: "admin@inventory.pk",
      password: "Admin@123",
    });

    const cookie = login.headers["set-cookie"];

    const logout = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookie);

    expect(logout.statusCode).toBe(200);
  });
});
