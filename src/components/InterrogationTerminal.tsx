import React, { useState, useRef, useEffect } from 'react';
import { User, Send, ShieldAlert, MessageSquare, Loader2, HelpCircle } from 'lucide-react';
import { Case } from '../types';
import { safeGet, safeSet } from '../lib/safeLookup';

interface InterrogationTerminalProps {
  caseData: Case;
  unlockedWitnessIds: string[];
  onUnlockWitness: (witnessId: string) => void;
  chatsState: Record<string, { sender: 'user' | 'witness'; text: string; timestamp: string }[]>;
  onAddMessage: (witnessId: string, sender: 'user' | 'witness', text: string) => void;
}

export default function InterrogationTerminal({
  caseData,
  unlockedWitnessIds,
  chatsState,
  onAddMessage
}: InterrogationTerminalProps) {
  const [selectedWitnessId, setSelectedWitnessId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [trustLevels, setTrustLevels] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
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
  const activeTrust = selectedWitnessId ? safeGet(trustLevels, selectedWitnessId) ?? 35 : 35;

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend ?? inputText;
    if (!messageText.trim() || !selectedWitnessId || !activeWitness) return;

    if (!textToSend) {
      setInputText('');
    }

    onAddMessage(selectedWitnessId, 'user', messageText);
    setIsTyping(true);

    // Dynamic trust levels increment - compute current and next outside updater
    const currentTrust = safeGet(trustLevels, selectedWitnessId) ?? 35;
    const nextTrust = Math.min(100, currentTrust + 15);

    // Award XP for interaction outside state updater callback to avoid side effects during rendering/reconciliation
    window.dispatchEvent(new CustomEvent('mil-xp-earned', { 
      detail: { 
        xp: nextTrust === 100 && currentTrust < 100 ? 100 : 30, 
        msg: nextTrust === 100 && currentTrust < 100 ? `Max Rapport with ${activeWitness.name}!` : `Inquiry Sent to ${activeWitness.name}` 
      } 
    }));

    setTrustLevels(prev => safeSet(prev, selectedWitnessId, nextTrust));

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
          witnessKnowledge: activeWitness.promptKnowledge
        })
      });

      const data = await response.json();
      if (data.text) {
        onAddMessage(selectedWitnessId, 'witness', data.text);
      } else {
        onAddMessage(selectedWitnessId, 'witness', "I'm sorry, my signal is fluctuating. Repeat that?");
      }
    } catch (e) {
      console.error(e);
      onAddMessage(selectedWitnessId, 'witness', "[CONNECTION FAULT]: The server failed to connect to the active interview node. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const getQuickPrompts = (witnessId: string) => {
    switch (witnessId) {
      case 'wit_clara':
        return [
          "How did the anonymous messages affect your study group?",
          "Did you notice anyone acting strangely before the rumors spread?",
          "What did the group admin Chloe say when you asked for help?"
        ];
      case 'wit_chloe':
        return [
          "Why didn't you remove the fake accounts spreading rumors?",
          "Did anyone pressure you to keep Clara out of the group?",
          "What can you tell us about the 'Toxic Whisper' profile?"
        ];
      case 'wit_arthur':
        return [
          "How did the person on the phone know your grandson's name?",
          "Why did they insist you send cash via courier immediately?",
          "Did they threaten you or make you feel panicked?"
        ];
      case 'wit_devon':
        return [
          "Who provided you with Arthur's family contact details?",
          "Did you use voice cloning to mimic Devon's voice?",
          "Where are the stolen funds being routed?"
        ];
      case 'wit_renee':
        return [
          "What source first provided the document about water poisoning?",
          "Why didn't the editorial team fact-check the chemical formula?",
          "Did you notice the image was an AI-generated composite?"
        ];
      case 'wit_marcus':
        return [
          "Who pressured you to publish the story without double verification?",
          "Did you receive any monetary incentives to amplify this rumor?",
          "Tell me about the 'Sovereign Intel' forum account."
        ];
      default:
        return [
          "Where were you when this incident occurred?",
          "What is your relationship to the parties involved?",
          "What can you tell me about the social messages sent?"
        ];
    }
  };

  return (
    <div id="interrogation-terminal" className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full text-white">
      {/* Witnesses Roster Panel */}
      <div className="md:col-span-1 rounded-[24px] border border-white/10 bg-[#000000] p-4 flex flex-col h-full min-h-[220px]">
        <h4 className="text-nav-label text-white mb-3 flex items-center gap-1.5 border-b border-white/5 pb-3">
          <User className="h-4 w-4 text-[#ff8533] animate-pulse" />
          Witnesses Directory
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
                className={`w-full text-left rounded-[24px] p-3 border transition-all duration-200 flex gap-3 items-center focus:outline-none cursor-pointer ${
                  !isUnlocked
                    ? 'border-white/5 bg-transparent text-[#9a9a9a]/30 cursor-not-allowed'
                    : isSelected
                      ? 'border-[#ff8533] bg-[#ff8533]/10 text-white font-extrabold'
                      : 'border-white/5 bg-transparent text-[#bdbdbd] hover:border-white/20 hover:bg-white/5'
                }`}
                disabled={!isUnlocked}
              >
                <div className="relative shrink-0">
                  <img 
                    src={witness.avatar} 
                    alt={witness.name}
                    className={`h-10 w-10 rounded-full object-cover border ${
                      !isUnlocked 
                        ? 'border-white/5 filter grayscale opacity-30' 
                        : isSelected 
                          ? 'border-[#ff8533]' 
                          : 'border-white/20'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                      <ShieldAlert className="h-4 w-4 text-[#ffb829]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className={`text-xs font-bold truncate ${
                    !isUnlocked ? 'text-[#9a9a9a]/40' : 'text-white'
                  }`}>
                    {witness.name}
                  </h5>
                  <p className="text-[10px] font-mono truncate opacity-60 mt-0.5">{witness.role}</p>
                  
                  {!isUnlocked && (
                    <span className="text-[8px] font-mono text-[#ffb829] bg-[#ffb829]/10 px-1.5 py-0.5 rounded-full border border-[#ffb829]/30 mt-1 inline-block uppercase tracking-wider font-bold">
                      LOCKED INTERVIEW
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interrogation Terminal Console */}
      <div className="md:col-span-2 rounded-[24px] border border-white/10 bg-[#000000] p-5 flex flex-col h-full min-h-[350px]">
        {activeWitness && unlockedWitnessIds.includes(activeWitness.id) ? (
          <div className="flex flex-col h-full animate-fade-in">
            {/* Witness Info Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={activeWitness.avatar} 
                  alt={activeWitness.name}
                  className="h-10 w-10 rounded-full object-cover border border-[#ff8533]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-mono font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                    {activeWitness.name}
                    <span className="h-2 w-2 rounded-full bg-[#5c7f5c] animate-ping" />
                  </h4>
                  <p className="text-xs text-[#9a9a9a] font-mono">{activeWitness.role}</p>
                </div>
              </div>

              {/* Dynamic trust rapport indicator */}
              <div className="bg-white/[0.02] border border-white/5 rounded-full px-4 py-2 flex items-center gap-3 min-w-[200px]">
                <div className="flex-1">
                  <div className="flex justify-between text-[8px] font-mono font-extrabold mb-1">
                    <span className="text-[#9a9a9a] uppercase tracking-widest">RAPPORT TRUST</span>
                    <span className="text-[#ff8533]">{activeTrust}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        activeTrust === 100 ? 'bg-emerald-500' : 'bg-[#ff8533]'
                      }`}
                      style={{ width: `${activeTrust}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-white font-extrabold">
                  {activeTrust === 100 ? '⭐ MAX' : `${activeTrust}%`}
                </span>
              </div>
            </div>

            {/* Dossier Summary */}
            <p className="text-[11px] text-[#bdbdbd] bg-[#121214] border border-white/5 rounded-[24px] p-4 mb-4 leading-relaxed font-mono">
              <span className="font-mono text-[#ff8533] font-extrabold uppercase mr-1.5">DOSSIER FILE:</span>
              {activeWitness.description}
            </p>

            {/* Chat Messages Frame */}
            <div className="flex-1 bg-white/[0.01] border border-white/10 rounded-[24px] p-4.5 mb-4 overflow-y-auto space-y-4 max-h-[220px]">
              {activeChat.length === 0 ? (
                <div className="text-center py-8 text-[#9a9a9a] font-mono text-[11px]">
                  <span>[INTERVIEW CHANNEL ESTABLISHED // SECURE]</span>
                  <p className="mt-1.5 text-[#9a9a9a]/60">Select a question below or interview the witness directly.</p>
                </div>
              ) : (
                activeChat.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-[24px] px-4 py-3 text-xs leading-relaxed border ${
                      msg.sender === 'user'
                        ? 'bg-white/5 border-white/10 text-white font-bold'
                        : 'bg-[#ff8533]/10 border-[#ff8533]/30 text-white font-mono'
                    }`}>
                      <div className="flex items-center justify-between text-[8px] opacity-60 font-mono mb-1.5 gap-4">
                        <span className="tracking-wider uppercase">{msg.sender === 'user' ? 'INVESTIGATOR' : activeWitness.name}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="font-mono">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-[#9a9a9a] flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#ff8533]" />
                    <span>ANALYZING TESTIMONY...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="mb-4">
              <p className="text-[10px] font-mono text-[#ff8533] mb-2 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                <HelpCircle className="h-4 w-4 text-[#ff8533] shrink-0" />
                <span>Interview Questions:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {getQuickPrompts(activeWitness.id).map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isTyping}
                    className="text-[10px] font-mono text-[#bdbdbd] bg-white/5 border border-white/10 hover:border-[#ff8533] hover:text-white rounded-full px-3.5 py-1.5 hover:bg-[#ff8533]/10 transition-all text-left max-w-full truncate focus:outline-none disabled:opacity-50 cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleSendMessage();
                }}
                placeholder={`Ask ${activeWitness.name} about social clues or warning signs...`}
                className="flex-1 bg-black border border-white/10 focus:border-[#ff8533] rounded-full px-4 py-2.5 text-xs outline-none text-white transition-colors"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isTyping || !inputText.trim()}
                className="bg-[#ff8533] hover:bg-[#ff9955] text-[#1e110a] disabled:bg-white/5 disabled:text-[#9a9a9a]/40 disabled:border-white/5 border-transparent rounded-full px-5 flex items-center justify-center transition-all focus:outline-none cursor-pointer"
                aria-label="Send message to witness"
                title="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#9a9a9a]">
            <MessageSquare className="h-12 w-12 text-[#9a9a9a]/20 mb-3 animate-pulse" />
            <h5 className="text-nav-label text-[#9a9a9a] mb-1">Interview Channel Offline</h5>
            <p className="text-xs text-[#9a9a9a]/60 max-w-sm leading-relaxed font-mono">
              Access credentials to a witness profile to initiate interviews. Analyze hotspots map or uncover clues to unlock.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
