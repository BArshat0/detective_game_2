import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ShieldCheck, Brain, Award, MapPin, MessageSquare, 
  ArrowLeft, BookOpen, Calendar, Flame, BookOpenCheck, 
  FileText, ChevronRight, Loader2, LogOut, User
} from 'lucide-react';
import Markdown from 'react-markdown';

// Core Subcomponents
import CaseCard from './components/CaseCard';
import EvidenceViewer from './components/EvidenceViewer';
import InterrogationTerminal from './components/InterrogationTerminal';
import ClueBoard from './components/ClueBoard';
import TimelineBuilder from './components/TimelineBuilder';
import MentorDrone from './components/MentorDrone';
import ShaderGradient from './components/ShaderGradient';
import VantaBackground from './components/VantaBackground';
import LoginSignup from './components/LoginSignup';
import UserProfileSection from './components/UserProfileSection';
import LoadingScreen from './components/LoadingScreen';

// Shared types and handcrafted cases
import { Case, UserProfile, CaseState } from './types';
import { HANDCRAFTED_CASES } from './data/cases';
import { safeGet, safeSet } from './lib/safeLookup';

const DEFAULT_ACHIEVEMENTS = [
  { id: 'badge_first_case', title: 'First Contact', description: 'Initiated your first forensic investigation.', isUnlocked: false },
  { id: 'badge_synthetic', title: 'Neural Forensics Pro', description: 'Proven Dr. Helen Vance testimony was deepfake.', isUnlocked: false },
  { id: 'badge_sentinel', title: 'Scholarship Sentinel', description: 'Dismantled the Shadow Syndicate baiting ring.', isUnlocked: false },
  { id: 'badge_supply_chain', title: 'Hardware Guardian', description: 'Neutralized the Sector 7 relay sabotage.', isUnlocked: false },
  { id: 'badge_creator', title: 'Quantum Architect', description: 'Synthesized your first custom learning case.', isUnlocked: false }
];

const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Investigator',
  email: '',
  casesSolved: 0,
  solvedCaseIds: [],
  activeCaseId: null,
  achievements: DEFAULT_ACHIEVEMENTS,
  customCases: []
};

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'library' | 'game' | 'profile'>('library');
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('evidence');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);

  // Auth State
  const [authToken, setAuthToken] = useState<string | null>(() => {
    const token = localStorage.getItem('supabase_token');
    return token && token !== 'null' && token !== 'undefined' && token !== '' ? token : null;
  });
  const [supabaseConfigured, setSupabaseConfigured] = useState<boolean>(true);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean>(true);
  const [systemStatus, setSystemStatus] = useState<{
    supabase: { configured: boolean; status: string; message: string };
    gemini: { configured: boolean; status: string; message: string };
  } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [supabaseTableMissing, setSupabaseTableMissing] = useState<boolean>(false);
  const [showAuthForm, setShowAuthForm] = useState<boolean>(false);

  // User Profile and Progress State
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isProfileLoaded, setIsProfileLoaded] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Gamified MIL levels & XP
  const [xp, setXp] = useState<number>(() => {
    const val = localStorage.getItem('mil_xp');
    return val ? parseInt(val, 10) : 0; // Starts at 0 XP
  });
  const [xpToast, setXpToast] = useState<{ xp: number; msg: string } | null>(null);

  const getMilRank = (currentXp: number) => {
    if (currentXp >= 1500) return { name: "Lead Sentinel", level: 4, nextThresh: null, prevThresh: 1500 };
    if (currentXp >= 1000) return { name: "Senior Analyst", level: 3, nextThresh: 1500, prevThresh: 1000 };
    if (currentXp >= 500) return { name: "Specialist", level: 2, nextThresh: 1000, prevThresh: 500 };
    return { name: "Analyst", level: 1, nextThresh: 500, prevThresh: 0 };
  };

  const currentRank = getMilRank(xp);

  // Track state for each case independently to preserve progress
  const [casesState, setCasesState] = useState<{ [caseId: string]: CaseState }>({});

  // Active quiz submissions
  const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  // Load and merge cases list
  const allCases = [...HANDCRAFTED_CASES, ...userProfile.customCases];
  const activeCase = allCases.find(c => c.id === activeCaseId);

  // --- Supabase Synchronization Engines ---

  const loadUserData = async (token: string) => {
    setIsAuthLoading(true);
    setSupabaseError(null);
    setSupabaseTableMissing(false);
    try {
      // 1. Profile
      const profileRes = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (profileRes.status === 401) {
        handleLogout();
        setIsProfileLoaded(true);
        return;
      }
      if (profileRes.status === 530) {
        setSupabaseConfigured(false);
        setIsAuthLoading(false);
        setIsProfileLoaded(true);
        return;
      }
      const profileData = await profileRes.json();
      if (profileData.error === "SUPABASE_TABLES_MISSING") {
        setSupabaseTableMissing(true);
        setIsAuthLoading(false);
        setIsProfileLoaded(true);
        return;
      }

      // 2. Custom Cases
      const customCasesRes = await fetch('/api/user/custom-cases', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const customCasesData = await customCasesRes.json();

      // 3. Cases State
      const casesStateRes = await fetch('/api/user/cases-state', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const casesStateData = await casesStateRes.json();

      let resolvedName = profileData.name || 'Investigator';
      if (resolvedName === 'Cadet Detective') {
        resolvedName = profileData.email ? profileData.email.split('@')[0] : 'Investigator';
      }

      setUserProfile({
        name: resolvedName,
        email: profileData.email || '',
        casesSolved: profileData.cases_solved || 0,
        solvedCaseIds: profileData.solved_case_ids || [],
        activeCaseId: null,
        achievements: profileData.achievements && profileData.achievements.length > 0 ? profileData.achievements : DEFAULT_ACHIEVEMENTS,
        customCases: customCasesData || []
      });

      if (typeof profileData.xp === 'number') {
        setXp(profileData.xp);
        localStorage.setItem('mil_xp', profileData.xp.toString());
      }

      setCasesState(casesStateData || {});
      setSupabaseConfigured(true);
      setIsProfileLoaded(true);
    } catch (err: any) {
      console.error("Error loading user data:", err);
      setSupabaseError("Failed to load database. Check database tables.");
      setIsProfileLoaded(true);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const syncProfileToSupabase = async (token: string, profile: UserProfile) => {
    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profile.name,
          cases_solved: profile.casesSolved,
          solved_case_ids: profile.solvedCaseIds,
          achievements: profile.achievements,
          xp: xp
        })
      });
    } catch (err) {
      console.error("Failed to sync profile:", err);
    }
  };

  const syncCaseStateToSupabase = async (token: string, caseId: string, state: CaseState) => {
    try {
      await fetch('/api/user/cases-state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          caseId,
          stateData: state
        })
      });
    } catch (err) {
      console.error("Failed to sync case state:", err);
    }
  };

  const syncCustomCaseToSupabase = async (token: string, newCase: Case) => {
    try {
      await fetch('/api/user/custom-cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          caseData: newCase
        })
      });
    } catch (err) {
      console.error("Failed to sync custom case:", err);
    }
  };

  const deleteCustomCaseFromSupabase = async (token: string, caseId: string) => {
    try {
      await fetch(`/api/user/custom-cases/${caseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Failed to delete custom case:", err);
    }
  };

  const handleAuthSuccess = (token: string, email: string, name: string) => {
    localStorage.setItem('supabase_token', token);
    setAuthToken(token);
    loadUserData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('supabase_token');
    setAuthToken(null);
    setIsProfileLoaded(false);
    // Reset back to defaults
    setUserProfile(DEFAULT_USER_PROFILE);
    setCasesState({});
  };

  // Check configuration and recovery on mount
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const res = await fetch('/api/system-status');
        const data = await res.json();
        setSystemStatus(data);
        setSupabaseConfigured(data.supabase.configured);
        setGeminiConfigured(data.gemini.configured);
      } catch (err) {
        console.error("Failed to fetch system status:", err);
      }
    };
    checkSystemStatus();
    
    if (authToken) {
      loadUserData(authToken);
    }
  }, [authToken]);

  // Auto-sync active case state when it changes (debounced 500ms)
  useEffect(() => {
    if (!authToken || !activeCaseId) return;
    const activeState = safeGet(casesState, activeCaseId);
    if (activeState) {
      const timer = setTimeout(() => {
        syncCaseStateToSupabase(authToken, activeCaseId, activeState);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [casesState, activeCaseId, authToken]);

  // Auto-sync user profile when solved cases, achievements, or XP change (debounced 1000ms)
  useEffect(() => {
    if (!authToken || !isProfileLoaded) return;
    const timer = setTimeout(() => {
      syncProfileToSupabase(authToken, userProfile);
    }, 1000);
    return () => clearTimeout(timer);
  }, [userProfile.casesSolved, userProfile.solvedCaseIds, userProfile.achievements, userProfile.name, xp, authToken, isProfileLoaded]);

  // Listen for gamified MIL XP events from subcomponents
  useEffect(() => {
    const handleXpEarned = (e: Event) => {
      const customEvent = e as CustomEvent<{ xp: number; msg: string }>;
      if (customEvent.detail) {
        const { xp: earnedXp, msg } = customEvent.detail;
        setXp(prev => {
          const next = prev + earnedXp;
          localStorage.setItem('mil_xp', next.toString());
          return next;
        });
        setXpToast({ xp: earnedXp, msg });
      }
    };
    window.addEventListener('mil-xp-earned', handleXpEarned);
    return () => window.removeEventListener('mil-xp-earned', handleXpEarned);
  }, []);

  // Clear XP Toast after delay
  useEffect(() => {
    if (xpToast) {
      const timer = setTimeout(() => {
        setXpToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [xpToast]);


  // Initialize a case state when it's opened for the first time
  const handleSelectCase = (caseId: string) => {
    setActiveCaseId(caseId);
    setCurrentView('game');
    setActiveTab('evidence');
    setEvaluationResult(null);
    setQuizAnswers({});
    setSelectedEvidenceId(null);
 
    // Unlock "First Contact" achievement on starting any case
    setUserProfile(prev => {
      const achievements = prev.achievements.map(a => 
        a.id === 'badge_first_case' ? { ...a, isUnlocked: true, unlockedAt: new Date().toLocaleDateString() } : a
      );
      const updated = { ...prev, achievements };
      if (authToken) {
        syncProfileToSupabase(authToken, updated);
      }
      return updated;
    });
 
    if (!safeGet(casesState, caseId)) {
      const targetCase = allCases.find(c => c.id === caseId);
      if (targetCase) {
        const defaultState: CaseState = {
          caseId,
          discoveredEvidenceIds: targetCase.evidences.map(e => e.id),
          discoveredClueIds: targetCase.clues.map(c => c.id),
          unlockedWitnessIds: targetCase.witnesses.map(w => w.id),
          notebookNotes: [
            `-- CASE NOTES INITIALIZED AT ${new Date().toLocaleDateString()} --`,
            `Topic: ${targetCase.topic}`,
            `Investigating Threat Actor: ${targetCase.threatActor}`,
            ...targetCase.evidences.map(e => `[SYSTEM DECRYPTED]: Secure file "${e.name}" successfully loaded into your cabinet.`)
          ],
          timelinePlacements: {},
          witnessChats: {},
          isCompleted: false
        };
        setCasesState(prev => {
          const updated = safeSet(prev, caseId, defaultState);
          if (authToken) {
            syncCaseStateToSupabase(authToken, caseId, defaultState);
          }
          return updated;
        });
      }
    } else {
      // For existing states, ensure they also have all elements unlocked
      const targetCase = allCases.find(c => c.id === caseId);
      if (targetCase) {
        setCasesState(prev => {
          const existing = safeGet(prev, caseId);
          const updated = {
            ...existing,
            discoveredEvidenceIds: targetCase.evidences.map(e => e.id),
            discoveredClueIds: targetCase.clues.map(c => c.id),
            unlockedWitnessIds: targetCase.witnesses.map(w => w.id)
          } as CaseState;
          if (authToken) {
            syncCaseStateToSupabase(authToken, caseId, updated);
          }
          return safeSet(prev, caseId, updated);
        });
      }
    }
  };

  const getActiveCaseState = (): CaseState => {
    if (!activeCaseId) {
      return {
        caseId: '',
        discoveredEvidenceIds: [],
        discoveredClueIds: [],
        unlockedWitnessIds: [],
        notebookNotes: [],
        timelinePlacements: {},
        witnessChats: {},
        isCompleted: false
      };
    }
    return safeGet(casesState, activeCaseId) || {
      caseId: activeCaseId,
      discoveredEvidenceIds: [],
      discoveredClueIds: [],
      unlockedWitnessIds: [],
      notebookNotes: [],
      timelinePlacements: {},
      witnessChats: {},
      isCompleted: false
    };
  };

  const currentCaseState = getActiveCaseState();

  // Highlight or extract evidence text directly into user's notebook
  const handleLogToNotebook = (text: string) => {
    if (!activeCaseId) return;
    setCasesState(prev => {
      const state = safeGet(prev, activeCaseId);
      if (!state) return prev;
      const logLine = `[INTEL LOG]: ${text}`;
      if (state.notebookNotes.includes(logLine)) return prev;
      return safeSet(prev, activeCaseId, {
        ...state,
        notebookNotes: [...state.notebookNotes, logLine]
      });
    });
  };

  // Add notes to the notepad
  const handleAddCustomNote = (text: string) => {
    if (!activeCaseId || !text.trim()) return;
    setCasesState(prev => {
      const state = safeGet(prev, activeCaseId);
      if (!state) return prev;
      return safeSet(prev, activeCaseId, {
        ...state,
        notebookNotes: [...state.notebookNotes, text.trim()]
      });
    });
  };

  // Trigger when evidence is revealed from clicking map coordinate hotspots
  const handleRevealEvidence = (evidenceId: string) => {
    if (!activeCaseId || !activeCase) return;
    setCasesState(prev => {
      const state = safeGet(prev, activeCaseId);
      if (!state) return prev;
      if (state.discoveredEvidenceIds.includes(evidenceId)) return prev;

      const updatedEvidences = [...state.discoveredEvidenceIds, evidenceId];
      
      // Check if this unlocks any witness
      let updatedWitnesses = [...state.unlockedWitnessIds];
      const newlyDiscoveredEvidence = activeCase.evidences.find(e => e.id === evidenceId);

      // Rule: Unlocking first-hand info might reveal locked witnesses!
      activeCase.witnesses.forEach(witness => {
        if (witness.status === 'locked' && !updatedWitnesses.includes(witness.id)) {
          // Auto unlock witness Harper if the main video log is scanned, or recruiter if telegram chats discovered
          if (witness.id === 'wit_harper' && evidenceId === 'ev_metadata_log') {
            updatedWitnesses.push(witness.id);
          } else if (witness.id === 'wit_recruiter' && evidenceId === 'ev_chat_logs') {
            updatedWitnesses.push(witness.id);
          } else if (witness.id !== 'wit_harper' && witness.id !== 'wit_recruiter') {
            // General auto unlock for customs
            updatedWitnesses.push(witness.id);
          }
        }
      });

      // Map this evidence to discovered clues!
      let updatedClues = [...state.discoveredClueIds];
      const matchingClue = activeCase.clues.find(c => c.evidenceId === evidenceId);
      if (matchingClue && !updatedClues.includes(matchingClue.id)) {
        updatedClues.push(matchingClue.id);
      }

      return safeSet(prev, activeCaseId, {
        ...state,
        discoveredEvidenceIds: updatedEvidences,
        unlockedWitnessIds: updatedWitnesses,
        discoveredClueIds: updatedClues,
        notebookNotes: [
          ...state.notebookNotes,
          `[SYSTEM AUTO-DECRYPTED]: Unlocked secure file "${newlyDiscoveredEvidence?.name}"`
        ]
      });
    });
  };

  // Message chat history aggregator
  const handleAddWitnessMessage = (witnessId: string, sender: 'user' | 'witness', text: string) => {
    if (!activeCaseId) return;
    setCasesState(prev => {
      const state = safeGet(prev, activeCaseId);
      if (!state) return prev;

      const currentChats = safeGet(state.witnessChats, witnessId) || [];
      const newChat = {
        sender,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Also automatically log to notebook if witness reveals a key statement
      let notes = [...state.notebookNotes];
      if (sender === 'witness' && (text.includes('0x') || text.includes('USDT') || text.includes('Telegram') || text.includes('Vance'))) {
        notes.push(`[WITNESS REVELATION]: ${activeCase?.witnesses.find(w => w.id === witnessId)?.name} stated: "${text.substring(0, 80)}..."`);
      }

      return safeSet(prev, activeCaseId, {
        ...state,
        witnessChats: safeSet(state.witnessChats, witnessId, [...currentChats, newChat]),
        notebookNotes: notes
      });
    });
  };

  // submit case evaluation
  const handleSubmitCase = async () => {
    if (!activeCaseId || !activeCase) return;
    
    // Validate that all questions are answered
    const questionsCount = activeCase.solution.questions.length;
    const answeredCount = Object.keys(quizAnswers).length;
    if (answeredCount < questionsCount) {
      alert(`Please answer all ${questionsCount} solution questions in the Submission form before sending your dossier.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Send for AI Evaluation to Judge AI on the server
      const response = await fetch('/api/judge-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseTitle: activeCase.title,
          topic: activeCase.topic,
          warningSigns: activeCase.warningSigns,
          manipulationTechniques: activeCase.manipulationTechniques,
          answers: quizAnswers,
          timeline: currentCaseState.timelinePlacements,
          notebookNotes: currentCaseState.notebookNotes.join('\n')
        })
      });

      const evaluation = await response.json();
      setEvaluationResult(evaluation);

      // Update case states as completed & solve counter
      setCasesState(prev => {
        const existing = safeGet(prev, activeCaseId);
        return safeSet(prev, activeCaseId, {
          ...existing,
          isCompleted: true,
          score: evaluation.score,
          feedback: evaluation.verdict
        } as CaseState);
      });

      // Update User Profile solved registry and unlock achievements
      setUserProfile(prev => {
        const newlySolved = prev.solvedCaseIds.includes(activeCaseId) 
          ? prev.solvedCaseIds 
          : [...prev.solvedCaseIds, activeCaseId];
        
        // Unlock badges
        const updatedAchievements = prev.achievements.map(a => {
          if (activeCaseId === 'case_synthetic_witness' && a.id === 'badge_synthetic' && evaluation.score >= 80) {
            return { ...a, isUnlocked: true, unlockedAt: new Date().toLocaleDateString() };
          }
          if (activeCaseId === 'case_silent_spring' && a.id === 'badge_sentinel' && evaluation.score >= 80) {
            return { ...a, isUnlocked: true, unlockedAt: new Date().toLocaleDateString() };
          }
          if (activeCaseId === 'case_hardware_sabotage' && a.id === 'badge_supply_chain' && evaluation.score >= 80) {
            return { ...a, isUnlocked: true, unlockedAt: new Date().toLocaleDateString() };
          }
          return a;
        });

        return {
          ...prev,
          solvedCaseIds: newlySolved,
          casesSolved: newlySolved.length,
          achievements: updatedAchievements
        };
      });

      // Award XP for solving case if it wasn't already solved
      if (!userProfile.solvedCaseIds.includes(activeCaseId)) {
        const xpGained = evaluation.score >= 80 ? 300 : evaluation.score >= 50 ? 150 : 50;
        window.dispatchEvent(new CustomEvent('mil-xp-earned', {
          detail: {
            xp: xpGained,
            msg: `Solved Case File "${activeCase.title}" with a score of ${evaluation.score}%!`
          }
        }));
      }

    } catch (e) {
      console.error(e);
      alert("[JUDICIAL RELAY FAULT]: The server Judge AI is busy or failed to compile. Re-submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Case Architect Custom Case Receiver
  const handleCaseGenerated = (newCase: Case) => {
    setUserProfile(prev => {
      // Unlock badge_creator
      const updatedAchievements = prev.achievements.map(a => 
        a.id === 'badge_creator' ? { ...a, isUnlocked: true, unlockedAt: new Date().toLocaleDateString() } : a
      );

      return {
        ...prev,
        customCases: [...prev.customCases, newCase],
        achievements: updatedAchievements
      };
    });
    
    if (authToken) {
      syncCustomCaseToSupabase(authToken, newCase);
    }
    
    // Return to library immediately so they can play it!
    setCurrentView('library');
  };

  const handleDeleteCase = (caseId: string) => {
    setUserProfile(prev => ({
      ...prev,
      customCases: prev.customCases.filter(c => c.id !== caseId)
    }));
    
    if (authToken) {
      deleteCustomCaseFromSupabase(authToken, caseId);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none overflow-x-hidden relative">
      
      <AnimatePresence>
        {isInitializing && (
          <LoadingScreen
            isDataReady={systemStatus !== null && (!authToken || isProfileLoaded)}
            onComplete={() => setIsInitializing(false)}
          />
        )}
      </AnimatePresence>

      <ShaderGradient />
      <VantaBackground />

      {!authToken ? (
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col justify-center min-h-[95vh] relative z-10 select-none">
          {/* Logo Header */}
          <div className="flex items-center gap-3 mb-12 self-start animate-fade-in">
            <div className="w-9 h-9 bg-white p-1 rounded-full flex items-center justify-center shadow-md border border-[#ff8533]/20 overflow-hidden">
              <img 
                src="/src/assets/images/detective_squirrel_1784269041754.jpg" 
                alt="Detective Fox Mascot Logo" 
                className="w-full h-full object-cover scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-serif font-bold text-lg text-[#fcfaf5] tracking-tight uppercase">Social Detective Academy</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* LEFT SIDE: Detective squirrel mascot */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative select-none animate-fade-in">
              {/* Character Mascot Wrapper */}
              <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
                {/* Cozy Ambient Light behind the mascot */}
                <div className="absolute w-64 h-64 bg-[#ff8533]/15 rounded-full filter blur-3xl animate-pulse" />
                
                {/* Cute Generated Detective Squirrel */}
                <img 
                  src="/src/assets/images/detective_squirrel_1784269041754.jpg" 
                  alt="Sherlock Squirrel Detective Mascot" 
                  className="w-full h-full object-contain rounded-[32px] border-2 border-[#ff8533]/30 shadow-2xl relative z-10"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* RIGHT SIDE: App Titles or Auth Form */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {!showAuthForm ? (
                <div className="space-y-6 md:space-y-8 animate-fade-in">
                  {/* Category Pill */}
                  <div className="inline-block bg-[#442a1b] border border-[#ff8533]/30 text-[#ff8533] px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest">
                    Interactive Social Crime Awareness Game
                  </div>

                  {/* Gorgeous serif title with highlighted blocks, matching the Abacus landing page! */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3 items-center">
                      <span className="bg-[#ff8533] text-[#1e110a] px-6 py-2 rounded-[16px] inline-block font-serif font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight shadow-md">
                        Think You
                      </span>
                      <span className="bg-[#ff8533] text-[#1e110a] px-6 py-2 rounded-[16px] inline-block font-serif font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight shadow-md">
                        Know Your
                      </span>
                    </div>
                    <div className="font-serif italic font-normal text-4xl md:text-5xl lg:text-6xl text-[#ffb829] tracking-tight">
                      Threats?
                    </div>
                  </div>

                  {/* Sleek woodland style description */}
                  <p className="text-sm md:text-base text-[#d9d2c9] font-sans leading-relaxed max-w-xl">
                    Investigate cyberbullying. Spot elder fraud. Map viral disinformation. 
                    <strong className="text-[#ff8533] font-semibold mx-1">Social Detective</strong> 
                    turns social crime awareness, empathy, and digital safety into interactive learning mysteries you will actively want to solve again and again.
                  </p>

                  {/* Large stats and info card, matching the ages 6-12 pill card */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    {/* CTA Actions */}
                    <div className="md:col-span-5 flex flex-col gap-3 justify-center">
                      <button
                        onClick={() => setShowAuthForm(true)}
                        className="btn-primary w-full text-center flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        <span>Start Investigating</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>

                    {/* Features pill-card */}
                    <div className="md:col-span-7 bg-[#fcfaf5] text-[#1e110a] rounded-[24px] p-5 border border-[#e6dfd3] shadow-lg flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-[#ff8533] text-[#fcfaf5] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            ACADEMY ENTRY
                          </span>
                          <span className="text-xs font-bold text-[#4a2c11]">AGES 12 - ADULT</span>
                        </div>
                        <ul className="space-y-2 text-[11px] md:text-xs text-[#4a2c11] font-sans">
                          <li className="flex items-start gap-1.5">
                            <span className="text-[#ff8533]">●</span>
                            <span>No boring slides. No compliance traps. Just active social investigation.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-[#ffb829]">●</span>
                            <span>20-minute case files, interactive hotspots and witness interviews.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-[#5c7f5c]">●</span>
                            <span>Curriculum-aligned social safety, empathy, & critical thinking.</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#ab7b4d]/20 flex justify-between items-center text-[10px] italic font-serif text-[#ab7b4d]">
                        <span>"The squirrel dares you to investigate."</span>
                        <span className="text-[#ff8533] tracking-wide font-sans not-italic">★★★★★</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#a89485] font-mono">
                    Free educational framework · Persistent custom cases via database sync
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in max-w-md mx-auto">
                  {/* Back to landing button */}
                  <button
                    onClick={() => setShowAuthForm(false)}
                    className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#ff8533] hover:text-[#ff9d5c] uppercase transition-colors mb-4 cursor-pointer"
                  >
                    <span>← Back to Main Menu</span>
                  </button>

                  <LoginSignup 
                    onAuthSuccess={handleAuthSuccess} 
                    supabaseConfigured={supabaseConfigured}
                    geminiConfigured={geminiConfigured}
                    systemStatus={systemStatus}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Upper Navigation Rail */}
          <header className="void-nav px-6 py-4 sticky top-0 z-40 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white p-1 rounded-full flex items-center justify-center shadow-sm border border-[#ff8533]/20 overflow-hidden">
                <img 
                  src="/src/assets/images/detective_squirrel_1784269041754.jpg" 
                  alt="Detective Fox Mascot Logo" 
                  className="w-full h-full object-cover scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-1.5 uppercase">
                  SOCIAL DETECTIVE
                </h1>
                <p className="text-[10px] text-[#a89485] font-mono">Social Crime Awareness & Prevention System</p>
              </div>
            </div>

            {/* Global Nav Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setCurrentView('library');
                  setActiveCaseId(null);
                }}
                className={`px-4 py-2 rounded-full font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer focus:outline-none ${
                  currentView === 'library'
                    ? 'text-[#ff8533] border-b-2 border-[#ff8533] rounded-none'
                    : 'text-[#a89485] hover:text-white'
                }`}
              >
                LIBRARY
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-4 py-2 rounded-full font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer focus:outline-none ${
                  currentView === 'profile'
                    ? 'text-[#ff8533] border-b-2 border-[#ff8533] rounded-none'
                    : 'text-[#a89485] hover:text-white'
                }`}
              >
                PROFILE
              </button>

              {/* User credentials / Authentication Controls */}
              <div className="flex items-center gap-3 border-l border-white/15 pl-4 ml-2 text-xs">
                <button
                  onClick={() => setCurrentView('profile')}
                  className="hidden md:flex items-center gap-2 text-right hover:opacity-85 transition-opacity cursor-pointer focus:outline-none"
                  title="View Profile Dossier"
                >
                  <div className="text-[11px] font-mono leading-none">
                    <div className="text-white font-bold uppercase flex items-center gap-1 justify-end">
                      <span>{userProfile.name}</span>
                      <User className="h-3 w-3 text-[#ff8533]" />
                    </div>
                    <div className="text-[#a89485] text-[9px] mt-0.5">{userProfile.email}</div>
                  </div>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 border border-white/15 hover:border-white rounded-full bg-transparent transition-all cursor-pointer font-mono text-[10px] font-bold text-[#a89485] hover:text-white flex items-center gap-1.5"
                  title="Log Out from Supabase"
                >
                  <LogOut className="h-3 w-3 shrink-0" />
                  <span className="hidden sm:inline">LOGOUT</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Body */}
          <main className="flex-1 p-6 max-w-7xl w-full mx-auto relative z-10">
            {supabaseTableMissing && (
              <div className="mb-8 p-6 bg-red-950/40 border border-red-500/30 rounded-[24px] text-red-200 text-xs font-mono leading-relaxed space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-red-400 uppercase tracking-wider">
                  <span>🚨 SYSTEM SYNC CONFLICT: DATABASE TABLES MISSING</span>
                </div>
                <p>
                  Connected to Supabase, but required tables (<code className="text-white font-semibold">profiles</code>, <code className="text-white font-semibold">custom_cases</code>, or <code className="text-white font-semibold">cases_state</code>) are missing. User saves and configurations will fail to sync.
                </p>
                <p>
                  Please copy the SQL schema script from <code className="text-white font-semibold">SUPABASE_SCHEMA.sql</code> in your project repository and run it in your Supabase SQL Editor (New Query) to initialize the database tables.
                </p>
              </div>
            )}

            {supabaseError && !supabaseTableMissing && (
              <div className="mb-8 p-6 bg-yellow-950/40 border border-yellow-500/30 rounded-[24px] text-yellow-200 text-xs font-mono leading-relaxed space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-yellow-400 uppercase tracking-wider">
                  <span>⚠️ DATABASE SYNC NOTIFICATION</span>
                </div>
                <p>
                  {supabaseError}
                </p>
                <p>
                  Your current progress will be stored in your local browser session cache instead. Check your server logs and Supabase keys if this error persists.
                </p>
              </div>
            )}
            
            {/* VIEW 1: CASE LIBRARY */}
            {currentView === 'library' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Section Headline Block (Asymmetric Two-Column Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6 pb-12 items-start">
                  <div>
                    <span className="text-[12px] font-mono font-bold text-[#ffb829] uppercase tracking-[0.35px] block mb-2">
                      FORENSICS INTELLIGENCE HUB
                    </span>
                    <h1 className="text-heading-lg text-white font-normal leading-[1.1] tracking-[-3.12px]">
                      FORENSIC INTEL LABS.
                    </h1>
                  </div>
                  <div className="space-y-6">
                    <p className="text-body text-[#bdbdbd] font-extralight leading-[1.5] max-w-lg">
                      Investigate security incidents, decode digital signatures, and intercept threat actor vectors floating across the void. Enhance your defense tactics via real-time training directives.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setCurrentView('profile')}
                        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#ff8533] hover:text-[#ff9d5c] uppercase transition-colors"
                      >
                        <span>View Your Detective Profile & Achievements →</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cases List */}
                <div>
                  <h3 className="text-nav-label text-white mb-4 flex items-center gap-1.5">
                    <BookOpenCheck className="h-4 w-4 text-[#ff8533]" />
                    ACTIVE INVESTIGATIVE DIRECTIVES
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allCases.map((caseData) => (
                      <CaseCard
                        key={caseData.id}
                        caseData={caseData}
                        onSelect={() => handleSelectCase(caseData.id)}
                        isCompleted={userProfile.solvedCaseIds.includes(caseData.id)}
                        isCustom={userProfile.customCases.some(c => c.id === caseData.id)}
                      />
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* VIEW 2: ACTIVE GAME / CASE INVESTIGATION */}
            {currentView === 'game' && activeCase && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Case Title backbar banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent border-0 py-2 mb-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentView('library')}
                      className="p-2 text-[#9a9a9a] hover:text-white border border-white/10 rounded-full bg-transparent hover:bg-white/5 transition-all focus:outline-none cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono mb-0.5">
                        <span className="text-[#8052ff] font-bold">{activeCase.topic.toUpperCase()}</span>
                        <span className="text-white/20">//</span>
                        <span className="text-[#ffb829] font-bold">{activeCase.threatActor.toUpperCase()}</span>
                      </div>
                      <h2 className="text-heading-2xs text-white flex items-center gap-2">
                        {activeCase.title}
                        <span className="text-[10px] font-mono font-normal text-[#9a9a9a]">(Case ID: #{activeCase.id.toUpperCase().replace('CASE_', '')})</span>
                      </h2>
                    </div>
                  </div>

                  {/* Top Case Progress meters */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Gamified MIL Level HUD */}
                    <div className="bg-[#1e110a]/80 border border-[#ff8533]/40 rounded-[24px] px-4 py-2 flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[8px] font-mono text-[#9a9a9a] uppercase">MIL DETECTIVE RANK</div>
                        <div className="text-xs font-mono font-black text-[#ff8533] uppercase">
                          LEVEL {currentRank.level}: {currentRank.name}
                        </div>
                      </div>
                      <div className="h-6 px-2.5 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-[10px] font-mono font-extrabold text-white">
                        {xp} XP
                      </div>
                    </div>

                    <div className="bg-transparent px-3.5 py-2 flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-[8px] font-mono text-[#9a9a9a] uppercase">EVIDENCE CABINET</div>
                        <div className="text-xs font-mono font-bold text-[#ff8533]">
                          {currentCaseState.discoveredEvidenceIds.length} / {activeCase.evidences.length} Unlocked
                        </div>
                      </div>
                    </div>
                    <div className="bg-transparent px-3.5 py-2 flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-[8px] font-mono text-[#9a9a9a] uppercase">WITNESS INTERROGATION</div>
                        <div className="text-xs font-mono font-bold text-[#ffb829]">
                          {currentCaseState.unlockedWitnessIds.length} / {activeCase.witnesses.length} Discovered
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Split Screen Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  
                  {/* Left Side: Navigation Tabs and Main Dynamic Tool Console (3 Cols) */}
                  <div className="xl:col-span-3 flex flex-col gap-4">
                    
                    {/* Dashboard Tabs Selector */}
                    <div className="flex overflow-x-auto gap-2 border-b border-white/10 pb-2.5">
                      {[
                        { id: 'evidence', label: 'FORENSIC SOURCE INSPECTOR', icon: <FileText className="h-4 w-4" /> },
                        { id: 'witnesses', label: 'MIL TRUTH INTERVIEWS', icon: <MessageSquare className="h-4 w-4" /> },
                        { id: 'clues', label: 'CRITICAL THINKING PUZZLES', icon: <Brain className="h-4 w-4" /> },
                        { id: 'timeline', label: 'VIRAL TIMELINE SOLVER', icon: <Calendar className="h-4 w-4" /> },
                        { id: 'submit', label: 'PRESENT TO UNESCO COUNCIL', icon: <ShieldCheck className="h-4 w-4 text-[#15846e]" /> }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full font-mono text-xs font-bold transition-all whitespace-nowrap focus:outline-none border cursor-pointer ${
                            activeTab === tab.id
                              ? 'border-[#ff8533] bg-[#ff8533]/10 text-white'
                              : 'border-transparent text-[#9a9a9a] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {tab.icon}
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Main Dynamic Workspace Frame */}
                    <div className="flex-1 min-h-[420px]">
                      {activeTab === 'evidence' && (
                        <EvidenceViewer
                          caseData={activeCase}
                          discoveredEvidenceIds={currentCaseState.discoveredEvidenceIds}
                          activeEvidenceId={selectedEvidenceId || (currentCaseState.discoveredEvidenceIds[0] || null)}
                          setActiveEvidenceId={setSelectedEvidenceId}
                          onCopyToNotebook={handleLogToNotebook}
                        />
                      )}

                      {activeTab === 'witnesses' && (
                        <InterrogationTerminal
                          caseData={activeCase}
                          unlockedWitnessIds={currentCaseState.unlockedWitnessIds}
                          onUnlockWitness={() => {}}
                          chatsState={currentCaseState.witnessChats}
                          onAddMessage={handleAddWitnessMessage}
                        />
                      )}

                      {activeTab === 'clues' && (
                        <ClueBoard
                          caseData={activeCase}
                          discoveredClueIds={currentCaseState.discoveredClueIds}
                          discoveredEvidenceIds={currentCaseState.discoveredEvidenceIds}
                          onSelectEvidence={setSelectedEvidenceId}
                          onNavigateToTab={setActiveTab}
                        />
                      )}

                      {activeTab === 'timeline' && (
                        <TimelineBuilder
                          caseData={activeCase}
                          placements={currentCaseState.timelinePlacements}
                          onUpdatePlacements={(placements) => {
                            setCasesState(prev => {
                              const existing = safeGet(prev, activeCase.id);
                              return safeSet(prev, activeCase.id, {
                                ...existing,
                                timelinePlacements: placements
                              } as CaseState);
                            });
                          }}
                        />
                      )}

                      {activeTab === 'submit' && (
                        <div className="rounded-[24px] border border-white/10 bg-[#000000] p-5 space-y-6 text-white animate-fade-in">
                          
                          {/* Submission evaluation results (If solved!) */}
                          {evaluationResult ? (
                            <div className="space-y-6 animate-fade-in">
                              
                              {/* Top score banner */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 border border-white/10 rounded-[24px] p-5">
                                <div className="text-center md:border-r border-white/10 flex flex-col justify-center">
                                  <span className="text-[10px] font-mono text-[#9a9a9a] uppercase font-bold">ACADEMY SCORE</span>
                                  <div className="font-sans text-4xl mt-1 text-[#8052ff] font-bold">
                                    {evaluationResult.score} / 100
                                  </div>
                                </div>
                                <div className="text-center md:border-r border-white/10 flex flex-col justify-center">
                                  <span className="text-[10px] font-mono text-[#9a9a9a] uppercase font-bold">ACADEMY RANK</span>
                                  <div className="font-sans text-3xl mt-1 text-[#ffb829] font-bold">
                                    {evaluationResult.grade}
                                  </div>
                                </div>
                                <div className="text-center flex flex-col justify-center">
                                  <span className="text-[10px] font-mono text-[#9a9a9a] uppercase font-bold">JUDGMENT VERDICT</span>
                                  <p className="text-xs font-mono font-bold mt-1 text-[#bdbdbd] px-2 line-clamp-2">
                                    {evaluationResult.verdict}
                                  </p>
                                </div>
                              </div>

                              {/* Markdown report */}
                              <div className="rounded-[24px] bg-[#121214] border border-white/5 p-5 space-y-4 shadow-xl">
                                <h4 className="text-xs font-mono font-extrabold tracking-wider uppercase text-[#ffb829] border-b border-white/5 pb-2">
                                  🛡️ DIGITAL SAFETY ASSESSMENT REPORT
                                </h4>
                                
                                {/* Scrollable markdown body */}
                                <div className="text-xs text-[#bdbdbd] leading-relaxed space-y-3 font-mono select-text max-h-[300px] overflow-y-auto pr-2">
                                  <div className="markdown-body">
                                    <Markdown>{evaluationResult.analysis}</Markdown>
                                  </div>
                                </div>
                              </div>

                              {/* Unlocked Badges */}
                              {evaluationResult.unlockedBadges && evaluationResult.unlockedBadges.length > 0 && (
                                <div className="rounded-[24px] bg-white/[0.02] border border-white/5 p-4">
                                  <span className="text-[10px] font-mono text-[#ffb829] block uppercase tracking-wider mb-2.5 font-extrabold">🎖️ Honor Badges Awarded</span>
                                  <div className="flex flex-wrap gap-2">
                                    {evaluationResult.unlockedBadges.map((badge: string, bIdx: number) => (
                                      <span key={bIdx} className="text-xs font-mono font-extrabold text-white bg-black border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                                        <Award className="h-4 w-4 text-[#8052ff] animate-pulse" />
                                        {badge}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <button
                                onClick={() => {
                                  setCurrentView('library');
                                  setActiveCaseId(null);
                                }}
                                className="btn-primary w-full py-4"
                              >
                                Conclude Session & Return to Library
                              </button>

                            </div>
                          ) : (
                            <div className="space-y-6 animate-fade-in">
                              <div className="border-b border-white/10 pb-3">
                                <h4 className="text-nav-label text-white flex items-center gap-2">
                                  <ShieldCheck className="h-4 w-4 text-[#8052ff]" />
                                  Case Solution Questionnaire
                                </h4>
                                <p className="text-xs text-[#9a9a9a] font-mono mt-0.5">Submit your answers to key questions about the cyber exploit vector.</p>
                              </div>

                              {/* Form */}
                              <div className="space-y-5">
                                {activeCase.solution.questions.map((q, qIdx) => (
                                  <div key={q.id} className="p-4.5 rounded-[24px] bg-white/[0.02] border border-white/5">
                                    <h5 className="text-xs font-bold text-white mb-3 flex gap-2">
                                      <span className="text-[#8052ff] font-mono font-extrabold">Q{qIdx + 1}:</span>
                                      <span className="font-mono">{q.question}</span>
                                    </h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {q.choices.map((choice) => {
                                        const isSelected = quizAnswers[q.id] === choice;
                                        return (
                                          <button
                                            key={choice}
                                            type="button"
                                            onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: choice }))}
                                            className={`p-3 rounded-full border text-xs text-left transition-all font-mono leading-relaxed focus:outline-none cursor-pointer ${
                                              isSelected
                                                ? 'border-[#8052ff] bg-[#8052ff]/10 text-white font-bold'
                                                : 'border-white/10 bg-transparent text-[#9a9a9a] hover:bg-white/5'
                                            }`}
                                          >
                                            {choice}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <button
                                onClick={handleSubmitCase}
                                disabled={isSubmitting}
                                className="btn-primary w-full py-4"
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                                    <span>SUBMITTING DOSSIER FOR EVALUATION...</span>
                                  </>
                                ) : (
                                  <>
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>SUBMIT COMPREHENSIVE DOSSIER</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                        </div>
                      )}
                    </div>

                  </div>

                {/* Right Side: Active Investigation Notebook (1 Col) */}
                <div className="xl:col-span-1 rounded-[24px] border border-white/10 bg-[#000000] p-4 flex flex-col h-full min-h-[400px] text-white">
                  <h4 className="text-nav-label text-white mb-3 flex items-center gap-1.5 border-b border-white/5 pb-3">
                    <BookOpen className="h-4 w-4 text-[#8052ff] animate-pulse" />
                    Forensic Notebook
                  </h4>

                  {/* Notes log frame */}
                  <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-[24px] p-4 text-[10px] font-mono text-[#bdbdbd] space-y-2 overflow-y-auto max-h-[300px] leading-relaxed shadow-inner">
                    {currentCaseState.notebookNotes.length === 0 ? (
                      <span className="text-[#9a9a9a]/40 italic">No observations recorded yet.</span>
                    ) : (
                      currentCaseState.notebookNotes.map((note, idx) => (
                        <div key={idx} className="border-b border-white/5 pb-1.5 flex gap-2">
                          <span className="text-[#ffb829] select-none">&gt;&gt;</span>
                          <span className="text-white select-text">{note}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Custom input box */}
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <span className="text-[9px] font-mono text-[#9a9a9a] block mb-1.5 uppercase">Add Observation</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="custom-note-input"
                        placeholder="Add notes about threat vectors..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            if (val.trim()) {
                              handleAddCustomNote(val.trim());
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                        className="flex-1 bg-black border border-white/10 rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#8052ff] text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Mentor support drone */}
              <MentorDrone
                caseData={activeCase}
                discoveredEvidenceIds={currentCaseState.discoveredEvidenceIds}
                notebookNotes={currentCaseState.notebookNotes}
              />

            </div>
          )}

          {/* VIEW 4: USER PROFILE */}
          {currentView === 'profile' && (
            <UserProfileSection
              userProfile={userProfile}
              currentRank={currentRank}
              xp={xp}
              allCases={allCases}
              onSelectCase={handleSelectCase}
              onDeleteCase={handleDeleteCase}
            />
          )}

        </main>
      </>
    )}

      {/* Dynamic Floating XP Toast */}
      <AnimatePresence>
        {xpToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 15 }}
            className="fixed bottom-8 right-8 z-50 bg-black/90 border-2 border-[#ff8533] rounded-[24px] p-4 shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-sm"
          >
            <div className="w-10 h-10 rounded-full bg-[#ff8533]/20 border border-[#ff8533]/50 flex items-center justify-center text-[#ff8533] shrink-0 animate-pulse">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#ff8533] uppercase font-bold tracking-wider">
                +{xpToast.xp} XP ENGAGED
              </div>
              <div className="text-xs text-white font-medium mt-0.5 leading-snug">
                {xpToast.msg}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corporate footer bar */}
      <footer className="border-t border-white/10 bg-transparent p-4 mt-8 flex justify-between items-center text-[10px] font-mono text-[#9a9a9a] relative z-10">
        <span>© 2026 UNESCO CYBER TRAINING LABS. ALL RIGHTS RESERVED.</span>
      </footer>

    </div>
  );
}
