import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const { name, email } = JSON.parse(storedUserInfo);
      setUserInfo({ name, email });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <img
                src="/Excel_logo.jpg"
                alt="Excel Logo"
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-2xl font-bold text-green-700">
                Excel Analysis Platform
              </h1>
            </div>

            {/* User Info + Logout */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 border-r pr-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-700">
                    {userInfo.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {userInfo.email}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
              </div>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Body Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white shadow-md">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Admin Panel
            </h2>
            <nav className="space-y-1">
              <NavItem path="/admindashboard" icon="🏠" label="Welcome" isActive={isActive} />
              <NavItem path="/admindashboard/dashboard" icon="📊" label="Dashboard Overview" isActive={isActive} />
              <NavItem path="/admindashboard/users" icon="👥" label="User Management" isActive={isActive} />
              <NavItem path="/admindashboard/files" icon="📁" label="Excel File Management" isActive={isActive} />
              <NavItem path="/admindashboard/charts" icon="📈" label="Chart Analytics" isActive={isActive} />
              <NavItem path="/admindashboard/logs" icon="📝" label="Activity Logs" isActive={isActive} />
              <NavItem path="/admindashboard/settings" icon="⚙️" label="Settings & Config" isActive={isActive} />
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable Sidebar Link Component
const NavItem = ({ path, icon, label, isActive }) => (
  <Link
    to={path}
    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
      isActive(path)
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-50"
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </Link>
);

export default AdminDashboard;
