import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, MapPin, AlertCircle } from 'lucide-react';

const CurrentWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(false);

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

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/weather/forecast/coords/${lat}/${lon}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setWeather(data.data);
        setLocationError(false);
        setError(null);
      } else {
        throw new Error(data.message || 'Weather data unavailable');
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Failed to fetch weather');
      // Fallback to city-based weather
      fetchWeatherByCity('Mumbai');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/weather/forecast/${city}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setWeather(data.data);
        setError(null);
      } else {
        throw new Error(data.message || 'Weather data unavailable');
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Weather service unavailable');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLocationError(true);
      setLoading(false);
      // Fallback to default city
      fetchWeatherByCity('Mumbai');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError(true);
        setError('Location access denied');
        setLoading(false);
        // Fallback to default city
        fetchWeatherByCity('Mumbai');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getCurrentLocation();
    const interval = setInterval(getCurrentLocation, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-blue-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-blue-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-3 text-gray-500">
          <AlertCircle className="w-8 h-8" />
          <div>
            <p className="font-medium">Weather Unavailable</p>
            <p className="text-sm">{locationError ? 'Using default location (Mumbai)' : 'Service temporarily down'}</p>
          </div>
        </div>
      </div>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.current.icon);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <WeatherIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">{weather.current.temperature}°C</span>
            </div>
            <p className="text-sm text-gray-600 capitalize">{weather.current.description}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
            <MapPin className="w-3 h-3" />
            <span>{weather.current.city}</span>
          </div>
          <div className="flex gap-3 text-xs text-gray-500">
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
      </div>
    </div>
  );
};

export default CurrentWeather;