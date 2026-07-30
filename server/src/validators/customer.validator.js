const { z } = require("zod");

const phoneRegex = /^03\d{9}$/;

const createCustomerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Customer name must be at least 3 characters.")
        .max(100, "Customer name cannot exceed 100 characters."),

    email: z
        .string()
        .trim()
        .email("Invalid email address."),

    phone: z
        .string()
        .trim()
        .regex(phoneRegex, "Enter a valid Pakistani phone number."),
});

const updateCustomerSchema = createCustomerSchema.partial();

module.exports = {
    createCustomerSchema,
    updateCustomerSchema,
};