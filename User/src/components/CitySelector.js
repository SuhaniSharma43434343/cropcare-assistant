import { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

const CitySelector = ({ selectedCity, onCityChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lon: longitude });
            onCityChange('current-location', { lat: latitude, lon: longitude });
          } catch (error) {
            console.error('Error getting location:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className="relative mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{selectedCity === 'current-location' ? 'Current Location' : selectedCity}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 max-h-60 overflow-y-auto">
          <button
            onClick={() => {
              getCurrentLocation();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-100"
          >
            📍 Use Current Location
          </button>
          
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => {
                onCityChange(city);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm transition-colors ${
                selectedCity === city ? 'bg-green-50 text-green-700' : 'text-gray-700'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySelector;