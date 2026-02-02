import React from "react";
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

const notifications = [
  {
    id: 1,
    type: "success",
    title: "Order Confirmed",
    message: "Order #1023 has been successfully confirmed.",
    time: "2 minutes ago",
    icon: <FaCheckCircle />,
  },
  {
    id: 2,
    type: "warning",
    title: "Low Stock Alert",
    message: "Product 'iPhone 14' stock is below 5 units.",
    time: "1 hour ago",
    icon: <FaExclamationTriangle />,
  },
  {
    id: 3,
    type: "info",
    title: "New User Registered",
    message: "A new user has just signed up.",
    time: "3 hours ago",
    icon: <FaInfoCircle />,
  },
  {
    id: 4,
    type: "success",
    title: "Payment Received",
    message: "Payment received for order #1019.",
    time: "Yesterday",
    icon: <FaCheckCircle />,
  },
];

const badgeColors = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  info: "bg-blue-100 text-blue-700",
};

const iconColors = {
  success: "text-green-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
};

const Notifications = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaBell className="text-blue-600" />
          Notifications
        </h1>
        <button className="text-sm text-blue-600 hover:underline">
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow divide-y">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="flex items-start gap-4 p-5 hover:bg-gray-50 transition"
          >
            {/* Icon */}
            <div
              className={`text-xl mt-1 ${iconColors[n.type]}`}
            >
              {n.icon}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800">{n.title}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${badgeColors[n.type]}`}
                >
                  {n.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {n.message}
              </p>
            </div>

            {/* Time */}
            <div className="text-xs text-gray-400 whitespace-nowrap">
              {n.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
