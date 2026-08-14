import { X } from "lucide-react";

function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-gradient-to-b from-white to-slate-50 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
