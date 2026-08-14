import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(3, "Category name is required.").max(100),

  description: z.string().trim().max(255).optional().or(z.literal("")),

  active: z.boolean().optional(),
});
