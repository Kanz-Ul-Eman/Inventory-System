import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  updateCustomer,
} from "../features/customers/customerThunks";
import {
  selectCustomers,
  selectCustomersLoading,
  selectCustomersPagination,
} from "../features/customers/customerSelector";

const DEFAULT_LIMIT = 10;

export function useCustomers() {
  const dispatch = useDispatch();

  const customers = useSelector(selectCustomers);
  const loading = useSelector(selectCustomersLoading);
  const pagination = useSelector(selectCustomersPagination);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_LIMIT);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCustomers = async (nextPage = page, nextSearch = search) => {
    try {
      await dispatch(
        fetchCustomers({
          page: nextPage,
          limit,
          keyword: nextSearch,
        }),
      ).unwrap();
    } catch (error) {
      toast.error(error || "Failed to load customers.");
    }
  };

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, limit, dispatch]);

  const openCreateModal = () => {
    setEditingCustomer(null);
    setFormOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  };

  const closeFormModal = () => {
    setFormOpen(false);
    setEditingCustomer(null);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      if (editingCustomer) {
        await dispatch(
          updateCustomer({
            id: editingCustomer.id,
            payload: values,
          }),
        ).unwrap();

        toast.success("Customer updated successfully.");
      } else {
        await dispatch(createCustomer(values)).unwrap();
        toast.success("Customer created successfully.");
      }

      closeFormModal();
      await loadCustomers(page, search);
    } catch (error) {
      const message = error || "Unable to save customer.";

      toast.error(message);

      if (editingCustomer && /not found|missing|deleted/i.test(message)) {
        closeFormModal();
        await loadCustomers(page, search);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setSubmitting(true);

    try {
      await dispatch(deleteCustomer(deleteTarget.id)).unwrap();
      toast.success("Customer deleted successfully.");
      setDeleteTarget(null);
      await loadCustomers(page, search);
    } catch (error) {
      toast.error(error || "Unable to delete customer.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    customers,
    loading,
    pagination,
    search,
    setSearch,
    page,
    setPage,
    formOpen,
    editingCustomer,
    deleteTarget,
    submitting,
    openCreateModal,
    openEditModal,
    closeFormModal,
    setDeleteTarget,
    handleSubmit,
    handleDelete,
    loadCustomers,
  };
}
