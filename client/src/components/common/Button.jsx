function Button({
  children,

  variant = "primary",

  className = "",

  ...props
}) {
  const variants = {
    primary:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/15",

    danger:
      "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20",

    success:
      "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20",

    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/40 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
