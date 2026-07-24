import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface LoadingScreenProps {
  isDataReady: boolean;
  onComplete: () => void;
}

export default function LoadingScreen({ isDataReady, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  // Smoothly increment the progress bar
  useEffect(() => {
    const duration = 1800; // 1.8 seconds minimum duration for a snappy response
    const intervalTime = 30;
    const totalSteps = duration / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const nextProgress = Math.min(Math.round((step / totalSteps) * 100), 98);
      
      if (isDataReady) {
        if (step >= totalSteps) {
          setProgress(100);
          clearInterval(timer);
          // Small delay before completing to let the user appreciate the 100% state
          const finishTimer = setTimeout(() => {
            onComplete();
          }, 300);
          return () => { clearTimeout(finishTimer); };
        } else {
          setProgress(nextProgress);
        }
      } else {
        // Hold at 90% until backend data and system status are ready
        setProgress(Math.min(nextProgress, 90));
      }
    }, intervalTime);

    return () => { clearInterval(timer); };
  }, [isDataReady, onComplete]);

  // Determine user-friendly non-technical status message based on progress
  let statusMessage = "Preparing training portal...";
  if (progress >= 100) {
    statusMessage = "Academy entry authorized. Loading workspace...";
  } else if (progress >= 80) {
    statusMessage = "Finalizing dossier configuration...";
  } else if (progress >= 50) {
    statusMessage = "Arranging interactive lab materials...";
  } else if (progress >= 25) {
    statusMessage = "Assembling academy study modules...";
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 w-full h-full z-50 bg-[#090604] flex flex-col items-center justify-center p-6 select-none"
      id="app-loader-screen"
    >
      {/* Subtle background ambient details */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090604] via-transparent to-[#090604] pointer-events-none" />

      {/* Main interactive loader card container */}
      <div className="relative w-full max-w-sm z-10 space-y-8 flex flex-col items-center">
        
        {/* Glowing Emblem */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Animated pulsing outer neon glow rings */}
          <div className="absolute inset-0 rounded-full bg-[#ff8533]/5 filter blur-xl animate-pulse" />
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute inset-0 border border-dashed border-[#ff8533]/20 rounded-full"
          />

          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-16 h-16 rounded-full bg-[#1c140e] border border-[#ff8533]/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,133,51,0.1)]"
          >
            <ShieldCheck className="h-8 w-8 text-[#ff8533]" />
          </motion.div>
        </div>

        {/* Brand Information */}
        <div className="text-center space-y-1.5">
          <h2 className="font-serif text-lg font-bold tracking-wider text-white uppercase">
            SOCIAL DETECTIVE
          </h2>
          <p className="text-[10px] text-[#a89485]/80 font-mono tracking-widest uppercase">
            Academy Portal
          </p>
        </div>

        {/* Digital Loading Bar & Human-Readable Status */}
        <div className="w-full space-y-4">
          {/* Progress bar container */}
          <div className="h-1.5 w-full bg-white/[0.03] border border-white/5 rounded-full overflow-hidden p-[1px]">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#ff8533] to-[#ffb829] rounded-full shadow-[0_0_6px_rgba(255,133,51,0.4)]"
              style={{ width: `${progress}%` }}
              layoutId="loadingProgress"
              transition={{ ease: "easeOut" }}
            />
          </div>

          <div 
            className="flex flex-col items-center gap-1 font-mono text-[10px] text-[#a89485] text-center"
            role="status"
            aria-live="polite"
          >
            <span className="text-white transition-all duration-300">
              {statusMessage}
            </span>
            <span className="text-[#ff8533] font-bold text-xs">{progress}%</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
