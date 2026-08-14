import { Search } from "lucide-react";

function SearchInput({
  value,

  onChange,

  placeholder = "Search...",
}) {
  return (
    <div className="relative w-full max-w-xl">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-full border border-slate-200 bg-white/90 py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70"
      />
    </div>
  );
}

export default SearchInput;
