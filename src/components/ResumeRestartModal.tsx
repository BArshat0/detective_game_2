import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, X, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { Case } from '../types';

interface ResumeRestartModalProps {
  isOpen: boolean;
  caseData: Case | null;
  onResume: () => void;
  onRestart: () => void;
  onClose: () => void;
}

export default function ResumeRestartModal({
  isOpen,
  caseData,
  onResume,
  onRestart,
  onClose
}: ResumeRestartModalProps) {
  if (!isOpen || !caseData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 20, stiffness: 250 }}
          className="relative w-full max-w-lg bg-[#0d1422] border-2 border-amber-400/50 rounded-[28px] p-6 sm:p-8 shadow-2xl text-white z-10 overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full filter blur-[70px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full filter blur-[70px] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-3 pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 font-mono text-xs font-bold text-amber-300 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>ONGOING INVESTIGATION DETECTED</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {caseData.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              You already have active progress recorded for this case dossier. How would you like to proceed?
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-4">
            
            {/* OPTION 1: RESUME */}
            <button
              onClick={onResume}
              className="w-full p-4 sm:p-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all cursor-pointer shadow-lg hover:shadow-amber-500/20 text-left group flex items-center justify-between gap-4 border border-amber-300"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-slate-950">
                  <Play className="w-4 h-4 fill-current text-slate-950" />
                  <span>RESUME INVESTIGATION</span>
                </div>
                <p className="text-xs text-slate-900 font-medium leading-snug">
                  Jump straight back into your ongoing investigation workspace. <strong className="underline">Skips story prologue</strong>.
                </p>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-950 transition-transform group-hover:translate-x-1 shrink-0" />
            </button>

            {/* OPTION 2: RESTART */}
            <button
              onClick={onRestart}
              className="w-full p-4 sm:p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-white/20 hover:border-amber-400/60 text-slate-100 transition-all cursor-pointer text-left group flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-amber-300">
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>RESTART INVESTIGATION</span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-snug">
                  Start fresh from the beginning. Resets progress and displays the story prologue.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-300 transition-transform group-hover:translate-x-1 shrink-0" />
            </button>

          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <button
              onClick={onClose}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors uppercase tracking-wider"
            >
              Cancel & Return
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
