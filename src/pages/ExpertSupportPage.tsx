import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  UserCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  ShieldCheck, 
  Award,
  Filter,
  Plus
} from 'lucide-react';
import { ExpertConsultation, User } from '../types';

interface ExpertSupportPageProps {
  currentUser: User | null;
}

export const ExpertSupportPage: React.FC<ExpertSupportPageProps> = ({ currentUser }) => {
  const [consultations, setConsultations] = useState<ExpertConsultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCropFilter, setSelectedCropFilter] = useState('all');

  // Form State
  const [farmerName, setFarmerName] = useState(currentUser?.name || 'Ramesh Kumar Patel');
  const [farmerPhone, setFarmerPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [farmerState, setFarmerState] = useState(currentUser?.state || 'Punjab');
  const [cropType, setCropType] = useState('Wheat');
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('urgent');

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchConsultations();
  }, [selectedCropFilter]);

  const fetchConsultations = async () => {
    try {
      let url = '/api/consultations?';
      if (selectedCropFilter !== 'all') url += `crop=${encodeURIComponent(selectedCropFilter)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setConsultations(data);
      }
    } catch (e) {
      console.warn('Failed to load consultations', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !question) return;

    setSubmitting(true);
    setSubmitSuccess(null);

    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_name: farmerName,
          farmer_phone: farmerPhone,
          farmer_state: farmerState,
          crop_type: cropType,
          subject,
          question,
          priority,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess('Your consultation query was submitted and reviewed by the AI Agronomist Cell!');
        setSubject('');
        setQuestion('');
        fetchConsultations();
      }
    } catch (e) {
      console.warn('Consultation submission error', e);
    } finally {
      setSubmitting(false);
    }
  };

  const experts = [
    {
      name: 'Dr. Anand Deshmukh',
      role: 'Chief Plant Pathologist',
      institution: 'ICAR - Central Crop Research Institute',
      experience: '22 Years Experience',
      specialty: 'Fungal leaf rust, Blights, and Integrated Pest Management (IPM)',
      avatar: 'AD',
      rating: '4.9/5 (1,240 queries resolved)',
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'Senior Agronomist & Soil Chemist',
      institution: 'IARI - Indian Agricultural Research Institute',
      experience: '16 Years Experience',
      specialty: 'Soil health cards, balanced NPK dosing, micro-irrigation scheduling',
      avatar: 'PS',
      rating: '4.9/5 (980 queries resolved)',
    },
    {
      name: 'Dr. Harish Reddy',
      role: 'Entomologist & Biocontrol Scientist',
      institution: 'TNAU & National Institute of Plant Health',
      experience: '14 Years Experience',
      specialty: 'Cotton bollworm, Fall Armyworm, pheromone traps & bio-pesticides',
      avatar: 'HR',
      rating: '4.8/5 (820 queries resolved)',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            Krishi Vigyan Kendra Helpline
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Agricultural Expert Consultation & Support
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Get personalized field guidance from university agronomists and plant doctors. 
            Receive immediate AI diagnosis while your ticket is routed to regional agricultural scientists.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-emerald-950 uppercase">24x7 Kisan Helpline</p>
            <p className="text-sm font-black text-emerald-800">1800-180-1551 (Toll-Free)</p>
          </div>
        </div>
      </div>

      {/* Verified Experts Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {experts.map((exp, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {exp.avatar}
                </div>
                <div>
                  <h4 className="font-heading font-black text-base text-stone-900 flex items-center gap-1.5">
                    {exp.name}
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </h4>
                  <p className="text-xs font-semibold text-emerald-800">{exp.role}</p>
                </div>
              </div>

              <div className="text-xs text-stone-600 space-y-1">
                <p className="font-medium text-stone-700">{exp.institution}</p>
                <p className="text-stone-500">{exp.experience}</p>
                <p className="pt-1 text-stone-800"><strong className="text-stone-900">Focus:</strong> {exp.specialty}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="font-bold text-amber-600 flex items-center gap-1">
                ★ {exp.rating}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px]">
                Available
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Submission Form & Forum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-heading font-black text-base text-stone-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-700" />
              Ask an Agricultural Question
            </h3>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              AI Instant Assisted
            </span>
          </div>

          {submitSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>{submitSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                  Farmer Name
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                  Crop Under Cultivation
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Basmati Rice">Basmati Rice (धान)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Maize">Maize (मक्का)</option>
                  <option value="Potato">Potato (आलू)</option>
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Sugarcane">Sugarcane (गन्ना)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                  Urgency Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                >
                  <option value="urgent">🚨 Urgent (Within 2 Hours)</option>
                  <option value="normal">Normal Routine Advisory</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                Subject / Core Problem
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Yellowing of lower leaves during booting stage"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-700 uppercase block mb-1">
                Detailed Field Symptoms & Observation
              </label>
              <textarea
                required
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Mention crop age, soil watering frequency, observed insects or leaf spots..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-800/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting Question...' : 'Submit to Expert Cell'}
            </button>
          </form>
        </div>

        {/* Previous Consultations & Forum (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="font-heading font-black text-lg text-stone-900">
              Community Q&A and Agronomist Advisory Archive
            </h3>
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={selectedCropFilter}
                onChange={(e) => setSelectedCropFilter(e.target.value)}
                className="bg-white border border-stone-200 px-2.5 py-1 rounded-lg text-xs font-bold"
              >
                <option value="all">All Crops</option>
                <option value="Wheat">Wheat</option>
                <option value="Cotton">Cotton</option>
                <option value="Rice">Rice</option>
                <option value="Mustard">Mustard</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {consultations.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        {c.crop_type}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        c.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {c.priority === 'urgent' ? 'Urgent Advisory' : 'Routine'}
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-base text-stone-900 mt-1">
                      {c.subject}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Asked by <strong className="text-stone-800">{c.farmer_name}</strong> ({c.farmer_state || 'India'}) • {c.submitted_at?.slice(0, 16)}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold flex items-center gap-1 border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    Answered
                  </span>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                  <p className="font-bold text-stone-800 mb-0.5">Farmer Query:</p>
                  "{c.question}"
                </div>

                {/* Expert Answer */}
                {c.answer && (
                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">
                        DR
                      </div>
                      <span className="text-xs font-bold text-emerald-950">
                        {c.expert_name || 'Dr. Anand Deshmukh (Plant Pathologist)'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                      {c.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
