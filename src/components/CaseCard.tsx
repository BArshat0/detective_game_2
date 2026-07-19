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
      case 'EASY': return 'text-[#15846e] border-[#15846e]/30';
      case 'MED': return 'text-[#ffb829] border-[#ffb829]/30';
      case 'HIGH': return 'text-[#8052ff] border-[#8052ff]/30';
      default: return 'text-[#bdbdbd] border-transparent';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HIGH PRIORITY': return 'text-[#8052ff] border-[#8052ff]/30';
      case 'URGENT': return 'text-[#15846e] border-[#15846e]/30';
      case 'NEW': return 'text-[#ffb829] border-[#ffb829]/30';
      default: return 'text-[#9a9a9a] border-transparent';
    }
  };

  return (
    <div 
      onClick={onSelect}
      id={`case-card-${caseData.id}`}
      className="group relative flex flex-col justify-between overflow-hidden bg-transparent cursor-pointer text-white py-4 transition-all duration-300 hover:translate-y-[-4px]"
    >
      <div>
        {/* Top Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full border ${getStatusColor(caseData.status)}`}>
            {caseData.status}
          </span>
          <div className="flex gap-1.5 items-center">
            {isCustom && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-[#8052ff] px-1.5 py-0.5 rounded-full border border-[#8052ff]/30">
                <Cpu className="h-2.5 w-2.5" />
                AI ARCHITECT
              </span>
            )}
            {isCompleted ? (
              <span className="text-[10px] font-mono text-[#15846e] px-1.5 py-0.5 rounded-full border border-[#15846e]/30">
                RESOLVED
              </span>
            ) : (
              <span className="text-[10px] font-mono text-[#8052ff] px-1.5 py-0.5 rounded-full border border-[#8052ff]/30">
                OPEN CASE
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail Image with 24px border-radius */}
        <div className="relative w-full h-40 rounded-[24px] overflow-hidden bg-black mb-4 border border-white/5">
          <img 
            src={caseData.imageUrl} 
            alt={caseData.title}
            loading="lazy"
            className="w-full h-full object-cover opacity-70 group-hover:opacity-95 transition-opacity duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border bg-black/60 backdrop-blur-sm ${getDifficultyColor(caseData.difficulty)}`}>
              {caseData.difficulty}
            </span>
          </div>
        </div>

        {/* Role/Category text and Title */}
        <span className="text-xs font-mono tracking-wider text-[#8052ff] uppercase block mb-1">
          {caseData.tag}
        </span>
        <h3 className="font-sans text-xl font-normal text-white group-hover:text-[#8052ff] transition-colors duration-250 tracking-[-0.48px] line-clamp-1 mb-2">
          {caseData.title}
        </h3>

        {/* Intro */}
        <p className="text-[14px] text-[#bdbdbd] line-clamp-3 mb-4 leading-relaxed font-light">
          {caseData.introduction}
        </p>
      </div>

      {/* Footer statistics */}
      <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-auto text-[11px] font-mono text-[#9a9a9a]">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#9a9a9a]" />
          <span>{caseData.timeLimit}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-[#9a9a9a]" />
          <span>{caseData.threatActor.split(' ')[0]}</span>
        </div>
        <div className="flex items-center text-[#ffb829] font-semibold group-hover:translate-x-1 transition-transform duration-200">
          <span className="text-[12px]">INVESTIGATE</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </div>
  );
};

export const CaseCard = React.memo(CaseCardComponent);
export default CaseCard;
