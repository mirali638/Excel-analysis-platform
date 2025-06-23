import React, { useEffect, useState } from "react";

// Dynamic Plotly loading
const PlotlyComponent = ({ data, layout, config }) => {
  const [Plot, setPlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlotly = async () => {
      try {
        // Check if Plotly is already loaded
        if (window.Plotly) {
          const { default: PlotComponent } = await import("react-plotly.js");
          setPlot(() => PlotComponent);
        } else {
          // Load Plotly from CDN if not available
          const script = document.createElement("script");
          script.src = "https://cdn.plot.ly/plotly-latest.min.js";
          script.onload = async () => {
            const { default: PlotComponent } = await import("react-plotly.js");
            setPlot(() => PlotComponent);
          };
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error("Error loading Plotly:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlotly();
  }, []);

  if (isLoading || !Plot) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading 3D Chart...</p>
        </div>
      </div>
    );
  }

  return (
    <Plot
      data={data}
      layout={layout}
      config={config}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
      onInitialized={(figure) => {
        // Store reference for cleanup
        if (window.Plotly && figure) {
          window.currentPlotlyChart = figure;
        }
      }}
    />
  );
};

// Generate 3D chart data
export const generate3DChartData = (
  excelData,
  xAxis,
  yAxis,
  zAxis,
  chartType
) => {
  if (!xAxis || !yAxis || !zAxis || !excelData || excelData.length === 0) {
    console.error("Missing data or axes for 3D chart.");
    return null;
  }

  const xData = excelData.map((row) => Number(row[xAxis]) || 0);
  const yData = excelData.map((row) => Number(row[yAxis]) || 0);
  const zData = excelData.map((row) => Number(row[zAxis]) || 0);

  const commonConfig = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToAdd: ["downloadImage"],
    modeBarButtonsToRemove: ["lasso2d", "select2d"],
  };

  const commonLayout = {
    margin: { l: 0, r: 0, b: 0, t: 50 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    height: 400,
    scene: {
      xaxis: { title: xAxis, showgrid: true, zeroline: true },
      yaxis: { title: yAxis, showgrid: true, zeroline: true },
      zaxis: { title: zAxis, showgrid: true, zeroline: true },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 },
      },
    },
  };

  switch (chartType) {
    case "scatter3d":
      return {
        data: [
          {
            type: "scatter3d",
            mode: "markers",
            x: xData,
            y: yData,
            z: zData,
            marker: {
              size: 8,
              color: zData,
              colorscale: "Viridis",
              opacity: 0.8,
              line: {
                color: "rgba(0,0,0,0.2)",
                width: 1,
              },
            },
            hoverinfo: "x+y+z+text",
            text: excelData.map(
              (row) =>
                `${xAxis}: ${row[xAxis]}<br>${yAxis}: ${row[yAxis]}<br>${zAxis}: ${row[zAxis]}`
            ),
          },
        ],
        layout: {
          ...commonLayout,
          title: `3D Scatter Plot - ${xAxis} vs ${yAxis} vs ${zAxis}`,
        },
        config: commonConfig,
      };

    case "surface3d":
      // Create a grid for surface plot
      const gridSize = Math.ceil(Math.sqrt(excelData.length));
      const xGrid = Array(gridSize)
        .fill(0)
        .map((_, i) => i);
      const yGrid = Array(gridSize)
        .fill(0)
        .map((_, i) => i);
      const zGrid = Array(gridSize)
        .fill(0)
        .map(() => Array(gridSize).fill(0));

      // Fill the grid with interpolated values
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const idx = i * gridSize + j;
          if (idx < excelData.length) {
            zGrid[i][j] = zData[idx];
          } else {
            zGrid[i][j] = (zGrid[i - 1]?.[j] || 0 + zGrid[i]?.[j - 1] || 0) / 2;
          }
        }
      }

      return {
        data: [
          {
            type: "surface",
            x: xGrid,
            y: yGrid,
            z: zGrid,
            colorscale: "Viridis",
            opacity: 0.9,
            contours: {
              z: {
                show: true,
                usecolormap: true,
                highlightcolor: "#42f462",
                project: { z: true },
              },
            },
          },
        ],
        layout: {
          ...commonLayout,
          title: `3D Surface - ${xAxis} vs ${yAxis} vs ${zAxis}`,
        },
        config: commonConfig,
      };

    case "bar3d":
      // Create 3D bar chart using scatter3d with lines
      const bars = excelData.map((row, index) => {
        const x = Number(row[xAxis]) || 0;
        const y = Number(row[yAxis]) || 0;
        const z = Number(row[zAxis]) || 0;

        return {
          type: "scatter3d",
          mode: "lines",
          x: [x, x],
          y: [y, y],
          z: [0, z],
          line: {
            width: 10,
            color: z,
            colorscale: "Viridis",
          },
          showlegend: false,
          hoverinfo: "x+y+z+text",
          text: `${xAxis}: ${row[xAxis]}<br>${yAxis}: ${row[yAxis]}<br>${zAxis}: ${row[zAxis]}`,
        };
      });

      return {
        data: bars,
        layout: {
          ...commonLayout,
          title: `3D Bar Chart - ${xAxis} vs ${yAxis} vs ${zAxis}`,
        },
        config: commonConfig,
      };

    case "line3d":
      // Create a proper 3D line chart with connected points
      return {
        data: [
          {
            type: "scatter3d",
            mode: "lines+markers",
            x: xData,
            y: yData,
            z: zData,
            line: {
              color: "rgb(75,192,192)",
              width: 4,
              dash: "solid",
            },
            marker: {
              size: 6,
              color: zData,
              colorscale: "Viridis",
              opacity: 0.8,
              line: {
                color: "rgba(0,0,0,0.2)",
                width: 1,
              },
            },
            hoverinfo: "x+y+z+text",
            text: excelData.map(
              (row) =>
                `${xAxis}: ${row[xAxis]}<br>${yAxis}: ${row[yAxis]}<br>${zAxis}: ${row[zAxis]}`
            ),
          },
          // Add a second trace for better visualization
          {
            type: "scatter3d",
            mode: "markers",
            x: xData,
            y: yData,
            z: zData,
            marker: {
              size: 8,
              color: zData,
              colorscale: "Viridis",
              opacity: 0.6,
              symbol: "circle",
            },
            showlegend: false,
            hoverinfo: "skip",
          },
        ],
        layout: {
          ...commonLayout,
          title: `3D Line Chart - ${xAxis} vs ${yAxis} vs ${zAxis}`,
          scene: {
            ...commonLayout.scene,
            camera: {
              eye: { x: 2, y: 2, z: 1.5 },
            },
          },
        },
        config: commonConfig,
      };

    default:
      console.error("Unsupported 3D chart type:", chartType);
      return null;
  }
};

// Render 3D chart component
export const render3DChart = (chartData) => {
  if (!chartData) return null;

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "400px" }}>
      <PlotlyComponent
        data={chartData.data}
        layout={chartData.layout}
        config={chartData.config}
      />
    </div>
  );
};

// Get available 3D chart types
export const get3DChartTypes = () => [
  { value: "scatter3d", label: "3D Scatter Plot" },
  { value: "surface3d", label: "3D Surface" },
  { value: "bar3d", label: "3D Bar Chart" },
  { value: "line3d", label: "3D Line Chart" },
];

// Cleanup function for Plotly charts
export const cleanupPlotlyCharts = () => {
  if (window.Plotly && window.currentPlotlyChart) {
    try {
      window.Plotly.purge(window.currentPlotlyChart);
      window.currentPlotlyChart = null;
    } catch (error) {
      console.error("Error cleaning up Plotly chart:", error);
    }
  }
};
