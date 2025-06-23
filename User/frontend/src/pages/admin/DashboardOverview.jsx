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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-10">
          📊 Dashboard Overview
        </h2>

        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
          <Card title="Total Users" value={data.totalUsers ?? 0} />
          <Card title="Active Users" value={data.activeUsers ?? 0} />
          <Card title="Files Processed" value={data.filesProcessed ?? 0} />
          <Card title="Storage Used" value={data.storageUsed ?? "0 MB"} />
          <Card title="Total Charts" value={data.totalCharts ?? 0} />
        </div>

        {/* Main Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chart Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📈 Chart Summary
            </h3>
            <div className="text-lg font-semibold mb-4">
              Total Charts:{" "}
              <span className="text-green-600 font-bold">
                {data.totalCharts}
              </span>
            </div>

            {Array.isArray(data.chartTypesCount) &&
            data.chartTypesCount.length > 0 ? (
              <ul className="space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-100">
                {data.chartTypesCount.map((chart) => (
                  <li
                    key={chart._id}
                    className="flex justify-between items-center bg-gray-50 border rounded-xl px-4 py-2 hover:bg-green-50"
                  >
                    <span className="capitalize font-medium text-gray-700">
                      {chart._id}
                    </span>
                    <span className="text-sm text-gray-500">
                      {chart.count} chart{chart.count > 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No chart types data available.
              </p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🕓 Recent Activity
            </h3>
            {data.recentActivity?.length ? (
              <ul className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-100">
                {data.recentActivity.map((activity, index) => (
                  <li
                    key={index}
                    className="bg-gray-50 border rounded-lg px-4 py-3"
                  >
                    <div className="font-medium text-gray-700">
                      {activity.description ?? "No description"}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
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
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 text-center">
    <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

export default DashboardOverview;
