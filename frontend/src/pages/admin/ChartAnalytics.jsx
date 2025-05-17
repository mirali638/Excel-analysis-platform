import React, { useState } from "react";

const mockCharts = [
  {
    id: 1,
    title: "Sales by Region",
    user: "Alice Smith",
    type: "Bar",
    date: "2024-06-01",
  },
  {
    id: 2,
    title: "Market Share",
    user: "Bob Johnson",
    type: "Pie",
    date: "2024-06-02",
  },
  {
    id: 3,
    title: "Revenue Growth",
    user: "Charlie Brown",
    type: "Line",
    date: "2024-06-03",
  },
  {
    id: 4,
    title: "Customer Segments",
    user: "Alice Smith",
    type: "Scatter",
    date: "2024-06-04",
  },
];

const users = ["All", "Alice Smith", "Bob Johnson", "Charlie Brown"];
const chartTypes = ["All", "Bar", "Pie", "Line", "Scatter"];

const ChartAnalytics = () => {
  const [selectedUser, setSelectedUser] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  const filteredCharts = mockCharts.filter((chart) => {
    return (
      (selectedUser === "All" || chart.user === selectedUser) &&
      (selectedType === "All" || chart.type === selectedType) &&
      (!selectedDate || chart.date === selectedDate)
    );
  });

  // Modified export functions to show alert instead of downloading
  const exportAsImage = async (chart) => {
    alert(`Mock Data Export: Exporting chart "${chart.title}" by ${chart.user} as Image.`);
  };

  const exportAsPDF = async (chart) => {
    alert(`Mock Data Export: Exporting chart "${chart.title}" by ${chart.user} as PDF.`);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Chart Analytics</h2>
      {/* Filter Controls - Updated Styling */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-gray-700">User</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700">Chart Type</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {chartTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700">Date</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
      {/* Charts Table - Updated Styling */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 text-left">Title</th>
              <th className="border px-4 py-2 text-left">User</th>
              <th className="border px-4 py-2 text-left">Type</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Export</th>
            </tr>
          </thead>
          <tbody>
            {filteredCharts.map((chart) => (
              <tr key={chart.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{chart.title}</td>
                <td className="border px-4 py-2">{chart.user}</td>
                <td className="border px-4 py-2">{chart.type}</td>
                <td className="border px-4 py-2">{chart.date}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => exportAsPDF(chart)}
                  >
                    PDF
                  </button>
                  <button
                    className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => exportAsImage(chart)}
                  >
                    Image
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChartAnalytics; 