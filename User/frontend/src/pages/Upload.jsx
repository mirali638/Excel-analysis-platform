import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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
import * as THREE from "three";
import jsPDF from "jspdf";

// Import chart utility functions
import { generateChartData, render2DChart, render3DChart, generateColors } from "../utils/chartUtils.jsx";

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

const Upload = () => {
  const [excelData, setExcelData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [dimension, setDimension] = useState("2D");
  const [selectedFile, setSelectedFile] = useState(null);

  const chartRef = useRef(null);
  const threeRef = useRef(null);

  // Generate a beautiful color palette
  const generateColors = (count) => {
    const baseColors = [
      'rgba(54, 162, 235, 0.8)',  // Blue
      'rgba(75, 192, 192, 0.8)',  // Teal
      'rgba(153, 102, 255, 0.8)', // Purple
      'rgba(255, 159, 64, 0.8)',  // Orange
      'rgba(255, 99, 132, 0.8)',  // Pink
      'rgba(255, 206, 86, 0.8)',  // Yellow
      'rgba(75, 192, 192, 0.8)',  // Green
    ];
    return Array(count).fill(0).map((_, i) => baseColors[i % baseColors.length]);
  };

  useEffect(() => {
    setChartData(null);
  }, [chartType, xAxis, yAxis]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (!jsonData.length) {
        alert("Excel sheet is empty or unreadable");
        return;
      }

      setExcelData(jsonData);
      setColumns(Object.keys(jsonData[0]));
      setXAxis("");
      setYAxis("");
    };
    reader.readAsArrayBuffer(file);

    // Upload Excel file to backend
    (async () => {
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

        console.log("Excel file uploaded successfully.");
      } catch (err) {
        console.error("Excel file upload failed:", err);
      }
    })();
  };

  const generateChart = () => {
    if (
      !xAxis ||
      (!yAxis && !["pie", "radar", "area", "scatter"].includes(chartType)) ||
      !selectedFile
    ) {
      alert("Please upload file and select appropriate axes.");
      return;
    }

    // Use the utility function to generate chart data
    const newChartData = generateChartData(excelData, xAxis, yAxis, chartType);
    setChartData(newChartData);

    // Store chart image after rendering
    setTimeout(async () => {
      let imageData;

      if (dimension === "2D" && chartRef.current) {
        imageData = chartRef.current.canvas.toDataURL("image/png");
      } else if (dimension === "3D" && threeRef.current) {
        const canvas = threeRef.current.querySelector("canvas");
        if (canvas) {
          imageData = canvas.toDataURL("image/png");
        }
      }

      if (imageData) {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No auth token found");

          const decoded = jwt_decode(token);
          const username = decoded.name;
          const createdBy = decoded.id;
          const chartTitle = `${chartType} - ${xAxis} vs ${yAxis}`;

          await axios.post(
            "http://localhost:5000/api/charts/upload",
            {
              title: chartTitle,
              username,
              chartType,
              typeOfChart: chartType,
              typeOfDimension: dimension,
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

          console.log("Chart image stored in DB successfully.");
        } catch (err) {
          console.error("Failed to store chart image:", err);
        }
      }
    }, 1000);
  };

  useEffect(() => {
    console.log("useEffect for 3D chart triggered.", { dimension, chartType, excelDataLength: excelData.length, xAxis, yAxis });
    if (
      dimension === "3D" &&
      (chartType === "bar" || chartType === "line" || chartType === "pie" || chartType === "radar" || chartType === "area" || chartType === "scatter") &&
      excelData.length > 0 &&
      xAxis &&
      yAxis
    ) {
      console.log("Conditions met for rendering 3D chart.");
      // Use the utility function to render the 3D chart
      const cleanup3D = render3DChart(threeRef, excelData, xAxis, yAxis, chartType);
      return cleanup3D; // Return cleanup function
    } else if (threeRef.current) {
      console.log("Conditions not met for 3D chart. Clearing threeRef.");
      threeRef.current.innerHTML = ""; // Clear 3D container if not rendering 3D
    }
     return () => {
        console.log("useEffect cleanup (no 3D chart rendered).");
        // No specific cleanup needed if render3DChart wasn't called, but return empty cleanup for consistency
     };
  }, [dimension, chartType, excelData, xAxis, yAxis]); // Depend on relevant state variables

  const downloadChart = (format) => {
    let imageData;

    if (dimension === "2D" && chartRef.current) {
      imageData = chartRef.current.canvas.toDataURL("image/png");
    } else if (dimension === "3D" && threeRef.current) {
      const canvas = threeRef.current.querySelector("canvas");
      if (!canvas) return alert("No 3D chart available");
      imageData = canvas.toDataURL("image/png");
    } else {
      return alert("No chart to download");
    }

    if (format === "png") {
      const link = document.createElement("a");
      link.href = imageData;
      link.download = "chart.png";
      link.click();
    } else if (format === "pdf") {
      const pdf = new jsPDF();
      pdf.addImage(imageData, "PNG", 10, 10, 190, 100);
      pdf.save("chart.pdf");
    }
  };

  // Render 2D chart using the utility function
  const render2DChartComponent = render2DChart(chartData, chartType, xAxis, yAxis, chartRef);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold text-center text-green-700 mb-8">
         Excel Chart Visualizer <span className="text-sm">(2D / 3D)</span>
      </h2>

      <div
        className={`mb-6 transition-all border-4 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center ${selectedFile ? "border-green-500 bg-green-50" : "border-gray-300"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-1">
                📈 Chart Type
              </label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
                <option value="radar">Radar</option>
                <option value="area">Area</option>
                {/* <option value="scatter">Scatter</option> */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                🧭 Dimension
              </label>
              <select
                value={dimension}
                onChange={(e) => setDimension(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateChart}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mb-6"
          >
            Generate Chart
          </button>
        </>
      )}

      {dimension === "2D" && chartData && <div>{render2DChartComponent}</div>}
      {dimension === "3D" && <div ref={threeRef} className="h-96 w-full"></div>}

      {chartData && (
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={() => downloadChart("png")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Download PNG
          </button>
          <button
            onClick={() => downloadChart("pdf")}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;