import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Shield, 
  AlertTriangle 
} from 'lucide-react';

const FarmAnalytics = ({ totalDetections, diseaseData }) => {
  // Sample analytics data
  const metrics = [
    {
      title: 'Crop Health Score',
      value: '92%',
      change: '+5%',
      trend: 'up',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: 'Disease Prevention',
      value: '87%',
      change: '+12%',
      trend: 'up',
      icon: Shield,
      color: 'text-blue-600'
    },
    {
      title: 'Active Alerts',
      value: totalDetections || 0,
      change: '-3',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      title: 'Treatment Success',
      value: '94%',
      change: '+8%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600'
    }
  ];

  // Sample chart data
  const monthlyData = [
    { month: 'Jan', detections: 4, treatments: 6 },
    { month: 'Feb', detections: 3, treatments: 5 },
    { month: 'Mar', detections: 2, treatments: 4 },
    { month: 'Apr', detections: 5, treatments: 7 },
    { month: 'May', detections: 1, treatments: 3 },
    { month: 'Jun', detections: 3, treatments: 5 }
  ];

  const cropHealthData = [
    { name: 'Healthy', value: 75, color: '#10B981' },
    { name: 'At Risk', value: 20, color: '#F59E0B' },
    { name: 'Diseased', value: 5, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${metric.color}`} />
                <div className={`flex items-center gap-1 text-xs ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis hide />
                <Bar dataKey="detections" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="treatments" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Detections</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Treatments</span>
            </div>
          </div>
        </motion.div>

        {/* Crop Health Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Crop Health Distribution</h4>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropHealthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {cropHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {cropHealthData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FarmAnalytics;