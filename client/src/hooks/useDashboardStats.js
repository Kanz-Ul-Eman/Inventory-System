import { useEffect, useState } from "react";

import api from "../api/axios";

const DEFAULT_STATS = {
  products: 0,
  categories: 0,
  customers: 0,
  orders: 0,
  lowStockProducts: 0,
};

const POLL_INTERVAL_MS = 30000;

export function useDashboardStats() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const [
          productsResponse,
          categoriesResponse,
          customersResponse,
          ordersResponse,
          lowStockResponse,
        ] = await Promise.all([
          api.get("/products", { params: { page: 1, limit: 1 } }),
          api.get("/categories"),
          api.get("/customers", { params: { page: 1, limit: 1 } }),
          api.get("/orders", { params: { page: 1, limit: 1 } }),
          api.get("/products/low-stock"),
        ]);

        if (!active) return;

        setStats({
          products: productsResponse.data.pagination?.totalProducts || 0,
          categories: categoriesResponse.data.categories?.length || 0,
          customers: customersResponse.data.pagination?.total || 0,
          orders: ordersResponse.data.pagination?.total || 0,
          lowStockProducts: lowStockResponse.data.products?.length || 0,
        });
      } catch {
        if (!active) return;

        setStats(DEFAULT_STATS);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadStats();

    const intervalId = setInterval(loadStats, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  return { stats, loading };
}
