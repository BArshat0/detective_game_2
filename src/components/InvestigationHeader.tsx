import React from 'react';
import { ArrowLeft, Brain, Calendar, Compass, FileText, MessageSquare, ShieldCheck, Target, Zap } from 'lucide-react';
import { Case, CaseState } from '../types';

interface InvestigationHeaderProps {
  caseData: Case;
  caseState: CaseState;
  activeTab: string;
  currentRank: { level: number; name: string };
  xp: number;
  onBack: () => void;
  onChangeTab: (tab: string) => void;
}

const tabs = [
  { id: 'leads', label: 'Leads', hint: 'Pursue', icon: Compass },
  { id: 'evidence', label: 'Evidence Lab', hint: 'Inspect', icon: FileText },
  { id: 'witnesses', label: 'Interrogations', hint: 'Challenge', icon: MessageSquare },
  { id: 'clues', label: 'Investigation Wall', hint: 'Connect', icon: Brain },
  { id: 'timeline', label: 'Timeline', hint: 'Reconstruct', icon: Calendar },
  { id: 'submit', label: 'Case Conference', hint: 'Deduce', icon: ShieldCheck },
];

function getObjective(caseData: Case, caseState: CaseState): string {
  const lockedEvidence = caseData.evidences.length - caseState.discoveredEvidenceIds.length;
  if (caseState.completedLeadIds && caseState.completedLeadIds.length === 0) {
    return 'Select an active Investigation Lead to focus your inquiry and uncover hidden evidence.';
  }
  if (lockedEvidence > 0) {
    return 'Inspect discovered evidence in the Lab and confront witnesses with contradictions to unlock remaining files.';
  }
  if (caseState.timelinePlacements && Object.keys(caseState.timelinePlacements).length < caseData.timeline.length) {
    return 'Reconstruct the chronological timeline of events to establish premeditation and intent.';
  }
  return 'Draw connections on your Investigation Wall and defend your theory before the Chief Detective in Case Conference.';
}

export default function InvestigationHeader({
  caseData,
  caseState,
  activeTab,
  currentRank,
  xp,
  onBack,
  onChangeTab,
}: InvestigationHeaderProps) {
  const objective = getObjective(caseData, caseState);

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[#ff8533]/25 bg-[radial-gradient(circle_at_top_right,rgba(255,133,51,0.16),transparent_42%),linear-gradient(135deg,rgba(18,18,20,0.98),rgba(25,14,8,0.92))] p-5 sm:p-7 shadow-2xl">
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-[#ff8533]/10" />
      <div className="absolute -right-5 -top-9 h-36 w-36 rounded-full border border-[#ff8533]/10" />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <button
              onClick={onBack}
              className="mt-1 rounded-full border border-white/15 bg-black/20 p-2.5 text-[#bdbdbd] transition-colors hover:border-[#ff8533]/50 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Back to case library"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em]">
                <span className="text-[#ff8533]">Active Investigation</span>
                <span className="text-white/25">/</span>
                <span className="text-[#ffb829]">{caseData.topic}</span>
              </div>
              <h2 className="max-w-2xl text-2xl font-serif font-bold tracking-tight text-white sm:text-3xl">{caseData.title}</h2>
              <p className="mt-1 text-xs font-mono text-[#9a9a9a]">Case file #{caseData.id.toUpperCase().replace('CASE_', '')} · Every detail is a lead.</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="rounded-2xl border border-[#ff8533]/25 bg-black/25 px-3.5 py-2 text-right">
              <div className="text-[8px] font-mono uppercase tracking-wider text-[#9a9a9a]">Detective rank</div>
              <div className="text-xs font-mono font-black uppercase text-[#ff8533]">L{currentRank.level} · {currentRank.name}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2 text-center">
              <div className="text-[8px] font-mono uppercase tracking-wider text-[#9a9a9a]">Field XP</div>
              <div className="text-xs font-mono font-black text-white">{xp}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="rounded-2xl border border-[#ffb829]/25 bg-[#ffb829]/[0.06] p-4">
            <div className="mb-1 flex items-center gap-2 text-[10px] font-mono font-black uppercase tracking-wider text-[#ffb829]">
              <Target className="h-3.5 w-3.5" /> Current Objective
            </div>
            <p className="max-w-3xl text-xs leading-relaxed text-[#f4e8dc] font-mono">{objective}</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-mono text-[#bdbdbd]">
            <Zap className="h-4 w-4 text-[#ff8533]" />
            <span>{caseState.discoveredEvidenceIds.length}/{caseData.evidences.length} files examined</span>
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" aria-label="Investigation stages">
          {tabs.map(({ id, label, hint, icon: Icon }) => {
            const selected = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onChangeTab(id)}
                className={`group rounded-2xl border px-3 py-3 text-left transition-all focus:outline-none cursor-pointer ${
                  selected 
                    ? 'border-[#ff8533] bg-[#ff8533]/15 shadow-[0_0_24px_rgba(255,133,51,0.12)]' 
                    : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]'
                }`}
                aria-current={selected ? 'page' : undefined}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 shrink-0 ${selected ? 'text-[#ff8533]' : 'text-[#9a9a9a] group-hover:text-white'}`} />
                  <span className={`text-xs font-bold truncate ${selected ? 'text-white' : 'text-[#bdbdbd] group-hover:text-white'}`}>{label}</span>
                </div>
                <div className="mt-1 pl-6 text-[9px] font-mono uppercase tracking-wider text-[#9a9a9a]">{hint}</div>
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
