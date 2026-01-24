import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity, Target } from 'lucide-react';

const FarmAnalyticsDemo = ({ totalDetections }) => {
  const analyticsData = [
    {
      label: 'Crop Health Score',
      value: '92%',
      trend: '+5%',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      label: 'Disease Prevention',
      value: '87%',
      trend: '+12%',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      label: 'Treatment Success',
      value: '94%',
      trend: '+8%',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-4">
      {analyticsData.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-green-600">{item.trend}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FarmAnalyticsDemo;