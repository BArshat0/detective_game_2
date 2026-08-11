export interface Evidence {
  id: string;
  name: string;
  type: 'document' | 'chat' | 'email' | 'system_file' | 'crypto_fragment' | 'image' | 'audio' | 'website';
  description: string;
  content: string;
  isLocked: boolean;
  unlockCondition?: string; // e.g. 'Complete lead: lead_verify_email' or 'Interview Elena Vance'
  dateCollected?: string;
  source?: string;
  category?: string;
  importance?: 'Low' | 'Medium' | 'High' | 'Critical';
  inspectablePoints?: {
    id: string;
    label: string;
    detail: string;
    revealsLeadId?: string;
    isDiscovered?: boolean;
  }[];
  metadata?: {
    sender?: string;
    recipient?: string;
    ipAddress?: string;
    domainAge?: string;
    locationName?: string;
    audioDuration?: string;
    fileHash?: string;
  };
}

export interface Witness {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  promptKnowledge: string; // Used by server AI model
  status: 'available' | 'locked' | 'unavailable';
  personalityTrait?: string;
  motive?: string;
  suspicionLevel?: 'Innocent' | 'Unreliable' | 'Suspect' | 'Prime Suspect';
  confrontationTriggers?: {
    evidenceId: string;
    dialogueResponse: string;
    revealsLeadId?: string;
    revealsWitnessId?: string;
    revealsEvidenceId?: string;
  }[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  isCorrect: boolean; // Is this part of the true story timeline?
  orderIndex: number; // The correct position in chronological order
  isInitiallyKnown?: boolean;
  linkedEvidenceId?: string;
  linkedLeadId?: string;
}

export interface InvestigationLead {
  id: string;
  title: string;
  description: string;
  targetType: 'evidence' | 'witness' | 'location' | 'timeline' | 'board' | 'conference';
  targetId?: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  unlocksLeads?: string[];
  unlocksEvidenceIds?: string[];
  unlocksWitnessIds?: string[];
  rewardXp?: number;
  hint?: string;
}

export interface WallNode {
  id: string;
  title: string;
  type: 'suspect' | 'evidence' | 'event' | 'motive' | 'location' | 'financial' | 'digital' | 'people' | 'phone' | 'organisation' | 'travel' | 'social' | 'news' | 'document' | 'unknown' | string;
  x: number; // Canvas % or px coordinate
  y: number;
  description?: string;
  avatarOrIcon?: string;
  noteColor?: 'yellow' | 'pink' | 'cyan' | 'amber' | 'emerald';
  isCustomNote?: boolean;
  isPinned?: boolean;
  rotation?: number; // degrees e.g. -3 to +3
}

export interface WallConnection {
  id: string;
  fromId: string;
  toId: string;
  relationshipLabel: string; // e.g., "Fabricated Identity", "Financial Beneficiary", "Contradicts Testimony"
  color?: string; // hex or color identifier e.g. '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'
  isVerified?: boolean;
}

export interface Clue {
  id: string;
  text: string;
  evidenceId?: string;
  isDiscovered: boolean;
}

export interface StoryScene {
  id: string;
  sceneNumber: number;
  chapterNumber?: number;
  chapterTitle?: string;
  arcTag?: string;
  marginAnnotation?: string;
  title: string;
  locationName?: string;
  mediaType: 'dialogue' | 'phone_call' | 'text_chat' | 'news_alert' | 'email_preview' | 'cctv_log' | 'police_dispatch';
  speaker?: {
    name: string;
    role: string;
    avatar?: string;
    mood?: 'worried' | 'suspicious' | 'confident' | 'panicked' | 'neutral' | 'urgent';
  };
  narration?: string;
  dialogueText?: string;
  mediaContent?: {
    header?: string;
    sender?: string;
    recipient?: string;
    body?: string;
    timestamp?: string;
    image?: string;
  };
  keyTakeaway?: string;
  soundEffect?: 'notification' | 'phone_ring' | 'siren' | 'keyboard' | 'static' | 'suspense';
}

export interface StoryIntro {
  summary: string;
  victimName: string;
  victimRole: string;
  incidentTime: string;
  scenes: StoryScene[];
}

export interface CaseConferenceConfig {
  promptContext: string;
  suspectOptions: { id: string; name: string; role: string }[];
  mechanismOptions: { id: string; label: string; description: string }[];
  preventionOptions: { id: string; label: string; description: string }[];
}

export interface Case {
  id: string;
  title: string;
  topic: string;
  difficulty: 'EASY' | 'MED' | 'HIGH';
  status: 'HIGH PRIORITY' | 'URGENT' | 'NEW' | 'STANDARD';
  tag: string; // e.g. 'HUMAN TRAFFICKING', 'VOICE CLONING', 'GRANT FRAUD'
  threatActor: string; // Threat actor group or alias
  timeLimit: string;
  imageUrl: string;
  introduction: string;
  storyIntro?: StoryIntro;
  learningObjectives: string[];
  warningSigns: string[];
  manipulationTechniques: string[];
  leads: InvestigationLead[];
  evidences: Evidence[];
  witnesses: Witness[];
  timeline: TimelineEvent[];
  clues: Clue[];
  initialWallNodes?: WallNode[];
  conferenceConfig?: CaseConferenceConfig;
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
      revealsLeadId?: string;
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

export interface CaseConferenceSubmission {
  primaryCulprit: string;
  mechanism: string;
  keyEvidenceIds: string[];
  unreliableWitnesses: string[];
  preventionStrategy: string;
  investigatorNotes: string;
}

export interface CaseState {
  caseId: string;
  discoveredEvidenceIds: string[];
  discoveredClueIds: string[];
  unlockedWitnessIds: string[];
  unlockedLeadIds: string[];
  completedLeadIds: string[];
  notebookNotes: string[];
  timelinePlacements: Record<string, number>; // eventId -> position index
  wallNodes: WallNode[];
  wallConnections: WallConnection[];
  witnessChats: Record<string, { sender: 'user' | 'witness'; text: string; timestamp: string; evidencePresented?: string }[]>;
  suspectClassifications?: Record<string, { classification: 'primary_suspect' | 'person_of_interest' | 'cleared'; reason: string }>;
  keyEvidenceTags?: Record<string, { isKey: boolean; justification?: string }>;
  userTheoryNote?: string;
  conferenceSubmission?: CaseConferenceSubmission;
  evaluationResult?: {
    score: number;
    grade: string;
    verdict: string;
    analysis: string;
    unlockedBadges?: string[];
  };
  isCompleted: boolean;
  score?: number;
  feedback?: string;
}
