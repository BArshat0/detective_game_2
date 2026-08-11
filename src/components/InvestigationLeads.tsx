import React from 'react';
import { Target, CheckCircle2, Lock, ArrowRight, Lightbulb, Compass } from 'lucide-react';
import { Case, InvestigationLead } from '../types';

interface InvestigationLeadsProps {
  caseData: Case;
  unlockedLeadIds: string[];
  completedLeadIds: string[];
  onSelectLead: (lead: InvestigationLead) => void;
}

export default function InvestigationLeads({
  caseData,
  unlockedLeadIds,
  completedLeadIds,
  onSelectLead
}: InvestigationLeadsProps) {
  const [visibleHintIds, setVisibleHintIds] = React.useState<Record<string, boolean>>({});
  const leads = caseData.leads || [];

  const completedCount = leads.filter(l => completedLeadIds.includes(l.id)).length;
  const totalCount = leads.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col h-full rounded-[28px] border border-white/15 glass-panel bg-slate-950/70 p-6 text-white shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-5">
        <div>
          <h3 className="text-xl font-bold font-serif text-white flex items-center gap-2.5">
            <Compass className="h-5 w-5 text-[#ff8533] animate-pulse" />
            Active Investigation Leads
          </h3>
          <p className="text-xs text-[#bdbdbd] font-mono mt-1">
            Choose your direction of inquiry. Completing leads reveals hidden evidence, unlocks witnesses, and clarifies the timeline.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 backdrop-blur-md">
          <div className="w-28 bg-black/40 border border-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#ff8533] to-[#ffb829] h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-xs font-mono font-black text-[#ffb829]">
            {completedCount}/{totalCount} LEADS SOLVED
          </span>
        </div>
      </div>

      {/* Leads List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
        {leads.length === 0 ? (
          <div className="p-8 text-center text-[#9a9a9a] font-mono text-xs">
            No active leads available for this case.
          </div>
        ) : (
          leads.map((lead) => {
            const isUnlocked = unlockedLeadIds.includes(lead.id) || lead.isUnlocked;
            const isCompleted = completedLeadIds.includes(lead.id);

            return (
              <div
                key={lead.id}
                className={`p-4 rounded-2xl border transition-all duration-300 relative flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                    : isUnlocked
                      ? 'border-[#ff8533]/40 bg-slate-900/80 hover:border-[#ff8533] hover:bg-slate-900 text-white shadow-lg'
                      : 'border-white/5 bg-black/20 text-[#9a9a9a]/40'
                }`}
              >
                {/* Left side accent */}
                {isUnlocked && !isCompleted && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-[#ff8533]" />
                )}

                <div className="flex items-start gap-3.5 flex-1">
                  <div className={`mt-1 p-2 rounded-xl border shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : isUnlocked
                        ? 'bg-[#ff8533]/20 border-[#ff8533]/40 text-[#ff8533]'
                        : 'bg-white/5 border-white/5 text-[#9a9a9a]/30'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : isUnlocked ? (
                      <Target className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ff8533]">
                        LEAD #{lead.id.toUpperCase().replace('LEAD_', '')}
                      </span>
                      {isCompleted ? (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                          RESOLVED (+{lead.rewardXp || 100} XP)
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-[9px] font-mono text-[#ffb829] bg-[#ffb829]/10 border border-[#ffb829]/30 px-2 py-0.5 rounded-full font-bold uppercase">
                          ACTIVE INVESTIGATION
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-[#9a9a9a] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-bold uppercase">
                          LOCKED LEAD
                        </span>
                      )}
                    </div>

                    <h4 className={`text-sm font-bold font-serif ${isCompleted ? 'text-emerald-100 line-through opacity-80' : 'text-white'}`}>
                      {lead.title}
                    </h4>

                    <p className={`text-xs mt-1 leading-relaxed font-sans ${isUnlocked ? 'text-[#bdbdbd]' : 'text-[#9a9a9a]/40'}`}>
                      {isUnlocked ? lead.description : 'Follow active leads to unlock this investigative path.'}
                    </p>

                    {/* Hint callout */}
                    {isUnlocked && !isCompleted && lead.hint && (
                      visibleHintIds[lead.id] ? (
                        <div className="mt-2.5 flex items-start justify-between gap-2 text-[11px] font-mono text-[#ffb829] bg-[#ffb829]/10 border border-[#ffb829]/30 rounded-xl p-2.5">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="h-3.5 w-3.5 shrink-0 text-[#ffb829] mt-0.5" />
                            <span>Tactical Hint: {lead.hint}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setVisibleHintIds(prev => ({ ...prev, [lead.id]: false })); }}
                            className="text-[10px] font-bold text-[#ffb829]/80 hover:text-white underline shrink-0 cursor-pointer ml-2"
                          >
                            Hide
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => { setVisibleHintIds(prev => ({ ...prev, [lead.id]: true })); }}
                          className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#ffb829] hover:text-white bg-[#ffb829]/10 hover:bg-[#ffb829]/20 border border-[#ffb829]/30 rounded-xl px-3 py-1.5 transition-all cursor-pointer"
                        >
                          <Lightbulb className="h-3.5 w-3.5 shrink-0 text-[#ffb829]" />
                          <span>SHOW HINT</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Action button */}
                {isUnlocked && !isCompleted && (
                  <button
                    onClick={() => onSelectLead(lead)}
                    className="shrink-0 btn-primary py-2.5 px-4 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer focus:outline-none"
                  >
                    <span>PURSUE LEAD</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
