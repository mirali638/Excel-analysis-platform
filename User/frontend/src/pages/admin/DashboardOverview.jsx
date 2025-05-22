import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admindashboard/dashboard",
          { withCredentials: true }
        );
        setData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("❌ Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!data)
    return <p className="text-center text-gray-600">No data available.</p>;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        📊 Dashboard Overview
      </h2>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <Card title="Total Users" value={data.totalUsers ?? 0} />
        <Card title="Active Users" value={data.activeUsers ?? 0} />
        <Card title="Files Processed" value={data.filesProcessed ?? 0} />
        <Card title="Storage Used" value={data.storageUsed ?? "0 MB"} />
        <Card title="Total Charts" value={data.totalCharts ?? 0} />
      </div>

      {/* Chart & Activity Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart Summary */}
        <div className="bg-white text-black rounded-2xl shadow-lg p-6 w-full max-w-full overflow-hidden">
          <h3 className="text-xl sm:text-3xl font-extrabold mb-6 flex items-center gap-3">
            <span role="img" aria-label="chart">
              📊
            </span>
            <span className="tracking-wide">Chart Summary</span>
          </h3>

          <div className="text-base sm:text-xl font-semibold mb-6">
            Total Charts:{" "}
            <span className="text-blue-600 font-extrabold">
              {data.totalCharts}
            </span>
          </div>

          {Array.isArray(data.chartTypesCount) &&
          data.chartTypesCount.length > 0 ? (
            <ul className="space-y-3 max-h-72 sm:max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200">
              {data.chartTypesCount.map((chart) => (
                <li
                  key={chart._id}
                  className="flex justify-between items-center bg-gray-100 rounded-xl px-5 py-3 text-sm sm:text-base transition-shadow hover:shadow-md cursor-default select-none"
                >
                  <span className="capitalize font-semibold text-gray-900">
                    {chart._id}
                  </span>
                  <span className="text-gray-600">
                    {chart.count} chart{chart.count > 1 ? "s" : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic select-none">
              No chart types data available.
            </p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white text-black rounded-xl shadow-md p-6 w-full overflow-hidden">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            🕓 <span>Recent Activity</span>
          </h3>
          {data.recentActivity?.length ? (
            <ul className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {data.recentActivity.map((activity, index) => (
                <li
                  key={index}
                  className="border border-gray-300 rounded-lg px-4 py-3"
                >
                  <div className="font-medium break-words">
                    {activity.description ?? "No description"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 truncate">
                    {activity.time ?? "Unknown time"}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">
              No recent activity found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white shadow-sm border rounded-lg p-4 flex flex-col items-start justify-between text-black hover:shadow-md transition duration-200">
    <h4 className="text-sm font-medium text-gray-600">{title}</h4>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

export default DashboardOverview;
