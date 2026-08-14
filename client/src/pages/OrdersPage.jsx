import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, Truck, Trash2 } from "lucide-react";

import { useOrders } from "../hooks/useOrders";
import orderService from "../services/order.service";
import customerService from "../services/customer.service";
import productService from "../services/product.service";
import {
  canCancelOrder,
  canUpdateOrderStatus,
  getNextOrderStatuses,
  ORDER_STATUS_LABELS,
} from "../constants/orders";

import SearchInput from "../components/common/SearchInput";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmModal from "../components/common/ConfirmModal";
import DataTable from "../components/tables/DataTable";
import Pagination from "../components/tables/Pagination";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Loader from "../components/common/Loader";
import OrderForm from "../components/OrderForm";

function OrdersPage() {
  const {
    orders,
    pagination,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    customerId,
    setCustomerId,
    page,
    setPage,
    refreshOrders,
    loadOrders,
    clearFilters,
    hasActiveFilters,
    metrics,
  } = useOrders();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const nextStatusOptions = useMemo(() => {
    if (!statusTarget) return [];
    return getNextOrderStatuses(statusTarget.status);
  }, [statusTarget]);

  useEffect(() => {
    if (statusTarget) {
      const options = getNextOrderStatuses(statusTarget.status);
      setStatusValue(options[0] || "");
    } else {
      setStatusValue("");
    }
  }, [statusTarget]);

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [customerResponse, productResponse] = await Promise.all([
          customerService.getCustomers({ page: 1, limit: 100 }),
          productService.getProducts({ page: 1, limit: 100 }),
        ]);

        setCustomers(customerResponse.customers || []);
        setProducts(productResponse.products || []);
      } catch (lookupError) {
        toast.error(
          lookupError?.response?.data?.message ||
            "Failed to load order lookups.",
        );
      }
    };

    loadLookups();
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "id",
        title: "Order",
        render: (row) => (
          <div>
            <p className="font-semibold text-slate-900">#{row.id}</p>
            <p className="text-xs text-slate-500">
              {new Date(row.createdAt).toLocaleString()}
            </p>
          </div>
        ),
      },
      {
        key: "customer",
        title: "Customer",
        render: (row) => (
          <div>
            <p className="font-semibold text-slate-900">
              {row.customer?.name || "-"}
            </p>
            <p className="text-xs text-slate-500">
              {row.customer?.phone || row.customer?.email || ""}
            </p>
          </div>
        ),
      },
      {
        key: "items",
        title: "Items",
        render: (row) => (
          <span className="text-slate-700">
            {row.orderItems?.length || 0} products
          </span>
        ),
      },
      {
        key: "status",
        title: "Status",
        render: (row) => (
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
            {ORDER_STATUS_LABELS[row.status] || row.status}
          </span>
        ),
      },
      {
        key: "totalAmount",
        title: "Total",
        render: (row) => `Rs. ${Number(row.totalAmount || 0).toFixed(2)}`,
      },
      {
        key: "actions",
        title: "Actions",
        render: (row) => (
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/orders/${row.id}`}
              title="View"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Eye size={16} />
            </Link>

            {canUpdateOrderStatus(row.status) && (
              <Button
                type="button"
                variant="secondary"
                title="Status"
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 p-2 text-emerald-700"
                onClick={() => setStatusTarget(row)}
              >
                <Truck size={16} />
              </Button>
            )}

            {canCancelOrder(row.status) && (
              <Button
                type="button"
                variant="danger"
                title="Cancel"
                className="inline-flex items-center justify-center rounded-full bg-rose-500 p-2"
                onClick={() => setCancelTarget(row)}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [],
  );

  const handleCreateOrder = async (values) => {
    setSubmitting(true);

    try {
      await orderService.createOrder(values);
      toast.success("Order created successfully.");
      setCreateOpen(false);
      refreshOrders();
    } catch (createError) {
      const message =
        createError?.response?.data?.message ||
        createError?.response?.data?.errors?.items?.[0] ||
        "Unable to create order.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async () => {
    if (!statusTarget || !statusValue) return;

    setSubmitting(true);

    try {
      await orderService.updateOrderStatus(statusTarget.id, {
        status: statusValue,
      });
      toast.success("Order status updated.");
      setStatusTarget(null);
      refreshOrders();
    } catch (statusError) {
      toast.error(
        statusError?.response?.data?.message ||
          "Unable to update order status.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelTarget) return;

    setSubmitting(true);

    try {
      await orderService.cancelOrder(cancelTarget.id);
      toast.success("Order cancelled.");
      setCancelTarget(null);
      refreshOrders();
    } catch (cancelError) {
      toast.error(
        cancelError?.response?.data?.message || "Unable to cancel order.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Orders
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              Order module
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Create orders with multiple line items, inspect order details,
              update status, and cancel when needed.
            </p>
          </div>

          <Button onClick={() => setCreateOpen(true)}>Create Order</Button>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <SearchInput
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search orders"
          />

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70"
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={customerId}
            onChange={(event) => {
              setCustomerId(event.target.value);
              setPage(1);
            }}
            className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70"
          >
            <option value="">All customers</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          <div className="flex flex-col gap-3 xl:col-span-3 xl:flex-row xl:items-end xl:justify-between">
            <div className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
              Orders {pagination.total || 0} | Revenue Rs.{" "}
              {metrics.totalRevenue.toFixed(2)}
            </div>

            {hasActiveFilters && (
              <Button type="button" variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState
          title="Unable to load orders"
          message={error}
          onRetry={loadOrders}
        />
      ) : orders.length ? (
        <>
          <DataTable
            columns={columns}
            data={orders}
            loading={false}
            emptyTitle="No orders found."
          />

          <Pagination
            page={page}
            totalPages={pagination.totalPages || 1}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState title="No orders found." />
      )}

      <Modal
        open={createOpen}
        title="Create Order"
        onClose={() => setCreateOpen(false)}
      >
        <OrderForm
          customers={customers}
          products={products}
          onSubmit={handleCreateOrder}
          submitting={submitting}
        />
      </Modal>

      <Modal
        open={Boolean(statusTarget)}
        title="Update Order Status"
        onClose={() => setStatusTarget(null)}
      >
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Change status for order #{statusTarget?.id}. Current status:{" "}
            <span className="font-semibold text-slate-900">
              {ORDER_STATUS_LABELS[statusTarget?.status] ||
                statusTarget?.status}
            </span>
          </div>

          {nextStatusOptions.length ? (
            <select
              value={statusValue}
              onChange={(event) => setStatusValue(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70"
            >
              {nextStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {ORDER_STATUS_LABELS[option] || option}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              This order cannot be updated further.
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStatusTarget(null)}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={handleStatusChange}
              disabled={submitting || !nextStatusOptions.length || !statusValue}
            >
              {submitting ? "Saving..." : "Update Status"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={Boolean(cancelTarget)}
        title="Cancel Order"
        message={
          cancelTarget
            ? `Cancel order #${cancelTarget.id}? Stock will be restored by the backend.`
            : ""
        }
        confirmText="Cancel Order"
        loadingText="Cancelling..."
        onConfirm={handleCancelOrder}
        onClose={() => setCancelTarget(null)}
        loading={submitting}
      />
    </div>
  );
}

export default OrdersPage;
