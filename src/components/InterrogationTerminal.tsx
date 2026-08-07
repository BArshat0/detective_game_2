import React, { useState, useRef, useEffect } from 'react';
import { User, Send, ShieldAlert, MessageSquare, Loader2, FileText, Check, AlertTriangle, Key, HelpCircle } from 'lucide-react';
import { Case, Witness } from '../types';
import { safeGet, safeSet } from '../lib/safeLookup';

interface InterrogationTerminalProps {
  caseData: Case;
  unlockedWitnessIds: string[];
  discoveredEvidenceIds: string[];
  onUnlockWitness: (witnessId: string) => void;
  chatsState: Record<string, { sender: 'user' | 'witness'; text: string; timestamp: string; evidencePresented?: string }[]>;
  onAddMessage: (witnessId: string, sender: 'user' | 'witness', text: string, evidencePresented?: string) => void;
  onConfrontWitnessWithEvidence?: (witnessId: string, evidenceId: string) => void;
  onInterviewWitness?: (witnessId: string) => void;
}

export default function InterrogationTerminal({
  caseData,
  unlockedWitnessIds,
  discoveredEvidenceIds,
  chatsState,
  onAddMessage,
  onConfrontWitnessWithEvidence,
  onInterviewWitness
}: InterrogationTerminalProps) {
  const [selectedWitnessId, setSelectedWitnessId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [presentedEvidenceId, setPresentedEvidenceId] = useState<string | null>(null);
  const [trustLevels, setTrustLevels] = useState<Record<string, number>>({});
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

    if (onInterviewWitness) {
      onInterviewWitness(selectedWitnessId);
    }

    if (!textToSend) {
      setInputText('');
    }

    const currentEvidenceId = presentedEvidenceId;
    const currentEvidenceName = presentedEvidence ? presentedEvidence.name : undefined;

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
        }, 1200);
        return;
      }
    }

    try {
      const response = await fetch('/api/witness-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        })
      });

      const data = await response.json();
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
      <div className="md:col-span-1 rounded-[24px] border border-white/15 glass-panel bg-slate-900/70 p-4 flex flex-col h-full min-h-[220px]">
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
                    ? 'border-white/5 bg-transparent text-[#9a9a9a]/30 cursor-not-allowed'
                    : isSelected
                      ? 'border-[#ff8533] bg-[#ff8533]/10 text-white font-bold'
                      : 'border-white/5 bg-black/20 text-[#bdbdbd] hover:border-white/20 hover:bg-white/5'
                }`}
                disabled={!isUnlocked}
              >
                <div className="relative shrink-0">
                  <img 
                    src={witness.avatar} 
                    alt={witness.name}
                    className={`h-11 w-11 rounded-full object-cover border ${
                      !isUnlocked 
                        ? 'border-white/5 filter grayscale opacity-30' 
                        : isSelected 
                          ? 'border-[#ff8533]' 
                          : 'border-white/20'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                      <ShieldAlert className="h-4 w-4 text-[#ffb829]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className={`text-xs font-bold font-serif truncate ${
                      !isUnlocked ? 'text-[#9a9a9a]/40' : 'text-white'
                    }`}>
                      {witness.name}
                    </h5>
                    {witness.suspicionLevel && isUnlocked && (
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-black ${
                        witness.suspicionLevel === 'Prime Suspect' 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                          : witness.suspicionLevel === 'Suspect'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {witness.suspicionLevel}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono truncate opacity-60 mt-0.5">{witness.role}</p>
                  
                  {!isUnlocked && (
                    <span className="text-[8px] font-mono text-[#ffb829] bg-[#ffb829]/10 px-1.5 py-0.5 rounded-full border border-[#ffb829]/30 mt-1 inline-block uppercase tracking-wider font-bold">
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
      <div className="md:col-span-2 rounded-[24px] border border-white/15 glass-panel bg-slate-900/70 p-5 flex flex-col h-full min-h-[350px]">
        {activeWitness && unlockedWitnessIds.includes(activeWitness.id) ? (
          <div className="flex flex-col h-full animate-fade-in">
            {/* Header / Profile info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={activeWitness.avatar} 
                  alt={activeWitness.name}
                  className="h-11 w-11 rounded-full object-cover border-2 border-[#ff8533]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-sm font-bold font-serif text-white flex items-center gap-2">
                    {activeWitness.name}
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-xs text-[#9a9a9a] font-mono">{activeWitness.role}</p>
                </div>
              </div>

              {/* Rapport / Trust level */}
              <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-3">
                <div>
                  <div className="flex justify-between text-[9px] font-mono font-bold mb-1">
                    <span className="text-[#9a9a9a] uppercase">COOPERATION RAPPORT</span>
                    <span className="text-[#ff8533]">{activeTrust}%</span>
                  </div>
                  <div className="w-24 bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#ff8533] to-[#ffb829] h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${activeTrust}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Brief */}
            <p className="text-xs text-[#bdbdbd] bg-black/30 border border-white/10 rounded-2xl p-3 mb-3 leading-relaxed font-sans">
              <span className="font-mono text-[#ff8533] font-bold uppercase mr-1.5">DOSSIER NOTES:</span>
              {activeWitness.description}
            </p>

            {/* Evidence Challenge Toolbar */}
            <div className="mb-3 rounded-2xl border border-[#8052ff]/30 bg-[#8052ff]/[0.08] p-3">
              <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-mono font-bold uppercase text-[#b9a5ff]">
                <span className="flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5" /> Present Evidence to Challenge Statement
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
                      onClick={() => setPresentedEvidenceId(selected ? null : evidence.id)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        selected 
                          ? 'border-[#b9a5ff] bg-[#8052ff]/30 text-white shadow-md' 
                          : 'border-white/10 bg-black/40 text-[#bdbdbd] hover:border-[#b9a5ff]/50 hover:text-white'
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
            <div className="flex-1 bg-[#0b0f19] border border-white/10 rounded-2xl p-4 mb-3 overflow-y-auto space-y-3 max-h-[200px]">
              {activeChat.length === 0 ? (
                <div className="text-center py-6 text-[#9a9a9a] font-mono text-xs">
                  <span>[INTERROGATION CHANNEL ESTABLISHED]</span>
                  <p className="mt-1 text-[#9a9a9a]/60">Select a question or present evidence to begin questioning.</p>
                </div>
              ) : (
                activeChat.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed border ${
                      msg.sender === 'user'
                        ? 'bg-white/10 border-white/15 text-white font-medium'
                        : msg.text.includes('CONFRONTED')
                          ? 'bg-rose-950/40 border-rose-500/40 text-rose-200 font-mono'
                          : 'bg-[#ff8533]/10 border-[#ff8533]/30 text-white font-mono'
                    }`}>
                      <div className="flex items-center justify-between text-[8px] opacity-60 font-mono mb-1 gap-3">
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
                  <div className="bg-slate-900 border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-[#9a9a9a] flex items-center gap-2">
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
                    className="text-[10px] font-mono text-[#bdbdbd] bg-black/40 border border-white/10 hover:border-[#ff8533] hover:text-white rounded-full px-3 py-1 hover:bg-[#ff8533]/10 transition-all text-left max-w-full truncate focus:outline-none disabled:opacity-50 cursor-pointer"
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
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleSendMessage();
                }}
                placeholder={`Ask ${activeWitness.name} a question...`}
                className="flex-1 bg-black border border-white/15 focus:border-[#ff8533] rounded-full px-4 py-2 text-xs outline-none text-white transition-colors"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isTyping || !inputText.trim()}
                className="bg-[#ff8533] hover:bg-[#ff9955] text-[#1e110a] disabled:opacity-40 border-transparent rounded-full px-5 flex items-center justify-center font-bold cursor-pointer transition-all"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#9a9a9a]">
            <MessageSquare className="h-12 w-12 text-[#9a9a9a]/20 mb-3 animate-pulse" />
            <h5 className="text-sm font-bold font-serif text-white mb-1">Select Witness for Interrogation</h5>
            <p className="text-xs text-[#9a9a9a] max-w-sm leading-relaxed font-mono">
              Select an unlocked witness from the roster on the left to initiate questioning and present evidence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
