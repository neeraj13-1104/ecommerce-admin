import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = ({ user, setToken, setUser }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setIsOpen(false);
    navigate("/auth");
  };

  const isSuperAdmin = user?.role === "superadmin";

  const activeClass = (path) =>
    location.pathname === path
      ? "bg-gray-700 text-white font-semibold"
      : "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <>
    {/* ✅ Mobile Menu Button */}
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg shadow"
    >
      ☰
    </button>
    <div
  className={`
    fixed top-0 left-0 z-40 h-screen w-64
    bg-gray-900 text-white flex flex-col shadow-lg
    transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0 md:static
  `}
>
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

            
          </>
        )}
      </ul>

      {/* ===== LOGOUT BUTTON FIXED ===== */}
      <div className="p-4 border-t border-gray-700 mt-6">
        <button
          onClick={logout}
          className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
        >
          🔒 Logout
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;  


