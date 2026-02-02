import React, { useEffect, useState } from "react";
import axios from "axios";

const Items = () => {
  const token = localStorage.getItem("adminToken");

  /* ---------- ADD PRODUCT STATES ---------- */
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------- CATEGORY LIST FROM API ---------- */
  const [categories, setCategories] = useState([]);

  /* ---------- PRODUCT LIST STATES ---------- */
  const [products, setProducts] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  /* ---------- FETCH PRODUCTS ---------- */
  const fetchProducts = async () => {
    try {
      setListLoading(true);
      const res = await axios.get("http://localhost:5000/api/products/cart");
      setProducts(res.data.data || []);
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
    fetchProducts();
    fetchCategories();
  }, []);

  /* ---------- ADD PRODUCT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !price || !stock || !image) {
      alert("❌ All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("image", image);

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/admin/products/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Product Added Successfully");

      setTitle("");
      setCategory("");
      setPrice("");
      setStock("");
      setImage(null);

      fetchProducts();
    } catch (err) {
      console.log(err);
      alert("❌ Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DELETE PRODUCT ---------- */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.log(err);
      alert("❌ Failed to delete product");
    }
  };

  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">🛒 Product Management</h1>

      {/* ================= ADD PRODUCT FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* CATEGORY DROPDOWN */}
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
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <input
          type="file"
          className="mb-4"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-lg transition"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {/* ================= PRODUCT LIST ================= */}
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>

        {listLoading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Image</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      <img
                        src={
                          p.thumbnail?.startsWith("http")
                            ? p.thumbnail
                            : `http://localhost:5000${p.thumbnail}`
                        }
                        alt={p.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>

                    <td className="p-3 font-medium">{p.title}</td>
                    <td className="p-3">₹ {p.price}</td>
                    <td className="p-3">{p.stock}</td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
