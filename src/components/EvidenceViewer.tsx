import React, { useState } from 'react';
import { Folder, FileText, Lock, Unlock, Eye, Copy, FileCode, MessageSquare, Mail, Key, Check, Search, Clock3, Fingerprint, Globe, Volume2, ArrowLeftRight, ShieldAlert, HelpCircle, Layers, Award, Brain, Lightbulb } from 'lucide-react';
import { Case, Evidence } from '../types';

interface EvidenceViewerProps {
  caseData: Case;
  discoveredEvidenceIds: string[];
  activeEvidenceId: string | null;
  setActiveEvidenceId: (id: string) => void;
  onCopyToNotebook: (text: string) => void;
  onCompleteLeadByEvidence?: (evidenceId: string, pointId?: string, revealsLeadId?: string) => void;
  keyEvidenceTags?: Record<string, { isKey: boolean; justification?: string }>;
  onToggleKeyEvidence?: (evidenceId: string, isKey: boolean, justification?: string) => void;
}

type ConfidenceLevel = 'unverified' | 'possible' | 'strong' | 'false_lead';

export default function EvidenceViewer({ 
  caseData, 
  discoveredEvidenceIds, 
  activeEvidenceId, 
  setActiveEvidenceId,
  onCopyToNotebook,
  onCompleteLeadByEvidence,
  keyEvidenceTags = {},
  onToggleKeyEvidence
}: EvidenceViewerProps) {
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<{ type: 'source' | 'emotion' | 'fact' | null; content: string | null }>({ type: null, content: null });
  const [inspectedPointIds, setInspectedPointIds] = useState<string[]>([]);

  // Evidence Comparison Mode State
  const [isComparing, setIsComparing] = useState(false);
  const [compareTargetId, setCompareTargetId] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<{
    title: string;
    type: 'contradiction' | 'corroboration' | 'neutral';
    details: string;
  } | null>(null);

  // Confidence Tagging State per Evidence ID
  const [confidenceTags, setConfidenceTags] = useState<Record<string, ConfidenceLevel>>({});

  // Reasoning & Hypothesis Builder State
  const [isHypothesisMode, setIsHypothesisMode] = useState(false);
  const [selectedHypothesisIndex, setSelectedHypothesisIndex] = useState<number>(0);
  const [selectedEvidenceForClaim, setSelectedEvidenceForClaim] = useState<string[]>([]);
  const [hypothesisEvaluation, setHypothesisEvaluation] = useState<{
    success: boolean;
    title: string;
    feedback: string;
  } | null>(null);

  // Key Evidence Tagging Modal State
  const [showKeyEvidenceModal, setShowKeyEvidenceModal] = useState(false);
  const [keyEvidenceJustification, setKeyEvidenceJustification] = useState('');

  // Reset verification pane when active evidence changes
  React.useEffect(() => {
    setActiveAnalysis({ type: null, content: null });
    setIsComparing(false);
    setCompareTargetId(null);
    setComparisonResult(null);
  }, [activeEvidenceId]);

  const activeEvidence = caseData.evidences.find(e => e.id === activeEvidenceId);

  // Available hypothesis claims for current case
  const availableHypotheses = [
    {
      id: 'claim_shell_company',
      title: 'The offering entity is an unregistered offshore shell company using spoofed branding.',
      supportingIds: activeEvidence ? [activeEvidence.id] : []
    },
    {
      id: 'claim_coerced_identity',
      title: 'The communication channel uses social pressure vectors and falsified urgency indicators.',
      supportingIds: activeEvidence ? [activeEvidence.id] : []
    },
    {
      id: 'claim_unlawful_transit',
      title: 'The victim was lured into traveling on a tourist transit visa without a legal work permit.',
      supportingIds: activeEvidence ? [activeEvidence.id] : []
    }
  ];

  const handleSetConfidence = (evidenceId: string, level: ConfidenceLevel) => {
    setConfidenceTags(prev => ({ ...prev, [evidenceId]: level }));
    const labelMap: Record<ConfidenceLevel, string> = {
      unverified: 'Unverified / Suspicious',
      possible: 'Possible Lead',
      strong: 'Strong Evidence',
      false_lead: 'False Lead / Distraction'
    };
    onCopyToNotebook(`Evidence Confidence Tagged — ${caseData.evidences.find(e => e.id === evidenceId)?.name}: Classified as [${labelMap[level]}]`);
    window.dispatchEvent(new CustomEvent('mil-xp-earned', {
      detail: { xp: 15, msg: `Evidence Classified: ${labelMap[level]}` }
    }));
  };

  const handleCompareEvidence = (targetId: string) => {
    setCompareTargetId(targetId);
    const targetEv = caseData.evidences.find(e => e.id === targetId);
    if (!activeEvidence || !targetEv) return;

    let resTitle = 'Comparative Evidence Analysis';
    let resType: 'contradiction' | 'corroboration' | 'neutral' = 'contradiction';
    let resDetail = '';

    // Smart logic checking discrepancies or corroborations between active & target
    if (
      (activeEvidence.name.toLowerCase().includes('offer') && targetEv.name.toLowerCase().includes('registry')) ||
      (targetEv.name.toLowerCase().includes('offer') && activeEvidence.name.toLowerCase().includes('registry'))
    ) {
      resType = 'contradiction';
      resTitle = '🚨 CRITICAL CONTRADICTION UNCOVERED';
      resDetail = `The official document name "${activeEvidence.name}" claims an established corporate entity in Silicon Valley, whereas "${targetEv.name}" shows a domain WHOIS age of only 12 days registered under an anonymized shell address in an offshore tax haven.`;
    } else if (
      (activeEvidence.name.toLowerCase().includes('chat') && targetEv.name.toLowerCase().includes('ticket')) ||
      (targetEv.name.toLowerCase().includes('chat') && activeEvidence.name.toLowerCase().includes('ticket'))
    ) {
      resType = 'contradiction';
      resTitle = '⚡ TIMELINE & VISA MISMATCH DETECTED';
      resDetail = `The chat records instruct immediate travel under a 30-day Tourist Visa claiming work permits can be swapped later, but the transit ticket & embassy advisory specify that entering a foreign country for employment without a prior work visa is illegal and high risk for passport seizure.`;
    } else if (
      (activeEvidence.metadata?.ipAddress && targetEv.metadata?.ipAddress && activeEvidence.metadata.ipAddress === targetEv.metadata.ipAddress) ||
      (activeEvidence.source === targetEv.source && activeEvidence.source !== undefined)
    ) {
      resType = 'corroboration';
      resTitle = '🔗 CROSS-FILE CORROBORATION CONFIRMED';
      resDetail = `Both "${activeEvidence.name}" and "${targetEv.name}" trace back to the exact same anonymized proxy IP server (${activeEvidence.metadata?.ipAddress || '198.51.100.42'}), proving they originate from the same syndicate threat actor.`;
    } else {
      resType = 'neutral';
      resTitle = '🔍 COMPARATIVE OBSERVATION';
      resDetail = `Comparing "${activeEvidence.name}" and "${targetEv.name}" confirms both items were retrieved from the victim's digital footprint during the 48-hour timeline window. Keep investigating to find direct contradictions.`;
    }

    setComparisonResult({ title: resTitle, type: resType, details: resDetail });
    onCopyToNotebook(`Evidence Comparison (${activeEvidence.name} vs ${targetEv.name}): ${resTitle} — ${resDetail}`);

    window.dispatchEvent(new CustomEvent('mil-xp-earned', {
      detail: { xp: 50, msg: `Evidence Cross-Comparison Completed` }
    }));

    if (onCompleteLeadByEvidence) {
      onCompleteLeadByEvidence(activeEvidence.id);
    }
  };

  const handleEvaluateHypothesis = () => {
    if (!activeEvidence) return;
    const currentClaim = availableHypotheses[selectedHypothesisIndex];

    if (selectedEvidenceForClaim.length === 0) {
      setHypothesisEvaluation({
        success: false,
        title: 'Select Supporting Evidence',
        feedback: 'Please check at least one piece of evidence from your cabinet to support this claim.'
      });
      return;
    }

    // Check if player selected reasonable evidence
    const isSupported = selectedEvidenceForClaim.some(id => {
      const ev = caseData.evidences.find(e => e.id === id);
      return ev?.importance === 'Critical' || ev?.importance === 'High' || id === activeEvidence.id;
    });

    if (isSupported) {
      setHypothesisEvaluation({
        success: true,
        title: 'Deduction Validated!',
        feedback: `Your reasoning is logically supported by the evidence collected. Claim logged in Case File: "${currentClaim.title}"`
      });
      onCopyToNotebook(`VERIFIED DEDUCTION: ${currentClaim.title} (Supported by ${selectedEvidenceForClaim.map(id => caseData.evidences.find(e => e.id === id)?.name).join(', ')})`);
      window.dispatchEvent(new CustomEvent('mil-xp-earned', {
        detail: { xp: 75, msg: `Deduction Validated: +75 XP` }
      }));
      if (onCompleteLeadByEvidence) {
        onCompleteLeadByEvidence(activeEvidence.id);
      }
    } else {
      setHypothesisEvaluation({
        success: false,
        title: 'Insufficient Proof',
        feedback: 'The evidence selected does not directly prove this claim. Look closer at domain age, visa records, or contract wording.'
      });
    }
  };

  const handleInspectPoint = (pointId: string, label: string, detail: string, revealsLeadId?: string) => {
    if (inspectedPointIds.includes(pointId)) return;
    const nextInspected = [...inspectedPointIds, pointId];
    setInspectedPointIds(nextInspected);
    onCopyToNotebook(`Forensic Inspection — ${activeEvidence?.name || 'Evidence'}: ${label} (${detail})`);
    
    window.dispatchEvent(new CustomEvent('mil-xp-earned', {
      detail: { xp: 25, msg: `Critical Detail Uncovered: ${label}` }
    }));

    // Complete lead strictly when all inspectable points are examined or when lead is explicitly revealed
    const inspectableCount = activeEvidence?.inspectablePoints?.length || 0;
    const isFullyInspected = inspectableCount > 0 ? nextInspected.length >= inspectableCount : true;

    if (onCompleteLeadByEvidence && activeEvidence && (isFullyInspected || revealsLeadId)) {
      onCompleteLeadByEvidence(activeEvidence.id, pointId, revealsLeadId);
    }
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4 text-[#bdbdbd]" />;
      case 'chat': return <MessageSquare className="h-4 w-4 text-[#ff8533]" />;
      case 'email': return <Mail className="h-4 w-4 text-[#ffb829]" />;
      case 'system_file': return <FileCode className="h-4 w-4 text-[#ffb829]" />;
      case 'crypto_fragment': return <Key className="h-4 w-4 text-[#5c7f5c]" />;
      case 'image': return <Eye className="h-4 w-4 text-[#ff8533]" />;
      case 'audio': return <Volume2 className="h-4 w-4 text-[#a855f7]" />;
      case 'website': return <Globe className="h-4 w-4 text-[#38bdf8]" />;
      default: return <FileText className="h-4 w-4 text-[#9a9a9a]" />;
    }
  };

  const getEvidenceTypeName = (type: string) => {
    switch (type) {
      case 'document': return 'OFFICIAL CONTRACT / DOCUMENT';
      case 'chat': return 'ENCRYPTED CHAT LOG';
      case 'email': return 'SPOOFED EMAIL SOURCE';
      case 'system_file': return 'SYSTEM METADATA FILE';
      case 'crypto_fragment': return 'VERIFIED SIGNATURE';
      case 'image': return 'IMAGE & AVATAR FORENSICS';
      case 'audio': return 'AUDIO SPECTROGRAM';
      case 'website': return 'DOMAIN WHOIS CODE';
      default: return 'CASE EVIDENCE FILE';
    }
  };

  const handleCopyText = () => {
    if (!activeEvidence) return;
    const excerpt = activeEvidence.content.split('\n')[0];
    onCopyToNotebook(`Evidence "${activeEvidence.name}": ${excerpt}`);
    setCopiedTextId('copied');
    setTimeout(() => { setCopiedTextId(null); }, 2000);
  };

  return (
    <div id="evidence-viewer-container" className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full text-white">
      {/* Evidence Side Cabinet */}
      <div className="md:col-span-1 rounded-[24px] border border-white/15 glass-panel bg-slate-900/70 p-4 flex flex-col h-full min-h-[250px]">
        <h4 className="text-xs font-mono font-bold text-white mb-3 flex items-center gap-2 border-b border-white/10 pb-3 uppercase tracking-wider">
          <Folder className="h-4 w-4 text-[#ff8533]" />
          Evidence Cabinet
        </h4>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {caseData.evidences.map((evidence) => {
            const isUnlocked = discoveredEvidenceIds.includes(evidence.id);
            const isActive = activeEvidenceId === evidence.id;

            return (
              <button
                key={evidence.id}
                onClick={() => {
                  if (isUnlocked) {
                    setActiveEvidenceId(evidence.id);
                  }
                }}
                className={`w-full text-left rounded-2xl p-3.5 border transition-all duration-200 flex items-start gap-3 relative focus:outline-none cursor-pointer ${
                  !isUnlocked
                    ? 'border-white/5 bg-transparent text-[#9a9a9a]/40 cursor-not-allowed'
                    : isActive
                      ? 'border-[#ff8533] bg-[#ff8533]/10 text-white font-bold shadow-md'
                      : 'border-white/5 bg-black/20 text-[#bdbdbd] hover:border-white/20 hover:bg-white/5'
                }`}
                disabled={!isUnlocked}
              >
                {isUnlocked && isActive && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-[#ff8533]" />
                )}

                <div className={`mt-0.5 p-1.5 rounded-xl border ${
                  !isUnlocked 
                    ? 'bg-transparent border-white/5' 
                    : isActive 
                      ? 'bg-[#ff8533]/20 border-[#ff8533]/40' 
                      : 'bg-white/5 border-white/5'
                }`}>
                  {!isUnlocked ? (
                    <Lock className="h-3.5 w-3.5 text-[#9a9a9a]/30" />
                  ) : (
                    getEvidenceIcon(evidence.type)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="text-[9px] font-mono tracking-wider opacity-60">
                      {getEvidenceTypeName(evidence.type)}
                    </span>
                    {isUnlocked ? (
                      <span className="text-[8px] font-mono text-[#5c7f5c] bg-[#5c7f5c]/10 px-1.5 py-0.5 rounded border border-[#5c7f5c]/30 uppercase tracking-widest font-extrabold">DISCOVERED</span>
                    ) : (
                      <span className="text-[8px] font-mono text-[#ffb829] bg-[#ffb829]/10 px-1.5 py-0.5 rounded border border-[#ffb829]/30 uppercase tracking-widest font-extrabold">LOCKED</span>
                    )}
                  </div>
                  <h5 className={`text-xs font-bold font-serif truncate ${
                    !isUnlocked ? 'text-[#9a9a9a]/40' : 'text-white'
                  }`}>
                    {evidence.name}
                  </h5>
                  {!isUnlocked && evidence.unlockCondition && (
                    <p className="text-[9px] text-[#ffb829] font-mono mt-1 flex items-center gap-1">
                      <Unlock className="h-2.5 w-2.5 shrink-0 animate-pulse" />
                      <span>{evidence.unlockCondition}</span>
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Evidence Interactive Inspection Console */}
      <div className="md:col-span-2 rounded-[24px] border border-white/15 glass-panel bg-slate-900/70 p-5 flex flex-col h-full min-h-[350px]">
        {activeEvidence && discoveredEvidenceIds.includes(activeEvidence.id) ? (
          <div className="flex flex-col h-full animate-fade-in">
            {/* Active File Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 border-b border-white/10 pb-4 mb-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="p-1.5 rounded-xl bg-white/5 border border-white/10">
                    {getEvidenceIcon(activeEvidence.type)}
                  </span>
                  <span className="text-[9px] font-mono tracking-wider text-[#ff8533] bg-[#ff8533]/10 px-2.5 py-0.5 rounded-full border border-[#ff8533]/30 uppercase font-black">
                    {activeEvidence.category || getEvidenceTypeName(activeEvidence.type)}
                  </span>
                  {activeEvidence.importance && (
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase font-black ${
                      activeEvidence.importance === 'Critical' 
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        : activeEvidence.importance === 'High'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                      {activeEvidence.importance} Importance
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold font-serif text-white">{activeEvidence.name}</h3>
              </div>

              {/* Copy / Log button & Compare Action */}
              <div className="flex flex-wrap items-center gap-2 max-w-full">
                <button
                  type="button"
                  onClick={() => setIsComparing(!isComparing)}
                  className={`flex items-center gap-1.5 text-xs font-mono border px-3.5 py-2 rounded-full transition-all focus:outline-none font-bold cursor-pointer ${
                    isComparing
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-800 hover:bg-slate-700 border-white/20 text-white'
                  }`}
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 text-amber-400" />
                  <span>{isComparing ? 'CLOSE COMPARE' : 'COMPARE FILES'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsHypothesisMode(!isHypothesisMode)}
                  className={`flex items-center gap-1.5 text-xs font-mono border px-3.5 py-2 rounded-full transition-all focus:outline-none font-bold cursor-pointer ${
                    isHypothesisMode
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                      : 'bg-slate-800 hover:bg-slate-700 border-white/20 text-white'
                  }`}
                >
                  <Brain className="h-3.5 w-3.5 text-purple-400" />
                  <span>FORM DEDUCTION</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onToggleKeyEvidence && activeEvidence) {
                      setKeyEvidenceJustification(keyEvidenceTags[activeEvidence.id]?.justification || "Document contains critical inconsistency or spoofed identity detail.");
                      setShowKeyEvidenceModal(true);
                    }
                  }}
                  className={`flex items-center gap-1.5 text-xs font-mono border px-3.5 py-2 rounded-full transition-all focus:outline-none font-bold cursor-pointer ${
                    keyEvidenceTags[activeEvidence.id]?.isKey
                      ? 'bg-[#ff8533] text-black border-[#ff8533] shadow-lg shadow-[#ff8533]/20'
                      : 'bg-slate-800 hover:bg-slate-700 border-white/20 text-slate-300'
                  }`}
                  title="Include prominently in final Case Conference report"
                >
                  <Award className="h-3.5 w-3.5 text-[#ffb829]" />
                  <span>{keyEvidenceTags[activeEvidence.id]?.isKey ? '⭐ KEY EVIDENCE TAGGED' : 'MARK AS KEY EVIDENCE'}</span>
                </button>

                <button
                  onClick={handleCopyText}
                  className={`flex items-center gap-1.5 text-xs font-mono border px-3.5 py-2 rounded-full transition-all focus:outline-none font-bold cursor-pointer ${
                    copiedTextId === 'copied'
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-[#ff8533] hover:bg-[#ff9955] border-transparent text-[#1e110a]'
                  }`}
                >
                  {copiedTextId === 'copied' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>LOGGED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>LOG TO NOTEBOOK</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Confidence Classifier Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-black/30 border border-white/10 rounded-2xl px-3.5 py-2 mb-3">
              <span className="text-[10px] font-mono uppercase text-[#9a9a9a] font-bold flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-[#ff8533]" />
                CLASSIFY EVIDENTIARY VALUE:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['unverified', 'possible', 'strong', 'false_lead'] as ConfidenceLevel[]).map((level) => {
                  const isCurrent = confidenceTags[activeEvidence.id] === level;
                  const labels: Record<ConfidenceLevel, { name: string; color: string }> = {
                    unverified: { name: '❓ Unverified', color: 'border-slate-500 text-slate-300 bg-slate-800/40' },
                    possible: { name: '🔍 Possible Lead', color: 'border-amber-500 text-amber-300 bg-amber-500/10' },
                    strong: { name: '🛡️ Strong Proof', color: 'border-emerald-500 text-emerald-300 bg-emerald-500/10' },
                    false_lead: { name: '🚫 Distraction', color: 'border-rose-500 text-rose-300 bg-rose-500/10' }
                  };
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleSetConfidence(activeEvidence.id, level)}
                      className={`text-[9px] font-mono px-2.5 py-1 rounded-full border transition-all cursor-pointer font-bold ${
                        isCurrent 
                          ? `${labels[level].color} ring-1 ring-white/30 shadow-sm scale-105` 
                          : 'border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {labels[level].name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evidence Comparison Panel */}
            {isComparing && (
              <div className="mb-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3.5 animate-fade-in space-y-3">
                <div className="flex justify-between items-center border-b border-amber-500/20 pb-2">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <ArrowLeftRight className="h-4 w-4 text-amber-400" />
                    Compare "{activeEvidence.name}" With Cabinet Item
                  </span>
                  <span className="text-[9px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                    REASONING ANALYSIS
                  </span>
                </div>

                <p className="text-xs text-amber-100/80 font-mono">
                  Select another discovered evidence file to perform cross-reference analysis:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {caseData.evidences
                    .filter(e => discoveredEvidenceIds.includes(e.id) && e.id !== activeEvidence.id)
                    .map(e => (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => handleCompareEvidence(e.id)}
                        className={`text-left text-xs font-mono p-2.5 rounded-xl border transition-all cursor-pointer truncate ${
                          compareTargetId === e.id
                            ? 'border-amber-400 bg-amber-400/20 text-white font-bold'
                            : 'border-white/10 bg-black/40 text-slate-300 hover:border-amber-400/50 hover:text-white'
                        }`}
                      >
                        📄 {e.name}
                      </button>
                    ))}
                </div>

                {comparisonResult && (
                  <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-3 text-xs font-mono space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between font-bold text-amber-300">
                      <span>{comparisonResult.title}</span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded uppercase">
                        {comparisonResult.type}
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{comparisonResult.details}</p>
                  </div>
                )}
              </div>
            )}

            {/* Deduction / Hypothesis Builder Mode */}
            {isHypothesisMode && (
              <div className="mb-4 rounded-2xl border border-purple-500/40 bg-purple-500/10 p-3.5 animate-fade-in space-y-3">
                <div className="flex justify-between items-center border-b border-purple-500/20 pb-2">
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-purple-400" />
                    Evidence-Based Hypothesis Builder
                  </span>
                  <span className="text-[9px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full font-bold">
                    DEDUCTION CLAIM
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-purple-200 uppercase tracking-wider block">
                    1. Select Investigation Claim / Hypothesis:
                  </label>
                  <select
                    value={selectedHypothesisIndex}
                    onChange={(e) => setSelectedHypothesisIndex(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-purple-500/30 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-purple-400 cursor-pointer"
                  >
                    {availableHypotheses.map((hyp, idx) => (
                      <option key={hyp.id} value={idx}>
                        {hyp.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-purple-200 uppercase tracking-wider block">
                    2. Select Supporting Evidence Files from Cabinet:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {caseData.evidences
                      .filter(e => discoveredEvidenceIds.includes(e.id))
                      .map(e => {
                        const isChecked = selectedEvidenceForClaim.includes(e.id);
                        return (
                          <button
                            key={e.id}
                            type="button"
                            onClick={() => {
                              setSelectedEvidenceForClaim(prev => 
                                isChecked ? prev.filter(i => i !== e.id) : [...prev, e.id]
                              );
                            }}
                            className={`text-left text-xs font-mono p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-1 ${
                              isChecked
                                ? 'border-purple-400 bg-purple-500/30 text-white font-bold'
                                : 'border-white/10 bg-black/40 text-slate-300 hover:border-purple-400/50'
                            }`}
                          >
                            <span className="truncate">{e.name}</span>
                            {isChecked && <Check className="h-3.5 w-3.5 text-purple-300 shrink-0" />}
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleEvaluateHypothesis}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold px-4 py-2 rounded-full transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Award className="h-3.5 w-3.5" />
                    VALIDATE DEDUCTION
                  </button>
                </div>

                {hypothesisEvaluation && (
                  <div className={`border rounded-xl p-3 text-xs font-mono space-y-1 animate-fade-in ${
                    hypothesisEvaluation.success
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                      : 'border-rose-500/50 bg-rose-500/10 text-rose-200'
                  }`}>
                    <div className="font-bold uppercase flex items-center gap-1.5">
                      {hypothesisEvaluation.success ? '✅ ' : '⚠️ '} {hypothesisEvaluation.title}
                    </div>
                    <p className="leading-relaxed">{hypothesisEvaluation.feedback}</p>
                  </div>
                )}
              </div>
            )}

            {/* Metadata Bar */}
            {(activeEvidence.source || activeEvidence.dateCollected || activeEvidence.metadata) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 bg-black/40 border border-white/5 rounded-2xl p-3 text-[11px] font-mono">
                {activeEvidence.source && (
                  <div>
                    <span className="text-[#9a9a9a]">Source: </span>
                    <span className="text-white font-semibold">{activeEvidence.source}</span>
                  </div>
                )}
                {activeEvidence.dateCollected && (
                  <div>
                    <span className="text-[#9a9a9a]">Collected: </span>
                    <span className="text-[#ffb829] font-semibold">{activeEvidence.dateCollected}</span>
                  </div>
                )}
                {activeEvidence.metadata?.ipAddress && (
                  <div>
                    <span className="text-[#9a9a9a]">IP Trace: </span>
                    <span className="text-cyan-400 font-semibold">{activeEvidence.metadata.ipAddress}</span>
                  </div>
                )}
                {activeEvidence.metadata?.domainAge && (
                  <div>
                    <span className="text-[#9a9a9a]">Domain Age: </span>
                    <span className="text-rose-400 font-semibold">{activeEvidence.metadata.domainAge}</span>
                  </div>
                )}
              </div>
            )}

            {/* Why it matters */}
            <p className="text-xs text-[#bdbdbd] bg-white/[0.03] border border-white/5 rounded-2xl p-3.5 mb-3 leading-relaxed">
              <span className="text-[#ffb829] font-mono font-bold uppercase mr-1.5">ANALYSIS SUMMARY:</span> 
              {activeEvidence.description}
            </p>

            {/* Inspectable Details Hotspot Panel */}
            {activeEvidence.inspectablePoints && activeEvidence.inspectablePoints.length > 0 && (
              <div className="mb-4 rounded-2xl border border-[#ffb829]/25 bg-[#ffb829]/[0.05] p-3.5">
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-extrabold uppercase text-[#ffb829]">
                    <Search className="h-3.5 w-3.5" /> Interactive Observation Hotspots
                  </div>
                  <span className="text-[9px] font-mono text-[#ffb829] bg-black/30 border border-[#ffb829]/30 px-2 py-0.5 rounded-full font-bold">
                    {inspectedPointIds.filter(id => activeEvidence.inspectablePoints?.some(p => p.id === id)).length}/{activeEvidence.inspectablePoints.length} DISCOVERED
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {activeEvidence.inspectablePoints.map((pt) => {
                    const inspected = inspectedPointIds.includes(pt.id);
                    return (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() => handleInspectPoint(pt.id, pt.label, pt.detail, pt.revealsLeadId)}
                        className={`flex flex-col text-left rounded-xl border p-2.5 text-[11px] font-mono transition-all cursor-pointer ${
                          inspected 
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' 
                            : 'border-white/10 bg-black/30 text-[#bdbdbd] hover:border-[#ffb829] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold flex items-center gap-1.5">
                            <Fingerprint className="h-3.5 w-3.5 text-[#ff8533]" />
                            {pt.label}
                          </span>
                          {inspected && <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                        </div>
                        {inspected && (
                          <p className="text-[10px] text-emerald-300 mt-1 border-t border-emerald-500/20 pt-1 leading-normal">
                            {pt.detail}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Interactive Raw Content Display */}
            <div className="flex-1 bg-[#0b0f19] border border-white/10 rounded-2xl p-4 font-mono text-xs overflow-y-auto text-[#bdbdbd] leading-relaxed max-h-[220px] mb-3">
              <div className="flex items-center justify-between text-[10px] text-[#9a9a9a]/50 border-b border-white/5 pb-2 mb-3">
                <span>EVIDENCE FILE READOUT // FORENSIC ARCHIVE</span>
                <span>ID: #{activeEvidence.id.toUpperCase()}</span>
              </div>
              
              <div className="space-y-1.5 whitespace-pre-wrap select-text">
                {activeEvidence.content.split('\n').map((line, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="text-[#9a9a9a]/30 select-none text-right w-6">{(idx + 1).toString().padStart(2, '0')}</span>
                    <span className="text-white">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Verification Toolkit */}
            <div className="bg-black/40 border border-[#ff8533]/20 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-mono font-extrabold text-[#ff8533] uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-[#ff8533]" />
                  EVIDENCE VERIFICATION LAB
                </span>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                  +50 XP PER VERIFICATION
                </span>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const testId = `${activeEvidence.id}_source`;
                    if (!localStorage.getItem(testId)) {
                      localStorage.setItem(testId, 'true');
                      window.dispatchEvent(new CustomEvent('mil-xp-earned', { detail: { xp: 50, msg: 'Source Credibility Audited' } }));
                    }
                    const text = `🔍 SOURCE & DOMAIN AUDIT RESULT:\n\n- Entity Authentication: ${activeEvidence.source || 'Unknown Source'}\n- IP Trace: ${activeEvidence.metadata?.ipAddress || 'Anonymized Proxy Server'}\n- Domain Age / File Signature: ${activeEvidence.metadata?.domainAge || 'Unverified External Domain'}\n- Credibility Score: 18% (High Risk / Fraud Indicator)`;
                    setActiveAnalysis({ type: 'source', content: text });
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#ff8533]/20 border border-white/10 hover:border-[#ff8533] text-xs font-mono font-bold text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  🔍 Source Audit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const testId = `${activeEvidence.id}_bait`;
                    if (!localStorage.getItem(testId)) {
                      localStorage.setItem(testId, 'true');
                      window.dispatchEvent(new CustomEvent('mil-xp-earned', { detail: { xp: 50, msg: 'Emotional Manipulation Analyzed' } }));
                    }
                    const text = `🧠 EMOTIONAL MANIPULATION RADAR:\n\n- Urgency Index: 95% (CRITICAL ALERT)\n- Pressure Vectors: Artificial deadlines, fear of loss, flattery.\n- Social Strategy: Bypassing logical reasoning using manufactured crisis.`;
                    setActiveAnalysis({ type: 'emotion', content: text });
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#ff8533]/20 border border-white/10 hover:border-[#ff8533] text-xs font-mono font-bold text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  🧠 Emotion Radar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const testId = `${activeEvidence.id}_fact`;
                    if (!localStorage.getItem(testId)) {
                      localStorage.setItem(testId, 'true');
                      window.dispatchEvent(new CustomEvent('mil-xp-earned', { detail: { xp: 50, msg: 'Database Cross-Referenced' } }));
                    }
                    const text = `🛡️ OFFICIAL FACT-CHECK DATABASE LOG:\n\n- Cross-Reference: Ministry & Cyber Crime Registry\n- Status: DEBUNKED / FRAUDULENT PATTERN IDENTIFIED\n- Matches known recruitment / phishing / deepfake attack signatures.`;
                    setActiveAnalysis({ type: 'fact', content: text });
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#ff8533]/20 border border-white/10 hover:border-[#ff8533] text-xs font-mono font-bold text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  🛡️ Fact-Check DB
                </button>
              </div>

              {/* Verification Report Output */}
              {activeAnalysis.type && activeAnalysis.content && (
                <div className="bg-black/80 border border-[#ff8533]/40 rounded-xl p-3.5 text-xs font-mono text-[#d9d2c9] space-y-1.5 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-white/10 pb-1.5 mb-1.5">
                    <span className="text-[#ffb829] font-bold uppercase">
                      {activeAnalysis.type === 'source' ? '🔍 Source Audit Report' : activeAnalysis.type === 'emotion' ? '🧠 Emotional Manipulation Radar' : '🛡️ Fact-Check Database Log'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveAnalysis({ type: null, content: null })}
                      className="text-[10px] text-[#9a9a9a] hover:text-white font-bold border border-white/10 px-2 py-0.5 rounded bg-white/5 cursor-pointer"
                    >
                      [x] CLOSE
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed select-text">
                    {activeAnalysis.content}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#9a9a9a]">
            <Lock className="h-12 w-12 text-[#9a9a9a]/20 mb-3 animate-pulse" />
            <h5 className="text-sm font-bold font-serif text-white mb-1">Select Discovered Evidence File</h5>
            <p className="text-xs text-[#9a9a9a] max-w-sm leading-relaxed font-mono">
              Choose a file from your evidence cabinet on the left. Uncover new evidence by pursuing investigation leads and exploring location hotspots.
            </p>
          </div>
        )}
      </div>

      {/* Key Evidence Tagging Modal */}
      {showKeyEvidenceModal && activeEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border-2 border-[#ff8533] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-white relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold font-serif flex items-center gap-2 text-[#ffb829]">
                <Award className="h-5 w-5 text-[#ff8533]" />
                Tag Key Evidence
              </h3>
              <button
                type="button"
                onClick={() => setShowKeyEvidenceModal(false)}
                className="text-slate-400 hover:text-white text-sm font-mono cursor-pointer px-2 py-1 rounded bg-white/5 border border-white/10"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950/80 border border-white/10 rounded-xl p-3 text-xs font-mono">
                <span className="text-slate-400">Selected File: </span>
                <span className="text-white font-bold">{activeEvidence.name}</span>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">
                  Detective Justification for Case Conference (Optional):
                </label>
                <textarea
                  rows={3}
                  value={keyEvidenceJustification}
                  onChange={(e) => setKeyEvidenceJustification(e.target.value)}
                  placeholder="Explain why this document contains critical inconsistency or spoofed identity detail..."
                  className="w-full bg-slate-950 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-[#ff8533] focus:ring-1 focus:ring-[#ff8533]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-white/10">
              {keyEvidenceTags[activeEvidence.id]?.isKey && (
                <button
                  type="button"
                  onClick={() => {
                    if (onToggleKeyEvidence) {
                      onToggleKeyEvidence(activeEvidence.id, false, '');
                    }
                    setShowKeyEvidenceModal(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-red-500/40 bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-mono font-bold cursor-pointer transition-all"
                >
                  REMOVE TAG
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowKeyEvidenceModal(false)}
                className="px-4 py-2 rounded-xl border border-white/20 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-mono font-bold cursor-pointer transition-all"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onToggleKeyEvidence) {
                    onToggleKeyEvidence(activeEvidence.id, true, keyEvidenceJustification || 'Critical case detail.');
                  }
                  setShowKeyEvidenceModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#ff8533] text-black hover:bg-[#ff9955] text-xs font-mono font-bold cursor-pointer shadow-lg transition-all"
              >
                CONFIRM KEY EVIDENCE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
