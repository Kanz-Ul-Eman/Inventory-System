import DataTable from "./tables/DataTable";
import Pagination from "./tables/Pagination";

import Button from "./common/Button";
import { PencilLine, Trash2 } from "lucide-react";

function ProductTable({
  products,
  loading,
  pagination,
  page,
  setPage,
  canManageProducts,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "name",
      title: "Name",
    },

    {
      key: "sku",
      title: "SKU",
    },

    {
      key: "category",
      title: "Category",

      render: (row) => row.category?.name,
    },

    {
      key: "unitPrice",
      title: "Price",

      render: (row) => `Rs. ${row.unitPrice}`,
    },

    {
      key: "quantityInStock",
      title: "Stock",

      render: (row) => {
        const isLowStock = row.quantityInStock <= row.reorderLevel;

        return (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              isLowStock
                ? "bg-rose-100 text-rose-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {row.quantityInStock}
          </span>
        );
      },
    },
  ];

  if (canManageProducts) {
    columns.push({
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700 shadow-sm hover:border-emerald-300 hover:bg-emerald-100"
            onClick={() => onEdit(row)}
          >
            <PencilLine size={16} />
            Edit
          </Button>

          <Button
            type="button"
            variant="danger"
            className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 shadow-sm hover:bg-rose-600"
            onClick={() => onDelete(row)}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      ),
    });
  }

  return (
    <div className="space-y-5">
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        rowClassName={(row) =>
          row.quantityInStock <= row.reorderLevel ? "bg-rose-50/80" : ""
        }
      />
      <Pagination
        page={page}
        totalPages={pagination.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}

export default ProductTable;
