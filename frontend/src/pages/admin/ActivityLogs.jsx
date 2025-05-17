import React, { useState, useEffect } from "react";
import axios from "../../axios";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/activity-logs');
      setLogs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch activity logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
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
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Activity Logs</h2>

      {/* Filter Controls */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Activities</option>
          <option value="login">Login Activities</option>
          <option value="upload">File Uploads</option>
          <option value="delete">File Deletions</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Action</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Timestamp</th>
              <th className="px-4 py-2 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-2 border">
                  <span className={`px-2 py-1 rounded ${
                    log.action.includes('Upload') ? 'bg-blue-100 text-blue-800' :
                    log.action.includes('Login') ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-2 border">{log.user}</td>
                <td className="px-4 py-2 border">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogs; 