function EmptyState({ title = "No Data Found" }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 py-16 text-center text-slate-500 shadow-sm">
      {title}
    </div>
  );
}

export default EmptyState;
