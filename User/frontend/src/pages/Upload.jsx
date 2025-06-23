import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Bar, Line, Pie, Doughnut, Radar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
} from "chart.js";
import jsPDF from "jspdf";
import { Toaster, toast } from "react-hot-toast";
import Plot from "react-plotly.js";
// Import chart utility functions
import {
  generateChartData,
  render2DChart,
  getChartTypes,
  cleanupChartJSCharts,
} from "../utils/chartUtils";
import {
  generate3DChartData,
  render3DChart,
  get3DChartTypes,
  cleanupPlotlyCharts,
} from "./chart3Dplotly";

// Register ChartJS components
ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-center">
          Something went wrong. Please try again.
        </div>
      );
    }
    return this.props.children;
  }
}

// Main Upload Component
const Upload = () => {
  const [excelData, setExcelData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [zAxis, setZAxis] = useState("");
  const [chartData, setChartData] = useState(null);
  const [chartType2D, setChartType2D] = useState("bar");
  const [chartType3D, setChartType3D] = useState("scatter3d");
  const [dimension, setDimension] = useState("2D");
  const [selectedFile, setSelectedFile] = useState(null);
  const [plotlyData, setPlotlyData] = useState(null);
  const [chartKey, setChartKey] = useState(0);
  const chartRef = useRef(null);

  // Cleanup function to destroy existing charts
  const cleanupCharts = () => {
    if (chartRef.current && chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }
    cleanupChartJSCharts();
    cleanupPlotlyCharts();
  };

  useEffect(() => {
    setChartData(null);
    setPlotlyData(null);
    setChartKey((prev) => prev + 1);
    cleanupCharts();
  }, [chartType2D, chartType3D, xAxis, yAxis, zAxis]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupCharts();
    };
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (!jsonData.length) {
          toast.error("Excel sheet is empty or unreadable");
          return;
        }

        setExcelData(jsonData);
        setColumns(Object.keys(jsonData[0]));
        setXAxis("");
        setYAxis("");
        setZAxis("");
        toast.success("File loaded successfully");
      } catch (error) {
        console.error("Error reading file:", error);
        toast.error("Error reading file");
      }
    };
    reader.readAsArrayBuffer(file);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const formData = new FormData();
      formData.append("file", file);

      await axios.post("http://localhost:5000/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Excel file uploaded successfully");
    } catch (err) {
      console.error("Excel file upload failed:", err);
      toast.error("Failed to upload Excel file");
    }
  };

  const generate2DChart = async () => {
    if (!xAxis || !yAxis || !selectedFile) {
      toast.error("Please upload file and select appropriate axes");
      return;
    }

    try {
      cleanupCharts();
      setDimension("2D");
      const newChartData = generateChartData(
        excelData,
        xAxis,
        yAxis,
        chartType2D
      );
      setChartData(newChartData);

      setTimeout(async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No auth token found");

          const decoded = jwt_decode(token);
          const username = decoded.name;
          const createdBy = decoded.id;
          const chartTitle = `${chartType2D} - ${xAxis} vs ${yAxis}`;

          if (chartRef.current && chartRef.current.canvas) {
            const imageData = chartRef.current.canvas.toDataURL("image/png");
            await axios.post(
              "http://localhost:5000/api/charts/upload",
              {
                title: chartTitle,
                username,
                chartType: chartType2D,
                typeOfChart: chartType2D,
                typeOfDimension: "2D",
                createdBy,
                xAxis,
                yAxis,
                image: imageData,
              },
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            toast.success("2D Chart saved successfully");
          }
        } catch (err) {
          console.error("Failed to store 2D chart:", err);
          toast.error("Failed to save 2D chart");
        }
      }, 1000);
    } catch (error) {
      console.error("Error generating 2D chart:", error);
      toast.error("Error generating 2D chart");
    }
  };

  const generate3DChart = async () => {
    if (!xAxis || !yAxis || !zAxis || !selectedFile) {
      toast.error("Please upload file and select appropriate axes");
      return;
    }

    try {
      setDimension("3D");
      const newPlotlyData = generate3DChartData(
        excelData,
        xAxis,
        yAxis,
        zAxis,
        chartType3D
      );
      setPlotlyData(newPlotlyData);

      setTimeout(async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No auth token found");

          const decoded = jwt_decode(token);
          const username = decoded.name;
          const createdBy = decoded.id;
          const chartTitle = `${chartType3D} - ${xAxis} vs ${yAxis} vs ${zAxis}`;

          const plotDiv = document.querySelector(".js-plotly-plot");
          if (!plotDiv) {
            throw new Error("Chart element not found");
          }

          const imageData = await window.Plotly.toImage(plotDiv, {
            format: "png",
            width: 1200,
            height: 800,
          });

          await axios.post(
            "http://localhost:5000/api/charts/upload",
            {
              title: chartTitle,
              username,
              chartType: chartType3D,
              typeOfChart: chartType3D,
              typeOfDimension: "3D",
              createdBy,
              xAxis,
              yAxis,
              zAxis,
              image: imageData,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          toast.success("3D Chart saved successfully");
        } catch (err) {
          console.error("Failed to store 3D chart:", err);
          toast.error("Failed to save 3D chart");
        }
      }, 1000);
    } catch (error) {
      console.error("Error generating 3D chart:", error);
      toast.error("Error generating 3D chart");
    }
  };

  const download2DChart = (format) => {
    if (!chartRef.current || !chartRef.current.canvas) {
      toast.error("No 2D chart to download");
      return;
    }

    try {
      const imageData = chartRef.current.canvas.toDataURL("image/png");
      if (format === "png") {
        const link = document.createElement("a");
        link.href = imageData;
        link.download = "2d_chart.png";
        link.click();
      } else if (format === "pdf") {
        const pdf = new jsPDF();
        pdf.addImage(imageData, "PNG", 10, 10, 190, 100);
        pdf.save("2d_chart.pdf");
      }
    } catch (error) {
      console.error("Error downloading 2D chart:", error);
      toast.error("Error downloading chart");
    }
  };

  const download3DChart = async (format) => {
    if (!plotlyData) {
      toast.error("No 3D chart to download");
      return;
    }

    try {
      const plotDiv = document.querySelector(".js-plotly-plot");
      if (!plotDiv) {
        throw new Error("Chart element not found");
      }

      const imageData = await window.Plotly.toImage(plotDiv, {
        format: "png",
        width: 1200,
        height: 800,
      });

      if (format === "png") {
        const link = document.createElement("a");
        link.href = imageData;
        link.download = "3d_chart.png";
        link.click();
      } else if (format === "pdf") {
        const pdf = new jsPDF();
        pdf.addImage(imageData, "PNG", 10, 10, 190, 100);
        pdf.save("3d_chart.pdf");
      }
    } catch (err) {
      console.error("Failed to download 3D chart:", err);
      toast.error("Failed to download 3D chart");
    }
  };

  return (
    <ErrorBoundary>
      <div className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-lg shadow-lg">
        <Toaster position="top-right" />
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-8">
          Excel Chart Visualizer <span className="text-sm">(2D / 3D)</span>
        </h2>

        {/* File Upload Section */}
        <div
          className={`mb-6 transition-all border-4 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center ${
            selectedFile ? "border-green-500 bg-green-50" : "border-gray-300"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("border-green-500", "bg-green-50");
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("border-green-500", "bg-green-50");
          }}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload({ target: { files: [file] } });
            e.currentTarget.classList.remove("border-green-500", "bg-green-50");
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/724/724933.png"
            alt="upload"
            className="w-16 h-16 mb-4 opacity-60"
          />
          <p className="font-semibold text-lg text-center">
            Drag & drop your Excel file here
          </p>
          <p className="text-sm text-gray-500 mb-2 text-center">or</p>
          <label className="inline-block cursor-pointer bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">
            Choose File
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {selectedFile && (
            <p className="mt-4 text-green-700 font-medium">
              Uploaded: {selectedFile.name}
            </p>
          )}
        </div>

        {columns.length > 0 && (
          <>
            {/* Axis Selection Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  📌 X-Axis
                </label>
                <select
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select X-axis</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  📍 Y-Axis
                </label>
                <select
                  value={yAxis}
                  onChange={(e) => setYAxis(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select Y-axis</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  📊 Z-Axis (for 3D)
                </label>
                <select
                  value={zAxis}
                  onChange={(e) => setZAxis(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select Z-axis</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 mt-6">
              {/* 2D Chart Box */}
              <div className="border p-4 rounded shadow-md bg-gray-50">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  2D Chart Preview
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    📈 Chart Type
                  </label>
                  <select
                    value={chartType2D}
                    onChange={(e) => setChartType2D(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  >
                    {getChartTypes("2D").map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={generate2DChart}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mb-4"
                >
                  Generate 2D Chart
                </button>

                <div className="w-full h-96 flex items-center justify-center">
                  {dimension === "2D" && chartData ? (
                    <div
                      key={`2d-chart-${chartKey}`}
                      style={{ width: "100%", height: "100%" }}
                    >
                      {render2DChart(
                        chartData,
                        chartType2D,
                        xAxis,
                        yAxis,
                        chartRef
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">
                      Select axes above and click 'Generate 2D Chart'
                    </p>
                  )}
                </div>

                {dimension === "2D" && chartData && (
                  <div className="mt-4 flex gap-4 justify-center">
                    <button
                      onClick={() => download2DChart("png")}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      Download PNG
                    </button>
                    <button
                      onClick={() => download2DChart("pdf")}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                    >
                      Download PDF
                    </button>
                  </div>
                )}
              </div>

              {/* 3D Chart Box */}
              <div className="border p-4 rounded shadow-md bg-gray-50">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  3D Chart Preview
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    📈 Chart Type
                  </label>
                  <select
                    value={chartType3D}
                    onChange={(e) => setChartType3D(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  >
                    {get3DChartTypes().map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={generate3DChart}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mb-4"
                >
                  Generate 3D Chart
                </button>

                <div className="h-96 w-full">
                  {dimension === "3D" && plotlyData ? (
                    <div
                      key={`3d-chart-${chartKey}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        minHeight: "400px",
                      }}
                    >
                      {render3DChart(plotlyData)}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">
                      Select X, Y, and Z axes above and click 'Generate 3D
                      Chart'
                    </p>
                  )}
                </div>

                {dimension === "3D" && plotlyData && (
                  <div className="mt-4 flex gap-4 justify-center">
                    <button
                      onClick={() => download3DChart("png")}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      Download PNG
                    </button>
                    <button
                      onClick={() => download3DChart("pdf")}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                    >
                      Download PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Upload;
