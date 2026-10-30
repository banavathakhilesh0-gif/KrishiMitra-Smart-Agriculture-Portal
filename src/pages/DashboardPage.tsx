import React from 'react';
import { 
  User, 
  FarmerProfile, 
  SoilDetail, 
  WeatherData, 
  MandiPrice 
} from '../types';
import { 
  Sprout, 
  CloudSun, 
  TrendingUp, 
  FlaskConical, 
  Leaf, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Calendar,
  Layers,
  Thermometer,
  Droplets,
  Wind,
  PhoneCall
} from 'lucide-react';

interface DashboardPageProps {
  user: User;
  profile: FarmerProfile | null;
  soil: SoilDetail | null;
  weather: WeatherData | null;
  mandiPrices: MandiPrice[];
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  profile,
  soil,
  weather,
  mandiPrices,
  onNavigate,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-linear-to-r from-emerald-800 to-green-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Kisan Profile Active • {user.role === 'admin' ? 'Administrator' : 'Verified Farmer'}
            </span>
            <span className="text-xs text-emerald-200">
              ID: {user.id.slice(-6).toUpperCase()}
            </span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-white">
            Welcome back, {user.name}! 🌾
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Location: <span className="font-bold">{user.district || 'Ludhiana'}, {user.state || 'Punjab'}</span> • 
            Cultivating: <span className="font-bold">{profile?.primary_crops || 'Wheat, Rice, Mustard'}</span> • 
            Landholding: <span className="font-bold">{profile?.land_size_acres || 8.5} Acres</span>
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => onNavigate('crop-advisor')}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            AI Crop Advisor
          </button>
          <button
            onClick={() => onNavigate('disease-detection')}
            className="px-4 py-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-950 text-white font-bold text-xs border border-emerald-600/60 shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-300" />
            Scan Leaf Disease
          </button>
        </div>
      </div>

      {/* Weather & Active Alert Banner */}
      {weather && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Active Weather Advisory ({weather.location})
              </p>
              <p className="text-xs sm:text-sm text-amber-950 font-medium mt-0.5">
                {weather.alert?.message || 'Ideal weather window for Rabi crop preparation. Low humidity indicates safe chemical spray conditions.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('weather')}
            className="text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer"
          >
            Full 7-Day Forecast →
          </button>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Weather Details & Soil Health */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Weather Box */}
          {weather && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                    <CloudSun className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-sm text-stone-900">
                      Agro-Meteorological Forecast
                    </h3>
                    <p className="text-xs text-stone-500">{weather.location}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {weather.condition}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-stone-100">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                  <p className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-orange-500" /> Temperature
                  </p>
                  <p className="text-xl font-black text-stone-900 mt-1">
                    {weather.temperatureC}°C
                  </p>
                  <p className="text-[10px] text-stone-500">Min: {weather.tempMinC}°C | Max: {weather.tempMaxC}°C</p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                  <p className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" /> Humidity
                  </p>
                  <p className="text-xl font-black text-stone-900 mt-1">
                    {weather.humidity}%
                  </p>
                  <p className="text-[10px] text-stone-500">Dew Point: {weather.dewPointC}°C</p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                  <p className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                    <CloudSun className="w-3.5 h-3.5 text-sky-500" /> Rain Chance
                  </p>
                  <p className="text-xl font-black text-stone-900 mt-1">
                    {weather.rainfallProbability}%
                  </p>
                  <p className="text-[10px] text-stone-500">No heavy precipitation</p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                  <p className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-teal-500" /> Wind Speed
                  </p>
                  <p className="text-xl font-black text-stone-900 mt-1">
                    {weather.windSpeedKmh} <span className="text-xs text-stone-500 font-normal">km/h</span>
                  </p>
                  <p className="text-[10px] text-stone-500">NNW Gentle Breeze</p>
                </div>
              </div>

              {/* 3-Day Lookahead Strip */}
              <div className="pt-4 grid grid-cols-3 gap-3">
                {weather.forecast.slice(1, 4).map((f, idx) => (
                  <div key={idx} className="p-2.5 bg-stone-50 rounded-xl text-center">
                    <p className="text-xs font-bold text-stone-800">{f.day}</p>
                    <p className="text-sm font-black text-emerald-800 my-0.5">{f.tempMax}° / {f.tempMin}°</p>
                    <p className="text-[10px] text-stone-500 truncate">{f.condition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soil Health Card Box */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-sm text-stone-900">
                    Soil Health Card Summary
                  </h3>
                  <p className="text-xs text-stone-500">Last Laboratory Test: {soil?.test_date || '2026-09-15'}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {soil?.status || 'Good Fertility'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-stone-100">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                <span className="text-[11px] font-semibold text-stone-500">Nitrogen (N)</span>
                <p className="text-xl font-black text-stone-900 mt-1">{soil?.n || 142.5} <span className="text-xs text-stone-500 font-normal">kg/ha</span></p>
                <span className="inline-block px-1.5 py-0.5 mt-1 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  Moderate Deficit
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                <span className="text-[11px] font-semibold text-stone-500">Phosphorus (P)</span>
                <p className="text-xl font-black text-stone-900 mt-1">{soil?.p || 38.0} <span className="text-xs text-stone-500 font-normal">kg/ha</span></p>
                <span className="inline-block px-1.5 py-0.5 mt-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Optimal
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                <span className="text-[11px] font-semibold text-stone-500">Potassium (K)</span>
                <p className="text-xl font-black text-stone-900 mt-1">{soil?.k || 195.0} <span className="text-xs text-stone-500 font-normal">kg/ha</span></p>
                <span className="inline-block px-1.5 py-0.5 mt-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Adequate
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                <span className="text-[11px] font-semibold text-stone-500">Soil Reaction (pH)</span>
                <p className="text-xl font-black text-stone-900 mt-1">{soil?.ph || 6.8}</p>
                <span className="inline-block px-1.5 py-0.5 mt-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Ideal Neutral
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <p className="text-stone-600">
                <span className="font-bold text-stone-800">Agronomist Recommendation:</span> {soil?.notes || 'Add 2 bags of organic compost per acre before Rabi sowing. Apply Urea in two split doses.'}
              </p>
              <button
                onClick={() => onNavigate('fertilizer-advisor')}
                className="text-emerald-700 font-bold hover:underline shrink-0 flex items-center gap-1 cursor-pointer"
              >
                Fertilizer Dosage Calculator →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Mandi Prices & Quick Services */}
        <div className="space-y-8">
          {/* Live Market Watchlist */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-heading font-black text-sm text-stone-900">
                  Mandi Price Watchlist
                </h3>
              </div>
              <button
                onClick={() => onNavigate('market-prices')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {mandiPrices.slice(0, 5).map((price) => (
                <div key={price.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-stone-900">{price.crop_name}</p>
                    <p className="text-[11px] text-stone-500">{price.market_name}, {price.state}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-stone-900">₹{price.modal_price.toLocaleString('en-IN')}</p>
                    <span className={`text-[10px] font-bold ${
                      price.trend === 'up' ? 'text-emerald-600' : price.trend === 'down' ? 'text-red-600' : 'text-stone-500'
                    }`}>
                      {price.trend === 'up' ? '▲ Bullish' : price.trend === 'down' ? '▼ Bearish' : '▬ Stable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('market-prices')}
              className="w-full mt-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center block"
            >
              Open Full Mandi Price Intelligence
            </button>
          </div>

          {/* Kisan Support Card */}
          <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black text-base text-white">
                Need Instant Agricultural Support?
              </h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Connect directly with university agronomists, soil scientists, and pest controllers.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('expert-support')}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Ask An Agri-Scientist Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
