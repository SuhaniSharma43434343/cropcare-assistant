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
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      
      const { latitude, longitude } = position.coords;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/weather/forecast/coords/${latitude}/${longitude}`);
      const data = await response.json();
      
      if (data.success) {
        setWeather(data.data);
        setWeatherError(null);
      } else {
        setWeatherError('Weather unavailable');
      }
    } catch (err) {
      setWeatherError('Location access denied');
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchMarketPrices = async () => {
    try {
      setMarketLoading(true);
      const response = await fetch(
        'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000011dff195781234c2349ed51abe8c46981&format=json&limit=20'
      );
      
      if (!response.ok) throw new Error('Market API failed');
      
      const data = await response.json();
      if (data.records && data.records.length > 0) {
        const riceData = data.records.find(r => r.commodity && r.commodity.toLowerCase().includes('rice')) || data.records[0];
        setMarket({
          crop: riceData.commodity || 'Rice',
          price: riceData.modal_price || riceData.min_price || riceData.max_price || 'N/A',
          market: riceData.market || riceData.district || 'Unknown',
          change: Math.floor(Math.random() * 10) - 5 // Mock percentage change
        });
        setMarketError(null);
      } else {
        setMarketError('No market data');
      }
    } catch (err) {
      setMarketError('Market data unavailable');
    } finally {
      setMarketLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    fetchMarketPrices();
    const weatherInterval = setInterval(fetchWeather, 600000); // 10 minutes
    const marketInterval = setInterval(fetchMarketPrices, 900000); // 15 minutes
    return () => {
      clearInterval(weatherInterval);
      clearInterval(marketInterval);
    };
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
          <AlertCircle className="w-8 h-8" />
          <div>
            <p className="font-medium text-sm">Service Unavailable</p>
            <p className="text-xs">{error}</p>
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