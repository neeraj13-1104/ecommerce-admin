import React, { useEffect, useState } from "react";
import axios from "axios";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [offerCount, setOfferCount] = useState(0);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    discountType: "PERCENT",
    discountValue: "",
    minCartValue: "",
    categories: [],
    bannerImage: null,
    startDate: "",
    endDate: "",
  });

  const token = localStorage.getItem("adminToken");

  const formatCategory = (cat) => {
    if (!cat) return "N/A";
    if (typeof cat === "string") return cat.replace(/[-_]/g, " ").toUpperCase();
    if (Array.isArray(cat)) return cat.map((c) => formatCategory(c)).join(", ");
    return "N/A";
  };

  const fetchOffers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/offers/category/active");
      setOffers(res.data?.offers || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOfferCount = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/offers/category/count");
      setOfferCount(res.data?.count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/categories");
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Category fetch error", err);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchCategories();
    fetchOfferCount();
  }, []);

  const toggleCategory = (cat) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const submitOffer = async () => {
    if (
      !form.title ||
      !form.discountValue ||
      form.categories.length === 0 ||
      !form.bannerImage ||
      !form.startDate ||
      !form.endDate
    ) {
      return alert("❌ Please fill all required fields");
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("discountType", form.discountType);
      formData.append("discountValue", form.discountValue);
      formData.append("minCartValue", form.minCartValue || 0);
      form.categories.forEach((c) => formData.append("categories[]", c));
      formData.append("bannerImage", form.bannerImage);
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate);

      await axios.post(
        "http://localhost:5000/api/offers/category/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Category offer created");

      setForm({
        title: "",
        discountType: "PERCENT",
        discountValue: "",
        minCartValue: "",
        categories: [],
        bannerImage: null,
        startDate: "",
        endDate: "",
      });

      fetchOffers();
      fetchOfferCount();
    } catch (err) {
      console.error(err);
      alert("❌ Offer creation failed");
    }
  };

  const deleteOffer = async (id) => {
    if (!window.confirm("Delete this offer?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/offers/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Offer deleted");
      fetchOffers();
      fetchOfferCount();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete offer");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🎯 Category Offer Management</h1>
        <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">
          Active Offers: {offerCount}
        </span>
      </div>

      {/* OFFER FORM */}
      <div className="bg-white shadow-lg rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Offer Title"
          className="border p-2 rounded focus:ring-2 focus:ring-purple-400"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <select
          className="border p-2 rounded focus:ring-2 focus:ring-purple-400"
          value={form.discountType}
          onChange={(e) => setForm({ ...form, discountType: e.target.value })}
        >
          <option value="PERCENT">Percent</option>
          <option value="FLAT">Flat</option>
        </select>

        <input
          type="number"
          placeholder="Discount Value"
          className="border p-2 rounded focus:ring-2 focus:ring-purple-400"
          value={form.discountValue}
          onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
        />

        <input
          type="number"
          placeholder="Minimum Cart Value"
          className="border p-2 rounded focus:ring-2 focus:ring-purple-400"
          value={form.minCartValue}
          onChange={(e) => setForm({ ...form, minCartValue: e.target.value })}
        />

        {/* CATEGORIES */}
        <div className="col-span-1 md:col-span-2 border p-4 rounded-lg bg-gray-50">
          <p className="font-semibold mb-2">Select Categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                  form.categories.includes(cat)
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-purple-100"
                }`}
              >
                {formatCategory(cat)}
              </button>
            ))}
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded col-span-1 md:col-span-2"
          onChange={(e) => setForm({ ...form, bannerImage: e.target.files[0] })}
        />

        <input
          type="date"
          className="border p-2 rounded focus:ring-2 focus:ring-purple-400"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 rounded focus:ring-2 focus:ring-purple-400"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />

        <button
          onClick={submitOffer}
          className="col-span-1 md:col-span-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Create Category Offer
        </button>
      </div>

      {/* ACTIVE OFFERS */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Active Category Offers</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {offers.map((o) => (
          <div
            key={o._id}
            className="relative border rounded-xl bg-white shadow hover:shadow-xl transition"
          >
            <button
              onClick={() => deleteOffer(o._id)}
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
            >
              ✕
            </button>

            <img
              src={`http://localhost:5000${o.bannerImage}`}
              className="h-40 w-full object-cover rounded-t-xl"
            />

            <div className="p-4 space-y-1">
              <h3 className="font-bold text-lg">{o.title}</h3>
              <p className="text-sm font-medium text-purple-700">
                {o.discountValue}
                {o.discountType === "PERCENT" ? "%" : "₹"} OFF
              </p>
              <p className="text-xs text-gray-600">
                Categories: <span className="font-medium">{formatCategory(o.categories)}</span>
              </p>
              <p className="text-xs text-gray-400">
                {new Date(o.startDate).toLocaleDateString()} → {new Date(o.endDate).toLocaleDateString()}
              </p>
              <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                ACTIVE
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
