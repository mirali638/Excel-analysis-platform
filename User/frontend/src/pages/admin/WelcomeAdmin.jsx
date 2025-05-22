import React from "react";
import { Link } from "react-router-dom";

const WelcomeAdmin = () => (
  <div className="p-8 max-w-7xl mx-auto">
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome, Admin!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Manage your platform efficiently with our comprehensive admin tools.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Link
        to="/admindashboard/dashboard"
        className="transform hover:scale-105 transition-transform duration-200"
      >
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Dashboard Overview
          </h3>
          <p className="text-gray-600">
            View platform statistics and key metrics
          </p>
        </div>
      </Link>

      <Link
        to="/admindashboard/users"
        className="transform hover:scale-105 transition-transform duration-200"
      >
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            User Management
          </h3>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
      </Link>

      <Link
        to="/admindashboard/files"
        className="transform hover:scale-105 transition-transform duration-200"
      >
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Excel File Management
          </h3>
          <p className="text-gray-600">Handle file uploads and processing</p>
        </div>
      </Link>

      <Link
        to="/admindashboard/charts"
        className="transform hover:scale-105 transition-transform duration-200"
      >
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Chart Analytics
          </h3>
          <p className="text-gray-600">View detailed analytics and reports</p>
        </div>
      </Link>

      {/* <Link to="/admindashboard/ai-summary" className="transform hover:scale-105 transition-transform duration-200">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Summary Monitor</h3>
          <p className="text-gray-600">Monitor AI-generated summaries</p>
        </div>
      </Link> */}

      <Link
        to="/admindashboard/logs"
        className="transform hover:scale-105 transition-transform duration-200"
      >
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Activity Logs
          </h3>
          <p className="text-gray-600">
            Track system activities and audit trail
          </p>
        </div>
      </Link>

      <Link
        to="/admindashboard/settings"
        className="transform hover:scale-105 transition-transform duration-200"
      >
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Settings & Configuration
          </h3>
          <p className="text-gray-600">
            Configure platform settings and preferences
          </p>
        </div>
      </Link>
    </div>
  </div>
);

export default WelcomeAdmin;
