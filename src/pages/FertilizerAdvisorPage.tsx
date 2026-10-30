import React, { useState } from 'react';
import { 
  FlaskConical, 
  Droplets, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Layers, 
  RefreshCw, 
  ShieldCheck,
  TrendingDown,
  Info
} from 'lucide-react';

export const FertilizerAdvisorPage: React.FC = () => {
  const [cropName, setCropName] = useState('Wheat');
  const [landAreaAcres, setLandAreaAcres] = useState(5);
  const [irrigationType, setIrrigationType] = useState('Drip');
  const [soilFertility, setSoilFertility] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const calculateAdvisory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/fertilizer-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName,
          landAreaAcres,
          irrigationType,
          soilFertility,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.warn('Calculation error', err);
    } finally {
      setLoading(false);
    }
  };

  // Run on first load
  React.useEffect(() => {
    calculateAdvisory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
            <FlaskConical className="w-3.5 h-3.5" />
            Precision Nutrient & Irrigation Management
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Fertilizer Dosage & Water Management Advisor
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Calculate exact 50kg bag quantities of Urea, DAP, and Potash for your farm acreage. 
            Prevent over-fertilization, reduce input costs, and schedule optimal crop irrigation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
          <h3 className="font-heading font-black text-sm text-stone-900 pb-3 border-b border-stone-100">
            Field Configuration
          </h3>

          <form onSubmit={calculateAdvisory} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                Select Cultivated Crop
              </label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-semibold text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Basmati Rice">Basmati Rice (धान / चावल)</option>
                <option value="Cotton">Cotton (कपास)</option>
                <option value="Mustard">Mustard (सरसों)</option>
                <option value="Maize">Maize (मक्का)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Potato">Potato (आलू)</option>
                <option value="Sugarcane">Sugarcane (गन्ना)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                Field Size (Acres)
              </label>
              <input
                type="number"
                min="0.5"
                max="500"
                step="0.5"
                value={landAreaAcres}
                onChange={(e) => setLandAreaAcres(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">1 Acre ≈ 0.404 Hectare</span>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                Soil Fertility Base (From Soil Test)
              </label>
              <select
                value={soilFertility}
                onChange={(e) => setSoilFertility(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-semibold text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="Medium">Medium Fertility (Standard Soil)</option>
                <option value="Low">Low Fertility (Requires +20% Fertilizer)</option>
                <option value="High">High Fertility (Requires -15% Fertilizer)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                Irrigation System
              </label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-semibold text-sm bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="Drip">💧 Drip / Micro Irrigation (45% Water Saving)</option>
                <option value="Sprinkler">🌧️ Sprinkler System (25% Water Saving)</option>
                <option value="Flood">🌊 Flood / Furrow Irrigation (Traditional)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md shadow-emerald-800/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Calculating Dosage...
                </>
              ) : (
                <>
                  <FlaskConical className="w-4 h-4" />
                  Calculate Fertilizer & Water Schedule
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results & Schedules (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {result && (
            <>
              {/* Bag Requirements Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <h3 className="font-heading font-black text-base text-stone-900">
                    Required 50kg Fertilizer Bags for {result.landAreaAcres} Acres of {result.cropName}
                  </h3>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    Balanced N-P-K Ratio
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
                      Urea (46% N)
                    </span>
                    <p className="text-3xl font-black text-emerald-950 mt-1">
                      {result.ureaBags}{' '}
                      <span className="text-xs font-normal text-stone-600">Bags (50kg)</span>
                    </p>
                    <p className="text-[11px] text-emerald-800 mt-1">
                      Primary nitrogen source for vegetative foliage growth.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                      DAP (18-46-0)
                    </span>
                    <p className="text-3xl font-black text-amber-950 mt-1">
                      {result.dapBags}{' '}
                      <span className="text-xs font-normal text-stone-600">Bags (50kg)</span>
                    </p>
                    <p className="text-[11px] text-amber-800 mt-1">
                      Phosphorus rich for deep root anchoring & tillering.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200">
                    <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                      MOP (Potash 60%)
                    </span>
                    <p className="text-3xl font-black text-blue-950 mt-1">
                      {result.mopBags}{' '}
                      <span className="text-xs font-normal text-stone-600">Bags (50kg)</span>
                    </p>
                    <p className="text-[11px] text-blue-800 mt-1">
                      Strengthens crop stalk and builds disease resistance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Split Application Schedule */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-heading font-black text-base text-stone-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  Split Fertilizer Application Timeline
                </h3>

                <div className="space-y-3">
                  {result.schedule?.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-900">
                          Step {idx + 1}: {item.stage}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-stone-800">
                        {item.fertilizers}
                      </p>
                      <p className="text-xs text-stone-600">
                        {item.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Irrigation Schedule Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-heading font-black text-base text-stone-900 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    Water Management & Irrigation Schedule
                  </h3>
                  <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                    Method: {result.irrigation?.method}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                    <p className="text-xs text-stone-500 font-semibold">Weekly Water Requirement</p>
                    <p className="text-2xl font-black text-stone-900 mt-1">
                      {result.irrigation?.waterNeededWeeklyLiters.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-stone-500">Liters</span>
                    </p>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Frequency: <strong className="text-stone-900">{result.irrigation?.recommendedIntervalDays}</strong>
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-700" /> Water Conservation Efficiency
                      </span>
                      <p className="text-xs text-emerald-950 mt-1 leading-relaxed">
                        {result.irrigation?.waterSavingNote}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Agronomist Rule:</strong> Never apply nitrogen top-dressing when foliage is wet from morning dew, as fertilizer granules cling to leaves causing chemical burn. Always irrigate immediately after Urea application.
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
