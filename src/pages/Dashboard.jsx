import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/cart");
      setProducts(res.data.data || []);
    } catch (err) {
      console.log("Dashboard fetch error", err);
    }
  };

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/categories"
      );
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Category fetch error", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ---------------- STATS ----------------
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  // ---------------- FILTER ----------------
  const filteredProducts =
    selectedCategory === "ALL"
      ? products
      : products.filter(
          (p) =>
            p.category?.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase()
        );

  // ---------------- CHART DATA ----------------
  const categoryChartData = categories.map((cat) => ({
    name: cat,
    count: products.filter(
      (p) => p.category?.trim().toLowerCase() === cat.trim().toLowerCase()
    ).length,
  }));

  const COLORS = ["#2563eb", "#22c55e", "#f97316", "#ec4899", "#a855f7"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>

      {/* ---------------- STATS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Products</p>
          <h2 className="text-3xl font-bold text-blue-600">{totalProducts}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Categories</p>
          <h2 className="text-3xl font-bold text-green-600">{categories.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Stock</p>
          <h2 className="text-3xl font-bold text-purple-600">{totalStock}</h2>
        </div>
      </div>

      {/* ---------------- CHARTS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* BAR CHART */}
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="font-semibold mb-4">Products by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#2563eb"
                radius={[5, 5, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="font-semibold mb-4">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryChartData}
                dataKey="count"
                nameKey="name"
                outerRadius={100}
                innerRadius={40}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoryChartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------------- CATEGORY FILTER ---------------- */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">Filter by Category</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 ${
              selectedCategory === "ALL"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {selectedCategory === "ALL" && "✔️"} ALL
          </button>

          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 hover:bg-blue-200"
              }`}
            >
              {selectedCategory === cat && "✔️"} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- PRODUCTS PREVIEW ---------------- */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Products Preview ({selectedCategory})
        </h2>

        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProducts.map((item) => {
              const imageUrl = item.thumbnail
                ? item.thumbnail.startsWith("http")
                  ? item.thumbnail
                  : `http://localhost:5000${item.thumbnail}`
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
                  <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                  <p className="text-xs text-gray-600">₹ {item.price}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
