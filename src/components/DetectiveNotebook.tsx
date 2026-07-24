import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Eraser } from 'lucide-react';

interface DetectiveNotebookProps {
  notes: string[];
  onAddNote: (note: string) => void;
  onDeleteNote?: (index: number) => void;
  onClearNotes?: () => void;
}

export default function DetectiveNotebook({
  notes,
  onAddNote,
  onDeleteNote,
  onClearNotes
}: DetectiveNotebookProps) {
  const [inputNote, setInputNote] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputNote.trim()) return;

    onAddNote(inputNote.trim());
    setInputNote('');
  };

  // Helper to parse legacy tags from note text to display cleanly
  const cleanNoteText = (note: string) => {
    // Remove legacy tags like [INTEL LOG]:, [Key Finding], [Prologue Finding]
    return note.replace(/^\[.*?\]\s*/i, '');
  };

  return (
    <div 
      className="rounded-[28px] border-4 border-[#3a2213] bg-gradient-to-b from-[#251308] to-[#120803] p-3 flex flex-col h-full min-h-[480px] shadow-2xl relative select-none"
      aria-label="Detective Pocket Notebook"
    >
      {/* Outer leather stitching effect */}
      <div className="absolute inset-1.5 border border-[#4d2f1c]/30 rounded-[22px] pointer-events-none" />

      {/* Top leather binder stitching details */}
      <div className="absolute top-3 left-4 right-4 flex justify-between items-center pointer-events-none opacity-45">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#120803] border border-[#ff8533]/30" />
        ))}
      </div>

      {/* Spiral Binder Rings on the Left margin */}
      <div className="absolute left-4 top-8 bottom-24 flex flex-col justify-between w-4 pointer-events-none z-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center -ml-2.5 my-2">
            {/* Skeuomorphic metal coil loops */}
            <div className="w-7 h-3 rounded-full bg-gradient-to-r from-zinc-400 via-zinc-200 to-zinc-500 shadow-md border-y border-zinc-600/35" />
          </div>
        ))}
      </div>

      {/* Ruled Cream Paper Page */}
      <div className="flex-1 bg-[#fdfaf2] rounded-r-2xl rounded-l-md ml-6 mr-1.5 mt-4 mb-3 p-4 pl-7 pr-4 shadow-lg border-l border-zinc-300 relative flex flex-col overflow-hidden">
        {/* Vertical Red Margin Rule */}
        <div className="absolute left-5 top-0 bottom-0 w-[1px] bg-red-400/40 pointer-events-none" />

        {/* Paper Header */}
        <div className="flex items-center justify-between border-b border-[#e6dfd3] pb-2 mb-3.5 relative z-10">
          <div>
            <h4 className="font-serif text-sm font-bold text-[#3d2e24] flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#ff8533]" />
              Case Notes
            </h4>
            <p className="text-[10px] text-[#8c786a] font-sans">Handwritten log</p>
          </div>

          <div className="flex items-center gap-2">
            {notes.length > 0 && onClearNotes && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="text-[9px] font-sans text-rose-700 hover:text-rose-900 bg-rose-100 hover:bg-rose-200 border border-rose-200 px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                title="Tear out page"
              >
                <Eraser className="h-2.5 w-2.5" />
                <span>Clear</span>
              </button>
            )}
            <span className="text-[9px] font-mono font-bold bg-[#8c786a]/10 border border-[#8c786a]/30 px-2 py-0.5 rounded text-[#5c4a3c]">
              {notes.length} entries
            </span>
          </div>
        </div>

        {/* Clear Confirmation Prompt */}
        {showClearConfirm && (
          <div className="absolute top-12 left-6 right-4 z-30 p-3 bg-red-50 border border-red-200 rounded-xl shadow-lg text-xs text-red-800 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="font-semibold mb-2">Tear out all notes from this page?</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  onClearNotes?.();
                  setShowClearConfirm(false);
                }}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-[10px] cursor-pointer"
              >
                Yes, Clear
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-1 bg-[#e6dfd3] hover:bg-zinc-300 text-zinc-700 rounded text-[10px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Ruled lines area */}
        <div 
          className="flex-1 overflow-y-auto space-y-[24px] pr-1.5 select-text bg-[linear-gradient(to_bottom,transparent_23px,#e8dfd5_24px)] bg-[size:100%_24px] leading-[24px]"
          style={{ minHeight: '260px' }}
        >
          {notes.length === 0 ? (
            <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-4 text-[#8c786a]/80 leading-normal">
              <p className="text-xs font-bold text-[#5c4a3c] mb-1">Your notebook is empty.</p>
              <p className="text-[10px] max-w-[180px]">
                Type findings below or click "Log to Notebook" in the evidence files.
              </p>
            </div>
          ) : (
            <div className="pt-[1px]">
              {notes.map((note, idx) => {
                const displayText = cleanNoteText(note);
                return (
                  <div 
                    key={idx} 
                    className="group relative flex items-start justify-between min-h-[24px] border-b border-transparent hover:bg-black/[0.02] pl-1 py-[2px] transition-colors"
                  >
                    <p className="text-xs text-[#2b1f15] font-sans font-medium leading-[20px] pr-6 select-text">
                      {displayText}
                    </p>

                    {onDeleteNote && (
                      <button
                        type="button"
                        onClick={() => onDeleteNote(idx)}
                        className="opacity-0 group-hover:opacity-100 absolute right-0 top-1 text-[#8c786a] hover:text-rose-600 transition-opacity p-0.5 cursor-pointer focus:outline-none focus:opacity-100"
                        title="Delete entry"
                        aria-label={`Delete note entry number ${idx + 1}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Note Input Field inside Cover Pocket */}
      <div className="px-3 pt-1 pb-2">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={inputNote}
            onChange={(e) => setInputNote(e.target.value)}
            placeholder="Type a case finding..."
            className="flex-1 bg-black/40 border border-[#ff8533]/20 focus:border-[#ff8533] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#8c786a] outline-none transition-colors"
            aria-label="New note content"
          />
          <button
            type="submit"
            disabled={!inputNote.trim()}
            className="px-3 py-2 bg-[#ff8533] hover:bg-[#ff9955] disabled:opacity-45 text-[#120803] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md"
            title="Add note entry"
            aria-label="Add note entry"
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
