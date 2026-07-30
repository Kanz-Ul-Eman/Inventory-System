const request = require("supertest");
const app = require("../app");

let adminCookie;
let customerId;
let orderId;

beforeAll(async () => {
  const login = await request(app).post("/api/auth/login").send({
    email: "admin@inventory.pk",
    password: "Admin@123",
  });

  adminCookie = login.headers["set-cookie"];

  const customer = await request(app)
    .post("/api/customers")
    .set("Cookie", adminCookie)
    .send({
      name: "Order Test Customer",
      email: `ordertest${Date.now()}@gmail.com`,
      phone: "03001112222",
    });

  customerId = customer.body.customer.id;
});

describe("Order API", () => {
  test("should create order", async () => {
    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", adminCookie)
      .send({
        customerId,

        items: [
          {
            productId: 1,
            quantity: 1,
          },
        ],
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    orderId = response.body.order.id;
  });

  test("should reject invalid customer", async () => {
    const response = await request(app)
      .post("/api/orders")
      .set("Cookie", adminCookie)
      .send({
        customerId: 999999,

        items: [
          {
            productId: 1,
            quantity: 1,
          },
        ],
      });

    expect(response.statusCode).toBe(404);
  });

  test("should get all orders", async () => {
    const response = await request(app)
      .get("/api/orders")
      .set("Cookie", adminCookie);

    expect(response.statusCode).toBe(200);
  });

  test("should get order by id", async () => {
    const response = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Cookie", adminCookie);

    expect(response.statusCode).toBe(200);
  });

  test("should update order status", async () => {
    const response = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set("Cookie", adminCookie)
      .send({
        status: "CONFIRMED",
      });

    expect(response.statusCode).toBe(200);
  });

  test("should reject invalid status transition", async () => {
    const response = await request(app)
      .patch(`/api/orders/${orderId}/status`)
      .set("Cookie", adminCookie)
      .send({
        status: "PENDING",
      });

    expect(response.statusCode).toBe(400);
  });

  test("should search orders", async () => {
    const response = await request(app)
      .get("/api/orders?keyword=Order")
      .set("Cookie", adminCookie);

    expect(response.statusCode).toBe(200);
  });

  test("should paginate orders", async () => {
    const response = await request(app)
      .get("/api/orders?page=1&limit=5")
      .set("Cookie", adminCookie);

    expect(response.statusCode).toBe(200);
  });

  test("should cancel order", async () => {
    const response = await request(app)
      .patch(`/api/orders/${orderId}/cancel`)
      .set("Cookie", adminCookie);

    expect(response.statusCode).toBe(200);
  });

  test("should not cancel already cancelled order", async () => {
    const response = await request(app)
      .patch(`/api/orders/${orderId}/cancel`)
      .set("Cookie", adminCookie);

    expect(response.statusCode).toBe(400);
  });
});
