import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  isDataReady: boolean;
  onComplete: () => void;
}

export default function LoadingScreen({ isDataReady, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const maxValRef = useRef(0);

  // Smoothly increment the progress counter - strictly monotonic (never reverts back)
  useEffect(() => {
    const duration = 1600;
    const intervalTime = 25;
    const totalSteps = duration / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const targetProgress = Math.min(Math.round((step / totalSteps) * 100), 98);
      
      let nextVal = targetProgress;
      if (!isDataReady && targetProgress > 90) {
        nextVal = 90;
      }

      if (isDataReady && step >= totalSteps) {
        nextVal = 100;
      }

      // Ensure progress strictly increases and never decreases
      if (nextVal > maxValRef.current) {
        maxValRef.current = nextVal;
        setProgress(nextVal);
      }

      if (nextVal >= 100) {
        clearInterval(timer);
        const finishTimer = setTimeout(() => {
          onComplete();
        }, 350);
        return () => { clearTimeout(finishTimer); };
      }
    }, intervalTime);

    return () => { clearInterval(timer); };
  }, [isDataReady, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 w-full h-full z-50 flex flex-col items-center justify-center p-6 select-none backdrop-blur-3xl bg-slate-900/30"
      id="app-loader-screen"
    >
      {/* Light soft warm ambient light gradient layer for cloud atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-amber-100/10 to-slate-950/20 pointer-events-none" />

      {/* Main Centered Dim Loading Percentage */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="font-serif font-extrabold text-7xl sm:text-8xl md:text-[140px] text-white/35 tracking-tighter drop-shadow-md select-none">
          {progress}%
        </div>
        
        <div className="mt-2 text-xs font-mono font-bold tracking-[0.2em] text-white/50 uppercase">
          SOCIAL DETECTIVE ACADEMY
        </div>
      </div>
    </motion.div>
  );
}

