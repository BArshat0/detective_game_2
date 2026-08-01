import React, { useMemo, useState } from 'react';
import { Check, FileText, Flag, Send, Shield, Target, UserRound } from 'lucide-react';
import { Case, CaseState } from '../types';

export interface DetectiveReportSubmission {
  whatHappened: string;
  responsiblePeople: string[];
  manipulationAnalysis: string;
  evidenceIds: string[];
  preventionAdvice: string;
  confidence: number;
}

interface DetectiveCaseReportFormProps {
  caseData: Case;
  caseState: CaseState;
  isSubmitting: boolean;
  onSubmit: (report: DetectiveReportSubmission) => void;
}

export default function DetectiveCaseReportForm({ caseData, caseState, isSubmitting, onSubmit }: DetectiveCaseReportFormProps) {
  const [whatHappened, setWhatHappened] = useState('');
  const [responsiblePeople, setResponsiblePeople] = useState<string[]>([]);
  const [manipulationAnalysis, setManipulationAnalysis] = useState('');
  const [evidenceIds, setEvidenceIds] = useState<string[]>([]);
  const [preventionAdvice, setPreventionAdvice] = useState('');
  const [confidence, setConfidence] = useState(65);

  const timeline = useMemo(() => [...caseData.timeline].sort((a, b) => {
    const aPosition = caseState.timelinePlacements[a.id] ?? a.orderIndex;
    const bPosition = caseState.timelinePlacements[b.id] ?? b.orderIndex;
    return aPosition - bPosition;
  }), [caseData.timeline, caseState.timelinePlacements]);
  const availableEvidence = caseData.evidences.filter(evidence => caseState.discoveredEvidenceIds.includes(evidence.id));
  const isComplete = whatHappened.trim().length >= 20 && manipulationAnalysis.trim().length >= 20 && preventionAdvice.trim().length >= 15 && evidenceIds.length > 0;

  const toggle = (values: string[], value: string, setter: (next: string[]) => void) => {
    setter(values.includes(value) ? values.filter(item => item !== value) : [...values, value]);
  };

  return (
    <div className="rounded-[30px] border border-[#ffb829]/25 bg-[radial-gradient(circle_at_top_right,rgba(255,184,41,0.12),transparent_34%),linear-gradient(145deg,rgba(18,18,20,0.98),rgba(31,18,9,0.94))] p-5 text-white shadow-2xl sm:p-7">
      <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-mono font-black uppercase tracking-[0.2em] text-[#ffb829]"><Shield className="h-4 w-4" /> Official investigation file</div>
          <h3 className="text-2xl font-serif font-bold text-white sm:text-3xl">Detective Case Report</h3>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#bdbdbd]">Submit the reasoning behind your conclusion. A senior investigator will review your observations, evidence, and safety recommendations.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-right text-[10px] font-mono text-[#9a9a9a]">CASE FILE<br /><span className="text-white">#{caseData.id.toUpperCase()}</span></div>
      </div>

      <div className="space-y-5">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-[#ff8533]" /><h4 className="text-sm font-bold">1. What happened?</h4></div>
          <textarea value={whatHappened} onChange={event => setWhatHappened(event.target.value)} placeholder="Tell the story in your own words. What happened first, and how did the situation escalate?" className="min-h-28 w-full resize-y rounded-xl border border-white/10 bg-black/30 p-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-[#777] focus:border-[#ff8533]" />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2"><UserRound className="h-4 w-4 text-[#ff8533]" /><h4 className="text-sm font-bold">2. Who was involved?</h4></div>
          <p className="mb-3 text-xs text-[#9a9a9a]">Select the people whose testimony matters to your conclusion.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {caseData.witnesses.map(person => {
              const selected = responsiblePeople.includes(person.id);
              return <button key={person.id} type="button" onClick={() => toggle(responsiblePeople, person.id, setResponsiblePeople)} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${selected ? 'border-[#ff8533] bg-[#ff8533]/10' : 'border-white/10 bg-black/20 hover:border-white/25'}`}><img src={person.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /><span className="min-w-0 flex-1"><span className="block truncate text-xs font-bold">{person.name}</span><span className="block truncate text-[10px] text-[#9a9a9a]">{person.role}</span></span>{selected && <Check className="h-4 w-4 text-[#ff8533]" />}</button>;
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2"><Target className="h-4 w-4 text-[#ff8533]" /><h4 className="text-sm font-bold">3. How did the manipulation work?</h4></div>
          <textarea value={manipulationAnalysis} onChange={event => setManipulationAnalysis(event.target.value)} placeholder="Explain how trust was built, which warning signs appeared, and why the victim believed the attacker." className="min-h-28 w-full resize-y rounded-xl border border-white/10 bg-black/30 p-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-[#777] focus:border-[#ff8533]" />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2"><Flag className="h-4 w-4 text-[#ff8533]" /><h4 className="text-sm font-bold">4. Which evidence supports your conclusion?</h4></div>
          <div className="grid gap-2 sm:grid-cols-2">
            {availableEvidence.map(evidence => {
              const selected = evidenceIds.includes(evidence.id);
              return <button key={evidence.id} type="button" onClick={() => toggle(evidenceIds, evidence.id, setEvidenceIds)} className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all ${selected ? 'border-[#ffb829] bg-[#ffb829]/10' : 'border-white/10 bg-black/20 hover:border-white/25'}`}><span><span className="block text-xs font-bold">{evidence.name}</span><span className="mt-1 block text-[10px] text-[#9a9a9a]">{evidence.category || evidence.type}</span></span>{selected && <Check className="h-4 w-4 shrink-0 text-[#ffb829]" />}</button>;
            })}
          </div>
          {availableEvidence.length === 0 && <p className="text-xs text-[#ffb829]">Discover evidence before submitting your report.</p>}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-[#ff8533]" /><h4 className="text-sm font-bold">5. Timeline verification</h4></div>
          <div className="space-y-2">
            {timeline.map((event, index) => <div key={event.id} className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff8533]/20 text-[10px] font-mono font-bold text-[#ff8533]">{index + 1}</span><p className="text-xs leading-relaxed text-[#d4ccc5]">{event.description}</p></div>)}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <h4 className="mb-3 text-sm font-bold">6. Prevention advice</h4>
          <textarea value={preventionAdvice} onChange={event => setPreventionAdvice(event.target.value)} placeholder="What practical advice would you give someone facing a similar situation?" className="min-h-24 w-full resize-y rounded-xl border border-white/10 bg-black/30 p-3 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-[#777] focus:border-[#ff8533]" />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between"><h4 className="text-sm font-bold">7. Investigation confidence</h4><span className="font-mono text-sm font-bold text-[#ffb829]">{confidence}%</span></div>
          <input type="range" min="0" max="100" value={confidence} onChange={event => setConfidence(Number(event.target.value))} className="w-full accent-[#ff8533]" />
          <div className="mt-2 flex justify-between text-[10px] font-mono text-[#9a9a9a]"><span>NOT CONFIDENT</span><span>COMPLETELY CERTAIN</span></div>
        </section>

        <button type="button" disabled={!isComplete || isSubmitting} onClick={() => onSubmit({ whatHappened, responsiblePeople, manipulationAnalysis, evidenceIds, preventionAdvice, confidence })} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff8533] px-5 py-4 text-sm font-black text-[#1e110a] transition-all hover:bg-[#ff9955] disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" />{isSubmitting ? 'Submitting investigation for review...' : 'Submit Investigation'}</button>
        {!isComplete && <p className="text-center text-[10px] font-mono text-[#9a9a9a]">Complete the narrative, manipulation analysis, prevention advice, and select supporting evidence.</p>}
      </div>
    </div>
  );
}
