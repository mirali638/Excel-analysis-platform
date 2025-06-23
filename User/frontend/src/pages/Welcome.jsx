import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import ScrollToTop from "../components/ScrollToTop";

const Welcome = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUserName(decoded.name || "User");
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleGetStarted = () => {
    navigate("/userdashboard/upload", { replace: true });
  };

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-tr from-gray-100 via-white to-gray-100 animate-fadeIn">
        <div className="max-w-5xl w-full p-12 md:p-16 space-y-12 bg-white rounded-3xl shadow-lg">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/Excel_logo.jpg"
              alt="Excel Logo"
              className="h-28 w-auto drop-shadow-md"
            />
          </div>

          {/* Welcome Message */}
          <h1 className="text-5xl font-extrabold text-center text-gray-900 tracking-tight select-none">
            Welcome,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-900">
              {userName}
            </span>
            !
          </h1>

          {/* Description */}
          <p className="text-center text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Excel Analytics Platform helps you visualize and understand your Excel data effortlessly.
            With our powerful tools, you can quickly turn raw data into meaningful insights,
            create stunning visualizations, and make data-driven decisions like never before.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* Card 1 */}
            <div
              className="bg-gray-50 rounded-3xl p-8 shadow-md hover:shadow-xl transform transition duration-300 hover:scale-[1.05] cursor-pointer"
              aria-label="View Interactive Charts Feature"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                alt="Bar Chart"
                className="w-full h-48 object-contain mb-6 select-none transition-transform duration-500 hover:scale-110"
                draggable={false}
              />
              <h2 className="text-3xl font-semibold text-center text-gray-900 mb-4 select-none">
                View Interactive Charts
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                Charts transform raw Excel data into powerful visual stories.
                They help you quickly understand patterns, trends, and outliers without combing through endless rows and columns.
                Interactive visualizations—like bar graphs, pie charts, and line charts—make it easy to filter, zoom, and focus on what matters most.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="bg-gray-50 rounded-3xl p-8 shadow-md hover:shadow-xl transform transition duration-300 hover:scale-[1.05] cursor-pointer"
              aria-label="Generate Insights Instantly Feature"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2023/2023929.png"
                alt="Line Graph"
                className="w-full h-48 object-contain mb-6 select-none transition-transform duration-500 hover:scale-110"
                draggable={false}
              />
              <h2 className="text-3xl font-semibold text-center text-gray-900 mb-4 select-none">
                Generate Insights Instantly
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed font-medium">
                Excel charts serve as a gateway to uncovering hidden patterns and trends within your data.
                By converting raw numbers into visual representations, charts enable you to identify correlations, anomalies, and outliers that might go unnoticed in tabular data.
                For instance, line charts can reveal sales trends over time, while scatter plots can highlight relationships between variables.
              </p>
            </div>
          </div>

          {/* Get Started Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGetStarted}
              className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900
                text-white px-10 py-4 rounded-full text-2xl font-bold shadow-lg transition-transform duration-300
                hover:scale-110 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-400"
              aria-label="Get Started"
            >
              <span className="relative z-10">Get Started</span>
              {/* Ripple effect */}
              <span className="absolute inset-0 bg-white opacity-10 rounded-full pointer-events-none"></span>
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease forwards;
          }
          button:focus-visible {
            outline: 2px solid transparent;
            outline-offset: 2px;
            box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.6);
          }
        `}
      </style>
    </>
  );
};

export default Welcome;
