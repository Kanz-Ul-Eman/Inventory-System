import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { categorySchema } from "../validators/category.validator";

import Input from "./common/Input";
import Button from "./common/Button";

function CategoryForm({
  initialValues,
  onSubmit,
  submitLabel = "Save Category",
  submitting = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: initialValues || {
      name: "",
      description: "",
      active: true,
    },
  });

  useEffect(() => {
    reset(
      initialValues || {
        name: "",
        description: "",
        active: true,
      },
    );
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input label="Category Name" {...register("name")} error={errors.name} />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70"
          placeholder="Optional description"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
        <input type="checkbox" {...register("active")} />
        Active
      </label>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

export default CategoryForm;
