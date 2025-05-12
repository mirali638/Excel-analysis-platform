// src/components/Footer.js
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="flex space-x-6">
          {/* Facebook Icon */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-600"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22.675 0h-21.35C.595 0 0 .595 0 1.325v21.351C0 23.405.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.405 24 24 23.405 24 22.676V1.325C24 .595 23.405 0 22.675 0z" />
            </svg>
          </a>

          {/* Twitter Icon */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-600"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22.46 6.003c-.77.35-1.59.58-2.46.68a4.187 4.187 0 0 0 1.85-2.31c-.77.45-1.62.77-2.52.95a4.156 4.156 0 0 0-7.08 3.78C8.69 8.6 5.06 6.87 2.92 4.04a4.145 4.145 0 0 0-.57 2.09c0 1.45.74 2.73 1.86 3.47a4.17 4.17 0 0 1-1.88-.52v.05c0 2.02 1.44 3.72 3.36 4.11-.35.1-.71.15-1.09.15-.27 0-.53-.03-.79-.08.54 1.67 2.12 2.88 3.98 2.92a8.388 8.388 0 0 1-5.19 1.79c-.34 0-.68-.02-1.02-.06a11.84 11.84 0 0 0 6.46 1.9c7.76 0 12.01-6.44 12.01-12 0-.18-.01-.36-.02-.54a8.482 8.482 0 0 0 2.33-2.16z" />
            </svg>
          </a>

          {/* LinkedIn Icon */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-600"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.327-.026-3.036-1.849-3.036-1.851 0-2.135 1.445-2.135 2.939v5.666H9.356V9h3.414v1.561h.049c.476-.9 1.637-1.849 3.368-1.849 3.6 0 4.268 2.368 4.268 5.451v6.289zM5.337 7.433c-1.144 0-2.07-.928-2.07-2.07 0-1.144.926-2.07 2.07-2.07s2.07.926 2.07 2.07c0 1.142-.926 2.07-2.07 2.07zM6.765 20.452H3.911V9h2.854v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.208 24 24 23.226 24 22.271V1.729C24 .774 23.208 0 22.225 0z" />
            </svg>
          </a>
        </div>

        <p className="text-center mt-4">
          &copy; 2025 Excel Analytics Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
