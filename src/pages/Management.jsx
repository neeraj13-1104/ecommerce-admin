import React, { useEffect, useState } from "react";
import axios from "axios";

const Management = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "productadmin",
  });

  const token = localStorage.getItem("adminToken");

  const fetchAdmins = async () => {
    const res = await axios.get("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAdmins(res.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/admin/create-product-admin",
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setForm({ name: "", email: "", password: "", role: "productadmin" });
    fetchAdmins();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Management</h2>

      {/* CREATE ADMIN */}
      <form onSubmit={submit} className="grid grid-cols-4 gap-4 mb-6">
        <input className="border p-2" placeholder="Name"
          value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})} />

        <input className="border p-2" placeholder="Email"
          value={form.email}
          onChange={(e)=>setForm({...form,email:e.target.value})} />

        <input className="border p-2" placeholder="Password"
          value={form.password}
          onChange={(e)=>setForm({...form,password:e.target.value})} />

        <select className="border p-2"
          value={form.role}
          onChange={(e)=>setForm({...form,role:e.target.value})}>
          <option value="productadmin">Product Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>

        <button className="col-span-4 bg-blue-600 text-white p-2 rounded">
          Create Admin
        </button>
      </form>

      {/* ADMIN TABLE */}
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a._id} className="text-center border-t">
              <td className="p-2">{a.name}</td>
              <td>{a.email}</td>
              <td>{a.role}</td>
              <td className="text-green-600">Active</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Management;
