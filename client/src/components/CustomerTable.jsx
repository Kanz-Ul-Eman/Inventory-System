import DataTable from "./tables/DataTable";
import Pagination from "./tables/Pagination";

import Button from "./common/Button";
import { PencilLine, Trash2, UserRound, Mail, Phone } from "lucide-react";

function CustomerTable({
  customers,
  loading,
  pagination,
  page,
  setPage,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "name",
      title: "Customer",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10">
            <UserRound size={18} />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-500">ID #{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      render: (row) => (
        <span className="inline-flex items-center gap-2 text-slate-700">
          <Mail size={14} className="text-slate-400" />
          {row.email}
        </span>
      ),
    },
    {
      key: "phone",
      title: "Phone",
      render: (row) => (
        <span className="inline-flex items-center gap-2 text-slate-700">
          <Phone size={14} className="text-slate-400" />
          {row.phone}
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
    {
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
    },
  ];

  return (
    <div className="space-y-5">
      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        emptyTitle="No customers found."
      />

      <Pagination
        page={page}
        totalPages={pagination.totalPages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}

export default CustomerTable;
