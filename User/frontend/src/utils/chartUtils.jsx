import React from "react";
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

// Generate colors for charts
export function generateColors(count) {
  const colors = [
    "rgba(255, 99, 132, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
    "rgba(199, 199, 199, 0.8)",
    "rgba(83, 102, 255, 0.8)",
    "rgba(40, 159, 64, 0.8)",
    "rgba(210, 199, 199, 0.8)",
  ];
  while (colors.length < count) colors.push(...colors);
  return colors.slice(0, count);
}

// Generate chart data based on Excel data and selected axes
export function generateChartData(excelData, xAxis, yAxis, chartType) {
  if (!excelData || !xAxis || !yAxis) {
    console.error("Missing data or axes for chart generation");
    return null;
  }

  const labels = excelData.map((row) => row[xAxis]);
  const data = excelData.map((row) => Number(row[yAxis]) || 0);
  const colors = generateColors(data.length);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${yAxis}: ${context.raw}`;
          },
        },
      },
    },
  };

  switch (chartType) {
    case "bar":
      return {
        data: {
          labels,
          datasets: [
            {
              label: yAxis,
              data,
              backgroundColor: colors,
              borderColor: colors.map((color) => color.replace("0.8", "1")),
              borderWidth: 1,
            },
          ],
        },
        options: {
          ...commonOptions,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: yAxis } },
            x: { title: { display: true, text: xAxis } },
          },
        },
      };

    case "line":
      return {
        data: {
          labels,
          datasets: [
            {
              label: yAxis,
              data,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              tension: 0.4,
              fill: false,
            },
          ],
        },
        options: {
          ...commonOptions,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: yAxis } },
            x: { title: { display: true, text: xAxis } },
          },
        },
      };

    case "radar":
      return {
        data: {
          labels,
          datasets: [
            {
              label: yAxis,
              data,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgb(75, 192, 192)",
              borderWidth: 2,
              pointBackgroundColor: "rgb(75, 192, 192)",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "rgb(75, 192, 192)",
            },
          ],
        },
        options: {
          ...commonOptions,
          scales: {
            r: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                callback: (value) => value,
              },
              pointLabels: {
                callback: (value) => value,
              },
            },
          },
        },
      };

    case "pie":
      return {
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
              borderColor: colors.map((color) => color.replace("0.8", "1")),
              borderWidth: 1,
            },
          ],
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        },
      };

    case "doughnut":
      return {
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
              borderColor: colors.map((color) => color.replace("0.8", "1")),
              borderWidth: 1,
            },
          ],
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        },
      };

    case "scatter":
      const scatterData = excelData.map((row) => ({
        x: Number(row[xAxis]) || 0,
        y: Number(row[yAxis]) || 0,
      }));
      return {
        data: {
          datasets: [
            {
              label: `${yAxis} vs ${xAxis}`,
              data: scatterData,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgb(75, 192, 192)",
              borderWidth: 1,
              pointRadius: 6,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          ...commonOptions,
          scales: {
            y: {
              type: "linear",
              position: "left",
              beginAtZero: true,
              title: { display: true, text: yAxis },
            },
            x: {
              type: "linear",
              position: "bottom",
              beginAtZero: true,
              title: { display: true, text: xAxis },
            },
          },
        },
      };

    case "area":
      return {
        data: {
          labels,
          datasets: [
            {
              label: yAxis,
              data,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.3)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "rgb(75, 192, 192)",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          ...commonOptions,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: yAxis } },
            x: { title: { display: true, text: xAxis } },
          },
        },
      };

    default:
      console.error("Unsupported chart type:", chartType);
      return null;
  }
}

// Get available chart types based on dimension
export function getChartTypes(dimension) {
  if (dimension === "2D") {
    return [
      { value: "bar", label: "Bar Chart" },
      { value: "line", label: "Line Chart" },
      { value: "radar", label: "Radar Chart" },
      { value: "pie", label: "Pie Chart" },
      { value: "doughnut", label: "Doughnut Chart" },
      { value: "scatter", label: "Scatter Plot" },
      { value: "area", label: "Area Chart" },
    ];
  }
  return [];
}

// Render 2D chart component
export function render2DChart(chartData, chartType, xAxis, yAxis, chartRef) {
  if (!chartData) return null;

  const commonProps = {
    ref: chartRef,
    data: chartData.data,
    options: chartData.options,
    key: `${chartType}-${Date.now()}`,
  };

  switch (chartType) {
    case "bar":
      return <Bar {...commonProps} />;
    case "line":
      return <Line {...commonProps} />;
    case "radar":
      return <Radar {...commonProps} />;
    case "pie":
      return <Pie {...commonProps} />;
    case "doughnut":
      return <Doughnut {...commonProps} />;
    case "scatter":
      return <Scatter {...commonProps} />;
    case "area":
      return <Line {...commonProps} />;
    default:
      return null;
  }
}

// Cleanup function for Chart.js charts
export function cleanupChartJSCharts() {
  // Get all canvas elements
  const canvases = document.querySelectorAll("canvas");
  canvases.forEach((canvas) => {
    const chartInstance = ChartJS.getChart(canvas);
    if (chartInstance) {
      chartInstance.destroy();
    }
  });
}
