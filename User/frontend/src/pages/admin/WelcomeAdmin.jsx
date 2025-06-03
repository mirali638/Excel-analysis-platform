import React from "react";
import { Link } from "react-router-dom";

const cardClass =
  "bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-6 transform hover:scale-[1.02]";

const WelcomeAdmin = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-100 to-white py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-10 mb-10 text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Welcome, Admin!
        </h1>
        <p className="text-lg text-gray-600">
          Manage your platform efficiently using the tools below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admindashboard/dashboard" className={cardClass}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Dashboard Overview
          </h3>
          <p className="text-gray-600">
            View platform statistics and key metrics.
          </p>
        </Link>

        <Link to="/admindashboard/users" className={cardClass}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            User Management
          </h3>
          <p className="text-gray-600">
            Manage user accounts and permissions.
          </p>
        </Link>

        <Link to="/admindashboard/files" className={cardClass}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Excel File Management
          </h3>
          <p className="text-gray-600">
            Handle file uploads and processing.
          </p>
        </Link>

        <Link to="/admindashboard/charts" className={cardClass}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Chart Analytics
          </h3>
          <p className="text-gray-600">
            View detailed analytics and reports.
          </p>
        </Link>

        <Link to="/admindashboard/logs" className={cardClass}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Activity Logs
          </h3>
          <p className="text-gray-600">
            Track system activities and audit trail.
          </p>
        </Link>

        <Link to="/admindashboard/settings" className={cardClass}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Settings & Configuration
          </h3>
          <p className="text-gray-600">
            Configure platform settings and preferences.
          </p>
        </Link>
      </div>
    </div>
  </div>
);

export default WelcomeAdmin;
