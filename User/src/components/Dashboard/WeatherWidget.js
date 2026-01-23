import React from 'react';
import { CloudIcon, SunIcon, CloudRainIcon } from '@heroicons/react/24/outline';

const WeatherWidget = ({ weatherData }) => {
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <SunIcon className="h-12 w-12 text-yellow-500 weather-icon" />;
      case 'rainy':
        return <CloudRainIcon className="h-12 w-12 text-blue-500 weather-icon" />;
      default:
        return <CloudIcon className="h-12 w-12 text-gray-500 weather-icon" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Weather</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Live - Updated 10m ago
        </span>
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-shrink-0">
          {getWeatherIcon(weatherData.condition)}
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
      
      {weatherData.forecast && (
        <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-blue-800">
            ⚠️ {weatherData.forecast} - Plan spraying accordingly
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;