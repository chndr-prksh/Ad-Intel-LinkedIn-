
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { AdAnalysis, BrandIntelligence } from '../types';
import { Trophy, Target, Zap, AlertCircle } from 'lucide-react';

interface DashboardProps {
  ads: AdAnalysis[];
  brandIntel: BrandIntelligence | null;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC<DashboardProps> = ({ ads, brandIntel }) => {
  if (ads.length === 0 || !brandIntel) return null;

  const radarData = [
    { subject: 'Professionalism', value: ads.reduce((acc, ad) => acc + ad.metrics.professionalism, 0) / ads.length },
    { subject: 'Creativity', value: ads.reduce((acc, ad) => acc + ad.metrics.creativity, 0) / ads.length },
    { subject: 'Clarity', value: ads.reduce((acc, ad) => acc + ad.metrics.clarity, 0) / ads.length },
    { subject: 'Impact', value: ads.reduce((acc, ad) => acc + ad.strategy.ctaEffectiveness, 0) / ads.length },
  ];

  const toneData = ads.reduce((acc: any[], ad) => {
    const existing = acc.find(item => item.name === ad.strategy.tone);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: ad.strategy.tone, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-8 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* High Level Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
          <Trophy className="w-6 h-6 text-yellow-500 mb-2" />
          <span className="text-[10px] font-black text-slate-400 uppercase">Branding Rank</span>
          <span className="text-2xl font-black text-slate-800">A+</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
          <Target className="w-6 h-6 text-indigo-500 mb-2" />
          <span className="text-[10px] font-black text-slate-400 uppercase">Ad Intensity</span>
          <span className="text-2xl font-black text-slate-800">{brandIntel.adFrequencyScore}/10</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
          <Zap className="w-6 h-6 text-emerald-500 mb-2" />
          <span className="text-[10px] font-black text-slate-400 uppercase">Market Voice</span>
          <span className="text-2xl font-black text-slate-800">{brandIntel.overallTone}</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
          <AlertCircle className="w-6 h-6 text-orange-500 mb-2" />
          <span className="text-[10px] font-black text-slate-400 uppercase">Top Theme</span>
          <span className="text-lg font-black text-slate-800 truncate w-full px-2">
            {brandIntel.commonThemes[0] || 'Efficiency'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Competitor Landscape */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            Competitive Benchmarking
            <span className="text-xs font-normal text-slate-400">(versus {brandIntel.brandName})</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th className="pb-3 px-2">Competitor Brand</th>
                  <th className="pb-3 px-2">Market Estimate</th>
                  <th className="pb-3 px-2">Core Strength</th>
                  <th className="pb-3 px-2">Strategic Weakness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {brandIntel.competitorComparison.map((comp, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-2 font-bold text-slate-700">{comp.brand}</td>
                    <td className="py-4 px-2 text-slate-500">{comp.marketShareEstimate}</td>
                    <td className="py-4 px-2">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                        {comp.strength}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-slate-400 italic text-xs">{comp.weakness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strategy Radar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Strategy Signature</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                <Radar
                  name={brandIntel.brandName}
                  dataKey="value"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2">Message Themes</h4>
            <div className="flex flex-wrap gap-2">
              {brandIntel.commonThemes.map((theme, i) => (
                <span key={i} className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
