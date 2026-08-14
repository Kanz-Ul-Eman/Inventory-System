import Modal from "./Modal";
import Button from "./Button";

function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loadingText = "Deleting...",
  onConfirm,
  onClose,
  loading = false,
}) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-rose-100 bg-rose-50/80 px-5 py-4 text-sm text-rose-700">
          {message}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? loadingText : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
