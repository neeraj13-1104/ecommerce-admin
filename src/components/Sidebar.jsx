import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ user, setToken, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false); // mobile toggle

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    navigate("/auth");
  };

  const role = user?.role;

  const activeClass = (path) =>
    location.pathname === path
      ? "bg-gray-700 text-white font-semibold"
      : "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <>
      {/* MOBILE TOGGLE BUTTON */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg
        w-64 flex flex-col justify-between transition-transform
        transform ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static`}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-indigo-400">Admin Panel</h1>
        </div>

        {/* MENU */}
        <ul className="flex-1 mt-4">
          {/* Dashboard - All roles */}
          <li className={`p-4 cursor-pointer rounded-lg mb-1 ${activeClass("/")}`}>
            <Link to="/">Dashboard</Link>
          </li>

          {/* Products - Product admin + superadmin */}
          {(role === "superadmin" || role === "productadmin") && (
            <li className={`p-4 cursor-pointer rounded-lg mb-1 ${activeClass("/items")}`}>
              <Link to="/items">Products</Link>
            </li>
          )}

          {/* Offers - Only superadmin */}
          {role === "superadmin" && (
            <li className={`p-4 cursor-pointer rounded-lg mb-1 ${activeClass("/offers")}`}>
              <Link to="/offers">🎯 Offers</Link>
            </li>
          )}

          {/* Orders - Only superadmin */}
          {role === "superadmin" && (
            <li className={`p-4 cursor-pointer rounded-lg mb-1 ${activeClass("/order")}`}>
              <Link to="/order">📦 Orders</Link>
            </li>
          )}

          {/* Carousel & Management - Only superadmin */}
          {role === "superadmin" && (
            <>
              <li className={`p-4 cursor-pointer rounded-lg mb-1 ${activeClass("/carousel")}`}>
                <Link to="/carousel">🖼 Carousel</Link>
              </li>
              <li className={`p-4 cursor-pointer rounded-lg mb-1 ${activeClass("/management")}`}>
                <Link to="/management">Management</Link>
              </li>
            </>
          )}
        </ul>

        {/* LOGOUT */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
          >
            🔒 Logout
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Sidebar;
