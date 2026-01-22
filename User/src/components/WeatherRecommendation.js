import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Droplets, Thermometer, AlertTriangle, Sparkles } from 'lucide-react';

const WeatherRecommendation = () => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  };

  const fetchWeatherForecast = async (lat, lon) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/weather/forecast/coords/${lat}/${lon}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Weather API returned error');
      }

      return data.data;
    } catch (error) {
      console.error('Weather API error:', error);
      throw error;
    }
  };

  const analyzeWeatherAndGenerateRecommendation = (forecastData) => {
    // Backend returns forecast array with time, temperature, description, humidity
    const next48Hours = forecastData.forecast || [];

    if (next48Hours.length === 0) {
      return {
        title: "Weather Data Unavailable",
        description: "Unable to analyze weather conditions. Apply treatments during favorable conditions.",
        priority: "normal",
        icon: AlertTriangle
      };
    }

    // Analyze weather conditions
    const rainForecast = next48Hours.filter(item =>
      item.description && (
        item.description.toLowerCase().includes('rain') ||
        item.description.toLowerCase().includes('drizzle') ||
        item.description.toLowerCase().includes('thunderstorm') ||
        item.description.toLowerCase().includes('shower')
      )
    );

    const highHumidity = next48Hours.filter(item => item.humidity > 80);
    const lowTemp = next48Hours.filter(item => item.temperature < 15);
    const highTemp = next48Hours.filter(item => item.temperature > 35);

    // Generate recommendation based on conditions
    let title = "Weather-Based Recommendation";
    let description = "";
    let priority = "normal"; // normal, warning, urgent
    let icon = Sparkles;

    if (rainForecast.length > 0) {
      // Rain expected - analyze timing
      const firstRainIndex = next48Hours.findIndex(item =>
        item.description && (
          item.description.toLowerCase().includes('rain') ||
          item.description.toLowerCase().includes('drizzle') ||
          item.description.toLowerCase().includes('thunderstorm') ||
          item.description.toLowerCase().includes('shower')
        )
      );

      // Estimate hours until rain (assuming 3-hour intervals)
      const hoursUntilRain = firstRainIndex * 3;

      if (hoursUntilRain <= 6) {
        title = "⚠️ Urgent: Rain Expected Soon";
        description = `Rain expected in ${hoursUntilRain} hours. Apply treatment immediately or cover crops to prevent wash-off. Avoid spraying for the next 24 hours after rain.`;
        priority = "urgent";
        icon = CloudRain;
      } else if (hoursUntilRain <= 24) {
        title = "⏰ Rain Expected Tomorrow";
        description = `Rain forecast in ${hoursUntilRain} hours. Complete all treatments today for best absorption. Consider protective covers if rain is heavy.`;
        priority = "warning";
        icon = CloudRain;
      } else {
        title = "🌧️ Rain in Next 2 Days";
        description = `Rain expected in ${hoursUntilRain} hours. Plan treatments accordingly. Apply protectants 24-48 hours before expected rain.`;
        priority = "normal";
        icon = CloudRain;
      }
    } else if (highHumidity.length > next48Hours.length * 0.5) {
      // High humidity conditions
      title = "💧 High Humidity Alert";
      description = "High humidity may increase disease spread. Apply treatments early morning when humidity is lower. Consider fungicides if humidity persists.";
      priority = "warning";
      icon = Droplets;
    } else if (lowTemp.length > next48Hours.length * 0.3) {
      // Cold temperatures
      title = "❄️ Cold Weather Conditions";
      description = "Low temperatures may slow treatment absorption. Apply during warmer parts of the day. Some treatments may be less effective in cold weather.";
      priority = "normal";
      icon = Thermometer;
    } else if (highTemp.length > next48Hours.length * 0.3) {
      // Hot temperatures
      title = "☀️ Hot Weather Conditions";
      description = "High temperatures may cause rapid evaporation. Apply treatments early morning or late evening. Increase water volume for better coverage.";
      priority = "normal";
      icon = Sun;
    } else {
      // Favorable conditions
      title = "✅ Favorable Weather for Treatment";
      description = "Current weather conditions are ideal for treatment application. No rain expected in the next 48 hours. Apply treatments as recommended.";
      priority = "normal";
      icon = Sun;
    }

    return {
      title,
      description,
      priority,
      icon,
      weatherSummary: {
        nextRain: rainForecast.length > 0 ? rainForecast[0] : null,
        avgTemp: next48Hours.reduce((sum, item) => sum + item.temperature, 0) / next48Hours.length,
        avgHumidity: next48Hours.reduce((sum, item) => sum + item.humidity, 0) / next48Hours.length,
        conditions: next48Hours[0]?.description || 'Unknown'
      }
    };
  };

  useEffect(() => {
    const loadWeatherRecommendation = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user location
        const location = await getCurrentLocation();

        // Fetch weather forecast
        const forecastData = await fetchWeatherForecast(location.lat, location.lon);

        // Analyze and generate recommendation
        const recommendationData = analyzeWeatherAndGenerateRecommendation(forecastData);

        setRecommendation(recommendationData);

      } catch (error) {
        console.error('Weather recommendation error:', error);

        // Fallback recommendation
        setRecommendation({
          title: "Weather Data Unavailable",
          description: "Unable to fetch weather data. Apply treatments during favorable conditions and avoid spraying before rain. Monitor local weather forecasts.",
          priority: "normal",
          icon: AlertTriangle
        });
      } finally {
        setLoading(false);
      }
    };

    loadWeatherRecommendation();

    // Update every 30 minutes
    const interval = setInterval(loadWeatherRecommendation, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-info/10 border border-info/30 rounded-2xl p-4 mb-6"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-info/20 flex items-center justify-center flex-shrink-0">
            <div className="w-5 h-5 bg-info/30 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-4 bg-info/20 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-info/20 rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!recommendation) return null;

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-destructive/10 border-destructive/30';
      case 'warning':
        return 'bg-warning/10 border-warning/30';
      default:
        return 'bg-info/10 border-info/30';
    }
  };

  const getPriorityIconColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-destructive';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-info';
    }
  };

  const IconComponent = recommendation.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${getPriorityStyles(recommendation.priority)} border rounded-2xl p-4 mb-6`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          recommendation.priority === 'urgent' ? 'bg-destructive/20' :
          recommendation.priority === 'warning' ? 'bg-warning/20' : 'bg-info/20'
        }`}>
          <IconComponent className={`w-5 h-5 ${getPriorityIconColor(recommendation.priority)}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            {recommendation.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {recommendation.description}
          </p>
          {recommendation.weatherSummary && (
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3 h-3" />
                {Math.round(recommendation.weatherSummary.avgTemp)}°C
              </span>
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                {Math.round(recommendation.weatherSummary.avgHumidity)}%
              </span>
              {recommendation.weatherSummary.nextRain && (
                <span className="flex items-center gap-1">
                  <CloudRain className="w-3 h-3" />
                  Rain expected
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherRecommendation;