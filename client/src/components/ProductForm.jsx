import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { productSchema } from "../validators/product.validator";

import Input from "./common/Input";
import Button from "./common/Button";

function ProductForm({
  categories,

  initialValues,

  onSubmit,
  submitLabel = "Save Product",
  submitting = false,
}) {
  const {
    register,

    handleSubmit,

    reset,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),

    defaultValues: initialValues || {
      name: "",
      sku: "",
      categoryId: "",
      unitPrice: "",
      quantityInStock: "",
      reorderLevel: "",
      active: true,
    },
  });

  useEffect(() => {
    reset(
      initialValues || {
        name: "",
        sku: "",
        categoryId: "",
        unitPrice: "",
        quantityInStock: "",
        reorderLevel: "",
        active: true,
      },
    );
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Product Name" {...register("name")} error={errors.name} />

      <Input label="SKU" {...register("sku")} error={errors.sku} />

      <div className="space-y-1">
        <label className="block text-sm font-medium">Category</label>

        <select
          {...register("categoryId")}
          className="w-full rounded-lg border px-3 py-2 outline-none transition"
        >
          <option value="">Select Category</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {errors.categoryId && (
          <p className="text-sm text-red-500">{errors.categoryId.message}</p>
        )}
      </div>

      <Input
        label="Unit Price"
        type="number"
        {...register("unitPrice")}
        error={errors.unitPrice}
      />

      <Input
        label="Quantity"
        type="number"
        {...register("quantityInStock")}
        error={errors.quantityInStock}
      />

      <Input
        label="Reorder Level"
        type="number"
        {...register("reorderLevel")}
        error={errors.reorderLevel}
      />

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" {...register("active")} />
        Active
      </label>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

export default ProductForm;
