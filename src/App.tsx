import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Award, LogOut, User
} from 'lucide-react';

// Core Subcomponents
import CaseLibraryView from './components/CaseLibraryView';
import InvestigationLeads from './components/InvestigationLeads';
import EvidenceViewer from './components/EvidenceViewer';
import InterrogationTerminal from './components/InterrogationTerminal';
import ClueBoard from './components/ClueBoard';
import TimelineBuilder from './components/TimelineBuilder';
import MentorDrone from './components/MentorDrone';
import VantaBackground from './components/VantaBackground';
import LoginSignup from './components/LoginSignup';
import UserProfileSection from './components/UserProfileSection';
import LoadingScreen from './components/LoadingScreen';
import StoryIntroView from './components/StoryIntroView';
import DetectiveNotebook from './components/DetectiveNotebook';
import ResumeRestartModal from './components/ResumeRestartModal';
import DigitalSafetyReport from './components/DigitalSafetyReport';
import InvestigationHeader from './components/InvestigationHeader';
import DetectiveCaseReportForm from './components/DetectiveCaseReportForm';
import NotificationToast, { NotificationState } from './components/NotificationToast';
import { apiService } from './services/apiService';
import { mysteryAudio } from './utils/mysteryAudio';

// Shared types and handcrafted cases
import { Case, UserProfile, CaseState, InvestigationLead, WallNode, WallConnection } from './types';
import { HANDCRAFTED_CASES } from './data/cases';
import { safeGet, safeSet } from './lib/safeLookup';
import { ACADEMY_HONOR_DECORATIONS, mergeAchievements, dispatchHonorUnlock } from './data/achievements';
import detectiveSquirrelLogo from './assets/images/detective_squirrel_1784269041754.jpg';

const DEFAULT_ACHIEVEMENTS = ACADEMY_HONOR_DECORATIONS;

const DEFAULT_USER_PROFILE: UserProfile = {
  name: localStorage.getItem('detective_user_name') || 'Investigator',
  email: '',
  casesSolved: 0,
  solvedCaseIds: [],
  activeCaseId: null,
  achievements: ACADEMY_HONOR_DECORATIONS,
  customCases: []
};

type AppView = 'library' | 'story_intro' | 'game' | 'profile';

const getStoredView = (): AppView => {
  const storedView = localStorage.getItem('detective_current_view');
  return storedView === 'story_intro' || storedView === 'game' || storedView === 'profile' ? storedView : 'library';
};

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>(getStoredView);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(() => localStorage.getItem('detective_active_case'));
  const [activeTab, setActiveTab] = useState<string>(() => localStorage.getItem('detective_active_tab') || 'evidence');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(() => localStorage.getItem('detective_selected_evidence'));

  // Auth State
  const [authToken, setAuthToken] = useState<string | null>(() => {
    const token = localStorage.getItem('supabase_token');
    return token && token !== 'null' && token !== 'undefined' && token !== '' ? token : null;
  });
  const [supabaseConfigured, setSupabaseConfigured] = useState<boolean>(true);
  const [aiConfigured, setAiConfigured] = useState<boolean>(true);
  const [systemStatus, setSystemStatus] = useState<{
    supabase: { configured: boolean; status: string; message: string };
    ai?: { configured: boolean; status: string; message: string };
  } | null>(null);
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
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const notify = (nextNotification: NotificationState) => {
    setNotification(nextNotification);
  };

  const getMilRank = (currentXp: number) => {
    if (currentXp >= 1500) return { name: "Lead Sentinel", level: 4, nextThresh: null, prevThresh: 1500 };
    if (currentXp >= 1000) return { name: "Senior Analyst", level: 3, nextThresh: 1500, prevThresh: 1000 };
    if (currentXp >= 500) return { name: "Specialist", level: 2, nextThresh: 1000, prevThresh: 500 };
    return { name: "Analyst", level: 1, nextThresh: 500, prevThresh: 0 };
  };

  const currentRank = getMilRank(xp);

  // Track state for each case independently to preserve progress
  const [casesState, setCasesState] = useState<Record<string, CaseState>>(() => {
    try {
      const saved = localStorage.getItem('detective_cases_state');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      if (Object.keys(casesState).length > 0) {
        localStorage.setItem('detective_cases_state', JSON.stringify(casesState));
      }
    } catch {
      // ignore
    }
  }, [casesState]);

  // Active quiz submissions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<Record<string, unknown> | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<{ score?: number; grade?: string; verdict?: string; analysis?: string; unlockedBadges?: string[] } | null>(null);

  // Load and merge cases list
  const customCasesList = Array.isArray(userProfile?.customCases) ? userProfile.customCases : [];
  const allCases = [...HANDCRAFTED_CASES, ...customCasesList];
  const activeCase = allCases.find(c => c.id === activeCaseId);

  // Preserve the user's exact location so a reload returns to the same screen.
  useEffect(() => {
    localStorage.setItem('detective_current_view', currentView);
    if (activeCaseId) localStorage.setItem('detective_active_case', activeCaseId);
    else localStorage.removeItem('detective_active_case');
    localStorage.setItem('detective_active_tab', activeTab);
    if (selectedEvidenceId) localStorage.setItem('detective_selected_evidence', selectedEvidenceId);
    else localStorage.removeItem('detective_selected_evidence');
  }, [currentView, activeCaseId, activeTab, selectedEvidenceId]);

  // Route-Aware Audio Lifecycle: Background music is restricted ONLY to Story Introduction
  useEffect(() => {
    if (currentView === 'story_intro') {
      mysteryAudio.setMode('story');
      mysteryAudio.start('story');
    } else {
      mysteryAudio.stop();
    }
  }, [currentView]);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(timer);
  }, [notification]);

  // --- Supabase Synchronization Engines ---

  const loadUserData = async (token: string, signupName?: string) => {
    setSupabaseError(null);
    setSupabaseTableMissing(false);
    try {
      // 1. Profile
      const profileRes = await apiService.getUserProfile(token);
      if (profileRes.status === 401) {
        handleLogout();
        setIsProfileLoaded(true);
        return;
      }
      if (profileRes.status === 530) {
        setSupabaseConfigured(false);
        setIsProfileLoaded(true);
        return;
      }
      if (!profileRes.ok) {
        console.warn("Profile fetch returned status:", profileRes.status);
        setIsProfileLoaded(true);
        return;
      }

      const profileData = await profileRes.json();
      if (profileData.error === "SUPABASE_TABLES_MISSING") {
        setSupabaseTableMissing(true);
        setIsProfileLoaded(true);
        return;
      }

      // 2. Custom Cases
      let customCasesData: Case[] = [];
      try {
        const customCasesRes = await apiService.getCustomCases(token);
        if (customCasesRes.ok) {
          const parsed = await customCasesRes.json();
          if (Array.isArray(parsed)) {
            customCasesData = parsed;
          }
        }
      } catch (err) {
        console.warn("Failed fetching custom cases:", err);
      }

      // 3. Cases State
      let casesStateData: Record<string, CaseState> = {};
      try {
        const casesStateRes = await apiService.getCasesState(token);
        if (casesStateRes.ok) {
          const parsed = await casesStateRes.json();
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && !('error' in parsed)) {
            casesStateData = parsed;
          }
        }
      } catch (err) {
        console.warn("Failed fetching cases state:", err);
      }

      const storedLocalName = localStorage.getItem('detective_user_name');
      let resolvedName = profileData.name;
      if (!resolvedName || resolvedName === 'Investigator' || resolvedName === 'Cadet Detective') {
        resolvedName = signupName || storedLocalName || (profileData.email ? profileData.email.split('@')[0] : 'Investigator');
      }

      if (resolvedName && resolvedName !== 'Investigator') {
        localStorage.setItem('detective_user_name', resolvedName);
      }

      const updatedProfile: UserProfile = {
        name: resolvedName,
        email: profileData.email || '',
        casesSolved: profileData.cases_solved || 0,
        solvedCaseIds: Array.isArray(profileData.solved_case_ids) ? profileData.solved_case_ids : [],
        activeCaseId: null,
        achievements: mergeAchievements(profileData.achievements),
        customCases: customCasesData
      };

      setUserProfile(updatedProfile);

      if (profileData.name !== resolvedName && token) {
        void syncProfileToSupabase(token, updatedProfile);
      }

      if (typeof profileData.xp === 'number') {
        setXp(profileData.xp);
        localStorage.setItem('mil_xp', profileData.xp.toString());
      }

      setCasesState(casesStateData);
      setSupabaseConfigured(true);
      setIsProfileLoaded(true);
    } catch (err: unknown) {
      console.warn("User data sync operating in offline mode:", err);
      setSupabaseError("Operating in local session mode.");
      setIsProfileLoaded(true);
    }
  };

  const syncProfileToSupabase = async (token: string, profile: UserProfile, explicitXp?: number) => {
    try {
      const currentXp = explicitXp !== undefined ? explicitXp : (Number(localStorage.getItem('mil_xp')) || xp);
      await apiService.updateUserProfile(token, {
        name: profile.name,
        cases_solved: profile.casesSolved,
        solved_case_ids: profile.solvedCaseIds,
        achievements: profile.achievements,
        xp: currentXp
      });
    } catch (err) {
      console.error("Failed to sync profile:", err);
    }
  };

  const syncCaseStateToSupabase = async (token: string, caseId: string, state: CaseState) => {
    try {
      await apiService.updateCaseState(token, caseId, state);
    } catch (err) {
      console.error("Failed to sync case state:", err);
    }
  };

  const syncCustomCaseToSupabase = async (token: string, newCase: Case) => {
    try {
      await apiService.updateCustomCase(token, newCase);
    } catch (err) {
      console.error("Failed to sync custom case:", err);
    }
  };

  const handleAuthSuccess = (token: string, email: string, name: string) => {
    localStorage.setItem('supabase_token', token);
    if (name && name !== 'Investigator' && name !== 'Cadet Detective') {
      localStorage.setItem('detective_user_name', name);
    }
    setAuthToken(token);
    notify({ kind: 'success', title: 'Signed in successfully', message: `Welcome back, ${name || email || 'investigator'}. Your case archives are being restored.` });
    void loadUserData(token, name);
  };

  const handleUpdateProfileName = (newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    localStorage.setItem('detective_user_name', trimmed);
    setUserProfile(prev => {
      const updated = { ...prev, name: trimmed };
      if (authToken) {
        void syncProfileToSupabase(authToken, updated);
      }
      return updated;
    });
    notify({ kind: 'success', title: 'Profile Updated', message: `Your investigator alias is now "${trimmed}".` });
  };

  const handleLogout = () => {
    localStorage.removeItem('supabase_token');
    localStorage.removeItem('detective_current_view');
    localStorage.removeItem('detective_active_case');
    localStorage.removeItem('detective_active_tab');
    localStorage.removeItem('detective_selected_evidence');
    localStorage.removeItem('detective_cases_state');
    localStorage.removeItem('detective_user_name');
    setAuthToken(null);
    setIsProfileLoaded(false);
    setCurrentView('library');
    setActiveCaseId(null);
    setActiveTab('evidence');
    setSelectedEvidenceId(null);
    notify({ kind: 'info', title: 'Signed out', message: 'Your investigation session has been closed safely.' });
    // Reset back to defaults
    setUserProfile(DEFAULT_USER_PROFILE);
    setCasesState({});
  };

  // Check configuration and recovery on mount
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const data = await apiService.getSystemStatus();
        setSystemStatus(data as unknown as { supabase: { configured: boolean; status: string; message: string }; ai?: { configured: boolean; status: string; message: string } });
        setSupabaseConfigured(Boolean(data?.supabase?.configured));
        setAiConfigured(data?.gemini?.configured ?? data?.ai?.configured ?? true);
      } catch (err) {
        console.warn("Operating in offline system mode:", err);
        setSystemStatus({
          supabase: { configured: false, status: "offline", message: "Operating in local offline session mode." },
          ai: { configured: false, status: "offline", message: "AI capabilities using local backup heuristics." }
        });
      }
    };
    void checkSystemStatus();
    
    if (authToken) {
      void loadUserData(authToken);
    }
  }, [authToken]);

  // Auto-sync active case state when it changes (debounced 500ms)
  useEffect(() => {
    if (!authToken || !activeCaseId) return;
    const activeState = safeGet(casesState, activeCaseId);
    if (activeState) {
      const timer = setTimeout(() => {
        void syncCaseStateToSupabase(authToken, activeCaseId, activeState);
      }, 500);
      return () => { clearTimeout(timer); };
    }
  }, [casesState, activeCaseId, authToken]);

  // Auto-sync user profile when solved cases, achievements, or XP change (debounced 1000ms)
  useEffect(() => {
    if (!authToken || !isProfileLoaded) return;
    const timer = setTimeout(() => {
      void syncProfileToSupabase(authToken, userProfile);
    }, 1000);
    return () => { clearTimeout(timer); };
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
          if (next >= 350) {
            dispatchHonorUnlock('badge_mil_master');
          }
          return next;
        });
        setXpToast({ xp: earnedXp, msg });
      }
    };
    window.addEventListener('mil-xp-earned', handleXpEarned);
    return () => { window.removeEventListener('mil-xp-earned', handleXpEarned); };
  }, []);

  // Listen for global achievement unlock events
  useEffect(() => {
    const handleUnlockAchievement = (e: Event) => {
      const customEvent = e as CustomEvent<{ badgeId: string; customMessage?: string }>;
      if (!customEvent.detail?.badgeId) return;

      const badgeId = customEvent.detail.badgeId;
      setUserProfile(prev => {
        const existing = prev.achievements.find(a => a.id === badgeId);
        if (!existing || existing.isUnlocked) return prev; // Already unlocked or invalid

        mysteryAudio.playHonorUnlockedSound();

        const updatedAchievements = prev.achievements.map(a =>
          a.id === badgeId ? { ...a, isUnlocked: true, unlockedAt: new Date().toLocaleDateString() } : a
        );

        notify({
          kind: 'success',
          title: '🎖️ ACADEMY HONOR SECURED!',
          message: customEvent.detail.customMessage || `Decoration Awarded: "${existing.title}". Citation archived in profile.`
        });

        // Award bonus XP for earning honors
        const currentXpVal = Number(localStorage.getItem('mil_xp')) || xp;
        const nextXp = currentXpVal + 100;
        localStorage.setItem('mil_xp', nextXp.toString());
        setXp(nextXp);

        const updated = { ...prev, achievements: updatedAchievements };
        if (authToken) {
          void syncProfileToSupabase(authToken, updated, nextXp);
        }
        return updated;
      });
    };

    window.addEventListener('unlock-achievement', handleUnlockAchievement);
    return () => { window.removeEventListener('unlock-achievement', handleUnlockAchievement); };
  }, [authToken]);

  // Clear XP Toast after delay
  useEffect(() => {
    if (xpToast) {
      const timer = setTimeout(() => {
        setXpToast(null);
      }, 4000);
      return () => { clearTimeout(timer); };
    }
  }, [xpToast]);


  // Track pending case selection for Resume vs Restart prompt
  const [pendingCaseId, setPendingCaseId] = useState<string | null>(null);

  // Initialize or handle case selection
  const handleSelectCase = (caseId: string) => {
    const existingState = safeGet(casesState, caseId);
    if (existingState) {
      // User has already started investigating this case -> prompt to Resume or Restart
      setPendingCaseId(caseId);
    } else {
      // First time opening this case -> start fresh with story prologue
      startCaseFresh(caseId, true);
    }
  };

  // Helper to start or reset a case fresh
  const startCaseFresh = (caseId: string, showStoryIntro: boolean = true) => {
    setActiveCaseId(caseId);
    setCurrentView(showStoryIntro ? 'story_intro' : 'game');
    setActiveTab('leads');
    setEvaluationResult(null);
    setSelectedEvidenceId(null);

    // Unlock "First Contact" achievement on starting any case
    dispatchHonorUnlock('badge_first_contact');

    const targetCase = allCases.find(c => c.id === caseId);
    if (targetCase) {
      const defaultState: CaseState = {
        caseId,
        discoveredEvidenceIds: targetCase.evidences.filter(e => !e.isLocked).map(e => e.id),
        discoveredClueIds: [],
        unlockedWitnessIds: targetCase.witnesses.filter(w => w.status === 'available').map(w => w.id),
        unlockedLeadIds: (targetCase.leads || []).filter(l => l.isUnlocked).map(l => l.id),
        completedLeadIds: [],
        wallNodes: targetCase.initialWallNodes || [],
        wallConnections: [],
        notebookNotes: [],
        timelinePlacements: {},
        witnessChats: {},
        isCompleted: false
      };
      setCasesState(prev => {
        const updated = safeSet(prev, caseId, defaultState);
        if (authToken) {
          void syncCaseStateToSupabase(authToken, caseId, defaultState);
        }
        return updated;
      });
    }
  };

  // Resume ongoing investigation without showing story prologue
  const handleResumeCase = (caseId: string) => {
    setActiveCaseId(caseId);
    setCurrentView('game'); // Skips story prologue directly to ongoing investigation!
    setActiveTab('leads');
    setEvaluationResult(null);
    setSelectedEvidenceId(null);
    setPendingCaseId(null);

    // Ensure First Contact achievement is unlocked
    dispatchHonorUnlock('badge_first_contact');
  };

  // Restart investigation from beginning with story prologue
  const handleRestartCase = (caseId: string) => {
    setPendingCaseId(null);
    startCaseFresh(caseId, true);
  };

  const getActiveCaseState = (): CaseState => {
    if (!activeCaseId) {
      return {
        caseId: '',
        discoveredEvidenceIds: [],
        discoveredClueIds: [],
        unlockedWitnessIds: [],
        unlockedLeadIds: [],
        completedLeadIds: [],
        wallNodes: [],
        wallConnections: [],
        notebookNotes: [],
        timelinePlacements: {},
        witnessChats: {},
        isCompleted: false
      };
    }
    const state = safeGet(casesState, activeCaseId);
    const targetCase = allCases.find(c => c.id === activeCaseId);

    const initialUnlockedLeads = (targetCase?.leads || []).filter(l => l.isUnlocked).map(l => l.id);
    const initialUnlockedEvidences = targetCase?.evidences.filter(e => !e.isLocked).map(e => e.id) || [];
    const initialUnlockedWitnesses = targetCase?.witnesses.filter(w => w.status === 'available').map(w => w.id) || [];

    if (!state) {
      return {
        caseId: activeCaseId,
        discoveredEvidenceIds: initialUnlockedEvidences,
        discoveredClueIds: [],
        unlockedWitnessIds: initialUnlockedWitnesses,
        unlockedLeadIds: initialUnlockedLeads,
        completedLeadIds: [],
        wallNodes: targetCase?.initialWallNodes || [],
        wallConnections: [],
        notebookNotes: [],
        timelinePlacements: {},
        witnessChats: {},
        isCompleted: false
      };
    }

    const mergedUnlockedLeads = Array.from(new Set([...initialUnlockedLeads, ...(state.unlockedLeadIds || [])]));
    const mergedEvidences = Array.from(new Set([...initialUnlockedEvidences, ...(state.discoveredEvidenceIds || [])]));
    const mergedWitnesses = Array.from(new Set([...initialUnlockedWitnesses, ...(state.unlockedWitnessIds || [])]));

    return {
      ...state,
      unlockedLeadIds: mergedUnlockedLeads,
      discoveredEvidenceIds: mergedEvidences,
      unlockedWitnessIds: mergedWitnesses
    };
  };

  const currentCaseState = getActiveCaseState();

  // Lead selection & completion handler
  const handleSelectLead = (lead: InvestigationLead) => {
    if (!activeCaseId) return;
    if (lead.targetType === 'evidence') setActiveTab('evidence');
    else if (lead.targetType === 'witness') setActiveTab('witnesses');
    else if (lead.targetType === 'timeline') setActiveTab('timeline');
    else if (lead.targetType === 'board') setActiveTab('clues');
    else if (lead.targetType === 'conference') setActiveTab('submit');
  };

  const handleCompleteLead = (leadId: string) => {
    if (!activeCaseId || !activeCase) return;
    setCasesState(prev => {
      const state = safeGet(prev, activeCaseId);
      if (!state) return prev;
      if (state.completedLeadIds?.includes(leadId)) return prev;

      const lead = activeCase.leads?.find(l => l.id === leadId);
      const updatedCompleted = [...(state.completedLeadIds || []), leadId];

      let updatedUnlockedLeads = [...(state.unlockedLeadIds || [])];
      if (!updatedUnlockedLeads.includes(leadId)) {
        updatedUnlockedLeads.push(leadId);
      }

      let updatedEvidences = [...state.discoveredEvidenceIds];
      let updatedWitnesses = [...state.unlockedWitnessIds];

      if (lead) {
        if (lead.unlocksLeads) {
          lead.unlocksLeads.forEach(id => {
            if (!updatedUnlockedLeads.includes(id)) updatedUnlockedLeads.push(id);
          });
        }
        if (lead.unlocksEvidenceIds) {
          lead.unlocksEvidenceIds.forEach(id => {
            if (!updatedEvidences.includes(id)) updatedEvidences.push(id);
          });
        }
        if (lead.unlocksWitnessIds) {
          lead.unlocksWitnessIds.forEach(id => {
            if (!updatedWitnesses.includes(id)) updatedWitnesses.push(id);
          });
        }
      }

      notify({
        kind: 'success',
        title: 'Investigative Lead Resolved!',
        message: lead ? `Completed: "${lead.title}". New clues and leads unlocked.` : 'Lead completed.'
      });

      return safeSet(prev, activeCaseId, {
        ...state,
        completedLeadIds: updatedCompleted,
        unlockedLeadIds: updatedUnlockedLeads,
        discoveredEvidenceIds: updatedEvidences,
        unlockedWitnessIds: updatedWitnesses
      });
    });
  };

  // Called when evidence points or tools are inspected
  const handleCompleteLeadByEvidence = (evidenceId: string, pointId?: string, revealsLeadId?: string) => {
    if (!activeCaseId || !activeCase) return;

    if (revealsLeadId) {
      setCasesState(prev => {
        const state = safeGet(prev, activeCaseId);
        if (!state) return prev;
        let updatedLeads = [...(state.unlockedLeadIds || [])];
        if (!updatedLeads.includes(revealsLeadId)) {
          updatedLeads.push(revealsLeadId);
        }
        return safeSet(prev, activeCaseId, {
          ...state,
          unlockedLeadIds: updatedLeads
        });
      });
    }

    const currentState = getActiveCaseState();
    const unlockedSet = new Set(currentState.unlockedLeadIds || []);

    const matchingLeads = activeCase.leads?.filter(l => 
      l.targetType === 'evidence' && 
      l.targetId === evidenceId && 
      (unlockedSet.has(l.id) || l.isUnlocked)
    );

    if (matchingLeads && matchingLeads.length > 0) {
      matchingLeads.forEach(lead => {
        handleCompleteLead(lead.id);
      });
    }
  };

  const handleClassifySuspect = (witnessId: string, classification: 'primary_suspect' | 'person_of_interest' | 'cleared', reason: string) => {
    if (!activeCaseId) return;
    setCasesState(prev => {
      const existing = prev[activeCaseId] || {
        caseId: activeCaseId,
        discoveredEvidenceIds: [],
        discoveredClueIds: [],
        unlockedWitnessIds: [],
        unlockedLeadIds: [],
        completedLeadIds: [],
        notebookNotes: [],
        timelinePlacements: {},
        wallNodes: [],
        wallConnections: [],
        witnessChats: {},
        isCompleted: false
      };
      const updated = {
        ...(existing.suspectClassifications || {}),
        [witnessId]: { classification, reason }
      };
      return safeSet(prev, activeCaseId, { ...existing, suspectClassifications: updated } as CaseState);
    });
    notify({
      kind: 'info',
      title: 'Investigative Status Updated',
      message: `Suspect classification saved for dossier report.`
    });
  };

  const handleToggleKeyEvidence = (evidenceId: string, isKey: boolean, justification?: string) => {
    if (!activeCaseId) return;
    setCasesState(prev => {
      const existing = prev[activeCaseId] || {
        caseId: activeCaseId,
        discoveredEvidenceIds: [],
        discoveredClueIds: [],
        unlockedWitnessIds: [],
        unlockedLeadIds: [],
        completedLeadIds: [],
        notebookNotes: [],
        timelinePlacements: {},
        wallNodes: [],
        wallConnections: [],
        witnessChats: {},
        isCompleted: false
      };
      const updated = {
        ...(existing.keyEvidenceTags || {}),
        [evidenceId]: { isKey, justification: justification || '' }
      };
      return safeSet(prev, activeCaseId, { ...existing, keyEvidenceTags: updated } as CaseState);
    });
    notify({
      kind: 'info',
      title: isKey ? 'Tagged as Key Evidence' : 'Untagged Evidence',
      message: isKey ? 'Evidence marked for prominent placement in Detective Report.' : 'Tag removed.'
    });
  };

  // Called when witness is interviewed (sending message)
  const handleInterviewWitness = (witnessId: string) => {
    if (!activeCaseId || !activeCase) return;

    const currentState = getActiveCaseState();
    const unlockedSet = new Set(currentState.unlockedLeadIds || []);

    const matchingLeads = activeCase.leads?.filter(l => 
      l.targetType === 'witness' && 
      l.targetId === witnessId && 
      (unlockedSet.has(l.id) || l.isUnlocked)
    );
    if (matchingLeads && matchingLeads.length > 0) {
      matchingLeads.forEach(lead => {
        handleCompleteLead(lead.id);
      });
    }
  };

  // Called when witness is confronted with evidence
  const handleConfrontWitnessWithEvidence = (witnessId: string, evidenceId: string) => {
    if (!activeCaseId || !activeCase) return;

    const currentState = getActiveCaseState();
    const unlockedSet = new Set(currentState.unlockedLeadIds || []);

    const matchingLeads = activeCase.leads?.filter(l => 
      l.targetType === 'witness' && 
      l.targetId === witnessId && 
      (unlockedSet.has(l.id) || l.isUnlocked)
    );
    if (matchingLeads && matchingLeads.length > 0) {
      matchingLeads.forEach(lead => {
        handleCompleteLead(lead.id);
      });
    }

    const witness = activeCase.witnesses.find(w => w.id === witnessId);
    if (witness?.confrontationTriggers) {
      const trigger = witness.confrontationTriggers.find(t => t.evidenceId === evidenceId);
      if (trigger) {
        if (trigger.revealsLeadId) {
          setCasesState(prev => {
            const state = safeGet(prev, activeCaseId);
            if (!state) return prev;
            let updatedLeads = [...(state.unlockedLeadIds || [])];
            if (!updatedLeads.includes(trigger.revealsLeadId!)) {
              updatedLeads.push(trigger.revealsLeadId!);
            }
            return safeSet(prev, activeCaseId, {
              ...state,
              unlockedLeadIds: updatedLeads
            });
          });
        }
        if (trigger.revealsEvidenceId) {
          handleRevealEvidence(trigger.revealsEvidenceId);
        }
        if (trigger.revealsWitnessId) {
          setCasesState(prev => {
            const state = safeGet(prev, activeCaseId);
            if (!state) return prev;
            if (state.unlockedWitnessIds.includes(trigger.revealsWitnessId!)) return prev;
            return safeSet(prev, activeCaseId, {
              ...state,
              unlockedWitnessIds: [...state.unlockedWitnessIds, trigger.revealsWitnessId!]
            });
          });
        }
      }
    }
  };

  // Called when timeline sequence is verified
  const handleCompleteTimeline = () => {
    if (!activeCaseId || !activeCase) return;

    const matchingLeads = activeCase.leads?.filter(l => l.targetType === 'timeline');
    if (matchingLeads && matchingLeads.length > 0) {
      matchingLeads.forEach(lead => {
        handleCompleteLead(lead.id);
      });
    }
  };

  // Called when Clue Board theory is evaluated
  const handleCompleteClueBoard = () => {
    if (!activeCaseId || !activeCase) return;

    const currentState = getActiveCaseState();
    const unlockedSet = new Set(currentState.unlockedLeadIds || []);

    const matchingLeads = activeCase.leads?.filter(l => 
      l.targetType === 'board' && 
      (unlockedSet.has(l.id) || l.isUnlocked)
    );
    if (matchingLeads && matchingLeads.length > 0) {
      matchingLeads.forEach(lead => {
        handleCompleteLead(lead.id);
      });
    }
  };

  // Called when Investigation Wall nodes/connections are updated
  const handleUpdateWall = (nodes: WallNode[], connections: WallConnection[]) => {
    if (!activeCaseId) return;
    setCasesState(prev => {
      const state = safeGet(prev, activeCaseId);
      if (!state) return prev;
      return safeSet(prev, activeCaseId, {
        ...state,
        wallNodes: nodes,
        wallConnections: connections
      });
    });
  };

  // Highlight or extract evidence text directly into user's notebook
  const handleLogToNotebook = (text: string) => {
    if (!activeCaseId) return;
    setCasesState(prev => {
      const state = safeGet(prev, activeCaseId);
      if (!state) return prev;
      const logLine = text;
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

  // Delete note from notepad
  const handleDeleteNotebookNote = (index: number) => {
    if (!activeCaseId) return;
    setCasesState(prev => {
      const state = safeGet(prev, activeCaseId);
      if (!state) return prev;
      const updatedNotes = [...state.notebookNotes];
      updatedNotes.splice(index, 1);
      return safeSet(prev, activeCaseId, {
        ...state,
        notebookNotes: updatedNotes
      });
    });
  };

  // Clear all notes from notepad
  const handleClearNotebookNotes = () => {
    if (!activeCaseId) return;
    setCasesState(prev => {
      const state = safeGet(prev, activeCaseId);
      if (!state) return prev;
      return safeSet(prev, activeCaseId, {
        ...state,
        notebookNotes: []
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

      // Rule: Unlocking first-hand info reveals relevant witnesses
      activeCase.witnesses.forEach(witness => {
        if (!updatedWitnesses.includes(witness.id)) {
          updatedWitnesses.push(witness.id);
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
        discoveredClueIds: updatedClues
      });
    });
  };

  // Message chat history aggregator
  const handleAddWitnessMessage = (witnessId: string, sender: 'user' | 'witness', text: string) => {
    if (!activeCaseId) return;
    setCasesState(prev => {
      const state = safeGet(prev, activeCaseId);
      if (!state) return prev;

      const currentChats = safeGet(state.witnessChats, witnessId) ?? [];
      const newChat = {
        sender,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      return safeSet(prev, activeCaseId, {
        ...state,
        witnessChats: safeSet(state.witnessChats, witnessId, [...currentChats, newChat])
      });
    });
  };

  // submit case evaluation
  const handleSubmitCase = async (report: Record<string, unknown>) => {
    if (!activeCaseId || !activeCase) return;

    setSubmittedReport(report);
    setIsSubmitting(true);

    try {
      // Send for AI Evaluation to Judge AI on the server
      const evaluation = await apiService.judgeCase({
        caseTitle: activeCase.title,
        topic: activeCase.topic,
        warningSigns: activeCase.warningSigns,
        manipulationTechniques: activeCase.manipulationTechniques,
        answers: report,
        timeline: {
          placements: currentCaseState.timelinePlacements,
          events: activeCase.timeline
        },
        notebookNotes: currentCaseState.notebookNotes.join('\n')
      });

      setEvaluationResult(evaluation);

      // Update case states as completed & solve counter
      const existingState = safeGet(casesState, activeCaseId) || currentCaseState;
      const updatedCaseState: CaseState = {
        ...existingState,
        isCompleted: true,
        score: evaluation.score,
        feedback: evaluation.verdict
      };
      setCasesState(prev => safeSet(prev, activeCaseId, updatedCaseState));
      if (authToken) {
        void syncCaseStateToSupabase(authToken, activeCaseId, updatedCaseState);
      }

      // Update User Profile solved registry
      setUserProfile(prev => {
        const newlySolved = prev.solvedCaseIds.includes(activeCaseId) 
          ? prev.solvedCaseIds 
          : [...prev.solvedCaseIds, activeCaseId];
        
        const updated = {
          ...prev,
          solvedCaseIds: newlySolved,
          casesSolved: newlySolved.length
        };
        if (authToken) {
          void syncProfileToSupabase(authToken, updated);
        }
        return updated;
      });

      // Dispatch specific Case Directives & Honours
      if (evaluation.score >= 70) {
        if (activeCaseId.includes('border') || activeCase.title.toLowerCase().includes('border')) {
          dispatchHonorUnlock('badge_border_promise');
        } else if (activeCaseId.includes('voice') || activeCaseId.includes('echo') || activeCase.title.toLowerCase().includes('static') || activeCase.title.toLowerCase().includes('echoes')) {
          dispatchHonorUnlock('badge_echoes_static');
        } else if (activeCaseId.includes('ledger') || activeCaseId.includes('ghost') || activeCase.title.toLowerCase().includes('ghost') || activeCase.title.toLowerCase().includes('ledger')) {
          dispatchHonorUnlock('badge_ghost_ledger');
        }
      }

      if (evaluation.score >= 90) {
        dispatchHonorUnlock('badge_flawless_verdict');
      }

      // Check if all handcrafted cases solved
      const allThreeSolved = ['case_border_promise', 'case_echoes_static', 'case_ghost_ledger'].every(
        cid => userProfile.solvedCaseIds.includes(cid) || activeCaseId === cid
      );
      if (allThreeSolved) {
        dispatchHonorUnlock('badge_grandmaster');
      }

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
      notify({ kind: 'error', title: 'Report submission failed', message: 'The review service is temporarily unavailable. Your report is still on screen; please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden">
        <VantaBackground />
        <LoadingScreen
          isDataReady={systemStatus !== null && (!authToken || isProfileLoaded)}
          onComplete={() => setIsInitializing(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950/30 text-white flex flex-col font-sans select-none overflow-x-hidden relative">
      <VantaBackground />

      {!authToken ? (
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col justify-center min-h-[95vh] relative z-10 select-none">
          {/* Logo Header */}
          <div className="flex items-center gap-3 mb-12 self-start animate-fade-in glass-panel bg-slate-900/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20">
            <div className="w-8 h-8 bg-white p-0.5 rounded-full flex items-center justify-center shadow-md border border-[#ff8533]/30 overflow-hidden">
              <img 
                src={detectiveSquirrelLogo} 
                alt="Detective Mascot Logo" 
                className="w-full h-full object-cover scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-serif font-bold text-base text-white tracking-tight uppercase drop-shadow-sm">Social Detective Academy</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* LEFT SIDE: Detective squirrel mascot */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative select-none animate-fade-in">
              {/* Character Mascot Wrapper */}
              <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
                {/* Cozy Ambient Light behind the mascot */}
                <div className="absolute w-64 h-64 bg-[#ff8533]/25 rounded-full filter blur-3xl animate-pulse" />
                
                {/* Cute Generated Detective Squirrel */}
                <img 
                  src={detectiveSquirrelLogo} 
                  alt="Sherlock Squirrel Detective Mascot" 
                  className="w-full h-full object-contain rounded-[32px] border-2 border-white/30 shadow-2xl relative z-10 backdrop-blur-md"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* RIGHT SIDE: App Titles or Auth Form */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {!showAuthForm ? (
                <div className="space-y-6 md:space-y-8 animate-fade-in">
                  {/* Category Pill */}
                  <div className="inline-block bg-slate-900/60 backdrop-blur-md border border-[#ff8533]/40 text-[#ffb829] px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg">
                    Interactive Social Crime Awareness Academy
                  </div>

                  {/* Serif title with highlighted gradient blocks */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3 items-center">
                      <span className="bg-gradient-to-r from-[#ff8533] to-[#ff9d5c] text-slate-950 px-6 py-2.5 rounded-[20px] inline-block font-serif font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight shadow-xl shadow-[#ff8533]/25">
                        Think You
                      </span>
                      <span className="bg-gradient-to-r from-[#ff8533] to-[#ff9d5c] text-slate-950 px-6 py-2.5 rounded-[20px] inline-block font-serif font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight shadow-xl shadow-[#ff8533]/25">
                        Know Your
                      </span>
                    </div>
                    <div className="font-serif italic font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#ffb829] tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                      Threats?
                    </div>
                  </div>

                  {/* Description text */}
                  <p className="text-sm md:text-base text-slate-100 font-sans leading-relaxed max-w-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    Investigate cyberbullying. Spot elder fraud. Map viral disinformation. 
                    <strong className="text-[#ffb829] font-bold mx-1">Social Detective</strong> 
                    turns social crime awareness, empathy, and digital safety into interactive learning mysteries you will actively want to solve again and again.
                  </p>

                  {/* Large stats and info card */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    {/* CTA Actions */}
                    <div className="md:col-span-5 flex flex-col gap-3 justify-center">
                      <button
                        onClick={() => { setShowAuthForm(true); }}
                        className="btn-primary w-full text-center flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        <span>Start Investigating</span>
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>

                    {/* Features glass-card */}
                    <div className="md:col-span-7 glass-panel bg-slate-900/60 backdrop-blur-xl text-white rounded-[28px] p-5 border border-white/20 shadow-2xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-[#ff8533] text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            ACADEMY ENTRY
                          </span>
                          <span className="text-xs font-bold text-amber-300">AGES 12 - ADULT</span>
                        </div>
                        <ul className="space-y-2 text-[12px] md:text-xs text-slate-200 font-sans">
                          <li className="flex items-start gap-1.5">
                            <span className="text-[#ff8533]">●</span>
                            <span>No boring slides. No compliance traps. Just active social investigation.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-[#ffb829]">●</span>
                            <span>20-minute case files, interactive hotspots and witness interviews.</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <span className="text-emerald-400">●</span>
                            <span>Social safety, empathy, & critical thinking.</span>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] italic font-serif text-slate-300">
                        <span>"The squirrel dares you to investigate."</span>
                        <span className="text-[#ffb829] tracking-wide font-sans not-italic font-bold">★★★★★</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-200 font-mono drop-shadow-sm">
                    Free educational academy.
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in max-w-md mx-auto">
                  {/* Back to landing button */}
                  <button
                    onClick={() => { setShowAuthForm(false); }}
                    className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#ffb829] hover:text-[#ff8533] uppercase transition-colors mb-4 cursor-pointer glass-panel bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                  >
                    <span>← Back to Main Menu</span>
                  </button>

                  <LoginSignup 
                    onAuthSuccess={handleAuthSuccess} 
                    supabaseConfigured={supabaseConfigured}
                    aiConfigured={aiConfigured}
                    systemStatus={systemStatus}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Upper Floating Navigation Bar */}
          <header className="sticky top-4 z-50 max-w-7xl mx-auto my-3 px-6 py-3 rounded-full glass-panel bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-between transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white p-0.5 rounded-full flex items-center justify-center shadow-sm border border-[#ff8533]/30 overflow-hidden">
                <img 
                  src={detectiveSquirrelLogo} 
                  alt="Detective Squirrel Mascot Logo" 
                  className="w-full h-full object-cover scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="font-serif text-base font-bold tracking-tight text-white flex items-center gap-1.5 uppercase">
                  SOCIAL DETECTIVE
                </h1>
                <p className="text-[9px] text-slate-300 font-mono hidden sm:block">Social Crime Awareness & Prevention System</p>
              </div>
            </div>

            {/* Global Nav Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setCurrentView('library');
                  setActiveCaseId(null);
                }}
                className={`px-4 py-1.5 rounded-full font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer focus:outline-none ${
                  currentView === 'library'
                    ? 'bg-[#ff8533] text-slate-950 shadow-md shadow-[#ff8533]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                LIBRARY
              </button>
              <button
                onClick={() => { setCurrentView('profile'); }}
                className={`px-4 py-1.5 rounded-full font-mono text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer focus:outline-none ${
                  currentView === 'profile'
                    ? 'bg-[#ff8533] text-slate-950 shadow-md shadow-[#ff8533]/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                PROFILE
              </button>

              {/* User credentials / Authentication Controls */}
              <div className="flex items-center gap-3 border-l border-white/20 pl-3 ml-1 text-xs">
                <button
                  onClick={() => { setCurrentView('profile'); }}
                  className="hidden md:flex items-center gap-2 text-right hover:opacity-85 transition-opacity cursor-pointer focus:outline-none"
                  title="View Profile"
                >
                  <div className="text-[11px] font-mono leading-none">
                    <div className="text-white font-bold uppercase flex items-center gap-1 justify-end">
                      <span>{userProfile.name}</span>
                      <User className="h-3 w-3 text-[#ff8533]" />
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 border border-white/20 hover:border-white rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer font-mono text-[10px] font-bold text-slate-200 hover:text-white flex items-center gap-1.5"
                  title="Log Out"
                >
                  <LogOut className="h-3 w-3 shrink-0 text-[#ff8533]" />
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
                  <span>🚨 SYSTEM NOTICE: CLOUD ARCHIVES UNAVAILABLE</span>
                </div>
                <p>
                  Cloud archives are temporarily offline. Your investigative dossier and case progress will be saved locally to this session.
                </p>
              </div>
            )}

            {supabaseError && !supabaseTableMissing && (
              <div className="mb-8 p-6 bg-yellow-950/40 border border-yellow-500/30 rounded-[24px] text-yellow-200 text-xs font-mono leading-relaxed space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-yellow-400 uppercase tracking-wider">
                  <span>⚠️ CLOUD STORAGE NOTICE</span>
                </div>
                <p>
                  Progress is currently cached locally in this browser.
                </p>
              </div>
            )}
            
            {/* VIEW 1: CASE LIBRARY */}
            {currentView === 'library' && (
              <CaseLibraryView 
                allCases={allCases}
                solvedCaseIds={userProfile.solvedCaseIds}
                onSelectCase={handleSelectCase}
                onViewProfile={() => setCurrentView('profile')}
              />
            )}

            {/* VIEW 2: STORY INTRO PROLOGUE */}
            {currentView === 'story_intro' && activeCase && (
              <StoryIntroView
                caseData={activeCase}
                onCompleteStory={() => setCurrentView('game')}
                onSkipStory={() => setCurrentView('game')}
                onAddNote={(note) => handleAddCustomNote(note)}
              />
            )}

            {/* VIEW 3: ACTIVE GAME / CASE INVESTIGATION */}
            {currentView === 'game' && activeCase && (
              <div className="space-y-4 animate-fade-in">
                
                <InvestigationHeader
                  caseData={activeCase}
                  caseState={currentCaseState}
                  activeTab={activeTab}
                  currentRank={currentRank}
                  xp={xp}
                  onBack={() => {
                    setCurrentView('library');
                    setActiveCaseId(null);
                  }}
                  onChangeTab={setActiveTab}
                />

                {/* Split Screen Investigation Workspace */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  
                  {/* Left Side: Navigation Tabs and Main Dynamic Tool Console (3 Cols) */}
                  <div className="xl:col-span-3 flex flex-col gap-4">
                    
                    {/* Main Dynamic Workspace Frame */}
                    <div className="flex-1 min-h-[420px]">
                      {activeTab === 'leads' && (
                        <InvestigationLeads
                          caseData={activeCase}
                          unlockedLeadIds={currentCaseState.unlockedLeadIds || []}
                          completedLeadIds={currentCaseState.completedLeadIds || []}
                          onSelectLead={handleSelectLead}
                        />
                      )}

                      {activeTab === 'evidence' && (
                        <EvidenceViewer
                          caseData={activeCase}
                          discoveredEvidenceIds={currentCaseState.discoveredEvidenceIds}
                          activeEvidenceId={selectedEvidenceId ?? (currentCaseState.discoveredEvidenceIds[0] ?? null)}
                          setActiveEvidenceId={setSelectedEvidenceId}
                          onCopyToNotebook={handleLogToNotebook}
                          onCompleteLeadByEvidence={handleCompleteLeadByEvidence}
                          keyEvidenceTags={currentCaseState.keyEvidenceTags}
                          onToggleKeyEvidence={handleToggleKeyEvidence}
                        />
                      )}

                      {activeTab === 'witnesses' && (
                        <InterrogationTerminal
                          caseData={activeCase}
                          unlockedWitnessIds={currentCaseState.unlockedWitnessIds}
                          discoveredEvidenceIds={currentCaseState.discoveredEvidenceIds}
                          onUnlockWitness={() => {}}
                          chatsState={currentCaseState.witnessChats}
                          onAddMessage={handleAddWitnessMessage}
                          onConfrontWitnessWithEvidence={handleConfrontWitnessWithEvidence}
                          onInterviewWitness={handleInterviewWitness}
                          suspectClassifications={currentCaseState.suspectClassifications}
                          onClassifySuspect={handleClassifySuspect}
                        />
                      )}

                      {activeTab === 'clues' && (
                        <ClueBoard
                          caseData={activeCase}
                          discoveredClueIds={currentCaseState.discoveredClueIds}
                          discoveredEvidenceIds={currentCaseState.discoveredEvidenceIds}
                          wallNodesState={currentCaseState.wallNodes || []}
                          wallConnectionsState={currentCaseState.wallConnections || []}
                          onUpdateWall={handleUpdateWall}
                          onSelectEvidence={setSelectedEvidenceId}
                          onNavigateToTab={setActiveTab}
                          onCompleteClueBoard={handleCompleteClueBoard}
                        />
                      )}

                      {activeTab === 'timeline' && activeCase && (
                        <TimelineBuilder
                          caseData={activeCase}
                          discoveredEvidenceIds={currentCaseState.discoveredEvidenceIds}
                          discoveredClueIds={currentCaseState.discoveredClueIds}
                          unlockedLeadIds={currentCaseState.unlockedLeadIds}
                          completedLeadIds={currentCaseState.completedLeadIds}
                          unlockedWitnessIds={currentCaseState.unlockedWitnessIds}
                          placements={currentCaseState.timelinePlacements}
                          onCompleteTimeline={handleCompleteTimeline}
                          onUpdatePlacements={(placements) => {
                            if (!activeCase?.id) return;
                            setCasesState(prev => {
                              const existing = safeGet(prev, activeCase.id);
                              return safeSet(prev, activeCase.id, {
                                ...existing,
                                timelinePlacements: placements
                              } as CaseState);
                            });
                            if (Object.keys(placements).length === activeCase.timeline.length) {
                              notify({ kind: 'success', title: 'Case Reconstruction Complete', message: 'Every incident has been pinned to the Case Reconstruction Wall. Review your sequence before presenting at Case Conference.' });
                            }
                          }}
                        />
                      )}

                      {activeTab === 'submit' && (
                        evaluationResult ? (
                          <DigitalSafetyReport
                            caseData={activeCase}
                            caseState={currentCaseState}
                            evaluationResult={evaluationResult}
                            submittedReport={submittedReport}
                            investigatorName={userProfile.name || 'Senior Cyber Detective'}
                            onConclude={() => {
                              setCurrentView('library');
                              setActiveCaseId(null);
                            }}
                            onReviewInvestigation={() => {
                              setActiveTab('evidence');
                            }}
                            onReplayCase={() => {
                              if (!activeCase?.id) return;
                              setCasesState(prev => {
                                return safeSet(prev, activeCase.id, {
                                  caseId: activeCase.id,
                                  discoveredEvidenceIds: [activeCase.evidences[0]?.id || 'ev_1'],
                                  unlockedWitnessIds: [activeCase.witnesses[0]?.id || 'wit_1'],
                                  unlockedLeadIds: [activeCase.leads[0]?.id || 'lead_1'],
                                  completedLeadIds: [],
                                  discoveredClueIds: [],
                                  witnessChats: {},
                                  timelinePlacements: {},
                                  notebookNotes: [],
                                  wallNodes: activeCase.initialWallNodes || [],
                                  wallConnections: [],
                                  isCompleted: false
                                });
                              });
                              setEvaluationResult(null);
                              setSubmittedReport(null);
                              setActiveTab('leads');
                            }}
                          />
                        ) : (
                          <DetectiveCaseReportForm
                            caseData={activeCase}
                            discoveredEvidenceIds={currentCaseState.discoveredEvidenceIds}
                            unlockedWitnessIds={currentCaseState.unlockedWitnessIds}
                            caseState={currentCaseState}
                            onNavigateToTab={setActiveTab}
                            onSubmitReport={report => handleSubmitCase(report)}
                          />
                        )
                      )}
                    </div>

                  </div>

                  {/* Right Side: Active Detective Notebook (1 Col) */}
                  <div className="xl:col-span-1">
                    <DetectiveNotebook
                      notes={currentCaseState.notebookNotes}
                      onAddNote={handleAddCustomNote}
                      onDeleteNote={handleDeleteNotebookNote}
                      onClearNotes={handleClearNotebookNotes}
                    />
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
              onUpdateProfileName={handleUpdateProfileName}
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

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
          >
            <NotificationToast notification={notification} onDismiss={() => setNotification(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume vs Restart Investigation Dialog */}
      <ResumeRestartModal
        isOpen={!!pendingCaseId}
        caseData={allCases.find(c => c.id === pendingCaseId) || null}
        onResume={() => pendingCaseId && handleResumeCase(pendingCaseId)}
        onRestart={() => pendingCaseId && handleRestartCase(pendingCaseId)}
        onClose={() => setPendingCaseId(null)}
      />

      {/* Corporate footer bar */}
      <footer className="border-t border-white/10 bg-transparent p-4 mt-8 flex justify-between items-center text-[10px] font-mono text-[#9a9a9a] relative z-10">
        <span>© 2026 UNESCO CYBER TRAINING LABS. ALL RIGHTS RESERVED.</span>
      </footer>

    </div>
  );
}
