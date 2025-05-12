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
  <ScrollToTop />;
  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-4 mt-10">
      {/* Logo */}
      <img
        src="/Excel_logo.jpg" // ✅ Replace with your logo path
        alt="Excel Logo"
        className="w-auto h-auto mb-6"
      />

      {/* Welcome Text */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Welcome, <span className="text-green-500">{userName}</span>!
      </h1>
      <p className=" text-xl mb-10  text-white font-semibold text-justify border-green-700 rounded-2xl m-3 p-2.5 bg-green-700 shadow-md hover:shadow-xl transition hover:scale-105 cursor-pointer ">
        Excel Analytics Platform helps you visualize and understand your Excel
        data effortlessly. With our powerful tools, you can quickly turn raw
        data into meaningful insights, create stunning visualizations, and make
        data-driven decisions like never before.
      </p>

      {/* Two Visualization Containers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 w-full max-w-4xl">
        <div className="bg-white text-black rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:scale-105 cursor-pointer border-4 border-black border-solid ">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
            alt="Bar Chart"
            className="w-full h-40 object-contain mb-4"
          />

          <h2 className="text-xl font-semibold text-center">
            View Interactive Charts
          </h2>
          <p className="text-black text-lg leading-relaxed">
            Charts transform raw Excel data into powerful visual stories. They
            help you quickly understand patterns, trends, and outliers without
            combing through endless rows and columns. Interactive
            visualizations—like bar graphs, pie charts, and line charts—make it
            easy to filter, zoom, and focus on what matters most.
          </p>
        </div>

        <div className="bg-white text-black rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:scale-105 cursor-pointer border-4 border-black border-solid">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2023/2023929.png"
            alt="Line Graph"
            className="w-full h-40 object-contain mb-4"
          />

          <h2 className="text-xl font-semibold text-center">
            Generate Insights Instantly
          </h2>
          <p className="text-black text-lg leading-relaxed">
            Excel charts serve as a gateway to uncovering hidden patterns and
            trends within your data. By converting raw numbers into visual
            representations, charts enable you to identify correlations,
            anomalies, and outliers that might go unnoticed in tabular data. For
            instance, line charts can reveal sales trends over time, while
            scatter plots can highlight relationships between variables.
          </p>
        </div>
      </div>

      {/* Get Started Button */}
      <button
        onClick={handleGetStarted}
        className="bg-green-600 hover:bg-green-700  text-white px-6 py-3 rounded-full text-xl font-medium transition shadow-lg hover:scale-105  mb-2 "
      >
        Get Started
      </button>
    </div>
  );
};

export default Welcome;
