import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/cart`, {
        params: {
          page,
          limit,
          category: selectedCategory,
        },
      });

      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log("Dashboard fetch error", err);
    }
  };

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/categories`);
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Category fetch error", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          🛒 Admin Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Manage your store products easily
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Products (Current Page)</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {totalProducts}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Total Categories</p>
          <h2 className="text-3xl font-bold text-green-600">
            {categories.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          <p className="text-gray-500 text-sm">Total Stock (Page)</p>
          <h2 className="text-3xl font-bold text-purple-600">
            {totalStock}
          </h2>
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div className="bg-white p-5 rounded-2xl shadow mb-8">
        <h2 className="font-semibold mb-4 text-gray-700">
          Filter by Category
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
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

      {/* PRODUCTS LIST VIEW */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        {/* TABLE HEADER (Desktop Only) */}
        <div className="hidden md:grid grid-cols-4 bg-gray-50 text-gray-600 text-sm font-semibold px-6 py-4 border-b">
          <div>Product</div>
          <div>Price</div>
          <div>Stock</div>
          <div>Status</div>
        </div>

        {/* TABLE BODY */}
        {products.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No products found
          </div>
        ) : (
          products.map((item) => {
            const imageUrl = item.thumbnail
              ? item.thumbnail.startsWith("http")
                ? item.thumbnail
                : `${BASE_URL}${item.thumbnail}`
              : "https://via.placeholder.com/150";

            return (
              <div
                key={item._id}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-4 border-b hover:bg-gray-50 transition"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="h-14 w-14 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 md:hidden">
                      ₹ {item.price}
                    </p>
                  </div>
                </div>

                

                {/* Price */}
                <div className="hidden md:block font-semibold text-blue-600">
                  ₹ {item.price}
                </div>

                {/* Stock */}
                <div className="text-gray-600">
                  {item.stock}
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.stock > 0
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-6 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          ⬅ Prev
        </button>

        <span className="font-medium text-gray-700">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>

    </div>
  );
};

export default Dashboard;