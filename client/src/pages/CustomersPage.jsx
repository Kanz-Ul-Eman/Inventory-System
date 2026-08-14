import { useCustomers } from "../hooks/useCustomers";

import SearchInput from "../components/common/SearchInput";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmModal from "../components/common/ConfirmModal";
import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";

function CustomersPage() {
  const {
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
  } = useCustomers();

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Customers
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              Customer module
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Create, edit, delete, search, and page through customers. Admin
              and staff can manage the list.
            </p>
          </div>

          <Button onClick={openCreateModal}>Add Customer</Button>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search customers by name, email, or phone..."
          />

          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            Showing {customers.length} of {pagination.total || 0}
          </div>
        </div>
      </div>

      <CustomerTable
        customers={customers}
        loading={loading}
        pagination={pagination}
        page={page}
        setPage={setPage}
        onEdit={openEditModal}
        onDelete={setDeleteTarget}
      />

      <Modal
        open={formOpen}
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
        onClose={closeFormModal}
      >
        <CustomerForm
          initialValues={editingCustomer || undefined}
          onSubmit={handleSubmit}
          submitLabel={editingCustomer ? "Update Customer" : "Create Customer"}
          submitting={submitting}
        />
      </Modal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Customer"
        message={
          deleteTarget
            ? `Delete ${deleteTarget.name}? If they have orders, This action will be blocked.`
            : ""
        }
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        loading={submitting}
      />
    </div>
  );
}

export default CustomersPage;
