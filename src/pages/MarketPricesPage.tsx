import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Plus, 
  Filter, 
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { MandiPrice } from '../types';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface MarketPricesPageProps {
  isAdmin?: boolean;
}

export const MarketPricesPage: React.FC<MarketPricesPageProps> = ({ isAdmin = false }) => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form for admin add price
  const [newCrop, setNewCrop] = useState('Wheat');
  const [newMandi, setNewMandi] = useState('');
  const [newState, setNewState] = useState('Punjab');
  const [newDistrict, setNewDistrict] = useState('');
  const [newMin, setNewMin] = useState(2200);
  const [newMax, setNewMax] = useState(2450);
  const [newModal, setNewModal] = useState(2380);
  const [newArrival, setNewArrival] = useState(500);
  const [newTrend, setNewTrend] = useState<'up' | 'down' | 'stable'>('up');

  useEffect(() => {
    fetchPrices();
    fetchTrends();
  }, [selectedCrop, selectedState]);

  const fetchPrices = async () => {
    try {
      let url = '/api/market-prices?';
      if (selectedCrop !== 'All') url += `crop=${encodeURIComponent(selectedCrop)}&`;
      if (selectedState !== 'All') url += `state=${encodeURIComponent(selectedState)}&`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPrices(data);
      }
    } catch (e) {
      console.warn('Failed to load prices', e);
    }
  };

  const fetchTrends = async () => {
    try {
      const res = await fetch('/api/market-prices/trends');
      if (res.ok) {
        const data = await res.json();
        setTrends(data);
      }
    } catch (e) {
      console.warn('Failed to load price trends', e);
    }
  };

  const handleAddPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/market-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop_name: newCrop,
          market_name: newMandi,
          state: newState,
          district: newDistrict || newMandi,
          min_price: newMin,
          max_price: newMax,
          modal_price: newModal,
          arrival_tonnes: newArrival,
          trend: newTrend,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        fetchPrices();
      }
    } catch (e) {
      console.warn('Failed to add price', e);
    }
  };

  const filteredPrices = prices.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.crop_name.toLowerCase().includes(q) ||
      p.market_name.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            National Mandi & e-NAM Tracker
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Real-Time APMC Mandi Price Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Track daily minimum, maximum, and modal wholesale prices (₹/Quintal) across major 
            Indian agricultural marketing terminals to secure top market value for your harvest.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Update / Record Mandi Rate
        </button>
      </div>

      {/* Historical Trend Chart (Recharts) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
          <div>
            <h3 className="font-heading font-black text-base text-stone-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              6-Month Price Trend Analysis (₹ per Quintal)
            </h3>
            <p className="text-xs text-stone-500">
              Comparative benchmark across staple crops & oilseeds
            </p>
          </div>
          <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
            MSP & APMC Modal Averages
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="Cotton" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Mustard" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Soybean" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="BasmatiRice" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Wheat" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Maize" stroke="#0891b2" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop, mandi, or state..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Crop Filter */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-stone-50 px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-800 cursor-pointer focus:outline-hidden"
            >
              <option value="All">All Crops</option>
              <option value="Wheat">Wheat</option>
              <option value="Rice">Basmati Rice</option>
              <option value="Cotton">Cotton</option>
              <option value="Mustard">Mustard</option>
              <option value="Soybean">Soybean</option>
              <option value="Maize">Maize</option>
              <option value="Chana">Chickpea (Chana)</option>
              <option value="Onion">Onion</option>
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
            </select>
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
            <MapPin className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-stone-50 px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-800 cursor-pointer focus:outline-hidden"
            >
              <option value="All">All States</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-stone-500 font-semibold">
          Showing {filteredPrices.length} live APMC markets
        </span>
      </div>

      {/* Mandi Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPrices.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-heading font-black text-lg text-stone-900">
                    {item.crop_name}
                  </h4>
                  <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {item.market_name}, {item.district} ({item.state})
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                  item.trend === 'up'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.trend === 'down'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-stone-100 text-stone-700'
                }`}>
                  {item.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-emerald-700" />}
                  {item.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-red-700" />}
                  {item.trend === 'stable' && <Minus className="w-3 h-3 text-stone-500" />}
                  {item.trend === 'up' ? 'Rising' : item.trend === 'down' ? 'Falling' : 'Stable'}
                </span>
              </div>

              {/* Price Details */}
              <div className="mt-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    Modal (Trading) Price
                  </p>
                  <p className="text-2xl font-black text-stone-900 mt-0.5">
                    ₹{item.modal_price.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-stone-500">/ Qtl</span>
                  </p>
                </div>
                <div className="text-right text-[11px] text-stone-600">
                  <p>Min: <span className="font-bold">₹{item.min_price}</span></p>
                  <p>Max: <span className="font-bold">₹{item.max_price}</span></p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="font-medium">Arrival: <strong className="text-stone-800">{item.arrival_tonnes} Tonnes</strong></span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {item.price_date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Mandi Price Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-heading font-black text-lg text-stone-900">
              Record / Update APMC Mandi Rate
            </h3>
            <p className="text-xs text-stone-500">
              Add new live daily price discovery for farmers in this market.
            </p>

            <form onSubmit={handleAddPrice} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">Crop Name</label>
                <input
                  type="text"
                  required
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">Mandi Name</label>
                  <input
                    type="text"
                    required
                    value={newMandi}
                    onChange={(e) => setNewMandi(e.target.value)}
                    placeholder="e.g. Khanna Mandi"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">Min (₹)</label>
                  <input
                    type="number"
                    value={newMin}
                    onChange={(e) => setNewMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">Max (₹)</label>
                  <input
                    type="number"
                    value={newMax}
                    onChange={(e) => setNewMax(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">Modal (₹)</label>
                  <input
                    type="number"
                    value={newModal}
                    onChange={(e) => setNewModal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">Daily Arrival (Tonnes)</label>
                  <input
                    type="number"
                    value={newArrival}
                    onChange={(e) => setNewArrival(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">Market Trend</label>
                  <select
                    value={newTrend}
                    onChange={(e) => setNewTrend(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                  >
                    <option value="up">▲ Rising / Bullish</option>
                    <option value="stable">▬ Stable</option>
                    <option value="down">▼ Falling / Bearish</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                >
                  Save Mandi Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
