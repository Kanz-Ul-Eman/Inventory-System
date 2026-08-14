import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import orderService from "../services/order.service";

const DEFAULT_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 300;

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search]);

  const hasInvalidDateRange = Boolean(startDate && endDate && startDate > endDate);

  const loadOrders = async () => {
    if (hasInvalidDateRange) {
      setLoading(false);
      setError("Start date cannot be after end date.");
      setOrders([]);
      setPagination({});
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await orderService.getOrders({
        page,
        limit,
        keyword: debouncedSearch || undefined,
        status: status || undefined,
        customerId: customerId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      setOrders(data.orders || []);
      setPagination(data.pagination || {});
    } catch (requestError) {
      const message = requestError?.response?.data?.message || "Failed to load orders.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch, status, customerId, startDate, endDate, refreshKey]);

  const refreshOrders = () => setRefreshKey((value) => value + 1);

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setCustomerId("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search || status || customerId || startDate || endDate,
  );

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    return {
      totalRevenue,
      totalOrders: pagination.total || 0,
    };
  }, [orders, pagination.total]);

  return {
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
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    page,
    setPage,
    limit,
    refreshOrders,
    loadOrders,
    clearFilters,
    hasActiveFilters,
    hasInvalidDateRange,
    metrics,
  };
}
