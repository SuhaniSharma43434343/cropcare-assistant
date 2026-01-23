import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, IndianRupee, TrendingUp, TrendingDown, MapPin, RefreshCw } from 'lucide-react';
import MobileLayout from '../components/layout/MobileLayout';

const MarketRates = () => {
  const navigate = useNavigate();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMarketRates = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/mandi/prices?limit=50`
      );
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const result = await response.json();
      if (result.success && result.data.records) {
        const processedRates = result.data.records.map((record, index) => ({
          id: index,
          crop: record.commodity || 'Unknown',
          price: record.modal_price || record.min_price || record.max_price || 'N/A',
          market: record.market || record.district || 'Unknown',
          state: record.state || 'Unknown',
          change: Math.floor(Math.random() * 20) - 10 // Mock change
        }));
        setRates(processedRates);
      }
    } catch (error) {
      console.error('Market rates error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketRates();
  }, []);

  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen bg-gray-50 safe-area-top">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-white shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-6 h-6" />
            </button>
          <h1 className="text-lg font-semibold">Market Rates</h1>
          </div>
          <button
            onClick={() => fetchMarketRates(true)}
            disabled={refreshing}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="px-4 py-4">
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-24"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-16"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {rates.map((rate) => (
                <div key={rate.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {rate.crop.length > 20 ? rate.crop.substring(0, 20) + '...' : rate.crop}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{rate.market}, {rate.state}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <IndianRupee className="w-4 h-4 text-gray-600" />
                        <span className="text-lg font-bold text-gray-900">
                          {rate.price !== 'N/A' ? rate.price : '---'}
                        </span>
                        <span className="text-sm text-gray-500">/qtl</span>
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        rate.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {rate.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{rate.change >= 0 ? '+' : ''}{rate.change}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default MarketRates;