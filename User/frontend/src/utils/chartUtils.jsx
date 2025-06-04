import * as THREE from "three";
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

// Generate a beautiful color palette
export const generateColors = (count) => {
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

export const generateChartData = (excelData, xAxis, yAxis, chartType) => {
  if (
    !xAxis ||
    (!yAxis && !["pie", "radar", "area", "scatter"].includes(chartType)) ||
    !excelData ||
    excelData.length === 0
  ) {
    console.error("Missing data or axes for chart data generation.");
    return null;
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
    const colors = generateColors(finalLabels.length);

    return {
      labels: finalLabels,
      datasets: [
        {
          label: `${yAxis} by ${xAxis}`,
          data: finalValues,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.8', '1')),
          borderWidth: 2,
          hoverOffset: 15,
          hoverBorderWidth: 3,
        },
      ],
    };
  } else if (chartType === 'radar') {
      const colors = generateColors(1);
       return {
          labels: labels,
          datasets: [{
              label: `${yAxis} by ${xAxis}`,
              data: values,
              backgroundColor: colors[0].replace('0.8', '0.4'),
              borderColor: colors[0].replace('0.8', '1'),
              pointBackgroundColor: colors[0].replace('0.8', '1'),
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: colors[0].replace('0.8', '1'),
              tension: 0.4,
          }]
       };

  } else if (chartType === 'area' || chartType === 'scatter') {
       const colors = generateColors(1);
       // For scatter, Chart.js expects data as {x, y} objects
       const scatterData = chartType === 'scatter' ? labels.map((label, index) => ({
           x: label,
           y: values[index]
       })) : values;

       return {
          labels: labels,
          datasets: [{
              label: `${yAxis} by ${xAxis}`,
              data: scatterData,
              backgroundColor: chartType === 'area' ? colors[0].replace('0.8', '0.4') : colors[0],
              borderColor: colors[0].replace('0.8', '1'),
              borderWidth: chartType === 'scatter' ? 0 : 2,
              pointRadius: chartType === 'scatter' ? 5 : 3,
              pointBackgroundColor: colors[0].replace('0.8', '1'),
              pointBorderColor: '#fff',
              pointHoverRadius: chartType === 'scatter' ? 7 : 4,
              tension: chartType === 'area' ? 0.4 : 0,
              fill: chartType === 'area' ? true : false,
          }]
       };

  } else if (chartType === 'line') {
       const colors = generateColors(1);
       return {
          labels: labels,
          datasets: [{
              label: `${yAxis} by ${xAxis}`,
              data: values,
              backgroundColor: colors[0].replace('0.8', '0.4'),
              borderColor: colors[0].replace('0.8', '1'),
              borderWidth: 3,
              pointRadius: 6,
              pointBackgroundColor: colors[0].replace('0.8', '1'),
              pointBorderColor: '#fff',
              pointHoverRadius: 8,
              tension: 0.4,
              fill: false,
          }]
       };

  } else { // Handle 2D bar chart (default)
    const colors = generateColors(1);
    return {
      labels,
      datasets: [
        {
          label: `${yAxis} by ${xAxis}`,
          data: values,
          backgroundColor: colors[0],
          borderColor: colors[0].replace('0.8', '1'),
          borderWidth: 2,
          hoverBackgroundColor: colors[0].replace('0.8', '0.9'),
          hoverBorderWidth: 3,
        },
      ],
    };
  }
};

export const render2DChart = (chartData, chartType, xAxis, yAxis, chartRef) => {
  if (!chartData) return null;

  const chartProps = {
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart'
      },
      plugins: {
        title: {
          display: true,
          text: `${chartType} - ${xAxis} vs ${yAxis}`,
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        },
        legend: {
          position: 'top',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== undefined) {
                label += new Intl.NumberFormat('en-US', { 
                  style: 'decimal',
                  maximumFractionDigits: 2 
                }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            padding: 10,
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            padding: 10
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    },
  };

  const ChartComponent = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
    radar: Radar,
    area: Line,
    scatter: Scatter,
  }[chartType];

  if (!ChartComponent) return <p>Unsupported chart type</p>;

  return (
    <div className="w-full h-[500px] p-4 bg-white rounded-lg shadow-lg">
      <ChartComponent ref={chartRef} {...chartProps} />
    </div>
  );
};

export const render3DChart = (threeRef, excelData, xAxis, yAxis, chartType) => {
  console.log("Attempting to render 3D chart...");
  if (!threeRef.current || !xAxis || !yAxis || !excelData.length || (chartType !== 'bar' && chartType !== 'line' && chartType !== 'pie' && chartType !== 'radar' && chartType !== 'area' && chartType !== 'scatter')) {
    console.log("3D chart rendering prerequisites not met.", { threeRef: threeRef.current, xAxis, yAxis, excelDataLength: excelData.length, chartType });
    return;
  }

  threeRef.current.innerHTML = "";

  const width = threeRef.current.clientWidth;
  const height = threeRef.current.clientHeight;
  console.log(`Container size: ${width}x${height}`);

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f9fa);
  console.log("Three.js Scene created.");

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  const canvas = renderer.domElement;

  if (threeRef.current) {
      threeRef.current.appendChild(canvas);
      console.log("Renderer DOM element appended.");
  } else {
      console.error("threeRef.current is null when trying to append canvas.");
      return;
  }

  // Add OrbitControls for better interaction
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI / 2;
  controls.target.set(0, 0, 0);
  controls.update();
  console.log("OrbitControls initialized.");

  const labels = excelData.map((row) => row[xAxis]);
  const values = excelData.map((row) => Number(row[yAxis]) || 0);
  const maxValue = Math.max(...values);
  const totalValue = values.reduce((sum, val) => sum + val, 0);

  let chartDisplayWidth = 0;
  let chartDisplayDepth = 0;
  let cameraTargetY = 0;
  let gridHelperSize = 0;

  if (chartType === 'bar') {
      console.log("Rendering 3D bar chart...");
      const barWidth = 0.8;
      const spacing = 1.2;
      const totalWidth = (labels.length - 1) * spacing;
      chartDisplayWidth = totalWidth;
      chartDisplayDepth = barWidth;
      cameraTargetY = 0;
      gridHelperSize = chartDisplayWidth + 5;

      // Create a group for all bars
      const barsGroup = new THREE.Group();
      scene.add(barsGroup);
      console.log("Bars group created.");

      // Create bars with improved materials
  values.forEach((val, idx) => {
        const height = (val / maxValue) * 10;
        const geometry = new THREE.BoxGeometry(barWidth, height, barWidth);

        // Create gradient material
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(`hsl(${(idx * 137.5) % 360}, 70%, 60%)`),
          shininess: 100,
          specular: 0x444444,
        });

    const cube = new THREE.Mesh(geometry, material);
        cube.position.x = idx * spacing - totalWidth / 2;
        cube.position.y = height / 2;
        cube.castShadow = true;
        cube.receiveShadow = true;
        barsGroup.add(cube);

        // Add value label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        context.fillStyle = '#000000';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillText(val.toString(), 128, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ map: texture });
        const label = new THREE.Sprite(labelMaterial);
        label.position.set(cube.position.x, height + 0.5, 0);
        label.scale.set(2, 0.5, 1);
        barsGroup.add(label);
      });
      console.log(`Added ${values.length} bars.`);

       // Position camera for bars
      camera.position.set(totalWidth / 2, maxValue * 1.2, totalWidth + 15);
      camera.lookAt(new THREE.Vector3(totalWidth / 2, 0, 0));
       controls.target.set(totalWidth / 2, 0, 0);

  } else if (chartType === 'line') {
      console.log("Rendering 3D line chart...");
      const points = [];
      const spacing = 5;
      const lineThickness = 0.2;
      const pointRadius = 0.4;
      const colors = generateColors(values.length > 0 ? values.length : 1);

      values.forEach((val, idx) => {
          const x = idx * spacing;
          const y = val / maxValue * 10;
          const z = 0;
          points.push(new THREE.Vector3(x, y, z));

          // Add sphere at each data point
          const sphereGeometry = new THREE.SphereGeometry(pointRadius, 16, 16);
          const sphereMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(colors[idx % colors.length]).getHex(), shininess: 100 });
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          sphere.position.set(x, y, z);
          sphere.castShadow = true;
          sphere.receiveShadow = true;
          scene.add(sphere);
           console.log(`Added sphere at point ${idx}.`);
      });

      chartDisplayWidth = (values.length - 1) * spacing;
      chartDisplayDepth = pointRadius * 2;
      cameraTargetY = maxValue / 2;
      gridHelperSize = chartDisplayWidth + 5;

      // Create the 3D line
      if (points.length > 1) {
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({ color: 0x217346, linewidth: lineThickness * 10 });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
           console.log(`Added 3D line with ${points.length} points.`);
      }

      // Position camera for line
      camera.position.set(chartDisplayWidth / 2, maxValue / 2 + 5, chartDisplayWidth * 1.5);
      camera.lookAt(new THREE.Vector3(chartDisplayWidth / 2, maxValue / 2, 0));
      controls.target.set(chartDisplayWidth / 2, maxValue / 2, 0);

  } else if (chartType === 'pie') {
      console.log(`Rendering 3D ${chartType} chart...`);
      const outerRadius = 5;
      const innerRadius = 0;
      const depth = 2; // Thickness of the pie slices
      let startAngle = 0;
       const colors = [
          new THREE.Color(0xff0000), new THREE.Color(0x00ff00), new THREE.Color(0x0000ff), new THREE.Color(0xffff00), new THREE.Color(0xff00ff), new THREE.Color(0x00ffff),
          new THREE.Color(0xff4500), new THREE.Color(0x32cd32), new THREE.Color(0x1e90ff), new THREE.Color(0xffd700), new THREE.Color(0xba55d3), new THREE.Color(0x8fbc8f)
      ];
      const sliceSeparation = 0.5; // Further increased offset to separate slices

      chartDisplayWidth = outerRadius * 2; // Set width for grid helper
      chartDisplayDepth = outerRadius * 2; // Set depth for grid helper
      cameraTargetY = depth / 2; // Set camera target Y (center of the pie vertically)
      gridHelperSize = outerRadius * 2.5; // Set grid helper size

      const extrudeSettings = {
          steps: 1,
          depth: depth, // Extrude along Z-axis
          bevelEnabled: false
      };

      values.forEach((val, idx) => {
          const sliceAngle = (val / totalValue) * Math.PI * 2;
          const endAngle = startAngle + sliceAngle;

          // Create a 2D shape for the slice
          const shape = new THREE.Shape();
          // Start from center for pie slices
          shape.moveTo(0, 0);
          shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
          shape.lineTo(0, 0);

          // Extrude the shape to create 3D geometry
          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const material = new THREE.MeshPhongMaterial({ color: colors[idx % colors.length], shininess: 100 });
          const slice = new THREE.Mesh(geometry, material);

          // Position and rotate slice, add separation offset
          const midAngle = startAngle + sliceAngle / 2;
          const offsetX = Math.cos(midAngle) * sliceSeparation;
          const offsetY = Math.sin(midAngle) * sliceSeparation;

          // Position in XY plane, Z position determines height after rotation
          // Need to lift the slices so their bottom is above the grid (at Y = -0.1 after rotation)
          // The slice extends from Z=0 to Z=depth before rotation.
          // After X rotation by PI/2, Z becomes Y.
          // To have the bottom at Y=0, we need slice.position.y = depth/2.
          // To have the bottom at Y=-0.1, we need slice.position.y = depth/2 - 0.1.
          // To have the bottom at Y=+0.1 (above grid), we need slice.position.y = depth/2 + 0.1.
          slice.position.set(offsetX, offsetY, depth / 2 + 0.2); // Increased vertical offset to be clearly above grid
          slice.rotation.x = Math.PI / 2; // Rotate to lie flat
          slice.castShadow = true;
          slice.receiveShadow = true;

          scene.add(slice);

          // Add label (simplified for now, just text)
           const labelCanvas = document.createElement('canvas');
           const labelContext = labelCanvas.getContext('2d');
           labelCanvas.width = 256;
           labelCanvas.height = 64;
           labelContext.fillStyle = '#000000';
           labelContext.font = '20px Arial';
           labelContext.textAlign = 'center';
           labelContext.fillText(`${labels[idx]}: ${val}`, 128, 32);

           const labelTexture = new THREE.CanvasTexture(labelCanvas);
           const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
           const labelSprite = new THREE.Sprite(labelMaterial);

           // Position label slightly outside the slice
           const labelRadius = outerRadius + 5.5; // Increased radial distance for labels
           labelSprite.position.set(
               Math.cos(midAngle) * labelRadius,
               Math.sin(midAngle) * labelRadius,
               depth + 1.5 // Position even further above the slice
           );
           labelSprite.scale.set(5, 1.2, 1); // Further increased scale for labels

           scene.add(labelSprite);

          startAngle += sliceAngle;
      });
      console.log(`Added ${values.length} ${chartType} slices.`);

       // Position camera for pie chart (angled from above)
       camera.position.set(outerRadius * 3, outerRadius * 3.5 + depth, outerRadius * 4);
       camera.lookAt(new THREE.Vector3(0, depth / 2 + 0.2, 0)); // Look at the center of the pie with increased offset
       controls.target.set(0, depth / 2 + 0.2, 0); // Set controls target with increased offset
       controls.maxPolarAngle = Math.PI / 2.2; // Limit vertical rotation to avoid looking underneath

  } else if (chartType === 'radar') {
      console.log("Rendering 3D radar chart...");
      const center = new THREE.Vector3(0, 0, 0);
      const maxRadarValue = maxValue > 0 ? maxValue : 1;
      const radarRadius = 5;
      const depth = 1;
      const numPoints = values.length;
      const angleIncrement = (Math.PI * 2) / numPoints;

      const shapePoints = [];
      values.forEach((val, idx) => {
          const angle = idx * angleIncrement;
          const currentRadius = (val / maxRadarValue) * radarRadius;
          shapePoints.push(new THREE.Vector2(currentRadius * Math.cos(angle), currentRadius * Math.sin(angle)));
      });

      const shape = new THREE.Shape(shapePoints);

      const extrudeSettings = {
          steps: 1,
          depth: depth,
          bevelEnabled: false
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const material = new THREE.MeshPhongMaterial({ color: 0x1e90ff, shininess: 100 });
      const radarMesh = new THREE.Mesh(geometry, material);

      radarMesh.position.z = -depth / 2;
      radarMesh.castShadow = true;
      radarMesh.receiveShadow = true;

      scene.add(radarMesh);
      console.log(`Added radar mesh with ${numPoints} points.`);

      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      const pointsGeometry = new THREE.BufferGeometry().setFromPoints(shapePoints.map(p => new THREE.Vector3(p.x, p.y, depth/2)));
      const radarAxes = new THREE.LineLoop(pointsGeometry, lineMaterial);
      scene.add(radarAxes);

      chartDisplayWidth = radarRadius * 2;
      chartDisplayDepth = radarRadius * 2;
      cameraTargetY = depth / 2;
      gridHelperSize = radarRadius * 3;

      camera.position.set(0, radarRadius * 2, radarRadius * 3);
      camera.lookAt(new THREE.Vector3(0, depth / 2, 0));
      controls.target.set(0, depth / 2, 0);
      controls.maxPolarAngle = Math.PI / 2.2;

  } else if (chartType === 'area') {
       console.log("Rendering 3D area chart...");
       const depth = 2; // Thickness of the area in 3D
       const spacing = 5; // Spacing between data points along X

       // Create shape points based on data values
       const shapePoints = [];
       // Start at the base (Y=0) for the first point's X position
       shapePoints.push(new THREE.Vector2(0, 0));
       // Add points for each data value
       values.forEach((val, idx) => {
           shapePoints.push(new THREE.Vector2(idx * spacing, val / maxValue * 10)); // Scale value for height
       });
       // Add a point at the base (Y=0) for the last point's X position to close the shape
       shapePoints.push(new THREE.Vector2((values.length - 1) * spacing, 0));

       const shape = new THREE.Shape(shapePoints);

       const extrudeSettings = {
           steps: 1,
           depth: depth, // Extrude along Z-axis to give thickness
           bevelEnabled: false
       };

       const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
       const material = new THREE.MeshPhongMaterial({ color: 0x32cd32, shininess: 100 });
       const areaMesh = new THREE.Mesh(geometry, material);

       // Position the mesh so its base is above the grid
       // The extrusion is along Z, from 0 to depth. The base of the shape was on XY plane.
       // After extrusion, the mesh is centered around Z = depth/2.
       // To place the base at Z=0, we need areaMesh.position.z = -depth/2.
       // To place the base slightly above the grid (Y = -0.1), we need to consider rotation.
       // If we rotate around X by PI/2, Z becomes Y.
       // Let's go back to extruding along Y and creating shape on XZ.

       // --- Reverting to XZ plane shape and Y extrusion --- (Based on prior pie chart fix)
       const areaDepth = 2; // Thickness along Z
       const areaSpacing = 5; // Spacing along X

       const areaShapePoints = [];
        areaShapePoints.push(new THREE.Vector2(0, 0)); // Start at X=0, Z=0
       values.forEach((val, idx) => {
            areaShapePoints.push(new THREE.Vector2(idx * areaSpacing, val / maxValue * 10)); // Points on XZ plane
       });
        areaShapePoints.push(new THREE.Vector2((values.length - 1) * areaSpacing, 0)); // End at last X, Z=0

       const areaShape = new THREE.Shape(areaShapePoints);

       const areaExtrudeSettings = {
           steps: 1,
           depth: areaDepth, // Extrude along Y-axis (height)
           bevelEnabled: false
       };

       const areaGeometry = new THREE.ExtrudeGeometry(areaShape, areaExtrudeSettings);
       const areaMaterial = new THREE.MeshPhongMaterial({ color: 0x32cd32, shininess: 100 });
       const areaChartMesh = new THREE.Mesh(areaGeometry, areaMaterial);

       // Position the mesh so its base (Y=0) is above the grid (Y=-0.1)
       // The extruded shape goes from Y=0 to Y=areaDepth.
       // To lift it above the grid, we need to set its Y position.
       // We want the bottom (Y=0 of the geometry) to be at world Y = 0.1 (above grid).
       // So, areaChartMesh.position.y = 0.1.
       areaChartMesh.position.set(0, 0.1, 0); // Position base above grid
       areaChartMesh.castShadow = true;
       areaChartMesh.receiveShadow = true;

       scene.add(areaChartMesh);
       console.log(`Added 3D area mesh.`);

       chartDisplayWidth = (values.length - 1) * areaSpacing; // Use area spacing for width
       chartDisplayDepth = areaDepth; // Use area depth for depth
       cameraTargetY = (maxValue / 2 * 10) / 2; // Target center of the height
       gridHelperSize = chartDisplayWidth + 5; // Adjust grid size

       // Position camera for area chart
       camera.position.set(chartDisplayWidth / 2, maxValue * 1.5, chartDisplayWidth * 1.2);
       camera.lookAt(new THREE.Vector3(chartDisplayWidth / 2, (maxValue / 2 * 10) / 2 + 0.1, areaDepth / 2)); // Look at center of area
       controls.target.set(chartDisplayWidth / 2, (maxValue / 2 * 10) / 2 + 0.1, areaDepth / 2); // Set controls target

  } else if (chartType === 'scatter') {
      console.log("Rendering 3D scatter chart...");
      const pointRadius = 0.5;
      const spacing = 5;

      chartDisplayWidth = (values.length - 1) * spacing;
      chartDisplayDepth = pointRadius * 2;
      cameraTargetY = maxValue / 2;
      gridHelperSize = Math.max(chartDisplayWidth, maxValue * 10) + 5;

      values.forEach((val, idx) => {
          const geometry = new THREE.SphereGeometry(pointRadius, 16, 16);
          const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(`hsl(${(idx * 137.5) % 360}, 70%, 60%)`), shininess: 100 });
          const point = new THREE.Mesh(geometry, material);

          point.position.set(idx * spacing, val / maxValue * 10, 0);
          point.castShadow = true;
          point.receiveShadow = true;

          scene.add(point);
      });
      console.log(`Added ${values.length} scatter points.`);

       camera.position.set(chartDisplayWidth / 2, maxValue * 1.5, chartDisplayWidth * 1.5);
       camera.lookAt(new THREE.Vector3(chartDisplayWidth / 2, maxValue / 2, 0));
       controls.target.set(chartDisplayWidth / 2, maxValue / 2, 0);
  }

  // Improved lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Add a subtle point light
  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(-10, 10, -10);
  scene.add(pointLight);
  console.log("Lighting added.");

  // Add a grid helper (shared for all 3D charts)
   // Determine grid size based on the largest dimension of the chart type
  const gridHelper = new THREE.GridHelper(gridHelperSize, 20, 0x000000, 0x000000);
  gridHelper.position.y = -0.1;
  scene.add(gridHelper);
  console.log("Grid helper added.");

  console.log("Camera positioned and looking at target.");

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    controls.target.y = cameraTargetY; // Use dynamic cameraTargetY
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
  console.log("Animation loop started.");

  // Handle window resize
  const handleResize = () => {
    const newWidth = threeRef.current.clientWidth;
    const newHeight = threeRef.current.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
    console.log(`Window resized. New size: ${newWidth}x${newHeight}`);
  };
  window.addEventListener('resize', handleResize);
  console.log("Resize listener added.");

  // Cleanup function
  return () => {
    console.log("3D chart cleanup running...");
    window.removeEventListener('resize', handleResize);

    // Dispose of Three.js resources
    if (scene) {
        scene.traverse(object => {
            if (object.isMesh || object.isLine || object.isSprite) {
                if (object.geometry) {
                    object.geometry.dispose();
                    console.log("Disposed geometry.");
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => {
                            if (material.map) {
                                material.map.dispose();
                                console.log("Disposed material map.");
                            }
                            material.dispose();
                            console.log("Disposed material.");
                        });
                    } else {
                        if (object.material.map) {
                            object.material.map.dispose();
                            console.log("Disposed material map.");
                        }
                        object.material.dispose();
                        console.log("Disposed material.");
                    }
                }
            }
        });
    }

    if (threeRef.current && renderer.domElement) {
       try {
        threeRef.current.removeChild(renderer.domElement);
        console.log("Renderer DOM element removed.");
       } catch (error) {
        console.error("Error removing renderer DOM element:", error);
       }
    }
    if (renderer) {
      renderer.dispose();
      console.log("Renderer disposed.");
    }
    if (controls) {
      controls.dispose();
      console.log("OrbitControls disposed.");
    }

    console.log("3D chart cleanup finished.");
  };
}; 