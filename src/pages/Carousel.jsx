import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";

const CarouselAdmin = () => {
  const token = localStorage.getItem("adminToken");

  /* ===== COMMON ===== */
  const [categories, setCategories] = useState([]);

  /* ===== CAROUSEL ===== */
  const [carouselImage, setCarouselImage] = useState(null);
  const [carouselCategory, setCarouselCategory] = useState("");
  const [carouselList, setCarouselList] = useState([]);

  /* ================= FETCH ================= */

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/categories"
      );
      setCategories(res.data.data || []);
    } catch (err) {
      console.log("Category fetch error", err);
    }
  };

  const fetchCarousel = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/carousel");
      setCarouselList(res.data || []);
    } catch (err) {
      console.log("Carousel fetch error", err);
    }
  };

  /* ================= ADD ================= */

  const addCarousel = async () => {
    if (!carouselImage || !carouselCategory) {
      return alert("❌ Image & category required");
    }

    const fd = new FormData();
    fd.append("image", carouselImage);
    fd.append("category", carouselCategory);

    try {
      await axios.post("http://localhost:5000/api/carousel/add", fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCarouselImage(null);
      setCarouselCategory("");
      fetchCarousel();
    } catch (err) {
      alert("Carousel upload failed");
      console.log(err.response?.data || err.message);
    }
  };

  /* ================= DELETE ================= */

  const deleteCarousel = async (id) => {
    if (!window.confirm("Delete carousel image?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/carousel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCarousel();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    fetchCategories();
    fetchCarousel();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          🛠 Super Admin – Home Control
        </h1>
        <p className="text-gray-500 mt-1">
          Manage homepage carousel category wise
        </p>
      </div>

      {/* ================= ADD CAROUSEL ================= */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-14">
        <h2 className="text-xl font-semibold mb-4">
          ➕ Add Carousel Image
        </h2>

        <div className="grid grid-cols-3 gap-6 items-end">
          {/* IMAGE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Carousel Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg p-2"
              onChange={(e) => setCarouselImage(e.target.files[0])}
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Category
            </label>
            <select
              value={carouselCategory}
              onChange={(e) => setCarouselCategory(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Choose category</option>
              {categories.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* BUTTON */}
          <button
            onClick={addCarousel}
            className="bg-blue-600 hover:bg-blue-700 text-white
                       font-medium py-2 rounded-lg transition"
          >
            Upload Carousel
          </button>
        </div>
      </div>

      {/* ================= CAROUSEL LIST ================= */}
      <h2 className="text-xl font-semibold mb-6">
        🎠 Active Carousel Images
      </h2>

      {carouselList.length === 0 ? (
        <p className="text-gray-500">No carousel images found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {carouselList.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-xl shadow hover:shadow-xl
                         transition overflow-hidden group relative"
            >
              {/* IMAGE */}
              <img
                src={`http://localhost:5000/${c.image}`}
                alt="carousel"
                className="h-44 w-full object-cover"
              />

              {/* CATEGORY TAG */}
              <span
                className="absolute bottom-3 left-3 bg-black/70 text-white
                           text-xs px-3 py-1 rounded-full"
              >
                {c.category}
              </span>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteCarousel(c._id)}
                className="absolute top-3 right-3 bg-red-600 text-white
                           px-3 py-1 text-sm rounded-full
                           opacity-0 group-hover:opacity-100 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselAdmin;
