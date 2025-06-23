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
      <h2 className="text-3xl font-bold text-green-700 text-center mb-10">
        📈 Chart Analytics
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

      {/* Chart Cards - Responsive Grid with Hover Effects */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCharts.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No charts found.
          </p>
        ) : (
          filteredCharts.map((chart) => (
            <div
              key={chart._id}
              className="rounded-2xl border border-gray-200 shadow-lg p-5 flex flex-col gap-4 max-w-full sm:max-w-[400px] break-words
          transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-green-400"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-blue-700 mb-3">
                  {chart.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-gray-700 text-sm">
                  <p>
                    <span className="font-semibold text-gray-900">User:</span>{" "}
                    {chart.username}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Type:</span>{" "}
                    {chart.chartType}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Date:</span>{" "}
                    {chart.date}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-auto">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition"
                  onClick={() => exportAsPDF(chart._id, chart.title)}
                >
                  Export PDF
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition"
                  onClick={() => exportAsImage(chart._id, chart.title)}
                >
                  Export Image
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Hidden Export Elements */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        {filteredCharts.map((chart) => (
          <div
            id={`chart-export-${chart._id}`}
            key={`export-${chart._id}`}
            style={{
              width: "600px", // Ensure a consistent width for capture
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
            {/* Use the saved image directly for export */}
            {chart.image ? (
              <img
                src={chart.image}
                alt={chart.title}
                style={{ width: "100%", height: "auto" }}
              />
            ) : (
              <p>Image not available for this chart.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartAnalytics;