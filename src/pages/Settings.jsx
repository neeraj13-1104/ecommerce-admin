import React, { useState } from "react";
import {
  FaUser,
  FaLock,
  FaBell,
  FaPalette,
  FaSave,
} from "react-icons/fa";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "Super Admin",
    email: "admin@example.com",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500">Manage your account & preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaUser className="text-blue-600 text-xl" />
          <h2 className="text-xl font-semibold">Profile Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Full Name"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            placeholder="Email Address"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          <FaSave /> Save Profile
        </button>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaLock className="text-red-600 text-xl" />
          <h2 className="text-xl font-semibold">Security</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="password"
            name="current"
            placeholder="Current Password"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
            value={password.current}
            onChange={handlePasswordChange}
          />
          <input
            type="password"
            name="new"
            placeholder="New Password"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
            value={password.new}
            onChange={handlePasswordChange}
          />
          <input
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
            value={password.confirm}
            onChange={handlePasswordChange}
          />
        </div>

        <button className="mt-6 flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition">
          <FaSave /> Update Password
        </button>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaBell className="text-green-600 text-xl" />
          <h2 className="text-xl font-semibold">Preferences</h2>
        </div>

        <div className="flex items-center justify-between py-3 border-b">
          <span className="text-gray-700">Email Notifications</span>
          <input type="checkbox" className="w-5 h-5" defaultChecked />
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-gray-700">Push Notifications</span>
          <input type="checkbox" className="w-5 h-5" />
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaPalette className="text-purple-600 text-xl" />
          <h2 className="text-xl font-semibold">Appearance</h2>
        </div>

        <select className="border rounded-lg p-3 w-full md:w-1/3 focus:ring-2 focus:ring-purple-500 outline-none">
          <option>Light Mode</option>
          <option>Dark Mode</option>
          <option>System Default</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;
