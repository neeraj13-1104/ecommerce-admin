import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;


const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("adminToken");

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/orders/admin/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await axios.put(
        `${BASE_URL}/api/orders/admin/status/${orderId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("❌ Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatPrice = (amt) => `₹ ${Number(amt || 0).toFixed(2)}`;

  const statusStyle = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "SHIPPED":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-yellow-100 text-yellow-700"; // PLACED
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading orders...
      </div>
    );
  }

  return (
<div className="px-3 sm:px-6 lg:px-8 py-6 bg-gray-100 min-h-screen">      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">📦 Order Management</h1>
        <p className="text-gray-500 mt-1">
          Manage all customer orders from here
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded shadow text-center text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
<table className="min-w-[700px] w-full text-sm">            <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <tr>
                <th className="px-4 py-4 text-left">Order ID</th>
                <th className="px-4 py-4 text-left">Customer</th>
<th className="hidden md:table-cell px-4 py-4 text-left">Email</th>                <th className="px-4 py-4 text-left">Amount</th>
                <th className="px-4 py-4 text-left">Status</th>
                <th className="px-4 py-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[160px] truncate">
                    {order._id}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {order.user?.name || "N/A"}
                  </td>

                 <td className="hidden md:table-cell px-4 py-3">
                    {order.user?.email || "N/A"}
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    {formatPrice(order.finalAmount)}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                      className="w-full border rounded-lg px-3 py-1 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60"
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
