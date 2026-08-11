import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft,
  Volume2, VolumeX, FastForward,
  Bookmark, CheckCircle, Feather, ShieldAlert, FileText, Compass, AlertTriangle,
  Search, MapPin, Mail, Newspaper, Pin, Eye, X, Info, CreditCard, Tag, Maximize2, Stamp
} from 'lucide-react';
import { Case, StoryScene } from '../types';
import LoadingScreen from './LoadingScreen';
import anime from '../lib/animeHelper';
import MysteryAudioControl from './MysteryAudioControl';
import { mysteryAudio } from '../utils/mysteryAudio';
import { getSceneSketchArt } from '../utils/suspectSketches';

interface StoryIntroViewProps {
  caseData: Case;
  onCompleteStory: () => void;
  onSkipStory: () => void;
  onAddNote?: (note: string) => void;
}

export default function StoryIntroView({ caseData, onCompleteStory, onSkipStory, onAddNote }: StoryIntroViewProps) {
  const story = caseData.storyIntro;
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [flippingFromIndex, setFlippingFromIndex] = useState(0);
  const [flippingToIndex, setFlippingToIndex] = useState(0);

  const [savedNote, setSavedNote] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCaseStamped, setIsCaseStamped] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  // Selected artifact modal inspection state
  const [selectedArtifact, setSelectedArtifact] = useState<{
    title: string;
    subtitle: string;
    shortSummary: string;
    detailedForensics: string;
    type: string;
  } | null>(null);

  // Web Audio Context for realistic procedural page-turn rustle sound
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Canvas ref for floating dust motes
  const dustCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Book element ref for camera float/drift effect
  const bookContainerRef = useRef<HTMLDivElement | null>(null);

  const rawScenes: StoryScene[] = story?.scenes ?? [
    {
      id: 'default_s1',
      sceneNumber: 1,
      title: 'Incident Briefing',
      locationName: caseData.location.name,
      mediaType: 'police_dispatch',
      speaker: {
        name: 'Chief Investigator Vance',
        role: 'Digital Safety Dispatch',
        mood: 'urgent'
      },
      narration: caseData.introduction,
      dialogueText: `Investigator, we need your expertise immediately on "${caseData.title}". Review the initial findings and proceed to the case board.`,
      keyTakeaway: 'Initial briefing logged.'
    }
  ];

  // Map scenes to story chapters with emotional arc tags
  const emotionalArcSteps = [
    { chapter: 'CHAPTER I', arcTag: 'The Humble Beginning', note: 'Every trap begins with an innocent dream...' },
    { chapter: 'CHAPTER II', arcTag: 'The Tempting Offer', note: 'Unusually high pay. Unverified credentials.' },
    { chapter: 'CHAPTER III', arcTag: 'The Illusion of Trust', note: 'Polished documents conceal dark intent.' },
    { chapter: 'CHAPTER IV', arcTag: 'The Subtle Red Flags', note: 'Off-platform communication requested!' },
    { chapter: 'CHAPTER V', arcTag: 'The Suspicion Grows', note: 'Pressure tactic: immediate upfront payment demanded.' },
    { chapter: 'CHAPTER VI', arcTag: 'The Critical Mistake', note: 'Credentials handed over. Trap sprung.' },
    { chapter: 'CHAPTER VII', arcTag: 'The Point of No Return', note: 'Communication cut. Identity compromised.' }
  ];

  const scenes = rawScenes.map((sc, idx) => {
    const arc = emotionalArcSteps[idx % emotionalArcSteps.length];
    return {
      ...sc,
      chapterTitle: arc.chapter,
      arcTag: arc.arcTag,
      marginAnnotation: arc.note
    };
  });

  const currentScene = scenes[currentSceneIndex];
  const isLastScene = currentSceneIndex === scenes.length - 1;

  // Auto-start mystery background music on entering Story Intro View
  useEffect(() => {
    mysteryAudio.setMode('story');
    mysteryAudio.start('story');

    const handleFirstInteraction = () => {
      mysteryAudio.setMode('story');
      mysteryAudio.start('story');
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      mysteryAudio.stop();
    };
  }, []);

  // Dust Motes Particle Animation
  useEffect(() => {
    const canvas = dustCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const currentOpacity = (Math.sin(p.pulse) * 0.3 + 0.5) * p.opacity;

        ctx.fillStyle = `rgba(255, 230, 180, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFlipping || isLaunching) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onSkipStory();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [currentSceneIndex, isLastScene, isFlipping, isLaunching]);

  useEffect(() => {
    setSavedNote(false);
  }, [currentSceneIndex]);

  // Procedural Web Audio Page Turn Sound Effect (Realistic Paper Rustle, Bend & Leather Thump)
  const triggerPageTurnSound = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const now = ctx.currentTime;

      // 1. Friction sweep / parchment paper drag noise
      const bufferSize = ctx.sampleRate * 0.4; // 400ms duration
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 0.8);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.2);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.4);
      filter.Q.value = 2.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.4);

      // 2. Leather spine contact thump sound
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);
      oscGain.gain.setValueAtTime(0.2, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);

    } catch (err) {
      // Audio fallback safeguard
    }
  };

  // Stamp Slam Audio Sound Effect
  const triggerStampSound = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') void ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.18);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (err) {
      // Ignore audio error
    }
  };

  const handleNext = () => {
    if (isFlipping || isLaunching) return;

    if (isLastScene) {
      // Final Page Case Opened Stamp & Transition
      triggerStampSound();
      setIsCaseStamped(true);
      setTimeout(() => {
        setIsLaunching(true);
      }, 1800);
      return;
    }

    const nextIndex = currentSceneIndex + 1;
    triggerPageTurnSound();
    setFlipDirection('next');
    setFlippingFromIndex(currentSceneIndex);
    setFlippingToIndex(nextIndex);
    setIsFlipping(true);

    // Backup safety timeout in case animation callback is interrupted
    setTimeout(() => {
      setCurrentSceneIndex(nextIndex);
      setIsFlipping(false);
    }, 580);
  };

  const handlePrev = () => {
    if (isFlipping || isLaunching || currentSceneIndex === 0) return;

    const prevIndex = currentSceneIndex - 1;
    triggerPageTurnSound();
    setFlipDirection('prev');
    setFlippingFromIndex(currentSceneIndex);
    setFlippingToIndex(prevIndex);
    setIsFlipping(true);

    // Backup safety timeout in case animation callback is interrupted
    setTimeout(() => {
      setCurrentSceneIndex(prevIndex);
      setIsFlipping(false);
    }, 580);
  };

  const handleSaveSceneNote = () => {
    if (onAddNote && currentScene.keyTakeaway) {
      triggerPageTurnSound();
      onAddNote(`Chapter ${currentSceneIndex + 1} - ${currentScene.title}: ${currentScene.keyTakeaway}`);
      setSavedNote(true);
    }
  };

  // Preload all scene images to ensure instant, glitch-free page transitions
  useEffect(() => {
    scenes.forEach((sc) => {
      const imgUrl = sc.speaker?.avatar ?? caseData.imageUrl;
      if (imgUrl) {
        const img = new Image();
        img.src = imgUrl;
      }
    });
  }, [caseData]);

  // Curated Story Artifact Data Generator
  const getCuratedArtifacts = (sceneIdx: number, scene: StoryScene) => {
    const idx = sceneIdx >= 0 ? sceneIdx : 0;

    if (caseData.id !== 'borderland-trap') {
      const location = (scene.locationName ?? caseData.location.name) || 'CRIME SCENE LOCATION';
      const dateTag = `${10 + idx * 2} OCT 2035 • 09:00 UTC`;
      const sceneSummaryText = (scene.narration ?? scene.dialogueText) || scene.keyTakeaway || scene.title;
      const cluesText = scene.keyTakeaway ?? sceneSummaryText;

      return {
        stampedDate: dateTag,
        stampedLocation: location.toUpperCase(),
        marginNote: scene.marginAnnotation ?? `INVESTIGATIVE NOTE: ${sceneSummaryText}`,
        sketchCaption: `Scene Sketch: ${scene.title} at ${location}. Key forensic evidence logged.`,
        mapLabel: caseData.title.substring(0, 18).toUpperCase(),
        mapSector: `Sector Grid 0${idx + 1}`,
        letterText: `Official Transcript from ${scene.title}: "${sceneSummaryText.substring(0, 120)}..."`,
        letterSender: `Forensic Field Operative`,
        newspaperTitle: `THE CYBER CHRONICLE`,
        newspaperSnippet: `Investigation Update: Forensic evidence recovered at ${location} confirms breach parameters.`,
        personalItemTitle: `EVIDENCE ITEM #${101 + idx}`,
        personalItemDetail: `${scene.title} • ${location}`,
        sketchArtifact: {
          title: `${scene.title} Forensic Sketch`,
          subtitle: `Scene Overview // Exhibit 0${idx + 1}-A`,
          shortSummary: `Forensic composite drawing of ${scene.title} at ${location}.`,
          detailedForensics: `Detailed Forensic Analysis: ${sceneSummaryText} Key findings: ${cluesText}`,
          type: 'sketch'
        },
        mapArtifact: {
          title: `${location} Tactical Blueprint`,
          subtitle: `Structural Map // Exhibit 0${idx + 1}-B`,
          shortSummary: `Tactical grid overlay for ${location}.`,
          detailedForensics: `Spatial Mapping: Ingress and egress routes recorded. Sector grid 0${idx + 1} secured.`,
          type: 'map'
        },
        letterArtifact: {
          title: `Recovered Document Transcript`,
          subtitle: `Evidence Log // Exhibit 0${idx + 1}-C`,
          shortSummary: `Decoded intelligence document related to ${scene.title}.`,
          detailedForensics: `Document Verification: ${sceneSummaryText}`,
          type: 'letter'
        },
        newsArtifact: {
          title: `Public Bulletin Press Clipping`,
          subtitle: `Media Report // Exhibit 0${idx + 1}-D`,
          shortSummary: `Press coverage regarding ${caseData.title}.`,
          detailedForensics: `Media Analysis: Corroborates timeline for ${scene.title}.`,
          type: 'newspaper'
        },
        itemArtifact: {
          title: `Sealed Evidence Tag #${101 + idx}`,
          subtitle: `Physical Evidence // Exhibit 0${idx + 1}-E`,
          shortSummary: `Physical evidence item recovered from ${location}.`,
          detailedForensics: `Chain of Custody: Handled by Cyber Forensics Officer. Hash verification passed.`,
          type: 'item'
        }
      };
    }

    if (idx === 0) {
      return {
        stampedDate: '12 OCT 2035 • 23:14 UTC',
        stampedLocation: scene.locationName ?? caseData.location.name,
        marginNote: 'MARGIN NOTE: High family medical debt created severe emotional vulnerability to unvetted offshore job offers.',
        sketchCaption: 'Subject Workstation: IDE open with React repositories. Clinic bill pile on left desk.',
        mapLabel: 'SINGAPORE SECTOR 02',
        mapSector: 'Tampines Grid B-4',
        letterText: 'Kaelen, please don’t skip dinner. The clinic added 2 extra double shifts for my knee surgery fund. Love, Mom.',
        letterSender: 'Handwritten on Lined Pad',
        newspaperTitle: 'THE STRAITS TIMES',
        newspaperSnippet: 'Elective Surgery Co-Pays Surge in 2035; Working Families Face Out-of-Pocket Care Costs.',
        personalItemTitle: 'STUDENT METRO PASS #8819',
        personalItemDetail: 'Tampines Station • Tapped 23:14 • Balance: $4.20',
        sketchArtifact: {
          title: 'Workstation Charcoal Sketch',
          subtitle: 'Scene Overview // Exhibit A-1',
          shortSummary: 'Charcoal sketch of Kaelen Miller’s desk with open code editor and medical bills.',
          detailedForensics: 'Forensic Scan: Screen logs show open-source React repositories and active job search queries for "immediate hire software lead". Medical invoice shows $14,200 pending for Eleanor Miller’s knee replacement.',
          type: 'sketch'
        },
        mapArtifact: {
          title: 'Tampines Residential Map',
          subtitle: 'Tactical Grid // Exhibit A-2',
          shortSummary: 'Hand-drawn map showing Kaelen’s residence and transit route to Tampines Station.',
          detailedForensics: 'Location Analysis: Tampines Sector 2, Apartment Block 402. Fiber internet line logs reveal midnight upload sessions to GitHub.',
          type: 'map'
        },
        letterArtifact: {
          title: 'Note from Eleanor (Mom)',
          subtitle: 'Personal Correspondence // Exhibit A-3',
          shortSummary: 'Torn note left on the kitchen table regarding clinic double shifts.',
          detailedForensics: 'Graphology Check: Genuine handwriting of Eleanor Miller. Confirms financial pressure driving Kaelen’s desperation.',
          type: 'letter'
        },
        newsArtifact: {
          title: 'Straits Times News Cutout',
          subtitle: 'Media Clipping // Exhibit A-4',
          shortSummary: 'Newspaper article on rising healthcare costs in Singapore.',
          detailedForensics: 'Context Analysis: Newspaper collected from kitchen counter. Highlighted section on co-pay increases.',
          type: 'newspaper'
        },
        itemArtifact: {
          title: 'Transit Metro Card',
          subtitle: 'Personal Artifact // Exhibit A-5',
          shortSummary: 'Kaelen’s worn student transit pass with RFID chip.',
          detailedForensics: 'RFID Extraction: Card tapped at Tampines Station at 23:14. Corroborates late-night return from freelance client meeting.',
          type: 'item'
        }
      };
    }

    if (idx === 1) {
      return {
        stampedDate: '14 OCT 2035 • 09:30 UTC',
        stampedLocation: 'AURA RECRUITMENT INBOX',
        marginNote: 'RED FLAG: Waiving technical interviews & offering 3x market salary is the #1 recruitment trap!',
        sketchCaption: 'Offer Presentation: Elena Vance presenting senior lead contract with immediate flight departure.',
        mapLabel: 'SIN -> AURA PRIVATE HUB',
        mapSector: 'South China Sea Perimeter',
        letterText: 'Dear Kaelen, We reviewed your React repos and waived coding rounds! $8,500/mo salary starting tomorrow. Flight ticket attached.',
        letterSender: 'Aura Global Talent Scouting',
        newspaperTitle: 'GLOBAL TECH JOURNAL',
        newspaperSnippet: 'Aura Global Solutions Expands Southeast Asia AI Footprint with $50M Offshore Campus.',
        personalItemTitle: 'AIRLINE BOARDING PASS',
        personalItemDetail: 'Flight AG-802 • First Class • Seat 02A • SIN to Aura Hub',
        sketchArtifact: {
          title: 'Recruitment Sketch',
          subtitle: 'Scene Overview // Exhibit B-1',
          shortSummary: 'Executive presentation of the $8,500/month Senior Web Lead offer.',
          detailedForensics: 'Analysis: High-pressure tactic requiring immediate departure on morning flight. Zero technical vetting conducted.',
          type: 'sketch'
        },
        mapArtifact: {
          title: 'Offshore Transit Flight Map',
          subtitle: 'Navigation Blueprint // Exhibit B-2',
          shortSummary: 'Flight trajectory from Singapore Changi into international waters.',
          detailedForensics: 'Trajectory Tracking: Flight AG-802 routed to an unregistered island airfield outside standard maritime jurisdiction.',
          type: 'map'
        },
        letterArtifact: {
          title: 'Unsolicited Executive Offer Letter',
          subtitle: 'Contract Evidence // Exhibit B-3',
          shortSummary: 'Official letterhead from Elena Vance with salary terms and flight itinerary.',
          detailedForensics: 'Document Verification: Digital signature matches known front company associated with offshore scam rings.',
          type: 'letter'
        },
        newsArtifact: {
          title: 'Tech Journal Article',
          subtitle: 'Media Clipping // Exhibit B-4',
          shortSummary: 'Article touting Aura Global’s rapid expansion and offshore recruitment drive.',
          detailedForensics: 'Media Forensics: Paid PR release published in shell tech outlet to build fake credibility.',
          type: 'newspaper'
        },
        itemArtifact: {
          title: 'First Class Boarding Pass',
          subtitle: 'Personal Artifact // Exhibit B-5',
          shortSummary: 'Printed boarding pass provided by recruiter for Flight AG-802.',
          detailedForensics: 'Barcode Scan: Ticket purchased via crypto tumbler wallet. Passenger name verified as Kaelen Miller.',
          type: 'item'
        }
      };
    }

    if (idx === 2) {
      return {
        stampedDate: '15 OCT 2035 • 18:00 UTC',
        stampedLocation: 'AURA OFFSHORE COMPOUND',
        marginNote: 'RED FLAG: Passport confiscation & mandatory phone seizure = Human trafficking & forced labor alert!',
        sketchCaption: 'Compound Entrance: Armed security checkpoints, perimeter fencing, and biometric door locks.',
        mapLabel: 'AURA ISLAND COMPOUND',
        mapSector: 'Level 3 / Sub-Level 4',
        letterText: 'Notice to All Staff: Personal phones must be deposited in Locker Room A. Leaving compound without escort is prohibited.',
        letterSender: 'Security Chief Commandant',
        newspaperTitle: 'SECURITY BULLETIN',
        newspaperSnippet: 'Notice: Facility operates under private island maritime charter. Unauthorized communications forbidden.',
        personalItemTitle: 'RESTRICTED RFID KEYCARD',
        personalItemDetail: 'Badge #4092 • Level 3 Access Only • Photo ID Attached',
        sketchArtifact: {
          title: 'Compound Perimeter Sketch',
          subtitle: 'Scene Overview // Exhibit C-1',
          shortSummary: 'Charcoal drawing of high-security fences and guards confiscating devices.',
          detailedForensics: 'Physical Security Scan: 2.5m anti-climb fencing, razor wire, and signal jammers active across 433MHz-5GHz.',
          type: 'sketch'
        },
        mapArtifact: {
          title: 'Facility Floor Blueprint',
          subtitle: 'Structural Map // Exhibit C-2',
          shortSummary: 'Architectural layout of the island facility showing locked server rooms.',
          detailedForensics: 'Blueprint Analysis: Emergency exits sealed from outside. Single ingress/egress point through main guardhouse.',
          type: 'map'
        },
        letterArtifact: {
          title: 'Torn Warning Note',
          subtitle: 'Smuggled Message // Exhibit C-3',
          shortSummary: 'Scrappy message found under desk drawer from a previous developer.',
          detailedForensics: 'Forensic Note: "They took my passport on arrival. Don’t sign the IP agreement." Confirms forced confinement.',
          type: 'letter'
        },
        newsArtifact: {
          title: 'Facility Internal Notice',
          subtitle: 'Notice Board // Exhibit C-4',
          shortSummary: 'Strict security protocol document posted in the cafeteria.',
          detailedForensics: 'Document Analysis: Penalties listed for "unauthorized external networking" include solitary confinement.',
          type: 'newspaper'
        },
        itemArtifact: {
          title: 'Aura RFID Badge',
          subtitle: 'Personal Artifact // Exhibit C-5',
          shortSummary: 'Confiscation tag and guest RFID badge issued to Kaelen.',
          detailedForensics: 'Chip Memory: Logs keycard swipe at 18:04 entering Sub-Level 3 developer floor.',
          type: 'item'
        }
      };
    }

    if (idx === 3) {
      return {
        stampedDate: '18 OCT 2035 • 02:45 UTC',
        stampedLocation: 'SUB-LEVEL 3 SCAM FLOOR',
        marginNote: 'OPERATIONAL FLAG: Developers forced to build deceptive crypto trading interfaces & romance scam bots.',
        sketchCaption: 'The Scam Floor: Row of workstations running automated scam scripts and fake investment dashboards.',
        mapLabel: 'NETWORK TOPOLOGY',
        mapSector: 'Proxy Nodes & VPN Tunnels',
        letterText: 'Scam Script Playbook: Step 1: Establish trust. Step 2: Show fake 500% profit. Step 3: Block withdrawal until tax fee paid.',
        letterSender: 'Operative Handler Manual',
        newspaperTitle: 'CYBER CRIME WATCH',
        newspaperSnippet: 'Global Pig Butchering Rings Steal $2.4 Billion Annually Using AI-Generated Trading Apps.',
        personalItemTitle: 'ENCRYPTED HARDWARE TOKEN',
        personalItemDetail: 'YubiKey #502 • Target Wallet Address Scribbled on Tape',
        sketchArtifact: {
          title: 'Scam Operation Room Sketch',
          subtitle: 'Scene Overview // Exhibit D-1',
          shortSummary: 'Charcoal drawing of developers operating forced scam software.',
          detailedForensics: 'Forensic Evidence: Monitors display fake trading platforms with rigged chart generators designed to trick victims.',
          type: 'sketch'
        },
        mapArtifact: {
          title: 'Global VPN Network Diagram',
          subtitle: 'Cyber Routing Map // Exhibit D-2',
          shortSummary: 'Routing map showing how scam traffic is bounced through proxy servers.',
          detailedForensics: 'Network Analysis: IPs masked through 12 proxy nodes in Zug, Panama, and Seychelles.',
          type: 'map'
        },
        letterArtifact: {
          title: 'Confiscated Scam Script Playbook',
          subtitle: 'Operational Manual // Exhibit D-3',
          shortSummary: 'Social engineering manual used to trick victims into fake investments.',
          detailedForensics: 'Psychological Analysis: Standard manipulation script detailing trust-building tactics and fake withdrawal holds.',
          type: 'letter'
        },
        newsArtifact: {
          title: 'Interpol Cyber Alert',
          subtitle: 'Public Bulletin // Exhibit D-4',
          shortSummary: 'Article warning of "Pig Butchering" investment fraud networks.',
          detailedForensics: 'Cross-Reference: Patterns match the exact frontend React code Kaelen was forced to write.',
          type: 'newspaper'
        },
        itemArtifact: {
          title: 'Encrypted YubiKey Token',
          subtitle: 'Personal Artifact // Exhibit D-5',
          shortSummary: 'Hardware key used to deploy fraudulent smart contract updates.',
          detailedForensics: 'Memory Dump: Contains master wallet address `0x71B...90A2` holding victim funds.',
          type: 'item'
        }
      };
    }

    // Fallback / Scene 4 (Raid & Rescue)
    return {
      stampedDate: '22 OCT 2035 • 03:14 UTC',
      stampedLocation: 'EVIDENCE LOCKER #04',
      marginNote: 'CASE RESOLUTION: Kaelen secretly embedded covert WebSocket telemetry in the code to guide police taskforce raid!',
      sketchCaption: 'Tactical Raid Scene: Cyber Taskforce breaching main server room and securing evidence drives.',
      mapLabel: 'TACTICAL ASSAULT GRID',
      mapSector: 'Server Farm Ingress Points',
      letterText: 'Secret SOS Payload: "If you read this, we are held at 4.281° N, 114.920° E. Server logs contain full admin keys. Help us."',
      letterSender: 'Covert WebSocket Packet Log',
      newspaperTitle: 'INTERNATIONAL HERALD',
      newspaperSnippet: 'Joint Interpol Raid Shuts Down Massive Offshore Tech Scam Compound; 120 Trafficked Developers Rescued.',
      personalItemTitle: 'POLICE EVIDENCE TAG #9901',
      personalItemDetail: 'Sealed Bag • Master SSD Hard Drive • Forensics Verified',
      sketchArtifact: {
        title: 'Tactical Breach Charcoal Sketch',
        subtitle: 'Scene Overview // Exhibit E-1',
        shortSummary: 'Charcoal drawing of cyber forensics squad securing server racks.',
        detailedForensics: 'Raid Log: Tactical team breached sub-level 3 at 03:14. All server logs preserved without wipe sequence.',
        type: 'sketch'
      },
      mapArtifact: {
        title: 'Tactical Raid Assault Map',
        subtitle: 'Police Operation Map // Exhibit E-2',
        shortSummary: 'Breach vector blueprint showing SWAT ingress through north stairwell.',
        detailedForensics: 'Operation Log: 03:10 Perimeter breach, 03:14 Server room secured, 03:22 Victims safely evacuated.',
        type: 'map'
      },
      letterArtifact: {
        title: 'Decoded Covert SOS Packet',
        subtitle: 'Digital Evidence // Exhibit E-3',
        shortSummary: 'Decoded distress signal injected by Kaelen into error reporting streams.',
        detailedForensics: 'Cryptographic Check: Injected payload contained precise GPS coordinates and server encryption keys.',
        type: 'letter'
      },
      newsArtifact: {
        title: 'Herald Front Page News',
        subtitle: 'Global Press Clipping // Exhibit E-4',
        shortSummary: 'Front page story on the international rescue operation and syndicate takedown.',
        detailedForensics: 'Press Release: Confirms rescue of Kaelen Miller and 119 other developers. Ring leaders extradited.',
        type: 'newspaper'
      },
      itemArtifact: {
        title: 'Sealed Evidence Bag #9901',
        subtitle: 'Court Evidence // Exhibit E-5',
        shortSummary: 'Official police evidence locker tag containing recovered SSD drives.',
        detailedForensics: 'Chain of Custody: Handled by Cyber Forensics Officer J. Vance. Hash match verified for trial.',
        type: 'item'
      }
    };
  };

  // Render Left Page with Police Composite Scene Sketch Artwork
  const renderLeftPage = (scene: StoryScene, pageNum: number, sceneIdx?: number) => {
    const activeIdx = sceneIdx ?? currentSceneIndex;
    const data = getCuratedArtifacts(activeIdx, scene);
    const sceneSketchArt = getSceneSketchArt(caseData.id, activeIdx);

    return (
      <div className="p-6 sm:p-8 md:p-9 border-b md:border-b-0 md:border-r border-[#bfa47e] flex flex-col justify-between relative bg-[#ebd8b7] text-[#2c1d11] shadow-[inset_-25px_0_35px_rgba(100,65,25,0.12)] space-y-4">
        
        {/* 📅 1. Stamped Date & Location Banner */}
        <div className="space-y-2 border-b-2 border-[#a88a62]/80 pb-2.5">
          <div className="flex items-center justify-between">
            <span className="font-['Cinzel'] text-xs font-black uppercase tracking-[0.2em] text-[#5c3e23]">
              EVIDENCE DOSSIER // PAGE 0{pageNum}
            </span>
            <span className="font-['Caveat'] text-base sm:text-lg font-bold text-[#8c3220] -rotate-1 tracking-wide">
              {scene.arcTag}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#dfcaa8]/90 p-2 sm:p-2.5 rounded-md border border-[#b89870] shadow-xs">
            <div className="flex items-center gap-2">
              <Stamp className="w-4 h-4 text-[#8c3220] shrink-0" />
              <span className="font-mono text-xs font-bold tracking-wider text-[#8c3220] uppercase">
                {data.stampedDate}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[#5c3e23] font-mono text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#8c3220] shrink-0" />
              <span>{data.stampedLocation}</span>
            </div>
          </div>
        </div>

        {/* 🎨 2. Forensic Scene Sketch Section (Matching Witness Sketch Format) */}
        <div className="space-y-2 my-auto">
          <div className="flex items-center justify-between px-1">
            <span className="font-sans font-extrabold text-xs uppercase text-[#5c3e23] tracking-widest flex items-center gap-1.5">
              <Search className="w-4 h-4 text-[#8c3220]" />
              FORENSIC CASE SCENE RECONSTRUCTION
            </span>
            <span className="font-mono text-xs text-[#8c3220] font-bold tracking-wide">
              [TAP TO ENLARGE SCENE]
            </span>
          </div>

          {/* Forensic Photo / Composite Sketch Container */}
          <div 
            onClick={() => {
              setSelectedArtifact(data.sketchArtifact);
            }}
            className="p-2.5 bg-[#17110c] border-2 border-[#a88254] rounded-lg shadow-md hover:border-[#8c3220] transition-all cursor-pointer group relative overflow-hidden flex flex-col items-center justify-center"
          >
            <div className="w-full aspect-[4/3] relative rounded overflow-hidden border border-amber-900/60 bg-black">
              <img 
                src={sceneSketchArt} 
                alt={scene.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                <span className="text-[9px] font-mono font-bold text-amber-200/90 bg-black/80 px-2 py-0.5 rounded uppercase border border-amber-500/30">
                  CRIME SCENE RECONSTRUCTION // EXHIBIT {activeIdx + 1}
                </span>
                <span className="p-1 rounded bg-amber-900/80 text-amber-100 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <span className="font-mono text-xs font-bold text-amber-200/90 uppercase tracking-wider block">
                {data.sketchCaption}
              </span>
            </div>
          </div>
        </div>

        {/* ✍️ 3. Handwritten Red Ink Margin Annotation */}
        <div className="bg-[#e5d3b3] border-l-4 border-[#8c3220] p-3 sm:p-3.5 rounded-r-md shadow-xs space-y-1">
          <div className="flex items-center gap-2">
            <Feather className="w-4 h-4 text-[#8c3220] shrink-0" />
            <span className="font-extrabold uppercase tracking-widest text-xs font-sans text-[#8c3220]">
              INVESTIGATOR'S MARGIN NOTE:
            </span>
          </div>
          <p className="font-['Caveat'] text-base sm:text-lg text-[#4a150b] leading-relaxed pl-6">
            “{data.marginNote}”
          </p>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#a88a62] flex items-center justify-between text-xs font-mono text-[#6e5033] tracking-wide">
          <span>CONFIDENTIAL CASE FILE</span>
          <span>VOL. IV &bull; SCENE SKETCH PACKET</span>
        </div>
      </div>
    );
  };

  const renderRightPage = (scene: StoryScene, pageNum: number, sceneIdx?: number) => {
    const activeIdx = sceneIdx !== undefined ? sceneIdx : currentSceneIndex;
    return (
      <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between relative bg-[#ebd8b7] text-[#2c1d11] shadow-[inset_30px_0_40px_rgba(100,65,25,0.12)]">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-[#a88a62] pb-2.5 mb-4">
          <span className="font-['Cinzel'] text-xs font-extrabold uppercase tracking-[0.2em] text-[#6e5033]">
            {scene.chapterTitle ?? `CHAPTER ${activeIdx + 1}`}
          </span>
          <span className="font-mono text-[11px] text-[#6e5033]">
            PAGE 0{pageNum}
          </span>
        </div>

        {/* Chapter Content */}
        <div className="my-auto space-y-4">
          {/* Chapter Separator */}
          <div className="text-center text-[#7a542b] font-serif text-sm tracking-widest opacity-80">
            ~ ⚜ ~
          </div>

          {/* Chapter Title */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-['Cinzel'] font-black text-[#22130a] tracking-tight leading-snug">
              {scene.title}
            </h2>
            <p className="font-serif italic text-xs text-[#593d22]">
              {story?.incidentTime ?? 'Autumn 2035'} &bull; {scene.locationName || caseData.location.name}
            </p>
          </div>

          {/* Narrative with Drop Cap */}
          {scene.narration && (
            <div className="space-y-3 pt-1">
              <p className="font-serif text-sm sm:text-base text-[#2c1d11] leading-relaxed text-justify">
                <span className="float-left text-4xl sm:text-5xl font-['Cinzel'] font-black text-[#663512] mr-2.5 leading-none mt-1">
                  {scene.narration.charAt(0)}
                </span>
                {scene.narration.slice(1)}
              </p>
            </div>
          )}

          {/* Character Dialogue Quote Box */}
          {scene.dialogueText && (
            <blockquote className="my-3 p-3.5 bg-[#dfccaa] border-l-4 border-[#7a542b] font-serif italic text-sm text-[#22130a] leading-relaxed rounded-r shadow-xs">
              “{scene.dialogueText}”
              <span className="block not-italic font-sans font-bold text-[11px] text-[#6e5033] uppercase tracking-wider mt-2">
                — {scene.speaker?.name ?? 'Witness'}, {scene.speaker?.role || 'Statement Log'}
              </span>
            </blockquote>
          )}

          {/* Red Flag Takeaway */}
          {scene.keyTakeaway && (
            <div className="p-3 bg-[#dac6a2] border border-[#b39b75] rounded-xs space-y-1 shadow-inner">
              <div className="flex items-center gap-1.5 text-[#8c3220] font-sans font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>CRITICAL TAKEAWAY / RED FLAG:</span>
              </div>
              <p className="font-serif text-xs text-[#2c1d11] leading-relaxed">
                {scene.keyTakeaway}
              </p>
            </div>
          )}
        </div>

        {/* Page Navigation Controls */}
        <div className="pt-3 border-t border-[#a88a62] flex items-center justify-between gap-3 font-serif text-xs">
          <button
            onClick={handlePrev}
            disabled={activeIdx === 0 || isFlipping || isLaunching}
            className="px-3.5 py-1.5 border border-[#7a5c3e] bg-[#dfcbab] text-[#2c1d11] font-sans font-bold hover:bg-[#2c1d11] hover:text-[#f3e8d3] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5 rounded-2xs shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Scene</span>
          </button>

          <div className="font-['Cinzel'] font-extrabold text-xs text-[#6e5033] uppercase tracking-wider text-center">
            [ {activeIdx + 1} / {scenes.length} ]
          </div>

          <button
            onClick={handleNext}
            disabled={isFlipping || isLaunching}
            className="px-4 py-2 border border-[#4a2e12] bg-gradient-to-r from-[#8c5722] to-[#d99134] text-slate-950 font-sans font-extrabold hover:brightness-110 transition-all cursor-pointer shadow-[0_4px_12px_rgba(140,87,34,0.4)] flex items-center gap-2 rounded-2xs"
          >
            <span>{activeIdx === scenes.length - 1 ? 'OPEN CASE BOARD' : 'Next Scene'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden select-none font-serif text-[#2B2118] bg-transparent flex flex-col justify-between items-center p-3 sm:p-6 md:p-8">
      
      {/* ATMOSPHERIC SKY VIGNETTE & LIGHT RAY OVERLAYS */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(15,23,42,0.45)_100%)] pointer-events-none z-0" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-[radial-gradient(ellipse_at_top,_rgba(255,215,130,0.28)_0%,_rgba(255,160,60,0.10)_45%,_transparent_80%)] pointer-events-none z-0 blur-3xl animate-pulse" />

      {/* FLOATING DUST & SKY ETHER PARTICLES CANVAS */}
      <canvas ref={dustCanvasRef} className="absolute inset-0 pointer-events-none z-10 opacity-60" />

      {/* TOP HUD HEADER BAR (Translucent Sky Floating Glass) */}
      <div className="max-w-6xl w-full flex items-center justify-between gap-4 p-2.5 px-5 rounded-2xl bg-slate-950/50 backdrop-blur-lg border border-amber-500/30 text-amber-100 shadow-xl relative z-20">
        
        {/* Book Title / Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shadow-xs">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-amber-200/80 block drop-shadow-xs">
              ACADEMIC ARCHIVES // CASE DOSSIER NO. {caseData.id.slice(0, 6).toUpperCase()}
            </span>
            <h1 className="text-sm sm:text-base font-['Cinzel'] font-extrabold uppercase tracking-wider text-amber-100 drop-shadow-sm">
              {caseData.title}
            </h1>
          </div>
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          
          {/* Mystery Background Music Control */}
          <MysteryAudioControl variant="story_intro" />

          {/* Page FX Audio Toggle */}
          <button
            onClick={() => { setIsMuted(!isMuted); }}
            className="px-3 py-1.5 border border-amber-500/30 bg-slate-900/60 hover:bg-slate-800/80 text-amber-200 transition-all cursor-pointer flex items-center gap-1.5 rounded-xl shadow-xs backdrop-blur-md"
            title={isMuted ? 'Unmute Page Flip Sound' : 'Mute Page Flip Sound'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
            <span className="hidden md:inline font-sans text-[11px] font-bold">{isMuted ? 'MUTED' : 'PAGE FX ON'}</span>
          </button>

          {/* Skip Prologue Button */}
          <button 
            onClick={onSkipStory}
            className="px-4 py-1.5 border border-amber-400/70 bg-gradient-to-r from-amber-600/90 via-amber-500/90 to-amber-400/90 text-slate-950 font-sans font-extrabold hover:brightness-110 transition-all cursor-pointer flex items-center gap-2 rounded-xl shadow-[0_4px_16px_rgba(245,158,11,0.35)]"
          >
            <span>SKIP PROLOGUE</span>
            <FastForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN OPEN ANTIQUE LEATHER STORYBOOK CONTAINER (Floating in Sky) */}
      <motion.div 
        ref={bookContainerRef}
        animate={{ y: [0, -12, 0], rotateX: [0, 1.2, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="max-w-6xl w-full my-auto relative z-20 [perspective:2400px]"
      >
        {/* Soft Cloud Ambient Haze Aura surrounding the floating book */}
        <div className="absolute -inset-12 bg-[radial-gradient(ellipse_at_center,_rgba(255,220,150,0.18)_0%,_rgba(180,220,255,0.10)_45%,_transparent_75%)] pointer-events-none blur-3xl -z-10" />

        {/* LEATHER COVER WRAPPER WITH STITCHING AND CORNER BRASS EMBOSS */}
        <div className="w-full bg-gradient-to-b from-[#3d2211] via-[#2c170b] to-[#1e0e06] rounded-2xl p-2.5 sm:p-4 shadow-[0_25px_80px_rgba(15,23,42,0.65),0_0_90px_rgba(255,185,100,0.18)] border border-[#7a4820]/70 relative">
          
          {/* Leather Edge Stitching */}
          <div className="absolute inset-1 sm:inset-2 border border-dashed border-[#a6743f]/40 rounded-xl pointer-events-none" />

          {/* Antique Brass Book Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#c2964a] rounded-tl-xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#c2964a] rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#c2964a] rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#c2964a] rounded-br-xl pointer-events-none" />

          {/* Stacked Paper Page Depth Effect (Bottom and Right Pages Thickness) */}
          <div className="absolute -bottom-2.5 left-6 right-6 h-2.5 bg-gradient-to-b from-[#8a704c] via-[#bfa67e] to-[#4a3a24] rounded-b-sm border-t border-[#3d2b17]" />
          <div className="absolute top-6 bottom-6 -right-2.5 w-2.5 bg-gradient-to-r from-[#8a704c] via-[#bfa67e] to-[#4a3a24] rounded-r-sm border-l border-[#3d2b17]" />

          {/* TWO-PAGE OPEN BOOK PARCHMENT CONTAINER */}
          <div className="w-full bg-[#ebd8b7] border border-[#bfa47e] rounded-sm shadow-[inset_0_0_60px_rgba(100,65,25,0.3)] relative grid grid-cols-1 md:grid-cols-2 min-h-[580px] sm:min-h-[640px] [transform-style:preserve-3d] [perspective:1800px]">
            
            {/* AGED PAPER TEXTURE & STAIN IMPERFECTIONS OVERLAY */}
            <div className="absolute inset-0 bg-[radial-gradient(#8c5a2b_1.2px,transparent_1.2px)] [background-size:22px_22px] opacity-[0.05] pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#8c5722]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#7a4816]/20 rounded-full blur-3xl pointer-events-none" />
            
            {/* Worn Water Stain / Age Spot Effect */}
            <div className="absolute top-12 left-1/3 w-36 h-36 bg-[#a3723b]/10 rounded-full blur-xl pointer-events-none" />

            {/* CENTER BOOK SPINE FRAYED SEAM & BINDING CREASE WITH SHADOWS */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 sm:w-14 bg-gradient-to-r from-transparent via-[#26150a]/45 to-transparent z-30 pointer-events-none border-x border-[#523318]/30">
              <div className="w-full h-full flex flex-col justify-between items-center py-4 opacity-50">
                <div className="w-1.5 h-1.5 rounded-full bg-[#26150a]" />
                <div className="w-0.5 h-full bg-[#26150a]/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#26150a]" />
              </div>
            </div>

            {/* STATIC LEFT PAGE */}
            {renderLeftPage(
              isFlipping
                ? (flipDirection === 'next' ? scenes[flippingFromIndex] : scenes[flippingToIndex])
                : currentScene,
              (isFlipping
                ? (flipDirection === 'next' ? flippingFromIndex : flippingToIndex)
                : currentSceneIndex) * 2 + 1
            )}

            {/* STATIC RIGHT PAGE */}
            {renderRightPage(
              isFlipping
                ? (flipDirection === 'next' ? scenes[flippingToIndex] : scenes[flippingFromIndex])
                : currentScene,
              (isFlipping
                ? (flipDirection === 'next' ? flippingToIndex : flippingFromIndex)
                : currentSceneIndex) * 2 + 2,
              isFlipping
                ? (flipDirection === 'next' ? flippingToIndex : flippingFromIndex)
                : currentSceneIndex
            )}

            {/* SMOOTH 3D FLIPPING PAGE LEAF ANIMATION OVERLAY */}
            {isFlipping && flipDirection === 'next' && (
              <motion.div
                key={`flip-next-${flippingFromIndex}`}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -180 }}
                transition={{ duration: 0.52, ease: [0.645, 0.045, 0.355, 1.000] }}
                onAnimationComplete={() => {
                  setCurrentSceneIndex(flippingToIndex);
                  setIsFlipping(false);
                }}
                style={{
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform'
                }}
                className="hidden md:block absolute top-0 bottom-0 right-0 w-1/2 z-40 bg-[#ebd8b7] border-l border-[#8f693e] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-r-xs pointer-events-none"
              >
                {/* FRONT SIDE OF FLIPPING PAGE (Old Right Page) */}
                <div 
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    WebkitBackfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d',
                    transformOrigin: '50% 50%'
                  }}
                  className="absolute inset-0 w-full h-full bg-[#ebd8b7] rounded-r-xs"
                >
                  {renderRightPage(scenes[flippingFromIndex], flippingFromIndex * 2 + 2, flippingFromIndex)}
                  
                  {/* Shadow Sweep across front turning leaf */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 0.52 }}
                    className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none"
                  />
                </div>

                {/* BACK SIDE OF FLIPPING PAGE (New Left Page facing left) */}
                <div 
                  style={{ 
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    transformStyle: 'preserve-3d',
                    transformOrigin: '50% 50%'
                  }}
                  className="absolute inset-0 w-full h-full bg-[#ebd8b7] rounded-l-xs"
                >
                  {renderLeftPage(scenes[flippingToIndex], flippingToIndex * 2 + 1)}

                  {/* Shadow Sweep across back turning leaf */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.6, 0.2, 0] }}
                    transition={{ duration: 0.52 }}
                    className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/20 to-transparent pointer-events-none"
                  />
                </div>
              </motion.div>
            )}

            {isFlipping && flipDirection === 'prev' && (
              <motion.div
                key={`flip-prev-${flippingFromIndex}`}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 180 }}
                transition={{ duration: 0.52, ease: [0.645, 0.045, 0.355, 1.000] }}
                onAnimationComplete={() => {
                  setCurrentSceneIndex(flippingToIndex);
                  setIsFlipping(false);
                }}
                style={{
                  transformOrigin: 'right center',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform'
                }}
                className="hidden md:block absolute top-0 bottom-0 left-0 w-1/2 z-40 bg-[#ebd8b7] border-r border-[#8f693e] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-l-xs pointer-events-none"
              >
                {/* FRONT SIDE OF FLIPPING PAGE (Old Left Page) */}
                <div 
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    WebkitBackfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d',
                    transformOrigin: '50% 50%'
                  }}
                  className="absolute inset-0 w-full h-full bg-[#ebd8b7] rounded-l-xs"
                >
                  {renderLeftPage(scenes[flippingFromIndex], flippingFromIndex * 2 + 1)}

                  {/* Shadow Sweep */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 0.52 }}
                    className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/20 to-transparent pointer-events-none"
                  />
                </div>

                {/* BACK SIDE OF FLIPPING PAGE (New Right Page facing right) */}
                <div 
                  style={{ 
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(-180deg)',
                    transformStyle: 'preserve-3d',
                    transformOrigin: '50% 50%'
                  }}
                  className="absolute inset-0 w-full h-full bg-[#ebd8b7] rounded-r-xs"
                >
                  {renderRightPage(scenes[flippingToIndex], flippingToIndex * 2 + 2, flippingToIndex)}

                  {/* Shadow Sweep */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.6, 0.2, 0] }}
                    transition={{ duration: 0.52 }}
                    className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none"
                  />
                </div>
              </motion.div>
            )}

            {/* FORENSIC ARTIFACT MAGNIFIER INSPECTOR MODAL */}
            <AnimatePresence>
              {selectedArtifact && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-[#1c130c] border-2 border-[#a88254] rounded-lg max-w-lg w-full p-6 text-[#ebd8b7] shadow-2xl relative space-y-4 font-serif"
                  >
                    <button
                      onClick={() => { setSelectedArtifact(null); }}
                      className="absolute top-4 right-4 p-1.5 rounded-full bg-[#2a1c12] hover:bg-[#3d291a] text-[#c9a677] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 border-b border-[#5c4228] pb-3">
                      <Search className="w-5 h-5 text-amber-500 shrink-0" />
                      <div>
                        <h3 className="font-['Cinzel'] font-bold text-lg text-amber-200 leading-none">
                          {selectedArtifact.title}
                        </h3>
                        <span className="font-mono text-xs text-amber-500/80 uppercase">
                          {selectedArtifact.subtitle}
                        </span>
                      </div>
                    </div>

                    {selectedArtifact.type === 'sketch' && (
                      <div className="bg-black p-2 rounded border border-amber-900/60 overflow-hidden flex justify-center">
                        <img 
                          src={getSceneSketchArt(caseData.id, currentSceneIndex)} 
                          alt={selectedArtifact.title}
                          referrerPolicy="no-referrer"
                          className="max-h-60 object-contain rounded" 
                        />
                      </div>
                    )}

                    <div className="bg-[#2b1c11] p-3.5 rounded border border-[#6b4e31] space-y-2">
                      <span className="font-sans font-bold text-xs uppercase tracking-wider text-amber-400 block">
                        SUMMARY FINDING:
                      </span>
                      <p className="text-sm leading-relaxed text-[#dfcbaf]">
                        {selectedArtifact.shortSummary}
                      </p>
                    </div>

                    <div className="bg-[#150d08] p-3.5 rounded border border-rose-900/60 space-y-2">
                      <span className="font-sans font-bold text-xs uppercase tracking-wider text-rose-400 block flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        FORENSIC ANALYSIS &amp; EVIDENCE:
                      </span>
                      <p className="font-mono text-xs text-rose-200/90 leading-relaxed">
                        {selectedArtifact.detailedForensics}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-[#4d3621] text-xs font-mono text-[#a38059]">
                      <span>STATUS: VERIFIED EVIDENCE</span>
                      <button
                        onClick={() => setSelectedArtifact(null)}
                        className="px-4 py-1.5 bg-amber-800/80 hover:bg-amber-700 text-amber-100 font-sans font-bold rounded text-xs transition-colors"
                      >
                        CLOSE INSPECTOR
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* CASE OPENED STAMP EFFECT ON FINAL PAGE */}
            {isCaseStamped && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                <motion.div 
                  initial={{ scale: 3, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 1, rotate: -12 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="p-6 border-4 border-rose-800 bg-rose-950/85 text-rose-200 rounded-lg shadow-2xl backdrop-blur-xs text-center space-y-1 transform -rotate-12 border-dashed"
                >
                  <span className="font-['Cinzel'] text-3xl font-black tracking-widest text-rose-300 block">
                    CASE OFFICIALLY OPENED
                  </span>
                  <span className="font-mono text-xs text-rose-200 block uppercase tracking-widest">
                    INVESTIGATION INITIATED // ENTRY GRANTED
                  </span>
                </motion.div>
              </div>
            )}

          </div>

        </div>

      </motion.div>

      {/* LAUNCHING OVERLAY */}
      <AnimatePresence>
        {isLaunching && (
          <LoadingScreen isDataReady={true} onComplete={onCompleteStory} />
        )}
      </AnimatePresence>

    </div>
  );
}
