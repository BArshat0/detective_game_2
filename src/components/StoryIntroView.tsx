import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, ArrowLeft, Volume2, VolumeX,
  MessageSquare, Mail, PhoneCall, AlertTriangle, 
  Clock, MapPin, User, Terminal, Sparkles, FastForward,
  BookOpen, CheckCircle2, Radio, Play, Film, Flame,
  Compass, Eye, Lock, FileText, Cpu
} from 'lucide-react';
import { Case, StoryScene } from '../types';

interface StoryIntroViewProps {
  caseData: Case;
  onCompleteStory: () => void;
  onSkipStory: () => void;
  onAddNote?: (note: string) => void;
}

export default function StoryIntroView({ caseData, onCompleteStory, onSkipStory, onAddNote }: StoryIntroViewProps) {
  const story = caseData.storyIntro;
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [savedNote, setSavedNote] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const scenes: StoryScene[] = story?.scenes || [
    {
      id: 'default_s1',
      sceneNumber: 1,
      title: 'Incident Briefing',
      locationName: caseData.location.name,
      mediaType: 'police_dispatch',
      speaker: {
        name: 'Chief Investigator Vance',
        role: 'Digital Safety Dispatch',
        mood: 'urgent'
      },
      narration: caseData.introduction,
      dialogueText: `Investigator, we need your expertise immediately on "${caseData.title}". Review the initial findings and proceed to the case board.`,
      keyTakeaway: 'Initial briefing logged.'
    }
  ];

  const currentScene = scenes[currentSceneIndex];
  const isLastScene = currentSceneIndex === scenes.length - 1;

  // Sound Engine using Web Audio API
  const playSoundEffect = (type: 'next' | 'note' | 'siren' | 'ring' | 'notification' | 'glitch' | 'launch') => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'next') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'note') {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'notification' || type === 'ring') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'siren' || type === 'launch') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(900, now + 0.3);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch {
      // Audio context silently falls back
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLaunching) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onSkipStory();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSceneIndex, isLastScene, isLaunching]);

  useEffect(() => {
    setSavedNote(false);
    if (currentScene.soundEffect) {
      playSoundEffect(currentScene.soundEffect === 'notification' ? 'notification' : currentScene.soundEffect === 'phone_ring' ? 'ring' : 'siren');
    } else {
      playSoundEffect('next');
    }
  }, [currentSceneIndex]);

  const handleNext = () => {
    if (isLaunching) return;
    if (isLastScene) {
      triggerLaunchSequence();
    } else {
      setCurrentSceneIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (isLaunching) return;
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
    }
  };

  const triggerLaunchSequence = () => {
    setIsLaunching(true);
    playSoundEffect('launch');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setLaunchProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onCompleteStory();
        }, 200);
      }
    }, 120);
  };

  const handleSaveSceneNote = () => {
    if (onAddNote && currentScene.keyTakeaway) {
      onAddNote(`Scene ${currentScene.sceneNumber} - ${currentScene.title}: ${currentScene.keyTakeaway}`);
      setSavedNote(true);
      playSoundEffect('note');
    }
  };

  // Mood color helper
  const getMoodGlow = (mood?: string) => {
    switch (mood) {
      case 'panicked':
      case 'urgent':
        return 'from-rose-500/20 via-amber-500/10 to-transparent border-rose-500/40 text-rose-400';
      case 'suspicious':
      case 'worried':
        return 'from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/40 text-amber-400';
      case 'confident':
        return 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/40 text-emerald-400';
      default:
        return 'from-amber-500/15 via-zinc-500/10 to-transparent border-amber-500/30 text-amber-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#080402] text-[#fcfaf5] flex flex-col justify-between p-3 sm:p-6 md:p-8 relative overflow-hidden select-none font-sans">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3a1d0f] via-[#120804] to-[#050201] opacity-95 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
      
      {/* Subtle Scanlines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none z-10 opacity-30" />

      {/* TOP BAR: Case Title & Prologue Controls */}
      <div className="relative z-20 max-w-5xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3d2416]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ff8533]/15 border border-[#ff8533]/40 flex items-center justify-center text-[#ff8533] shadow-[0_0_20px_rgba(255,133,51,0.25)] shrink-0">
            <Film className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#a89485] uppercase tracking-widest">
              <span className="flex items-center gap-1 text-[#ff8533] font-bold">
                <Radio className="w-3 h-3 animate-ping text-[#ff8533]" /> PROLOGUE
              </span>
              <span>•</span>
              <span className="text-[#ffb829] font-bold">{caseData.tag}</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-[#fcfaf5] tracking-tight">{caseData.title}</h1>
          </div>
        </div>

        {/* Audio Toggle, Scene Counter & Fast Forward */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-full border transition-all cursor-pointer ${
              audioEnabled 
                ? 'bg-[#ff8533]/15 border-[#ff8533]/50 text-[#ff8533] shadow-[0_0_12px_rgba(255,133,51,0.2)]' 
                : 'bg-white/5 border-white/10 text-zinc-500'
            }`}
            title={audioEnabled ? "Audio Cues Active" : "Audio Muted"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="text-right hidden sm:block font-mono">
            <p className="text-[10px] text-[#a89485]">ACT 1 PROLOGUE</p>
            <p className="text-xs font-bold text-[#ff8533]">Scene {currentSceneIndex + 1} of {scenes.length}</p>
          </div>

          <button 
            onClick={onSkipStory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2a170d] hover:bg-[#3d2214] text-[#a89485] hover:text-[#fcfaf5] text-xs font-mono transition-colors border border-[#4a2b19] cursor-pointer"
            title="Skip prologue straight to Investigation Room (Esc)"
          >
            <span>Skip Prologue</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SCENE PROGRESS BAR */}
      <div className="relative z-20 max-w-5xl mx-auto w-full my-3">
        <div className="w-full h-2 bg-[#22110a] rounded-full overflow-hidden flex p-0.5 border border-[#3d2214]">
          {scenes.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSceneIndex(idx)}
              className={`h-full transition-all duration-300 rounded-full cursor-pointer ${
                idx < currentSceneIndex ? 'bg-[#ff8533]' : 
                idx === currentSceneIndex ? 'bg-[#ffb829] shadow-[0_0_12px_#ffb829]' : 'bg-transparent hover:bg-white/10'
              }`}
              style={{ width: `${100 / scenes.length}%` }}
              title={`Scene ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>
      </div>

      {/* MAIN CINEMATIC SCENE STAGE */}
      <div className="relative z-20 max-w-4xl mx-auto w-full my-auto py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSceneIndex}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-4"
          >
            {/* Scene Header Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#a89485] bg-[#160c07]/90 px-4 py-2.5 rounded-2xl border border-[#3d2214] shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[#ff8533] font-bold uppercase tracking-wider">
                  <Terminal className="w-4 h-4 text-[#ff8533]" /> SCENE {currentScene.sceneNumber}: {currentScene.title}
                </span>
                {currentScene.locationName && (
                  <span className="flex items-center gap-1 text-[#d9d2c9] border-l border-white/10 pl-3">
                    <MapPin className="w-3.5 h-3.5 text-[#a89485]" /> {currentScene.locationName}
                  </span>
                )}
              </div>
              {story?.incidentTime && (
                <span className="flex items-center gap-1 text-[#a89485]">
                  <Clock className="w-3.5 h-3.5" /> {story.incidentTime}
                </span>
              )}
            </div>

            {/* Main Interactive Media Box */}
            <div className="bg-gradient-to-b from-[#1c0f0a] to-[#120804] rounded-[28px] p-5 sm:p-7 border border-[#3d2214] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-lg">
              
              {/* Radial glow background */}
              <div className="absolute top-0 right-0 w-60 h-60 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#ff8533]/15 via-transparent to-transparent pointer-events-none" />

              {/* MEDIA TYPE 1: PHONE CALL INTERCEPT */}
              {currentScene.mediaType === 'phone_call' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#2a160d] border border-[#4a2817] shadow-inner">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#ff8533] relative shrink-0 shadow-lg">
                        <img 
                          src={currentScene.speaker?.avatar || caseData.imageUrl} 
                          alt={currentScene.speaker?.name || 'Caller'} 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold text-[#fcfaf5]">{currentScene.speaker?.name || 'Incoming Audio Intercept'}</p>
                          {currentScene.speaker?.mood && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border bg-gradient-to-r ${getMoodGlow(currentScene.speaker.mood)}`}>
                              {currentScene.speaker.mood}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#ff8533] font-mono flex items-center gap-1 mt-0.5">
                          <PhoneCall className="w-3.5 h-3.5 animate-pulse" /> VOICE INTERCEPT STREAM • 00:14
                        </p>
                      </div>
                    </div>

                    {/* Animated Equalizer Waveform */}
                    <div className="flex items-center gap-1.5 h-10 px-4 py-2 bg-[#120804] rounded-xl border border-[#3d2214] shrink-0">
                      <span className="w-1.5 h-7 bg-[#ff8533] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-5 bg-[#ffb829] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-8 bg-[#ff8533] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="w-1.5 h-4 bg-[#a89485] rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                      <span className="w-1.5 h-6 bg-[#ff8533] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    </div>
                  </div>

                  {currentScene.dialogueText && (
                    <div className="p-5 rounded-2xl bg-[#22120a] border border-[#3d2214] text-[#fcfaf5] italic text-base md:text-lg leading-relaxed shadow-md">
                      "{currentScene.dialogueText}"
                    </div>
                  )}
                </div>
              )}

              {/* MEDIA TYPE 2: TEXT CHAT INTERCEPT */}
              {currentScene.mediaType === 'text_chat' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#a89485] pb-2 border-b border-[#3d2214]">
                    <MessageSquare className="w-4 h-4 text-[#ff8533]" />
                    <span>ENCRYPTED MESSAGING INTERCEPT // {currentScene.speaker?.name || 'Peer Chat'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#28150c] border border-[#4a2817] max-w-2xl space-y-2 shadow-lg">
                    <div className="flex items-center justify-between text-xs text-[#a89485] font-mono">
                      <span className="font-bold text-[#ff8533] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> {currentScene.speaker?.name || 'Sender'}
                      </span>
                      <span>{currentScene.mediaContent?.timestamp || 'Intercept Log'}</span>
                    </div>
                    <p className="text-base md:text-lg text-[#fcfaf5] leading-relaxed font-sans">
                      {currentScene.dialogueText || currentScene.mediaContent?.body}
                    </p>
                  </div>
                </div>
              )}

              {/* MEDIA TYPE 3: EMAIL / DOCUMENT INTERCEPT */}
              {currentScene.mediaType === 'email_preview' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#a89485] pb-2 border-b border-[#3d2214]">
                    <Mail className="w-4 h-4 text-[#ff8533]" />
                    <span>INTERCEPTED DIGITAL DOCUMENT</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#120804] border border-[#3d2214] space-y-3 font-mono text-xs shadow-inner">
                    <div className="flex flex-col gap-1 border-b border-[#28150c] pb-2 text-[#a89485]">
                      <p><span className="text-[#ff8533]">SENDER:</span> {currentScene.mediaContent?.sender || 'external@sender.org'}</p>
                      <p><span className="text-[#ff8533]">RECIPIENT:</span> {currentScene.mediaContent?.recipient || 'target@network.org'}</p>
                      <p><span className="text-[#ff8533]">HEADER:</span> <strong className="text-[#fcfaf5]">{currentScene.mediaContent?.header || currentScene.title}</strong></p>
                    </div>
                    <div className="text-sm md:text-base font-sans text-[#d9d2c9] leading-relaxed pt-2">
                      {currentScene.mediaContent?.body || currentScene.dialogueText}
                    </div>
                  </div>
                </div>
              )}

              {/* MEDIA TYPE 4: VIRAL NEWS ALERT */}
              {currentScene.mediaType === 'news_alert' && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/50 via-[#2a130a] to-[#160a04] border border-red-800/50 space-y-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-mono font-bold text-xs animate-pulse">
                      VIRAL MEDIA ALERT
                    </span>
                    <span className="text-xs font-mono text-[#a89485]">TRENDING NETWORK FEED</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-serif text-[#fcfaf5]">
                    {currentScene.mediaContent?.header || currentScene.title}
                  </h3>
                  <p className="text-base text-[#d9d2c9] leading-relaxed">
                    {currentScene.dialogueText || currentScene.mediaContent?.body}
                  </p>
                </div>
              )}

              {/* MEDIA TYPE 5: POLICE DISPATCH & DIALOGUE */}
              {(currentScene.mediaType === 'police_dispatch' || currentScene.mediaType === 'dialogue' || currentScene.mediaType === 'cctv_log') && (
                <div className="space-y-4">
                  {currentScene.speaker && (
                    <div className="flex items-center gap-4 pb-4 border-b border-[#3d2214]">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#ff8533] bg-[#2a170d] shrink-0 shadow-lg">
                        {currentScene.speaker.avatar ? (
                          <img src={currentScene.speaker.avatar} alt={currentScene.speaker.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#ff8533]">
                            <User className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-[#fcfaf5]">{currentScene.speaker.name}</h4>
                          {currentScene.speaker.mood && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border bg-gradient-to-r ${getMoodGlow(currentScene.speaker.mood)}`}>
                              {currentScene.speaker.mood}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-[#a89485]">{currentScene.speaker.role}</p>
                      </div>
                    </div>
                  )}

                  {currentScene.dialogueText && (
                    <div className="text-base md:text-lg text-[#fcfaf5] font-sans leading-relaxed">
                      "{currentScene.dialogueText}"
                    </div>
                  )}
                </div>
              )}

              {/* Scene Narration Context */}
              {currentScene.narration && (
                <div className="mt-4 p-4 rounded-xl bg-[#120804] border border-[#2e180d] text-sm md:text-base text-[#a89485] leading-relaxed">
                  <span className="text-[#ff8533] font-bold font-mono mr-2">// SCENE NARRATIVE:</span>
                  {currentScene.narration}
                </div>
              )}

              {/* Key Investigative Red Flag & Notebook Quick-Save */}
              {currentScene.keyTakeaway && (
                <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#ff8533]/10 border border-[#ff8533]/35 text-xs font-mono text-[#ff8533]">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#ff8533]" />
                    <div>
                      <strong className="uppercase font-bold tracking-wider">Investigative Red Flag:</strong> {currentScene.keyTakeaway}
                    </div>
                  </div>

                  {onAddNote && (
                    <button
                      onClick={handleSaveSceneNote}
                      disabled={savedNote}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        savedNote
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                          : 'bg-[#ff8533] hover:bg-[#ff9955] text-[#120804] border-transparent shadow-md hover:scale-105'
                      }`}
                    >
                      {savedNote ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Logged to Notebook
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4" /> Copy to Notebook
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BOTTOM CONTROL NAVIGATION BAR */}
      <div className="relative z-20 max-w-4xl mx-auto w-full pt-4 border-t border-[#3d2416] flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentSceneIndex === 0 || isLaunching}
          className="px-4 py-2.5 rounded-full bg-[#2a170d] hover:bg-[#3d2214] disabled:opacity-30 disabled:cursor-not-allowed text-[#d9d2c9] text-xs font-mono font-bold flex items-center gap-2 border border-[#4a2b19] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Scene</span>
        </button>

        <button
          onClick={handleNext}
          disabled={isLaunching}
          className={`btn-primary px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            isLastScene ? 'shadow-[0_0_25px_rgba(255,133,51,0.6)] bg-[#ff8533] text-[#120804] hover:bg-[#ff9955]' : ''
          }`}
        >
          <span>{isLastScene ? 'Begin Investigation' : 'Next Scene'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* CINEMATIC DISPATCH LAUNCH MODAL */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="max-w-md w-full space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#ff8533]/20 border-2 border-[#ff8533] flex items-center justify-center mx-auto text-[#ff8533] shadow-[0_0_30px_rgba(255,133,51,0.5)]">
                <Cpu className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <p className="text-xs font-mono text-[#ff8533] uppercase tracking-widest">PROLOGUE CONCLUDED</p>
                <h3 className="text-2xl font-bold text-white tracking-tight mt-1">Entering Investigation Room</h3>
                <p className="text-xs text-[#a89485] font-mono mt-1">{caseData.title}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full h-3 bg-[#22110a] rounded-full overflow-hidden p-0.5 border border-[#3d2214]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#ff8533] to-[#ffb829] rounded-full transition-all duration-150"
                    style={{ width: `${launchProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#a89485]">
                  <span>SYNCHRONIZING EVIDENCE CABINETS</span>
                  <span className="text-[#ff8533] font-bold">{launchProgress}%</span>
                </div>
              </div>

              {/* Synchronized Assets Checklist */}
              <div className="text-left bg-[#160c07] p-4 rounded-2xl border border-[#3d2214] font-mono text-xs space-y-2 text-[#d9d2c9]">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Evidence Files Synchronized: {caseData.evidences.length} Documents</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Witness Profiles Loaded: {caseData.witnesses.length} Characters</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Timeline sequence armed</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
