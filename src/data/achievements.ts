import { Achievement } from '../types';

export const ACADEMY_HONOR_DECORATIONS: Achievement[] = [
  {
    id: 'badge_first_contact',
    title: 'First Contact',
    description: 'Initiated your first forensic investigation dossier and deployed to an active cyber crime scene.',
    category: 'Directives',
    iconName: 'Compass',
    isUnlocked: false,
  },
  {
    id: 'badge_border_promise',
    title: 'Borderland Syndicate Breaker',
    description: 'Dismantled the offshore human trafficking & fake recruitment scam ring in "The Promise Beyond the Border".',
    category: 'Directives',
    iconName: 'ShieldAlert',
    isUnlocked: false,
  },
  {
    id: 'badge_echoes_static',
    title: 'Acoustic Neural Vanguard',
    description: 'Unmasked the synthetic deepfake voice clone & intercepted the $4.2M wire fraud in "Echoes in the Static".',
    category: 'Directives',
    iconName: 'Cpu',
    isUnlocked: false,
  },
  {
    id: 'badge_ghost_ledger',
    title: 'Ledger Vault Sentinel',
    description: 'Neutralized the zero-day crypto vault breach & recovered the cold storage cipher in "The Ghost in the Ledger".',
    category: 'Directives',
    iconName: 'Key',
    isUnlocked: false,
  },
  {
    id: 'badge_grandmaster',
    title: 'Academy Grandmaster Laureate',
    description: 'Successfully cracked and resolved all primary Cyber Detective Academy investigative case dossiers.',
    category: 'Honours',
    iconName: 'Award',
    isUnlocked: false,
  },
  {
    id: 'badge_flawless_verdict',
    title: 'Flawless Verdict Distinction',
    description: 'Delivered an exemplary Case Conference Report achieving a 90%+ forensic conviction rating.',
    category: 'Honours',
    iconName: 'Star',
    isUnlocked: false,
  },
  {
    id: 'badge_pinboard_tactician',
    title: 'Neural Pinboard Tactician',
    description: 'Mapped intricate investigative connections between clues, suspects, and leads on the Case Wall.',
    category: 'Forensics',
    iconName: 'GitCommit',
    isUnlocked: false,
  },
  {
    id: 'badge_chrono_architect',
    title: 'Chrono-Forensic Architect',
    description: 'Reconstructed critical crime timestamps and chronological evidence sequence on the Timeline Wall.',
    category: 'Forensics',
    iconName: 'Clock',
    isUnlocked: false,
  },
  {
    id: 'badge_polygraph_master',
    title: 'Polygraph Virtuoso',
    description: 'Conducted cross-examinations, extracted hidden testimony, and profiled suspects in the Interrogation Terminal.',
    category: 'Forensics',
    iconName: 'MessageSquareCode',
    isUnlocked: false,
  },
  {
    id: 'badge_evidence_analyst',
    title: 'Deep Trace Examiner',
    description: 'Analyzed source credibility, emotional manipulation cues, and cryptographic hashes in the Evidence Vault.',
    category: 'Forensics',
    iconName: 'Fingerprint',
    isUnlocked: false,
  },
  {
    id: 'badge_mil_master',
    title: 'Cyber-Defense Pioneer',
    description: 'Attained Senior Detective rank (350+ MIL XP) through media literacy and investigative excellence.',
    category: 'Honours',
    iconName: 'ShieldCheck',
    isUnlocked: false,
  },
  {
    id: 'badge_creator',
    title: 'Quantum Directive Architect',
    description: 'Synthesized an autonomous custom AI investigation case lab in the Academy Library.',
    category: 'Creation',
    iconName: 'Sparkles',
    isUnlocked: false,
  }
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = ACADEMY_HONOR_DECORATIONS;

/**
 * Merge existing user achievements with canonical list to ensure newly introduced badges
 * are included while preserving previously earned unlock states and timestamps.
 */
export function mergeAchievements(savedAchievements?: { id: string; isUnlocked?: boolean; unlockedAt?: string }[]): Achievement[] {
  if (!Array.isArray(savedAchievements) || savedAchievements.length === 0) {
    return ACADEMY_HONOR_DECORATIONS.map(a => ({ ...a }));
  }

  const map = new Map<string, { isUnlocked?: boolean; unlockedAt?: string }>();
  savedAchievements.forEach(a => {
    if (a && a.id) {
      map.set(a.id, a);
    }
  });

  return ACADEMY_HONOR_DECORATIONS.map(canonical => {
    const saved = map.get(canonical.id);
    if (saved) {
      return {
        ...canonical,
        isUnlocked: Boolean(saved.isUnlocked),
        unlockedAt: saved.unlockedAt || (saved.isUnlocked ? new Date().toISOString().split('T')[0] : undefined)
      };
    }
    return { ...canonical };
  });
}

/**
 * Dispatch an achievement unlock event globally across the app.
 */
export function dispatchHonorUnlock(badgeId: string, customMessage?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('unlock-achievement', {
        detail: { badgeId, customMessage }
      })
    );
  }
}
