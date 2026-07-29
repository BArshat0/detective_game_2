import React from 'react';
import { Shield, Clock, ChevronRight, Cpu } from 'lucide-react';
import { Case } from '../types';

interface CaseCardProps {
  caseData: Case;
  onSelect: () => void;
  isCompleted: boolean;
  isCustom?: boolean;
}

const CaseCardComponent = ({ caseData, onSelect, isCompleted, isCustom = false }: CaseCardProps) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'EASY': return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
      case 'MED': return 'text-amber-300 border-amber-400/30 bg-amber-950/40';
      case 'HIGH': return 'text-orange-400 border-orange-500/30 bg-orange-950/40';
      default: return 'text-slate-300 border-slate-700 bg-slate-900/40';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HIGH PRIORITY': return 'text-orange-400 border-orange-500/30 bg-orange-950/50';
      case 'URGENT': return 'text-rose-400 border-rose-500/30 bg-rose-950/50';
      case 'NEW': return 'text-amber-300 border-amber-400/30 bg-amber-950/50';
      default: return 'text-slate-300 border-slate-700 bg-slate-800/50';
    }
  };

  return (
    <div 
      onClick={onSelect}
      id={`case-card-${caseData.id}`}
      className="group relative flex flex-col justify-between overflow-hidden glass-panel bg-slate-900/65 hover:bg-slate-900/85 border border-white/15 hover:border-[#ff8533]/50 cursor-pointer text-white p-5 rounded-[28px] transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-[#ff8533]/10"
    >
      <div>
        {/* Top Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] font-mono tracking-wider font-bold uppercase px-2.5 py-0.5 rounded-full border ${getStatusColor(caseData.status)}`}>
            {caseData.status}
          </span>
          <div className="flex gap-1.5 items-center">
            {isCustom && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-500/30 font-bold">
                <Cpu className="h-2.5 w-2.5" />
                AI ARCHITECT
              </span>
            )}
            {isCompleted ? (
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                RESOLVED
              </span>
            ) : (
              <span className="text-[10px] font-mono text-[#ff8533] bg-[#ff8533]/10 px-2 py-0.5 rounded-full border border-[#ff8533]/30 font-bold">
                OPEN CASE
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail Image */}
        <div className="relative w-full h-44 rounded-[20px] overflow-hidden bg-slate-950 mb-4 border border-white/10 group-hover:border-white/20 transition-colors">
          <img 
            src={caseData.imageUrl} 
            alt={caseData.title}
            loading="lazy"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${getDifficultyColor(caseData.difficulty)}`}>
              {caseData.difficulty}
            </span>
          </div>
        </div>

        {/* Role/Category text and Title */}
        <span className="text-xs font-mono tracking-wider text-[#ff8533] font-bold uppercase block mb-1">
          {caseData.tag}
        </span>
        <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#ffb829] transition-colors duration-250 tracking-tight line-clamp-1 mb-2">
          {caseData.title}
        </h3>

        {/* Intro */}
        <p className="text-[13px] text-slate-300 line-clamp-3 mb-4 leading-relaxed font-sans">
          {caseData.introduction}
        </p>
      </div>

      {/* Footer statistics */}
      <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-auto text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>{caseData.timeLimit}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-slate-400" />
          <span>{caseData.threatActor.split(' ')[0]}</span>
        </div>
        <div className="flex items-center text-[#ff8533] font-bold group-hover:translate-x-1 transition-transform duration-200">
          <span className="text-[12px] tracking-wide">INVESTIGATE</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};

export const CaseCard = React.memo(CaseCardComponent);
export default CaseCard;

