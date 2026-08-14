import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Tag, Package } from "lucide-react";

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../features/categories/categoryThunks";
import {
  selectCategories,
  selectCategoriesLoading,
} from "../features/categories/categorySelector";
import { selectUser } from "../features/auth/authSelectors";

import DataTable from "../components/tables/DataTable";
import Modal from "../components/common/Modal";
import ConfirmModal from "../components/common/ConfirmModal";
import Button from "../components/common/Button";
import CategoryForm from "../components/CategoryForm";

function CategoriesPage() {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const user = useSelector(selectUser);
  const canManageCategories = user?.role === "ADMIN";

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      await dispatch(fetchCategories()).unwrap();
    } catch (error) {
      toast.error(error || "Failed to load categories.");
    }
  };

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((category) => category.active).length;
    const inUse = categories.reduce(
      (count, category) => count + (category._count?.products || 0),
      0,
    );

    return { total, active, inUse };
  }, [categories]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const closeFormModal = () => {
    setFormOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({
            id: editingCategory.id,
            payload: values,
          }),
        ).unwrap();

        toast.success("Category updated successfully.");
      } else {
        await dispatch(createCategory(values)).unwrap();
        toast.success("Category created successfully.");
      }

      closeFormModal();
      await loadCategories();
    } catch (error) {
      toast.error(error || "Unable to save category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setSubmitting(true);

    try {
      await dispatch(deleteCategory(deleteTarget.id)).unwrap();
      toast.success("Category deleted successfully.");
      setDeleteTarget(null);
      await loadCategories();
    } catch (error) {
      toast.error(
        error ||
          "Unable to delete category. If products use it, remove or reassign them first.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: "name",
      title: "Category",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10">
            <Tag size={18} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-500">ID #{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      title: "Description",
      render: (row) => row.description || "-",
    },
    {
      key: "products",
      title: "Products",
      render: (row) => (
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          <Package size={14} />
          {row._count?.products || 0}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (row) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
            row.active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {row.active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  if (canManageCategories) {
    columns.push({
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm hover:bg-slate-50"
            onClick={() => openEditModal(row)}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="danger"
            className="rounded-full bg-rose-500 px-4 py-2 shadow-sm hover:bg-rose-600"
            onClick={() => setDeleteTarget(row)}
          >
            Delete
          </Button>
        </div>
      ),
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Categories
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              Category module
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Admin users can create, edit, and soft delete categories. Staff
              can only view the list.
            </p>
          </div>

          {canManageCategories && (
            <Button onClick={openCreateModal}>Add Category</Button>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Total
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {stats.total}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Active
            </p>
            <p className="mt-2 text-3xl font-black text-emerald-600">
              {stats.active}
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Linked products
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900">
              {stats.inUse}
            </p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={categories} loading={loading} />

      {canManageCategories && (
        <>
          <Modal
            open={formOpen}
            title={editingCategory ? "Edit Category" : "Add Category"}
            onClose={closeFormModal}
          >
            <CategoryForm
              initialValues={editingCategory || undefined}
              onSubmit={handleSubmit}
              submitLabel={
                editingCategory ? "Update Category" : "Create Category"
              }
              submitting={submitting}
            />
          </Modal>

          <ConfirmModal
            open={Boolean(deleteTarget)}
            title="Delete Category"
            message={
              deleteTarget
                ? `Delete ${deleteTarget.name}? If products still use it, deletion will be blocked.`
                : ""
            }
            confirmText="Delete"
            onConfirm={handleDelete}
            onClose={() => setDeleteTarget(null)}
            loading={submitting}
          />
        </>
      )}
    </div>
  );
}

export default CategoriesPage;
