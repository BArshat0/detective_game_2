import React, { useState, useRef, useEffect, useMemo } from 'react';
import anime from '../lib/animeHelper';
import { 
  Network, Link2, Trash2, ShieldCheck, Compass, Plus, Pin, 
  ZoomIn, ZoomOut, Maximize2, User, FileText, MapPin, Phone, 
  Building2, CreditCard, Plane, Newspaper, Globe, HelpCircle, 
  Clock, MessageSquare, AlertTriangle, Eye, Check, X, Move, Flame,
  FilePlus, CheckCircle2, Sparkles
} from 'lucide-react';
import { Case, WallNode, WallConnection, Evidence } from '../types';
import { getSuspectSketchArt } from '../utils/suspectSketches';

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

  // Quick Link Toolbar Selects
  const [selectedFromNodeId, setSelectedFromNodeId] = useState<string | null>(null);
  const [selectedToNodeId, setSelectedToNodeId] = useState<string | null>(null);
  const [selectedStringColor, setSelectedStringColor] = useState('#ef4444'); // Red default

  // Custom Sticky Note Creator State
  const [isAddingStickyNote, setIsAddingStickyNote] = useState(false);
  const [stickyNoteTitle, setStickyNoteTitle] = useState('');
  const [stickyNoteText, setStickyNoteText] = useState('');
  const [stickyNoteColor, setStickyNoteColor] = useState<'yellow' | 'pink' | 'cyan' | 'amber' | 'emerald'>('yellow');

  // Discovered Evidence Drawer Modal
  const [showEvidenceDrawer, setShowEvidenceDrawer] = useState(false);

  // Theory Evaluation State
  const [theoryResult, setTheoryResult] = useState<{ 
    score: number; 
    msg: string; 
    status: 'verified' | 'incomplete' | 'invalid';
    verifiedCount: number;
    details: string[];
  } | null>(null);
  
  // AI Deduction Prompt Assistant state
  const [showAiAdvisor, setShowAiAdvisor] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Dynamic Case-Aligned Relationship Options
  const relationshipOptions = useMemo(() => {
    const caseId = caseData.id || '';
    if (caseId.includes('border') || caseData.topic.toLowerCase().includes('trafficking') || caseData.topic.toLowerCase().includes('job')) {
      return [
        { label: '✈️ Fake VIP Employment Offer', color: '#ef4444' },
        { label: '🚨 Unlicensed Shell Syndicate', color: '#dc2626' },
        { label: '📞 Scripted Extortion Telephony', color: '#3b82f6' },
        { label: '💰 Crypto Advance Fee Demand', color: '#10b981' },
        { label: '📄 Contradicts Contract Terms', color: '#f59e0b' },
        { label: '🔗 Identity Alias / Fake Recruiter', color: '#8b5cf6' },
        { label: '🌐 Offshore Fraud Domain', color: '#ec4899' }
      ];
    }
    if (caseId.includes('voice') || caseData.topic.toLowerCase().includes('voice') || caseData.topic.toLowerCase().includes('cloning')) {
      return [
        { label: '🎙️ Synthetic Voice Model Clone', color: '#a855f7' },
        { label: '📱 Out-of-Band Phone Extortion', color: '#ef4444' },
        { label: '🎧 Scraped VLOG Frequencies', color: '#3b82f6' },
        { label: '🚫 Contradicts Alibi / Location', color: '#f59e0b' },
        { label: '💻 Unclaimed Audio Editor Terminal', color: '#10b981' },
        { label: '👤 Impersonation Target', color: '#ec4899' }
      ];
    }
    if (caseId.includes('scholar') || caseData.topic.toLowerCase().includes('investment') || caseData.topic.toLowerCase().includes('phishing')) {
      return [
        { label: '🌐 Phishing Portal Host', color: '#3b82f6' },
        { label: '💳 20% Tax Clearance Fee Demand', color: '#ef4444' },
        { label: '📈 Fraudulent Trading Portal', color: '#f59e0b' },
        { label: '👤 Identity Harvesting Vector', color: '#8b5cf6' },
        { label: '🚫 Disproves Legitimate Regulator Claim', color: '#dc2626' }
      ];
    }
    // Default fallback case options
    return [
      { label: '❌ Contradicts Statement / Document', color: '#ef4444' },
      { label: '🛡️ Supports Evidence Claim', color: '#10b981' },
      { label: '🔗 Linked Identity / Alias', color: '#f59e0b' },
      { label: '⚡ Initiated Transaction / Call', color: '#3b82f6' },
      { label: '👁️ Witnessed By', color: '#8b5cf6' },
      { label: '⏳ Happened Before', color: '#ec4899' }
    ];
  }, [caseData]);

  const [customRelationLabel, setCustomRelationLabel] = useState<string>('');

  // Set default label when case options load
  useEffect(() => {
    if (relationshipOptions.length > 0) {
      setCustomRelationLabel(relationshipOptions[0].label);
    }
  }, [relationshipOptions]);

  // Fallback to initial case nodes if state is empty
  const currentNodes: WallNode[] = useMemo(() => {
    if (wallNodesState && wallNodesState.length > 0) {
      return wallNodesState;
    }
    return caseData.initialWallNodes || [];
  }, [wallNodesState, caseData.initialWallNodes]);

  // Unplaced Discovered Evidences
  const unplacedEvidences: Evidence[] = useMemo(() => {
    const existingTitles = new Set(currentNodes.map(n => n.title.toLowerCase()));
    return caseData.evidences.filter(ev => 
      discoveredEvidenceIds.includes(ev.id) && !existingTitles.has(ev.name.toLowerCase())
    );
  }, [caseData.evidences, discoveredEvidenceIds, currentNodes]);

  // Add Discovered Evidence Node to Board
  const handleAddEvidenceToBoard = (evidence: Evidence) => {
    const newNode: WallNode = {
      id: `ev_node_${evidence.id}`,
      title: evidence.name,
      description: evidence.description.slice(0, 100) + '...',
      type: evidence.type === 'system_file' || evidence.type === 'crypto_fragment' ? 'digital' : 'evidence',
      x: 30 + Math.floor(Math.random() * 30),
      y: 35 + Math.floor(Math.random() * 25),
      rotation: Math.floor(Math.random() * 6) - 3
    };

    const updatedNodes = [...currentNodes, newNode];
    onUpdateWall(updatedNodes, wallConnectionsState);

    // Entrance animation
    setTimeout(() => {
      anime({
        targets: `#wall-node-${newNode.id}`,
        scale: [0.4, 1],
        rotate: [-8, newNode.rotation || 0],
        duration: 500,
        easing: 'easeOutElastic(1, .6)'
      });
    }, 50);

    window.dispatchEvent(new CustomEvent('mil-xp-earned', {
      detail: { xp: 30, msg: `Pinned Evidence "${evidence.name}" to Wall` }
    }));
  };

  // Canvas Panning / Dragging
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
    if (isPanning) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      return;
    }

    if (draggingNodeId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseXInCanvas = (e.clientX - rect.left - panOffset.x) / zoomLevel;
      const mouseYInCanvas = (e.clientY - rect.top - panOffset.y) / zoomLevel;

      const rawXpx = mouseXInCanvas - nodeDragOffset.x;
      const rawYpx = mouseYInCanvas - nodeDragOffset.y;

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

    anime({
      targets: `#wall-node-${nodeId}`,
      scale: 1.08,
      rotate: (node.rotation || 0) - 2,
      duration: 180,
      easing: 'easeOutQuad'
    });
  };

  const handleTogglePinNode = (nodeId: string) => {
    const updated = currentNodes.map(n => {
      if (n.id === nodeId) {
        return { ...n, isPinned: !n.isPinned };
      }
      return n;
    });
    onUpdateWall(updated, wallConnectionsState);
  };

  // Delete Sticky Note or Wall Node
  const handleDeleteNode = (nodeId: string) => {
    const updatedNodes = currentNodes.filter(n => n.id !== nodeId);
    const updatedConns = wallConnectionsState.filter(c => c.fromId !== nodeId && c.toId !== nodeId);
    onUpdateWall(updatedNodes, updatedConns);

    window.dispatchEvent(new CustomEvent('mil-xp-earned', {
      detail: { xp: 10, msg: 'Removed Note from Investigation Wall' }
    }));
  };

  // Add Yarn String Connection
  const handleStartStringFromNode = (nodeId: string) => {
    if (stringSourceNodeId === nodeId) {
      setStringSourceNodeId(null);
    } else if (stringSourceNodeId) {
      handleAddConnectionBetween(stringSourceNodeId, nodeId);
      setStringSourceNodeId(null);
    } else {
      setStringSourceNodeId(nodeId);
    }
  };

  // Real Case Deductive Connection Evaluation
  const isConnectionValidDeduction = (fromId: string, toId: string) => {
    const nodeA = currentNodes.find(n => n.id === fromId);
    const nodeB = currentNodes.find(n => n.id === toId);
    if (!nodeA || !nodeB) return false;

    const titles = `${nodeA.title.toLowerCase()} ${nodeB.title.toLowerCase()}`;
    const caseId = caseData.id || '';

    if (caseId.includes('border') || caseData.topic.toLowerCase().includes('trafficking')) {
      if ((titles.includes('sterling') || titles.includes('elena')) && (titles.includes('whois') || titles.includes('contract') || titles.includes('offer'))) return true;
      if (titles.includes('kaelen') && titles.includes('contract')) return true;
    } else if (caseId.includes('voice') || caseData.topic.toLowerCase().includes('voice')) {
      if (titles.includes('julian') && (titles.includes('voicemail') || titles.includes('acoustic') || titles.includes('spectrogram'))) return true;
      if (titles.includes('pendelton') && titles.includes('voicemail')) return true;
    } else if (caseId.includes('scholar') || caseData.topic.toLowerCase().includes('investment')) {
      if (titles.includes('julian') && (titles.includes('portal') || titles.includes('code'))) return true;
      if (titles.includes('david') && (titles.includes('tax') || titles.includes('email'))) return true;
    }

    // Default valid deduction rule: Any suspect connected to an evidence or digital node
    const hasSuspect = nodeA.type === 'suspect' || nodeB.type === 'suspect';
    const hasEvidence = nodeA.type === 'evidence' || nodeB.type === 'evidence' || nodeA.type === 'digital' || nodeB.type === 'digital';
    return hasSuspect && hasEvidence;
  };

  const handleAddConnectionBetween = (fromId: string, toId: string) => {
    if (fromId === toId) return;

    const exists = wallConnectionsState.some(
      c => (c.fromId === fromId && c.toId === toId) || (c.fromId === toId && c.toId === fromId)
    );
    if (exists) return;

    const isValid = isConnectionValidDeduction(fromId, toId);

    const newConn: WallConnection = {
      id: `conn_${Date.now()}`,
      fromId,
      toId,
      relationshipLabel: customRelationLabel || 'Linked Evidence',
      color: isValid ? '#10b981' : selectedStringColor,
      isVerified: isValid
    };

    const updatedConns = [...wallConnectionsState, newConn];
    onUpdateWall(currentNodes, updatedConns);

    setTimeout(() => {
      anime({
        targets: `#string-line-${newConn.id}`,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 800
      });
    }, 50);

    window.dispatchEvent(new CustomEvent('mil-xp-earned', {
      detail: { 
        xp: isValid ? 60 : 20, 
        msg: isValid ? 'Validated Case Deduction Link Established!' : 'Clue String Connection Placed' 
      }
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
      title: stickyNoteTitle.trim() || 'Investigator Observation',
      description: stickyNoteText.trim() || 'Crucial lead noted during case review.',
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

  // Evaluate Case Theory (Real Logic)
  const handleEvaluateTheory = () => {
    const totalConnections = wallConnectionsState.length;
    if (totalConnections === 0) {
      setTheoryResult({
        score: 0,
        msg: 'Empty Investigation Board: Pin evidence and attach yarn strings between suspects, credentials, and digital traces.',
        status: 'incomplete',
        verifiedCount: 0,
        details: ['No clue connections placed on board yet.']
      });
      return;
    }

    let verifiedCount = 0;
    const detailsList: string[] = [];

    wallConnectionsState.forEach(conn => {
      const nodeA = currentNodes.find(n => n.id === conn.fromId);
      const nodeB = currentNodes.find(n => n.id === conn.toId);
      if (!nodeA || !nodeB) return;

      const isValid = isConnectionValidDeduction(conn.fromId, conn.toId);
      if (isValid) {
        verifiedCount++;
        detailsList.push(`✅ Valid Link: "${nodeA.title}" ➔ "${nodeB.title}" (${conn.relationshipLabel})`);
      } else {
        detailsList.push(`⚠️ Weak Link: "${nodeA.title}" ➔ "${nodeB.title}" requires corroborating digital proof.`);
      }
    });

    const score = Math.round((verifiedCount / Math.max(2, totalConnections)) * 100);

    if (verifiedCount >= 2 && score >= 50) {
      if (onCompleteClueBoard) onCompleteClueBoard();
      setTheoryResult({
        score: Math.min(100, Math.max(75, score)),
        msg: `Solid Deductive Case Theory! You have established ${verifiedCount} verified evidence links exposing the prime suspect's infrastructure and modus operandi.`,
        status: 'verified',
        verifiedCount,
        details: detailsList
      });
      window.dispatchEvent(new CustomEvent('mil-xp-earned', {
        detail: { xp: 120, msg: 'Investigation Wall Theory Validated by Chief Detective!' }
      }));
    } else {
      setTheoryResult({
        score: Math.max(25, score),
        msg: `Incomplete Theory (${verifiedCount} verified links): Ensure main suspects are linked directly to specific contracts, phone logs, or WHOIS records on the board.`,
        status: 'incomplete',
        verifiedCount,
        details: detailsList
      });
    }
  };

  // Node Icon Mapping
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

  // Render specific card variant based on node archetype
  const renderCardContent = (node: WallNode, isSelected: boolean) => {
    const type = node.type.toLowerCase();

    // 1. POLAROID VARIANT WITH POLICE PENCIL SKETCH (For suspect / people or nodes with images/avatars)
    if (type === 'suspect' || type === 'people' || node.avatarOrIcon) {
      const sketchArt = getSuspectSketchArt(node.title, node.avatarOrIcon);
      return (
        <div className="bg-[#fcfbf9] text-neutral-900 rounded-xs p-2.5 pt-3.5 pb-3 shadow-[4px_10px_22px_rgba(0,0,0,0.45)] border border-neutral-300 relative group flex flex-col items-center">
          {/* Photo Area */}
          <div className="w-full aspect-[4/3] bg-[#1a1715] rounded-2xs overflow-hidden border border-neutral-300 relative flex items-center justify-center mb-2 shadow-inner">
            <img 
              src={sketchArt} 
              alt={node.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-300" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-1 right-1 text-[8px] font-mono font-bold text-amber-200/90 bg-black/80 px-1.5 py-0.5 rounded uppercase border border-amber-500/30">
              POLICE SKETCH
            </div>
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

    // 4. COLORED STICKY NOTE VARIANT
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
        <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[14px] border-t-transparent border-r-[14px] pointer-events-none shadow-xs" style={{ borderRightColor: cornerFoldColor }} />

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

  const aiDeductionPrompt = useMemo(() => {
    if (wallConnectionsState.length === 0) {
      return "Chief Detective Note: Select any two nodes and click '+ LINK NODES' or use the red pushpins to draw string connections.";
    }
    return `Case Board Active: ${wallConnectionsState.length} clue connections established. Click 'EVALUATE THEORY' to test your conclusions against the case file.`;
  }, [wallConnectionsState]);

  return (
    <div 
      id="clue-board-container" 
      className="flex flex-col h-full rounded-[22px] border border-white/10 glass-panel bg-[#1a120b] text-white shadow-2xl overflow-hidden relative"
    >
      {/* Top Header & Action Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 px-5 border-b border-white/10 bg-[#120a06]/90 text-white z-20 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#ff8533]/20 border border-[#ff8533]/40 flex items-center justify-center text-[#ff8533] shadow-inner">
            <Network className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-serif font-black text-white uppercase tracking-wide flex items-center gap-2">
              Investigation Wall Board
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#ffb829]/15 text-[#ffb829] border border-[#ffb829]/30 font-bold">
                EVIDENCE CANVAS
              </span>
            </h3>
            <p className="text-xs text-[#d9d2c9] font-mono mt-0.5">
              Connect suspects, police sketches, credentials, and digital artifacts.
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))}
              className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 text-[10px] text-[#ffb829] font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
              className="p-1.5 text-slate-400 hover:text-[#ff8533] cursor-pointer ml-1"
              title="Reset Canvas View"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {unplacedEvidences.length > 0 && (
            <button
              onClick={() => setShowEvidenceDrawer(!showEvidenceDrawer)}
              className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-200 bg-amber-500/15 border border-amber-500/30 px-3.5 py-1.5 rounded-xl hover:bg-amber-500/25 transition-colors cursor-pointer shadow-md"
            >
              <FilePlus className="h-3.5 w-3.5 text-amber-400" />
              <span>+ DISCOVERED EVIDENCE ({unplacedEvidences.length})</span>
            </button>
          )}

          <button
            onClick={() => setIsAddingStickyNote(!isAddingStickyNote)}
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-white bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer shadow-md"
          >
            <Plus className="h-3.5 w-3.5 text-[#ff8533]" />
            <span>+ STICKY NOTE</span>
          </button>

          <button
            onClick={handleEvaluateTheory}
            className="bg-[#ff8533] hover:bg-[#ff9955] text-[#1e110a] font-sans font-extrabold py-1.5 px-4 text-xs flex items-center gap-2 rounded-xl cursor-pointer shadow-lg transition-all"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>EVALUATE THEORY</span>
          </button>
        </div>
      </div>

      {/* Case-Aligned Quick Link Toolbar Drawer */}
      <div className="bg-[#180e08]/90 border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center gap-3 text-xs font-mono z-20 shadow-md text-white backdrop-blur-md">
        <span className="text-[#ff8533] font-bold uppercase tracking-wider flex items-center gap-1">
          <Link2 className="h-4 w-4" /> Link Clues:
        </span>

        {/* Node A */}
        <select
          value={selectedFromNodeId || ''}
          onChange={(e) => setSelectedFromNodeId(e.target.value || null)}
          className="bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:ring-1 focus:ring-[#ff8533]"
        >
          <option value="">Node A...</option>
          {currentNodes.map(n => (
            <option key={n.id} value={n.id}>{n.title} ({n.type})</option>
          ))}
        </select>

        <span className="text-[#ffb829] font-bold">➔</span>

        {/* Node B */}
        <select
          value={selectedToNodeId || ''}
          onChange={(e) => setSelectedToNodeId(e.target.value || null)}
          className="bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:ring-1 focus:ring-[#ff8533]"
        >
          <option value="">Node B...</option>
          {currentNodes.map(n => (
            <option key={n.id} value={n.id}>{n.title} ({n.type})</option>
          ))}
        </select>

        {/* Dynamic Case-Aligned Relationship Option Selector */}
        <select
          value={customRelationLabel}
          onChange={(e) => setCustomRelationLabel(e.target.value)}
          className="bg-black/60 border border-white/15 rounded-xl px-3 py-1.5 text-amber-300 text-xs font-bold outline-none focus:ring-1 focus:ring-[#ff8533] max-w-xs"
        >
          {relationshipOptions.map(opt => (
            <option key={opt.label} value={opt.label}>{opt.label}</option>
          ))}
        </select>

        {/* Thread Color */}
        <div className="flex items-center gap-1.5 ml-1">
          {[
            { color: '#ef4444', label: 'Crimson Red (Suspicion)' },
            { color: '#3b82f6', label: 'Blue (Communication)' },
            { color: '#10b981', label: 'Green (Verified Deduction)' },
            { color: '#f59e0b', label: 'Yellow (Evidence)' },
            { color: '#a855f7', label: 'Purple (Digital)' }
          ].map(c => (
            <button
              key={c.color}
              type="button"
              onClick={() => setSelectedStringColor(c.color)}
              className={`h-5 w-5 rounded-full border-2 transition-transform cursor-pointer ${
                selectedStringColor === c.color ? 'scale-125 border-white ring-2 ring-[#ff8533]' : 'border-transparent opacity-70'
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
          className="bg-[#ff8533] hover:bg-[#ff9955] disabled:opacity-30 text-[#1e110a] font-extrabold px-4 py-1.5 rounded-xl transition-all cursor-pointer ml-auto shadow-md"
        >
          + LINK NODES
        </button>
      </div>

      {/* Detective Advisor Prompt Bar */}
      {showAiAdvisor && (
        <div className="bg-[#ffb829]/10 border-b border-[#ffb829]/20 px-4 py-2 flex items-center justify-between text-xs font-mono text-[#ffb829] z-20">
          <div className="flex items-center gap-2 min-w-0">
            <Compass className="h-4 w-4 text-[#ff8533] shrink-0" />
            <span className="truncate">{aiDeductionPrompt}</span>
          </div>
          <button onClick={() => setShowAiAdvisor(false)} className="text-[10px] text-slate-400 hover:text-white underline ml-2 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Discovered Evidence Drawer Modal */}
      {showEvidenceDrawer && unplacedEvidences.length > 0 && (
        <div className="absolute top-20 right-4 bg-[#1c120a] border-2 border-amber-500/50 p-4 rounded-2xl shadow-2xl z-30 w-88 space-y-3 font-mono text-xs text-white max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between font-serif font-bold text-amber-300 text-sm border-b border-[#3d2512] pb-2">
            <span className="flex items-center gap-2"><FilePlus className="h-4 w-4 text-amber-400" /> Discovered Case Evidence</span>
            <button onClick={() => setShowEvidenceDrawer(false)} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {unplacedEvidences.map(ev => (
              <div key={ev.id} className="bg-black/60 border border-amber-500/30 p-2.5 rounded-xl flex flex-col gap-1.5">
                <div className="flex items-center justify-between font-bold text-amber-200">
                  <span className="truncate">{ev.name}</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">{ev.type}</span>
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-2">{ev.description}</p>
                <button
                  onClick={() => handleAddEvidenceToBoard(ev)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1 px-3 rounded-lg text-[10px] transition-colors cursor-pointer self-end flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Pin Evidence to Wall
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Note Creation Modal */}
      {isAddingStickyNote && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-[#1c120a] border-2 border-[#ff8533] p-4 rounded-2xl shadow-2xl z-30 w-80 space-y-3 font-mono text-xs text-white">
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
            ? 'bg-emerald-950/95 border-emerald-500/60 text-emerald-200'
            : 'bg-amber-950/95 border-amber-500/60 text-amber-200'
        }`}>
          <div className="flex items-center justify-between font-bold uppercase mb-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Case Theory Score: {theoryResult.score}/100 ({theoryResult.verifiedCount} Verified Links)
            </span>
            <button onClick={() => setTheoryResult(null)} className="text-[10px] underline cursor-pointer">Close</button>
          </div>
          <p className="leading-relaxed mb-2">{theoryResult.msg}</p>
          {theoryResult.details.length > 0 && (
            <div className="space-y-1 border-t border-white/10 pt-2 text-[11px]">
              {theoryResult.details.map((detail, idx) => (
                <div key={idx} className="opacity-90">{detail}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Interactive Corkboard Canvas */}
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
          {/* SVG Overlay Layer for Crimson / Color Yarn Strings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {wallConnectionsState.map(conn => {
              const fromNode = currentNodes.find(n => n.id === conn.fromId);
              const toNode = currentNodes.find(n => n.id === conn.toId);
              if (!fromNode || !toNode) return null;

              const containerW = containerRef.current?.clientWidth || 1000;
              const containerH = containerRef.current?.clientHeight || 700;

              const x1 = (fromNode.x / 100) * containerW + 115;
              const y1 = (fromNode.y / 100) * containerH + 10;
              const x2 = (toNode.x / 100) * containerW + 115;
              const y2 = (toNode.y / 100) * containerH + 10;

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
                    x={cx - 65}
                    y={cy - 12}
                    width="130"
                    height="28"
                    className="overflow-visible"
                  >
                    <div 
                      onClick={() => handleRemoveConnection(conn.id)}
                      className="bg-black/95 border text-[9px] font-mono px-2 py-0.5 rounded-full text-white text-center font-bold shadow-lg truncate cursor-pointer hover:scale-110 transition-transform pointer-events-auto flex items-center justify-center gap-1"
                      style={{ borderColor: strokeColor, color: strokeColor }}
                      title="Click to remove string link"
                    >
                      {conn.isVerified && <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />}
                      <span className="truncate">{conn.relationshipLabel}</span>
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
                className={`wall-node-card absolute w-60 transition-all duration-150 cursor-grab active:cursor-grabbing z-10 group ${
                  isSelected ? 'ring-4 ring-rose-500 rounded-sm z-30 scale-105' : ''
                }`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: `rotate(${rot}deg)`
                }}
              >
                {/* 3D Metallic Pushpin Anchor Button */}
                <button
                  type="button"
                  onClick={() => handleStartStringFromNode(node.id)}
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 group relative h-7 w-7 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125 z-20 ${
                    isSelected ? 'scale-125 ring-4 ring-rose-500/80 animate-pulse' : ''
                  }`}
                  title="Click to attach yarn string"
                >
                  <div className="absolute top-3 left-2 w-5 h-2 bg-black/50 rounded-full blur-[2px] transform rotate-12 pointer-events-none" />
                  <div className="relative w-5 h-5 rounded-full bg-gradient-to-br from-neutral-700 via-neutral-900 to-black shadow-md border border-neutral-600/60 flex items-center justify-center">
                    <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white/70 blur-[0.5px]" />
                    <div className="w-2 h-2 rounded-full bg-neutral-950 border border-neutral-700" />
                  </div>
                </button>

                {/* Top Action Overlay - Pin & Direct Trash / Remove Button */}
                <div className="absolute top-2 right-2 flex items-center gap-1 z-20 bg-black/80 backdrop-blur-xs p-1 rounded-md border border-white/10 shadow-lg">
                  <button
                    onClick={() => handleTogglePinNode(node.id)}
                    className={`p-1 rounded hover:bg-black/40 cursor-pointer ${node.isPinned ? 'text-amber-400 font-bold' : 'text-slate-300'}`}
                    title={node.isPinned ? 'Unpin Position' : 'Pin Position'}
                  >
                    <Pin className="h-3.5 w-3.5" />
                  </button>

                  {/* Prominent Trash / Remove Button */}
                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    className="p-1 text-rose-400 hover:text-rose-200 hover:bg-rose-950/50 rounded cursor-pointer transition-colors"
                    title="Remove Note from Board"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Card Content Body */}
                {renderCardContent(node, isSelected)}

                {/* Footer Controls & Remove Action */}
                <div className="mt-1 px-1 flex items-center justify-between text-[9px] font-mono">
                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    className="text-[#3b2513] hover:text-rose-700 font-bold underline flex items-center gap-1 cursor-pointer opacity-80 hover:opacity-100"
                    title="Remove this sticky note or node"
                  >
                    <Trash2 className="h-2.5 w-2.5 text-rose-700" />
                    <span>Remove</span>
                  </button>

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
