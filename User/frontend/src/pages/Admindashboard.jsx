import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Left side: Hamburger & Logo */}
            <div className="flex items-center space-x-3">
              {/* Hamburger menu button - visible only on small screens */}
              <button
                className="sm:hidden mr-2 p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle sidebar"
              >
                {/* Hamburger icon */}
                <svg
                  className="w-6 h-6 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {sidebarOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

              <img
                src="/Excel_logo.jpg"
                alt="Excel Logo"
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-2xl font-bold text-green-700 hidden sm:block">
                Excel Analysis Platform
              </h1>
            </div>

            {/* Right side: User Info + Logout */}
            <div className="flex items-center space-x-4">
              {/* On medium+ screens: show user info + logout inline */}
              <div className="hidden md:flex items-center space-x-4 border-r pr-4">
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
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>

              {/* On small screens: show user avatar button only */}
              <div className="md:hidden relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="User menu"
                >
                  {userInfo.name.charAt(0).toUpperCase()}
                </button>

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 text-gray-700 border-b">
                      <div className="font-semibold">{userInfo.name}</div>
                      <div className="text-xs">{userInfo.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform
            transition-transform duration-300 ease-in-out
            sm:relative sm:translate-x-0
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full sm:translate-x-0"
            }
          `}
        >
          <div className="p-4 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Admin Panel
            </h2>
            <nav className="space-y-1 flex-1 overflow-auto">
              <NavItem
                path="/admindashboard"
                icon="🏠"
                label="Welcome"
                isActive={isActive}
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                path="/admindashboard/dashboard"
                icon="📊"
                label="Dashboard Overview"
                isActive={isActive}
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                path="/admindashboard/users"
                icon="👥"
                label="User Management"
                isActive={isActive}
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                path="/admindashboard/files"
                icon="📁"
                label="Excel File Management"
                isActive={isActive}
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                path="/admindashboard/charts"
                icon="📈"
                label="Chart Analytics"
                isActive={isActive}
                onClick={() => setSidebarOpen(false)}
              />
              <NavItem
                path="/admindashboard/logs"
                icon="📝"
                label="Activity Logs"
                isActive={isActive}
                onClick={() => setSidebarOpen(false)}
              />
              {/* <NavItem path="/admindashboard/settings" icon="⚙️" label="Settings & Config" isActive={isActive} onClick={() => setSidebarOpen(false)} /> */}
            </nav>
          </div>
        </aside>

        {/* Overlay (dark background) when sidebar is open on small screens */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30 sm:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// Reusable Sidebar Link Component
const NavItem = ({ path, icon, label, isActive, onClick }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md cursor-pointer ${
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