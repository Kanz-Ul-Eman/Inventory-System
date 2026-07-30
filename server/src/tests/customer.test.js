const request = require("supertest");
const app = require("../app");

let adminCookie;
let customerId;

beforeAll(async () => {
  const login = await request(app).post("/api/auth/login").send({
    email: "admin@inventory.pk",
    password: "Admin@123",
  });

  adminCookie = login.headers["set-cookie"];
});

describe("Customer API", () => {
  it("should create customer", async () => {
  const timestamp = Date.now();
  const res = await request(app)
    .post("/api/customers")
    .set("Cookie", adminCookie)
    .send({
      name: "Raza",
      email: `razaaa${timestamp}@gmail.com`,
      phone: `0300${timestamp.toString().slice(-7)}`,
    });

  expect(res.statusCode).toBe(201);
  expect(res.body.success).toBe(true);

  customerId = res.body.customer.id;
});

  it("should get all customers", async () => {
    const res = await request(app)
      .get("/api/customers")
      .set("Cookie", adminCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should get customer by id", async () => {
    const res = await request(app)
      .get(`/api/customers/${customerId}`)
      .set("Cookie", adminCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.customer.id).toBe(customerId);
  });

  it("should update customer", async () => {
    const res = await request(app)
      .put(`/api/customers/${customerId}`)
      .set("Cookie", adminCookie)
      .send({
        phone: "03112223344",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should soft delete customer", async () => {
    const res = await request(app)
      .delete(`/api/customers/${customerId}`)
      .set("Cookie", adminCookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
