const { z } = require("zod");

const orderItemSchema = z.object({
    productId: z
        .number({
            required_error: "Product ID is required.",
        })
        .int()
        .positive(),

    quantity: z
        .number({
            required_error: "Quantity is required.",
        })
        .int()
        .positive("Quantity must be greater than 0."),
});

const createOrderSchema = z.object({
    customerId: z
        .number({
            required_error: "Customer ID is required.",
        })
        .int()
        .positive(),

    items: z
        .array(orderItemSchema)
        .min(1, "Order must contain at least one product."),
});

const getOrdersQuerySchema = z.object({

    page: z.coerce
        .number()
        .int()
        .positive()
        .optional(),

    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .optional(),

    keyword: z
        .string()
        .trim()
        .optional(),

    customerId: z.coerce
        .number()
        .int()
        .positive()
        .optional(),

    status: z
        .enum([
            "PENDING",
            "CONFIRMED",
            "SHIPPED",
            "CANCELLED",
        ])
        .optional(),

});

const updateOrderStatusSchema = z.object({

    status: z.enum([
        "CONFIRMED",
        "SHIPPED",
    ]),

});

module.exports = {
    createOrderSchema,
    getOrdersQuerySchema,
    updateOrderStatusSchema,
};