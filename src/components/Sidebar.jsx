import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ user, setToken, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    navigate("/auth");
  };

  const isSuperAdmin = user?.role === "superadmin";

  const activeClass = (path) =>
    location.pathname === path
      ? "bg-gray-700 text-white font-semibold"
      : "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col justify-between shadow-lg">
      {/* ===== HEADER ===== */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-indigo-400">Admin Panel</h1>
      </div>

      {/* ===== MENU ITEMS ===== */}
      <ul className="flex-1 mt-4">
        <li className={`p-4 cursor-pointer transition rounded-lg mb-1 ${activeClass("/")}`}>
          <Link to="/">Dashboard</Link>
        </li>

        <li className={`p-4 cursor-pointer transition rounded-lg mb-1 ${activeClass("/items")}`}>
          <Link to="/items">Products</Link>
        </li>

        <li className={`p-4 cursor-pointer transition rounded-lg mb-1 ${activeClass("/offers")}`}>
          <Link to="/offers">🎯 Offers</Link>
        </li>

        <li className={`p-4 cursor-pointer transition rounded-lg mb-1 ${activeClass("/order")}`}>
          <Link to="/order">📦 Orders</Link>
        </li>

        {isSuperAdmin && (
          <>
            <li className={`p-4 cursor-pointer transition rounded-lg mb-1 ${activeClass("/carousel")}`}>
              <Link to="/carousel">🖼 Carousel</Link>
            </li>

            <li className={`p-4 cursor-pointer transition rounded-lg mb-1 ${activeClass("/management")}`}>
              <Link to="/management">Management</Link>
            </li>

            <li className={`p-4 cursor-pointer transition rounded-lg mb-1 ${activeClass("/settings")}`}>
              <Link to="/settings">⚙️ Settings</Link>
            </li>

            <li className={`p-4 cursor-pointer transition rounded-lg mb-1 ${activeClass("/notifications")}`}>
              <Link to="/notifications">🔔 Notifications</Link>
            </li>

            <li className={`p-4 cursor-pointer transition rounded-lg mb-1 ${activeClass("/help")}`}>
              <Link to="/help">❓ Help</Link>
            </li>
          </>
        )}
      </ul>

      {/* ===== LOGOUT BUTTON FIXED ===== */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
        >
          🔒 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
