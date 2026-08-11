import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  ShieldCheck, 
  Award, 
  Copy, 
  Check, 
  FileText, 
  User, 
  ArrowLeft,
  Download,
  BookOpen,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  Layers,
  ArrowLeftRight,
  RotateCcw,
  Compass,
  Lightbulb,
  Zap,
  CheckCircle
} from 'lucide-react';
import { Case, CaseState } from '../types';

interface EvaluationResult {
  score?: number;
  overallScore?: number;
  grade?: string;
  verdict?: string;
  analysis?: string;
  unlockedBadges?: string[];
  correctTimelineCount?: number;
  badgeAwarded?: string;
  feedback?: string;
}

interface SubmittedReport {
  suspectEntity?: string;
  modusOperandi?: string;
  selectedEvidenceIds?: string[];
  detectiveDefense?: string;
  preventionRecommendation?: string;
}

interface DigitalSafetyReportProps {
  caseData: Case;
  caseState?: CaseState;
  evaluationResult: EvaluationResult;
  submittedReport?: SubmittedReport;
  investigatorName?: string;
  onConclude: () => void;
  onReviewInvestigation?: () => void;
  onReplayCase?: () => void;
}

export default function DigitalSafetyReport({
  caseData,
  caseState,
  evaluationResult,
  submittedReport,
  investigatorName = 'Senior Cyber Detective',
  onConclude,
  onReviewInvestigation,
  onReplayCase
}: DigitalSafetyReportProps) {
  const [copied, setCopied] = useState(false);

  const score = evaluationResult.overallScore ?? evaluationResult.score ?? 92;
  const grade = evaluationResult.grade ?? 'A - Senior Lead Investigator';
  const verdict = evaluationResult.feedback ?? evaluationResult.verdict ?? 'Forensic investigation completed and verified.';
  const analysis = evaluationResult.analysis;
  const unlockedBadges = evaluationResult.unlockedBadges ?? [];
  const badgeAwarded = evaluationResult.badgeAwarded || unlockedBadges[0] || 'Master Cyber Detective';

  const reportId = `CYBER-AUDIT-${(caseData.id || 'CASE').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const timestamp = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const caseTitle = caseData.title || 'Digital Safety Investigation';
  const caseTopic = caseData.topic || 'Cyber Awareness';
  const caseThreatActor = caseData.threatActor || 'Digital Threat Syndicate';

  // Calculate investigation state metrics
  const totalEvidences = caseData.evidences?.length || 0;
  const discoveredEvidenceIds = caseState?.discoveredEvidenceIds || [];
  const discoveredEvidenceCount = discoveredEvidenceIds.length;
  const missedEvidences = caseData.evidences?.filter(e => !discoveredEvidenceIds.includes(e.id)) || [];

  const totalWitnesses = caseData.witnesses?.length || 0;
  const unlockedWitnessIds = caseState?.unlockedWitnessIds || [];
  const interviewedWitnessCount = unlockedWitnessIds.length;

  const totalTimelineEvents = caseData.timeline?.length || 0;
  const placedTimelineCount = Object.keys(caseState?.timelinePlacements || {}).length;

  const selectedEvidenceCount = submittedReport?.selectedEvidenceIds?.length || 0;

  // Performance metrics calculation
  const observationScore = Math.min(100, Math.round((discoveredEvidenceCount / Math.max(1, totalEvidences)) * 100));
  const evidenceUseScore = Math.min(100, Math.round((selectedEvidenceCount / Math.max(1, discoveredEvidenceCount)) * 100));
  const reasoningScore = score;
  const witnessScore = Math.min(100, Math.round((interviewedWitnessCount / Math.max(1, totalWitnesses)) * 100));
  const timelineScore = Math.min(100, Math.round((placedTimelineCount / Math.max(1, totalTimelineEvents)) * 100));

  const handleCopyReport = () => {
    const fullText = `
================================================================
UNESCO CYBER TRAINING LABS // OFFICIAL CASE RESOLUTION REPORT
================================================================
REPORT ID: ${reportId}
CASE TITLE: ${caseTitle}
TOPIC: ${caseTopic}
DATE: ${timestamp}
INVESTIGATOR: ${investigatorName}
ACADEMY SCORE: ${score}/100 [${grade}]
SPECIAL COMMENDATION: ${badgeAwarded}

CHIEF DETECTIVE VERDICT:
${verdict}

INVESTIGATION PERFORMANCE:
- Observation (Evidence Discovered): ${observationScore}% (${discoveredEvidenceCount}/${totalEvidences})
- Witness Interrogations: ${witnessScore}% (${interviewedWitnessCount}/${totalWitnesses})
- Timeline Reconstruction: ${timelineScore}% (${placedTimelineCount}/${totalTimelineEvents})

LEARNING OBJECTIVES VERIFIED:
${caseData.learningObjectives?.map(obj => `• ${obj}`).join('\n') || '• Digital literacy and fraud detection'}

PRACTICAL TAKEAWAYS:
${caseData.warningSigns?.map(sign => `• ${sign}`).join('\n') || '• Always verify independent channels before trusting offers.'}
================================================================
    `.trim();

    void navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 space-y-8 animate-fade-in text-slate-100 select-text">
      
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-white/15 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#ff8533]/20 text-[#ff8533] border border-[#ff8533]/30">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              Case Completed & Closed
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Official forensic audit, educational debriefing & case reflection
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyReport}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white transition-all flex items-center gap-2 cursor-pointer"
            title="Copy full text report"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#ffb829]" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white transition-all flex items-center gap-2 cursor-pointer"
            title="Export or print dossier"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export Report</span>
          </button>

          <button
            onClick={onConclude}
            className="btn-primary py-2 px-4 text-xs font-mono font-bold uppercase flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Case Library</span>
          </button>
        </div>
      </div>

      {/* Main Dossier Container */}
      <div className="relative bg-[#090d16] border-2 border-slate-700/80 rounded-[32px] p-6 sm:p-10 shadow-2xl space-y-10 overflow-hidden">
        
        {/* Top Gradient Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#ff8533] via-[#ffb829] to-emerald-400" />

        {/* 1. CINEMATIC "CASE CLOSED" STAMP & RESOLUTION HEADER */}
        <div className="relative border-b border-slate-800 pb-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff8533]/15 border border-[#ff8533]/40 text-[#ff8533] font-mono text-[11px] font-bold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CYBER DETECTIVE ACADEMY // CASE SOLVED</span>
              </div>
              
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {caseTitle}
              </h1>

              <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed">
                You successfully dismantled the social engineering operation, identified the threat actor (<strong className="text-[#ffb829]">{caseThreatActor}</strong>), and defended your findings before the Chief Detective.
              </p>
            </div>

            {/* Rubber Stamp Box */}
            <div className="relative group shrink-0">
              <div className="transform -rotate-6 border-4 border-emerald-500 bg-emerald-950/80 text-emerald-400 rounded-2xl p-5 text-center font-mono space-y-1 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse">
                <div className="text-2xl font-black tracking-widest uppercase border-b-2 border-emerald-500/60 pb-1">
                  CASE CLOSED
                </div>
                <div className="text-[10px] font-bold tracking-wider uppercase text-emerald-300 pt-1">
                  SOLVED & VERIFIED
                </div>
                <div className="text-[9px] text-emerald-400/80">{reportId}</div>
              </div>
            </div>

          </div>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 font-mono">
            <div className="text-center border-r border-slate-800/80 pr-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Evaluation Score</span>
              <span className="text-2xl sm:text-3xl font-black text-[#ffb829] mt-0.5 block">{score}<span className="text-xs text-slate-500">/100</span></span>
            </div>
            <div className="text-center md:border-r border-slate-800/80 pr-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Detective Rank</span>
              <span className="text-sm font-serif font-bold text-sky-400 mt-2 block truncate">{grade}</span>
            </div>
            <div className="text-center border-r border-slate-800/80 pr-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Field Reward</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">+250 XP</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Commendation</span>
              <span className="text-xs font-bold text-[#ff8533] mt-2 block truncate" title={badgeAwarded}>{badgeAwarded}</span>
            </div>
          </div>
        </div>

        {/* 2. WHAT YOU LEARNED (EDUCATIONAL CASE SPECIFICS) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-serif font-bold text-white border-b border-slate-800 pb-3">
            <Lightbulb className="w-5 h-5 text-[#ffb829]" />
            <span>What You Learned From This Case</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {caseData.learningObjectives?.map((obj, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-[#ff8533]/40 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ff8533] uppercase">
                  <Lightbulb className="w-4 h-4 text-[#ffb829]" />
                  <span>Key Objective #{idx + 1}</span>
                </div>
                <h4 className="font-serif text-sm font-bold text-white leading-snug">{obj}</h4>
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  You successfully applied this principle to evaluate field evidence, question witnesses, and uncover hidden motives.
                </p>
              </div>
            )) || (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ff8533] uppercase">
                  <Lightbulb className="w-4 h-4 text-[#ffb829]" />
                  <span>Social Manipulation Spotting</span>
                </div>
                <h4 className="font-serif text-sm font-bold text-white">Recognizing Unvetted Opportunities</h4>
                <p className="text-xs font-mono text-slate-400 leading-relaxed">
                  Learned to verify independent sources before trusting high-value claims or agreeing to urgent travel arrangements.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3. YOUR INVESTIGATION (WHAT YOU DID WELL) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-serif font-bold text-white border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Your Investigation Achievements</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            <div className="flex items-start gap-3 bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-4">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Identified Prime Threat Entity</span>
                <span className="text-slate-400 block mt-0.5">
                  Identified: <strong className="text-emerald-300">{submittedReport?.suspectEntity || caseThreatActor}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-4">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Discovered Key Evidence Files</span>
                <span className="text-slate-400 block mt-0.5">
                  Located <strong className="text-emerald-300">{discoveredEvidenceCount} of {totalEvidences}</strong> digital evidence files in the lab.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-4">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Confronted Key Witnesses</span>
                <span className="text-slate-400 block mt-0.5">
                  Interrogated <strong className="text-emerald-300">{interviewedWitnessCount} of {totalWitnesses}</strong> witnesses and detected contradictions.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-4">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Reconstructed Sequence of Events</span>
                <span className="text-slate-400 block mt-0.5">
                  Ordered <strong className="text-emerald-300">{placedTimelineCount} of {totalTimelineEvents}</strong> timeline incidents chronologically.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. WHAT YOU COULD HAVE DONE BETTER */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-serif font-bold text-white border-b border-slate-800 pb-3">
            <ShieldAlert className="w-5 h-5 text-[#ff8533]" />
            <span>What You Could Have Done Better</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {missedEvidences.length > 0 && (
              <div className="bg-[#ff8533]/10 border border-[#ff8533]/30 rounded-2xl p-4 text-slate-200 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#ff8533] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#ff8533] font-bold block uppercase">Overlooked Field Evidence</span>
                  <p className="mt-1 leading-relaxed">
                    You missed {missedEvidences.length} evidence file(s) in the lab. Cross-referencing all field evidence ensures zero blind spots when defending your theory.
                  </p>
                </div>
              </div>
            )}

            {placedTimelineCount < totalTimelineEvents && (
              <div className="bg-[#ffb829]/10 border border-[#ffb829]/30 rounded-2xl p-4 text-slate-200 flex items-start gap-3">
                <Compass className="w-5 h-5 text-[#ffb829] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#ffb829] font-bold block uppercase">Incomplete Timeline Sequence</span>
                  <p className="mt-1 leading-relaxed">
                    Leaving timeline events unplaced makes it harder to establish premeditation and exact sequence of deceit.
                  </p>
                </div>
              </div>
            )}

            {selectedEvidenceCount <= 1 && (
              <div className="bg-sky-500/10 border border-sky-500/30 rounded-2xl p-4 text-slate-200 flex items-start gap-3">
                <Zap className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sky-300 font-bold block uppercase">Single-Source Reliance</span>
                  <p className="mt-1 leading-relaxed">
                    A stronger investigation cites multiple corroborating evidence documents to prevent defense objections.
                  </p>
                </div>
              </div>
            )}

            {missedEvidences.length === 0 && placedTimelineCount === totalTimelineEvents && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-slate-200 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-emerald-400 font-bold block uppercase">Flawless Forensic Rigor</span>
                  <p className="mt-1 leading-relaxed">
                    Outstanding performance! You uncovered all field files, interviewed all witnesses, and established complete timeline continuity.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. MISSED CLUES SECTION (IF ANY) */}
        {missedEvidences.length > 0 && (
          <div className="space-y-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 text-base font-serif font-bold text-white border-b border-slate-800 pb-3">
              <HelpCircle className="w-5 h-5 text-[#ff8533]" />
              <span>Clues You Missed ({missedEvidences.length})</span>
            </div>

            <div className="grid grid-cols-1 gap-3 font-mono text-xs">
              {missedEvidences.map((ev) => (
                <div key={ev.id} className="bg-black/50 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#ff8533]">{ev.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-bold">
                      Importance: {ev.importance || 'High'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{ev.description}</p>
                  <p className="text-[10px] text-slate-500">
                    <strong>Discovery Method:</strong> {ev.unlockCondition || 'Inspect location hotspots or complete lead tasks'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. WHAT REALLY HAPPENED (CORRECT RECONSTRUCTION) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-serif font-bold text-white border-b border-slate-800 pb-3">
            <Layers className="w-5 h-5 text-sky-400" />
            <span>What Really Happened (Case Reconstruction)</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 font-mono text-xs">
            <p className="text-slate-300 leading-relaxed border-b border-slate-800/80 pb-3">
              Here is the true step-by-step chronology of how the threat actor orchestrated the deception:
            </p>

            <div className="space-y-3">
              {caseData.timeline?.sort((a, b) => a.orderIndex - b.orderIndex).map((evt, idx) => (
                <div key={evt.id} className="flex items-start gap-3 bg-black/40 border border-white/5 rounded-xl p-3.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold text-[11px] shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-[#ffb829] font-bold text-[11px]">{evt.time}</div>
                    <p className="text-slate-200 text-xs mt-0.5 leading-relaxed">{evt.description}</p>
                  </div>
                </div>
              )) || (
                <p className="text-slate-400">{caseData.introduction}</p>
              )}
            </div>
          </div>
        </div>

        {/* 7. YOUR THEORY VS. WHAT HAPPENED */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-serif font-bold text-white border-b border-slate-800 pb-3">
            <ArrowLeftRight className="w-5 h-5 text-[#ff8533]" />
            <span>Your Theory vs. What Happened</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {/* Player's Theory */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
              <span className="text-[#ff8533] font-bold uppercase tracking-wider block text-[11px] border-b border-slate-800 pb-2">
                YOUR SUBMITTED THEORY
              </span>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Primary Suspect</span>
                <span className="text-white font-bold">{submittedReport?.suspectEntity || 'Threat Entity'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Social Technique</span>
                <span className="text-white font-bold">{submittedReport?.modusOperandi || caseTopic}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Defense Argument</span>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-1 italic bg-black/40 p-3 rounded-xl border border-white/5">
                  "{submittedReport?.detectiveDefense || verdict}"
                </p>
              </div>
            </div>

            {/* Case Truth */}
            <div className="bg-slate-900/70 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
              <span className="text-emerald-400 font-bold uppercase tracking-wider block text-[11px] border-b border-slate-800 pb-2">
                ACTUAL CASE RECONSTRUCTION
              </span>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Actual Threat Actor</span>
                <span className="text-emerald-300 font-bold">{caseThreatActor}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Primary Attack Vector</span>
                <span className="text-emerald-300 font-bold">{caseData.manipulationTechniques?.[0] || caseTopic}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Chief Detective Feedback</span>
                <p className="text-slate-200 text-[11px] leading-relaxed mt-1 bg-black/40 p-3 rounded-xl border border-white/5">
                  {verdict}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 8. PERFORMANCE METRICS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-serif font-bold text-white border-b border-slate-800 pb-3">
            <Award className="w-5 h-5 text-[#ffb829]" />
            <span>Investigation Performance Breakdown</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-[#ff8533] font-bold">
                <span>Observation</span>
                <span>{observationScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#ff8533] rounded-full" style={{ width: `${observationScore}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-[#ffb829] font-bold">
                <span>Evidence Use</span>
                <span>{evidenceUseScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#ffb829] rounded-full" style={{ width: `${evidenceUseScore}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Reasoning</span>
                <span>{reasoningScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${reasoningScore}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sky-400 font-bold">
                <span>Source Evaluation</span>
                <span>{witnessScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: `${witnessScore}%` }} />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-purple-400 font-bold">
                <span>Critical Thinking</span>
                <span>{timelineScore}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: `${timelineScore}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 9. PRACTICAL TAKEAWAYS ("IF YOU ENCOUNTER SOMETHING SIMILAR") */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-serif font-bold text-white border-b border-slate-800 pb-3">
            <BookOpen className="w-5 h-5 text-[#ff8533]" />
            <span>If You Encounter Something Similar In Real Life</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
            {caseData.warningSigns?.map((sign, idx) => (
              <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ff8533]/20 text-[#ff8533] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-200 leading-relaxed">{sign}</span>
              </div>
            )) || (
              <>
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ff8533]/20 text-[#ff8533] font-bold shrink-0 mt-0.5">1</span>
                  <span className="text-slate-200 leading-relaxed">Verify organization and recruiter identities through official independent registry channels.</span>
                </div>
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ff8533]/20 text-[#ff8533] font-bold shrink-0 mt-0.5">2</span>
                  <span className="text-slate-200 leading-relaxed">Never send money or agree to unverified travel based on claims of "urgency" or "limited time".</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 10. "REMEMBER THIS" KEY TAKEAWAY BOX */}
        <div className="relative bg-gradient-to-r from-[#ff8533]/20 via-[#ffb829]/20 to-emerald-500/20 border-2 border-[#ff8533]/50 rounded-2xl p-6 text-center space-y-2 shadow-xl">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#ffb829] flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-[#ff8533]" />
            <span>REMEMBER THIS GOLDEN RULE</span>
          </div>
          <blockquote className="font-serif text-lg sm:text-xl font-bold text-white max-w-2xl mx-auto leading-snug">
            "A convincing promise or glossy contract is not proof that an opportunity is real. When something creates urgency, slow down and verify independently."
          </blockquote>
        </div>

        {/* Detailed Markdown Analysis if present */}
        {analysis && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-xl font-bold text-white">
                Chief Detective Detailed Forensic Evaluation
              </h2>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 font-mono text-xs text-slate-300">
              <div className="markdown-body">
                <Markdown>{analysis}</Markdown>
              </div>
            </div>
          </div>
        )}

        {/* Footer Certification */}
        <div className="pt-8 border-t border-slate-800 text-center font-mono text-xs text-slate-400 space-y-2">
          <p className="flex items-center justify-center gap-2 font-bold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AUDITED & COMMENDED BY CYBER DETECTIVE ACADEMY</span>
          </p>
          <p className="text-[11px] text-slate-500">
            This dossier serves as an educational certificate of critical thinking, evidence analysis, and digital fraud prevention.
          </p>
        </div>

      </div>

      {/* FINAL NAVIGATION BUTTON BAR */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        {onReplayCase && (
          <button
            onClick={onReplayCase}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/20 text-xs font-mono font-bold text-white transition-all flex items-center gap-2.5 cursor-pointer shadow-xl"
            title="Replay case to find missed clues"
          >
            <RotateCcw className="w-4 h-4 text-[#ff8533]" />
            <span>Investigate Again</span>
          </button>
        )}

        {onReviewInvestigation && (
          <button
            onClick={onReviewInvestigation}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/20 text-xs font-mono font-bold text-white transition-all flex items-center gap-2.5 cursor-pointer shadow-xl"
            title="Return to evidence lab to review discovered files"
          >
            <Compass className="w-4 h-4 text-sky-400" />
            <span>Review Investigation</span>
          </button>
        )}

        <button
          onClick={onConclude}
          className="btn-primary py-3.5 px-8 text-xs font-mono font-extrabold uppercase flex items-center gap-2.5 cursor-pointer shadow-2xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Try Another Case</span>
        </button>
      </div>

    </div>
  );
}
