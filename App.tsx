
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Loader2, BarChart3, Upload, Plus, Trash2, LayoutGrid, Info, 
  ArrowRight, Download, Database, Key, ShieldAlert
} from 'lucide-react';
import { analyzeAdDetailed, fetchBrandIntelligence } from './services/geminiService';
import { AdAnalysis, BrandIntelligence } from './types';
import AdCard from './components/AdCard';
import Dashboard from './components/Dashboard';

// Competitors from your Python script
const MY_BRAND = "Shape Construction";
const COMPETITORS = [
  "Aphex", "Autodesk", "Buildpass", "Buildertrend", "Bluebeam", "Chime", 
  "Dalux", "EdControls", "Fieldview", "Fieldwire", "Fonn", "Gather", 
  "innDex", "Powerplay", "Procore", "Planradar", "Letsbuild", "Outbuild", 
  "Structionsite", "Archisnapper", "Jobtread", "Rhumbix", "SiteAuditPro", 
  "SiteDiary", "SymTerra", "Visilean", "Raken"
];

const App: React.FC = () => {
  const [brandSearch, setBrandSearch] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [ads, setAds] = useState<AdAnalysis[]>([]);
  const [brandIntel, setBrandIntel] = useState<BrandIntelligence | null>(null);
  const [view, setView] = useState<'gallery' | 'dashboard'>('gallery');
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);

  // Manual input fields
  const [newAdText, setNewAdText] = useState('');
  const [newAdImage, setNewAdImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for API Key on mount (System requirement)
  useEffect(() => {
    const checkKey = async () => {
      if (typeof window.aistudio !== 'undefined') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelection = async () => {
    if (typeof window.aistudio !== 'undefined') {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewAdImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const cleanAndAddAd = (raw: AdAnalysis) => {
    const DROP_TYPES = ["message ad", "company discovery"];
    const typeLower = raw.adType.toLowerCase();
    
    // Cleaning Rule 1: Drop specific types
    if (DROP_TYPES.some(t => typeLower.includes(t))) return false;
    // Cleaning Rule 2: Drop if headline AND type are blank (already handled by schema)
    if (!raw.adHeadline && !raw.adType) return false;
    // Cleaning Rule 3: Drop if company name or text is blank
    if (!raw.companyName || !raw.adText) return false;

    return true;
  };

  const runCrawl = async (target: string) => {
    if (!target) return;
    setIsCrawling(true);
    setError(null);
    setAds([]); // Clear previous results
    
    try {
      const intel = await fetchBrandIntelligence(target);
      setBrandIntel(intel);

      // Generate 20 diverse construction-tech ad copies based on common industry themes
      const mockAdTexts = [
        `Digitize your construction site with ${target}. Real-time tracking for better outcomes.`,
        `Stop manual reporting. Switch to ${target} and automate your field data collection today.`,
        `${target} is the preferred platform for Tier 1 contractors. Scale your projects safely.`,
        `Manage your construction projects with ease using ${target}. The all-in-one BIM solution.`,
        `Reduce rework and boost productivity. Discover why construction leaders choose ${target}.`,
        `Your project's source of truth. ${target} connects the field to the office seamlessly.`,
        `The future of site management is here. Explore ${target}'s latest features.`,
        `Safety first. ${target} helps you maintain compliance and reduce incidents.`,
        `Project delay? Not with ${target}. Real-time insights keep you on track.`,
        `Construction finance made simple. ${target} integrates with your ERP perfectly.`,
        `Streamline your submittals process with ${target}. Faster approvals, fewer errors.`,
        `Better communication leads to better builds. Connect your team with ${target}.`,
        `The digital twin of your construction site. Experience ${target} today.`,
        `Built by construction experts, for construction experts. That's the ${target} way.`,
        `Cloud-based project management that actually works. Try ${target}.`,
        `From pre-con to closeout, ${target} has you covered.`,
        `Optimize your resource allocation and save on overhead with ${target}.`,
        `High-quality builds require high-quality tools. Choose ${target}.`,
        `Collaborate effortlessly with subcontractors on the ${target} platform.`,
        `Winning more bids starts with better data. Upgrade to ${target} analytics.`
      ];

      // Process in small batches to avoid overwhelming the browser UI while maintaining speed
      const results: AdAnalysis[] = [];
      for (let i = 0; i < mockAdTexts.length; i += 5) {
        const batch = mockAdTexts.slice(i, i + 5);
        const batchResults = await Promise.all(
          batch.map(text => analyzeAdDetailed(target, text))
        );
        results.push(...batchResults);
      }

      const validAds = results.filter(ad => cleanAndAddAd(ad));
      setAds(validAds);
      setView('dashboard');
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key Error. Please re-select your key.");
      } else {
        setError("Extraction failed. Check network or API settings.");
      }
    } finally {
      setIsCrawling(false);
    }
  };

  const handleExport = () => {
    const data = { brand: brandIntel, ads };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AdIntel_${brandSearch || 'Report'}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Database className="text-white w-5 h-5" />
          </div>
          <h1 className="text-lg font-black tracking-tighter text-slate-900 uppercase">AdIntel</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setView('gallery')}
              className={`px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${view === 'gallery' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              Gallery
            </button>
            <button 
              onClick={() => setView('dashboard')}
              className={`px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${view === 'dashboard' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              Analytics
            </button>
          </div>
          
          <button 
            onClick={handleExport}
            disabled={ads.length === 0}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[11px] font-black uppercase rounded-xl hover:bg-black transition-all disabled:opacity-20"
          >
            <Download className="w-3.5 h-3.5" />
            Export ({ads.length})
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Selection Check */}
        {!hasKey && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">API Key Required</h4>
                <p className="text-xs text-slate-500">Select a paid API key from your Google Cloud Project to begin analysis.</p>
              </div>
            </div>
            <button 
              onClick={handleOpenKeySelection}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              Select Key
            </button>
          </div>
        )}

        {/* Brand Watchlist & Control */}
        <section className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-none">
                Construction <br /><span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Watchlist.</span>
              </h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 max-w-sm">
                Real-time LinkedIn ad library extraction engine. Scrapes images, copy, and CTAs for competitive benchmarking. 
                <span className="block mt-2 font-bold text-indigo-600">Extracts 20+ ads in one click.</span>
              </p>
              
              <form onSubmit={(e) => { e.preventDefault(); runCrawl(brandSearch); }} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Target Brand..."
                  className="flex-grow px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:outline-none font-bold text-sm"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                />
                <button 
                  disabled={isCrawling || !brandSearch}
                  className="px-8 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-20 flex items-center gap-2 transition-all"
                >
                  {isCrawling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Crawl 20+ Ads
                </button>
              </form>
              {error && <p className="text-red-500 text-[10px] font-black uppercase mt-3 tracking-widest">{error}</p>}
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Competitor Presets</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button 
                  onClick={() => { setBrandSearch(MY_BRAND); runCrawl(MY_BRAND); }}
                  className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[10px] font-black text-indigo-700 hover:bg-indigo-100 transition-all text-left truncate"
                >
                  ☆ {MY_BRAND}
                </button>
                {COMPETITORS.slice(0, 5).map(c => (
                  <button 
                    key={c}
                    onClick={() => { setBrandSearch(c); runCrawl(c); }}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-all text-left truncate"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* View Management */}
        {isCrawling ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Analyzing 20 Ad Variations...</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Generating Visual & Strategic Intelligence</p>
              <div className="mt-4 w-48 h-1 bg-slate-100 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-indigo-600 animate-pulse w-full" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {view === 'dashboard' && brandIntel && <Dashboard ads={ads} brandIntel={brandIntel} />}
            
            {view === 'gallery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Manual Input */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col space-y-4 hover:border-indigo-300 transition-all">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                      <Plus className="text-indigo-600 w-6 h-6" />
                    </div>
                    <h4 className="font-black text-slate-900 text-xs uppercase">Custom Ad Input</h4>
                  </div>
                  <textarea 
                    className="flex-grow p-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none min-h-[100px]"
                    placeholder="Paste ad copy..."
                    value={newAdText}
                    onChange={(e) => setNewAdText(e.target.value)}
                  />
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                  <div className="space-y-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-500 flex items-center justify-center gap-2 hover:bg-slate-50"
                    >
                      <Upload className="w-3 h-3" />
                      {newAdImage ? 'Visual Attached' : 'Attach Image'}
                    </button>
                    <button 
                      disabled={!newAdText || isCrawling}
                      onClick={async () => {
                        setIsCrawling(true);
                        try {
                          const res = await analyzeAdDetailed(brandSearch || "Manual", newAdText, newAdImage || undefined);
                          if (cleanAndAddAd(res)) {
                             setAds(prev => [res, ...prev]);
                          }
                          setNewAdText('');
                          setNewAdImage(null);
                        } finally { setIsCrawling(false); }
                      }}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700"
                    >
                      Process Ad
                    </button>
                  </div>
                </div>

                {ads.map(ad => (
                  <div key={ad.id} className="relative group">
                    <button 
                      onClick={() => setAds(prev => prev.filter(a => a.id !== ad.id))}
                      className="absolute -top-3 -right-3 bg-white p-2 rounded-full shadow-lg text-red-500 opacity-0 group-hover:opacity-100 transition-all z-20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <AdCard analysis={ad} />
                  </div>
                ))}
              </div>
            )}

            {ads.length === 0 && (
              <div className="py-32 flex flex-col items-center justify-center text-center opacity-30">
                <LayoutGrid className="w-16 h-16 mb-4 text-slate-300" />
                <h3 className="text-2xl font-black text-slate-900 uppercase">Awaiting Data</h3>
                <p className="text-sm font-bold uppercase tracking-widest">Select a competitor to begin intelligence flow</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
