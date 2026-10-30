import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Landmark, 
  TrendingUp, 
  MessageSquare, 
  Leaf, 
  Trash2, 
  CheckCircle2, 
  Plus, 
  Search,
  Database
} from 'lucide-react';
import { User } from '../types';

interface AdminPageProps {
  currentUser: User | null;
}

export const AdminPage: React.FC<AdminPageProps> = ({ currentUser }) => {
  const [stats, setStats] = useState<any>(null);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'farmers' | 'schemes' | 'mandi' | 'consultations'>('farmers');
  const [loading, setLoading] = useState(false);

  // New scheme form
  const [schemeTitle, setSchemeTitle] = useState('');
  const [schemeHindi, setSchemeHindi] = useState('');
  const [schemeCategory, setSchemeCategory] = useState('Central Subsidy');
  const [schemeBenefit, setSchemeBenefit] = useState('');
  const [schemeEligibility, setSchemeEligibility] = useState('');
  const [schemeUrl, setSchemeUrl] = useState('');
  const [schemeBadge, setSchemeBadge] = useState('New Initiative');

  // Consultation tickets
  const [consultationList, setConsultationList] = useState<any[]>([]);
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    fetchAdminData();
    fetchConsultations();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.metrics);
        setFarmers(data.farmers);
      }
    } catch (e) {
      console.warn('Failed to load admin stats', e);
    }
  };

  const fetchConsultations = async () => {
    try {
      const res = await fetch('/api/consultations');
      if (res.ok) {
        const data = await res.json();
        setConsultationList(data);
      }
    } catch (e) {
      console.warn('Failed to load consultations', e);
    }
  };

  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeTitle || !schemeBenefit || !schemeEligibility) return;

    try {
      const res = await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: schemeTitle,
          hindi_title: schemeHindi,
          category: schemeCategory,
          financial_assistance: schemeBenefit,
          eligibility: schemeEligibility,
          official_url: schemeUrl || 'https://agricoop.gov.in',
          badge: schemeBadge,
        }),
      });

      if (res.ok) {
        alert('New scheme published successfully!');
        setSchemeTitle('');
        setSchemeBenefit('');
        setSchemeEligibility('');
        fetchAdminData();
      }
    } catch (e) {
      console.warn('Failed to add scheme', e);
    }
  };

  const handleReplyConsultation = async (id: string) => {
    const answer = replyText[id];
    if (!answer) return;

    try {
      const res = await fetch(`/api/consultations/${id}/answer`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expert_name: currentUser?.name || 'Dr. Priya Sharma (ICAR Director)',
          answer,
        }),
      });

      if (res.ok) {
        fetchConsultations();
        setReplyText((prev) => ({ ...prev, [id]: '' }));
      }
    } catch (e) {
      console.warn('Answer reply error', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            Administrative Portal & System Control
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            KrishiMitra Administration Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl">
            Monitor registered farmers, manage APMC mandi pricing records, publish agricultural 
            schemes, and review specialist consultation tickets.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-stone-800 border border-stone-700 text-xs font-bold text-stone-300">
          Role: <span className="text-emerald-400 uppercase">{currentUser?.role || 'Admin'}</span>
        </div>
      </div>

      {/* Metrics Banner */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-600" /> Farmers
            </span>
            <p className="text-2xl font-black text-stone-900 mt-1">
              {stats.totalFarmers.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Queries
            </span>
            <p className="text-2xl font-black text-stone-900 mt-1">
              {stats.totalConsultations}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Resolved Rate
            </span>
            <p className="text-2xl font-black text-emerald-800 mt-1">
              {stats.resolvedRate}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5 text-teal-600" /> Active Schemes
            </span>
            <p className="text-2xl font-black text-stone-900 mt-1">
              {stats.activeSchemes}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-purple-600" /> Mandi Hubs
            </span>
            <p className="text-2xl font-black text-stone-900 mt-1">
              {stats.mandiCovered}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-xs text-stone-500 font-semibold flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-amber-600" /> AI Diagnoses
            </span>
            <p className="text-2xl font-black text-stone-900 mt-1">
              {stats.aiRecommendationsMade}
            </p>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('farmers')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'farmers' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Farmers Directory ({farmers.length})
        </button>
        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'schemes' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Landmark className="w-4 h-4" />
          Publish Government Scheme
        </button>
        <button
          onClick={() => setActiveTab('consultations')}
          className={`px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'consultations' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Farmer Consultations ({consultationList.length})
        </button>
      </div>

      {/* Tab 1: Farmers Directory */}
      {activeTab === 'farmers' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-heading font-black text-base text-stone-900">
              Registered Farmer Accounts & Landholdings
            </h3>
            <span className="text-xs text-stone-500">Live SQLite Database Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 font-bold rounded-l-lg">Farmer Name</th>
                  <th className="p-3 font-bold">Email & Contact</th>
                  <th className="p-3 font-bold">Location</th>
                  <th className="p-3 font-bold">Farm Land</th>
                  <th className="p-3 font-bold">Soil Type</th>
                  <th className="p-3 font-bold rounded-r-lg">Primary Crops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {farmers.map((f) => (
                  <tr key={f.id} className="hover:bg-stone-50/70">
                    <td className="p-3 font-bold text-stone-900">{f.name}</td>
                    <td className="p-3 text-stone-600">
                      <p>{f.email}</p>
                      <p className="text-[11px] text-stone-400">{f.phone || 'N/A'}</p>
                    </td>
                    <td className="p-3 text-stone-800">
                      {f.district ? `${f.district}, ${f.state}` : f.state || 'Punjab'}
                    </td>
                    <td className="p-3 font-bold text-emerald-800">
                      {f.land_size_acres ? `${f.land_size_acres} Acres` : '5 Acres'}
                    </td>
                    <td className="p-3 text-stone-600">{f.soil_type || 'Alluvial'}</td>
                    <td className="p-3 text-stone-600">{f.primary_crops || 'Wheat, Rice'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Publish Scheme */}
      {activeTab === 'schemes' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs max-w-2xl mx-auto space-y-5">
          <h3 className="font-heading font-black text-lg text-stone-900 pb-3 border-b border-stone-100">
            Publish New Government Agricultural Scheme
          </h3>

          <form onSubmit={handleCreateScheme} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                Scheme Title
              </label>
              <input
                type="text"
                required
                value={schemeTitle}
                onChange={(e) => setSchemeTitle(e.target.value)}
                placeholder="e.g. Sub-Mission on Agricultural Mechanization (SMAM)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                  Hindi Title
                </label>
                <input
                  type="text"
                  value={schemeHindi}
                  onChange={(e) => setSchemeHindi(e.target.value)}
                  placeholder="कृषि यंत्रीकरण योजना"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                  Category Badge
                </label>
                <input
                  type="text"
                  value={schemeBadge}
                  onChange={(e) => setSchemeBadge(e.target.value)}
                  placeholder="Machinery Subsidy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                Financial Assistance & Subsidy Details
              </label>
              <textarea
                rows={2}
                required
                value={schemeBenefit}
                onChange={(e) => setSchemeBenefit(e.target.value)}
                placeholder="Up to 40% - 50% subsidy on procurement of tractors, rotavators, and laser land levelers."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                Eligibility Requirements
              </label>
              <textarea
                rows={2}
                required
                value={schemeEligibility}
                onChange={(e) => setSchemeEligibility(e.target.value)}
                placeholder="Individual farmers, Custom Hiring Centres, and FPOs registered on the portal."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                Official Portal Link
              </label>
              <input
                type="url"
                value={schemeUrl}
                onChange={(e) => setSchemeUrl(e.target.value)}
                placeholder="https://agrimachinery.nic.in"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
            >
              Publish Scheme on Portal
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Consultations Responder */}
      {activeTab === 'consultations' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-heading font-black text-base text-stone-900">
              Farmer Consultation Tickets & Direct Responses
            </h3>
            <span className="text-xs text-stone-500">Official Agronomist Reply Center</span>
          </div>

          <div className="space-y-5">
            {consultationList.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {item.crop_type}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 mt-1">
                      {item.subject}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Farmer: {item.farmer_name} ({item.farmer_phone}) • {item.farmer_state}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    item.status === 'answered' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status === 'answered' ? 'Answered' : 'Awaiting Reply'}
                  </span>
                </div>

                <p className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200">
                  {item.question}
                </p>

                {item.answer && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                    <span className="font-bold">Current Response ({item.expert_name}):</span>
                    <p className="mt-0.5">{item.answer}</p>
                  </div>
                )}

                <div className="pt-2 flex gap-2">
                  <input
                    type="text"
                    value={replyText[item.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [item.id]: e.target.value })}
                    placeholder="Type official agronomist recommendation or amendment..."
                    className="flex-1 px-3 py-2 bg-white rounded-xl border border-stone-300 text-xs"
                  />
                  <button
                    onClick={() => handleReplyConsultation(item.id)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Send Answer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
