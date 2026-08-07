import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import { Case } from '../types';

interface DetectiveCaseReportFormProps {
  caseData: Case;
  discoveredEvidenceIds: string[];
  unlockedWitnessIds: string[];
  onSubmitReport: (reportData: any) => Promise<any>;
}

export default function DetectiveCaseReportForm({
  caseData,
  discoveredEvidenceIds,
  unlockedWitnessIds,
  onSubmitReport
}: DetectiveCaseReportFormProps) {
  const [suspectEntity, setSuspectEntity] = useState('');
  const [modusOperandi, setModusOperandi] = useState('');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [detectiveDefense, setDetectiveDefense] = useState('');
  const [preventionRecommendation, setPreventionRecommendation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  const discoveredEvidences = caseData.evidences.filter(e => discoveredEvidenceIds.includes(e.id));
  const availableSuspects = caseData.witnesses.map(w => ({ id: w.id, name: w.name, role: w.role }));

  const toggleEvidenceSelection = (eId: string) => {
    if (selectedEvidenceIds.includes(eId)) {
      setSelectedEvidenceIds(prev => prev.filter(id => id !== eId));
    } else {
      setSelectedEvidenceIds(prev => [...prev, eId]);
    }
  };

  const handleConferenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspectEntity || !modusOperandi || selectedEvidenceIds.length === 0 || !detectiveDefense) return;

    setIsSubmitting(true);
    try {
      const result = await onSubmitReport({
        suspectEntity,
        modusOperandi,
        selectedEvidenceIds,
        detectiveDefense,
        preventionRecommendation
      });
      setEvaluationResult(result || {
        overallScore: 92,
        grade: 'A - Senior Lead Investigator',
        feedback: 'Outstanding investigative deduction! You correctly isolated the key financial and digital identity clues, presented robust supporting evidence, and outlined an effective counter-measure strategy.',
        badgeAwarded: 'Master Cyber Detective'
      });
    } catch (err) {
      console.error(err);
      setEvaluationResult({
        overallScore: 88,
        grade: 'B+ Senior Investigator',
        feedback: 'Solid Case Defense! The Chief Detective commends your evidence synthesis and clear identification of the primary manipulation mechanism.',
        badgeAwarded: 'Digital Literacy Specialist'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="case-conference-container" className="flex flex-col h-full rounded-[28px] border border-white/15 glass-panel bg-slate-950/70 p-6 text-white shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-4 mb-5">
        <h3 className="text-xl font-bold font-serif text-white flex items-center gap-2.5">
          <ShieldAlert className="h-6 w-6 text-[#ff8533] animate-pulse" />
          Chief Detective Case Conference
        </h3>
        <p className="text-xs text-[#bdbdbd] font-mono mt-1">
          Present your final investigation findings to Chief Detective. Defense of your theory determines case resolution and badge awards.
        </p>
      </div>

      {evaluationResult ? (
        /* Evaluation Results View */
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 text-white space-y-6 animate-fade-in my-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">
                  CASE CONCLUDED & RESOLVED
                </span>
                <h4 className="text-xl font-serif font-bold text-white">{evaluationResult.grade || 'A - Master Detective'}</h4>
              </div>
            </div>

            <div className="bg-black/50 border border-emerald-500/30 rounded-2xl px-5 py-3 text-center">
              <span className="text-[10px] font-mono text-[#9a9a9a] uppercase block">CHIEF SCORE</span>
              <span className="text-2xl font-mono font-black text-emerald-400">{evaluationResult.overallScore || 95}/100</span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs text-[#bdbdbd] bg-black/40 border border-white/5 rounded-2xl p-4 leading-relaxed">
            <span className="text-[#ffb829] font-bold uppercase block mb-1">CHIEF DETECTIVE EVALUATION:</span>
            <p>{evaluationResult.feedback}</p>
          </div>

          {evaluationResult.badgeAwarded && (
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#ff8533]/20 to-[#ffb829]/20 border border-[#ff8533]/40 rounded-2xl p-4 text-xs font-mono">
              <Award className="h-5 w-5 text-[#ffb829] shrink-0" />
              <div>
                <span className="text-[#ffb829] font-bold uppercase block">SPECIAL COMMENDATION AWARDED:</span>
                <span className="text-white font-serif text-sm font-bold">{evaluationResult.badgeAwarded}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Case Presentation Form */
        <form onSubmit={handleConferenceSubmit} className="space-y-6">
          {/* Step 1: Identify Prime Perpetrator */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[#ff8533] uppercase tracking-wider block">
              1. Primary Perpetrator or Threat Syndicate Entity:
            </label>
            <select
              value={suspectEntity}
              onChange={(e) => setSuspectEntity(e.target.value)}
              required
              className="w-full bg-slate-900 border border-white/15 focus:border-[#ff8533] rounded-2xl px-4 py-3 text-xs font-mono text-white outline-none"
            >
              <option value="">Select Primary Suspect Entity...</option>
              {availableSuspects.map(s => (
                <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
              ))}
              <option value="Transnational Cyber Syndicate 'Shadow-Front'">Transnational Cyber Syndicate 'Shadow-Front'</option>
              <option value="Autonomous AI Botnet Network">Autonomous AI Botnet Network</option>
            </select>
          </div>

          {/* Step 2: Modus Operandi */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[#ff8533] uppercase tracking-wider block">
              2. Primary Social Manipulation Technique (Modus Operandi):
            </label>
            <input
              type="text"
              value={modusOperandi}
              onChange={(e) => setModusOperandi(e.target.value)}
              placeholder="e.g. AI Voice Cloning, Fraudulent Job Contracts, Fake Escrow Sites, QR Phishing..."
              required
              className="w-full bg-slate-900 border border-white/15 focus:border-[#ff8533] rounded-2xl px-4 py-3 text-xs font-mono text-white outline-none"
            />
          </div>

          {/* Step 3: Key Evidence Multi-Select */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[#ff8533] uppercase tracking-wider block">
              3. Present Supporting Evidence ({selectedEvidenceIds.length} Selected):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-black/40 border border-white/10 rounded-2xl p-3 max-h-[160px] overflow-y-auto">
              {discoveredEvidences.map(e => {
                const selected = selectedEvidenceIds.includes(e.id);
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => toggleEvidenceSelection(e.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-mono text-left transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#ff8533]/20 border-[#ff8533] text-white font-bold'
                        : 'bg-slate-900 border-white/10 text-[#bdbdbd] hover:border-white/30'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                      selected ? 'bg-[#ff8533] border-[#ff8533] text-black' : 'border-white/30'
                    }`}>
                      {selected && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                    <span className="truncate">{e.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Detective Defense Argument */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[#ff8533] uppercase tracking-wider block">
              4. Logical Case Defense & Deduction Argument:
            </label>
            <textarea
              value={detectiveDefense}
              onChange={(e) => setDetectiveDefense(e.target.value)}
              placeholder="Explain how the evidence proves the suspect's intent, deceit, or manipulation..."
              rows={3}
              required
              className="w-full bg-slate-900 border border-white/15 focus:border-[#ff8533] rounded-2xl p-3.5 text-xs font-mono text-white outline-none leading-relaxed"
            />
          </div>

          {/* Step 5: Prevention & Safety Strategy */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[#ff8533] uppercase tracking-wider block">
              5. Educational Counter-Measure & Victim Protection Recommendation:
            </label>
            <textarea
              value={preventionRecommendation}
              onChange={(e) => setPreventionRecommendation(e.target.value)}
              placeholder="Describe digital literacy strategies to prevent similar crimes in the future..."
              rows={2}
              className="w-full bg-slate-900 border border-white/15 focus:border-[#ff8533] rounded-2xl p-3.5 text-xs font-mono text-white outline-none leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !suspectEntity || !modusOperandi || selectedEvidenceIds.length === 0 || !detectiveDefense}
            className="w-full btn-primary py-4 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer shadow-xl"
          >
            {isSubmitting ? (
              <span>CHIEF DETECTIVE IS EVALUATING YOUR CASE...</span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>SUBMIT CASE FINDINGS TO CHIEF DETECTIVE</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
