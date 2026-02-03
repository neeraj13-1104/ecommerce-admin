import React, { useEffect, useState } from "react";
import axios from "axios";

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
        `http://localhost:5000/api/products/cart?page=${pageNumber}&limit=${limit}`
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
        "http://localhost:5000/api/products/categories"
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
          `http://localhost:5000/api/admin/products/edit/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Product Updated");
      } else {
        await axios.post(
          "http://localhost:5000/api/admin/products/add",
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
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts(page);
    } catch (err) {
      console.log(err);
      alert("❌ Failed to delete product");
    }
  };

  /* ---------- PAGINATION NUMBERS ---------- */
  const getPages = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">🛒 Product Management</h1>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">
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

        <div className="flex gap-3">
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
              className="border px-4 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ================= PRODUCT LIST ================= */}
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>

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
                    <th className="p-3">Image</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-t hover:bg-gray-50">
                      <td className="p-3">
                        <img
                          src={
                            p.thumbnail?.startsWith("http")
                              ? p.thumbnail
                              : `http://localhost:5000${p.thumbnail}`
                          }
                          alt={p.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </td>
                      <td className="p-3 font-medium">{p.title}</td>
                      <td className="p-3">₹ {p.price}</td>
                      <td className="p-3">{p.stock}</td>
                      <td className="p-3 text-center space-x-3">
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

            {/* ===== NUMBERED PAGINATION ===== */}
            <div className="flex justify-center mt-8">
              <div className="flex gap-2 flex-wrap">
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Items;
