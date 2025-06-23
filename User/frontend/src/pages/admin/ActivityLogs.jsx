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
    <div className="p-8 max-w-7xl mx-auto bg-gradient-to-br from-green-50 via-white to-green-50 min-h-screen">
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-green-800 text-center drop-shadow-md">
          📋 Activity Logs
        </h2>
      </div>

      {/* Filter */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <label
          htmlFor="filter"
          className="text-lg font-semibold text-green-700 select-none"
        >
          Filter by Activity:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="
            w-full sm:w-72
            border-2 border-green-400
            rounded-xl
            px-5 py-3
            text-green-900
            text-lg
            font-medium
            shadow-md
            transition
            focus:outline-none focus:ring-4 focus:ring-green-300
            hover:border-green-600
            cursor-pointer
            bg-gradient-to-r from-green-100 via-green-50 to-green-100
            "
        >
          <option value="all">All Activities</option>
          <option value="login">Login Activities</option>
          <option value="logout">Logout Activities</option>
          <option value="upload">File Uploads</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center min-h-[240px]">
          <div className="animate-spin rounded-full h-14 w-14 border-8 border-green-600 border-t-transparent shadow-lg"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-200 border border-red-400 text-red-800 px-6 py-4 rounded-2xl shadow-lg mb-8 max-w-3xl mx-auto text-center font-semibold text-lg tracking-wide">
          {error}
        </div>
      )}

      {/* Logs Grid */}
      {!loading && !error && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="
                  bg-white
                  rounded-3xl
                  border
                  border-green-200
                  shadow-xl
                  p-6
                  flex flex-col justify-between
                  transform
                  transition-transform duration-300
                  hover:scale-[1.06] hover:shadow-2xl
                  "
              >
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full font-semibold tracking-wide text-sm shadow-inner
                      ${
                        log.action.toLowerCase().includes("upload")
                          ? "bg-blue-200 text-blue-900 shadow-blue-400"
                          : log.action.toLowerCase().includes("login")
                          ? "bg-green-200 text-green-900 shadow-green-400"
                          : log.action.toLowerCase().includes("logout")
                          ? "bg-yellow-200 text-yellow-900 shadow-yellow-400"
                          : "bg-gray-200 text-gray-900 shadow-gray-400"
                      }`}
                  >
                    {log.action}
                  </span>
                </div>
                <div className="text-base text-gray-800 font-semibold mb-1 truncate">
                  User:{" "}
                  <span className="font-normal">{log.username || "N/A"}</span>
                </div>
                <div className="text-sm text-gray-600 mb-3 font-mono">
                  Timestamp:{" "}
                  <span className="font-normal">
                    {log.timestamp
                      ? new Date(log.timestamp).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap break-words max-h-28 overflow-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-100">
                  <strong className="font-semibold">Details:</strong>{" "}
                  {log.details}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full py-20 text-xl font-semibold italic tracking-widest">
              No activity logs found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;