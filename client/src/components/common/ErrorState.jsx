function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50/80 px-6 py-10 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-rose-800">{title}</h3>

      {message && <p className="mt-2 text-sm text-rose-700">{message}</p>}

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
