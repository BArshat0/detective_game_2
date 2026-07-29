import React from 'react';
import { 
  Award, BookOpen, 
  ShieldCheck, Lock, CheckCircle2, ChevronRight, User, Star,
  Sparkles, Compass, Zap
} from 'lucide-react';
import { Case, UserProfile } from '../types';

interface UserProfileSectionProps {
  userProfile: UserProfile;
  currentRank: {
    name: string;
    level: number;
    nextThresh: number | null;
    prevThresh: number;
  };
  xp: number;
  allCases: Case[];
  onSelectCase: (caseId: string) => void;
}

export default function UserProfileSection({ 
  userProfile, 
  currentRank, 
  xp, 
  allCases, 
  onSelectCase
}: UserProfileSectionProps) {
  
  // Calculate progress percent to next rank from 0
  let xpProgressPercent = 100;
  let xpNeeded = 0;
  if (currentRank.nextThresh !== null) {
    xpProgressPercent = Math.min(Math.max((xp / currentRank.nextThresh) * 100, 0), 100);
    xpNeeded = currentRank.nextThresh - xp;
  }

  // Find cases that the user has solved
  const solvedCases = allCases.filter(c => userProfile.solvedCaseIds.includes(c.id));
  const unsolvedCases = allCases.filter(c => !userProfile.solvedCaseIds.includes(c.id) && !userProfile.customCases.some(cc => cc.id === c.id));

  const unlockedCount = userProfile.achievements.filter(a => a.isUnlocked).length;
  const totalCount = userProfile.achievements.length;
  const completionRate = allCases.length > 0 ? Math.round((userProfile.solvedCaseIds.length / allCases.length) * 100) : 0;

  return (
    <div className="space-y-10 animate-fade-in pb-16 font-sans select-none">
      
      {/* EDITORIAL HERO SECTION: User Profile & High-Contrast Metrics */}
      <div className="bg-[#0b131e]/90 border border-white/20 rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
        {/* Glowing atmospheric background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full filter blur-[100px] -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full filter blur-[90px] -ml-20 -mb-20 pointer-events-none" />
        
        {/* Halftone texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          
          {/* Avatar and User Bio */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative">
              <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 border-2 border-amber-400/80 flex items-center justify-center shadow-xl shadow-amber-500/10 shrink-0 overflow-hidden group">
                <User className="h-12 w-12 text-amber-300 transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 font-mono font-black text-[10px] px-2 py-0.5 rounded-full shadow-md border border-slate-900 uppercase">
                LVL {currentRank.level}
              </div>
            </div>
            
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
                  {userProfile.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 bg-amber-400/15 border border-amber-400/40 px-3 py-1 rounded-full uppercase tracking-wider self-center sm:self-start">
                  <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
                  LEVEL {currentRank.level} DETECTIVE
                </span>
              </div>

              {userProfile.email && (
                <p className="text-xs font-mono text-amber-300/80 font-semibold tracking-wide">
                  {userProfile.email}
                </p>
              )}

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1 font-sans">
                Active defender of social media integrity, specializing in algorithmic bias awareness, deepfake spoofing forensics, and media security economics.
              </p>
            </div>
          </div>

          {/* XP & Level Meter Card */}
          <div className="bg-slate-950/80 border border-white/15 rounded-2xl p-5 min-w-[280px] lg:max-w-md w-full shadow-inner space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                RANK: {currentRank.name.toUpperCase()}
              </span>
              <span className="text-sm font-mono font-black text-white">
                {xp} <span className="text-amber-300/80 font-normal text-xs">XP TOTAL</span>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-white/15 p-0.5 shadow-inner">
              <div 
                className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>

            <div className="text-[11px] font-mono text-slate-300 flex justify-between font-medium">
              <span>0 XP</span>
              {currentRank.nextThresh !== null ? (
                <span>Next Rank: <strong className="text-amber-300">{currentRank.nextThresh} XP</strong> ({xpNeeded} XP remaining)</span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ADVANCED MASTER RANK SECURED
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Floating Quick Stats Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/15 text-center sm:text-left relative z-10">
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
            <span className="text-[11px] font-mono font-bold text-slate-300 uppercase block mb-1">
              SOLVED DIRECTIVES
            </span>
            <span className="text-2xl font-sans font-black text-emerald-400 block tracking-tight">
              {userProfile.casesSolved} <span className="text-xs font-mono font-semibold text-slate-300">LABS</span>
            </span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
            <span className="text-[11px] font-mono font-bold text-slate-300 uppercase block mb-1">
              HONOR DECORATIONS
            </span>
            <span className="text-2xl font-sans font-black text-amber-300 block tracking-tight">
              {unlockedCount} <span className="text-xs font-mono font-semibold text-slate-300">/ {totalCount} UNLOCKED</span>
            </span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
            <span className="text-[11px] font-mono font-bold text-slate-300 uppercase block mb-1">
              COMPLETION RATE
            </span>
            <span className="text-2xl font-sans font-black text-sky-400 block tracking-tight">
              {completionRate}%
            </span>
          </div>
        </div>

      </div>

      {/* TWO-COLUMN LAYOUT: Content Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Decorations & Solved Dossiers (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section 1: Honor Decorations */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <h2 className="text-base font-mono font-black text-amber-300 uppercase tracking-widest flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                ACADEMY HONOR DECORATIONS
              </h2>
              <span className="text-xs font-mono font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                {unlockedCount} of {totalCount} Badges
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {userProfile.achievements.map((badge) => {
                const isUnlocked = badge.isUnlocked;
                return (
                  <div
                    key={badge.id}
                    className={`p-5 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between space-y-3 ${
                      isUnlocked
                        ? 'border-amber-400/50 bg-gradient-to-b from-amber-500/15 to-slate-900/90 text-white shadow-xl shadow-amber-500/5'
                        : 'border-white/15 bg-slate-950/80 text-slate-200 hover:border-white/30'
                    }`}
                  >
                    {/* Top status tag */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                        isUnlocked 
                          ? 'bg-amber-400 text-slate-950 font-black' 
                          : 'bg-white/10 text-slate-300 border border-white/10'
                      }`}>
                        {isUnlocked ? 'DECORATION SECURED' : 'LOCKED'}
                      </span>

                      {isUnlocked ? (
                        <ShieldCheck className="h-5 w-5 text-amber-300" />
                      ) : (
                        <Lock className="h-4 w-4 text-slate-400" />
                      )}
                    </div>

                    {/* Badge details */}
                    <div className="space-y-1.5">
                      <h4 className={`text-base font-serif font-bold ${isUnlocked ? 'text-white' : 'text-slate-100'}`}>
                        {badge.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {badge.description}
                      </p>
                    </div>

                    {/* Cleared timestamp footer */}
                    {isUnlocked && badge.unlockedAt && (
                      <div className="pt-2 mt-2 border-t border-amber-400/20 flex items-center justify-between text-[10px] font-mono text-amber-300 font-bold">
                        <span>CLEARED</span>
                        <span>{badge.unlockedAt}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Solved Investigations Registry */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <h2 className="text-base font-mono font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                SOLVED INVESTIGATION REGISTRY
              </h2>
              <span className="text-xs font-mono font-bold text-slate-300">
                {solvedCases.length} COMPLETED
              </span>
            </div>

            {solvedCases.length === 0 ? (
              <div className="bg-slate-950/70 border border-white/15 rounded-2xl p-8 text-center space-y-3">
                <BookOpen className="h-10 w-10 text-slate-500 mx-auto" />
                <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Registry is currently empty</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed font-sans">
                  Start an active investigation inside the Case Library to unlock certificates and logs here!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {solvedCases.map((caseData) => (
                  <div 
                    key={caseData.id}
                    className="p-5 bg-slate-950/80 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-400 transition-all shadow-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap font-mono text-[10px]">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold uppercase tracking-wider">
                          ✓ SECURED & LOGGED
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold uppercase">
                          {caseData.topic}
                        </span>
                      </div>
                      <h4 className="text-base font-serif font-extrabold text-white">
                        {caseData.title}
                      </h4>
                      <p className="text-xs text-slate-300 font-sans">
                        Threat Actor: <strong className="text-slate-100">{caseData.threatActor}</strong> · Difficulty: <strong className="text-amber-300">{caseData.difficulty}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => { onSelectCase(caseData.id); }}
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-bold text-xs rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center shadow-md hover:scale-105"
                    >
                      <span>RE-EXPLORE</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Pending Directives (Quick Discovery) */}
          {unsolvedCases.length > 0 && (
            <div className="space-y-5">
              <div className="border-b border-white/15 pb-3">
                <h2 className="text-base font-mono font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                  <Compass className="h-5 w-5 text-amber-400" />
                  UNSOLVED DIRECTIVES FOR TRAINING
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {unsolvedCases.slice(0, 4).map((caseData) => (
                  <div 
                    key={caseData.id} 
                    className="p-5 bg-slate-950/80 border border-white/15 rounded-2xl hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-extrabold text-amber-300 uppercase tracking-wider block">
                        {caseData.difficulty} · {caseData.tag}
                      </span>
                      <h4 className="text-sm font-serif font-bold text-white leading-snug">
                        {caseData.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => onSelectCase(caseData.id)}
                      className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 uppercase transition-colors text-left"
                    >
                      <span>DEPLOY TO DIRECTIVE</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Self Defense Playbook */}
        <div className="space-y-8">
          
          <div className="bg-slate-950/90 border border-amber-500/30 rounded-[28px] p-6 sm:p-7 space-y-5 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full filter blur-[60px] pointer-events-none" />

            <h3 className="text-sm font-mono font-black text-amber-300 uppercase tracking-widest flex items-center gap-2 border-b border-white/15 pb-3">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              SELF-DEFENSE PLAYBOOK
            </h3>
            
            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
              We raising awareness about media and digital manipulation, training citizen detectives to investigate cyber events and verify the truth.
            </p>

            <div className="space-y-5 pt-1">
              <div className="space-y-1.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-mono font-extrabold text-amber-300 uppercase block tracking-wider">
                  1. ALGORITHMIC ECHO CHAMBERS
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Engage critically with feed structures. Clickbait engines exploit confirmation bias. Counteract by seeking multiple diverse viewpoints.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-mono font-extrabold text-amber-300 uppercase block tracking-wider">
                  2. SYNTHETIC MEDIA / DEEPFAKES
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Verify authentic sources. Analyze facial margins, auditory anomalies, and speech cadence. Use reverse-image lookups.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs font-mono font-extrabold text-amber-300 uppercase block tracking-wider">
                  3. COM-DISINFO ECONOMICS
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Financial hubs monetize rage clicks. Guard credit credentials and inspect sponsor patterns on viral outlets to verify commercial traps.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
