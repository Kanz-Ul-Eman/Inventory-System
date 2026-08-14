import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3),

  sku: z.string().min(3),

  categoryId: z.coerce.number().int().positive("Please select a category."),

  unitPrice: z.coerce.number().positive(),

  quantityInStock: z.coerce.number().min(0),

  reorderLevel: z.coerce.number().min(0),

  active: z.boolean().optional(),
});
