import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-lg px-4 h-12 flex items-center justify-between">
        <NavLink
          to="/"
          className="text-sm font-semibold text-neutral-800 hover:text-orange-500 transition-colors"
        >
          Recipe Finder
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? "text-orange-500" : "text-neutral-500 hover:text-neutral-800"}`
          }
        >
          History
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
