import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Welcome", path: "/userdashboard/welcome" },
  { name: "Upload File", path: "/userdashboard/upload" },
  { name: "Upload History", path: "/userdashboard/history" },
  { name: "Profile", path: "/userdashboard/profile" },
  { name: "About", path: "/userdashboard/about" },
  { name: "Contact Us", path: "/userdashboard/contact" },
  { name: "Logout", path: "/userdashboard/logout", isLogout: true },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white shadow-lg backdrop-blur-sm bg-opacity-90"
          : "bg-transparent"
      }`}
      style={{ height: "72px" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-6 md:px-12">
        {/* Logo and Title */}
        <Link
          to="/userdashboard/welcome"
          className="flex items-center space-x-3 group"
          aria-label="Excel Analytics Home"
        >
          <img
            src="/Excel_logo.jpg"
            alt="Excel Logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-xl md:text-2xl font-bold text-green-700 group-hover:text-green-900 transition">
            Excel Analysis Platform
          </h1>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-8 font-medium text-gray-700">
          {navItems.map(({ name, path, isLogout }) => {
            const isActive = location.pathname === path;
            return (
              <li key={name}>
                <Link
                  to={path}
                  className={`relative px-1 py-2 hover:text-green-700 transition-all ${
                    isLogout
                      ? "text-red-600 hover:text-red-800"
                      : isActive
                      ? "text-green-700 font-semibold"
                      : ""
                  }`}
                >
                  {name}
                  {!isLogout && (
                    <span
                      className={`absolute left-0 -bottom-0.5 h-0.5 w-full bg-green-700 transform scale-x-0 transition-transform origin-left ${
                        isActive ? "scale-x-100" : "group-hover:scale-x-100"
                      }`}
                    ></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden relative w-8 h-8 flex flex-col justify-between items-center group"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-1 w-full rounded bg-green-700 transition-transform origin-left ${
              isOpen ? "rotate-45 translate-y-3" : ""
            }`}
          />
          <span
            className={`block h-1 w-full rounded bg-green-700 transition-opacity ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-1 w-full rounded bg-green-700 transition-transform origin-left ${
              isOpen ? "-rotate-45 -translate-y-3" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full bg-white shadow-lg overflow-hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
        style={{ zIndex: 40 }}
      >
        <ul className="flex flex-col space-y-4 p-6 font-medium text-gray-700">
          {navItems.map(({ name, path, isLogout }) => (
            <li key={name}>
              <Link
                to={path}
                className={`block w-full ${
                  isLogout ? "text-red-600" : "hover:text-green-700"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
