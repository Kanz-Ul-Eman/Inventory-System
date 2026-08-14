import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../features/products/productThunks";
import {
  selectProducts,
  selectProductsLoading,
  selectProductsPagination,
} from "../features/products/productSelectors";
import { selectUser } from "../features/auth/authSelectors";

import ProductTable from "../components/ProductTable";
import SearchInput from "../components/common/SearchInput";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmModal from "../components/common/ConfirmModal";
import ProductForm from "../components/ProductForm";
import categoryService from "../services/category.service";

function ProductsPage() {
  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const pagination = useSelector(selectProductsPagination);
  const user = useSelector(selectUser);
  const canManageProducts = user?.role === "ADMIN";

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [categories, setCategories] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = async (nextPage = page, nextSearch = search) => {
    try {
      await dispatch(
        fetchProducts({
          page: nextPage,
          limit,
          keyword: nextSearch,
        }),
      ).unwrap();
    } catch (error) {
      toast.error(error || "Failed to load products.");
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, limit, search]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data.categories || []);
      } catch (error) {
        toast.error(error || "Failed to load categories.");
      }
    };

    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const closeFormModal = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      if (editingProduct) {
        await dispatch(
          updateProduct({
            id: editingProduct.id,
            payload: values,
          }),
        ).unwrap();

        toast.success("Product updated successfully.");
      } else {
        await dispatch(createProduct(values)).unwrap();
        toast.success("Product created successfully.");
      }

      closeFormModal();
      await loadProducts(page, search);
    } catch (error) {
      toast.error(error || "Unable to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setSubmitting(true);

    try {
      await dispatch(deleteProduct(deleteTarget.id)).unwrap();
      toast.success("Product deleted successfully.");
      setDeleteTarget(null);
      await loadProducts(page, search);
    } catch (error) {
      toast.error(error || "Unable to delete product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage inventory products, pricing, and stock levels.
          </p>
        </div>

        {canManageProducts && (
          <Button onClick={openCreateModal}>Add Product</Button>
        )}
      </div>

      <div className="mb-5">
        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <ProductTable
        products={products}
        loading={loading}
        pagination={pagination}
        page={page}
        setPage={setPage}
        canManageProducts={canManageProducts}
        onEdit={openEditModal}
        onDelete={setDeleteTarget}
      />

      {canManageProducts && (
        <>
          <Modal
            open={formOpen}
            title={editingProduct ? "Edit Product" : "Add Product"}
            onClose={closeFormModal}
          >
            <ProductForm
              categories={categories}
              initialValues={editingProduct || undefined}
              onSubmit={handleSubmit}
              submitLabel={editingProduct ? "Update Product" : "Create Product"}
              submitting={submitting}
            />
          </Modal>

          <ConfirmModal
            open={Boolean(deleteTarget)}
            title="Delete Product"
            message={
              deleteTarget
                ? `Delete ${deleteTarget.name}? This action cannot be undone.`
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

export default ProductsPage;
