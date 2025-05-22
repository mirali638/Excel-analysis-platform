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
      console.log("API response:", response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch activity logs");
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    return log.action.toLowerCase().includes(filter.toLowerCase());
  });

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Activity Logs</h2>

      {/* Filter Controls */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-auto"
        >
          <option value="all">All Activities</option>
          <option value="login">Login Activities</option>
          <option value="logout">Logout Activities</option>
          <option value="upload">File Uploads</option>
        </select>
      </div>

      {/* Responsive Logs Table */}
      <div className="overflow-x-auto rounded shadow-sm border">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 border">Action</th>
              <th className="px-4 py-3 border">User</th>
              <th className="px-4 py-3 border">Timestamp</th>
              <th className="px-4 py-3 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
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

                  {/* Corrected User column */}
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {log.username || "N/A"}
                  </td>

                  {/* Corrected Timestamp column */}
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {log.timestamp
                      ? new Date(log.timestamp).toLocaleString()
                      : "N/A"}
                  </td>

                  <td className="px-4 py-2 border break-words">
                    {log.details}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-4 border"
                >
                  No logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogs;
