import { useState, useCallback } from 'react';
import { UserProfile, Case } from '../types';
import { apiService } from '../services/apiService';
import { ACADEMY_HONOR_DECORATIONS, mergeAchievements } from '../data/achievements';

const DEFAULT_USER_PROFILE: UserProfile = {
  name: localStorage.getItem('detective_user_name') || 'Investigator',
  email: '',
  casesSolved: 0,
  solvedCaseIds: [],
  activeCaseId: null,
  achievements: ACADEMY_HONOR_DECORATIONS,
  customCases: []
};

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isProfileLoaded, setIsProfileLoaded] = useState<boolean>(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [supabaseTableMissing, setSupabaseTableMissing] = useState<boolean>(false);

  const syncProfileToSupabase = useCallback(async (token: string, profile: UserProfile, explicitXp?: number) => {
    try {
      const currentXp = explicitXp !== undefined ? explicitXp : (profile.xp ?? 0);
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
    DEFAULT_ACHIEVEMENTS: ACADEMY_HONOR_DECORATIONS,
    DEFAULT_USER_PROFILE
  };
}
