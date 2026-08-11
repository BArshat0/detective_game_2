import { useState, useEffect, useCallback } from 'react';
import { CaseState, Case } from '../types';
import { safeGet, safeSet } from '../lib/safeLookup';
import { apiService } from '../services/apiService';

export function useCaseState(authToken: string | null) {
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

  const syncCaseStateToSupabase = useCallback(async (token: string, caseId: string, state: CaseState) => {
    try {
      await apiService.saveCaseState(token, caseId, state);
    } catch (err) {
      console.error("Failed to sync case state:", err);
    }
  }, []);

  const getActiveCaseState = useCallback((activeCaseId: string | null, allCases: Case[]): CaseState => {
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
  }, [casesState]);

  return {
    casesState,
    setCasesState,
    getActiveCaseState,
    syncCaseStateToSupabase
  };
}
