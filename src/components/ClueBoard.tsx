import React, { useState, useRef, useEffect, useMemo } from 'react';
import anime from '../lib/animeHelper';
import { 
  Network, Link2, Trash2, ShieldCheck, Zap, Plus, Pin, 
  ZoomIn, ZoomOut, Maximize2, User, FileText, MapPin, Phone, 
  Building2, CreditCard, Plane, Newspaper, Globe, HelpCircle, 
  Clock, MessageSquare, AlertTriangle, Eye, Check, X, Move, Flame
} from 'lucide-react';
import { Case, WallNode, WallConnection } from '../types';

interface ClueBoardProps {
  caseData: Case;
  discoveredClueIds: string[];
  discoveredEvidenceIds: string[];
  wallNodesState: WallNode[];
  wallConnectionsState: WallConnection[];
  onUpdateWall: (nodes: WallNode[], connections: WallConnection[]) => void;
  onSelectEvidence: (evidenceId: string) => void;
  onNavigateToTab: (tab: string) => void;
  onCompleteClueBoard?: () => void;
}

export default function ClueBoard({
  caseData,
  discoveredClueIds,
  discoveredEvidenceIds,
  wallNodesState,
  wallConnectionsState,
  onUpdateWall,
  onSelectEvidence,
  onNavigateToTab,
  onCompleteClueBoard
}: ClueBoardProps) {
  // Canvas View State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [nodeDragOffset, setNodeDragOffset] = useState({ x: 0, y: 0 });

  // Interactive Connection Mode
  const [stringSourceNodeId, setStringSourceNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Quick Link Toolbar Selects
  const [selectedFromNodeId, setSelectedFromNodeId] = useState<string | null>(null);
  const [selectedToNodeId, setSelectedToNodeId] = useState<string | null>(null);
  const [customRelationLabel, setCustomRelationLabel] = useState('Fabricated Identity');
  const [selectedStringColor, setSelectedStringColor] = useState('#ef4444'); // Red default

  // Custom Sticky Note Creator
  const [isAddingStickyNote, setIsAddingStickyNote] = useState(false);
  const [stickyNoteTitle, setStickyNoteTitle] = useState('');
  const [stickyNoteText, setStickyNoteText] = useState('');
  const [stickyNoteColor, setStickyNoteColor] = useState<'yellow' | 'pink' | 'cyan' | 'amber' | 'emerald'>('yellow');

  // Theory Evaluation State
  const [theoryResult, setTheoryResult] = useState<{ score: number; msg: string; status: 'verified' | 'incomplete' } | null>(null);
  
  // AI Deduction Prompt Assistant state
  const [showAiAdvisor, setShowAiAdvisor] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Fallback to initial case nodes if state is empty
  const currentNodes: WallNode[] = useMemo(() => {
    if (wallNodesState && wallNodesState.length > 0) {
      return wallNodesState;
    }
    return caseData.initialWallNodes || [];
  }, [wallNodesState, caseData.initialWallNodes]);

  // Handle Canvas Drag / Pan
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('.wall-node-card') || target.closest('button') || target.closest('input') || target.closest('select')) {
      return;
    }
    setIsPanning(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    // Canvas Panning
    if (isPanning) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      return;
    }

    // Node Dragging
    if (draggingNodeId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseXInCanvas = (e.clientX - rect.left - panOffset.x) / zoomLevel;
      const mouseYInCanvas = (e.clientY - rect.top - panOffset.y) / zoomLevel;

      const rawXpx = mouseXInCanvas - nodeDragOffset.x;
      const rawYpx = mouseYInCanvas - nodeDragOffset.y;

      // Convert to canvas percentage (assuming 1000px by 700px virtual bounds)
      const percentX = Math.max(1, Math.min(88, Math.round((rawXpx / (rect.width || 1000)) * 100)));
      const percentY = Math.max(1, Math.min(88, Math.round((rawYpx / (rect.height || 700)) * 100)));

      const updatedNodes = currentNodes.map(node => {
        if (node.id === draggingNodeId && !node.isPinned) {
          return { ...node, x: percentX, y: percentY };
        }
        return node;
      });

      onUpdateWall(updatedNodes, wallConnectionsState);
    }
  };

  const handleCanvasMouseUp = () => {
    if (draggingNodeId) {
      const releasedId = draggingNodeId;
      const node = currentNodes.find(n => n.id === releasedId);
      setDraggingNodeId(null);

      // Spring bounce release animation
      if (node) {
        anime({
          targets: `#wall-node-${releasedId}`,
          scale: 1.0,
          rotate: node.rotation || 0,
          duration: 350,
          easing: 'easeOutElastic(1, .6)'
        });
      }
    }
    setIsPanning(false);
  };

  // Touch handlers for mobile smooth drag
  const handleTouchStart = (e: React.TouchEvent, nodeId?: string) => {
    if (nodeId) {
      const node = currentNodes.find(n => n.id === nodeId);
      if (!node || node.isPinned) return;
      setDraggingNodeId(nodeId);

      const touch = e.touches[0];
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const nodeXpx = (node.x / 100) * rect.width;
        const nodeYpx = (node.y / 100) * rect.height;
        const mouseXInCanvas = (touch.clientX - rect.left - panOffset.x) / zoomLevel;
        const mouseYInCanvas = (touch.clientY - rect.top - panOffset.y) / zoomLevel;

        setNodeDragOffset({
          x: mouseXInCanvas - nodeXpx,
          y: mouseYInCanvas - nodeYpx
        });
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggingNodeId && containerRef.current && e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const mouseXInCanvas = (touch.clientX - rect.left - panOffset.x) / zoomLevel;
      const mouseYInCanvas = (touch.clientY - rect.top - panOffset.y) / zoomLevel;

      const rawXpx = mouseXInCanvas - nodeDragOffset.x;
      const rawYpx = mouseYInCanvas - nodeDragOffset.y;

      const percentX = Math.max(1, Math.min(88, Math.round((rawXpx / rect.width) * 100)));
      const percentY = Math.max(1, Math.min(88, Math.round((rawYpx / rect.height) * 100)));

      const updatedNodes = currentNodes.map(node => {
        if (node.id === draggingNodeId && !node.isPinned) {
          return { ...node, x: percentX, y: percentY };
        }
        return node;
      });

      onUpdateWall(updatedNodes, wallConnectionsState);
    }
  };

  // Node Drag Start
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('select')) return;

    const node = currentNodes.find(n => n.id === nodeId);
    if (!node || node.isPinned) return;

    setDraggingNodeId(nodeId);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const nodeXpx = (node.x / 100) * rect.width;
      const nodeYpx = (node.y / 100) * rect.height;
      const mouseXInCanvas = (e.clientX - rect.left - panOffset.x) / zoomLevel;
      const mouseYInCanvas = (e.clientY - rect.top - panOffset.y) / zoomLevel;

      setNodeDragOffset({
        x: mouseXInCanvas - nodeXpx,
        y: mouseYInCanvas - nodeYpx
      });
    }

    // Tactile drag lift effect
    anime({
      targets: `#wall-node-${nodeId}`,
      scale: 1.08,
      rotate: (node.rotation || 0) - 2,
      duration: 180,
      easing: 'easeOutQuad'
    });
  };

  // Toggle Node Pin
  const handleTogglePinNode = (nodeId: string) => {
    const updated = currentNodes.map(n => {
      if (n.id === nodeId) {
        return { ...n, isPinned: !n.isPinned };
      }
      return n;
    });
    onUpdateWall(updated, wallConnectionsState);
  };

  // Delete Custom Node
  const handleDeleteNode = (nodeId: string) => {
    const updatedNodes = currentNodes.filter(n => n.id !== nodeId);
    const updatedConns = wallConnectionsState.filter(c => c.fromId !== nodeId && c.toId !== nodeId);
    onUpdateWall(updatedNodes, updatedConns);
  };

  // String Connection Handlers
  const handleStartStringFromNode = (nodeId: string) => {
    if (stringSourceNodeId === nodeId) {
      setStringSourceNodeId(null);
    } else if (stringSourceNodeId) {
      // Complete connection
      handleAddConnectionBetween(stringSourceNodeId, nodeId);
      setStringSourceNodeId(null);
    } else {
      setStringSourceNodeId(nodeId);
    }
  };

  const handleAddConnectionBetween = (fromId: string, toId: string) => {
    if (fromId === toId) return;

    // Check existing
    const exists = wallConnectionsState.some(
      c => (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId)
    );
    if (exists) return;

    const newConn: WallConnection = {
      id: `conn_${Date.now()}`,
      fromId,
      toId,
      relationshipLabel: customRelationLabel,
      color: selectedStringColor,
      isVerified: true
    };

    const updatedConns = [...wallConnectionsState, newConn];
    onUpdateWall(currentNodes, updatedConns);

    // Anime.js trigger string drawing animation
    setTimeout(() => {
      anime({
        targets: `#string-line-${newConn.id}`,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 800
      });
    }, 50);

    window.dispatchEvent(new CustomEvent('mil-xp-earned', {
      detail: { xp: 40, msg: 'Evidence Relationship String Created' }
    }));
  };

  const handleRemoveConnection = (connId: string) => {
    const updatedConns = wallConnectionsState.filter(c => c.id !== connId);
    onUpdateWall(currentNodes, updatedConns);
  };

  // Add Custom Handwritten Sticky Note
  const handleCreateStickyNote = () => {
    if (!stickyNoteTitle.trim() && !stickyNoteText.trim()) return;

    const newNode: WallNode = {
      id: `custom_note_${Date.now()}`,
      title: stickyNoteTitle.trim() || 'Detective Observation',
      description: stickyNoteText.trim() || 'Crucial clue noted during interrogation.',
      type: 'motive',
      x: 35 + Math.floor(Math.random() * 20),
      y: 30 + Math.floor(Math.random() * 20),
      noteColor: stickyNoteColor,
      isCustomNote: true,
      rotation: Math.floor(Math.random() * 6) - 3
    };

    const updatedNodes = [...currentNodes, newNode];
    onUpdateWall(updatedNodes, wallConnectionsState);

    setStickyNoteTitle('');
    setStickyNoteText('');
    setIsAddingStickyNote(false);

    // Anime.js entrance animation
    setTimeout(() => {
      anime({
        targets: `#wall-node-${newNode.id}`,
        scale: [0.5, 1],
        rotate: [-10, newNode.rotation || 0],
        duration: 600,
        easing: 'easeOutElastic(1, .6)'
      });
    }, 50);
  };

  // Evaluate Theory
  const handleEvaluateTheory = () => {
    const verifiedConnectionsCount = wallConnectionsState.length;
    if (verifiedConnectionsCount >= 2) {
      if (onCompleteClueBoard) onCompleteClueBoard();
      setTheoryResult({
        score: 95,
        msg: 'Solid Case Theory! Your Investigation Wall connections establish clear evidence links between the prime suspect, fake identity credentials, and financial traces.',
        status: 'verified'
      });
      window.dispatchEvent(new CustomEvent('mil-xp-earned', {
        detail: { xp: 100, msg: 'Investigation Wall Theory Validated!' }
      }));
    } else {
      setTheoryResult({
        score: 40,
        msg: 'Incomplete Theory: Add at least 2 connections between suspects, evidence, and motives on the wall before presenting to Chief Detective.',
        status: 'incomplete'
      });
    }
  };

  // Icon Map for Node Archetypes
  const getNodeArchetypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'suspect':
      case 'people': return <User className="h-4 w-4 text-rose-400" />;
      case 'evidence': return <FileText className="h-4 w-4 text-amber-400" />;
      case 'location': return <MapPin className="h-4 w-4 text-emerald-400" />;
      case 'phone': return <Phone className="h-4 w-4 text-yellow-400" />;
      case 'organisation': return <Building2 className="h-4 w-4 text-cyan-400" />;
      case 'financial': return <CreditCard className="h-4 w-4 text-[#22c55e]" />;
      case 'travel': return <Plane className="h-4 w-4 text-blue-400" />;
      case 'social': return <Globe className="h-4 w-4 text-indigo-400" />;
      case 'news': return <Newspaper className="h-4 w-4 text-orange-400" />;
      case 'digital':
      case 'document': return <FileText className="h-4 w-4 text-cyan-300" />;
      case 'event': return <Clock className="h-4 w-4 text-amber-300" />;
      default: return <HelpCircle className="h-4 w-4 text-amber-400" />;
    }
  };

  // Node Background Color Styles
  const getNodeCardStyle = (node: WallNode) => {
    if (node.isCustomNote) {
      switch (node.noteColor) {
        case 'pink': return 'bg-[#fce7f3] text-pink-950 border-pink-400';
        case 'cyan': return 'bg-[#e0f2fe] text-sky-950 border-sky-400';
        case 'amber': return 'bg-[#fef3c7] text-amber-950 border-amber-400';
        case 'emerald': return 'bg-[#d1fae5] text-emerald-950 border-emerald-400';
        default: return 'bg-[#fef08a] text-yellow-950 border-yellow-400';
      }
    }

    switch (node.type.toLowerCase()) {
      case 'suspect': return 'bg-[#181113] text-rose-100 border-rose-500/40 shadow-rose-950/40';
      case 'evidence': return 'bg-[#1a1712] text-amber-100 border-amber-500/40 shadow-amber-950/40';
      case 'digital': return 'bg-[#0f172a] text-cyan-100 border-cyan-500/40 shadow-cyan-950/40';
      case 'location': return 'bg-[#062016] text-emerald-100 border-emerald-500/40 shadow-emerald-950/40';
      case 'financial': return 'bg-[#0b2114] text-emerald-200 border-emerald-400/40 shadow-emerald-950/40';
      default: return 'bg-[#141824] text-slate-100 border-slate-700/60 shadow-black/50';
    }
  };

  // Render specific card variant based on node archetype or custom note properties
  const renderCardContent = (node: WallNode, isSelected: boolean) => {
    const type = node.type.toLowerCase();

    // 1. POLAROID VARIANT (For suspect / people or nodes with images/avatars)
    if (type === 'suspect' || type === 'people' || node.avatarOrIcon) {
      return (
        <div className="bg-[#fcfbf9] text-neutral-900 rounded-xs p-2.5 pt-3.5 pb-4 shadow-[4px_10px_22px_rgba(0,0,0,0.45)] border border-neutral-300 relative group flex flex-col items-center">
          {/* Photo Area */}
          <div className="w-full aspect-[4/3] bg-[#1a1715] rounded-2xs overflow-hidden border border-neutral-300 relative flex items-center justify-center mb-2 shadow-inner">
            {node.avatarOrIcon && (node.avatarOrIcon.startsWith('http') || node.avatarOrIcon.startsWith('data:')) ? (
              <img src={node.avatarOrIcon} alt={node.title} className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300" />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <User className="w-10 h-10 text-neutral-500 mb-1" />
                <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">[SUSPECT PHOTO]</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
          {/* Handwritten Caption */}
          <div className="w-full text-center px-1">
            <h4 className="font-['Caveat'] text-lg font-bold text-neutral-900 leading-none mb-0.5">
              {node.title}
            </h4>
            {node.description && (
              <p className="font-mono text-[10px] text-neutral-600 line-clamp-2 leading-tight">
                {node.description}
              </p>
            )}
          </div>
        </div>
      );
    }

    // 2. LINED NOTEBOOK PAGE VARIANT (For evidence, document, digital)
    if (type === 'evidence' || type === 'document' || type === 'digital' || type === 'news') {
      return (
        <div className="bg-[#faf8f2] text-[#1f1a14] rounded-xs p-3.5 pl-6 shadow-[4px_10px_22px_rgba(0,0,0,0.4)] border border-neutral-300 relative overflow-hidden bg-[repeating-linear-gradient(transparent,transparent_19px,#cbd5e1_20px)]">
          {/* Notebook Binder Punch Holes */}
          <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-[#3d2b1a]/30 border border-[#23170d]/50" />
            <div className="w-2 h-2 rounded-full bg-[#3d2b1a]/30 border border-[#23170d]/50" />
            <div className="w-2 h-2 rounded-full bg-[#3d2b1a]/30 border border-[#23170d]/50" />
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-amber-800 uppercase tracking-wider mb-1">
            {getNodeArchetypeIcon(node.type)}
            <span>{node.type}</span>
          </div>
          <h4 className="font-serif font-bold text-sm text-neutral-900 leading-snug mb-1">
            {node.title}
          </h4>
          <p className="font-mono text-[10px] text-neutral-700 leading-relaxed line-clamp-3">
            {node.description}
          </p>
        </div>
      );
    }

    // 3. KRAFT MANILA ENVELOPE VARIANT (For financial, organisation, location, travel)
    if (type === 'financial' || type === 'organisation' || type === 'location' || type === 'travel') {
      return (
        <div className="bg-gradient-to-br from-[#dfb980] via-[#d7a96a] to-[#c29148] text-[#241508] rounded-xs p-3.5 shadow-[4px_10px_22px_rgba(0,0,0,0.45)] border border-[#a87a38] relative">
          {/* Kraft Envelope Flap Detail */}
          <div className="absolute top-0 inset-x-0 h-2.5 bg-[#b8853e]/40 border-b border-[#8c5e20]/40 pointer-events-none" />
          
          <div className="flex items-center justify-between text-[9px] font-mono font-bold text-[#422910] uppercase tracking-wider mb-1 pt-1">
            <span className="flex items-center gap-1">{getNodeArchetypeIcon(node.type)} {node.type}</span>
            <span>EXHIBIT</span>
          </div>
          <h4 className="font-serif font-extrabold text-sm text-[#1f1206] leading-snug mb-1">
            {node.title}
          </h4>
          <p className="font-mono text-[10px] text-[#33200d] leading-relaxed line-clamp-3">
            {node.description}
          </p>
        </div>
      );
    }

    // 4. YELLOW / COLORED STICKY NOTE VARIANT (Default / Custom notes / Motive)
    const noteColor = node.noteColor || 'yellow';
    let bgColorClasses = 'bg-gradient-to-br from-[#fffca8] via-[#fef08a] to-[#fde047] text-[#1c170a]';
    let cornerFoldColor = '#ebd16e';

    if (noteColor === 'pink') {
      bgColorClasses = 'bg-gradient-to-br from-[#fce7f3] via-[#fbcfe8] to-[#f472b6] text-[#2b081e]';
      cornerFoldColor = '#f472b6';
    } else if (noteColor === 'cyan') {
      bgColorClasses = 'bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#38bdf8] text-[#07243b]';
      cornerFoldColor = '#38bdf8';
    } else if (noteColor === 'amber') {
      bgColorClasses = 'bg-gradient-to-br from-[#fef3c7] via-[#fde68a] to-[#fbbf24] text-[#2e1903]';
      cornerFoldColor = '#fbbf24';
    } else if (noteColor === 'emerald') {
      bgColorClasses = 'bg-gradient-to-br from-[#d1fae5] via-[#a7f3d0] to-[#34d399] text-[#042f1a]';
      cornerFoldColor = '#34d399';
    }

    return (
      <div className={`${bgColorClasses} rounded-xs p-3.5 shadow-[4px_10px_22px_rgba(0,0,0,0.38)] relative overflow-hidden group`}>
        {/* Curled Bottom Corner Effect */}
        <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[14px] border-t-transparent border-r-[14px] pointer-events-none shadow-xs" style={{ borderRightColor: cornerFoldColor }} />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black/20 blur-[2px] transform rotate-45 pointer-events-none" />

        <div className="flex items-center justify-between text-[9px] font-mono font-bold opacity-80 uppercase tracking-wider mb-1">
          <span className="flex items-center gap-1">{getNodeArchetypeIcon(node.type)} {node.type}</span>
        </div>
        <h4 className="font-['Caveat'] text-xl font-bold leading-tight mb-1">
          {node.title}
        </h4>
        <p className="font-['Caveat'] text-base leading-snug opacity-95 line-clamp-3">
          {node.description}
        </p>
      </div>
    );
  };

  // Generate dynamic AI Deduction Prompts based on board content
  const aiDeductionPrompt = useMemo(() => {
    if (wallConnectionsState.length === 0) {
      return "Chief Detective Note: The investigation wall is currently clean. Select any two nodes (e.g. suspect & domain WHOIS) and click '+ LINK NODES' or use the red pin thread to establish a relationship.";
    }
    const suspectNodes = currentNodes.filter(n => n.type === 'suspect');
    const evidenceNodes = currentNodes.filter(n => n.type === 'evidence' || n.type === 'digital');
    
    if (suspectNodes.length > 0 && evidenceNodes.length > 0) {
      return `Investigator Analysis: You have connected ${wallConnectionsState.length} clues on the board. Look closely at how the suspects link to digital evidence. Does the timeline match their alibi?`;
    }
    return `Case Board Active: ${wallConnectionsState.length} verified connections formed. Evaluate your theory to test your conclusions.`;
  }, [wallConnectionsState, currentNodes]);

  return (
    <div 
      id="clue-board-container" 
      className="flex flex-col h-full rounded-[22px] border-[10px] border-[#4a2e15] bg-[#9e713d] text-amber-50 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden relative"
      style={{
        backgroundImage: `radial-gradient(circle at center, rgba(185, 135, 80, 0.96), rgba(105, 68, 35, 0.98)), url("https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80")`,
        backgroundSize: 'cover'
      }}
    >
      {/* Top Header & Action Controls (Pine Wood Header Bar) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 px-5 border-b-2 border-[#59391a] bg-[#361f0d]/90 text-[#f5e6d3] backdrop-blur-md z-20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#523318]/80 border border-[#855829]/60 flex items-center justify-center text-[#ffd875] shadow-xs">
            <Network className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-serif font-black text-[#fff3e0] uppercase tracking-wide flex items-center gap-2">
              Detective Deduction Board
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-600/50 font-bold">
                CORK CANVAS
              </span>
            </h3>
            <p className="text-xs text-[#f2dabf]/80 font-mono mt-0.5">
              Connect suspects, evidence, phone logs, and financial trails with crimson yarn threads.
            </p>
          </div>
        </div>

        {/* Header Right Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom Controls */}
          <div className="flex items-center bg-[#29170a]/90 border border-[#694220]/60 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))}
              className="p-1.5 text-amber-200/70 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 text-[10px] text-[#ffd875] font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              className="p-1.5 text-amber-200/70 hover:text-white cursor-pointer"
              title="Zoom In"
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

          <button
            onClick={() => setIsAddingStickyNote(!isAddingStickyNote)}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#f2e2ce] bg-[#59391a]/80 border border-[#8c5a2b]/70 px-3.5 py-1.5 rounded-xl hover:bg-[#6e4620] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 text-[#ffd875]" />
            <span>+ STICKY NOTE</span>
          </button>

          <button
            onClick={handleEvaluateTheory}
            className="bg-gradient-to-r from-[#9e6328] to-[#c98332] hover:brightness-110 text-slate-950 font-sans font-extrabold py-1.5 px-4 text-xs flex items-center gap-2 rounded-xl cursor-pointer shadow-md transition-all"
          >
            <Zap className="h-4 w-4" />
            <span>EVALUATE THEORY</span>
          </button>
        </div>
      </div>

      {/* Connection Toolbar Drawer */}
      <div className="bg-[#241407]/90 border-b border-[#523318]/60 px-4 py-2.5 flex flex-wrap items-center gap-3 text-xs font-mono z-20 shadow-xs">
        <span className="text-[#ffa866] font-bold uppercase tracking-wider flex items-center gap-1">
          <Link2 className="h-4 w-4" /> Link Clues:
        </span>

        {/* Node A */}
        <select
          value={selectedFromNodeId || ''}
          onChange={(e) => setSelectedFromNodeId(e.target.value || null)}
          className="bg-[#140b04] border border-[#59391a] rounded-xl px-3 py-1 text-white text-xs outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="">Node A...</option>
          {currentNodes.map(n => (
            <option key={n.id} value={n.id}>{n.title} ({n.type})</option>
          ))}
        </select>

        <span className="text-amber-400 font-bold">➔</span>

        {/* Node B */}
        <select
          value={selectedToNodeId || ''}
          onChange={(e) => setSelectedToNodeId(e.target.value || null)}
          className="bg-[#140b04] border border-[#59391a] rounded-xl px-3 py-1 text-white text-xs outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="">Node B...</option>
          {currentNodes.map(n => (
            <option key={n.id} value={n.id}>{n.title} ({n.type})</option>
          ))}
        </select>

        {/* Relationship Label */}
        <select
          value={customRelationLabel}
          onChange={(e) => setCustomRelationLabel(e.target.value)}
          className="bg-[#140b04] border border-[#59391a] rounded-xl px-3 py-1 text-white text-xs outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="Fabricated Identity">Fabricated Identity</option>
          <option value="Financial Beneficiary">Financial Beneficiary</option>
          <option value="Contradicts Testimony">Contradicts Testimony</option>
          <option value="Coerced / Extorted">Coerced / Extorted</option>
          <option value="Voice Clone Source">Voice Clone Source</option>
          <option value="Phishing Host">Phishing Host</option>
          <option value="Registered Domain">Registered Domain</option>
        </select>

        {/* Thread Color */}
        <div className="flex items-center gap-1.5 ml-1">
          {[
            { color: '#dc2626', label: 'Crimson Red (Suspicion)' },
            { color: '#2563eb', label: 'Blue (Communication)' },
            { color: '#16a34a', label: 'Green (Financial)' },
            { color: '#ca8a04', label: 'Yellow (Evidence)' },
            { color: '#9333ea', label: 'Purple (Digital)' }
          ].map(c => (
            <button
              key={c.color}
              type="button"
              onClick={() => setSelectedStringColor(c.color)}
              className={`h-5 w-5 rounded-full border-2 transition-transform cursor-pointer ${
                selectedStringColor === c.color ? 'scale-125 border-white ring-2 ring-amber-400' : 'border-transparent opacity-70'
              }`}
              style={{ backgroundColor: c.color }}
              title={c.label}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (selectedFromNodeId && selectedToNodeId) {
              handleAddConnectionBetween(selectedFromNodeId, selectedToNodeId);
              setSelectedFromNodeId(null);
              setSelectedToNodeId(null);
            }
          }}
          disabled={!selectedFromNodeId || !selectedToNodeId || selectedFromNodeId === selectedToNodeId}
          className="bg-[#d98a38] hover:bg-[#e89b48] disabled:opacity-30 text-slate-950 font-bold px-3 py-1 rounded-xl transition-all cursor-pointer ml-auto"
        >
          + LINK NODES
        </button>
      </div>

      {/* Detective Advisor Prompt Bar */}
      {showAiAdvisor && (
        <div className="bg-[#1c0d03]/90 border-b border-[#523318]/50 px-4 py-2 flex items-center justify-between text-xs font-mono text-amber-200 z-20">
          <div className="flex items-center gap-2 min-w-0">
            <Zap className="h-4 w-4 text-[#ffd875] shrink-0" />
            <span className="truncate">{aiDeductionPrompt}</span>
          </div>
          <button onClick={() => setShowAiAdvisor(false)} className="text-[10px] text-amber-400/70 hover:text-amber-200 underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Sticky Note Creation Modal */}
      {isAddingStickyNote && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-[#1c1108] border-2 border-[#d98a38] p-4 rounded-2xl shadow-2xl z-30 w-80 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between font-serif font-bold text-amber-200 text-sm border-b border-[#3d2512] pb-2">
            <span>Add Investigator Sticky Note</span>
            <button onClick={() => setIsAddingStickyNote(false)} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-amber-400/80 mb-1">Note Title</label>
            <input
              type="text"
              value={stickyNoteTitle}
              onChange={(e) => setStickyNoteTitle(e.target.value)}
              placeholder="e.g. Unverified Alibi"
              className="w-full bg-[#0d0703] border border-[#4d2f16] rounded-lg p-2 text-white outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-amber-400/80 mb-1">Note Observation</label>
            <textarea
              value={stickyNoteText}
              onChange={(e) => setStickyNoteText(e.target.value)}
              placeholder="e.g. Why did the wire transfer route through offshore servers?"
              className="w-full bg-[#0d0703] border border-[#4d2f16] rounded-lg p-2 text-white outline-none focus:border-amber-400"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase text-amber-400/80 mb-1">Paper Color</label>
            <div className="flex gap-2">
              {(['yellow', 'pink', 'cyan', 'amber', 'emerald'] as const).map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setStickyNoteColor(color)}
                  className={`h-6 w-6 rounded-full border-2 cursor-pointer ${
                    stickyNoteColor === color ? 'border-white ring-2 ring-amber-400 scale-110' : 'border-transparent'
                  } ${
                    color === 'yellow' ? 'bg-yellow-300' :
                    color === 'pink' ? 'bg-pink-300' :
                    color === 'cyan' ? 'bg-sky-300' :
                    color === 'amber' ? 'bg-amber-300' : 'bg-emerald-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleCreateStickyNote}
            className="w-full bg-[#d98a38] hover:bg-[#e89b48] text-slate-950 font-bold py-2 rounded-xl transition-colors cursor-pointer"
          >
            Pin Note to Board
          </button>
        </div>
      )}

      {/* Theory Evaluation Feedback Banner */}
      {theoryResult && (
        <div className={`m-4 p-4 rounded-2xl border text-xs font-mono shadow-2xl z-20 animate-fade-in ${
          theoryResult.status === 'verified'
            ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
            : 'bg-amber-950/90 border-amber-500/60 text-amber-200'
        }`}>
          <div className="flex items-center justify-between font-bold uppercase mb-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Investigation Theory Evaluation: {theoryResult.score}/100
            </span>
            <button onClick={() => setTheoryResult(null)} className="text-[10px] underline cursor-pointer">Close</button>
          </div>
          <p className="leading-relaxed">{theoryResult.msg}</p>
        </div>
      )}

      {/* Main Corkboard Interactive Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden select-none cursor-grab active:cursor-grabbing min-h-[500px]"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleCanvasMouseUp}
      >
        <div
          ref={canvasRef}
          className="w-full h-full relative origin-top-left transition-transform duration-75 min-h-[700px]"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
          }}
        >
          {/* SVG Overlay Layer for Crimson Yarn Red Strings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {wallConnectionsState.map(conn => {
              const fromNode = currentNodes.find(n => n.id === conn.fromId);
              const toNode = currentNodes.find(n => n.id === conn.toId);
              if (!fromNode || !toNode) return null;

              // Anchor directly to top center pushpin of each note card
              const containerW = containerRef.current?.clientWidth || 1000;
              const containerH = containerRef.current?.clientHeight || 700;

              const x1 = (fromNode.x / 100) * containerW + 115;
              const y1 = (fromNode.y / 100) * containerH + 10;
              const x2 = (toNode.x / 100) * containerW + 115;
              const y2 = (toNode.y / 100) * containerH + 10;

              // Cubic Bezier curve for natural yarn string slack
              const cx = (x1 + x2) / 2;
              const cy = (y1 + y2) / 2 + 18;

              const pathData = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
              const strokeColor = conn.color || '#dc2626';

              return (
                <g key={conn.id}>
                  {/* Drop Shadow Line */}
                  <path
                    d={`M ${x1} ${y1 + 4} Q ${cx} ${cy + 6} ${x2} ${y2 + 4}`}
                    fill="none"
                    stroke="rgba(0,0,0,0.35)"
                    strokeWidth="3.5"
                    className="blur-[1.5px]"
                  />
                  {/* Crimson Thread Line */}
                  <path
                    id={`string-line-${conn.id}`}
                    d={pathData}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2.8"
                    strokeDasharray="1000"
                    strokeDashoffset="0"
                    className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  />
                  {/* String Label Tag */}
                  <foreignObject
                    x={cx - 55}
                    y={cy - 12}
                    width="110"
                    height="26"
                    className="overflow-visible"
                  >
                    <div 
                      onClick={() => handleRemoveConnection(conn.id)}
                      className="bg-black/95 border text-[9px] font-mono px-2.5 py-0.5 rounded-full text-white text-center font-bold shadow-lg truncate cursor-pointer hover:scale-110 transition-transform pointer-events-auto"
                      style={{ borderColor: strokeColor, color: strokeColor }}
                      title="Click to remove string link"
                    >
                      {conn.relationshipLabel}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          {/* Render Wall Nodes */}
          {currentNodes.map((node) => {
            const isSelected = stringSourceNodeId === node.id;
            const rot = node.rotation || 0;

            return (
              <div
                key={node.id}
                id={`wall-node-${node.id}`}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                onTouchStart={(e) => handleTouchStart(e, node.id)}
                className={`wall-node-card absolute w-60 transition-all duration-150 cursor-grab active:cursor-grabbing z-10 ${
                  isSelected ? 'ring-4 ring-rose-500 rounded-sm z-30 scale-105' : ''
                }`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: `rotate(${rot}deg)`
                }}
              >
                {/* 3D Black Pushpin Anchor Button */}
                <button
                  type="button"
                  onClick={() => handleStartStringFromNode(node.id)}
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 group relative h-7 w-7 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125 z-20 ${
                    isSelected ? 'scale-125 ring-4 ring-rose-500/80 animate-pulse' : ''
                  }`}
                  title="Click to attach crimson string"
                >
                  {/* Pushpin Shadow */}
                  <div className="absolute top-3 left-2 w-5 h-2 bg-black/50 rounded-full blur-[2px] transform rotate-12 pointer-events-none" />
                  
                  {/* Metallic 3D Pushpin */}
                  <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-neutral-700 via-neutral-900 to-black shadow-md border border-neutral-600/60 flex items-center justify-center">
                    <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white/70 blur-[0.5px]" />
                    <div className="w-2 h-2 rounded-full bg-neutral-950 border border-neutral-700" />
                  </div>
                </button>

                {/* Pin / Delete Quick Actions Overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs p-1 rounded-md">
                  <button
                    onClick={() => handleTogglePinNode(node.id)}
                    className={`p-1 rounded hover:bg-black/40 cursor-pointer ${node.isPinned ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                    title={node.isPinned ? 'Unpin Position' : 'Pin Position'}
                  >
                    <Pin className="h-3 w-3" />
                  </button>
                  {node.isCustomNote && (
                    <button
                      onClick={() => handleDeleteNode(node.id)}
                      className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Card Main Body */}
                {renderCardContent(node, isSelected)}

                {/* String Link Attachment Footer */}
                <div className="mt-1 px-1 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-[#3b2513] font-bold opacity-75">#{node.id.slice(0, 8)}</span>
                  <button
                    onClick={() => handleStartStringFromNode(node.id)}
                    className="text-[#3b2513] hover:text-[#781818] font-bold underline flex items-center gap-1 cursor-pointer"
                  >
                    <Link2 className="h-3 w-3" />
                    {stringSourceNodeId ? (stringSourceNodeId === node.id ? 'Cancel' : 'Link Here') : 'Attach String'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
