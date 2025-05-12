import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Change navbar style when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`${
        isScrolled ? "bg-green-800" : "bg-transparent"
      } shadow-md fixed w-full z-10 top-0 left-0 transition-colors duration-300`}
    >
      <div className=" bg-green-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-25">
          {/* Navbar Brand */}
          <div className="text-3xl font-bold text-white">
            Excel Analytics Platform
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-3">
            {[
              "welcome",
              "upload",
              "history",
              "profile",
              "about",
              "contact",
              "logout",
            ].map((item) => (
              <Link
                key={item}
                to={`/userdashboard/${item}`}
                className={`text-white  hover:text-blue-600 ${
                  item === "logout" ? "text-red-600 hover:text-red-800" : ""
                }`}
              >
                {item === "upload"
                  ? "Upload File"
                  : item === "history"
                  ? "Upload History"
                  : item === "contact"
                  ? "Contact Us"
                  : item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            ))}
          </div>

          {/* Mobile menu icon */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
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
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 pt-2 space-y-2 shadow">
          {[
            "welcome",
            "upload",
            "history",
            "profile",
            "about",
            "contact",
            "logout",
          ].map((item) => (
            <Link
              key={item}
              to={`/userdashboard/${item}`}
              onClick={() => setIsOpen(false)}
              className={`block text-gray-700 ${
                item === "logout" ? "text-red-600" : ""
              }`}
            >
              {item === "upload"
                ? "Upload File"
                : item === "history"
                ? "Upload History"
                : item === "contact"
                ? "Contact Us"
                : item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
