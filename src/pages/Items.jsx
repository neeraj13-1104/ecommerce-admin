import React, { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const Items = () => {
  const token = localStorage.getItem("adminToken");

  /* ---------- FORM STATES ---------- */
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------- EDIT MODE ---------- */
  const [editId, setEditId] = useState(null);
  const isEditMode = Boolean(editId);

  /* ---------- CATEGORY LIST ---------- */
  const [categories, setCategories] = useState([]);

  /* ---------- PRODUCT LIST ---------- */
  const [products, setProducts] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  /* ---------- PAGINATION ---------- */
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  /* ---------- FETCH PRODUCTS ---------- */
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
      console.log("Failed to load products", err);
    } finally {
      setListLoading(false);
    }
  };

  /* ---------- FETCH CATEGORIES ---------- */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/products/categories`
      );
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    fetchCategories();
  }, []);

  /* ---------- ADD / UPDATE ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !price || !stock) {
      alert("❌ All fields required");
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
        alert("✅ Product Updated");
      } else {
        await axios.post(
          `${BASE_URL}/api/admin/products/add`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Product Added");
      }

      resetForm();
      fetchProducts(page);
    } catch (err) {
      console.log(err);
      alert("❌ Action failed");
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

  /* ---------- EDIT ---------- */
  const handleEdit = (product) => {
    setEditId(product._id);
    setTitle(product.title);
    setCategory(product.category);
    setPrice(product.price);
    setStock(product.stock);
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------- DELETE ---------- */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts(page);
    } catch (err) {
      console.log(err);
      alert("❌ Failed to delete product");
    }
  };

  const getPages = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
        🛒 Product Management
      </h1>

      {/* ===== FORM + TABLE LAYOUT ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 w-full max-w-md"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            {isEditMode ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>

          <input
            className="border p-2 w-full mb-3 rounded"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            className="border p-2 w-full mb-3 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            className="border p-2 w-full mb-3 rounded"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            className="border p-2 w-full mb-3 rounded"
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <input
            type="file"
            className="mb-4"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              disabled={loading}
              className={`${
                isEditMode
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white w-full py-2 rounded-lg`}
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Product"
                : "Add Product"}
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={resetForm}
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* ================= PRODUCT LIST ================= */}
        <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            All Products
          </h2>

          {listLoading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 sm:p-3 text-sm sm:text-base">Image</th>
                      <th className="p-2 sm:p-3 text-sm sm:text-base">Title</th>
                      <th className="p-2 sm:p-3 text-sm sm:text-base">Price</th>
                      <th className="p-2 sm:p-3 text-sm sm:text-base">Stock</th>
                      <th className="p-2 sm:p-3 text-sm sm:text-base text-center">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} className="border-t hover:bg-gray-50">
                        <td className="p-2 sm:p-3">
                          <img
                            src={
                              p.thumbnail?.startsWith("http")
                                ? p.thumbnail
                                : `${BASE_URL}${p.thumbnail}`
                            }
                            alt={p.title}
                            className="h-10 w-10 sm:h-12 sm:w-12 rounded object-cover"
                          />
                        </td>

                        <td className="p-2 sm:p-3 text-sm sm:text-base font-medium whitespace-nowrap">
                          {p.title}
                        </td>

                        <td className="p-2 sm:p-3 text-sm sm:text-base whitespace-nowrap">
                          ₹ {p.price}
                        </td>

                        <td className="p-2 sm:p-3 text-sm sm:text-base whitespace-nowrap">
                          {p.stock}
                        </td>

                        <td className="p-2 sm:p-3 text-center flex flex-col sm:flex-row gap-1 sm:gap-3 text-sm sm:text-base whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(p)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(p._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ===== PAGINATION ===== */}
              <div className="flex justify-center mt-6 sm:mt-8 px-2">
                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center text-xs sm:text-base">
                  <button
                    disabled={page === 1}
                    onClick={() => fetchProducts(page - 1)}
                    className="px-2 sm:px-3 py-1 border rounded"
                  >
                    Prev
                  </button>

                  {getPages().map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchProducts(p)}
                      className={`px-2 sm:px-3 py-1 rounded ${
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
                    className="px-2 sm:px-3 py-1 border rounded disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Items;
