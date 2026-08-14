import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import orderService from "../services/order.service";
import { ORDER_STATUS_LABELS } from "../constants/orders";

import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await orderService.getOrderById(id);

        if (!active) return;

        setOrder(data.order);
      } catch (requestError) {
        if (!active) return;

        setError(
          requestError?.response?.data?.message ||
            "Failed to load order details.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Order detail
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              Order #{id}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Review the frozen line-item prices, order status, and the customer
              snapshot recorded at checkout.
            </p>
          </div>

          <Link
            to="/orders"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to orders
          </Link>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState title="Unable to load order" message={error} />
      ) : order ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Customer</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {order.customer?.name}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {order.customer?.email}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Created by</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {order.createdBy?.name}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {order.createdBy?.email}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Status</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {ORDER_STATUS_LABELS[order.status] || order.status}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Total Rs. {Number(order.totalAmount || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Line items
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {order.orderItems?.length ? (
                order.orderItems.map((item) => (
                  <div
                    key={item.id || `${item.productId}-${item.quantity}`}
                    className="grid gap-3 px-6 py-4 md:grid-cols-[1.5fr_0.5fr_0.5fr_0.5fr] md:items-center"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.product?.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        SKU {item.product?.sku}
                      </p>
                    </div>
                    <p className="text-sm text-slate-700">
                      Qty {item.quantity}
                    </p>
                    <p className="text-sm text-slate-700">
                      Unit Rs. {Number(item.unitPrice).toFixed(2)}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      Line Rs. {Number(item.lineTotal).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState title="No line items found." />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default OrderDetailPage;
