const { z } = require("zod");

const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Category name must be at least 2 characters.")
        .max(100, "Category name cannot exceed 100 characters."),

    description: z
        .string()
        .trim()
        .max(255, "Description cannot exceed 255 characters.")
        .optional(),

    active: z.boolean().optional(),
});

const updateCategorySchema = createCategorySchema.partial();

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};