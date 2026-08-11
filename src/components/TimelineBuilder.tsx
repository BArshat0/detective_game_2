import React, { useState, useRef, useEffect, useMemo } from 'react';
import anime from '../lib/animeHelper';
import { 
  FileClock, HelpCircle, CheckCircle2, 
  ShieldCheck, ArrowUp, ArrowDown, Pin, ZoomIn, ZoomOut, 
  Maximize2, Lock, Trash2, MessageSquare, AlertTriangle,
  Ticket, Mail, Newspaper, FileText,
  Edit3, Link2, RotateCcw, Layers, HelpCircle as QuestionIcon,
  Plus, Lightbulb
} from 'lucide-react';
import { Case, TimelineEvent } from '../types';
import { safeGet, safeSet } from '../lib/safeLookup';

interface TimelineBuilderProps {
  caseData: Case;
  discoveredEvidenceIds?: string[];
  discoveredClueIds?: string[];
  unlockedLeadIds?: string[];
  completedLeadIds?: string[];
  unlockedWitnessIds?: string[];
  placements: Record<string, number>; // eventId -> index in sequence (0-indexed)
  onUpdatePlacements: (newPlacements: Record<string, number>) => void;
  onCompleteTimeline?: () => void;
}

type CardStyle = 'polaroid' | 'ticket' | 'email' | 'newspaper' | 'sticky' | 'report' | 'receipt';

export default function TimelineBuilder({ 
  caseData,
  discoveredEvidenceIds = [],
  discoveredClueIds = [],
  unlockedLeadIds = [],
  completedLeadIds = [],
  unlockedWitnessIds = [],
  placements, 
  onUpdatePlacements, 
  onCompleteTimeline 
}: TimelineBuilderProps) {
  const [viewMode, setViewMode] = useState<'wall' | 'log'>('wall');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Custom user annotations & card states (rotations, highlights, uncertain flags)
  const [annotations, setAnnotations] = useState<Record<string, string>>({});
  const [editingAnnotationId, setEditingAnnotationId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');
  const [rotations, setRotations] = useState<Record<string, number>>({});
  const [uncertainEvents, setUncertainEvents] = useState<Record<string, boolean>>({});
  const [highlightedEvents, setHighlightedEvents] = useState<Record<string, boolean>>({});
  const [visibleTimelineHintIds, setVisibleTimelineHintIds] = useState<Record<string, boolean>>({});

  // Drag and Drop state
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);

  const [verificationResult, setVerificationResult] = useState<{ 
    isCorrect: boolean; 
    score: number; 
    msg: string;
    hints?: string[];
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);

  // All events defined in case timeline
  const allTimelineEvents = useMemo(() => (
    Array.isArray(caseData?.timeline)
      ? caseData.timeline.filter((event): event is TimelineEvent => Boolean(event?.id))
      : []
  ), [caseData?.timeline]);

  // Determine which events are "unlocked" / "known" vs "unknown / missing information"
  const knownEventsSet = useMemo(() => {
    const known = new Set<string>();
    const discoveredSet = new Set([...(discoveredEvidenceIds || []), ...(discoveredClueIds || [])]);
    const completedLeadsSet = new Set(completedLeadIds || []);
    const unlockedLeadsSet = new Set(unlockedLeadIds || []);
    const unlockedWitnessesSet = new Set(unlockedWitnessIds || []);

    const totalDiscovered = discoveredSet.size;
    const totalCompletedLeads = completedLeadsSet.size;
    const totalUnlockedLeads = unlockedLeadsSet.size;
    const totalUnlockedWitnesses = unlockedWitnessesSet.size;

    allTimelineEvents.forEach((ev, idx) => {
      // Direct explicit unlocks
      if (ev.isInitiallyKnown) {
        known.add(ev.id);
        return;
      }
      if (placements[ev.id] !== undefined) {
        known.add(ev.id);
        return;
      }
      if (ev.linkedEvidenceId && discoveredSet.has(ev.linkedEvidenceId)) {
        known.add(ev.id);
        return;
      }
      if (ev.linkedLeadId && (completedLeadsSet.has(ev.linkedLeadId) || unlockedLeadsSet.has(ev.linkedLeadId))) {
        known.add(ev.id);
        return;
      }

      // Dynamic investigation progress unlocking
      if (idx <= 1) {
        known.add(ev.id);
      } else if (idx === 2) {
        if (totalCompletedLeads >= 1 || totalDiscovered >= 2 || totalUnlockedWitnesses >= 1 || totalUnlockedLeads >= 2) {
          known.add(ev.id);
        }
      } else if (idx === 3) {
        if (totalCompletedLeads >= 1 || totalDiscovered >= 3 || (totalCompletedLeads + totalDiscovered) >= 3 || totalUnlockedWitnesses >= 1) {
          known.add(ev.id);
        }
      } else {
        if (totalCompletedLeads >= (idx - 2) || totalDiscovered >= idx) {
          known.add(ev.id);
        }
      }
    });

    return known;
  }, [allTimelineEvents, discoveredEvidenceIds, discoveredClueIds, unlockedLeadIds, completedLeadIds, unlockedWitnessIds, placements]);

  // Sanitize placements to avoid corrupted keys or gap indices
  const { activePlacements, containsStaleKeys } = useMemo(() => {
    const validEventIds = new Set(allTimelineEvents.map(event => event.id));
    const rawEntries = Object.entries(placements ?? {});
    let hasStale = false;

    const validEntries = rawEntries.filter(([id, pos]) => {
      const isValid = validEventIds.has(id) && typeof pos === 'number' && Number.isFinite(pos);
      if (!isValid) hasStale = true;
      return isValid;
    });

    validEntries.sort(([, a], [, b]) => (a as number) - (b as number));

    const sanitized: Record<string, number> = {};
    validEntries.forEach(([id], index) => {
      sanitized[id] = index;
      if (rawEntries.find(([k]) => k === id)?.[1] !== index) {
        hasStale = true;
      }
    });

    return { activePlacements: sanitized, containsStaleKeys: hasStale };
  }, [placements, allTimelineEvents]);

  // Sync sanitized state if corrupted keys detected
  useEffect(() => {
    if (containsStaleKeys) {
      onUpdatePlacements(activePlacements);
    }
  }, [containsStaleKeys, activePlacements, onUpdatePlacements]);

  // Draft sequence derives directly from sanitized activePlacements
  const draftSequence: TimelineEvent[] = useMemo(() => {
    return Object.entries(activePlacements)
      .sort(([, a], [, b]) => a - b)
      .map(([id]) => allTimelineEvents.find(e => e.id === id))
      .filter((e): e is TimelineEvent => Boolean(e));
  }, [activePlacements, allTimelineEvents]);

  // Known unplaced events pool
  const unplacedKnownEvents = useMemo(() => {
    const placedSet = new Set(draftSequence.map(e => e.id));
    return allTimelineEvents.filter(ev => knownEventsSet.has(ev.id) && !placedSet.has(ev.id));
  }, [allTimelineEvents, knownEventsSet, draftSequence]);

  // Locked unknown events
  const unknownEvents = useMemo(() => {
    return allTimelineEvents.filter(ev => !knownEventsSet.has(ev.id));
  }, [allTimelineEvents, knownEventsSet]);

  // Card Archetype Helper
  const getCardArchetype = (ev: TimelineEvent, index: number): CardStyle => {
    const desc = ev.description.toLowerCase();
    if (desc.includes('ticket') || desc.includes('bus') || desc.includes('flight') || desc.includes('train')) return 'ticket';
    if (desc.includes('email') || desc.includes('message') || desc.includes('chat') || desc.includes('log')) return 'email';
    if (desc.includes('news') || desc.includes('article') || desc.includes('press') || desc.includes('paper')) return 'newspaper';
    if (desc.includes('report') || desc.includes('police') || desc.includes('forensic') || desc.includes('official')) return 'report';
    if (desc.includes('payment') || desc.includes('money') || desc.includes('bank') || desc.includes('receipt') || desc.includes('crypto')) return 'receipt';
    if (index % 3 === 0) return 'polaroid';
    return 'sticky';
  };

  const getCardImage = (ev: TimelineEvent, type: CardStyle): string | null => {
    if (type === 'polaroid') {
      const pool = [
        'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80'
      ];
      let charSum = 0;
      for (let i = 0; i < ev.id.length; i++) charSum += ev.id.charCodeAt(i);
      return pool[charSum % pool.length];
    }
    return null;
  };

  // Subtle rotation for cards on wall (kept near 0 to ensure 100% crisp readability & zero text clipping)
  const getCardRotation = (id: string, defaultIdx: number) => {
    if (rotations[id] !== undefined) return rotations[id];
    return 0; // Completely straight for clean layout
  };

  // Pan controls
  const handleMouseDownPan = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('textarea') || target.closest('.interactive-card')) return;

    setIsPanning(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMovePan = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUpPan = () => {
    setIsPanning(false);
  };

  // Pin event card into sequence
  const handlePlaceEvent = (eventId: string, targetSlotIndex?: number) => {
    let nextPlacements: Record<string, number>;
    if (targetSlotIndex !== undefined) {
      nextPlacements = safeSet(activePlacements, eventId, targetSlotIndex);
    } else {
      const nextIndex = draftSequence.length;
      nextPlacements = safeSet(activePlacements, eventId, nextIndex);
    }

    onUpdatePlacements(nextPlacements);

    setTimeout(() => {
      anime({
        targets: `#wall-card-${eventId}`,
        scale: [0.92, 1.03, 1],
        duration: 400,
        easing: 'easeOutQuad'
      });
      anime({
        targets: `#pin-head-${eventId}`,
        scale: [0.4, 1.3, 1],
        duration: 350,
        easing: 'easeOutBack'
      });
    }, 50);

    window.dispatchEvent(new CustomEvent('mil-xp-earned', { 
      detail: { xp: 35, msg: 'Incident Pinned to Reconstruction Wall' } 
    }));
  };

  const handleMoveEvent = (eventId: string, direction: 'up' | 'down') => {
    const currentIndex = safeGet(activePlacements, eventId);
    if (currentIndex === undefined) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= draftSequence.length) return;

    const otherEntry = Object.entries(activePlacements).find(([, pos]) => pos === targetIndex);
    if (!otherEntry) return;

    const otherEventId = otherEntry[0];
    const updated = {
      ...activePlacements,
      [eventId]: targetIndex,
      [otherEventId]: currentIndex
    };

    onUpdatePlacements(updated);
  };

  const handleRemoveEvent = (eventId: string) => {
    const removedIndex = safeGet(activePlacements, eventId) ?? 0;
    let newPlacements: Record<string, number> = {};
    
    Object.entries(activePlacements).forEach(([id, idx]) => {
      if (id !== eventId) {
        if (idx > removedIndex) {
          newPlacements = safeSet(newPlacements, id, idx - 1);
        } else {
          newPlacements = safeSet(newPlacements, id, idx);
        }
      }
    });

    onUpdatePlacements(newPlacements);
  };

  const handleRotateCard = (eventId: string) => {
    setRotations(prev => {
      const current = prev[eventId] || 0;
      const next = current >= 4 ? -4 : current + 2;
      return { ...prev, [eventId]: next };
    });
  };

  const handleToggleUncertain = (eventId: string) => {
    setUncertainEvents(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const handleToggleHighlight = (eventId: string) => {
    setHighlightedEvents(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const handleSaveAnnotation = (eventId: string) => {
    if (!tempNoteText.trim()) {
      const copy = { ...annotations };
      delete copy[eventId];
      setAnnotations(copy);
    } else {
      setAnnotations(prev => ({ ...prev, [eventId]: tempNoteText.trim() }));
    }
    setEditingAnnotationId(null);
    setTempNoteText('');
  };

  // Verification Engine
  const handleVerifySequence = () => {
    if (draftSequence.length < allTimelineEvents.length) {
      setVerificationResult({
        isCorrect: false,
        score: Math.round((draftSequence.length / allTimelineEvents.length) * 50),
        msg: `Reconstruction Incomplete: You have pinned ${draftSequence.length} of ${allTimelineEvents.length} required incidents to the Case Reconstruction Wall.`,
        hints: [
          `Inspect unlocked leads or witness statements to discover missing incident logs.`,
          `Place all ${allTimelineEvents.length} events on the wall before finalizing verification.`
        ]
      });
      return;
    }

    let correctCount = 0;
    const incorrectIndices: number[] = [];

    draftSequence.forEach((ev, idx) => {
      if (ev.orderIndex === idx + 1) {
        correctCount++;
      } else {
        incorrectIndices.push(idx + 1);
      }
    });

    const isAllCorrect = correctCount === allTimelineEvents.length;
    const score = isAllCorrect ? 100 : Math.round((correctCount / allTimelineEvents.length) * 100);

    anime({
      targets: '.red-string-line',
      stroke: isAllCorrect ? '#10b981' : '#f59e0b',
      strokeWidth: [2, 5, 3],
      duration: 800,
      easing: 'easeInOutQuad'
    });

    const generateDetectiveHint = (): string[] => {
      const hintsArr: string[] = [];
      if (incorrectIndices.length > 0) {
        const firstErrorIdx = incorrectIndices[0];
        const misplacedEv = draftSequence[firstErrorIdx - 1];
        hintsArr.push(`Position #${firstErrorIdx} ("${misplacedEv.description.substring(0, 40)}...") appears misplaced chronologically.`);
        hintsArr.push(`Review the timestamp or evidence reference attached to EV log #${firstErrorIdx}.`);
      }
      return hintsArr;
    };

    setVerificationResult({
      isCorrect: isAllCorrect,
      score,
      msg: isAllCorrect 
        ? 'PERFECT CASE RECONSTRUCTION! Every single incident log has been placed in exact chronological sequence. The timeline proves premeditation and criminal intent beyond doubt.'
        : `Timeline Discrepancy: ${correctCount} of ${allTimelineEvents.length} incident logs are correctly sequenced. Examine the red string links for hints.`,
      hints: isAllCorrect ? undefined : generateDetectiveHint()
    });

    if (isAllCorrect) {
      if (onCompleteTimeline) onCompleteTimeline();
      window.dispatchEvent(new CustomEvent('mil-xp-earned', {
        detail: { xp: 150, msg: 'Master Detective: Case Reconstruction Complete!' }
      }));
    }
  };

  const handleClear = () => {
    onUpdatePlacements({});
    setVerificationResult(null);
  };

  const getTimeTag = (ev: TimelineEvent) => {
    if (!ev.time || ev.time.includes('UNKNOWN')) {
      return '⏳ RELATIVE TIME: [ UNKNOWN / MISSING LOG - Discover via Evidence ]';
    }
    
    // Map raw times or preserve relative descriptors
    let relative = ev.time;
    if (ev.time.includes('08:15') || ev.time.includes('Morning')) relative = '🌅 Early Morning (Before Initial Contact)';
    else if (ev.time.includes('02:15') || ev.time.includes('Afternoon')) relative = '☀️ Midday (Unsolicited Recruitment Offer)';
    else if (ev.time.includes('Night') || ev.time.includes('23:')) relative = '🌙 Late Evening (Urgent Travel Instructions)';
    else if (ev.time.includes('36 Hours') || ev.time.includes('Later')) relative = '⌛ 36 Hours Post-Arrival (Coerced Voice Call)';
    
    const sourceTag = ev.linkedEvidenceId 
      ? ' [🔒 CONFIRMED DIGITAL LOG]' 
      : ' [⚠️ UNVERIFIED WITNESS CLAIM]';

    return `RELATIVE TIME: ${relative}${sourceTag}`;
  };

  const getEvidenceLinkDescription = (ev1: TimelineEvent, ev2: TimelineEvent) => {
    return `Sequence Link (#${ev1.orderIndex} ➔ #${ev2.orderIndex}): ${ev1.linkedEvidenceId ? `Evidence [${ev1.linkedEvidenceId}]` : 'Witness Statement'} links "${ev1.time}" directly to "${ev2.time}".`;
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData('text/plain', eventId);
    setDraggedEventId(eventId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain') || draggedEventId;
    if (eventId) {
      handlePlaceEvent(eventId, targetIndex);
    }
    setDraggedEventId(null);
  };

  return (
    <div 
      id="case-reconstruction-wall-container" 
      className="flex flex-col h-full rounded-[28px] border-4 border-[#3d2712] bg-[#1a130c] text-amber-50 shadow-2xl overflow-hidden relative"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(35, 23, 13, 0.94), rgba(12, 8, 4, 0.99)),
          url("https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=80")
        `,
        backgroundSize: 'cover, 400px 400px'
      }}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b-2 border-[#4d3218] bg-black/80 backdrop-blur-md z-20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
            <Layers className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-serif font-extrabold text-amber-100 uppercase tracking-wide flex items-center gap-2">
              Case Reconstruction Wall
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/50 font-bold uppercase tracking-wider">
                INTERACTIVE PUZZLE
              </span>
            </h3>
            <p className="text-xs text-amber-200/70 font-mono mt-0.5">
              Rebuild the sequence of events. Pin collected evidence cards onto chronological slots.
            </p>
          </div>
        </div>

        {/* Action Controls & Metrics */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-amber-950/70 border border-amber-900/60 rounded-xl text-xs font-mono">
            <span className="text-amber-300 font-bold">
              PINNED: <span className="text-amber-100">{draftSequence.length} / {allTimelineEvents.length}</span>
            </span>
            <span className="text-amber-600">|</span>
            <span className="text-amber-300 font-bold">
              UNLOCKED LEADS: <span className="text-emerald-400">{knownEventsSet.size}</span>
            </span>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900/90 border border-amber-900/50 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setViewMode('wall')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                viewMode === 'wall' ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Pin className="h-3.5 w-3.5" /> Reconstruction Board
            </button>
            <button
              onClick={() => setViewMode('log')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                viewMode === 'log' ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileClock className="h-3.5 w-3.5" /> Structured List
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-slate-900/90 border border-amber-900/50 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
              className="p-1.5 text-amber-200/70 hover:text-white cursor-pointer"
              title="Zoom Out Wall"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 text-[10px] text-amber-400 font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.2, prev + 0.1))}
              className="p-1.5 text-amber-200/70 hover:text-white cursor-pointer"
              title="Zoom In Wall"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
              className="p-1.5 text-amber-200/70 hover:text-amber-400 cursor-pointer ml-1"
              title="Reset View"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {draftSequence.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 text-xs font-mono font-bold text-amber-300 bg-black/60 border border-amber-900/60 px-3 py-1.5 rounded-xl hover:bg-amber-950/80 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>RESET</span>
            </button>
          )}

          <button
            onClick={handleVerifySequence}
            className="btn-primary py-1.5 px-4 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>VERIFY RECONSTRUCTION</span>
          </button>
        </div>
      </div>

      {/* Verification Feedback Banner */}
      {verificationResult && (
        <div className={`m-4 p-4 rounded-2xl border text-xs font-mono shadow-2xl animate-fade-in z-20 ${
          verificationResult.isCorrect
            ? 'bg-emerald-950/95 border-emerald-500/80 text-emerald-100'
            : 'bg-amber-950/95 border-amber-500/80 text-amber-100'
        }`}>
          <div className="flex items-center justify-between font-bold uppercase mb-1">
            <span className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-5 w-5 text-emerald-400" /> Case Reconstruction Score: {verificationResult.score}/100
            </span>
            <button onClick={() => setVerificationResult(null)} className="text-[10px] underline cursor-pointer hover:text-white">Close</button>
          </div>
          <p className="leading-relaxed font-serif text-sm">{verificationResult.msg}</p>

          {verificationResult.hints && verificationResult.hints.length > 0 && (
            <div className="mt-3 pt-2 border-t border-amber-500/30 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Detective Clue / Hint:
              </span>
              {verificationResult.hints.map((hint, hIdx) => (
                <p key={hIdx} className="text-xs text-amber-200/90 pl-4 font-mono">
                  • {hint}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Surface */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDownPan}
        onMouseMove={handleMouseMovePan}
        onMouseUp={handleMouseUpPan}
        onMouseLeave={handleMouseUpPan}
      >
        <div
          ref={wallRef}
          className="w-full h-full p-4 sm:p-6 transition-transform duration-100 origin-top-left"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
          }}
        >
          {viewMode === 'wall' ? (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[620px]">
              
              {/* Left Side: Unsequenced Evidence Desk Tray (5 Cols in XL) */}
              <div className="xl:col-span-5 bg-black/85 border-2 border-[#4d3218] rounded-3xl p-4 flex flex-col h-full shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-amber-900/60 pb-3 mb-3">
                  <h4 className="text-xs font-mono font-bold uppercase text-amber-200 tracking-wider flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-amber-400" />
                    Unsequenced Incident Cards
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                    {unplacedKnownEvents.length} Available
                  </span>
                </div>

                {/* Unplaced Cards List - Spacious & Clean without overlapping */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 max-h-[620px]">
                  {unplacedKnownEvents.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-amber-900/40 rounded-2xl text-amber-200/50 font-mono text-xs my-auto">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2 animate-bounce" />
                      <p className="font-bold text-amber-200 text-sm">All Discovered Incident Logs Pinned!</p>
                      <p className="mt-1 text-[11px] text-amber-200/60">
                        {unknownEvents.length > 0 
                          ? `${unknownEvents.length} incident logs remain locked. Discover more clues in Evidence or Interrogations.`
                          : 'Review your complete sequence on the reconstruction board.'}
                      </p>
                    </div>
                  ) : (
                    unplacedKnownEvents.map((ev, idx) => {
                      const styleType = getCardArchetype(ev, idx);
                      const imgUrl = getCardImage(ev, styleType);

                      return (
                        <div
                          key={ev.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, ev.id)}
                          onClick={() => handlePlaceEvent(ev.id)}
                          className="interactive-card group relative cursor-pointer bg-[#fefcf8] text-slate-900 p-4 sm:p-5 rounded-2xl border-2 border-amber-900/40 shadow-lg hover:shadow-2xl hover:border-amber-600 transition-all duration-200 overflow-hidden space-y-3"
                        >
                          {/* Card Top Label & Badge */}
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-900/15">
                            <span className="text-xs font-mono font-extrabold bg-amber-950 text-amber-100 px-2.5 py-1 rounded-md border border-amber-800 uppercase tracking-wide">
                              {getTimeTag(ev)}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-amber-950 uppercase bg-amber-200/90 px-2 py-0.5 rounded-md border border-amber-400/50">
                              {styleType}
                            </span>
                          </div>

                          {/* Event Description Text - Crisp Sans-Serif, High Legibility */}
                          <p className="text-sm font-sans font-semibold text-slate-900 leading-snug tracking-normal">
                            {ev.description}
                          </p>

                          {/* Bottom Pin Button Bar */}
                          <div className="pt-2 border-t border-amber-900/15 flex items-center justify-between text-xs font-mono font-bold text-amber-900">
                            <span className="text-amber-800/80 flex items-center gap-1 text-[11px]">
                              <Pin className="h-3.5 w-3.5 text-amber-800" /> Click or Drag to Pin
                            </span>
                            <span className="bg-amber-900 text-amber-50 px-3 py-1.5 rounded-xl group-hover:bg-amber-950 transition-colors shadow flex items-center gap-1.5">
                              + Pin to Wall ➔
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Locked Unknown Events Section */}
                  {unknownEvents.length > 0 && (
                    <div className="pt-4 border-t border-amber-900/50 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <Lock className="h-3.5 w-3.5 text-amber-500" /> Locked / Missing Information ({unknownEvents.length})
                        </h5>
                        <span className="text-[9px] font-mono text-amber-400/80">
                          Complete leads or inspect evidence to unlock
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {unknownEvents.map((ev, uIdx) => {
                          const isHintVisible = visibleTimelineHintIds[ev.id || `unk_${uIdx}`];
                          return (
                            <div 
                              key={ev.id || uIdx}
                              className="bg-[#2a1d12] border-2 border-dashed border-amber-700/50 rounded-xl p-3 text-amber-300/70 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono font-bold bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded uppercase border border-amber-700/40 flex items-center gap-1">
                                  <QuestionIcon className="h-3 w-3 text-amber-400 animate-spin-slow" /> UNKNOWN INCIDENT #{uIdx + 1}
                                </span>
                                <span className="text-[9px] font-mono text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">LOCKED</span>
                              </div>

                              <p className="text-xs font-mono italic text-amber-200/80">
                                "Missing incident details. Uncover related evidence or interview witnesses to unlock this moment."
                              </p>

                              {/* Interactive Hint Callout */}
                              {isHintVisible ? (
                                <div className="p-2.5 bg-amber-950/90 border border-amber-500/40 rounded-lg text-[11px] font-mono text-amber-200 space-y-1">
                                  <div className="flex items-center justify-between font-bold text-amber-400">
                                    <span className="flex items-center gap-1">
                                      <Lightbulb className="h-3.5 w-3.5 text-amber-400" /> How to Unlock:
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setVisibleTimelineHintIds(prev => ({ ...prev, [ev.id || `unk_${uIdx}`]: false }))}
                                      className="text-[10px] text-amber-400/80 hover:text-white underline cursor-pointer"
                                    >
                                      Hide
                                    </button>
                                  </div>
                                  <p className="text-[10px] leading-relaxed text-amber-200/90">
                                    {ev.linkedLeadId 
                                      ? `Complete active lead #${ev.linkedLeadId.replace('lead_', '')} in the Leads tab to unlock this timeline log.` 
                                      : `Complete at least 1 investigation lead in the Leads tab, inspect inspectable points on evidence, or interrogate witnesses to automatically unlock this timestamp.`}
                                  </p>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setVisibleTimelineHintIds(prev => ({ ...prev, [ev.id || `unk_${uIdx}`]: true }))}
                                  className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400 hover:text-white bg-amber-900/40 hover:bg-amber-900/70 border border-amber-600/40 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Lightbulb className="h-3 w-3 text-amber-400" />
                                  <span>SHOW UNLOCK HINT</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Main Reconstruction Wall Board (7 Cols in XL) */}
              <div className="xl:col-span-7 bg-[#231810]/95 border-4 border-[#4d3218] rounded-3xl p-5 flex flex-col h-full shadow-2xl relative min-h-[620px]">
                {/* Board Header */}
                <div className="flex items-center justify-between border-b border-amber-900/60 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-600 animate-ping" />
                    <h4 className="text-xs font-mono font-bold uppercase text-amber-200 tracking-wider">
                      CHRONOLOGICAL CASE SEQUENCE ({draftSequence.length} PLACED)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400/80 hidden sm:inline">
                    Use Up/Down arrows to re-order • Add detective notes
                  </span>
                </div>

                {/* Reconstruction Wall Slot List */}
                <div className="flex-1 space-y-4 overflow-y-auto max-h-[620px] pr-2">
                  {draftSequence.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-amber-900/40 rounded-2xl text-amber-200/40 font-mono text-xs my-auto">
                      <Layers className="h-12 w-12 text-amber-500/40 mb-3 animate-bounce" />
                      <p className="font-serif text-base text-amber-200/90 font-bold mb-1">The Wall is Empty</p>
                      <p className="max-w-md mx-auto leading-relaxed">
                        Click unsequenced incident cards from the left tray to pin them onto position #1. Rebuild the exact sequence of events step by step.
                      </p>
                    </div>
                  ) : (
                    draftSequence.map((ev, index) => {
                      const rot = getCardRotation(ev.id, index);
                      const styleType = getCardArchetype(ev, index);
                      const imgUrl = getCardImage(ev, styleType);
                      const isAnnotating = editingAnnotationId === ev.id;
                      const isUncertain = uncertainEvents[ev.id];
                      const isHighlighted = highlightedEvents[ev.id];
                      const prevEv = index > 0 ? draftSequence[index - 1] : null;

                      return (
                        <div key={ev.id} className="relative group">
                          
                          {/* Red Thread Sequence Connector */}
                          {prevEv && (
                            <div className="flex flex-col items-center my-2 z-10 relative">
                              <div className="h-6 w-1 bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.9)] red-string-line transition-all" />
                              <div 
                                className="px-3 py-1 bg-black/90 border border-rose-500/60 rounded-full text-[9px] font-mono text-rose-300 font-bold shadow-lg flex items-center gap-1.5 cursor-help"
                                title={getEvidenceLinkDescription(prevEv, ev)}
                              >
                                <Link2 className="h-3 w-3 text-rose-400" />
                                <span>LINK SUPPORT: LOG #{prevEv.orderIndex} ➔ LOG #{ev.orderIndex}</span>
                              </div>
                            </div>
                          )}

                          {/* Main Physical Pinned Card */}
                          <div
                            id={`wall-card-${ev.id}`}
                            className={`interactive-card relative rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-xl border-2 ${
                              isHighlighted 
                                ? 'bg-[#fef9c3] border-amber-500 shadow-[0_0_24px_rgba(245,158,11,0.45)]' 
                                : 'bg-[#fffdfa] border-amber-900/60 text-slate-900'
                            }`}
                            style={{
                              transform: `rotate(${rot}deg)`
                            }}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDropOnSlot(e, index)}
                          >
                            {/* Push Pin Header */}
                            <div className="wall-pin-head absolute -top-3 left-6 h-6 w-6 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white z-20">
                              <Pin id={`pin-head-${ev.id}`} className="h-3 w-3 fill-current" />
                            </div>

                            {/* Tape Deco */}
                            <div className="absolute -top-3 right-10 h-5 w-14 bg-amber-200/60 backdrop-blur-sm border border-amber-400/40 transform rotate-2 rounded-sm shadow-sm" />

                            {/* Uncertain Flag */}
                            {isUncertain && (
                              <div className="absolute top-2.5 right-14 px-2.5 py-0.5 bg-rose-700 text-white text-[10px] font-mono font-extrabold rounded-md uppercase tracking-wider border border-rose-900 shadow">
                                ? UNCERTAIN HYPOTHESIS
                              </div>
                            )}

                            <div className="flex items-start gap-4">
                              {/* Position Badge - Prominent & Readable */}
                              <div className="shrink-0 h-11 w-11 rounded-xl bg-[#2e1c0c] text-amber-200 font-mono font-black flex items-center justify-center text-base sm:text-lg shadow-md border-2 border-amber-500/50">
                                #{index + 1}
                              </div>

                              <div className="flex-1 min-w-0 space-y-3">
                                {/* Header Info & Action Controls */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-900/15">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-extrabold bg-amber-950 text-amber-100 px-3 py-1 rounded-md border border-amber-800 uppercase tracking-wide shadow-sm">
                                      {getTimeTag(ev)}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-amber-950 uppercase bg-amber-200/90 px-2.5 py-1 rounded-md border border-amber-400/50">
                                      {styleType}
                                    </span>
                                  </div>

                                  {/* Action Buttons - Neat & Spaced */}
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <button
                                      type="button"
                                      onClick={() => handleMoveEvent(ev.id, 'up')}
                                      disabled={index === 0}
                                      className="p-1.5 text-slate-700 hover:text-black disabled:opacity-20 cursor-pointer bg-slate-200/90 hover:bg-slate-300 rounded-lg border border-slate-300 transition-colors"
                                      title="Move Earlier in Sequence"
                                    >
                                      <ArrowUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleMoveEvent(ev.id, 'down')}
                                      disabled={index === draftSequence.length - 1}
                                      className="p-1.5 text-slate-700 hover:text-black disabled:opacity-20 cursor-pointer bg-slate-200/90 hover:bg-slate-300 rounded-lg border border-slate-300 transition-colors"
                                      title="Move Later in Sequence"
                                    >
                                      <ArrowDown className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleHighlight(ev.id)}
                                      className={`p-1.5 cursor-pointer text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                                        isHighlighted ? 'bg-amber-500 text-slate-950 border-amber-600 shadow' : 'bg-amber-100 text-amber-950 hover:bg-amber-200 border-amber-300'
                                      }`}
                                    >
                                      Highlight
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleUncertain(ev.id)}
                                      className={`p-1.5 cursor-pointer text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                                        isUncertain ? 'bg-rose-700 text-white border-rose-900 shadow' : 'bg-amber-100 text-amber-950 hover:bg-amber-200 border-amber-300'
                                      }`}
                                    >
                                      ? Flag
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingAnnotationId(isAnnotating ? null : ev.id);
                                        setTempNoteText(annotations[ev.id] || '');
                                      }}
                                      className="p-1.5 text-amber-950 hover:text-black cursor-pointer flex items-center gap-1 text-[11px] font-mono font-bold bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg border border-amber-300 transition-colors"
                                    >
                                      <MessageSquare className="h-3.5 w-3.5 text-amber-800" />
                                      <span>{annotations[ev.id] ? 'Edit Note' : '+ Note'}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveEvent(ev.id)}
                                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded-lg cursor-pointer transition-colors ml-1"
                                      title="Unpin Card from Wall"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Main Description - Clear Sans-Serif Typography */}
                                <div className="space-y-2">
                                  <p className="text-sm sm:text-base font-sans font-semibold text-slate-900 leading-relaxed tracking-normal">
                                    {ev.description}
                                  </p>
                                </div>

                                {/* Annotation Display */}
                                {annotations[ev.id] && !isAnnotating && (
                                  <div className="mt-3 p-2.5 bg-[#fef3c7] border-l-4 border-amber-700 text-xs font-mono text-amber-950 rounded-r shadow-inner">
                                    <strong className="block text-[10px] uppercase tracking-wider text-amber-900 font-bold flex items-center gap-1 mb-0.5">
                                      <Edit3 className="h-3 w-3 text-amber-800" /> Detective Note:
                                    </strong>
                                    {annotations[ev.id]}
                                  </div>
                                )}

                                {/* Annotation Input Editor */}
                                {isAnnotating && (
                                  <div className="mt-3 p-3 bg-amber-100 border-2 border-amber-400 rounded-xl space-y-2 shadow-inner">
                                    <label className="block text-[10px] font-mono font-bold uppercase text-amber-900">
                                      Add Margin Note to Case Wall:
                                    </label>
                                    <textarea
                                      value={tempNoteText}
                                      onChange={(e) => setTempNoteText(e.target.value)}
                                      placeholder="Write custom detective observation or clue deduction regarding this incident..."
                                      className="w-full text-xs font-mono p-2.5 bg-white border border-amber-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                                      rows={2}
                                      autoFocus
                                    />
                                    <div className="flex justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setEditingAnnotationId(null)}
                                        className="px-2.5 py-1 text-[10px] font-mono text-slate-600 hover:text-slate-900 cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleSaveAnnotation(ev.id)}
                                        className="px-3.5 py-1 text-[10px] font-mono font-bold bg-amber-900 text-amber-50 rounded-lg hover:bg-black cursor-pointer shadow"
                                      >
                                        Save Note to Wall
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Empty Slot Drop Target at End of Sequence */}
                  {unplacedKnownEvents.length > 0 && (
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnSlot(e, draftSequence.length)}
                      className="p-4 border-2 border-dashed border-amber-500/40 rounded-2xl bg-black/40 text-amber-300/80 flex items-center justify-center gap-2 font-mono text-xs hover:bg-amber-500/10 hover:border-amber-400 transition-colors cursor-pointer"
                      onClick={() => {
                        if (unplacedKnownEvents.length > 0) {
                          handlePlaceEvent(unplacedKnownEvents[0].id, draftSequence.length);
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 text-amber-400" />
                      <span>Slot #{draftSequence.length + 1}: Click or Drag Next Unsequenced Card Here</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Log Sequence Analysis View */
            <div className="max-w-4xl mx-auto bg-black/85 border-2 border-[#4d3218] rounded-3xl p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-amber-900/50 pb-3 mb-4">
                <h4 className="text-sm font-mono font-bold text-amber-200 uppercase tracking-wider flex items-center gap-2">
                  <FileClock className="h-4 w-4 text-amber-400" />
                  Structured Chronological Sequence ({draftSequence.length} / {allTimelineEvents.length})
                </h4>
                <span className="text-xs text-amber-400 font-mono">Use arrow keys or reorder buttons</span>
              </div>

              {draftSequence.length === 0 ? (
                <p className="text-center py-12 text-amber-200/50 font-mono text-xs">
                  No incident entries placed yet. Switch to Reconstruction Board to pin events.
                </p>
              ) : (
                <div className="space-y-3">
                  {draftSequence.map((ev, index) => (
                    <div key={ev.id} className="p-4 rounded-2xl border border-amber-900/40 bg-slate-900/90 text-amber-100 flex items-start gap-4 shadow-lg">
                      <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center text-xs shrink-0 border border-amber-500/40">
                        #{index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded font-bold border border-amber-400/30">
                            {getTimeTag(ev)}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveEvent(ev.id, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveEvent(ev.id, 'down')}
                              disabled={index === draftSequence.length - 1}
                              className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleRemoveEvent(ev.id)}
                              className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs font-mono text-slate-200 leading-relaxed font-semibold">{ev.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
