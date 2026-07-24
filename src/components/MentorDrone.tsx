import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { Case } from '../types';

interface MentorDroneProps {
  caseData: Case;
  discoveredEvidenceIds: string[];
  notebookNotes: string[];
}

export default function MentorDrone({ caseData, discoveredEvidenceIds, notebookNotes }: MentorDroneProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'mentor'; text: string; timestamp: string }[]>([
    {
      sender: 'mentor',
      text: "Greetings, Investigator! I am your Academy Advisor. Feel free to ask me for hints, explain social crime terms, or help trace warning signs!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt ?? inputVal;
    if (!textToSend.trim()) return;

    if (!customPrompt) setInputVal('');

    const newMsgs = [...messages, {
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
    setMessages(newMsgs);
    setIsTyping(true);

    try {
      const response = await fetch('/api/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseTitle: caseData.title,
          currentNotes: notebookNotes.join('\n'),
          unlockedEvidence: caseData.evidences
            .filter(e => discoveredEvidenceIds.includes(e.id))
            .map(e => e.name),
          chatHistory: newMsgs.slice(-10),
          userQuestion: textToSend
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages(m => [...m, {
          sender: 'mentor',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        setMessages(m => [...m, {
          sender: 'mentor',
          text: "My neural relays are slightly desynced. Try asking your query again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(m => [...m, {
        sender: 'mentor',
        text: "[ADVISOR OFFLINE]: Unable to connect to the advisor server. Please check your network connection.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-mono">
      {/* Floating Drone Button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); }}
          className="flex items-center gap-2 rounded-full bg-[#1e110a] border border-white/10 hover:border-[#ff8533] p-4 text-white shadow-xl hover:translate-y-[-2px] transition-all focus:outline-none cursor-pointer"
        >
          <Bot className="h-6 w-6 text-[#ff8533] animate-pulse" />
          <span className="font-sans font-bold text-xs tracking-wider pr-1.5 hidden sm:inline-block text-[#d9d2c9]">ACADEMY ADVISOR</span>
        </button>
      )}

      {/* Expandable Dialog Panel */}
      {isOpen && (
        <div className={`w-[320px] sm:w-[360px] rounded-[24px] border border-white/10 bg-black shadow-2xl flex flex-col transition-all duration-300 ${
          isMinimized ? 'h-[52px]' : 'h-[440px]'
        }`}>
          {/* Header */}
          <div className="flex justify-between items-center bg-white/[0.02] px-4 py-3.5 rounded-t-[24px] border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-[#ff8533] animate-pulse" />
              <span className="font-sans font-bold text-xs text-white tracking-wider">CASE ADVISOR</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#5c7f5c] animate-ping" />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setIsMinimized(!isMinimized); }}
                className="text-[#9a9a9a] hover:text-white transition-colors focus:outline-none cursor-pointer"
              >
                {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </button>
              <button 
                onClick={() => { setIsOpen(false); }}
                className="text-[#9a9a9a] hover:text-white transition-colors focus:outline-none cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Active Chat Content */}
          {!isMinimized && (
            <div className="flex-1 flex flex-col min-h-0 bg-[#000000] rounded-b-[24px]">
              {/* Message scroll thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-[24px] px-3.5 py-2.5 text-xs leading-relaxed border ${
                      m.sender === 'user'
                        ? 'bg-white/5 border-white/10 text-white font-bold'
                        : 'bg-[#8052ff]/10 border-[#8052ff]/30 text-white'
                    }`}>
                      <div className="flex justify-between items-center text-[8px] opacity-60 mb-1.5 gap-4">
                        <span>DETECTIVE</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="font-medium font-mono">{m.text}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-[#9a9a9a] flex items-center gap-2 animate-pulse">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#ff8533]" />
                      <span>ANALYZING CASE HINTS...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Case Hints */}
              <div className="p-2 border-t border-white/10 bg-white/[0.01]">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSend("Give me a hint on what to investigate next in this case.")}
                    disabled={isTyping}
                    className="text-[9px] font-bold text-[#bdbdbd] bg-black border border-white/10 hover:border-white hover:text-white rounded-full px-3 py-1 transition-all focus:outline-none cursor-pointer"
                  >
                    💡 Hint
                  </button>
                  <button
                    onClick={() => handleSend("Explain what warning signs are in this case.")}
                    disabled={isTyping}
                    className="text-[9px] font-bold text-[#bdbdbd] bg-black border border-white/10 hover:border-white hover:text-white rounded-full px-3 py-1 transition-all focus:outline-none cursor-pointer"
                  >
                    ⚠️ Warning Signs
                  </button>
                  <button
                    onClick={() => handleSend("What psychological manipulation is the offender using here?")}
                    disabled={isTyping}
                    className="text-[9px] font-bold text-[#bdbdbd] bg-black border border-white/10 hover:border-white hover:text-white rounded-full px-3 py-1 transition-all focus:outline-none cursor-pointer"
                  >
                    🧠 Crime Psychology
                  </button>
                </div>
              </div>

              {/* Input Control Box */}
              <div className="p-3.5 border-t border-white/10 bg-[#000000] flex gap-2 rounded-b-[24px]">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => { setInputVal(e.target.value); }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void handleSend();
                  }}
                  placeholder="Ask about warning signs..."
                  className="flex-1 bg-black border border-white/10 focus:border-[#ff8533] rounded-full px-3.5 py-1.5 text-xs outline-none text-white font-mono"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isTyping || !inputVal.trim()}
                  className="bg-[#ff8533] text-[#1e110a] hover:bg-[#ff9955] border-transparent disabled:bg-white/5 disabled:text-[#9a9a9a]/40 rounded-full px-4 flex items-center justify-center transition-all focus:outline-none cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
