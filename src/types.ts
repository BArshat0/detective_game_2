export interface Evidence {
  id: string;
  name: string;
  type: 'document' | 'chat' | 'email' | 'system_file' | 'crypto_fragment' | 'image';
  description: string;
  content: string;
  isLocked: boolean;
  unlockCondition?: string; // e.g., 'interview_witness_id'
}

export interface Witness {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  promptKnowledge: string; // Used by Gemini on the server
  status: 'available' | 'locked' | 'unavailable';
}

export interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  isCorrect: boolean; // Is this part of the true story timeline?
  orderIndex: number; // The correct position in chronological order
}

export interface Clue {
  id: string;
  text: string;
  evidenceId?: string;
  isDiscovered: boolean;
}

export interface Case {
  id: string;
  title: string;
  topic: string;
  difficulty: 'EASY' | 'MED' | 'HIGH';
  status: 'HIGH PRIORITY' | 'URGENT' | 'NEW' | 'STANDARD';
  tag: string; // e.g. 'AI MANIPULATION', 'SOCIAL FORENSICS'
  threatActor: string; // Threat actor group, e.g. 'Mimic Collective'
  timeLimit: string;
  imageUrl: string;
  introduction: string;
  learningObjectives: string[];
  warningSigns: string[];
  manipulationTechniques: string[];
  evidences: Evidence[];
  witnesses: Witness[];
  timeline: TimelineEvent[];
  clues: Clue[];
  solution: {
    questions: {
      id: string;
      question: string;
      choices: string[];
      correctAnswer: string;
      explanation: string;
    }[];
  };
  location: {
    name: string;
    description: string;
    coordinates: string;
    imageUrl: string;
    hotspots: {
      id: string;
      name: string;
      x: number; // percentage from left
      y: number; // percentage from top
      description: string;
      revealsEvidenceId?: string;
    }[];
  };
}

export interface UserProfile {
  name: string;
  email: string;
  casesSolved: number;
  solvedCaseIds: string[];
  activeCaseId: string | null;
  achievements: {
    id: string;
    title: string;
    description: string;
    isUnlocked: boolean;
    unlockedAt?: string;
  }[];
  customCases: Case[];
  xp?: number;
}

export interface CaseState {
  caseId: string;
  discoveredEvidenceIds: string[];
  discoveredClueIds: string[];
  unlockedWitnessIds: string[];
  notebookNotes: string[];
  timelinePlacements: { [eventId: string]: number }; // eventId -> chronological position in draft
  witnessChats: { [witnessId: string]: { sender: 'user' | 'witness'; text: string; timestamp: string }[] };
  isCompleted: boolean;
  score?: number;
  feedback?: string;
}
