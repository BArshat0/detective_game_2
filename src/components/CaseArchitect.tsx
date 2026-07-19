import React, { useState, useEffect } from 'react';
import { Cpu, Loader2, ArrowRight, BookOpen, Trash, PlayCircle, Shield } from 'lucide-react';
import { Case } from '../types';

interface CaseArchitectProps {
  onCaseGenerated: (newCase: Case) => void;
  customCases: Case[];
  onPlayCase: (caseId: string) => void;
  onDeleteCase: (caseId: string) => void;
}

const PREPARATION_STEPS = [
  { label: 'Sourcing core safety topics & community impact', desc: 'Analyzing real-world influence to prepare vital awareness points.' },
  { label: 'Designing interactive fact-checking hotspots', desc: 'Setting up scenario environments for hands-on investigation.' },
  { label: 'Structuring witness conversation challenges', desc: 'Configuring safe practice dialogues to hone inquiry techniques.' },
  { label: 'Formulating timeline of key incident markers', desc: 'Mapping historical evidence to train chronological tracing.' },
  { label: 'Integrating critical prevention and self-defense tips', desc: 'Sourcing actionable tactics to protect yourself online.' },
  { label: 'Preparing diagnostic evaluation rubrics', desc: 'Assembling immediate feedback indicators for your defense assessment.' }
];

const SAFETY_TIPS = [
  "💡 Verification Shield: Always cross-reference high-emotion news with multiple independent, reputable sources before hit-sharing.",
  "💡 Deepfake Defense: Look closely for unnatural blinking, voice inconsistencies, or unusual distortion around the edges of hands and mouths.",
  "💡 Phishing Alert: Authentic financial support or agents will never ask you to transfer funds or share security credentials over chat.",
  "💡 Digital Footprint Protection: What you publish is permanent. Keep personal contact info private and verify friend requests diligently.",
  "💡 Echo Chamber Prevention: Actively consult viewpoints from balanced, objective sources to build a robust and healthy perspective."
];

export default function CaseArchitect({ onCaseGenerated, customCases, onPlayCase, onDeleteCase }: CaseArchitectProps) {
  const [topic, setTopic] = useState('Cyberbullying & Social Isolation');
  const [difficulty, setDifficulty] = useState<'EASY' | 'MED' | 'HIGH'>('EASY');
  const [environment, setEnvironment] = useState('School Library & Discussion Forums');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const topics = [
    'Cyberbullying & Social Isolation',
    'Elderly Financial & Impersonation Scams',
    'Fake News & Virality Manipulation',
    'Online Grooming & Digital Safety',
    'Identity Theft & Stolen Social Accounts',
    'Digital Footprint & Reputation Smearing',
    'Catfishing & Romance Scams',
    'Deepfake-driven Character Assassination',
    'Online Echo Chambers & Community Scams'
  ];

  const environments = [
    'School Library & Discussion Forums',
    'Arthur’s Cozy Living Room',
    'Municipal Fact-Checking Office',
    'Public High School Computer Lab',
    'Local Senior Citizen Center',
    'City Council Community Hall',
    'Neighborhood Coffee Shop'
  ];

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      setTipIndex(0);
      return;
    }

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < PREPARATION_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1600);

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % SAFETY_TIPS.length);
    }, 3200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(tipInterval);
    };
  }, [isGenerating]);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-case', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           topic,
           difficulty,
           environment
         })
      });

      const customCaseData = await response.json();
      if (customCaseData && customCaseData.id) {
        setTimeout(() => {
          onCaseGenerated(customCaseData);
          setIsGenerating(false);
        }, 9800);
      } else {
        setIsGenerating(false);
        alert("Failed to synthesize custom case. Try choosing another topic configuration.");
      }
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
      alert("[CONNECTION EXPIRED]: Server failed to design custom case components.");
    }
  };

  return (
    <div id="case-architect-module" className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-white">
      {/* Configuration Controls */}
      <div className="lg:col-span-1 rounded-[24px] border border-white/10 bg-[#000000] p-5 flex flex-col h-full">
        <h4 className="text-nav-label text-white mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-[#ff8533] animate-pulse" />
          AI Case Builder
        </h4>

        {isGenerating ? (
          <div className="flex-1 flex flex-col justify-center py-6 min-h-[350px]">
            <div className="flex items-center gap-3 mb-5">
              <Loader2 className="h-6 w-6 text-[#ff8533] animate-spin" />
              <span className="text-xs font-mono text-[#ff8533] uppercase tracking-widest font-extrabold animate-pulse">Designing Active Case Scenario...</span>
            </div>
            
            {/* Elegant Steps Timeline */}
            <div className="w-full bg-[#121214] border border-white/5 rounded-2xl p-4.5 space-y-3.5 mb-5 shadow-inner">
              <h5 className="text-[10px] font-bold text-[#ff8533] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff8533] animate-pulse" />
                Scenario Preparation Timeline
              </h5>
              
              <div className="space-y-3 relative pl-1">
                {/* Vertical Connector Line */}
                <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-white/5" />
                
                {PREPARATION_STEPS.map((step, idx) => {
                  const isCompleted = currentStep > idx;
                  const isActive = currentStep === idx;
                  
                  return (
                    <div key={idx} className="flex gap-3 relative transition-all duration-300">
                      {/* Timeline Dot */}
                      <div className="flex items-center justify-center shrink-0">
                        {isCompleted ? (
                          <div className="h-4.5 w-4.5 rounded-full bg-[#15846e]/20 border border-[#15846e] flex items-center justify-center text-[#15846e] text-[9px] font-bold select-none">
                            ✓
                          </div>
                        ) : isActive ? (
                          <div className="h-4.5 w-4.5 rounded-full bg-[#ff8533]/20 border border-[#ff8533] flex items-center justify-center text-[#ff8533] select-none">
                            <Loader2 className="h-2 w-2 animate-spin" />
                          </div>
                        ) : (
                          <div className="h-4.5 w-4.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#9a9a9a]/60 text-[9px] font-mono select-none">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      
                      {/* Text */}
                      <div className="min-w-0">
                        <p className={`text-xs font-medium leading-tight ${isActive ? 'text-white' : isCompleted ? 'text-white/60' : 'text-[#9a9a9a]/30'}`}>
                          {step.label}
                        </p>
                        {isActive && (
                          <p className="text-[10px] text-[#a89485] font-mono mt-0.5 leading-relaxed">
                            {step.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Educational Defense Tip Carousel */}
            <div className="w-full bg-[#ff8533]/5 border border-[#ff8533]/15 rounded-2xl p-4.5 flex gap-3 items-start">
              <Shield className="h-5 w-5 text-[#ff8533] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#ff8533] uppercase tracking-wider">AWARENESS & SELF-DEFENSE GUARD</span>
                <p className="text-xs text-[#d1c4b9] leading-relaxed">
                  {SAFETY_TIPS.at(tipIndex)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5 flex-1">
            {/* Topic Select */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-[#9a9a9a] uppercase tracking-wider mb-2">Select Safety Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-full px-4 py-3 text-xs text-white font-mono outline-none focus:border-[#ff8533] transition-all cursor-pointer"
              >
                {topics.map((t, tIdx) => (
                  <option key={tIdx} className="bg-black text-white" value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Select */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-[#9a9a9a] uppercase tracking-wider mb-2">Select Training Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {(['EASY', 'MED', 'HIGH'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`p-2.5 rounded-full border text-xs font-mono font-extrabold transition-all cursor-pointer focus:outline-none ${
                      difficulty === diff
                        ? diff === 'EASY'
                          ? 'border-[#5c7f5c] bg-[#5c7f5c]/10 text-white font-bold'
                          : diff === 'MED'
                            ? 'border-[#ffb829] bg-[#ffb829]/10 text-[#ffb829] font-bold'
                            : 'border-[#ff8533] bg-[#ff8533]/10 text-[#ff8533] font-bold'
                        : 'border-white/10 bg-transparent text-[#9a9a9a]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Environment Select */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-[#9a9a9a] uppercase tracking-wider mb-2">Select Map Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-full px-4 py-3 text-xs text-white font-mono outline-none focus:border-[#ff8533] transition-all cursor-pointer"
              >
                {environments.map((env, eIdx) => (
                  <option key={eIdx} className="bg-black text-white" value={env}>{env}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-1.5 text-[#1e110a] cursor-pointer"
            >
              <span>Build AI Case</span>
              <ArrowRight className="h-4 w-4 text-[#1e110a]" />
            </button>
          </div>
        )}
      </div>

      {/* Generated Customs Case List */}
      <div className="lg:col-span-2 rounded-[24px] border border-white/10 bg-[#000000] p-5 flex flex-col h-full">
        <h4 className="text-nav-label text-white mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#ff8533]" />
          Custom Modules Registry ({customCases.length})
        </h4>

        {customCases.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#9a9a9a]">
            <BookOpen className="h-12 w-12 text-white/5 mb-3 animate-pulse" />
            <h5 className="text-nav-label text-[#9a9a9a] mb-1">Registry is Empty</h5>
            <p className="text-xs text-[#9a9a9a]/60 max-w-xs leading-relaxed font-mono">
              Use the builder panel on the left to synthesize custom learning cases. Custom cases feature fully active AI witnesses, hotspots map grids, and evaluation reports.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[380px]">
            {customCases.map((c) => (
              <div
                key={c.id}
                className="p-4.5 rounded-[24px] border border-white/10 bg-transparent hover:bg-white/[0.02] hover:border-white/20 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="shrink-0 p-2.5 rounded-full bg-white/5 border border-white/10 text-[#ff8533]">
                    <Cpu className="h-5 w-5 animate-spin" style={{ animationDuration: '16s' }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-extrabold text-[#ff8533] bg-[#ff8533]/10 border border-[#ff8533]/30 px-2 py-0.5 rounded-full">
                        {c.difficulty}
                      </span>
                      <span className="text-[10px] font-mono text-[#9a9a9a]">
                        {c.location.name}
                      </span>
                    </div>
                    <h5 className="font-sans font-normal text-white text-sm truncate tracking-wide">{c.title}</h5>
                    <p className="text-xs text-[#9a9a9a] line-clamp-1 font-mono mt-0.5">{c.topic}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onPlayCase(c.id)}
                    className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#1e110a] bg-[#ff8533] hover:bg-[#ff9c5c] px-4 py-2 rounded-full transition-colors cursor-pointer focus:outline-none"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>LAUNCH</span>
                  </button>
                  <button
                    onClick={() => onDeleteCase(c.id)}
                    className="p-2 text-rose-500 hover:text-rose-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all focus:outline-none cursor-pointer"
                    title="Delete Case"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
