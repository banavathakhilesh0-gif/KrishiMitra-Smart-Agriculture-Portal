import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  Compass, 
  Sun, 
  CloudRain, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Clock 
} from 'lucide-react';
import { WeatherData } from '../types';

export const WeatherPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('Ludhiana, Punjab');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const LOCATIONS = [
    'Ludhiana, Punjab',
    'Karnal, Haryana',
    'Nashik, Maharashtra',
    'Alwar, Rajasthan',
    'Indore, Madhya Pradesh',
    'Davangere, Karnataka',
    'Agra, Uttar Pradesh',
  ];

  useEffect(() => {
    fetchWeather(selectedLocation);
  }, [selectedLocation]);

  const fetchWeather = async (loc: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?location=${encodeURIComponent(loc)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (e) {
      console.warn('Weather fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header with Location Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
            <CloudSun className="w-3.5 h-3.5" />
            Gramin Krishi Mausam Sewa (GKMS)
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Agricultural Weather Forecast & Spray Advisory
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Real-time agro-meteorological observations, 7-day predictive weather forecasting, 
            and agricultural spray window recommendations.
          </p>
        </div>

        {/* Location Dropdown */}
        <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200 flex items-center gap-2 w-full md:w-auto">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-transparent text-xs sm:text-sm font-bold text-stone-900 focus:outline-hidden cursor-pointer"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {weather && (
        <>
          {/* Active Advisory Card */}
          <div className="bg-linear-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-md flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
                  Agrometeorological Alert
                </span>
                <span className="text-xs text-amber-100">{weather.alert?.title}</span>
              </div>
              <p className="text-sm font-medium leading-relaxed">
                {weather.alert?.message}
              </p>
            </div>
          </div>

          {/* Current Micro-Climate Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold">Air Temp</span>
                <Thermometer className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-2xl font-black text-stone-900 mt-2">
                {weather.temperatureC}°C
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {weather.tempMinC}° - {weather.tempMaxC}°C
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold">Relative Humidity</span>
                <Droplets className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-black text-stone-900 mt-2">
                {weather.humidity}%
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Dew point: {weather.dewPointC}°C
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold">Rain Probability</span>
                <CloudRain className="w-4 h-4 text-sky-500" />
              </div>
              <p className="text-2xl font-black text-stone-900 mt-2">
                {weather.rainfallProbability}%
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Dry spell active
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold">Wind Speed</span>
                <Wind className="w-4 h-4 text-teal-500" />
              </div>
              <p className="text-2xl font-black text-stone-900 mt-2">
                {weather.windSpeedKmh} <span className="text-xs font-normal">km/h</span>
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {weather.windDirection}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold">Soil Temp (5cm)</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-stone-900 mt-2">
                {weather.soilTemperatureC}°C
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Ideal for seed germ.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-stone-500">
                <span className="text-xs font-semibold">UV Index</span>
                <Sun className="w-4 h-4 text-yellow-500" />
              </div>
              <p className="text-2xl font-black text-stone-900 mt-2">
                {weather.uvIndex} <span className="text-xs font-normal">/ 11</span>
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Moderate Solar Rad.
              </p>
            </div>
          </div>

          {/* 7-Day Forecast & Daily Farming Advisories */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <h3 className="font-heading font-black text-lg text-stone-900">
                7-Day Agrometeorological Outlook & Operational Guide
              </h3>
              <span className="text-xs text-stone-500">Updated every 3 hours</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {weather.forecast.map((day, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    idx === 0
                      ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-stone-50/70 border-stone-200/80 hover:bg-stone-50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">{day.day}</span>
                      <span className="text-[10px] text-stone-500">{day.date}</span>
                    </div>

                    <div className="py-2 text-center">
                      <p className="text-xl font-black text-stone-900">
                        {day.tempMax}° <span className="text-xs text-stone-500 font-normal">/ {day.tempMin}°</span>
                      </p>
                      <p className="text-[11px] font-bold text-emerald-800 mt-0.5">
                        {day.condition}
                      </p>
                    </div>

                    <div className="space-y-1 text-[11px] text-stone-600 border-t border-stone-200/60 pt-2">
                      <p>Rain: <span className="font-bold text-stone-800">{day.rainfallMm} mm</span></p>
                      <p>Humidity: <span className="font-bold text-stone-800">{day.humidity}%</span></p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-200/60">
                    <p className="text-[10px] text-stone-700 leading-tight">
                      <span className="font-bold text-emerald-900">Action:</span> {day.advisory}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
