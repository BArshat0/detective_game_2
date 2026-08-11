import { useState, useCallback } from 'react';
import { UserProfile, Case } from '../types';
import { apiService } from '../services/apiService';

const DEFAULT_ACHIEVEMENTS = [
  { id: 'badge_first_case', title: 'First Contact', description: 'Initiated your first forensic investigation.', isUnlocked: false },
  { id: 'badge_synthetic', title: 'Neural Forensics Pro', description: 'Proven Dr. Helen Vance testimony was deepfake.', isUnlocked: false },
  { id: 'badge_sentinel', title: 'Scholarship Sentinel', description: 'Dismantled the Shadow Syndicate baiting ring.', isUnlocked: false },
  { id: 'badge_supply_chain', title: 'Hardware Guardian', description: 'Neutralized the Sector 7 relay sabotage.', isUnlocked: false },
  { id: 'badge_creator', title: 'Quantum Architect', description: 'Synthesized your first custom learning case.', isUnlocked: false }
];

const DEFAULT_USER_PROFILE: UserProfile = {
  name: localStorage.getItem('detective_user_name') || 'Investigator',
  email: '',
  casesSolved: 0,
  solvedCaseIds: [],
  activeCaseId: null,
  achievements: DEFAULT_ACHIEVEMENTS,
  customCases: []
};

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isProfileLoaded, setIsProfileLoaded] = useState<boolean>(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [supabaseTableMissing, setSupabaseTableMissing] = useState<boolean>(false);

  const syncProfileToSupabase = useCallback(async (token: string, profile: UserProfile, xp: number) => {
    try {
      await apiService.updateUserProfile(token, {
        name: profile.name,
        cases_solved: profile.casesSolved,
        solved_case_ids: profile.solvedCaseIds,
        achievements: profile.achievements,
        xp
      });
    } catch (err) {
      console.error("Failed to sync profile:", err);
    }
  }, []);

  const syncCustomCaseToSupabase = useCallback(async (token: string, newCase: Case) => {
    try {
      await apiService.saveCustomCase(token, newCase);
    } catch (err) {
      console.error("Failed to sync custom case:", err);
    }
  }, []);

  return {
    userProfile,
    setUserProfile,
    isProfileLoaded,
    setIsProfileLoaded,
    supabaseError,
    setSupabaseError,
    supabaseTableMissing,
    setSupabaseTableMissing,
    syncProfileToSupabase,
    syncCustomCaseToSupabase,
    DEFAULT_ACHIEVEMENTS,
    DEFAULT_USER_PROFILE
  };
}
