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
  }, [location]);

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
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
                Excel Analysis Platform
              </h1>
            </div>
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white shadow-md">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Admin Panel
            </h2>
            <nav className="space-y-1">
              <Link
                to="/admindashboard"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive("/admindashboard")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mr-3">🏠</span>
                Welcome
              </Link>
              <Link
                to="/admindashboard/dashboard"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive("/admindashboard/dashboard")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mr-3">📊</span>
                Dashboard Overview
              </Link>
              <Link
                to="/admindashboard/users"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive("/admindashboard/users")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mr-3">👥</span>
                User Management
              </Link>
              <Link
                to="/admindashboard/files"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive("/admindashboard/files")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mr-3">📁</span>
                Excel File Management
              </Link>
              <Link
                to="/admindashboard/charts"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive("/admindashboard/charts")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mr-3">📈</span>
                Chart Analytics
              </Link>
              {/* <Link
                to="/admindashboard/ai-summary"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive("/admindashboard/ai-summary")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mr-3">🤖</span>
                AI Summary Monitor
              </Link> */}
              <Link
                to="/admindashboard/logs"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive("/admindashboard/logs")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mr-3">📝</span>
                Activity Logs
              </Link>
              <Link
                to="/admindashboard/settings"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive("/admindashboard/settings")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="mr-3">⚙️</span>
                Settings & Config
              </Link>
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

export default AdminDashboard;
