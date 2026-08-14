import { z } from "zod";

const phoneRegex = /^03\d{9}$/;

export const customerSchema = z.object({
  name: z.string().trim().min(3, "Customer name is required.").max(100),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a valid Pakistani phone number."),
});
