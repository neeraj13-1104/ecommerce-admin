import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

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
        "http://localhost:5000/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data.orders || []);
    } catch (error) {
      console.error(error);
      alert("Orders fetch failed");
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await axios.put(
        `http://localhost:5000/api/orders/admin/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 better UX → locally update instead of refetch
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error(error);
      alert("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= USE EFFECT ================= */
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-lg font-semibold">
        Loading orders...
      </p>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📦 Orders Management</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Update</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {order._id}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {order.user?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {order.user?.email || "N/A"}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ₹ {order.totalAmount}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold
                      ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : order.status === "Confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
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
                      className="border rounded px-2 py-1 text-sm disabled:opacity-60"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
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
