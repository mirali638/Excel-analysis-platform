import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { Chart, registerables } from "chart.js";
import * as THREE from "three";
import { jsPDF } from "jspdf";

Chart.register(...registerables);

const ExcelChartVisualizer = () => {
  const [excelData, setExcelData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [zAxis, setZAxis] = useState("");
  const [chartStyle, setChartStyle] = useState("2d");
  const [chartType, setChartType] = useState("bar");

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const threeRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setExcelData(sheet);
      setColumns(Object.keys(sheet[0] || {}));
    };
    reader.readAsArrayBuffer(file);
  };

  const generateChart = () => {
    if (!xAxis || !yAxis || excelData.length === 0) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartStyle === "2d") {
      const ctx = chartRef.current.getContext("2d");
      chartInstanceRef.current = new Chart(ctx, {
        type: chartType,
        data: {
          labels: excelData.map((row) => row[xAxis]),
          datasets: [
            {
              label: yAxis,
              data: excelData.map((row) => row[yAxis]),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top" },
            tooltip: {
              callbacks: {
                title: (tooltipItem) => `Label: ${tooltipItem[0].label}`,
              },
            },
          },
        },
      });
    } else {
      render3DChart();
    }
  };

  const render3DChart = () => {
    if (!xAxis || !yAxis || !zAxis) return;

    const width = threeRef.current.clientWidth;
    const height = threeRef.current.clientHeight;

    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      threeRef.current.innerHTML = "";
      threeRef.current.appendChild(rendererRef.current.domElement);
    }

    rendererRef.current.setSize(width, height);

    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    cameraRef.current.position.set(0, 20, 40);

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(10, 20, 20);
    sceneRef.current.add(light);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x0077ff });
    const spacing = 4;

    excelData.forEach((row) => {
      const x = parseFloat(row[xAxis]) || 0;
      const y = parseFloat(row[yAxis]) || 0;
      const z = parseFloat(row[zAxis]) || 0;
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x * spacing, y * spacing, z * spacing);
      sceneRef.current.add(sphere);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();
  };

  const downloadChart = (format) => {
    let canvas =
      chartStyle === "2d" ? chartRef.current : rendererRef.current.domElement;
    const imageData = canvas.toDataURL("image/png");

    if (format === "png") {
      const link = document.createElement("a");
      link.download = `${chartStyle}_chart.png`;
      link.href = imageData;
      link.click();
    } else if (format === "pdf") {
      const pdf = new jsPDF();
      pdf.addImage(imageData, "PNG", 10, 10, 180, 120);
      pdf.save(`${chartStyle}_chart.pdf`);
    }
  };

  useEffect(() => {
    if (chartStyle === "2d") setZAxis("");
  }, [chartStyle]);

  useEffect(() => {
    generateChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xAxis, yAxis, zAxis, chartStyle, chartType, excelData]);

  return (
    <div className="flex flex-col items-center mt-7 mb-5 justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        Excel Data Visualizer
      </h1>
      <p className="text-gray-600 mb-4 max-w-xl">
        Upload your Excel file to visualize the data in different chart styles.
        Choose the X, Y, and Z (for 3D) axes.
      </p>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4 p-2 border rounded"
      />

      {columns.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select X-Axis</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>

            <select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select Y-Axis</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>

            {chartStyle === "3d" && (
              <select
                value={zAxis}
                onChange={(e) => setZAxis(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Select Z-Axis</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <select
              value={chartStyle}
              onChange={(e) => setChartStyle(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="2d">2D</option>
              <option value="3d">3D</option>
            </select>

            {chartStyle === "2d" && (
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
                <option value="doughnut">Doughnut</option>
                <option value="radar">Radar</option>
              </select>
            )}

            <button
              onClick={() => downloadChart("png")}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Download PNG
            </button>
            <button
              onClick={() => downloadChart("pdf")}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Download PDF
            </button>
          </div>
        </>
      )}

      {chartStyle === "2d" && (
        <div className="w-full max-w-4xl h-[400px]">
          <canvas ref={chartRef}></canvas>
        </div>
      )}

      {chartStyle === "3d" && (
        <div
          ref={threeRef}
          className="w-full max-w-4xl h-[500px] border rounded shadow-md"
        ></div>
      )}
    </div>
  );
};

export default ExcelChartVisualizer;
