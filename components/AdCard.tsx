
import React, { useState } from 'react';
import { AdAnalysis } from '../types';
import { ChevronDown, ChevronUp, Eye, MousePointer2, Type as TypeIcon, Info } from 'lucide-react';

interface AdCardProps {
  analysis: AdAnalysis;
}

const AdCard: React.FC<AdCardProps> = ({ analysis }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Ad Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-slate-900 text-sm leading-tight uppercase tracking-tight">
              {analysis.companyName || analysis.brandName}
            </h3>
            <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-black uppercase">
              {analysis.adType}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold truncate max-w-[150px]">{analysis.adHeadline || 'No Headline'}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Ad Copy */}
        <div className="relative">
          <p className={`text-xs text-slate-600 leading-relaxed italic ${!expanded ? 'line-clamp-3' : ''}`}>
            "{analysis.adText}"
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 gap-2 text-[9px] font-black uppercase tracking-wider">
          <div className="flex items-center gap-1.5 p-2 bg-indigo-50 text-indigo-700 rounded-lg">
            <MousePointer2 className="w-3 h-3" />
            <span>CTA: {analysis.cta}</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-slate-100 text-slate-600 rounded-lg">
            <Eye className="w-3 h-3" />
            <span>Imp: {analysis.impressions}</span>
          </div>
        </div>

        {/* Gemini Detailed Image Description */}
        <div className="border-t border-slate-100 pt-3">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="w-full flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
          >
            Visual Analysis
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          
          {expanded && (
            <div className="mt-3 space-y-3 animate-in fade-in duration-300">
              <div className="space-y-1">
                <span className="text-[9px] text-indigo-500 font-black uppercase">Theme</span>
                <p className="text-[11px] text-slate-700 bg-indigo-50/50 p-1.5 rounded border border-indigo-100/50">
                  {analysis.imageDescription.theme}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-indigo-500 font-black uppercase">Elements</span>
                <div className="flex flex-wrap gap-1">
                  {analysis.imageDescription.visualElements.map((el, i) => (
                    <span key={i} className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                      {el}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-indigo-500 font-black uppercase">Intent</span>
                <p className="text-[11px] text-slate-600 leading-tight">
                  {analysis.imageDescription.intent}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Performance Scores */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-1">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded uppercase">
              {analysis.strategy.tone}
            </span>
          </div>
          <div className="flex items-center gap-1 group relative">
            <Info className="w-3 h-3 text-slate-300" />
            <div className="absolute bottom-full right-0 mb-2 w-32 bg-slate-900 text-white text-[8px] p-2 rounded hidden group-hover:block z-50">
              Clarity: {analysis.metrics.clarity}/10
              <br />
              Creativity: {analysis.metrics.creativity}/10
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
