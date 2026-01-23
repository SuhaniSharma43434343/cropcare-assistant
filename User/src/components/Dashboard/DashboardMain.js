import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import WeatherWidget from './WeatherWidget';
import MarketPulseWidget from './MarketPulseWidget';
import AIDetectionHero from './AIDetectionHero';
import OperationalCards from './OperationalCards';
import InvestmentTicker from './InvestmentTicker';
import './Dashboard.css';

const Dashboard = () => {
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

  const [lastDetection, setLastDetection] = useState({
    disease: 'Early Blight',
    confidence: 98,
    crop: 'Tomato',
    timestamp: new Date().toISOString()
  });

  const [investmentData, setInvestmentData] = useState([
    {
      title: 'Wheat Crop Funding',
      description: 'Season funding for 10 acres wheat cultivation',
      amount: 250000,
      status: 'new',
      offers: 2
    },
    {
      title: 'Equipment Purchase',
      description: 'Loan for new tractor and implements',
      amount: 800000,
      status: 'pending',
      offers: 0
    },
    {
      title: 'Organic Certification',
      description: 'Funding for organic farming transition',
      amount: 150000,
      status: 'approved',
      offers: 1
    }
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update weather data every 10 minutes (simulated)
      setWeatherData(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 10))
      }));

      // Update market data every 15 minutes (simulated)
      setMarketData(prev => prev.map(item => ({
        ...item,
        price: Math.max(1000, item.price + (Math.random() - 0.5) * 100),
        change: `${(Math.random() - 0.5) * 5 > 0 ? '+' : ''}${((Math.random() - 0.5) * 5).toFixed(1)}%`
      })));
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout currentPage="Dashboard">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Farm Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor your farm's health, market opportunities, and operational needs</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Last updated:</span>
              <span className="font-medium">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Real-Time Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <WeatherWidget weatherData={weatherData} />
        <MarketPulseWidget marketData={marketData} />
      </div>

      {/* Row 2: AI Disease Detection Hero Section */}
      <div className="mb-8">
        <AIDetectionHero lastDetection={lastDetection} />
      </div>

      {/* Row 3: Operational Management */}
      <div className="mb-8">
        <OperationalCards />
      </div>

      {/* Row 4: Investment & Financial Opportunities */}
      <div className="mb-8">
        <InvestmentTicker investmentData={investmentData} />
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
          <div className="text-2xl font-bold text-emerald-600">45+</div>
          <div className="text-sm text-gray-600">Disease Treatments</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">98%</div>
          <div className="text-sm text-gray-600">AI Accuracy</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">24/7</div>
          <div className="text-sm text-gray-600">Weather Monitoring</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">Live</div>
          <div className="text-sm text-gray-600">Market Prices</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;