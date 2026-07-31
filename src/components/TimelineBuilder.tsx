import React from 'react';
import { Calendar, ArrowDown, RefreshCw, HelpCircle, FileClock, ChevronRight } from 'lucide-react';
import { Case, TimelineEvent } from '../types';
import { safeGet, safeSet } from '../lib/safeLookup';

interface TimelineBuilderProps {
  caseData: Case;
  placements: Record<string, number>; // eventId -> index in sequence (0-indexed)
  onUpdatePlacements: (newPlacements: Record<string, number>) => void;
}

export default function TimelineBuilder({ caseData, placements, onUpdatePlacements }: TimelineBuilderProps) {
  const timelineEvents = caseData?.timeline || [];
  const validEventIds = new Set(timelineEvents.map(e => e.id));

  // Sanitize placements to remove any key that doesn't belong to current case's timeline
  const activePlacements: Record<string, number> = {};
  let containsStaleKeys = false;

  Object.entries(placements || {}).forEach(([id, pos]) => {
    if (validEventIds.has(id) && typeof pos === 'number' && !isNaN(pos)) {
      activePlacements[id] = pos;
    } else {
      containsStaleKeys = true;
    }
  });

  // Automatically clean stale or invalid keys from state if present
  React.useEffect(() => {
    if (containsStaleKeys) {
      onUpdatePlacements(activePlacements);
    }
  }, [containsStaleKeys]);

  const draftSequence: TimelineEvent[] = Object.keys(activePlacements)
    .sort((a, b) => (safeGet(activePlacements, a) ?? 0) - (safeGet(activePlacements, b) ?? 0))
    .map(id => timelineEvents.find(e => e.id === id))
    .filter((e): e is TimelineEvent => Boolean(e));

  // Deterministically scramble caseData.timeline so events appear out of chronological order in Unordered Incident Logs
  const shuffledEvents = React.useMemo(() => {
    const list = [...timelineEvents];
    if (list.length <= 1) return list;

    // Use a hash of caseData.id to ensure stable shuffling across renders
    let seed = 0;
    if (caseData?.id) {
      for (let i = 0; i < caseData.id.length; i++) {
        seed = (seed << 5) - seed + caseData.id.charCodeAt(i);
        seed |= 0;
      }
    }

    // Permute list using pseudo-random generator based on seed
    for (let i = list.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      const j = Math.floor(rnd * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }

    // Ensure the scrambled list is NOT identical to the chronological array
    let isIdentical = true;
    for (let i = 0; i < list.length; i++) {
      if (list[i]?.id !== timelineEvents[i]?.id) {
        isIdentical = false;
        break;
      }
    }
    if (isIdentical && list.length > 1) {
      [list[0], list[list.length - 1]] = [list[list.length - 1], list[0]];
    }

    return list;
  }, [caseData?.id, timelineEvents]);

  const placedEventIds = new Set(draftSequence.map(e => e.id));
  const unplacedEvents = shuffledEvents.filter(e => e && e.id && !placedEventIds.has(e.id));

  const getTimeTag = (ev: TimelineEvent) => {
    if (!ev.time || ev.time.includes('July') || ev.time.includes('AM') || ev.time.includes('PM') || ev.time.includes('0') || ev.time.includes('1')) {
      if (ev.time && ev.time.startsWith('TIMESTAMP:')) return ev.time;
      return 'TIMESTAMP: UNVERIFIED';
    }
    return ev.time.startsWith('TIMESTAMP:') ? ev.time : `TIMESTAMP: ${ev.time}`;
  };

  const handlePlaceEvent = (eventId: string) => {
    const nextIndex = draftSequence.length;
    onUpdatePlacements(safeSet(activePlacements, eventId, nextIndex));

    // Dispatch MIL XP event
    window.dispatchEvent(new CustomEvent('mil-xp-earned', { 
      detail: { 
        xp: 40, 
        msg: 'Chronological event sequenced' 
      } 
    }));
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

  const handleClear = () => {
    onUpdatePlacements({});
  };

  return (
    <div id="timeline-builder-container" className="flex flex-col h-full rounded-[24px] border border-white/15 glass-panel bg-slate-900/65 p-5 text-white">
      
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
        <div>
          <h4 className="text-nav-label text-white flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff8533] animate-ping" />
            Chronological Disinformation Sequencer
          </h4>
          <p className="text-xs text-[#9a9a9a] font-mono mt-0.5">Reconstruct the chronological steps of the social manipulation campaign.</p>
        </div>

        {draftSequence.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#ffb829] bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer focus:outline-none"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>RESET CHRONOLOGY</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[420px]">
        {/* Left Side: Unplaced Logs */}
        <div className="rounded-[24px] bg-[#121214] border border-white/5 p-5 flex flex-col h-full">
          <h5 className="font-mono text-xs text-[#9a9a9a] font-bold mb-4 uppercase tracking-wider flex items-center justify-between gap-1.5 border-b border-white/5 pb-2">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-[#9a9a9a]/65" />
              Unordered Incident Pool
            </span>
            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-[#bdbdbd]">
              {unplacedEvents.length} Unsequenced
            </span>
          </h5>

          {unplacedEvents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#9a9a9a]/60 font-mono text-xs">
              <Calendar className="h-8 w-8 text-[#9a9a9a]/20 mb-2 animate-pulse" />
              <span>All {shuffledEvents.length} incident entries added to sequencing timeline.</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[550px] min-h-[380px]">
              {unplacedEvents.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => { handlePlaceEvent(ev.id); }}
                  className="w-full text-left bg-black border border-white/10 rounded-[20px] p-3.5 hover:border-[#ff8533] transition-all flex items-center justify-between gap-3 focus:outline-none group cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono text-[#ff8533] bg-[#ff8533]/10 px-2 py-0.5 rounded-full border border-[#ff8533]/30 uppercase tracking-wider font-bold">
                      {getTimeTag(ev)}
                    </span>
                    <p className="text-xs font-mono mt-2 text-[#bdbdbd] leading-relaxed group-hover:text-white">
                      {ev.description}
                    </p>
                  </div>
                  <div className="shrink-0 h-6 w-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#9a9a9a] group-hover:border-[#ff8533] group-hover:text-white transition-colors">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Timeline Draft */}
        <div className="rounded-[24px] bg-[#121214] border border-white/5 p-5 flex flex-col h-full">
          <h5 className="font-mono text-xs text-[#ff8533] font-bold mb-4 uppercase tracking-wider flex items-center justify-between gap-1.5 border-b border-white/5 pb-2">
            <span className="flex items-center gap-1.5">
              <FileClock className="h-4 w-4 text-[#ff8533]" />
              Disinformation Sequence Log
            </span>
            <span className="text-[10px] bg-[#ff8533]/10 border border-[#ff8533]/30 px-2 py-0.5 rounded-full text-[#ff8533]">
              {draftSequence.length} / {shuffledEvents.length} Sequenced
            </span>
          </h5>

          {draftSequence.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#9a9a9a]/40 font-mono text-xs">
              <ArrowDown className="h-8 w-8 text-[#ff8533]/30 mb-2 animate-bounce" />
              <span>Select incidents from unordered lists to establish the chain of vulnerability.</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[550px] min-h-[380px]">
              {draftSequence.map((ev, index) => (
                <div key={ev.id} className="relative flex flex-col items-center">
                  {index > 0 && (
                    <div className="absolute -top-3 h-3 w-[1px] border-l border-dashed border-[#ff8533]/40" />
                  )}

                  <div className="w-full bg-black border border-white/10 rounded-[20px] p-3.5 relative flex items-start gap-3 group/active">
                    <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-[#ff8533]" />

                    <div className="shrink-0 h-6 w-6 rounded-full bg-[#ff8533] flex items-center justify-center text-[10px] font-mono font-extrabold text-white">
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <span className="text-[9px] font-mono text-[#ff8533] bg-[#ff8533]/10 border border-[#ff8533]/30 px-2 py-0.5 rounded-full font-bold">
                          {getTimeTag(ev)}
                        </span>
                        <button
                          onClick={() => { handleRemoveEvent(ev.id); }}
                          className="text-[9px] font-mono text-rose-500 hover:text-rose-400 opacity-0 group-hover/active:opacity-100 transition-opacity focus:outline-none font-bold cursor-pointer"
                        >
                          REMOVE [x]
                        </button>
                      </div>
                      <p className="text-xs font-mono text-[#bdbdbd] leading-relaxed">
                        {ev.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Forensic rule footer */}
      <div className="mt-5 flex items-start gap-2.5 bg-white/5 border border-white/5 rounded-[24px] p-4 text-xs font-mono text-[#bdbdbd]">
        <FileClock className="h-4 w-4 shrink-0 text-[#ffb829] mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-extrabold uppercase text-[#ffb829] mr-1.5">INVESTIGATION RULE:</span> Reconstructing the chronological sequence of events exposes malicious coordination, premeditation, and the exact timeline of social manipulation.
        </p>
      </div>
    </div>
  );
}
