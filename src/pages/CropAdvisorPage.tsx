import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  RefreshCw, 
  ArrowRight, 
  Layers, 
  Thermometer, 
  Droplets, 
  CloudRain, 
  SlidersHorizontal,
  Clock,
  Award
} from 'lucide-react';
import { CropRecommendationResult } from '../types';

export const CropAdvisorPage: React.FC = () => {
  // Input parameters
  const [n, setN] = useState<number>(115);
  const [p, setP] = useState<number>(55);
  const [k, setK] = useState<number>(45);
  const [ph, setPh] = useState<number>(6.8);
  const [temp, setTemp] = useState<number>(22);
  const [humidity, setHumidity] = useState<number>(65);
  const [rainfall, setRainfall] = useState<number>(75);
  const [location, setLocation] = useState<string>('Punjab');
  const [soilType, setSoilType] = useState<string>('Alluvial Loam');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropRecommendationResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/crop-recommendation/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.warn('Failed to fetch history', e);
    }
  };

  const handleRecommend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/crop-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          n,
          p,
          k,
          ph,
          temp,
          humidity,
          rainfall,
          location,
          soilType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze crop recommendation');
      }

      setResult(data);
      fetchHistory();
    } catch (err: any) {
      setError(err.message || 'Error generating recommendation');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: 'wheat' | 'rice' | 'cotton' | 'mustard') => {
    if (preset === 'wheat') {
      setN(120); setP(55); setK(40); setPh(6.8); setTemp(21); setHumidity(60); setRainfall(65);
      setLocation('Punjab'); setSoilType('Alluvial Loam');
    } else if (preset === 'rice') {
      setN(105); setP(45); setK(50); setPh(6.2); setTemp(29); setHumidity(84); setRainfall(210);
      setLocation('West Bengal'); setSoilType('Clayey Loam');
    } else if (preset === 'cotton') {
      setN(135); setP(60); setK(70); setPh(7.4); setTemp(31); setHumidity(62); setRainfall(80);
      setLocation('Gujarat'); setSoilType('Black Cotton Soil');
    } else if (preset === 'mustard') {
      setN(75); setP(35); setK(35); setPh(7.2); setTemp(17); setHumidity(48); setRainfall(40);
      setLocation('Rajasthan'); setSoilType('Sandy Loam');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            AI & ICAR Agronomic Engine
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Intelligent Crop Recommendation Portal
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Enter your laboratory soil test readings (N-P-K & pH) along with seasonal weather conditions. 
            Our intelligent model calculates the highest-yielding crop with complete agronomic rationale.
          </p>
        </div>

        {/* Quick Testing Presets */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 w-full md:w-auto">
          <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
            1-Click Demo Scenarios:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => applyPreset('wheat')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-emerald-500 hover:bg-emerald-50 text-[11px] font-bold text-stone-800 text-left cursor-pointer transition-all"
            >
              🌾 Punjab Rabi Wheat
            </button>
            <button
              onClick={() => applyPreset('rice')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-emerald-500 hover:bg-emerald-50 text-[11px] font-bold text-stone-800 text-left cursor-pointer transition-all"
            >
              🍚 Bengal Kharif Rice
            </button>
            <button
              onClick={() => applyPreset('cotton')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-emerald-500 hover:bg-emerald-50 text-[11px] font-bold text-stone-800 text-left cursor-pointer transition-all"
            >
              🌱 Gujarat Cotton
            </button>
            <button
              onClick={() => applyPreset('mustard')}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-emerald-500 hover:bg-emerald-50 text-[11px] font-bold text-stone-800 text-left cursor-pointer transition-all"
            >
              🌼 Rajasthan Mustard
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-heading font-black text-sm text-stone-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              Soil & Climate Parameters
            </h3>
            <span className="text-[11px] text-stone-500">Soil Health Card Values</span>
          </div>

          <form onSubmit={handleRecommend} className="space-y-4">
            {/* Soil N-P-K */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Soil Macronutrients (kg / Hectare)
              </label>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[11px] font-medium text-stone-600 block mb-1">Nitrogen (N)</span>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={n}
                    onChange={(e) => setN(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                  <span className="text-[9px] text-stone-400">Typical: 80-140</span>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-stone-600 block mb-1">Phosphorus (P)</span>
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={p}
                    onChange={(e) => setP(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                  <span className="text-[9px] text-stone-400">Typical: 30-70</span>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-stone-600 block mb-1">Potassium (K)</span>
                  <input
                    type="number"
                    min="0"
                    max="250"
                    value={k}
                    onChange={(e) => setK(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                  <span className="text-[9px] text-stone-400">Typical: 35-80</span>
                </div>
              </div>
            </div>

            {/* Soil pH Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-700 uppercase tracking-wider">Soil Reaction (pH):</span>
                <span className={`font-black px-2 py-0.5 rounded text-xs ${
                  ph < 6.0 ? 'bg-amber-100 text-amber-800' : ph > 7.5 ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {ph.toFixed(1)} ({ph < 6.0 ? 'Acidic' : ph > 7.5 ? 'Alkaline' : 'Neutral'})
                </span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-medium">
                <span>4.5 (Acidic)</span>
                <span>6.5 - 7.5 (Optimal)</span>
                <span>9.0 (Alkaline)</span>
              </div>
            </div>

            {/* Environmental Factors */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Local Climate Conditions
              </label>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[11px] font-medium text-stone-600 block mb-1 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-orange-500" /> Temp (°C)
                  </span>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={temp}
                    onChange={(e) => setTemp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-medium text-stone-600 block mb-1 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" /> Humidity (%)
                  </span>
                  <input
                    type="number"
                    min="15"
                    max="100"
                    value={humidity}
                    onChange={(e) => setHumidity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-medium text-stone-600 block mb-1 flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-sky-500" /> Rain (mm)
                  </span>
                  <input
                    type="number"
                    min="10"
                    max="400"
                    value={rainfall}
                    onChange={(e) => setRainfall(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Location & Soil Type */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Region / State
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden bg-white"
                >
                  <option value="Punjab">Punjab / Haryana Plains</option>
                  <option value="Uttar Pradesh">Gangetic Plains (UP/Bihar)</option>
                  <option value="Madhya Pradesh">Central India (MP)</option>
                  <option value="Maharashtra">Deccan Plateau (Maharashtra)</option>
                  <option value="Gujarat">Western Arid (Gujarat/Rajasthan)</option>
                  <option value="Karnataka">Southern Peninsula</option>
                  <option value="West Bengal">Eastern Delta (Bengal/Assam)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                  Soil Texture
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden bg-white"
                >
                  <option value="Alluvial Loam">Alluvial Loam</option>
                  <option value="Black Cotton Soil">Black Cotton Soil (Regur)</option>
                  <option value="Red Sandy Loam">Red Sandy Loam</option>
                  <option value="Clayey Loam">Clayey Heavy Soil</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-black text-sm shadow-md shadow-emerald-800/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Agronomic AI Evaluation...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Calculate Optimal Crop
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output & Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6 animate-in fade-in duration-200">
              {/* Primary Recommended Crop Card */}
              <div className="bg-linear-to-br from-emerald-900 to-green-800 text-white rounded-2xl p-6 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-emerald-700/60">
                  <span className="px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-300" /> Primary AI Recommendation
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black">
                    {result.confidence} Agronomic Match
                  </span>
                </div>

                <div className="pt-4 space-y-2">
                  <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
                    {result.primaryCrop}
                  </h2>
                  <div className="flex flex-wrap gap-3 text-xs text-emerald-100 font-semibold pt-1">
                    <span>🗓️ Season: {result.cropDetails?.season || 'Rabi'}</span>
                    <span>⏱️ Duration: {result.cropDetails?.duration || '120 days'}</span>
                    <span>📈 Yield: {result.cropDetails?.yield || '22 Qtl/Acre'}</span>
                  </div>
                </div>
              </div>

              {/* In-depth Agronomic Rationale */}
              <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
                <h4 className="font-heading font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  Scientific Agronomic Rationale & Guidance
                </h4>
                <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {result.rationale}
                </div>
              </div>

              {/* Alternative Rotational Crops */}
              <div>
                <h4 className="font-heading font-bold text-sm text-stone-900 mb-3">
                  Alternative Crop Rotation Choices
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.alternatives?.map((alt, idx) => (
                    <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-stone-900">{alt.name}</p>
                        <p className="text-xs text-stone-500">Season: {alt.season} • {alt.yield}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                        {alt.match} Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soil Conditioning Note */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Soil Reaction Status: {result.soilHealthStatus}.</span>{' '}
                  For optimal root nutrient uptake, ensure organic matter (compost or farmyard manure) is mixed 15 days prior to sowing.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-stone-200 shadow-xs text-center space-y-4 flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-stone-900">
                Ready for AI Crop Advisory
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md">
                Configure your soil and weather values on the left, or click one of the preset scenarios 
                to see how KrishiMitra generates tailored crop recommendations.
              </p>
              <button
                onClick={() => handleRecommend()}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Run Recommendation with Current Values
              </button>
            </div>
          )}

          {/* Past Recommendations History */}
          {history.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
                <h4 className="font-heading font-bold text-sm text-stone-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stone-500" />
                  Recent Advisory History
                </h4>
                <span className="text-xs text-stone-400">Stored in SQLite</span>
              </div>
              <div className="divide-y divide-stone-100">
                {history.slice(0, 3).map((h, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-stone-900">{h.recommended_crop}</p>
                      <p className="text-[11px] text-stone-500">
                        N: {h.n} | P: {h.p} | K: {h.k} | pH: {h.ph} | {h.created_at?.slice(0, 10)}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-stone-100 font-bold text-stone-700 text-[11px]">
                      {h.confidence}% Match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
