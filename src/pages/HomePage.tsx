import React from 'react';
import { 
  Sprout, 
  Leaf, 
  Activity, 
  TrendingUp, 
  CloudSun, 
  FlaskConical, 
  Landmark, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { MandiPrice } from '../types';

interface HomePageProps {
  onNavigate: (page: string) => void;
  mandiPrices: MandiPrice[];
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, mandiPrices }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-emerald-900 via-emerald-850 to-stone-900 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle patterned overlay */}
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80')` }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Next-Gen AI Crop Advisory & Farmer Support Portal</span>
              </div>

              <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight sm:leading-none">
                Smart Farming for <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-300 via-green-300 to-amber-200">
                  Bumper Harvests & Higher Income
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
                KrishiMitra combines ICAR agronomy guidelines with Gemini AI to provide 
                scientific crop recommendations, instant leaf disease diagnosis, live mandi prices, 
                weather alerts, and direct government scheme support.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('crop-advisor')}
                  className="px-6 py-3.5 rounded-xl bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-stone-950 font-black text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Leaf className="w-4 h-4 text-emerald-950" />
                  Get AI Crop Recommendation
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('disease-detection')}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Activity className="w-4 h-4 text-emerald-300" />
                  Scan Crop Leaf Disease
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-emerald-200/80">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verified Agronomist Advisory
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  e-NAM Mandi Integration
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  100% Free for All Farmers
                </span>
              </div>
            </div>

            {/* Hero Quick Diagnostic Card Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 text-stone-900 rounded-3xl p-6 shadow-2xl border border-white/20 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-sm text-stone-900">Live Farming Hub</h4>
                      <p className="text-[11px] text-stone-500">Kharif / Rabi Transition Season</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    Active Advisory
                  </span>
                </div>

                <div className="py-4 space-y-3">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-stone-500 font-medium">Ludhiana Mandi (Wheat)</p>
                      <p className="text-lg font-black text-stone-900">₹2,380 <span className="text-xs text-stone-500 font-normal">/ Qtl</span></p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +₹35/Qtl
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-stone-500 font-medium">Weather Alert</p>
                      <p className="text-xs font-bold text-stone-900">Clear Skies • Optimal Sowing Window</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-stone-900">28°C</p>
                      <p className="text-[11px] text-stone-500">Humidity 62%</p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-emerald-950 font-medium">
                      <span className="font-bold">Soil Tip:</span> Complete pre-sowing irrigation for Wheat HD 3086 this week for optimal crown root formation.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Enter My Farmer Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Mandi Price Ticker Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-4">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-stone-800">
                Live Mandi Price Ticker (Agmarknet)
              </span>
            </div>
            <button
              onClick={() => onNavigate('market-prices')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              View All Mandis <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {mandiPrices.slice(0, 6).map((item) => (
              <div 
                key={item.id}
                onClick={() => onNavigate('market-prices')}
                className="p-2.5 bg-stone-50/80 rounded-xl border border-stone-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-stone-900 truncate">{item.crop_name}</span>
                  <span className={`text-[10px] font-bold px-1 rounded ${
                    item.trend === 'up' ? 'text-emerald-700 bg-emerald-100' : item.trend === 'down' ? 'text-red-700 bg-red-100' : 'text-stone-600 bg-stone-200'
                  }`}>
                    {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '▬'}
                  </span>
                </div>
                <p className="text-sm font-black text-emerald-900 mt-1">
                  ₹{item.modal_price.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-stone-500 truncate">{item.market_name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agriculture Impact Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 text-center shadow-xs">
            <p className="font-heading font-black text-2xl sm:text-3xl text-emerald-800">1,420+</p>
            <p className="text-xs font-semibold text-stone-600 mt-1">Registered Farmers</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200 text-center shadow-xs">
            <p className="font-heading font-black text-2xl sm:text-3xl text-emerald-800">18,500+</p>
            <p className="text-xs font-semibold text-stone-600 mt-1">Acres Soil Guided</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200 text-center shadow-xs">
            <p className="font-heading font-black text-2xl sm:text-3xl text-emerald-800">96.8%</p>
            <p className="text-xs font-semibold text-stone-600 mt-1">Diagnostic Accuracy</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200 text-center shadow-xs">
            <p className="font-heading font-black text-2xl sm:text-3xl text-emerald-800">₹4.2 Cr+</p>
            <p className="text-xs font-semibold text-stone-600 mt-1">Govt Schemes Linked</p>
          </div>
        </div>
      </section>

      {/* Core Website Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Comprehensive Agri Ecosystem
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-stone-900">
            Everything a Modern Farmer Needs to Succeed
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            From precision soil health analysis to instant disease remedies and direct market linkages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div 
            onClick={() => onNavigate('crop-advisor')}
            className="group bg-white p-6 rounded-2xl border border-stone-200 hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-stone-900 group-hover:text-emerald-700 transition-colors">
                AI Crop Recommendation
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Input soil N-P-K, pH, temperature, humidity, and rainfall to discover the most profitable 
                crops for your exact micro-climate.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center text-xs font-bold text-emerald-700 group-hover:gap-2 transition-all">
              <span>Run Soil Analysis</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => onNavigate('disease-detection')}
            className="group bg-white p-6 rounded-2xl border border-stone-200 hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-stone-900 group-hover:text-emerald-700 transition-colors">
                Plant Disease Detection
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Snap or upload photos of infected leaves. Our AI classifies blight, rust, blast, and pests, 
                giving organic & chemical dosages instantly.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center text-xs font-bold text-emerald-700 group-hover:gap-2 transition-all">
              <span>Scan Leaf Image</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => onNavigate('market-prices')}
            className="group bg-white p-6 rounded-2xl border border-stone-200 hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-stone-900 group-hover:text-emerald-700 transition-colors">
                Mandi Price Tracker
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Stay updated on daily minimum, maximum, and modal mandi prices across APMC markets. 
                Compare historical charts to sell at peak rates.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center text-xs font-bold text-emerald-700 group-hover:gap-2 transition-all">
              <span>Track Mandi Prices</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => onNavigate('weather')}
            className="group bg-white p-6 rounded-2xl border border-stone-200 hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-stone-900 group-hover:text-emerald-700 transition-colors">
                Agri Weather Advisory
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                7-day localized forecast with rain probability, humidity, and expert spray windows 
                to avoid chemical runoff from unexpected showers.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center text-xs font-bold text-emerald-700 group-hover:gap-2 transition-all">
              <span>Check Weather Forecast</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 5 */}
          <div 
            onClick={() => onNavigate('fertilizer-advisor')}
            className="group bg-white p-6 rounded-2xl border border-stone-200 hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-stone-900 group-hover:text-emerald-700 transition-colors">
                Fertilizer & Irrigation Advisor
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Calculate exact 50kg bags of Urea, DAP, and MOP required for your acreage. 
                Schedule Drip or Sprinkler irrigation to cut water waste by 45%.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center text-xs font-bold text-emerald-700 group-hover:gap-2 transition-all">
              <span>Calculate Fertilizer Dose</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 6 */}
          <div 
            onClick={() => onNavigate('government-schemes')}
            className="group bg-white p-6 rounded-2xl border border-stone-200 hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-stone-900 group-hover:text-emerald-700 transition-colors">
                Government Schemes
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Access PM-KISAN, PMFBY crop insurance, PM-KUSUM solar subsidies, and Kisan Credit Card 
                with eligibility criteria and application links.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center text-xs font-bold text-emerald-700 group-hover:gap-2 transition-all">
              <span>Explore Schemes</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Testimonials */}
      <section className="bg-emerald-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-800">
              Real Impact In The Field
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl">
              Voices of Progressive Indian Farmers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-900/40 p-6 rounded-2xl border border-emerald-800/60 backdrop-blur-xs flex flex-col justify-between">
              <p className="text-sm text-emerald-100/90 italic leading-relaxed">
                "KrishiMitra's AI disease scanner saved my 8-acre tomato crop from early blight. 
                Within seconds of uploading a leaf photo, I got the exact Mancozeb spray dosage. 
                I avoided heavy losses and harvested 280 crates."
              </p>
              <div className="flex items-center gap-3 pt-6 border-t border-emerald-800/40 mt-4">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm text-white">
                  RP
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Ramesh Kumar Patel</h4>
                  <p className="text-xs text-emerald-300">Ludhiana, Punjab • 8.5 Acres</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900/40 p-6 rounded-2xl border border-emerald-800/60 backdrop-blur-xs flex flex-col justify-between">
              <p className="text-sm text-emerald-100/90 italic leading-relaxed">
                "The Mandi price tracker helped me hold my soybean harvest for 2 weeks until prices 
                at Indore APMC touched ₹4,750/Qtl. That alone added an extra ₹34,000 to my seasonal earnings."
              </p>
              <div className="flex items-center gap-3 pt-6 border-t border-emerald-800/40 mt-4">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm text-white">
                  SD
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Santosh Dhoble</h4>
                  <p className="text-xs text-emerald-300">Indore, MP • 12 Acres</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900/40 p-6 rounded-2xl border border-emerald-800/60 backdrop-blur-xs flex flex-col justify-between">
              <p className="text-sm text-emerald-100/90 italic leading-relaxed">
                "As a cotton farmer in Maharashtra, pink bollworm is our biggest headache. 
                The expert consultation response gave me biological pheromone trap guidance and 
                targeted spray schedule. Excellent support!"
              </p>
              <div className="flex items-center gap-3 pt-6 border-t border-emerald-800/40 mt-4">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm text-white">
                  VG
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Vijay Gaikwad</h4>
                  <p className="text-xs text-emerald-300">Latur, Maharashtra • 6 Acres</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-emerald-800 via-green-800 to-emerald-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h2 className="font-heading font-black text-2xl sm:text-3xl">
              Ready to Upgrade Your Agricultural Productivity?
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Join thousands of farmers making scientific decisions with KrishiMitra. 
              Get your custom crop recommendations and soil health guidance now.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('crop-advisor')}
              className="px-6 py-3.5 bg-white hover:bg-emerald-50 text-emerald-950 font-black text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Start Free Soil Analysis
            </button>
            <button
              onClick={() => onNavigate('expert-support')}
              className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl border border-emerald-500 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              Ask an Agronomist
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
