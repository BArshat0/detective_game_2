import { Case, CaseState, UserProfile } from '../types';

export interface SystemStatus {
  supabase?: { configured: boolean; status: string; message: string };
  ai?: { configured: boolean; status: string; message: string };
  gemini?: { configured: boolean; status: string; message: string };
}

export interface EvaluationResult {
  score: number;
  grade: string;
  verdict: string;
  analysis: string;
  correctTimelineCount: number;
  unlockedBadges: string[];
}

export const apiService = {
  async getSystemStatus(): Promise<SystemStatus> {
    const res = await fetch('/api/system-status');
    if (!res.ok) {
      throw new Error(`Server status returned ${res.status}`);
    }
    return res.json();
  },

  async getUserProfile(token: string): Promise<Response> {
    return fetch('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async updateUserProfile(token: string, profileData: {
    name: string;
    cases_solved: number;
    solved_case_ids: string[];
    achievements: unknown[];
    xp: number;
  }): Promise<Response> {
    return fetch('/api/user/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
  },

  async getCustomCases(token: string): Promise<Response> {
    return fetch('/api/user/custom-cases', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async updateCustomCase(token: string, newCase: Case): Promise<Response> {
    return fetch('/api/user/custom-cases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ caseData: newCase })
    });
  },

  async saveCustomCase(token: string, newCase: Case): Promise<Response> {
    return this.updateCustomCase(token, newCase);
  },

  async getCasesState(token: string): Promise<Response> {
    return fetch('/api/user/cases-state', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async updateCaseState(token: string, caseId: string, stateData: CaseState): Promise<Response> {
    return fetch('/api/user/cases-state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ caseId, stateData })
    });
  },

  async saveCaseState(token: string, caseId: string, stateData: CaseState): Promise<Response> {
    return this.updateCaseState(token, caseId, stateData);
  },

  async sendWitnessMessage(payload: {
    witnessId: string;
    caseId: string;
    chatHistory: unknown[];
    userQuestion: string;
    witnessName: string;
    witnessRole: string;
    witnessKnowledge: string;
    evidencePresented?: { name: string; excerpt: string } | null;
  }): Promise<{ text: string }> {
    const res = await fetch('/api/witness-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Witness chat error ${res.status}`);
    }
    return res.json();
  },

  async judgeCase(payload: {
    caseTitle: string;
    topic: string;
    warningSigns: string[];
    manipulationTechniques: string[];
    answers: Record<string, unknown>;
    timeline: { placements: Record<string, number>; events: unknown[] };
    notebookNotes: string;
  }): Promise<EvaluationResult> {
    const res = await fetch('/api/judge-case', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error('The investigation review service returned an error.');
    }
    return res.json();
  }
};
