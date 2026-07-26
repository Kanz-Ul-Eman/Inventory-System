const request = require("supertest");
const app = require("../app");
const prisma = require("../config/prisma"); // Direct import fix

let adminCookie;
let productId;

const uniqueSuffix = Date.now();
const testProductName = `JBL Speaker ${uniqueSuffix}`;
const testProductSku = `JBL-${uniqueSuffix}`;

beforeAll(async () => {
    const res = await request(app)
        .post("/api/auth/login")
        .send({
            email: "admin@inventory.pk",
            password: "Admin@123",
        });

    adminCookie = res.headers["set-cookie"];
});

afterAll(async () => {
    if (productId) {
        try {
            await prisma.product.delete({
                where: { id: productId },
            });
        } catch (error) {
            // Safe fallback if soft-deleted or already removed
        }
    }
    await prisma.$disconnect();
});

// Create product test
describe("Create Product", () => {
    it("should create a new product", async () => {
        const res = await request(app)
            .post("/api/products")
            .set("Cookie", adminCookie)
            .send({
                name: testProductName,
                sku: testProductSku,
                categoryId: 1,
                unitPrice: 12000,
                quantityInStock: 20,
                reorderLevel: 5,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);

        productId = res.body.product.id;
    });
});

// Get all products test
describe("Get Products", () => {
    it("should return all products", async () => {
        const res = await request(app)
            .get("/api/products")
            .set("Cookie", adminCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.products)).toBe(true);
    });
});

// Get product by id test
describe("Get Product By Id", () => {
    it("should return one product", async () => {
        const res = await request(app)
            .get(`/api/products/${productId}`)
            .set("Cookie", adminCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.product.id).toBe(productId);
    });
});

// Update product test
describe("Update Product", () => {
    it("should update the product", async () => {
        const res = await request(app)
            .put(`/api/products/${productId}`)
            .set("Cookie", adminCookie)
            .send({
                name: testProductName,
                sku: testProductSku,
                categoryId: 1,
                unitPrice: 15000,
                quantityInStock: 20,
                reorderLevel: 5,
            });

        expect(res.statusCode).toBe(200);
        expect(Number(res.body.product.unitPrice)).toBe(15000);
    });
});

// Search product test
describe("Search Product", () => {
    it("should search products", async () => {
        const res = await request(app)
            .get("/api/products/search?keyword=JBL")
            .set("Cookie", adminCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});

// Delete product test
describe("Delete Product", () => {
    it("should soft delete product", async () => {
        const res = await request(app)
            .delete(`/api/products/${productId}`)
            .set("Cookie", adminCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});