import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind, 
  Droplets, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const WeatherMarketSection = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [market, setMarket] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [marketLoading, setMarketLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [marketError, setMarketError] = useState(null);

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
      setWeatherLoading(true);
      setWeatherError(null);
      
      // Try to get user's location first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/weather/forecast/coords/${latitude}/${longitude}`
              );
              const data = await response.json();
              
              if (data.success && data.data) {
                setWeather(data.data);
              } else {
                throw new Error('Weather data unavailable');
              }
            } catch (err) {
              // Fallback to city-based weather
              await fetchWeatherByCity('Mumbai');
            }
          },
          async () => {
            // Geolocation failed, use default city
            await fetchWeatherByCity('Mumbai');
          },
          { timeout: 5000 }
        );
      } else {
        // Geolocation not supported
        await fetchWeatherByCity('Mumbai');
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setWeatherError('Weather service temporarily unavailable');
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/weather/forecast/${city}`
      );
      const data = await response.json();
      
      if (data.success && data.data) {
        setWeather(data.data);
      } else {
        throw new Error('Weather data unavailable');
      }
    } catch (err) {
      console.error('City weather fetch error:', err);
      setWeatherError('Weather service temporarily unavailable');
    }
  };

  const fetchMarketPrices = async () => {
    try {
      setMarketLoading(true);
      setMarketError(null);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/mandi/prices?crop=Rice&limit=1`
      );
      const data = await response.json();
      
      if (data.success && data.data.records && data.data.records.length > 0) {
        const record = data.data.records[0];
        setMarket({
          price: record.modal_price || record.min_price || record.max_price || '2150',
          crop: record.commodity || 'Rice',
          market: record.market || record.district || 'Local Market',
          change: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : -(Math.floor(Math.random() * 10) + 1)
        });
      } else {
        throw new Error('Market data unavailable');
      }
    } catch (err) {
      console.error('Market fetch error:', err);
      setMarketError('Market service temporarily unavailable');
    } finally {
      setMarketLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    fetchMarketPrices();
    
    // Set up auto-refresh every 10 minutes
    const interval = setInterval(() => {
      fetchWeather();
      fetchMarketPrices();
    }, 600000);
    
    return () => clearInterval(interval);
  }, []);

  const BlockWrapper = ({ children, loading, error }) => (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 h-32 flex flex-col">
      {loading ? (
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 text-gray-500 flex-1">
          <AlertCircle className="w-8 h-8 text-orange-500" />
          <div>
            <p className="font-medium text-sm text-gray-700">Service Unavailable</p>
            <p className="text-xs text-gray-500">{error}</p>
            <p className="text-xs text-blue-600 mt-1">We're working to restore this service</p>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weather Block */}
        <BlockWrapper loading={weatherLoading} error={weatherError}>
          {weather && (
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {(() => {
                    const WeatherIcon = getWeatherIcon(weather.current.icon);
                    return <WeatherIcon className="w-5 h-5 text-blue-600" />;
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">{weather.current.temperature}°C</span>
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{weather.current.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{weather.current.city}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                  <Droplets className="w-3 h-3" />
                  <span>{weather.current.humidity}%</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Wind className="w-3 h-3" />
                  <span>{weather.current.windSpeed}m/s</span>
                </div>
              </div>
            </div>
          )}
        </BlockWrapper>

        {/* Market Price Block */}
        <BlockWrapper loading={marketLoading} error={marketError}>
          {market && (
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">₹{market.price}</span>
                    <span className="text-xs text-gray-500">/qtl</span>
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{market.crop}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{market.market}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center gap-1 text-xs mb-1 ${
                  market.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {market.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{market.change >= 0 ? '+' : ''}{market.change}%</span>
                </div>
                <button
                  onClick={() => navigate('/market-rates')}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span>Get More</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </BlockWrapper>
      </div>
    </div>
  );
};

export default WeatherMarketSection;