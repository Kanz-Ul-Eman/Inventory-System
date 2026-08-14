import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import { orderSchema } from "../validators/order.validator";

import Button from "./common/Button";
import Input from "./common/Input";

const EMPTY_ITEM = { productId: "", quantity: 1 };

function OrderForm({
  customers,
  products,
  initialValues,
  onSubmit,
  submitting = false,
}) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: initialValues || {
      customerId: "",
      items: [EMPTY_ITEM],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items") || [];

  useEffect(() => {
    reset(
      initialValues || {
        customerId: "",
        items: [EMPTY_ITEM],
      },
    );
  }, [initialValues, reset]);

  const productMap = useMemo(() => {
    return new Map(products.map((product) => [Number(product.id), product]));
  }, [products]);

  const runningTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const product = productMap.get(Number(item?.productId));
      const quantity = Number(item?.quantity || 0);

      if (!product || !quantity) {
        return total;
      }

      return total + Number(product.unitPrice) * quantity;
    }, 0);
  }, [items, productMap]);

  useEffect(() => {
    items.forEach((item, index) => {
      const product = productMap.get(Number(item?.productId));
      const quantity = Number(item?.quantity || 0);

      if (!product || !quantity) {
        clearErrors(`items.${index}.quantity`);
        return;
      }

      if (quantity > Number(product.quantityInStock)) {
        setError(`items.${index}.quantity`, {
          type: "manual",
          message: `Only ${product.quantityInStock} available in stock.`,
        });
      } else if (errors.items?.[index]?.quantity?.type === "manual") {
        clearErrors(`items.${index}.quantity`);
      }
    });
  }, [clearErrors, errors.items, items, productMap, setError]);

  const submitHandler = async (values) => {
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Customer
        </label>

        <select
          {...register("customerId")}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70"
        >
          <option value="">Select customer</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.phone}
            </option>
          ))}
        </select>

        {errors.customerId && (
          <p className="text-sm text-rose-600">{errors.customerId.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Line items
            </h3>
            <p className="text-sm text-slate-500">
              Add multiple products in one order and keep an eye on stock.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2"
            onClick={() => append(EMPTY_ITEM)}
          >
            <Plus size={16} />
            Add item
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => {
            const selectedProduct = productMap.get(
              Number(items?.[index]?.productId),
            );
            const requestedQuantity = Number(items?.[index]?.quantity || 0);
            const lowStockWarning =
              selectedProduct &&
              requestedQuantity > Number(selectedProduct.quantityInStock);

            return (
              <div
                key={field.id}
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_160px_auto] md:items-start">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">
                      Product
                    </label>

                    <select
                      {...register(`items.${index}.productId`)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70"
                    >
                      <option value="">Select product</option>

                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - Rs. {product.unitPrice} - Stock{" "}
                          {product.quantityInStock}
                        </option>
                      ))}
                    </select>

                    {errors.items?.[index]?.productId && (
                      <p className="text-sm text-rose-600">
                        {errors.items[index].productId.message}
                      </p>
                    )}
                  </div>

                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    error={errors.items?.[index]?.quantity}
                  />

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="secondary"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-3"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 size={16} />
                      Remove
                    </Button>
                  </div>
                </div>

                {selectedProduct && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <span>
                      Unit price:{" "}
                      <span className="font-semibold text-slate-900">
                        Rs. {selectedProduct.unitPrice}
                      </span>
                    </span>

                    <span>
                      Line total:{" "}
                      <span className="font-semibold text-slate-900">
                        Rs.{" "}
                        {(
                          Number(selectedProduct.unitPrice) *
                            requestedQuantity || 0
                        ).toFixed(2)}
                      </span>
                    </span>

                    {lowStockWarning && (
                      <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                        Requested quantity exceeds available stock
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {errors.items?.message && (
          <p className="text-sm text-rose-600">{errors.items.message}</p>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Running total</p>
            <p className="text-2xl font-black tracking-tight text-slate-900">
              Rs. {runningTotal.toFixed(2)}
            </p>
          </div>

          <Button
            type="submit"
            disabled={submitting || !customers.length || !products.length}
          >
            {submitting ? "Placing order..." : "Place Order"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default OrderForm;
