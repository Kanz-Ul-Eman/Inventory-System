import { FaBox, FaUsers, FaShoppingCart, FaTags } from "react-icons/fa";

import StatCard from "../components/ui/StatCard";
import { useDashboardStats } from "../hooks/useDashboardStats";

function DashboardPage() {
  const { stats, loading } = useDashboardStats();

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Live overview of the inventory system. Counts refresh
              automatically every few seconds.
            </p>
          </div>

          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Live updating
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Products"
          value={loading ? "..." : stats.products}
          icon={FaBox}
        />

        <StatCard
          title="Categories"
          value={loading ? "..." : stats.categories}
          icon={FaTags}
        />

        <StatCard
          title="Customers"
          value={loading ? "..." : stats.customers}
          icon={FaUsers}
        />

        <StatCard
          title="Orders"
          value={loading ? "..." : stats.orders}
          icon={FaShoppingCart}
        />

        <StatCard
          title="Low stock"
          value={loading ? "..." : stats.lowStockProducts}
          icon={FaBox}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
