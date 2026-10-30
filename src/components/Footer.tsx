import React from 'react';
import { Sprout, Phone, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="font-heading font-black text-2xl text-white tracking-tight">
                Krishi<span className="text-emerald-400">Mitra</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Empowering Indian farmers through AI-driven crop advisory, leaf disease diagnostics,
              live mandi market price intelligence, weather forecasts, and government scheme linkages.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-semibold border border-emerald-800/80">
                <ShieldCheck className="w-3.5 h-3.5" />
                ICAR Agronomy Guidelines
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-semibold">
                Agmarknet / e-NAM Live Data
              </span>
            </div>
          </div>

          {/* Quick Modules */}
          <div>
            <h4 className="text-white font-heading font-bold text-sm uppercase tracking-wider mb-4">
              Smart Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('crop-advisor')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  AI Crop Recommendation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('disease-detection')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Plant Disease Scan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('market-prices')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Mandi Price Tracker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('weather')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Weather & Spray Advisory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('fertilizer-advisor')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Fertilizer & Water Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Schemes */}
          <div>
            <h4 className="text-white font-heading font-bold text-sm uppercase tracking-wider mb-4">
              Farmer Support
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('government-schemes')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Government Schemes (PM-KISAN)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('expert-support')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Ask Agri-Scientist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Soil Health & Field Records
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                  Admin & Extension Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Important Helpline Contacts */}
          <div>
            <h4 className="text-white font-heading font-bold text-sm uppercase tracking-wider mb-4">
              Emergency Helplines
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="bg-stone-800/90 p-2.5 rounded-lg border border-stone-700/80">
                <p className="text-[11px] text-stone-400 font-medium">Kisan Call Centre (24x7 Toll-Free)</p>
                <a href="tel:18001801551" className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 mt-0.5 hover:underline">
                  <Phone className="w-3.5 h-3.5" /> 1800-180-1551
                </a>
              </div>
              <div className="bg-stone-800/90 p-2.5 rounded-lg border border-stone-700/80">
                <p className="text-[11px] text-stone-400 font-medium">Crop Insurance Helpline (PMFBY)</p>
                <a href="tel:14447" className="text-amber-400 font-bold text-sm flex items-center gap-1.5 mt-0.5 hover:underline">
                  <Phone className="w-3.5 h-3.5" /> 14447
                </a>
              </div>
              <a 
                href="https://pmkisan.gov.in" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-emerald-400 transition-colors"
              >
                <span>PM-KISAN Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 KrishiMitra – Smart Agriculture Portal. Dedicated to Indian Farmers (जय जवान जय किसान).</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Built for sustainable Indian Agriculture</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-1" />
            <span>with modern AI technology</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
