const { z } = require("zod");

const createProductSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Product name must be at least 3 characters.")
        .max(100, "Product name cannot exceed 100 characters."),

    sku: z
        .string()
        .trim()
        .min(3, "SKU is required.")
        .max(50),

    categoryId: z
        .number({
            required_error: "Category is required.",
        })
        .int()
        .positive(),

    unitPrice: z
        .number({
            required_error: "Unit price is required.",
        })
        .positive(),

    quantityInStock: z
        .number({
            required_error: "Quantity in stock is required.",
        })
        .int()
        .min(0),

    reorderLevel: z
        .number({
            required_error: "Reorder level is required.",
        })
        .int()
        .min(0),

    active: z.boolean().optional(),
});

const updateProductSchema = createProductSchema.partial();

module.exports = {
    createProductSchema,
    updateProductSchema,
};