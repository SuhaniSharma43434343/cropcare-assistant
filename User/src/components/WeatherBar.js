import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets } from 'lucide-react';

const WeatherBar = ({ city = 'Mumbai' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': Sun, '01n': Sun,
      '02d': Cloud, '02n': Cloud,
      '03d': Cloud, '03n': Cloud,
      '04d': Cloud, '04n': Cloud,
      '09d': CloudRain, '09n': CloudRain,
      '10d': CloudRain, '10n': CloudRain,
      '11d': CloudRain, '11n': CloudRain,
      '13d': CloudSnow, '13n': CloudSnow,
      '50d': Cloud, '50n': Cloud
    };
    return iconMap[iconCode] || Cloud;
  };

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/weather/forecast/${city}`);
      const data = await response.json();
      
      if (data.success) {
        setWeather(data.data);
        setError(null);
      } else {
        setError('Weather data unavailable');
      }
    } catch (err) {
      setError('Failed to fetch weather');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, [city]);

  if (loading) {
    return (
      <div className="bg-blue-50 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-3 bg-blue-200 rounded animate-pulse mb-1"></div>
            <div className="h-2 bg-blue-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-gray-50 rounded-xl p-3">
        <div className="flex items-center gap-2 text-gray-500">
          <Cloud className="w-6 h-6" />
          <span className="text-sm">Weather unavailable</span>
        </div>
      </div>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.current.icon);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-3 border border-blue-100 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <WeatherIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{weather.current.temperature}°C</span>
              <span className="text-xs text-gray-600 capitalize">{weather.current.description}</span>
            </div>
            <div className="text-xs text-gray-500">{weather.current.city}</div>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            <span>{weather.current.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3" />
            <span>{weather.current.windSpeed}m/s</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-2 overflow-x-auto">
        {weather.forecast.slice(0, 3).map((item, index) => {
          const ForecastIcon = getWeatherIcon(item.icon);
          const time = new Date(item.time).getHours();
          return (
            <div key={index} className="flex flex-col items-center min-w-[45px] text-xs text-gray-600">
              <span>{time}:00</span>
              <ForecastIcon className="w-4 h-4 my-1" />
              <span>{item.temperature}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherBar;