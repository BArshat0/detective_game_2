import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, BookOpen, 
  Sparkles, CheckCircle2,
  FileText, Compass, Shield, Target, UserCheck
} from 'lucide-react';
import { Case } from '../types';

interface CaseLibraryViewProps {
  allCases: Case[];
  solvedCaseIds: string[];
  onSelectCase: (caseId: string) => void;
  onViewProfile: () => void;
}

export default function CaseLibraryView({
  allCases,
  solvedCaseIds,
  onSelectCase,
  onViewProfile
}: CaseLibraryViewProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(allCases[0]?.id || '');
  const activeCase = allCases.find(c => c.id === selectedCaseId) || allCases[0];

  // Parallax mouse effect for the story intro card
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const isCurrentSolved = activeCase ? solvedCaseIds.includes(activeCase.id) : false;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full text-slate-100 font-sans relative py-4 select-none"
    >
      {/* SECTION HEADER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400 uppercase tracking-[0.25em] font-bold">
            <span>● DIGITAL SAFETY CASE ARCHIVE</span>
            <span>•</span>
            <span>{allCases.length} ACTIVE DOSSIERS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight mt-0.5">
            EXHIBIT LIBRARY
          </h1>
        </div>

        <button
          onClick={onViewProfile}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-amber-300 hover:text-amber-200 transition-all cursor-pointer shadow-sm hover:scale-105"
        >
          <span>DETECTIVE PROFILE & ACHIEVEMENTS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* MAIN SPLIT-SCREEN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start min-h-[580px]">
        
        {/* LEFT COLUMN (5/12): Expressive Kinetic Typography & Editorial Story Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 relative">
          
          {/* Kinetic Mixed Typography Banner */}
          <div className="space-y-1.5">
            <div className="font-serif italic font-light text-2xl sm:text-3xl text-amber-200/90 tracking-normal leading-tight">
              Investigate
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-white uppercase leading-[0.9] font-sans">
              CASE <span className="font-serif italic font-normal text-amber-400 lowercase">library</span>
            </h2>
          </div>

          {/* Interactive Editorial Story Card Stack */}
          <div className="relative w-full h-[360px] my-2 flex items-center justify-center">
            {/* Background Layer Card 1 */}
            <motion.div
              animate={{ 
                rotate: -5 + mousePos.x * 4, 
                x: mousePos.x * -10, 
                y: mousePos.y * -8 
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              className="absolute w-full max-w-sm h-[330px] bg-slate-950/80 border border-amber-500/20 rounded-2xl shadow-2xl p-6 overflow-hidden opacity-50 pointer-events-none"
            >
              <div className="h-full border border-dashed border-white/10 rounded-xl p-4" />
            </motion.div>

            {/* Background Layer Card 2 */}
            <motion.div
              animate={{ 
                rotate: 4 + mousePos.x * -5, 
                x: mousePos.x * 8, 
                y: mousePos.y * 6 
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              className="absolute w-full max-w-sm h-[340px] bg-slate-900/90 border border-white/20 rounded-2xl shadow-2xl p-6 overflow-hidden opacity-75 pointer-events-none"
            >
              <div className="h-full border border-dashed border-white/15 rounded-xl p-4" />
            </motion.div>

            {/* Foreground Interactive Editorial Story Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCase.id}
                initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: mousePos.x * 6,
                  x: mousePos.x * 12,
                  y: mousePos.y * 10
                }}
                exit={{ opacity: 0, scale: 0.95, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 140, damping: 16 }}
                className="relative w-full max-w-sm h-[350px] bg-[#0d1422] text-slate-100 border-2 border-amber-400/40 rounded-2xl shadow-2xl p-6 flex flex-col justify-between z-10 overflow-hidden backdrop-blur-xl"
              >
                {/* Handwritten-Style Decorative Mark Accent */}
                <div className="absolute top-3 right-4 font-mono text-[10px] font-extrabold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider rotate-[3deg]">
                  ✏️ BRIEF
                </div>

                {/* Top Dossier Header */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-amber-400/90 font-bold uppercase tracking-wider">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>CLASSIFIED DOSSIER #{activeCase.id.slice(0, 6).toUpperCase()}</span>
                  </div>

                  <h3 className="text-xl font-serif font-extrabold text-white leading-tight">
                    {activeCase.title}
                  </h3>
                </div>

                {/* Editorial Story Introduction Quote Box */}
                <div className="my-auto p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 font-serif relative">
                  {/* Organic underline decoration */}
                  <div className="absolute -top-1 left-4 w-12 h-1 bg-amber-400/60 rounded-full" />
                  
                  <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed line-clamp-4">
                    "{activeCase.introduction}"
                  </p>
                </div>

                {/* Bottom Story Metadata */}
                <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="flex items-center gap-1 text-amber-300 font-semibold">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    {activeCase.threatActor}
                  </span>
                  <span className="text-emerald-400 font-bold uppercase">
                    {activeCase.topic}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Kinetic Footer Quote */}
          <div className="space-y-1 font-serif pt-1">
            <p className="text-xl sm:text-2xl italic font-normal text-white leading-tight">
              Just examine, and you will understand.
            </p>
            <p className="text-[10px] font-mono text-amber-400/80 uppercase tracking-widest">
              ( DIGITAL SAFETY FORENSICS • ACADEMY EDITION )
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN (7/12): Structural Split-Screen Case Exhibition Panel */}
        <div className="lg:col-span-7 bg-[#0b0f19] border border-white/15 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-xl">
          
          {/* Subtle Halftone Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* TOP SECTION: Intro Header & Case Navigation Tabs */}
          <div className="relative z-10 space-y-4 pb-6 border-b border-white/15">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> SELECT CASE DOSSIER:
              </span>
              <span className="text-slate-400">ACTIVE REGISTRY</span>
            </div>

            {/* Horizontal Scrollable Case Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
              {allCases.map((c) => {
                const isSelected = c.id === selectedCaseId;
                const isSolved = solvedCaseIds.includes(c.id);

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`px-4 py-2 rounded-full border transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-400/20'
                        : 'bg-white/5 border-white/15 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    <span className="truncate max-w-[140px] sm:max-w-[180px]">{c.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MIDDLE SECTION: Active Case Narrative Exhibition */}
          <div className="relative z-10 my-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCase.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Case Status & Tag Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold uppercase tracking-wider">
                      {activeCase.status}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold uppercase tracking-wider">
                      DIFFICULTY: {activeCase.difficulty}
                    </span>
                  </div>

                  {isCurrentSolved && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> RESOLVED CASE
                    </span>
                  )}
                </div>

                {/* Case Headline */}
                <div>
                  <span className="text-xs font-mono text-amber-400 tracking-widest uppercase block mb-1">
                    CATEGORY // {activeCase.tag}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white leading-tight">
                    {activeCase.title}
                  </h2>
                </div>

                {/* Poetic Quote / Excerpt Block in Serif */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 font-serif relative">
                  <p className="text-base sm:text-lg text-slate-200 italic leading-relaxed">
                    "{activeCase.introduction}"
                  </p>
                  <p className="text-xs font-mono text-slate-400 font-normal">
                    ( Location: {activeCase.location?.name || 'Digital Sector Grid'} • Key Witness Interviews: {activeCase.witnesses.length} Persons )
                  </p>
                </div>

                {/* Professional Case Metrics (No random timing) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
                    <span className="text-[10px] text-amber-400/90 uppercase tracking-widest font-bold block">
                      TARGET THREAT ACTOR
                    </span>
                    <div className="text-base font-extrabold text-white tracking-wide font-sans">
                      {activeCase.threatActor.toUpperCase()}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold block">
                      EVIDENCE FILES ATTACHED
                    </span>
                    <div className="text-base font-extrabold text-white tracking-wide font-sans">
                      {activeCase.evidences.length} FORENSIC DOSSIERS
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* BOTTOM SECTION: Primary Launch Action Button */}
          <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between gap-4">
            <div className="font-mono text-xs text-slate-400 hidden sm:block">
              <span>READY FOR DISPATCH ANALYSIS</span>
            </div>

            <button
              onClick={() => onSelectCase(activeCase.id)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-amber-400/20 hover:scale-105"
            >
              <span>INVESTIGATE THIS CASE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ALL CASES GALLERY CAROUSEL AT BOTTOM - EDITORIAL STORY CARDS */}
      <div className="mt-16 pt-8 border-t border-white/15 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> ALL ACTIVE INVESTIGATION DOSSIERS
          </h3>
          <span className="text-xs font-mono text-slate-400">{allCases.length} AVAILABLE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCases.map((c) => {
            const isSolved = solvedCaseIds.includes(c.id);
            const isSelected = c.id === selectedCaseId;

            return (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCaseId(c.id);
                }}
                className={`group relative p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-5 ${
                  isSelected
                    ? 'bg-slate-900/90 border-amber-400/80 shadow-2xl shadow-amber-500/10 scale-[1.01]'
                    : 'bg-[#0d131f]/90 hover:bg-slate-900/80 border-white/15 hover:border-white/30'
                }`}
              >
                <div className="space-y-4">
                  {/* Top status & category line */}
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-bold uppercase">
                        {c.tag}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full border border-white/15 bg-white/5 text-slate-300 font-bold uppercase">
                        {c.difficulty}
                      </span>
                    </div>

                    {isSolved ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> RESOLVED
                      </span>
                    ) : (
                      <span className="text-slate-400 uppercase tracking-wider font-semibold">OPEN DOSSIER</span>
                    )}
                  </div>

                  {/* Story Title */}
                  <div>
                    <h4 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {c.title}
                    </h4>
                    <p className="text-xs font-mono text-amber-400/80 mt-1 uppercase tracking-wider font-semibold">
                      THREAT: {c.threatActor}
                    </p>
                  </div>

                  {/* Story Introduction Card Content */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-serif space-y-2">
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic line-clamp-4">
                      "{c.introduction}"
                    </p>
                  </div>
                </div>

                {/* Footer launch trigger (Clean metadata, no random timing) */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    {c.evidences.length} EVIDENCE FILES
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCase(c.id);
                    }}
                    className="text-amber-400 font-bold group-hover:text-amber-300 flex items-center gap-1.5 transition-all group-hover:translate-x-1"
                  >
                    <span>INVESTIGATE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

