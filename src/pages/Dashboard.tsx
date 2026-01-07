import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Bell, 
  Leaf, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/layout/MobileLayout";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Tooltip } from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();

  const healthTrendData = [
    { day: "Mon", health: 85 },
    { day: "Tue", health: 82 },
    { day: "Wed", health: 78 },
    { day: "Thu", health: 75 },
    { day: "Fri", health: 80 },
    { day: "Sat", health: 85 },
    { day: "Sun", health: 88 },
  ];

  const diseaseData = [
    { name: "Late Blight", count: 4 },
    { name: "Powdery Mildew", count: 2 },
    { name: "Leaf Spot", count: 3 },
    { name: "Root Rot", count: 1 },
  ];

  const recentDiagnoses = [
    {
      id: 1,
      crop: "Tomato",
      disease: "Late Blight",
      severity: "Moderate",
      date: "Today",
      status: "treating",
    },
    {
      id: 2,
      crop: "Potato",
      disease: "Leaf Spot",
      severity: "Mild",
      date: "Yesterday",
      status: "healthy",
    },
    {
      id: 3,
      crop: "Cucumber",
      disease: "Powdery Mildew",
      severity: "Severe",
      date: "3 days ago",
      status: "treating",
    },
  ];

  const reminders = [
    { id: 1, text: "Apply Neem Oil spray to tomatoes", time: "Today, 6:00 PM" },
    { id: 2, text: "Water cucumber plants", time: "Tomorrow, 7:00 AM" },
  ];

  return (
    <MobileLayout>
      <div className="px-4 pt-6 safe-area-top">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Track your crop health</p>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="glass-card rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Overall Health</span>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <p className="text-2xl font-bold text-foreground">88%</p>
            <p className="text-xs text-success">+5% from last week</p>
          </div>
          <div className="glass-card rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Active Issues</span>
              <AlertTriangle className="w-4 h-4 text-warning" />
            </div>
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-xs text-warning">2 need attention</p>
          </div>
        </motion.div>

        {/* Health Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-4 shadow-card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Health Trend</h2>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrendData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  hide 
                  domain={[60, 100]} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="health"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Disease Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-4 shadow-card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Disease Breakdown</h2>
            <span className="text-xs text-muted-foreground">This month</span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Diagnoses */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Diagnoses</h2>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentDiagnoses.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4 p-4 glass-card rounded-2xl shadow-soft"
                onClick={() => navigate("/diagnosis")}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  item.status === "healthy" ? "bg-success/10" : "bg-warning/10"
                }`}>
                  {item.status === "healthy" ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <Clock className="w-5 h-5 text-warning" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{item.crop}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{item.disease}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.severity === "Mild" 
                    ? "bg-success/10 text-success"
                    : item.severity === "Moderate"
                    ? "bg-warning/10 text-warning"
                    : "bg-destructive/10 text-destructive"
                }`}>
                  {item.severity}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Spray Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Spray Reminders</h2>
            <Button variant="ghost" size="sm" className="text-xs">
              Add New
            </Button>
          </div>
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{reminder.text}</p>
                  <p className="text-xs text-muted-foreground">{reminder.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
