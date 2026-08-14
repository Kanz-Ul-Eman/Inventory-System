import {useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSelectors";

function Navbar() {

  const user = useSelector(selectUser);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/60 bg-white/80 px-6 backdrop-blur-xl">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Inventory Management
        </h2>
        <p className="text-xs text-slate-500">Products and stock overview</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">{user?.name}</p>

          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
