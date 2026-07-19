import React, { useState } from 'react';
import { Folder, FileText, Lock, Unlock, Eye, Copy, FileCode, MessageSquare, Mail, Key, Check } from 'lucide-react';
import { Case } from '../types';

interface EvidenceViewerProps {
  caseData: Case;
  discoveredEvidenceIds: string[];
  activeEvidenceId: string | null;
  setActiveEvidenceId: (id: string) => void;
  onCopyToNotebook: (text: string) => void;
}

export default function EvidenceViewer({ 
  caseData, 
  discoveredEvidenceIds, 
  activeEvidenceId, 
  setActiveEvidenceId,
  onCopyToNotebook
}: EvidenceViewerProps) {
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4 text-[#bdbdbd]" />;
      case 'chat': return <MessageSquare className="h-4 w-4 text-[#ff8533]" />;
      case 'email': return <Mail className="h-4 w-4 text-[#ffb829]" />;
      case 'system_file': return <FileCode className="h-4 w-4 text-[#ffb829]" />;
      case 'crypto_fragment': return <Key className="h-4 w-4 text-[#5c7f5c]" />;
      case 'image': return <Eye className="h-4 w-4 text-[#ff8533]" />;
      default: return <FileText className="h-4 w-4 text-[#9a9a9a]" />;
    }
  };

  const getEvidenceTypeName = (type: string) => {
    switch (type) {
      case 'document': return 'OFFICIAL DOCUMENT';
      case 'chat': return 'CHAT TRANSCRIPT';
      case 'email': return 'EMAIL/POST SOURCE';
      case 'system_file': return 'SYSTEM DATA FILE';
      case 'crypto_fragment': return 'VERIFIED SIGNATURE';
      case 'image': return 'CASE ATTACHMENT';
      default: return 'CASE EVIDENCE FILE';
    }
  };

  const handleCopyText = (content: string) => {
    onCopyToNotebook(content);
    setCopiedTextId('copied');
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  const activeEvidence = caseData.evidences.find(e => e.id === activeEvidenceId);

  return (
    <div id="evidence-viewer-container" className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      {/* Evidence Side Panel */}
      <div className="md:col-span-1 rounded-[24px] border border-white/10 bg-[#000000] p-4 flex flex-col h-full min-h-[250px]">
        <h4 className="text-nav-label text-white mb-3 flex items-center gap-1.5 border-b border-white/5 pb-3">
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
                  if (isUnlocked) setActiveEvidenceId(evidence.id);
                }}
                className={`w-full text-left rounded-[24px] p-3.5 border transition-all duration-200 flex items-start gap-3 relative focus:outline-none cursor-pointer ${
                  !isUnlocked
                    ? 'border-white/5 bg-transparent text-[#9a9a9a]/40 cursor-not-allowed'
                    : isActive
                      ? 'border-[#ff8533] bg-[#ff8533]/10 text-white font-bold'
                      : 'border-white/5 bg-transparent text-[#bdbdbd] hover:border-white/20 hover:bg-white/5'
                }`}
                disabled={!isUnlocked}
              >
                {/* Visual side highlights */}
                {isUnlocked && isActive && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-[#ff8533]" />
                )}

                <div className={`mt-0.5 p-1 rounded-full ${
                  !isUnlocked 
                    ? 'bg-transparent border border-white/5' 
                    : isActive 
                      ? 'bg-[#ff8533]/20' 
                      : 'bg-white/5'
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
                  <h5 className={`text-xs font-semibold font-mono truncate ${
                    !isUnlocked ? 'text-[#9a9a9a]/40' : 'text-white'
                  }`}>
                    {evidence.name}
                  </h5>
                  {!isUnlocked && evidence.unlockCondition && (
                    <p className="text-[9px] text-[#ffb829] font-mono mt-1.5 flex items-center gap-1.5">
                      <Unlock className="h-2.5 w-2.5 shrink-0 animate-pulse" />
                      <span>Unlock with: {evidence.unlockCondition.includes('witness') || evidence.unlockCondition.includes('suspect') ? 'Witness Interrogation' : 'Investigation clues'}</span>
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Evidence Read Out Panel */}
      <div className="md:col-span-2 rounded-[24px] border border-white/10 bg-[#000000] p-5 flex flex-col h-full min-h-[300px]">
        {activeEvidence && discoveredEvidenceIds.includes(activeEvidence.id) ? (
          <div className="flex flex-col h-full animate-fade-in">
            {/* Active File Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-white/10 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="p-1 rounded-full bg-white/5 border border-white/10">
                    {getEvidenceIcon(activeEvidence.type)}
                  </span>
                  <span className="text-[9px] font-mono tracking-wider text-[#ff8533] bg-[#ff8533]/10 px-2.5 py-0.5 rounded-full border border-[#ff8533]/30 uppercase font-extrabold">
                    {getEvidenceTypeName(activeEvidence.type)}
                  </span>
                </div>
                <h4 className="text-heading-xs tracking-[-0.48px] text-white">{activeEvidence.name}</h4>
                <p className="text-[10px] text-[#9a9a9a] font-mono mt-0.5">EVIDENCE ID: {activeEvidence.id.toUpperCase()}</p>
              </div>

              {/* Action utilities */}
              <button
                onClick={() => handleCopyText(activeEvidence.content)}
                className={`flex items-center gap-1.5 text-xs font-mono border px-3 py-1.5 rounded-full transition-all focus:outline-none font-bold cursor-pointer ${
                  copiedTextId === 'copied'
                    ? 'bg-[#5c7f5c]/10 border-[#5c7f5c]/40 text-[#5c7f5c]'
                    : 'bg-[#ff8533] hover:bg-[#ff9955] border-transparent text-[#1e110a]'
                }`}
              >
                {copiedTextId === 'copied' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#5c7f5c]" />
                    <span>LOGGED TO NOTEBOOK</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>LOG TO NOTEBOOK</span>
                  </>
                )}
              </button>
            </div>

            {/* Evidence Description */}
            <p className="text-xs text-[#bdbdbd] bg-white/[0.02] border border-white/5 rounded-[24px] p-4.5 mb-4 leading-relaxed">
              <span className="text-[#ffb829] font-mono font-bold uppercase mr-1.5">CASE DETAIL:</span> 
              {activeEvidence.description}
            </p>

            {/* File Interactive Body View */}
            <div className="flex-1 bg-[#121214] border border-white/10 rounded-[24px] p-5 font-mono text-xs overflow-y-auto text-[#bdbdbd] leading-relaxed max-h-[250px] mb-4">
              <div className="flex items-center justify-between text-[10px] text-[#9a9a9a]/40 border-b border-white/5 pb-2.5 mb-4 font-mono">
                <span>INVESTIGATION TIMELINE // DATA FILE</span>
                <span>CASE DOSSIER REGISTRY</span>
              </div>
              
              <div className="space-y-1.5 whitespace-pre-wrap select-text">
                {activeEvidence.content.split('\n').map((line, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="text-[#9a9a9a]/30 select-none text-right w-8">{(idx + 1).toString().padStart(2, '0')}</span>
                    <span className="text-[#ffffff]">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MIL Gamified Verification Toolkit */}
            <div className="bg-[#1e110a]/50 border border-[#ff8533]/20 rounded-[24px] p-4 space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#ff8533]/15 pb-2">
                <span className="text-[10px] font-mono font-extrabold text-[#ff8533] uppercase tracking-wider flex items-center gap-1.5">
                  🛡️ MIL FORENSIC TOOLKIT
                </span>
                <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                  +50 XP PER COMPLETED ANALYSIS
                </span>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    const testId = `${activeEvidence.id}_source`;
                    if (!localStorage.getItem(testId)) {
                      localStorage.setItem(testId, 'true');
                      // Trigger a custom event to update XP in App.tsx
                      window.dispatchEvent(new CustomEvent('mil-xp-earned', { detail: { xp: 50, msg: 'Source Credibility Audited' } }));
                    }
                    alert(
                      activeEvidence.id === 'ev_spliced_video'
                        ? "🔍 SOURCE AUDIT RESULT:\n\n- Context-Splicing Detected: A 10-second snippet was carved from a 2-hour forum recording.\n- Metadata Check: Found artificial audio-wave cuts.\n- Credibility Score: 12% (Highly Distorted)"
                        : activeEvidence.id === 'ev_whois_record'
                        ? "🔍 SOURCE AUDIT RESULT:\n\n- Ownership Verification: ecoshieldnews.com is anonymously registered.\n- Hidden Affiliation: Billing profile lists Marcus Sterling (AquaGuard Filter Marketing).\n- Credibility Score: 0% (Direct Corporate Conflict of Interest!)"
                        : "🔍 SOURCE AUDIT RESULT:\n\n- Digital Signature: Synthesized file signature verified.\n- Audio Harvesting: Voice cloning model compiled via scraped YouTube addresses.\n- Credibility Score: 15% (Fabricated Biometrics)"
                    );
                  }}
                  className="py-2.5 px-3 rounded-full bg-black hover:bg-[#ff8533]/15 border border-[#ff8533]/30 hover:border-[#ff8533] text-xs font-mono font-bold text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  🔍 Source Audit
                </button>

                <button
                  onClick={() => {
                    const testId = `${activeEvidence.id}_bait`;
                    if (!localStorage.getItem(testId)) {
                      localStorage.setItem(testId, 'true');
                      window.dispatchEvent(new CustomEvent('mil-xp-earned', { detail: { xp: 50, msg: 'Emotional Bait Analyzed' } }));
                    }
                    alert(
                      activeEvidence.id === 'ev_eco_article'
                        ? "🧠 EMOTIONAL BIAS RADAR:\n\n- Sensation Meter: 98% (CRITICAL ALERT)\n- Hostility Level: Extreme\n- Manipulation Cues: Outrage spikes ('⚠️ URGENT WATER CRISIS', 'corrosive to skin', 'supermarket bottled-water panic'). Designed to bypass user logic through visceral terror."
                        : "🧠 EMOTIONAL BIAS RADAR:\n\n- Sensation Meter: 85% (HIGH)\n- Triggers Detected: Fabricated panic ('embezzlement emergency', 'classes cancelled', 'deep anxiety'). Utilized artificial authority voice vectors to bypass safety protocols."
                    );
                  }}
                  className="py-2.5 px-3 rounded-full bg-black hover:bg-[#ff8533]/15 border border-[#ff8533]/30 hover:border-[#ff8533] text-xs font-mono font-bold text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  🧠 Emotion Radar
                </button>

                <button
                  onClick={() => {
                    const testId = `${activeEvidence.id}_fact`;
                    if (!localStorage.getItem(testId)) {
                      localStorage.setItem(testId, 'true');
                      window.dispatchEvent(new CustomEvent('mil-xp-earned', { detail: { xp: 50, msg: 'Fact-Check Logs Query' } }));
                    }
                    alert(
                      activeEvidence.id === 'ev_whois_record' || activeEvidence.id === 'ev_marketing_ledger'
                        ? "🛡️ FACT-CHECK PORTAL CROSS-REFERENCE:\n\n- Municipal Database: Kyoto Municipal Water testing logs show 100% safety parameters (chlorine/bacteria 0.00%).\n- Verification Status: DEBUNKED. The EcoShield article is a commercial marketing fraud designed to sell domestic filter hardware."
                        : "🛡️ FACT-CHECK PORTAL CROSS-REFERENCE:\n\n- Forensic Archives: Original student forum footage shows Maya defending the project.\n- Verification Status: FALSIFIED. This 11-second audio has been digitally edited with context-splicing."
                    );
                  }}
                  className="py-2.5 px-3 rounded-full bg-black hover:bg-[#ff8533]/15 border border-[#ff8533]/30 hover:border-[#ff8533] text-xs font-mono font-bold text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  🛡️ Fact-Check DB
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#9a9a9a]">
            <Lock className="h-12 w-12 text-[#9a9a9a]/20 mb-3 animate-pulse" />
            <h5 className="text-nav-label text-[#9a9a9a] mb-1">Evidence Abstract Protected</h5>
            <p className="text-xs text-[#9a9a9a]/60 max-w-sm leading-relaxed font-mono">
              Please choose a discovered file from your cabinet. Node hotspots inspection or active witness records will reveal files here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
