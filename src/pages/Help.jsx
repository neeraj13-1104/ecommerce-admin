import React from "react";
import {
  FaQuestionCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaBook,
  FaLifeRing,
  FaChevronDown,
} from "react-icons/fa";

const faqs = [
  {
    q: "How do I manage products?",
    a: "Go to Items section from sidebar. You can add, edit or delete products from there.",
  },
  {
    q: "How can I view orders?",
    a: "Navigate to Orders page to view all recent and past orders with details.",
  },
  {
    q: "How do I change admin settings?",
    a: "Open Settings page to update profile, password and system preferences.",
  },
  {
    q: "Why am I not able to login?",
    a: "Make sure your admin role is enabled and credentials are correct.",
  },
];

const Help = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FaLifeRing className="text-blue-600 text-3xl" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Help & Support</h1>
          <p className="text-gray-500">
            Find answers or contact support if you need help
          </p>
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <FaBook className="text-3xl text-purple-600 mb-4" />
          <h3 className="font-semibold text-lg">Documentation</h3>
          <p className="text-gray-500 text-sm mt-2">
            Learn how admin panel features work step by step.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <FaQuestionCircle className="text-3xl text-green-600 mb-4" />
          <h3 className="font-semibold text-lg">FAQs</h3>
          <p className="text-gray-500 text-sm mt-2">
            Quick answers to common admin related questions.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <FaLifeRing className="text-3xl text-blue-600 mb-4" />
          <h3 className="font-semibold text-lg">Support Center</h3>
          <p className="text-gray-500 text-sm mt-2">
            Contact our support team for further help.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <details
              key={index}
              className="group border rounded-lg p-4 cursor-pointer"
            >
              <summary className="flex items-center justify-between font-medium text-gray-800">
                {item.q}
                <FaChevronDown className="group-open:rotate-180 transition" />
              </summary>
              <p className="text-gray-600 mt-3 text-sm">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <FaEnvelope className="text-3xl text-blue-600" />
          <div>
            <h3 className="font-semibold text-lg">Email Support</h3>
            <p className="text-gray-500 text-sm">support@adminpanel.com</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
          <FaPhoneAlt className="text-3xl text-green-600" />
          <div>
            <h3 className="font-semibold text-lg">Phone Support</h3>
            <p className="text-gray-500 text-sm">+91 98765 43210</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
