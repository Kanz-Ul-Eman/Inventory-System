import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { sidebarLinks } from "../../constants/sidebar";
import { logout } from "../../features/auth/authThunks";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const result = await dispatch(logout());

    if (logout.fulfilled.match(result)) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-800/70 bg-slate-950 text-white shadow-[0_20px_60px_rgba(15,23,42,0.35)]">
      {/* Logo */}
      <div className="border-b border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
        <h1 className="text-2xl font-black tracking-wide">Inventory</h1>

        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
          Management Suite
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 space-y-1 px-3">
        {sidebarLinks.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white shadow-inner shadow-black/20 ring-1 ring-white/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="w-full rounded-xl bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
