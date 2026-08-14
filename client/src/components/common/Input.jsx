function Input({ label, error, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>

      <input
        {...props}
        className={`w-full rounded-lg border px-3 py-2 outline-none transition

                ${
                  error
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
      />

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

export default Input;
