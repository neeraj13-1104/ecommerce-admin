import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Management from "./pages/Management";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import Auth from "./pages/Auth";
import Carousel from "./pages/Carousel";
import Offers from "./pages/Offer";
import Order from "./pages/Order";


const App = () => {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("adminUser"))
  );

  const ProtectedLayout = ({ children, role }) => {
    if (!token) return <Navigate to="/auth" />;
    if (role && user?.role !== role) return <Navigate to="/" />;

    return (
      <div className="flex">
        <Sidebar user={user} setToken={setToken} setUser={setUser} />
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          {children}
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={<Auth setToken={setToken} setUser={setUser} />}
        />

        <Route
          path="/"
          element={<ProtectedLayout><Dashboard /></ProtectedLayout>}
        />

        <Route
          path="/items"
          element={<ProtectedLayout><Items /></ProtectedLayout>}
        />
       <Route path="/offers" element={<ProtectedLayout role="superadmin">
<Offers />             </ProtectedLayout>
} />

        {/* 🔥 SUPER ADMIN ONLY */}
        <Route
          path="/management"
          element={
            <ProtectedLayout role="superadmin">
              <Management />
            </ProtectedLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedLayout role="superadmin">
              <Settings />
            </ProtectedLayout>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedLayout role="superadmin">
              <Notifications />
            </ProtectedLayout>
          }
        />

        <Route
  path="/help"
  element={
    <ProtectedLayout role="superadmin">
      <Help />
    </ProtectedLayout>
  }
/>

<Route
  path="/carousel"
  element={
    <ProtectedLayout role="superadmin">
      <Carousel />
    </ProtectedLayout>
  }
/>
<Route
  path="/order"
  element={
    <ProtectedLayout role="superadmin">
      <Order />
    </ProtectedLayout>
  }
/>

        <Route path="*" element={<Navigate to={token ? "/" : "/auth"} />} />
      </Routes>
    </Router>
  );
};

export default App;
