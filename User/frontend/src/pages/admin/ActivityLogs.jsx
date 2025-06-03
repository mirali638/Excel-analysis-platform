import React, { useState, useEffect } from "react";
import axios from "../../axios";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/admindashboard/activity/logs"
      );
      setLogs(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch activity logs");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    return log.action.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-10">
          📋 Activity Logs
        </h2>
      </div>

      {/* Filter */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <label className="text-gray-700 font-medium">Filter by Activity:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition w-full sm:w-64"
        >
          <option value="all">All Activities</option>
          <option value="login">Login Activities</option>
          <option value="logout">Logout Activities</option>
          <option value="upload">File Uploads</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow mb-4">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm sm:text-base text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.action.toLowerCase().includes("upload")
                            ? "bg-blue-100 text-blue-800"
                            : log.action.toLowerCase().includes("login")
                            ? "bg-green-100 text-green-800"
                            : log.action.toLowerCase().includes("logout")
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {log.username || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 break-words max-w-sm text-gray-800">
                      {log.details}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-500 py-6 select-none"
                  >
                    No activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
