import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, ArrowLeft,
  MessageSquare, Mail, PhoneCall, AlertTriangle, 
  Clock, MapPin, User, Terminal, Sparkles, FastForward,
  BookOpen, CheckCircle2, Radio, Play, Film, Flame,
  Compass, Eye, Lock, FileText, Cpu, Heart, AlertCircle
} from 'lucide-react';
import { Case, StoryScene } from '../types';
import LoadingScreen from './LoadingScreen';

interface StoryIntroViewProps {
  caseData: Case;
  onCompleteStory: () => void;
  onSkipStory: () => void;
  onAddNote?: (note: string) => void;
}

export default function StoryIntroView({ caseData, onCompleteStory, onSkipStory, onAddNote }: StoryIntroViewProps) {
  const story = caseData.storyIntro;
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [savedNote, setSavedNote] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

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
  };

  const handleSaveSceneNote = () => {
    if (onAddNote && currentScene.keyTakeaway) {
      onAddNote(`Scene ${currentScene.sceneNumber} - ${currentScene.title}: ${currentScene.keyTakeaway}`);
      setSavedNote(true);
    }
  };

  // Mood color helper
  const getMoodGlow = (mood?: string) => {
    switch (mood) {
      case 'panicked':
      case 'urgent':
        return 'from-rose-500/20 via-amber-500/10 to-transparent border-rose-500/40 text-rose-300';
      case 'suspicious':
      case 'worried':
        return 'from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/40 text-amber-300';
      case 'confident':
        return 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/40 text-emerald-300';
      default:
        return 'from-amber-500/15 via-zinc-500/10 to-transparent border-amber-500/30 text-amber-300';
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col justify-between p-3 sm:p-6 md:p-8 relative overflow-hidden select-none font-sans">
      {/* Subtle Atmospheric Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-30" />
      
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#ff8533]/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* TOP BAR: Case Title & Cinematic Controls */}
      <div className="relative z-20 max-w-5xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl glass-panel bg-slate-900/60 border border-white/20 flex items-center justify-center text-[#ff8533] shadow-lg shrink-0">
            <Film className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 uppercase tracking-widest">
              <span className="flex items-center gap-1 text-[#ff8533] font-extrabold">
                <Radio className="w-3 h-3 animate-ping text-[#ff8533]" /> PROLOGUE
              </span>
              <span>•</span>
              <span className="text-[#ffb829] font-bold">{caseData.tag}</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">{caseData.title}</h1>
          </div>
        </div>

        {/* Scene Counter & Fast Forward */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block font-mono">
            <p className="text-[10px] text-slate-300">ACT 1 PROLOGUE</p>
            <p className="text-xs font-bold text-[#ffb829]">Scene {currentSceneIndex + 1} of {scenes.length}</p>
          </div>

          <button 
            onClick={onSkipStory}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full glass-panel bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 hover:text-white text-xs font-mono transition-all border border-white/20 cursor-pointer shadow-md"
            title="Skip prologue straight to Investigation Room (Esc)"
          >
            <span>Skip Prologue</span>
            <FastForward className="w-3.5 h-3.5 text-[#ff8533]" />
          </button>
        </div>
      </div>

      {/* SCENE PROGRESS INDICATOR */}
      <div className="relative z-20 max-w-5xl mx-auto w-full my-3">
        <div className="w-full h-2.5 glass-panel bg-slate-950/60 rounded-full overflow-hidden flex p-0.5 border border-white/15 shadow-inner">
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
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-200 glass-panel bg-slate-900/70 px-5 py-3 rounded-2xl border border-white/20 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[#ffb829] font-bold uppercase tracking-wider">
                  <Terminal className="w-4 h-4 text-[#ff8533]" /> SCENE {currentScene.sceneNumber}: {currentScene.title}
                </span>
                {currentScene.locationName && (
                  <span className="flex items-center gap-1 text-slate-200 border-l border-white/20 pl-3">
                    <MapPin className="w-3.5 h-3.5 text-[#ff8533]" /> {currentScene.locationName}
                  </span>
                )}
              </div>
              {story?.incidentTime && (
                <span className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-[#ffb829]" /> {story.incidentTime}
                </span>
              )}
            </div>

            {/* Main Interactive Story Card */}
            <div className="glass-panel bg-slate-900/75 rounded-[32px] p-6 sm:p-8 border border-white/20 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
              
              {/* Radial glow background */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#ff8533]/20 via-transparent to-transparent pointer-events-none" />

              {/* MEDIA TYPE 1: PHONE CALL INTERCEPT */}
              {currentScene.mediaType === 'phone_call' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-white/15 shadow-inner">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#ff8533] relative shrink-0 shadow-lg bg-slate-800">
                        <img 
                          src={currentScene.speaker?.avatar || caseData.imageUrl} 
                          alt={currentScene.speaker?.name || 'Caller'} 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold text-white">{currentScene.speaker?.name || 'Incoming Audio Intercept'}</p>
                          {currentScene.speaker?.mood && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border bg-gradient-to-r ${getMoodGlow(currentScene.speaker.mood)}`}>
                              {currentScene.speaker.mood}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#ffb829] font-mono flex items-center gap-1 mt-0.5">
                          <PhoneCall className="w-3.5 h-3.5 animate-pulse text-[#ff8533]" /> VOICE INTERCEPT STREAM • ACTIVE
                        </p>
                      </div>
                    </div>

                    {/* Animated Equalizer Waveform */}
                    <div className="flex items-center gap-1.5 h-10 px-4 py-2 bg-slate-900/80 rounded-xl border border-white/10 shrink-0">
                      <span className="w-1.5 h-7 bg-[#ff8533] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-5 bg-[#ffb829] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-8 bg-[#ff8533] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="w-1.5 h-4 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                      <span className="w-1.5 h-6 bg-[#ff8533] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    </div>
                  </div>

                  {currentScene.dialogueText && (
                    <div className="p-5 rounded-2xl bg-slate-950/50 border border-white/15 text-white italic text-base md:text-lg leading-relaxed shadow-md font-serif">
                      "{currentScene.dialogueText}"
                    </div>
                  )}
                </div>
              )}

              {/* MEDIA TYPE 2: TEXT CHAT INTERCEPT */}
              {currentScene.mediaType === 'text_chat' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300 pb-2 border-b border-white/15">
                    <MessageSquare className="w-4 h-4 text-[#ff8533]" />
                    <span>ENCRYPTED MESSAGING INTERCEPT // {currentScene.speaker?.name || 'Peer Chat'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/15 max-w-2xl space-y-2 shadow-lg">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                      <span className="font-bold text-[#ffb829] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> {currentScene.speaker?.name || 'Sender'}
                      </span>
                      <span>{currentScene.mediaContent?.timestamp || 'Intercept Log'}</span>
                    </div>
                    <p className="text-base md:text-lg text-white leading-relaxed font-sans">
                      {currentScene.dialogueText || currentScene.mediaContent?.body}
                    </p>
                  </div>
                </div>
              )}

              {/* MEDIA TYPE 3: EMAIL / DOCUMENT INTERCEPT */}
              {currentScene.mediaType === 'email_preview' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300 pb-2 border-b border-white/15">
                    <Mail className="w-4 h-4 text-[#ff8533]" />
                    <span>INTERCEPTED DIGITAL DOCUMENT</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/15 space-y-3 font-mono text-xs shadow-inner">
                    <div className="flex flex-col gap-1 border-b border-white/10 pb-2 text-slate-300">
                      <p><span className="text-[#ff8533]">SENDER:</span> {currentScene.mediaContent?.sender || 'external@sender.org'}</p>
                      <p><span className="text-[#ff8533]">RECIPIENT:</span> {currentScene.mediaContent?.recipient || 'target@network.org'}</p>
                      <p><span className="text-[#ff8533]">HEADER:</span> <strong className="text-white">{currentScene.mediaContent?.header || currentScene.title}</strong></p>
                    </div>
                    <div className="text-sm md:text-base font-sans text-slate-200 leading-relaxed pt-2">
                      {currentScene.mediaContent?.body || currentScene.dialogueText}
                    </div>
                  </div>
                </div>
              )}

              {/* MEDIA TYPE 4: VIRAL NEWS ALERT */}
              {currentScene.mediaType === 'news_alert' && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900/80 to-slate-950/80 border border-rose-500/40 space-y-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono font-bold text-xs animate-pulse">
                      VIRAL MEDIA ALERT
                    </span>
                    <span className="text-xs font-mono text-slate-300">TRENDING NETWORK FEED</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-serif text-white">
                    {currentScene.mediaContent?.header || currentScene.title}
                  </h3>
                  <p className="text-base text-slate-200 leading-relaxed">
                    {currentScene.dialogueText || currentScene.mediaContent?.body}
                  </p>
                </div>
              )}

              {/* MEDIA TYPE 5: POLICE DISPATCH & DIALOGUE */}
              {(currentScene.mediaType === 'police_dispatch' || currentScene.mediaType === 'dialogue' || currentScene.mediaType === 'cctv_log') && (
                <div className="space-y-4">
                  {currentScene.speaker && (
                    <div className="flex items-center gap-4 pb-4 border-b border-white/15">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#ff8533] bg-slate-800 shrink-0 shadow-lg">
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
                          <h4 className="text-lg font-bold text-white">{currentScene.speaker.name}</h4>
                          {currentScene.speaker.mood && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border bg-gradient-to-r ${getMoodGlow(currentScene.speaker.mood)}`}>
                              {currentScene.speaker.mood}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-slate-300">{currentScene.speaker.role}</p>
                      </div>
                    </div>
                  )}

                  {currentScene.dialogueText && (
                    <div className="text-base md:text-lg text-white font-sans leading-relaxed">
                      "{currentScene.dialogueText}"
                    </div>
                  )}
                </div>
              )}

              {/* Scene Narration Context */}
              {currentScene.narration && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-white/10 text-sm md:text-base text-slate-200 leading-relaxed font-sans">
                  <span className="text-[#ff8533] font-bold font-mono mr-2">// SCENE NARRATIVE:</span>
                  {currentScene.narration}
                </div>
              )}

              {/* Key Investigative Red Flag & Notebook Quick-Save */}
              {currentScene.keyTakeaway && (
                <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#ff8533]/15 border border-[#ff8533]/40 text-xs font-mono text-[#ffb829] shadow-lg">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#ff8533]" />
                    <div>
                      <strong className="uppercase font-bold tracking-wider text-white">Investigative Red Flag:</strong> {currentScene.keyTakeaway}
                    </div>
                  </div>

                  {onAddNote && (
                    <button
                      onClick={handleSaveSceneNote}
                      disabled={savedNote}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        savedNote
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-[#ff8533] hover:bg-[#ff9d5c] text-slate-950 border-transparent shadow-md hover:scale-105'
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
      <div className="relative z-20 max-w-4xl mx-auto w-full pt-4 border-t border-white/15 flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentSceneIndex === 0 || isLaunching}
          className="px-5 py-2.5 rounded-full glass-panel bg-slate-900/60 hover:bg-slate-800/80 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 text-xs font-mono font-bold flex items-center gap-2 border border-white/20 transition-all cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Scene</span>
        </button>

        <button
          onClick={handleNext}
          disabled={isLaunching}
          className={`px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
            isLastScene 
              ? 'bg-[#ff8533] text-slate-950 hover:bg-[#ff9d5c] shadow-xl shadow-[#ff8533]/40 font-extrabold scale-105' 
              : 'bg-[#ff8533] text-slate-950 hover:bg-[#ff9d5c] shadow-lg shadow-[#ff8533]/25'
          }`}
        >
          <span>{isLastScene ? 'Begin Investigation' : 'Next Scene'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* LOADING SCREEN ON INVESTIGATION LAUNCH */}
      <AnimatePresence>
        {isLaunching && (
          <LoadingScreen isDataReady={true} onComplete={onCompleteStory} />
        )}
      </AnimatePresence>
    </div>
  );
}
