import React, { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 🔥 PAGINATION STATE
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  // ---------------- FETCH PRODUCTS (BACKEND PAGINATION + CATEGORY) ----------------
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/products/cart`,
        {
          params: {
            page,
            limit,
            category: selectedCategory,
          },
        }
      );

      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log("Dashboard fetch error", err);
    }
  };

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/products/categories`
      );
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Category fetch error", err);
    }
  };

  // 🔁 REFRESH PRODUCTS WHEN PAGE OR CATEGORY CHANGES
  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------- STATS ----------------
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">🛒 Admin Dashboard</h1>

      {/* ---------------- STATS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Products (Current Page)</p>
          <h2 className="text-3xl font-bold text-blue-600">{totalProducts}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Categories</p>
          <h2 className="text-3xl font-bold text-green-600">
            {categories.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Stock (Page)</p>
          <h2 className="text-3xl font-bold text-purple-600">{totalStock}</h2>
        </div>
      </div>

      {/* ---------------- CATEGORY FILTER ---------------- */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">Filter by Category</h2>

        <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full font-medium text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            ALL
          </button>

          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full font-medium ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 hover:bg-blue-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- PRODUCTS PREVIEW ---------------- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Products ({selectedCategory})
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((item) => {
              const imageUrl = item.thumbnail
                ? item.thumbnail.startsWith("http")
                  ? item.thumbnail
                  : `${BASE_URL}${item.thumbnail}`
                : "https://via.placeholder.com/150";

              return (
                <div
                  key={item._id}
                  className="bg-white p-3 rounded-xl shadow hover:shadow-lg transition"
                >
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="h-32 w-full object-cover rounded mb-2"
                  />
                  <h3 className="font-semibold text-sm truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600">₹ {item.price}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          ⬅ Prev
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
