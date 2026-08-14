import React, { useState, useRef, useEffect } from 'react';
import { User, Send, ShieldAlert, MessageSquare, Loader2, Check, Key, HelpCircle } from 'lucide-react';
import { Case, Witness } from '../types';
import { safeGet, safeSet } from '../lib/safeLookup';
import { getSuspectSketchArt } from '../utils/suspectSketches';
import { apiService } from '../services/apiService';
import { dispatchHonorUnlock } from '../data/achievements';

interface InterrogationTerminalProps {
  caseData: Case;
  unlockedWitnessIds: string[];
  discoveredEvidenceIds: string[];
  onUnlockWitness: (witnessId: string) => void;
  chatsState: Record<string, { sender: 'user' | 'witness'; text: string; timestamp: string; evidencePresented?: string }[]>;
  onAddMessage: (witnessId: string, sender: 'user' | 'witness', text: string, evidencePresented?: string) => void;
  onConfrontWitnessWithEvidence?: (witnessId: string, evidenceId: string) => void;
  onInterviewWitness?: (witnessId: string) => void;
  suspectClassifications?: Record<string, { classification: 'primary_suspect' | 'person_of_interest' | 'cleared'; reason: string }>;
  onClassifySuspect?: (witnessId: string, classification: 'primary_suspect' | 'person_of_interest' | 'cleared', reason: string) => void;
}

export default function InterrogationTerminal({
  caseData,
  unlockedWitnessIds,
  discoveredEvidenceIds,
  chatsState,
  onAddMessage,
  onConfrontWitnessWithEvidence,
  onInterviewWitness,
  suspectClassifications = {},
  onClassifySuspect
}: InterrogationTerminalProps) {
  const [selectedWitnessId, setSelectedWitnessId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [presentedEvidenceId, setPresentedEvidenceId] = useState<string | null>(null);
  const [trustLevels, setTrustLevels] = useState<Record<string, number>>({});
  const [isEditingReason, setIsEditingReason] = useState(false);
  const [pendingClassification, setPendingClassification] = useState<'primary_suspect' | 'person_of_interest' | 'cleared' | null>(null);
  const [customReason, setCustomReason] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatsState, selectedWitnessId, isTyping]);

  // Set first unlocked witness as default
  useEffect(() => {
    const firstUnlocked = caseData.witnesses.find(w => unlockedWitnessIds.includes(w.id));
    if (firstUnlocked && !selectedWitnessId) {
      setSelectedWitnessId(firstUnlocked.id);
    }
  }, [unlockedWitnessIds, caseData.witnesses, selectedWitnessId]);

  const activeWitness = caseData.witnesses.find(w => w.id === selectedWitnessId);
  const activeChat = selectedWitnessId ? safeGet(chatsState, selectedWitnessId) ?? [] : [];
  const activeTrust = selectedWitnessId ? safeGet(trustLevels, selectedWitnessId) ?? 40 : 40;
  const presentableEvidence = caseData.evidences.filter(evidence => discoveredEvidenceIds.includes(evidence.id));
  const presentedEvidence = presentableEvidence.find(evidence => evidence.id === presentedEvidenceId);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend ?? inputText;
    if (!messageText.trim() || !selectedWitnessId || !activeWitness) return;

    const currentEvidenceId = presentedEvidenceId;
    const currentEvidenceName = presentedEvidence ? presentedEvidence.name : undefined;

    // Complete witness lead only after meaningful conversation (3+ dialogue turns) or confrontation
    if (onInterviewWitness && (activeChat.length >= 3 || currentEvidenceId)) {
      onInterviewWitness(selectedWitnessId);
    }

    if (!textToSend) {
      setInputText('');
    }

    onAddMessage(selectedWitnessId, 'user', messageText, currentEvidenceName);
    setIsTyping(true);

    // Increase trust / rapport
    const currentTrust = safeGet(trustLevels, selectedWitnessId) ?? 40;
    const nextTrust = Math.min(100, currentTrust + 15);
    setTrustLevels(prev => safeSet(prev, selectedWitnessId, nextTrust));

    // Check if presenting evidence matches a confrontation trigger
    if (currentEvidenceId && activeWitness.confrontationTriggers) {
      const trigger = activeWitness.confrontationTriggers.find(t => t.evidenceId === currentEvidenceId);
      if (trigger) {
        setTimeout(() => {
          onAddMessage(selectedWitnessId, 'witness', `[CONFRONTED WITH EVIDENCE: ${currentEvidenceName}]: ${trigger.dialogueResponse}`);
          setIsTyping(false);
          setPresentedEvidenceId(null);

          if (onConfrontWitnessWithEvidence) {
            onConfrontWitnessWithEvidence(selectedWitnessId, currentEvidenceId);
          }

          window.dispatchEvent(new CustomEvent('mil-xp-earned', {
            detail: { xp: 150, msg: `Contradiction Discovered in ${activeWitness.name}'s Testimony!` }
          }));
          dispatchHonorUnlock('badge_interrogation_ace');
        }, 1200);
        return;
      }
    }

    try {
      const data = await apiService.sendWitnessMessage({
        witnessId: selectedWitnessId,
        caseId: caseData.id,
        chatHistory: activeChat,
        userQuestion: messageText,
        witnessName: activeWitness.name,
        witnessRole: activeWitness.role,
        witnessKnowledge: activeWitness.promptKnowledge,
        evidencePresented: presentedEvidence ? {
          name: presentedEvidence.name,
          excerpt: presentedEvidence.content.slice(0, 700)
        } : null
      });

      if (data.text) {
        onAddMessage(selectedWitnessId, 'witness', data.text);
      } else {
        onAddMessage(selectedWitnessId, 'witness', "I have answered all I know about this matter.");
      }
    } catch (e) {
      console.error(e);
      onAddMessage(selectedWitnessId, 'witness', "I won't speak without my legal representative if you keep asking contradictory questions.");
    } finally {
      setIsTyping(false);
      setPresentedEvidenceId(null);
    }
  };

  const getInterrogationPrompts = (witness: Witness) => {
    return [
      `Where were you during the time of the incident?`,
      `Who provided you with these instructions or access codes?`,
      `How do you explain the contradiction in the official logs?`
    ];
  };

  return (
    <div id="interrogation-terminal" className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full text-white">
      {/* Witness Roster Side Panel */}
      <div className="md:col-span-1 rounded-[24px] border border-white/10 glass-panel bg-slate-900/80 p-4 flex flex-col h-full min-h-[220px] shadow-2xl">
        <h4 className="text-xs font-mono font-bold text-white mb-3 flex items-center gap-2 border-b border-white/10 pb-3 uppercase tracking-wider">
          <User className="h-4 w-4 text-[#ff8533]" />
          Interrogation Roster
        </h4>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {caseData.witnesses.map((witness) => {
            const isUnlocked = unlockedWitnessIds.includes(witness.id);
            const isSelected = selectedWitnessId === witness.id;

            return (
              <button
                key={witness.id}
                onClick={() => {
                  if (isUnlocked) setSelectedWitnessId(witness.id);
                }}
                className={`w-full text-left rounded-2xl p-3 border transition-all duration-200 flex gap-3 items-center focus:outline-none cursor-pointer ${
                  !isUnlocked
                    ? 'border-white/5 bg-black/20 text-slate-600 cursor-not-allowed'
                    : isSelected
                      ? 'border-[#ff8533] bg-[#ff8533]/10 text-white font-bold shadow-lg shadow-[#ff8533]/5'
                      : 'border-white/10 bg-black/40 text-slate-300 hover:border-white/20 hover:bg-black/60'
                }`}
                disabled={!isUnlocked}
              >
                <div className="relative shrink-0">
                  <img 
                    src={getSuspectSketchArt(witness.name, witness.avatar)} 
                    alt={witness.name}
                    className={`h-11 w-11 rounded-full object-cover border ${
                      !isUnlocked 
                        ? 'border-white/10 filter grayscale opacity-40' 
                        : isSelected 
                          ? 'border-[#ff8533]' 
                          : 'border-white/20'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                      <ShieldAlert className="h-4 w-4 text-amber-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className={`text-xs font-bold font-serif truncate ${
                      !isUnlocked ? 'text-slate-500' : 'text-white'
                    }`}>
                      {witness.name}
                    </h5>
                    {witness.suspicionLevel && isUnlocked && (
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-black ${
                        witness.suspicionLevel === 'Prime Suspect' 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : witness.suspicionLevel === 'Suspect'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {witness.suspicionLevel}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono truncate text-slate-400 mt-0.5">{witness.role}</p>
                  
                  {!isUnlocked && (
                    <span className="text-[8px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20 mt-1 inline-block uppercase tracking-wider font-bold">
                      LOCKED WITNESS
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interrogation Console */}
      <div className="md:col-span-2 rounded-[24px] border border-white/10 glass-panel bg-slate-900/80 p-5 flex flex-col h-full min-h-[350px] shadow-2xl">
        {activeWitness && unlockedWitnessIds.includes(activeWitness.id) ? (
          <div className="flex flex-col h-full animate-fade-in">
            {/* Header / Profile info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={getSuspectSketchArt(activeWitness.name, activeWitness.avatar)} 
                  alt={activeWitness.name}
                  className="h-11 w-11 rounded-full object-cover border-2 border-[#ff8533]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-sm font-bold font-serif text-white flex items-center gap-2">
                    {activeWitness.name}
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{activeWitness.role}</p>
                </div>
              </div>

              {/* Rapport / Trust level */}
              <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-3">
                <div>
                  <div className="flex justify-between text-[9px] font-mono font-bold mb-1">
                    <span className="text-slate-400 uppercase">COOPERATION RAPPORT</span>
                    <span className="text-[#ff8533]">{activeTrust}%</span>
                  </div>
                  <div className="w-24 bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#ff8533] h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${activeTrust}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Brief */}
            <p className="text-xs text-slate-300 bg-white/5 border border-white/10 rounded-2xl p-3 mb-3 leading-relaxed font-sans">
              <span className="font-mono text-[#ff8533] font-bold uppercase mr-1.5">DOSSIER NOTES:</span>
              {activeWitness.description}
            </p>

            {/* Suspect Classification Bar for Automated Case Report */}
            {activeWitness && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 mb-3 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#ff8533] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#ff8533]" /> Investigative Status
                  </span>
                  {suspectClassifications[activeWitness.id] && (
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      suspectClassifications[activeWitness.id].classification === 'primary_suspect'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : suspectClassifications[activeWitness.id].classification === 'person_of_interest'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {suspectClassifications[activeWitness.id].classification.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingClassification('primary_suspect');
                      setIsEditingReason(true);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                      suspectClassifications[activeWitness.id]?.classification === 'primary_suspect'
                        ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                        : 'bg-black/40 text-slate-300 border-white/10 hover:border-rose-500/50'
                    }`}
                  >
                    <span>🎯 Mark Primary Suspect</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPendingClassification('person_of_interest');
                      setIsEditingReason(true);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                      suspectClassifications[activeWitness.id]?.classification === 'person_of_interest'
                        ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                        : 'bg-black/40 text-slate-300 border-white/10 hover:border-amber-500/50'
                    }`}
                  >
                    <span>🔍 Person of Interest</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onClassifySuspect) {
                        onClassifySuspect(activeWitness.id, 'cleared', 'Testimony verified & cleared');
                      }
                      setIsEditingReason(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                      suspectClassifications[activeWitness.id]?.classification === 'cleared'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                        : 'bg-black/40 text-slate-300 border-white/10 hover:border-emerald-500/50'
                    }`}
                  >
                    <span>✓ Clear / Uninvolved</span>
                  </button>
                </div>

                {/* Reason Prompt Selection */}
                {isEditingReason && pendingClassification && (
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-300 block">
                      Why do you mark {activeWitness.name} as {pendingClassification.replace('_', ' ')}?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {[
                        "Statement contradicts physical evidence/ticket",
                        "Direct contact with victim during critical window",
                        "Story changed significantly during questioning",
                        "Evidence connects them to fraudulent credentials",
                        "Recruitment claims are unverified"
                      ].map((r, rIdx) => (
                        <button
                          key={rIdx}
                          type="button"
                          onClick={() => {
                            if (onClassifySuspect && activeWitness) {
                              onClassifySuspect(activeWitness.id, pendingClassification, r);
                            }
                            setIsEditingReason(false);
                            setPendingClassification(null);
                          }}
                          className="text-left px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-slate-800 border border-white/10 text-[10px] text-slate-300 hover:text-white cursor-pointer"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={customReason}
                        onChange={(e) => { setCustomReason(e.target.value); }}
                        placeholder="Or enter custom reason..."
                        className="flex-1 bg-black/60 border border-white/15 rounded-lg px-3 py-1 text-[11px] text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (onClassifySuspect && activeWitness) {
                            onClassifySuspect(activeWitness.id, pendingClassification, customReason || 'Investigative deduction from interrogation');
                          }
                          setIsEditingReason(false);
                          setCustomReason('');
                          setPendingClassification(null);
                        }}
                        className="px-3 py-1 bg-[#ff8533] text-black font-bold rounded-lg text-[10px] cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}

                {suspectClassifications[activeWitness.id]?.reason && !isEditingReason && (
                  <p className="text-[10px] text-slate-300 italic bg-black/40 p-2 rounded-lg border border-white/5">
                    <strong>Report Reason:</strong> "{suspectClassifications[activeWitness.id].reason}"
                  </p>
                )}
              </div>
            )}

            {/* Evidence Challenge Toolbar */}
            <div className="mb-3 rounded-2xl border border-[#8052ff]/30 bg-[#8052ff]/10 p-3">
              <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-mono font-bold uppercase text-[#ffb829]">
                <span className="flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-[#ff8533]" /> Present Evidence to Challenge Statement
                </span>
                {presentedEvidence && (
                  <span className="text-emerald-400 font-black animate-pulse">EVIDENCE ATTACHED</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {presentableEvidence.map(evidence => {
                  const selected = presentedEvidenceId === evidence.id;
                  return (
                    <button
                      key={evidence.id}
                      type="button"
                      onClick={() => { setPresentedEvidenceId(selected ? null : evidence.id); }}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        selected 
                          ? 'border-[#ff8533] bg-[#ff8533] text-[#1e110a] shadow-lg shadow-[#ff8533]/20' 
                          : 'border-white/15 bg-black/40 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      {selected && <Check className="h-3 w-3 text-emerald-400" />}
                      {evidence.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Transcript Area */}
            <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 mb-3 overflow-y-auto space-y-3 max-h-[200px]">
              {activeChat.length === 0 ? (
                <div className="text-center py-6 text-slate-500 font-mono text-xs">
                  <span>[INTERROGATION CHANNEL ESTABLISHED]</span>
                  <p className="mt-1 text-slate-500">Select a question or present evidence to begin questioning.</p>
                </div>
              ) : (
                activeChat.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed border ${
                      msg.sender === 'user'
                        ? 'bg-[#ff8533] border-transparent text-[#1e110a] font-bold shadow-md'
                        : msg.text.includes('CONFRONTED')
                          ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 font-mono'
                          : 'bg-white/5 border-white/10 text-white font-mono'
                    }`}>
                      <div className="flex items-center justify-between text-[8px] opacity-70 font-mono mb-1 gap-3">
                        <span className="tracking-wider uppercase font-bold">{msg.sender === 'user' ? 'INVESTIGATOR' : activeWitness.name}</span>
                        {msg.evidencePresented && (
                          <span className="text-[#ffb829] font-black">[ATTACHED: {msg.evidencePresented}]</span>
                        )}
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-slate-400 flex items-center gap-2 shadow-sm">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#ff8533]" />
                    <span>ANALYZING TESTIMONY RESPONSE...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Interrogation Quick Questions */}
            <div className="mb-3">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#ff8533] mb-1.5 font-bold uppercase">
                <HelpCircle className="h-3.5 w-3.5" /> Quick Questioning Angles:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getInterrogationPrompts(activeWitness).map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isTyping}
                    className="text-[10px] font-mono text-slate-300 bg-black/40 border border-white/10 hover:border-[#ff8533] hover:text-white rounded-full px-3 py-1 transition-all text-left max-w-full truncate focus:outline-none disabled:opacity-50 cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleSendMessage();
                }}
                placeholder={`Ask ${activeWitness.name} a question...`}
                className="flex-1 bg-black/60 border border-white/15 focus:border-[#ff8533] rounded-full px-4 py-2 text-xs outline-none text-white placeholder:text-slate-500 transition-colors font-mono"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isTyping || !inputText.trim()}
                className="bg-[#ff8533] hover:bg-[#ff9955] text-[#1e110a] disabled:opacity-40 rounded-full px-5 flex items-center justify-center font-bold cursor-pointer transition-all shadow-md"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <MessageSquare className="h-12 w-12 text-slate-600 mb-3 animate-pulse" />
            <h5 className="text-sm font-bold font-serif text-white mb-1">Select Witness for Interrogation</h5>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-mono">
              Select an unlocked witness from the roster on the left to initiate questioning and present evidence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
