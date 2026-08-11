import React, { useState } from 'react';
import { 
  ShieldAlert, Send, ArrowRight, UserCheck, CheckCircle2, 
  HelpCircle, AlertTriangle, FileText, Clock, ExternalLink, 
  Key, Network, Award, Layers, ShieldCheck, Target, ChevronRight, Edit3, Lightbulb, Lock
} from 'lucide-react';
import { Case, CaseState } from '../types';

interface DetectiveCaseReportFormProps {
  caseData: Case;
  discoveredEvidenceIds?: string[];
  unlockedWitnessIds?: string[];
  caseState?: CaseState;
  onNavigateToTab?: (tab: string) => void;
  onSubmitReport: (reportData: Record<string, unknown>) => Promise<unknown>;
}

export default function DetectiveCaseReportForm({
  caseData,
  discoveredEvidenceIds = [],
  unlockedWitnessIds = [],
  caseState,
  onNavigateToTab,
  onSubmitReport
}: DetectiveCaseReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMechanism, setSelectedMechanism] = useState<string>('');
  const [deductionAnswers, setDeductionAnswers] = useState<Record<string, string>>({});
  const [detectiveNotes, setDetectiveNotes] = useState<string>('');

  // Auto-compile state data
  const suspectClassifications = caseState?.suspectClassifications || {};
  const keyEvidenceTags = caseState?.keyEvidenceTags || {};
  const timelinePlacements = caseState?.timelinePlacements || {};
  const wallConnections = caseState?.wallConnections || [];
  const wallNodes = caseState?.wallNodes || [];
  const unlockedLeadIds = caseState?.unlockedLeadIds || [];
  const completedLeadIds = caseState?.completedLeadIds || [];

  // Discovered evidence files
  const discoveredEvidences = caseData.evidences.filter(e => 
    (caseState?.discoveredEvidenceIds || discoveredEvidenceIds).includes(e.id)
  );

  // User tagged key evidence
  const userKeyEvidences = caseData.evidences.filter(e => keyEvidenceTags[e.id]?.isKey);

  // Check if detective has conducted any real investigation yet
  const hasInvestigated = completedLeadIds.length > 0 || discoveredEvidences.length > 0 || Object.keys(suspectClassifications).length > 0;

  // 1. Primary Suspects & Persons of Interest compiled from player classification
  const primarySuspects = caseData.witnesses.filter(w => 
    suspectClassifications[w.id]?.classification === 'primary_suspect'
  );

  const personsOfInterest = caseData.witnesses.filter(w => 
    suspectClassifications[w.id]?.classification === 'person_of_interest'
  );

  const clearedWitnesses = caseData.witnesses.filter(w => 
    suspectClassifications[w.id]?.classification === 'cleared'
  );

  const primarySuspectName = primarySuspects.length > 0 
    ? primarySuspects.map(s => s.name).join(', ')
    : 'Unidentified / Under Investigation';

  // 2. Chronological Reconstructed Narrative from placed timeline events
  const placedEventEntries = Object.entries(timelinePlacements)
    .sort((a, b) => a[1] - b[1])
    .map(([eventId]) => caseData.timeline.find(e => e.id === eventId))
    .filter((e): e is NonNullable<typeof e> => e !== undefined);

  // 3. Unresolved / Open Leads
  const openLeads = caseData.leads.filter(l => 
    (unlockedLeadIds.includes(l.id) || l.isUnlocked) && !completedLeadIds.includes(l.id)
  );

  // 4. Mechanism Options from conferenceConfig or caseData
  const mechanismOptions = caseData.conferenceConfig?.mechanismOptions || 
    caseData.manipulationTechniques?.map((m, i) => ({ id: `m_${i}`, label: m, description: m })) || [];

  const handleAuthorizeSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedEvIds = userKeyEvidences.map(e => e.id);
      const chosenMechanism = selectedMechanism || caseData.conferenceConfig?.mechanismOptions?.[0]?.label || caseData.manipulationTechniques?.[0] || 'Social Engineering';

      const defenseSummary = `Detective Investigation Dossier submitted. ${placedEventEntries.length} chronological timeline events verified. Primary suspect(s): ${primarySuspectName}. Key evidence linked: ${selectedEvIds.length} files. ${detectiveNotes ? `Notes: ${detectiveNotes}` : ''}`;

      await onSubmitReport({
        suspectEntity: primarySuspectName,
        modusOperandi: chosenMechanism,
        selectedEvidenceIds: selectedEvIds,
        detectiveDefense: defenseSummary,
        deductionAnswers,
        preventionRecommendation: caseData.learningObjectives?.join('; ') || 'Always verify credentials and demand official permits.'
      });
    } catch (err) {
      console.error('Error submitting case report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="case-conference-container" className="flex flex-col h-full rounded-[28px] border border-white/15 glass-panel bg-slate-950/80 p-6 sm:p-8 text-white shadow-2xl overflow-y-auto space-y-8">
      
      {/* Dossier Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff8533] uppercase tracking-widest mb-1.5 font-bold">
            <ShieldAlert className="h-4 w-4 text-[#ff8533]" />
            OFFICIAL DETECTIVE DOSSIER & CASE CONFERENCE
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            {caseData.title}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            CASE ID: {caseData.id.toUpperCase()} • REPORT SURMISED BASED ON FIELD DISCOVERIES
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!hasInvestigated && (
            <div className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs font-bold flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-red-400" />
              <span>EARLY STAGE REPORT</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleAuthorizeSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-2xl bg-[#ff8533] hover:bg-[#ff9955] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#ff8533]/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>SUBMITTING DOSSIER...</span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>SUBMIT CASE CONFERENCE REPORT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. Primary Suspects & Witness Classifications */}
      <section className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-mono font-bold uppercase text-[#ff8533] flex items-center gap-2 tracking-wider">
            <UserCheck className="h-4 w-4 text-[#ff8533]" />
            1. Identified Suspects & Witness Classifications
          </h3>
          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('interrogation')}
              className="text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1 cursor-pointer hover:bg-white/10 transition-all"
            >
              <Edit3 className="h-3 w-3 text-[#ff8533]" />
              Modify in Interrogation
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Primary Suspects Box */}
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-rose-400 tracking-wider block">
              🎯 PRIMARY SUSPECTS ({primarySuspects.length})
            </span>
            {primarySuspects.length === 0 ? (
              <p className="text-xs font-mono text-slate-400 italic">
                No primary suspect tagged during witness interrogation yet.
              </p>
            ) : (
              primarySuspects.map(s => (
                <div key={s.id} className="bg-black/40 border border-rose-500/20 rounded-xl p-2.5 text-xs font-mono space-y-1">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{s.name}</span>
                    <span className="text-[9px] text-rose-300 font-normal">({s.role})</span>
                  </div>
                  <p className="text-[10px] text-slate-300 italic">
                    "{suspectClassifications[s.id]?.reason || 'Identified through case evidence.'}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Persons of Interest Box */}
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-300 tracking-wider block">
              🔍 PERSONS OF INTEREST ({personsOfInterest.length})
            </span>
            {personsOfInterest.length === 0 ? (
              <p className="text-xs font-mono text-slate-400 italic">
                No persons of interest flagged yet.
              </p>
            ) : (
              personsOfInterest.map(s => (
                <div key={s.id} className="bg-black/40 border border-amber-500/20 rounded-xl p-2.5 text-xs font-mono space-y-1">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{s.name}</span>
                    <span className="text-[9px] text-amber-300 font-normal">({s.role})</span>
                  </div>
                  <p className="text-[10px] text-slate-300 italic">
                    "{suspectClassifications[s.id]?.reason || 'Under observation.'}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Cleared Witnesses Box */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-300 tracking-wider block">
              ✓ CLEARED / WITNESSES ({clearedWitnesses.length})
            </span>
            {clearedWitnesses.length === 0 ? (
              <p className="text-xs font-mono text-slate-400 italic">
                No cleared witnesses logged yet.
              </p>
            ) : (
              clearedWitnesses.map(s => (
                <div key={s.id} className="bg-black/40 border border-emerald-500/20 rounded-xl p-2.5 text-xs font-mono space-y-1">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{s.name}</span>
                    <span className="text-[9px] text-emerald-300 font-normal">({s.role})</span>
                  </div>
                  <p className="text-[10px] text-slate-300 italic">
                    "{suspectClassifications[s.id]?.reason || 'Testimony verified.'}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 2. What Happened - Reconstructed Timeline Narrative */}
      <section className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-mono font-bold uppercase text-[#ff8533] flex items-center gap-2 tracking-wider">
            <Clock className="h-4 w-4 text-[#ff8533]" />
            2. Reconstructed Sequence of Events ("What Happened")
          </h3>
          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('timeline')}
              className="text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1 cursor-pointer hover:bg-white/10 transition-all"
            >
              <Edit3 className="h-3 w-3 text-[#ff8533]" />
              Adjust Sequence in Timeline
            </button>
          )}
        </div>

        {placedEventEntries.length === 0 ? (
          <div className="bg-black/40 border border-amber-500/30 rounded-2xl p-4 text-center font-mono text-xs text-amber-300 space-y-2">
            <span>⚠️ Timeline not yet reconstructed on the Incident Reconstruction Wall.</span>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('timeline')}
                className="block mx-auto text-xs text-[#ff8533] underline font-bold cursor-pointer"
              >
                Click here to place incident events in chronological order
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {placedEventEntries.map((evt, idx) => (
              <div key={evt.id} className="flex gap-3 bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-mono items-start">
                <div className="h-6 w-6 rounded-full bg-[#ff8533]/20 border border-[#ff8533] text-[#ff8533] flex items-center justify-center shrink-0 font-bold text-[10px]">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Incident #{idx + 1}</span>
                    <span className="text-[10px] text-[#ffb829] font-bold bg-[#ffb829]/10 px-2.5 py-0.5 rounded-full border border-[#ffb829]/20">
                      {evt.time}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    {evt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. How the Social Engineering & Fraud Vector Operated */}
      <section className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-mono font-bold uppercase text-[#ff8533] flex items-center gap-2 border-b border-white/10 pb-3 tracking-wider">
          <ShieldAlert className="h-4 w-4 text-[#ff8533]" />
          3. How the Social Engineering & Fraud Vector Operated
        </h3>

        {!hasInvestigated ? (
          <div className="bg-black/40 border border-amber-500/30 rounded-2xl p-5 text-xs font-mono text-amber-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>FRAUD MECHANISM NOT YET UNCOVERED</span>
            </div>
            <p className="text-slate-300 font-sans leading-relaxed">
              No field leads have been completed and no evidence files have been discovered yet. 
              Pursue active leads in the Field Leads tab or explore location hotspots to discover the perpetrator's fraud vector and warning signs.
            </p>
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('leads')}
                className="mt-2 text-xs text-[#ff8533] font-bold underline cursor-pointer"
              >
                Go to Field Leads to investigate →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Interactive Fraud Vector Selection */}
            {mechanismOptions.length > 0 && (
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-mono uppercase font-bold text-[#ffb829] block">
                  SELECT DEDUCED PRIMARY TACTICAL MECHANISM:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {mechanismOptions.map((opt: any) => {
                    const isSelected = selectedMechanism === opt.label || selectedMechanism === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedMechanism(opt.label)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer font-mono text-xs ${
                          isSelected 
                            ? 'bg-[#ff8533]/20 border-[#ff8533] text-white font-bold ring-1 ring-[#ff8533]' 
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-bold">{opt.label}</span>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-[#ff8533]" />}
                        </div>
                        {opt.description && (
                          <p className="text-[10px] text-slate-400 font-sans font-normal leading-tight">
                            {opt.description}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Warning Signs Discovered */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-mono text-[#ff8533] uppercase font-bold block">
                UNCOVERED CASE WARNING SIGNS ({caseData.warningSigns.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {caseData.warningSigns.map((ws, wsIdx) => (
                  <div key={wsIdx} className="bg-white/5 border border-white/10 rounded-xl p-3 text-[11px] text-slate-300 font-sans space-y-1">
                    <strong className="text-amber-300 font-mono text-[10px] block">
                      Warning Indicator #{wsIdx + 1}:
                    </strong>
                    <span>{ws}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. Key Evidence & Contradictions Discovered */}
      <section className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-mono font-bold uppercase text-[#ff8533] flex items-center gap-2 tracking-wider">
            <Key className="h-4 w-4 text-[#ff8533]" />
            4. Key Evidence & Contradictions Discovered
          </h3>
          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('evidence')}
              className="text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1 cursor-pointer hover:bg-white/10 transition-all"
            >
              <Edit3 className="h-3 w-3 text-[#ff8533]" />
              Tag Evidence in Cabinet
            </button>
          )}
        </div>

        {discoveredEvidences.length === 0 ? (
          <div className="bg-black/40 border border-amber-500/30 rounded-2xl p-5 text-xs font-mono text-amber-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>NO EVIDENCE FILES DISCOVERED YET</span>
            </div>
            <p className="text-slate-300 font-sans leading-relaxed">
              You have not located any evidence files in the field yet. 
              Inspect location hotspots or pursue investigation leads to uncover files in the Evidence Cabinet.
            </p>
          </div>
        ) : userKeyEvidences.length === 0 ? (
          <div className="bg-black/40 border border-amber-500/30 rounded-2xl p-5 text-xs font-mono text-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <Target className="h-4 w-4 text-amber-400" />
                <span>{discoveredEvidences.length} DISCOVERED FILE(S) • KEY EVIDENCE NOT YET TAGGED</span>
              </div>
              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => onNavigateToTab('evidence')}
                  className="text-xs bg-[#ff8533] text-black px-3 py-1 rounded-lg font-bold hover:bg-[#ff9955] transition-all cursor-pointer"
                >
                  Go Tag Key Evidence →
                </button>
              )}
            </div>
            <p className="text-slate-300 font-sans leading-relaxed">
              No evidence files have been tagged as "Key Evidence" for this report. Go to the Evidence Cabinet, open a discovered file, and click <strong className="text-white">"Mark as Key Evidence"</strong> to specify your detective rationale.
            </p>
            <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2">
              {discoveredEvidences.map(ev => (
                <span key={ev.id} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                  📄 {ev.name}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Tagged Key Evidence */}
            <div className="bg-black/40 border border-[#ff8533]/40 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-mono uppercase font-bold text-[#ffb829] block">
                ⭐ DETECTIVE-TAGGED KEY EVIDENCE ({userKeyEvidences.length})
              </span>
              {userKeyEvidences.map(ev => (
                <div key={ev.id} className="bg-slate-900 border border-[#ff8533]/40 rounded-xl p-3 text-xs font-mono space-y-1">
                  <span className="font-bold text-[#ff8533] block">{ev.name}</span>
                  <p className="text-[10px] text-slate-300 italic">
                    "{keyEvidenceTags[ev.id]?.justification || 'Tagged as critical case proof.'}"
                  </p>
                </div>
              ))}
            </div>

            {/* Discovered Cabinet Overview */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-300 block">
                📂 ALL DISCOVERED CASE FILES ({discoveredEvidences.length} / {caseData.evidences.length})
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto">
                {discoveredEvidences.map(ev => (
                  <span key={ev.id} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                    📄 {ev.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. Investigation Wall & Evidence Connections */}
      <section className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-mono font-bold uppercase text-[#ff8533] flex items-center gap-2 tracking-wider">
            <Network className="h-4 w-4 text-[#ff8533]" />
            5. Evidence Connections & Network Theory
          </h3>
          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('wall')}
              className="text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1 cursor-pointer hover:bg-white/10 transition-all"
            >
              <Edit3 className="h-3 w-3 text-[#ff8533]" />
              Modify Wall Network
            </button>
          )}
        </div>

        {wallConnections.length === 0 ? (
          <p className="text-xs font-mono text-slate-400 italic bg-black/40 p-4 rounded-2xl border border-white/5">
            No red string connections linked on the Investigation Wall yet. Visit the Investigation Wall tab to connect related evidence nodes.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {wallConnections.map((conn, cIdx) => {
              const fromN = wallNodes.find(n => n.id === conn.fromId);
              const toN = wallNodes.find(n => n.id === conn.toId);
              return (
                <div key={cIdx} className="bg-black/40 border border-white/10 rounded-xl p-3 font-mono text-xs flex items-center justify-between">
                  <span className="text-white font-bold">{fromN?.title || conn.fromId}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#ff8533]/20 border border-[#ff8533] text-[#ff8533] uppercase font-bold">
                    {conn.relationshipLabel || 'Connected'}
                  </span>
                  <span className="text-white font-bold">{toN?.title || conn.toId}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. Unresolved Questions & Open Ends */}
      <section className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 space-y-3 shadow-xl">
        <h3 className="text-sm font-mono font-bold uppercase text-[#ff8533] flex items-center gap-2 border-b border-white/10 pb-3 tracking-wider">
          <HelpCircle className="h-4 w-4 text-[#ff8533]" />
          6. Unresolved Questions & Open Leads
        </h3>

        {!hasInvestigated ? (
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-xs text-slate-400 italic">
            ⚠️ Investigation not yet started. Open leads and unresolved questions will populate as field leads are unlocked.
          </div>
        ) : openLeads.length > 0 ? (
          <div className="bg-black/40 border border-amber-500/30 rounded-2xl p-4 font-mono text-xs space-y-3">
            <span className="text-amber-300 font-bold block">
              ⚠️ ACTIVE UNRESOLVED LEADS ({openLeads.length}):
            </span>
            <div className="space-y-2 text-slate-300 text-[11px]">
              {openLeads.map(lead => (
                <div key={lead.id} className="flex items-start justify-between border-b border-white/5 pb-2 gap-3">
                  <div>
                    <span className="text-white font-bold block">{lead.title}</span>
                    <span className="text-slate-400 font-sans text-[10px]">{lead.description}</span>
                  </div>
                  {onNavigateToTab && (
                    <button
                      type="button"
                      onClick={() => onNavigateToTab('leads')}
                      className="text-[10px] text-[#ff8533] hover:underline font-bold shrink-0 cursor-pointer"
                    >
                      Pursue Lead →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>All currently unlocked field leads and discovered incidents have been investigated and incorporated into your report!</span>
          </div>
        )}
      </section>

      {/* 7. Interactive Case Deduction Questionnaire */}
      {caseData.solution?.questions && caseData.solution.questions.length > 0 && (
        <section className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-purple-500/20 pb-3">
            <h3 className="text-sm font-mono font-bold uppercase text-purple-300 flex items-center gap-2 tracking-wider">
              <Lightbulb className="h-4 w-4 text-purple-400" />
              7. Detective Deduction Assessment (Case Evaluation Questions)
            </h3>
            <p className="text-xs text-slate-300 font-sans mt-1">
              Answer these deduction questions based on your field findings before presenting your report.
            </p>
          </div>

          <div className="space-y-4">
            {caseData.solution.questions.map((q, qIdx) => (
              <div key={q.id || qIdx} className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                    Q{qIdx + 1}
                  </span>
                  <span>{q.question}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.choices.map((choice, cIdx) => {
                    const isSelected = deductionAnswers[q.id || `q_${qIdx}`] === choice;
                    return (
                      <button
                        key={cIdx}
                        type="button"
                        onClick={() => setDeductionAnswers(prev => ({ ...prev, [q.id || `q_${qIdx}`]: choice }))}
                        className={`p-3 rounded-xl border text-left text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600/30 border-purple-400 text-white font-bold ring-1 ring-purple-400'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{choice}</span>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0 ml-2" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Authorize & Submit Final Action */}
      <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-400">
          Submits your compiled findings and deductions directly to the Chief Detective for evaluation.
        </div>
        <button
          type="button"
          onClick={handleAuthorizeSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#ff8533] hover:bg-[#ff9955] text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-[#ff8533]/20 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>SUBMITTING DOSSIER...</span>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>SUBMIT CASE CONFERENCE REPORT</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
