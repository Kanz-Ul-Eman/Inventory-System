const request = require("supertest");
const app = require("../app");

let adminCookie;
let categoryId;

beforeAll(async () => {
    const login = await request(app)
        .post("/api/auth/login")
        .send({
            email: "admin@inventory.pk",
            password: "Admin@123",
        });

    adminCookie = login.headers["set-cookie"];
});

describe("Category API", () => {

    it("should create a new category", async () => {
        const res = await request(app)
            .post("/api/categories")
            .set("Cookie", adminCookie)
            .send({
                name: "Gaming",
                description: "Gaming Accessories"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.category.name).toBe("Gaming");

        categoryId = res.body.category.id;
    });

    it("should get all categories", async () => {
        const res = await request(app)
            .get("/api/categories")
            .set("Cookie", adminCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.categories)).toBe(true);
    });

    it("should get category by id", async () => {
        const res = await request(app)
            .get(`/api/categories/${categoryId}`)
            .set("Cookie", adminCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.category.id).toBe(categoryId);
    });

    it("should update category", async () => {
        const res = await request(app)
            .put(`/api/categories/${categoryId}`)
            .set("Cookie", adminCookie)
            .send({
                description: "Updated Gaming Accessories"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.category.description).toBe(
            "Updated Gaming Accessories"
        );
    });

    it("should not delete category having products", async () => {
        const res = await request(app)
            .delete("/api/categories/1")
            .set("Cookie", adminCookie);

        expect([400, 409]).toContain(res.statusCode);
    });

    it("should delete empty category", async () => {
        const res = await request(app)
            .delete(`/api/categories/${categoryId}`)
            .set("Cookie", adminCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

});