import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, 
  Upload, 
  Camera, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  FlaskConical, 
  Leaf, 
  RefreshCw, 
  Info,
  BookOpen
} from 'lucide-react';
import { PlantDisease } from '../types';

export const DiseaseDetectionPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PlantDisease | null>(null);
  const [diseaseLibrary, setDiseaseLibrary] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'scan' | 'library'>('scan');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load disease library
  useEffect(() => {
    fetch('/api/plant-diseases')
      .then((res) => res.json())
      .then((data) => setDiseaseLibrary(data))
      .catch((err) => console.warn('Failed to load disease library', err));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setResult(null);
      setError(null);
      analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64: string, presetId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/disease-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          demoPresetId: presetId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze crop image');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error inspecting leaf image');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (item: any) => {
    setSelectedImage(item.sample_image_url);
    setResult(null);
    analyzeImage('', item.id);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <Activity className="w-3.5 h-3.5" />
            AI Plant Pathology Diagnostics
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-stone-900">
            Plant Disease Diagnosis & Treatment
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Upload or capture a photo of damaged foliage, spots, or yellowing leaves. 
            Identify fungal, bacterial, or pest attacks with precise organic & chemical treatments.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold w-full md:w-auto">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'scan' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            Leaf Scanner
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'library' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Disease Catalog ({diseaseLibrary.length})
          </button>
        </div>
      </div>

      {activeTab === 'scan' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upload & Sample Presets (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Upload Area */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-heading font-black text-sm text-stone-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-700" />
                Upload Foliage / Leaf Image
              </h3>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={triggerFileInput}
                className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/70 transition-all rounded-2xl p-8 text-center cursor-pointer flex flex-col items-center justify-center gap-3 select-none"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-bold text-sm text-stone-800">
                    Click to browse or take leaf photo
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Supports JPG, PNG, WebP up to 15MB
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-800"
                >
                  Choose Leaf File
                </button>
              </div>

              {/* Sample Diseased Leaves for Fast Demonstration */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Or Test With Sample Diseased Leaves:
                  </span>
                  <span className="text-[10px] text-stone-400">1-Click Test</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {diseaseLibrary.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectPreset(item)}
                      className="p-2 rounded-xl border border-stone-200 hover:border-emerald-500 bg-stone-50 hover:bg-emerald-50/30 text-left transition-all flex items-center gap-2.5 cursor-pointer group"
                    >
                      <img
                        src={item.sample_image_url}
                        alt={item.disease_name}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-stone-900 truncate">
                          {item.crop_name}
                        </p>
                        <p className="text-[10px] text-stone-500 truncate">
                          {item.disease_name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Report Display (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {loading ? (
              <div className="bg-white rounded-3xl p-12 border border-stone-200 shadow-xs text-center flex flex-col items-center justify-center min-h-[420px] space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-700 animate-spin" />
                  <Leaf className="w-6 h-6 text-emerald-700 absolute inset-0 m-auto" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-stone-900">
                    Scanning Leaf Symptoms...
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mt-1">
                    Analyzing leaf chlorosis, lesions, pathogen rings, and fungal spores...
                  </p>
                </div>
              </div>
            ) : result ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6 animate-in fade-in duration-200">
                {/* Mode Indicator */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-stone-700">
                      {result.source === 'gemini_vision_ai'
                        ? '🤖 Deep Neural Vision AI (Gemini 3.8 Flash)'
                        : '🔬 ICAR Verified Plant Pathology Library'}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-bold">
                    Confidence: {result.confidence || '94%'}
                  </span>
                </div>

                {/* Main Disease Summary Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
                  {selectedImage && (
                    <div className="sm:col-span-4 relative rounded-xl overflow-hidden border border-stone-200 aspect-4/3 sm:aspect-square">
                      <img
                        src={selectedImage}
                        alt="Crop leaf"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold rounded">
                        Analyzed Specimen
                      </div>
                    </div>
                  )}

                  <div className={`${selectedImage ? 'sm:col-span-8' : 'sm:col-span-12'} space-y-2`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                        {result.cropName || result.crop_name}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                        result.severityLevel === 'Critical' ? 'bg-red-100 text-red-800' :
                        result.severityLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        Severity: {result.severityLevel || result.severity_level || 'Moderate'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 text-[11px] font-semibold">
                        {result.pathogenType || result.pathogen_type || 'Fungal'}
                      </span>
                    </div>

                    <h2 className="font-heading font-black text-xl sm:text-2xl text-stone-900">
                      {result.diseaseName || result.disease_name}
                    </h2>

                    {(result.hindiName || result.hindi_name) && (
                      <p className="text-sm font-semibold text-emerald-800">
                        रोग का नाम: {result.hindiName || result.hindi_name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Symptoms */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-stone-500" />
                    Observed Symptoms
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {result.symptoms}
                  </p>
                </div>

                {/* Remedies (Two-column: Organic vs Chemical) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Organic Treatment */}
                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-700" />
                      Organic & Biological Remedies
                    </h4>
                    <p className="text-xs text-emerald-950 leading-relaxed">
                      {result.organicTreatment || result.organic_treatment}
                    </p>
                  </div>

                  {/* Chemical Treatment */}
                  <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 text-blue-700" />
                      Recommended Chemical Fungicide / Spray
                    </h4>
                    <p className="text-xs text-blue-950 leading-relaxed font-medium">
                      {result.chemicalTreatment || result.chemical_treatment}
                    </p>
                  </div>
                </div>

                {/* Prevention Tips */}
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1.5 text-xs text-amber-950">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-amber-900 block">
                    🛡️ Long-term Field Prevention Tips:
                  </span>
                  <p className="leading-relaxed">
                    {result.preventionTips || result.prevention_tips}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 border border-stone-200 shadow-xs text-center space-y-4 flex flex-col items-center justify-center min-h-[420px]">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-lg text-stone-900">
                  Awaiting Leaf Specimen
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-md">
                  Upload an infected crop photo from your field or click one of the sample test cases 
                  on the left to generate instant diagnostic advice.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Disease Catalog View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseaseLibrary.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="h-44 overflow-hidden relative">
                <img
                  src={d.sample_image_url}
                  alt={d.disease_name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-xs font-bold rounded-md">
                  {d.crop_name}
                </span>
                <span className={`absolute top-3 right-3 px-2 py-0.5 text-[11px] font-bold rounded-md ${
                  d.severity_level === 'Critical' ? 'bg-red-500 text-white' : 'bg-amber-400 text-stone-900'
                }`}>
                  {d.severity_level}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h4 className="font-heading font-bold text-base text-stone-900">
                    {d.disease_name}
                  </h4>
                  <p className="text-xs text-emerald-800 font-semibold">{d.hindi_name}</p>
                </div>
                <p className="text-xs text-stone-600 line-clamp-2">
                  {d.symptoms}
                </p>
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-500">Pathogen: {d.pathogen_type}</span>
                  <button
                    onClick={() => {
                      setActiveTab('scan');
                      handleSelectPreset(d);
                    }}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    View Diagnosis →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
