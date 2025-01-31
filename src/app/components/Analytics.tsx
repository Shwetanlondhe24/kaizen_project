// src/app/components/Analytics.tsx
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface AnalyticsData {
  theme: string;
  idea: string;
  count: number;
}

export default function Analytics() {
  const [themeData, setThemeData] = useState<AnalyticsData[]>([]);
  const [ideaData, setIdeaData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        if (!response.ok) throw new Error('Failed to fetch analytics');
        
        const data = await response.json();
        if (data.success) {
          setThemeData(data.themeData);
          setIdeaData(data.ideaData);
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        setError('Failed to load analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-gray-500">Loading analytics...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="text-blue-800 text-lg font-medium mb-2">Total Reports</h4>
          <p className="text-3xl font-bold text-blue-900">
            {themeData.reduce((sum, item) => sum + item.count, 0)}
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="text-green-800 text-lg font-medium mb-2">Total Themes</h4>
          <p className="text-3xl font-bold text-green-900">{themeData.length}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h4 className="text-purple-800 text-lg font-medium mb-2">Total Departments</h4>
          <p className="text-3xl font-bold text-purple-900">{ideaData.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Theme Distribution - Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Theme Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={themeData}
                dataKey="count"
                nameKey="theme"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {themeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution - Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ideaData}>
              <XAxis dataKey="idea" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Number of Reports" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
