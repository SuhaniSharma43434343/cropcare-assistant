import React, { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  CameraIcon, 
  BookOpenIcon, 
  ChartBarIcon,
  UserGroupIcon,
  TruckIcon,
  HandshakeIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  CloudIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12,
    forecast: 'Rain expected in 2 hours'
  });
  
  const [marketData, setMarketData] = useState([
    { crop: 'Wheat', price: 2150, trend: 'up', change: '+2.5%' },
    { crop: 'Rice', price: 3200, trend: 'up', change: '+1.8%' },
    { crop: 'Tomato', price: 1800, trend: 'down', change: '-0.5%' }
  ]);

  const navigation = [
    { name: 'Dashboard', icon: HomeIcon, current: true },
    { name: 'Disease Detection', icon: CameraIcon, current: false },
    { name: 'Treatment Library', icon: BookOpenIcon, current: false },
    { name: 'Market Rates', icon: ChartBarIcon, current: false },
    { name: 'Labour Hire', icon: UserGroupIcon, current: false },
    { name: 'Machinery', icon: TruckIcon, current: false },
    { name: 'Investment', icon: HandshakeIcon, current: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
                <div className="h-8 w-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌱</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">CropCare AI</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">All Services Online</span>
              </div>
              <BellIcon className="h-6 w-6 text-gray-400 hover:text-gray-500 cursor-pointer" />
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">Rajesh Kumar</div>
                  <div className="text-xs text-gray-500">Pune, MH</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:shadow-none border-r border-gray-200`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 lg:hidden">
              <span className="text-lg font-semibold text-gray-900">Menu</span>
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href="#"
                    className={`${
                      item.current
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-3 py-2 text-sm font-medium border-l-4 rounded-r-md transition-colors`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Monitor your farm's health and market opportunities</p>
            </div>

            {/* Row 1: Real-Time Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Weather Widget */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Weather</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Live - Updated 10m ago
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <CloudIcon className="h-12 w-12 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl font-bold text-gray-900">{weatherData.temperature}°C</div>
                    <div className="text-sm text-gray-600">{weatherData.condition}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Humidity: {weatherData.humidity}%</div>
                    <div className="text-sm text-gray-600">Wind: {weatherData.windSpeed} km/h</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ⚠️ {weatherData.forecast} - Plan spraying accordingly
                  </p>
                </div>
              </div>

              {/* Market Pulse Widget */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Market Pulse</h3>
                  <span className="text-xs text-gray-500">Data from APMC Mandi</span>
                </div>
                <div className="space-y-3">
                  {marketData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">{item.crop}</span>
                        <span className="text-sm text-gray-600">₹{item.price}/quintal</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {item.trend === 'up' ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: AI Disease Detection Hero Section */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <div className="flex-1 mb-6 lg:mb-0">
                    <h2 className="text-2xl font-bold mb-2">AI Plant Disease Detection</h2>
                    <p className="text-emerald-100 mb-4">Upload or scan your plant images for instant AI analysis</p>
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <p className="text-sm">
                        <span className="font-semibold">Last Detection:</span> Early Blight (98% Confidence)
                      </p>
                    </div>
                    <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Upload/Scan Plant 📷
                    </button>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-48 h-32 bg-white/10 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <CameraIcon className="h-12 w-12 mx-auto mb-2 text-white/80" />
                        <p className="text-sm text-white/80">Drag & Drop or Click</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Operational Management */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Smart Reminders */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Reminders</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="h-4 w-4 text-emerald-600 rounded" />
                    <span className="text-sm text-gray-700">Apply Neem Oil (Tomato) - Today</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="h-4 w-4 text-emerald-600 rounded" />
                    <span className="text-sm text-gray-700">Harvest Wheat - Tomorrow</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="h-4 w-4 text-emerald-600 rounded" />
                    <span className="text-sm text-gray-700">Fertilizer Application - 3 days</span>
                  </div>
                </div>
              </div>

              {/* Labour Availability */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Labour Availability</h3>
                <div className="text-center">
                  <UserGroupIcon className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-gray-900">5</p>
                  <p className="text-sm text-gray-600 mb-4">Labourers available near you (2km away)</p>
                  <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                    Hire Now
                  </button>
                </div>
              </div>

              {/* Machinery Rental */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Machinery Rental</h3>
                <div className="text-center">
                  <TruckIcon className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">Dealers nearby: 3</p>
                  <p className="text-lg font-semibold text-gray-900 mb-4">Rent Harvester @ ₹800/hr</p>
                  <button className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                    View Options
                  </button>
                </div>
              </div>
            </div>

            {/* Row 4: Investment Ticker */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <HandshakeIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Investment Opportunities</h3>
                    <p className="text-sm text-gray-600">Investment Request Status: 2 Offers Received for your Wheat crop</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Offers
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;