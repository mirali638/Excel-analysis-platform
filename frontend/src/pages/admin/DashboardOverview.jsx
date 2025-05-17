import React, { useState, useEffect } from "react";
import axios from "../../axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState(null); //holds stats from API
  const [loading, setLoading] = useState(true); //for fetch status.
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');  // for filtering data (week, month, year).

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/dashboard');
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Mock data for charts
  const userActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const fileProcessingData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Files Processed',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const fileTypeData = {
    labels: ['Excel', 'CSV', 'Other'],
    datasets: [
      {
        data: [70, 20, 10],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
      },
    ],
  };

  return (
  <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold">{dashboardData?.totalUsers || 0}</p>
          <p className="text-sm text-green-500">↑ 12% from last month</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="text-2xl font-bold">{dashboardData?.activeUsers || 0}</p>
          <p className="text-sm text-green-500">↑ 8% from last month</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-medium text-gray-500">Files Processed</h3>
          <p className="text-2xl font-bold">{dashboardData?.filesProcessed || 0}</p>
          <p className="text-sm text-green-500">↑ 15% from last month</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-medium text-gray-500">Storage Used</h3>
          <p className="text-2xl font-bold">{dashboardData?.storageUsed || '0 GB'}</p>
          <p className="text-sm text-red-500">↑ 5% from last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">User Activity</h3>
          <Line data={userActivityData} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">File Processing</h3>
          <Bar data={fileProcessingData} />
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">File Types</h3>
          <Doughnut data={fileTypeData} />
      </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {dashboardData?.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'upload' ? 'bg-blue-500' :
                  activity.type === 'process' ? 'bg-green-500' :
                  'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
      </div>
    </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-gray-500">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-gray-500">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Storage Usage</span>
                <span className="text-sm text-gray-500">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
    </div>
      </div>
    </div>
  </div>
);
};

export default DashboardOverview; 