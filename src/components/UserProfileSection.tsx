import React, { useState, useEffect } from 'react';
import { 
  Award, BookOpen, 
  ShieldCheck, Lock, CheckCircle2, ChevronRight, User, Star,
  Compass, Pencil, Check, X
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
  onUpdateProfileName?: (newName: string) => void;
}

export default function UserProfileSection({ 
  userProfile, 
  currentRank, 
  xp, 
  allCases, 
  onSelectCase,
  onUpdateProfileName
}: UserProfileSectionProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userProfile.name);

  useEffect(() => {
    setEditedName(userProfile.name);
  }, [userProfile.name]);

  const handleSaveName = () => {
    const trimmed = editedName.trim();
    if (trimmed && onUpdateProfileName) {
      onUpdateProfileName(trimmed);
    }
    setIsEditingName(false);
  };
  
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
    <div className="space-y-10 animate-fade-in pb-16 font-sans select-none text-white">
      
      {/* EDITORIAL HERO SECTION: User Profile & High-Contrast Metrics */}
      <div className="bg-slate-900/80 border border-white/10 glass-panel rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          
          {/* Avatar and User Bio */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative">
              <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-2xl bg-[#1e110a] border-2 border-[#ff8533] flex items-center justify-center shadow-xl shrink-0 overflow-hidden group">
                <User className="h-12 w-12 text-[#ff8533] transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#ff8533] text-[#1e110a] font-mono font-black text-[10px] px-2 py-0.5 rounded-full shadow-md uppercase">
                LVL {currentRank.level}
              </div>
            </div>
            
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName();
                        if (e.key === 'Escape') setIsEditingName(false);
                      }}
                      className="bg-black/60 border border-[#ff8533] text-white font-serif text-xl sm:text-2xl px-3 py-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff8533]"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="p-1.5 bg-[#ff8533] hover:bg-[#ff9955] text-[#1e110a] rounded-lg transition-colors cursor-pointer"
                      title="Save Name"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg transition-colors cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
                      {userProfile.name}
                    </h1>
                    {onUpdateProfileName && (
                      <button
                        type="button"
                        onClick={() => setIsEditingName(true)}
                        className="p-1.5 text-slate-400 hover:text-[#ff8533] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        title="Edit Username"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#ff8533] bg-[#ff8533]/10 border border-[#ff8533]/30 px-3 py-1 rounded-full uppercase tracking-wider self-center sm:self-start">
                  <Star className="h-3.5 w-3.5 fill-current text-[#ff8533]" />
                  LEVEL {currentRank.level} DETECTIVE
                </span>
              </div>

              {userProfile.email && (
                <p className="text-xs font-mono text-[#ffb829] font-semibold tracking-wide">
                  {userProfile.email}
                </p>
              )}

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1 font-sans">
                Active defender of social media integrity, specializing in algorithmic bias awareness, deepfake spoofing forensics, and media security economics.
              </p>
            </div>
          </div>

          {/* XP & Level Meter Card */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 min-w-[280px] lg:max-w-md w-full shadow-inner space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-mono font-bold text-[#ff8533] uppercase tracking-widest flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#ff8533]" />
                RANK: {currentRank.name.toUpperCase()}
              </span>
              <span className="text-sm font-mono font-black text-white">
                {xp} <span className="text-slate-400 font-normal text-xs">XP TOTAL</span>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-black/60 h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div 
                className="bg-gradient-to-r from-[#ff8533] to-[#ffb829] h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex justify-between font-medium">
              <span>0 XP</span>
              {currentRank.nextThresh !== null ? (
                <span>Next Rank: <strong className="text-[#ffb829]">{currentRank.nextThresh} XP</strong> ({xpNeeded} XP remaining)</span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ADVANCED MASTER RANK SECURED
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Floating Quick Stats Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 text-center sm:text-left relative z-10">
          <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block mb-1">
              SOLVED DIRECTIVES
            </span>
            <span className="text-2xl font-sans font-black text-emerald-400 block tracking-tight">
              {userProfile.casesSolved} <span className="text-xs font-mono font-semibold text-slate-400">LABS</span>
            </span>
          </div>

          <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block mb-1">
              HONOR DECORATIONS
            </span>
            <span className="text-2xl font-sans font-black text-[#ff8533] block tracking-tight">
              {unlockedCount} <span className="text-xs font-mono font-semibold text-slate-400">/ {totalCount} UNLOCKED</span>
            </span>
          </div>

          <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block mb-1">
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
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-mono font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Award className="h-5 w-5 text-[#ff8533]" />
                ACADEMY HONOR DECORATIONS
              </h2>
              <span className="text-xs font-mono font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
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
                        ? 'border-[#ff8533]/40 bg-[#ff8533]/10 text-white shadow-lg shadow-[#ff8533]/5'
                        : 'border-white/5 bg-black/30 text-slate-500'
                    }`}
                  >
                    {/* Top status tag */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                        isUnlocked 
                          ? 'bg-[#ff8533] text-[#1e110a] font-black' 
                          : 'bg-white/5 text-slate-500 border border-white/10'
                      }`}>
                        {isUnlocked ? 'DECORATION SECURED' : 'LOCKED'}
                      </span>

                      {isUnlocked ? (
                        <ShieldCheck className="h-5 w-5 text-[#ff8533]" />
                      ) : (
                        <Lock className="h-4 w-4 text-slate-600" />
                      )}
                    </div>

                    {/* Badge details */}
                    <div className="space-y-1.5">
                      <h4 className="text-base font-serif font-bold text-white">
                        {badge.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {badge.description}
                      </p>
                    </div>

                    {/* Cleared timestamp footer */}
                    {isUnlocked && badge.unlockedAt && (
                      <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#ffb829] font-bold">
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
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-mono font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                SOLVED INVESTIGATION REGISTRY
              </h2>
              <span className="text-xs font-mono font-bold text-slate-400">
                {solvedCases.length} COMPLETED
              </span>
            </div>

            {solvedCases.length === 0 ? (
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-8 text-center space-y-3">
                <BookOpen className="h-10 w-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Registry is currently empty</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed font-sans">
                  Start an active investigation inside the Case Library to unlock certificates and logs here!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {solvedCases.map((caseData) => (
                  <div 
                    key={caseData.id}
                    className="p-5 bg-slate-900/80 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/50 transition-all shadow-lg"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap font-mono text-[10px]">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold uppercase tracking-wider">
                          ✓ SECURED & LOGGED
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#ffb829]/10 border border-[#ffb829]/30 text-[#ffb829] font-bold uppercase">
                          {caseData.topic}
                        </span>
                      </div>
                      <h4 className="text-base font-serif font-extrabold text-white">
                        {caseData.title}
                      </h4>
                      <p className="text-xs text-slate-300 font-sans">
                        Threat Actor: <strong className="text-white">{caseData.threatActor}</strong> · Difficulty: <strong className="text-[#ff8533]">{caseData.difficulty}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => { onSelectCase(caseData.id); }}
                      className="px-5 py-2.5 bg-[#ff8533] hover:bg-[#ff9955] text-[#1e110a] font-mono font-bold text-xs rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center shadow-md"
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
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-base font-mono font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Compass className="h-5 w-5 text-[#ff8533]" />
                  UNSOLVED DIRECTIVES FOR TRAINING
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {unsolvedCases.slice(0, 4).map((caseData) => (
                  <div 
                    key={caseData.id} 
                    className="p-5 bg-slate-900/80 border border-white/10 rounded-2xl hover:border-[#ff8533]/50 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-extrabold text-[#ff8533] uppercase tracking-wider block">
                        {caseData.difficulty} · {caseData.tag}
                      </span>
                      <h4 className="text-sm font-serif font-bold text-white leading-snug">
                        {caseData.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => onSelectCase(caseData.id)}
                      className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-xs font-mono font-bold text-[#ff8533] hover:text-[#ff9955] uppercase transition-colors text-left cursor-pointer"
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
          
          <div className="bg-slate-900/80 border border-white/10 rounded-[28px] p-6 sm:p-7 space-y-5 shadow-2xl relative overflow-hidden text-white">
            <h3 className="text-sm font-mono font-black text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/10 pb-3">
              <ShieldCheck className="h-5 w-5 text-[#ff8533]" />
              SELF-DEFENSE PLAYBOOK
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
              We raising awareness about media and digital manipulation, training citizen detectives to investigate cyber events and verify the truth.
            </p>

            <div className="space-y-5 pt-1">
              <div className="space-y-1.5 p-3.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-xs font-mono font-extrabold text-[#ff8533] uppercase block tracking-wider">
                  1. ALGORITHMIC ECHO CHAMBERS
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Engage critically with feed structures. Clickbait engines exploit confirmation bias. Counteract by seeking multiple diverse viewpoints.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-xs font-mono font-extrabold text-[#ff8533] uppercase block tracking-wider">
                  2. SYNTHETIC MEDIA / DEEPFAKES
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Verify authentic sources. Analyze facial margins, auditory anomalies, and speech cadence. Use reverse-image lookups.
                </p>
              </div>

              <div className="space-y-1.5 p-3.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-xs font-mono font-extrabold text-[#ff8533] uppercase block tracking-wider">
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
