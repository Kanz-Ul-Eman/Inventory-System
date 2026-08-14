import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { customerSchema } from "../validators/customer.validator";

import Input from "./common/Input";
import Button from "./common/Button";

function CustomerForm({
  initialValues,
  onSubmit,
  submitLabel = "Save Customer",
  submitting = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: initialValues || {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    reset(
      initialValues || {
        name: "",
        email: "",
        phone: "",
      },
    );
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input label="Customer Name" {...register("name")} error={errors.name} />

      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email}
      />

      <Input
        label="Phone"
        type="tel"
        placeholder="03XXXXXXXXX"
        {...register("phone")}
        error={errors.phone}
      />

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

export default CustomerForm;
