import React from 'react';
import { Eye, HelpCircle, CheckCircle2, Info } from 'lucide-react';
import { Case, Clue } from '../types';

interface ClueBoardProps {
  caseData: Case;
  discoveredClueIds: string[];
  discoveredEvidenceIds: string[];
  onSelectEvidence: (evidenceId: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function ClueBoard({
  caseData,
  discoveredClueIds,
  discoveredEvidenceIds,
  onSelectEvidence,
  onNavigateToTab
}: ClueBoardProps) {

  const isClueDiscovered = (clue: Clue) => {
    return discoveredClueIds.includes(clue.id) || (clue.evidenceId && discoveredEvidenceIds.includes(clue.evidenceId));
  };

  const handleInspectSource = (evidenceId?: string) => {
    if (!evidenceId) return;
    onSelectEvidence(evidenceId);
    onNavigateToTab('evidence');
  };

  const discoveredCount = caseData.clues.filter(isClueDiscovered).length;
  const totalCount = caseData.clues.length;
  const completionPercentage = Math.round((discoveredCount / totalCount) * 100) || 0;

  return (
    <div id="clue-board-container" className="flex flex-col h-full rounded-[24px] border border-white/10 bg-[#000000] p-5 text-white">
      
      {/* Header telemetry info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
        <div>
          <h4 className="text-nav-label text-white flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff8533] animate-ping" />
            Clue Association Board
          </h4>
          <p className="text-xs text-[#9a9a9a] font-mono mt-0.5">Map discovered social traces back to their original document evidence.</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 bg-black border border-white/10 rounded-[24px] px-4 py-2 min-w-[220px]">
          <div className="flex-1">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold mb-1.5">
              <span className="text-[#9a9a9a] tracking-wider">CLUES LINKED</span>
              <span className="text-[#ff8533] font-extrabold">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-white/5 border border-white/5 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#ff8533] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-mono font-extrabold text-white shrink-0">{discoveredCount}/{totalCount}</span>
        </div>
      </div>

      {/* Clues Matrix Grid */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[350px]">
        {caseData.clues.map((clue) => {
          const discovered = isClueDiscovered(clue);

          return (
            <div
              key={clue.id}
              className={`p-4 rounded-[24px] border transition-all duration-300 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                discovered
                  ? 'border-[#ff8533]/30 bg-[#ff8533]/5 text-white hover:translate-y-[-1px]'
                  : 'border-white/5 bg-transparent text-[#9a9a9a]/40'
              }`}
            >
              {/* Highlight bar */}
              {discovered && (
                <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-[#ff8533]" />
              )}

              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-1.5 rounded-full border shrink-0 ${
                  discovered
                    ? 'bg-[#ff8533]/25 border-[#ff8533]/30 text-[#ff8533]'
                    : 'bg-transparent border-white/5 text-[#9a9a9a]/30'
                }`}>
                  {discovered ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : (
                    <HelpCircle className="h-4 w-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono tracking-wider uppercase opacity-75 font-bold">
                      CLUE ID: #{clue.id.toUpperCase().replace('CL_', '')}
                    </span>
                    {discovered ? (
                      <span className="text-[8px] font-mono text-[#5c7f5c] bg-[#5c7f5c]/10 border border-[#5c7f5c]/30 px-1.5 py-0.5 rounded uppercase font-bold">
                        VERIFIED
                      </span>
                    ) : (
                      <span className="text-[8px] font-mono text-[#ffb829] bg-[#ffb829]/10 border border-[#ffb829]/30 px-1.5 py-0.5 rounded uppercase font-bold">
                        UNRESOLVED
                      </span>
                    )}
                  </div>
                  
                  <p className={`text-xs leading-relaxed font-mono ${
                    discovered ? 'text-[#bdbdbd] font-normal' : 'text-[#9a9a9a]/45'
                  }`}>
                    {discovered ? clue.text : 'Analyze map hotspots and interview logs to discover details.'}
                  </p>
                </div>
              </div>

              {/* Action Source Links */}
              {discovered && clue.evidenceId && (
                <button
                  onClick={() => handleInspectSource(clue.evidenceId)}
                  className="shrink-0 flex items-center justify-center gap-1.5 text-[10px] font-mono font-extrabold text-[#ffb829] bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 hover:bg-[#ffb829]/10 transition-all cursor-pointer focus:outline-none"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>INSPECT SOURCE</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Educational Clue Connection Hint */}
      <div className="mt-4 flex items-start gap-2.5 bg-white/5 border border-white/5 rounded-[24px] p-4 text-xs font-mono text-[#bdbdbd]">
        <Info className="h-4 w-4 shrink-0 text-[#ffb829] mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-extrabold uppercase text-[#ffb829] mr-1.5">INVESTIGATOR ADVICE:</span> Connecting clues and analyzing social patterns reveals real-world manipulation tactics.
        </p>
      </div>
    </div>
  );
}
