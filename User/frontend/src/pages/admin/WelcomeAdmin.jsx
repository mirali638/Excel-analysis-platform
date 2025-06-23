import React from "react";
import { Link } from "react-router-dom";

const cardClass = `
  bg-white rounded-2xl shadow-md
  hover:shadow-lg transition duration-300
  p-6
  transform hover:scale-[1.03] active:scale-[0.98]
  focus:outline-none focus:ring-4 focus:ring-green-300
  cursor-pointer
  flex flex-col
  justify-between
`;

const WelcomeAdmin = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-100 to-white py-8 px-4 sm:px-6 lg:px-12 xl:px-24">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12 text-center">
        <h1 className="text-3xl sm:text-3xl md:text-5xl font-extrabold text-green-700 mb-4 tracking-tight leading-tight">
          Welcome, Admin!
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
          Manage your platform efficiently using the tools below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        <Link to="/admindashboard/dashboard" className={cardClass}>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 break-words">
            Dashboard Overview
          </h3>
          <p className="text-sm sm:text-base text-gray-600 flex-grow">
            View platform statistics and key metrics.
          </p>
        </Link>

        <Link to="/admindashboard/users" className={cardClass}>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 break-words">
            User Management
          </h3>
          <p className="text-sm sm:text-base text-gray-600 flex-grow">
            Manage user accounts and permissions.
          </p>
        </Link>

        <Link to="/admindashboard/files" className={cardClass}>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 break-words ">
            Excel File Management
          </h3>
          <p className="text-sm sm:text-base text-gray-600 flex-grow">
            Handle file uploads and processing.
          </p>
        </Link>

        <Link to="/admindashboard/charts" className={cardClass}>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 break-words">
            Chart Analytics
          </h3>
          <p className="text-sm sm:text-base text-gray-600 flex-grow">
            View detailed analytics and reports.
          </p>
        </Link>

        <Link to="/admindashboard/logs" className={cardClass}>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            Activity Logs
          </h3>
          <p className="text-sm sm:text-base text-gray-600 flex-grow">
            Track system activities and audit trail.
          </p>
        </Link>

        {/* Uncomment when ready
        <Link to="/admindashboard/settings" className={cardClass}>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            Settings & Configuration
          </h3>
          <p className="text-sm sm:text-base text-gray-600 flex-grow">
            Configure platform settings and preferences.
          </p>
        </Link>
        */}
      </div>
    </div>
  </div>
);

export default WelcomeAdmin;