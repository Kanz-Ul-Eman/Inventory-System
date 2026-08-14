import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.coerce
    .number({
      required_error: "Product is required.",
      invalid_type_error: "Product is required.",
    })
    .int()
    .positive("Product is required."),

  quantity: z.coerce
    .number({
      required_error: "Quantity is required.",
      invalid_type_error: "Quantity is required.",
    })
    .int()
    .positive("Quantity must be greater than 0."),
});

export const orderSchema = z
  .object({
    customerId: z.coerce
      .number({
        required_error: "Customer is required.",
        invalid_type_error: "Customer is required.",
      })
      .int()
      .positive("Customer is required."),

    items: z.array(orderItemSchema).min(1, "Add at least one line item."),
  })
  .superRefine((value, context) => {
    const productIds = value.items.map((item) => item.productId);
    const uniqueIds = new Set(productIds);

    if (productIds.length !== uniqueIds.size) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["items"],
        message: "Duplicate products are not allowed.",
      });
    }
  });
