import React from 'react';
import { 
  Award, Shield, BookOpen, Flame, Trash, Play, 
  ShieldCheck, Lock, CheckCircle2, ChevronRight, User, Star
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
  onDeleteCase: (caseId: string) => void;
}

export default function UserProfileSection({ 
  userProfile, 
  currentRank, 
  xp, 
  allCases, 
  onSelectCase, 
  onDeleteCase 
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

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER SECTION: User Profile & Hero Stats */}
      <div className="bg-gradient-to-br from-[#1c140e] to-[#0d0906] border border-[#ff8533]/15 rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff8533]/5 rounded-full filter blur-[80px] -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          
          {/* Avatar and Info */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-[#ff8533]/10 border-2 border-[#ff8533] flex items-center justify-center shadow-lg shadow-[#ff8533]/5 shrink-0">
              <User className="h-10 w-10 text-[#ff8533]" />
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="font-serif text-3xl font-bold tracking-tight text-white uppercase">
                  {userProfile.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#ffb829] bg-[#ffb829]/10 border border-[#ffb829]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider self-center sm:self-start mt-1 sm:mt-0">
                  <Star className="h-3 w-3 fill-current" /> LEVEL {currentRank.level}
                </span>
              </div>
              <p className="text-xs text-[#a89485] font-mono">
                {userProfile.email}
              </p>
              <p className="text-xs text-[#bdbdbd] max-w-md leading-relaxed pt-1.5">
                Active defender of social media integrity, specializing in algorithmic bias awareness, deepfake spoofing forensics, and media security economics.
              </p>
            </div>
          </div>

          {/* XP & Level Meter Card */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-5 min-w-[280px] lg:max-w-md w-full">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-[10px] font-mono font-bold text-[#ff8533] uppercase tracking-wider">
                Rank: {currentRank.name}
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {xp} <span className="text-[#a89485] font-normal">XP TOTAL</span>
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5 mb-2.5">
              <div 
                className="bg-gradient-to-r from-[#ff8533] to-[#ffb829] h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>

            <div className="text-[10px] font-mono text-[#a89485] flex justify-between">
              <span>0 XP</span>
              {currentRank.nextThresh !== null ? (
                <span>Next Rank: {currentRank.nextThresh} XP ({xpNeeded} XP remaining)</span>
              ) : (
                <span className="text-[#15846e] font-bold">✓ ADVANCED MASTER RANK SECURED</span>
              )}
            </div>
          </div>

        </div>

        {/* Floating Quick Stats Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5 text-center sm:text-left">
          <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-[#9a9a9a] uppercase block">SOLVED DIRECTIVES</span>
            <span className="text-xl text-[#15846e] mt-1 font-mono font-bold block">
              {userProfile.casesSolved} <span className="text-[10px] text-[#9a9a9a] font-normal">LABS</span>
            </span>
          </div>
          <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-[#9a9a9a] uppercase block">HONOR DECORATIONS</span>
            <span className="text-xl text-[#ffb829] mt-1 font-mono font-bold block">
              {userProfile.achievements.filter(a => a.isUnlocked).length} <span className="text-[10px] text-[#9a9a9a] font-normal">UNLOCKED</span>
            </span>
          </div>
          <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-[#9a9a9a] uppercase block">COMPLETION RATE</span>
            <span className="text-xl text-white mt-1 font-mono font-bold block">
              {allCases.length > 0 ? Math.round((userProfile.solvedCaseIds.length / allCases.length) * 100) : 0}%
            </span>
          </div>
        </div>

      </div>

      {/* TWO-COLUMN LAYOUT: Content Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN: Decorations & Solved Dossiers (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Honor Decorations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-[#ffb829]" />
                ACADEMY HONOR DECORATIONS
              </h2>
              <span className="text-[10px] font-mono text-[#a89485]">
                {userProfile.achievements.filter(a => a.isUnlocked).length} of {userProfile.achievements.length} Badges
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {userProfile.achievements.map((badge) => {
                const isUnlocked = badge.isUnlocked;
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 relative ${
                      isUnlocked
                        ? 'border-[#ff8533]/30 bg-[#ff8533]/5 text-white shadow-md shadow-[#ff8533]/2'
                        : 'border-white/5 bg-white/[0.01] text-[#9a9a9a]/40'
                    }`}
                  >
                    {/* Lock Icon Overlay for locked items */}
                    {!isUnlocked && (
                      <div className="absolute top-4 right-4 text-white/10">
                        <Lock className="h-4 w-4" />
                      </div>
                    )}
                    
                    {isUnlocked && (
                      <div className="absolute top-4 right-4 text-[#ffb829]">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <span className={`text-[10px] font-mono font-bold uppercase ${isUnlocked ? 'text-[#ff8533]' : 'text-[#9a9a9a]/30'}`}>
                        {isUnlocked ? 'DECORATION SECURED' : 'LOCKED'}
                      </span>
                      <h4 className={`text-sm font-serif font-bold ${isUnlocked ? 'text-white' : 'text-[#9a9a9a]/50'}`}>
                        {badge.title}
                      </h4>
                      <p className="text-[11px] leading-relaxed opacity-85">
                        {badge.description}
                      </p>
                    </div>

                    {isUnlocked && badge.unlockedAt && (
                      <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-[#ffb829]">
                        <span>Dossier cleared</span>
                        <span>{badge.unlockedAt}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Solved Investigations Registry */}
          <div className="space-y-4">
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#15846e]" />
              SOLVED INVESTIGATION REGISTRY
            </h2>

            {solvedCases.length === 0 ? (
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 text-center space-y-3">
                <BookOpen className="h-8 w-8 text-[#a89485]/40 mx-auto" />
                <h4 className="text-xs font-mono font-bold text-white uppercase">Registry is currently empty</h4>
                <p className="text-xs text-[#a89485] max-w-sm mx-auto leading-relaxed">
                  Start an active directive inside the Forensic Labs to unlock certificates and logs here!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {solvedCases.map((caseData) => (
                  <div 
                    key={caseData.id}
                    className="p-4 bg-gradient-to-r from-white/[0.02] to-transparent border border-[#15846e]/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#15846e]/60 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-mono font-bold text-[#15846e] uppercase tracking-wider border border-[#15846e]/30 px-2 py-0.5 rounded bg-[#15846e]/5">
                          SECURED & LOGGED
                        </span>
                        <span className="text-[10px] font-mono text-[#ffb829] uppercase">
                          {caseData.topic}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {caseData.title}
                      </h4>
                      <p className="text-xs text-[#a89485] font-mono">
                        Threat Actor: {caseData.threatActor} · Difficulty: {caseData.difficulty}
                      </p>
                    </div>

                    <button
                      onClick={() => onSelectCase(caseData.id)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-mono text-[11px] font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center"
                    >
                      <span>RE-EXPLORE DOSSIER</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Pending Directives (Quick Discovery) */}
          {unsolvedCases.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-mono font-bold text-[#a89485] uppercase tracking-wider">
                UNSOLVED DIRECTIVES FOR TRAINING
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {unsolvedCases.slice(0, 4).map((caseData) => (
                  <div 
                    key={caseData.id} 
                    className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-white/10 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-mono font-bold text-[#ff8533] uppercase block mb-1">
                        {caseData.difficulty} · {caseData.tag}
                      </span>
                      <h4 className="text-xs font-bold text-white">
                        {caseData.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => onSelectCase(caseData.id)}
                      className="mt-3.5 flex items-center gap-1 text-[10px] font-mono font-bold text-[#ff8533] hover:text-[#ff9d5c] uppercase transition-colors text-left"
                    >
                      <span>Deploy to directive</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Self Defense Tips */}
        <div className="space-y-8">
          
          {/* Section 1: Awareness & Prevention Playbook */}
          <div className="bg-[#1c140e] border border-[#ff8533]/15 rounded-[24px] p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-[#ff8533] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-[#ff8533]" />
              SELF-DEFENSE PLAYBOOK
            </h3>
            
            <p className="text-xs text-[#d1c4b9] leading-relaxed">
              We raising awareness about media and digital manipulation, training citizen detectives to investigate cyber events and verify the truth.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-white uppercase block">
                  1. ALGORITHMIC ECHO CHAMBERS
                </span>
                <p className="text-[11px] text-[#a89485] leading-relaxed">
                  Engage critically with feed structures. Clickbait engines exploit confirmation bias. Counteract by seeking multiple diverse viewpoints.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-white uppercase block">
                  2. SYNTHETIC MEDIA / DEEPFAKES
                </span>
                <p className="text-[11px] text-[#a89485] leading-relaxed">
                  Verify authentic sources. Analyze facial margins, auditory anomalies, and speech cadence. Use reverse-image lookups.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-white uppercase block">
                  3. COM-DISINFO ECONOMICS
                </span>
                <p className="text-[11px] text-[#a89485] leading-relaxed">
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
