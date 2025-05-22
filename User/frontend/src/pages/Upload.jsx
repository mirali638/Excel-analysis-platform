import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Bar, Line, Pie, Doughnut, Radar } from "react-chartjs-2";
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
} from "chart.js";
import * as THREE from "three";
import jsPDF from "jspdf";

ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale
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
      (!yAxis && !["pie", "doughnut"].includes(chartType)) ||
      !selectedFile
    ) {
      alert("Please upload file and select appropriate axes.");
      return;
    }

    const labels = excelData.map((row) => row[xAxis]);
    const values = excelData.map((row) => Number(row[yAxis]) || 0);

    if (["pie", "doughnut"].includes(chartType)) {
      const aggregated = {};
      labels.forEach((label, idx) => {
        aggregated[label] = (aggregated[label] || 0) + values[idx];
      });

      const finalLabels = Object.keys(aggregated);
      const finalValues = Object.values(aggregated);
      const colors = finalLabels.map(
        (_, i) => `hsl(${(i * 137.5) % 360}, 70%, 60%)`
      );

      setChartData({
        labels: finalLabels,
        datasets: [
          {
            label: `${yAxis} by ${xAxis}`,
            data: finalValues,
            backgroundColor: colors,
            borderColor: "white",
            borderWidth: 2,
            hoverOffset: 10,
          },
        ],
      });
    } else {
      setChartData({
        labels,
        datasets: [
          {
            label: `${yAxis} by ${xAxis}`,
            data: values,
            backgroundColor: "rgba(33, 115, 70, 0.6)",
            borderColor: "rgba(33, 115, 70, 1)",
            borderWidth: 1,
          },
        ],
      });
    }

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

  const render3DChart = () => {
    if (!threeRef.current || !xAxis || !yAxis || !excelData.length) return;
    threeRef.current.innerHTML = "";

    const width = threeRef.current.offsetWidth;
    const height = 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    threeRef.current.appendChild(renderer.domElement);

    const labels = excelData.map((row) => row[xAxis]);
    const values = excelData.map((row) => Number(row[yAxis]) || 0);
    const barWidth = 1;
    const spacing = 1.5;

    values.forEach((val, idx) => {
      const geometry = new THREE.BoxGeometry(barWidth, val, barWidth);
      const material = new THREE.MeshStandardMaterial({ color: 0x217346 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = idx * spacing;
      cube.position.y = val / 2;
      scene.add(cube);
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(10, 10, 10).normalize();
    scene.add(light);

    camera.position.set(
      (values.length * spacing) / 2,
      Math.max(...values) * 1.5,
      values.length
    );
    camera.lookAt(new THREE.Vector3((values.length * spacing) / 2, 0, 0));

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  };

  useEffect(() => {
    if (
      dimension === "3D" &&
      chartType === "bar" &&
      excelData.length > 0 &&
      xAxis &&
      yAxis
    ) {
      render3DChart();
    } else if (threeRef.current) {
      threeRef.current.innerHTML = "";
    }
  }, [dimension, chartType, excelData, xAxis, yAxis]);

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

  const render2DChart = () => {
    if (!chartData) return null;

    const chartProps = {
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `${chartType} - ${xAxis} vs ${yAxis}`,
          },
        },
      },
    };

    const ChartComponent = {
      bar: Bar,
      line: Line,
      pie: Pie,
      doughnut: Doughnut,
      radar: Radar,
    }[chartType];

    if (!ChartComponent) return <p>Unsupported chart type</p>;

    return <ChartComponent ref={chartRef} {...chartProps} />;
  };
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold text-center text-green-700 mb-8">
        📊 Excel Chart Visualizer <span className="text-sm">(2D / 3D)</span>
      </h2>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="mb-6 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition"
      />

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
                <option value="doughnut">Doughnut</option>
                <option value="radar">Radar</option>
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

      {dimension === "2D" && chartData && <div>{render2DChart()}</div>}
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
