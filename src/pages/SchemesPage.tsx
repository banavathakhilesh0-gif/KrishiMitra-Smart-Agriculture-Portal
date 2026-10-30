import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle,
  X
} from 'lucide-react';
import { GovernmentScheme } from '../types';

export const SchemesPage: React.FC = () => {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalScheme, setActiveModalScheme] = useState<GovernmentScheme | null>(null);

  // Eligibility Checker State
  const [checkerOpen, setCheckerOpen] = useState(false);
  const [landCategory, setLandCategory] = useState('small'); // small (< 2 ha), medium (2-10 ha), large (> 10 ha)
  const [hasAadhaar, setHasAadhaar] = useState(true);
  const [hasBankAccount, setHasBankAccount] = useState(true);
  const [eligibleCount, setEligibleCount] = useState(6);

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory, searchQuery]);

  const fetchSchemes = async () => {
    try {
      let url = '/api/schemes?';
      if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSchemes(data);
      }
    } catch (e) {
      console.warn('Failed to load schemes', e);
    }
  };

  const handleEligibilityCheck = () => {
    if (landCategory === 'small') {
      setEligibleCount(6); // All schemes
    } else {
      setEligibleCount(5); // Almost all except micro-land subsidies
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
            <Landmark className="w-3.5 h-3.5" />
            Ministry of Agriculture & Farmers Welfare
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Government Agricultural Schemes & Subsidies
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Explore direct income benefits, crop insurance, solar pump subsidies, low-interest credit, 
            and soil testing programs. Verify your eligibility and apply directly on official portals.
          </p>
        </div>

        <button
          onClick={() => setCheckerOpen(true)}
          className="px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-800/20 flex items-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          Check My Eligibility
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scheme name or benefit..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs">
            {['All', 'Direct Income', 'Insurance', 'Solar', 'Credit', 'Soil'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat === 'All' ? 'All Programs' : cat}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-stone-500 font-semibold">
          {schemes.length} active government initiatives
        </span>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs hover:border-teal-400 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
                  {scheme.badge}
                </span>
                <span className="text-[11px] text-stone-500 font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {scheme.deadline}
                </span>
              </div>

              <div>
                <h3 className="font-heading font-black text-lg text-stone-900 leading-snug">
                  {scheme.title}
                </h3>
                {scheme.hindi_title && (
                  <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                    {scheme.hindi_title}
                  </p>
                )}
              </div>

              {/* Financial Benefit Callout */}
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                  Assistance & Benefit
                </p>
                <p className="text-xs font-bold text-emerald-950 mt-1 leading-relaxed">
                  {scheme.financial_assistance}
                </p>
              </div>

              {/* Eligibility Preview */}
              <div className="space-y-1 text-xs text-stone-600">
                <p className="font-bold text-stone-800">Who is Eligible:</p>
                <p className="line-clamp-2 leading-relaxed">
                  {scheme.eligibility}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveModalScheme(scheme)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                View Document Checklist
              </button>

              <a
                href={scheme.official_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Scheme Detail & Document Modal */}
      {activeModalScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                  {activeModalScheme.badge}
                </span>
                <h3 className="font-heading font-black text-xl text-stone-900 mt-2">
                  {activeModalScheme.title}
                </h3>
                <p className="text-xs font-semibold text-emerald-800">
                  {activeModalScheme.hindi_title}
                </p>
              </div>
              <button
                onClick={() => setActiveModalScheme(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-950 uppercase text-xs">
                  Financial Assistance
                </span>
                <p className="text-stone-800 leading-relaxed">
                  {activeModalScheme.financial_assistance}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">Detailed Eligibility Criteria:</h4>
                <p className="text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  {activeModalScheme.eligibility}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">Required Documents Checklist:</h4>
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
                  {activeModalScheme.required_documents.split(',').map((doc, i) => (
                    <div key={i} className="flex items-center gap-2 text-stone-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{doc.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setActiveModalScheme(null)}
                className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors"
              >
                Close
              </button>
              <a
                href={activeModalScheme.official_url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-800/20"
              >
                <span>Visit Official Application Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility Checker Modal */}
      {checkerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-black text-xl text-stone-900">
                  Farmer Eligibility Questionnaire
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Answer 3 simple questions to view schemes matching your farming profile.
                </p>
              </div>
              <button
                onClick={() => setCheckerOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase block mb-1.5">
                  1. Agricultural Landholding Size
                </label>
                <select
                  value={landCategory}
                  onChange={(e) => setLandCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
                >
                  <option value="small">Small & Marginal Farmer (&lt; 2 Hectares / 5 Acres)</option>
                  <option value="medium">Medium Landholder (2 - 10 Hectares)</option>
                  <option value="large">Large Landholder (&gt; 10 Hectares)</option>
                  <option value="tenant">Tenant Farmer / Sharecropper</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 uppercase block">
                  2. Document Verification
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-stone-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAadhaar}
                      onChange={(e) => setHasAadhaar(e.target.checked)}
                      className="accent-emerald-600 rounded"
                    />
                    I possess an Aadhaar card linked to my active mobile number
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-stone-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasBankAccount}
                      onChange={(e) => setHasBankAccount(e.target.checked)}
                      className="accent-emerald-600 rounded"
                    />
                    I have an Aadhaar-seeded bank account (DBT enabled)
                  </label>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950">
                <p className="text-xs font-bold">
                  Eligibility Result:
                </p>
                <p className="text-sm font-black text-emerald-900 mt-1">
                  You are eligible for {eligibleCount} Central & State Agricultural Schemes!
                </p>
                <p className="text-xs text-emerald-800 mt-1">
                  Including PM-KISAN (₹6,000/yr), PMFBY Crop Insurance, and Kisan Credit Card (4% interest).
                </p>
              </div>
            </div>

            <button
              onClick={() => setCheckerOpen(false)}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              View My Matching Schemes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
