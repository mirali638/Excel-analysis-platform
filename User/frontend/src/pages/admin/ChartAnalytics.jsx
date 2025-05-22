import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart Rendering Component
const ChartComponent = ({ chartData }) => {
  const data = {
    labels: chartData.labels || [],
    datasets: [
      {
        label: chartData.title,
        data: chartData.values || [],
        backgroundColor: "rgba(59, 130, 246, 0.6)", // Tailwind Blue
      },
    ],
  };

  return (
    <div className="w-full h-64">
      <Bar
        data={data}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  );
};

const ChartAnalytics = () => {
  const [charts, setCharts] = useState([]);
  const [filteredCharts, setFilteredCharts] = useState([]);
  const [selectedUser, setSelectedUser] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [users, setUsers] = useState([]);
  const [chartTypes, setChartTypes] = useState([]);

  // Convert DD/MM/YYYY to YYYY-MM-DD
  const convertToISODate = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admindashboard/excel/charts"
        );
        const data = res.data;
        setCharts(data);
        setFilteredCharts(data);
        setUsers(["All", ...new Set(data.map((c) => c.username))]);
        setChartTypes(["All", ...new Set(data.map((c) => c.chartType))]);
      } catch (err) {
        console.error("Error fetching charts:", err);
      }
    };
    fetchCharts();
  }, []);

  useEffect(() => {
    const filtered = charts.filter((chart) => {
      const chartDateISO = convertToISODate(chart.date);
      return (
        (selectedUser === "All" || chart.username === selectedUser) &&
        (selectedType === "All" || chart.chartType === selectedType) &&
        (!selectedDate || chartDateISO === selectedDate)
      );
    });
    setFilteredCharts(filtered);
  }, [charts, selectedUser, selectedType, selectedDate]);

  const exportAsImage = async (chartId, title) => {
    const node = document.getElementById(`chart-export-${chartId}`);
    if (!node) return;

    const canvas = await html2canvas(node, { scale: 2 });
    const image = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = image;
    a.download = `${title}.png`;
    a.click();
  };

  const exportAsPDF = async (chartId, title) => {
    const node = document.getElementById(`chart-export-${chartId}`);
    if (!node) return;

    const canvas = await html2canvas(node, { scale: 2 });
    const image = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(image, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${title}.pdf`);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Chart Analytics
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">User</label>
          <select
            className="border rounded px-2 py-1 text-sm"
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

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Chart Type</label>
          <select
            className="border rounded px-2 py-1 text-sm"
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

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Date</label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Chart Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border text-left">Title</th>
              <th className="px-4 py-2 border text-left">User</th>
              <th className="px-4 py-2 border text-left">Type</th>
              <th className="px-4 py-2 border text-left">Date</th>
              <th className="px-4 py-2 border text-center">Export</th>
            </tr>
          </thead>
          <tbody>
            {filteredCharts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No charts found.
                </td>
              </tr>
            ) : (
              filteredCharts.map((chart) => (
                <tr key={chart._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{chart.title}</td>
                  <td className="px-4 py-2 border">{chart.username}</td>
                  <td className="px-4 py-2 border">{chart.chartType}</td>
                  <td className="px-4 py-2 border">{chart.date}</td>
                  <td className="px-4 py-2 border text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                        onClick={() => exportAsPDF(chart._id, chart.title)}
                      >
                        PDF
                      </button>
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                        onClick={() => exportAsImage(chart._id, chart.title)}
                      >
                        Image
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Hidden Export Elements */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        {filteredCharts.map((chart) => (
          <div
            id={`chart-export-${chart._id}`}
            key={`export-${chart._id}`}
            style={{
              width: "600px",
              background: "#fff",
              padding: "20px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3 className="text-lg font-semibold mb-2">{chart.title}</h3>
            <p>
              <strong>User:</strong> {chart.username}
            </p>
            <p>
              <strong>Type:</strong> {chart.chartType}
            </p>
            <p>
              <strong>Date:</strong> {chart.date}
            </p>
            <ChartComponent chartData={chart} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartAnalytics;
