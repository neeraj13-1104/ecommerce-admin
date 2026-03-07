import React, { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const Items = () => {
  const token = localStorage.getItem("adminToken");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const isEditMode = Boolean(editId);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (pageNumber = page) => {
    try {
      setListLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/products/cart?page=${pageNumber}&limit=${limit}`
      );
      setProducts(res.data.data || []);
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setListLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/categories`);
      setCategories(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !price || !stock) {
      alert("All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("stock", stock);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      if (isEditMode) {
        await axios.put(
          `${BASE_URL}/api/admin/products/edit/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${BASE_URL}/api/admin/products/add`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      resetForm();
      fetchProducts(page);
    } catch (err) {
      alert("Action failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setPrice("");
    setStock("");
    setImage(null);
    setEditId(null);
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setTitle(product.title);
    setCategory(product.category);
    setPrice(product.price);
    setStock(product.stock);
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts(page);
    } catch (err) {
      alert("Delete failed");
    }
  };

  const getPages = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
<div className="min-h-screen bg-gray-100 py-6 sm:py-8 px-3 sm:px-4">      <div className="max-w-6xl mx-auto space-y-10">

<h1 className="text-2xl sm:text-3xl font-bold text-gray-800">          🛒 Product Management
        </h1>

        {/* ================= ADD PRODUCT FORM (TOP FULL WIDTH) ================= */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold text-indigo-600">
            {isEditMode ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Product Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>

            <input
              type="number"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              type="number"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <input
            type="file"
            className="w-full text-sm"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                isEditMode
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Saving..." : isEditMode ? "Update" : "Add"}
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* ================= PRODUCT LIST BELOW ================= */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">All Products</h2>

          {listLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
<table className="w-full text-sm min-w-[600px]">                  <thead>
                    <tr className="bg-gray-100 text-gray-600">
                      <th className="p-4 text-left">Image</th>
                      <th className="p-4 text-left">Title</th>
                      <th className="p-4 text-left">Price</th>
                      <th className="p-4 text-left">Stock</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} className="border-t hover:bg-gray-50">
                        <td className="p-4">
                          <img
                            src={
                              p.thumbnail?.startsWith("http")
                                ? p.thumbnail
                                : `${BASE_URL}${p.thumbnail}`
                            }
                            alt={p.title}
                            className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg object-cover"
                          />
                        </td>
                        <td className="p-4 font-medium">{p.title}</td>
                        <td className="p-4">₹ {p.price}</td>
                        <td className="p-4">{p.stock}</td>
                        <td className="p-4 text-center">
  <div className="flex flex-col sm:flex-row gap-2 justify-center">
    <button
      onClick={() => handleEdit(p)}
      className="text-blue-600 hover:underline"
    >
      Edit
    </button>

    <button
      onClick={() => deleteProduct(p._id)}
      className="text-red-600 hover:underline"
    >
      Delete
    </button>
  </div>
</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center mt-8 gap-2 flex-wrap">
                <button
                  disabled={page === 1}
                  onClick={() => fetchProducts(page - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Prev
                </button>

                {getPages().map((p) => (
                  <button
                    key={p}
                    onClick={() => fetchProducts(p)}
                    className={`px-3 py-1 rounded ${
                      page === p
                        ? "bg-indigo-600 text-white"
                        : "border hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => fetchProducts(page + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Items;