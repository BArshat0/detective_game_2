import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { mysteryAudio, AudioMode } from '../utils/mysteryAudio';

interface MysteryAudioControlProps {
  className?: string;
  variant?: 'floating' | 'header' | 'story_intro';
}

export default function MysteryAudioControl({ className = '', variant = 'header' }: MysteryAudioControlProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [mode, setMode] = useState<AudioMode>('hub');
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    const unsubscribe = mysteryAudio.subscribe((playing, _muted, vol, currentMode) => {
      setIsPlaying(playing);
      setVolume(vol);
      setMode(currentMode);
    });
    return () => { unsubscribe(); };
  }, []);

  const getModeLabel = (m: AudioMode) => {
    switch (m) {
      case 'story': return 'POTTER THEME';
      case 'investigation': return 'SHERLOCK DRIVE';
      case 'interrogation': return 'INTERROGATION';
      case 'conference': return 'FINAL DEDUCTION';
      case 'solved': return 'CASE SOLVED!';
      default: return 'ACADEMY HUB';
    }
  };

  const handleToggle = () => {
    mysteryAudio.toggle();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    mysteryAudio.setVolume(newVol);
    if (!isPlaying && newVol > 0) {
      mysteryAudio.start();
    }
  };

  if (variant === 'story_intro') {
    return (
      <div className={`relative inline-flex items-center gap-2 ${className}`}>
        <button
          onClick={handleToggle}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold transition-all duration-300 cursor-pointer shadow-md ${
            isPlaying
              ? 'bg-[#8c3220] border-[#8c3220] text-amber-100 hover:bg-[#a63d27]'
              : 'bg-[#3b2616]/90 border-[#8c3220]/50 text-amber-200/80 hover:border-[#8c3220] hover:text-amber-100'
          }`}
          title={isPlaying ? 'Mute Theme' : 'Play Mystery Music'}
        >
          {isPlaying ? (
            <Disc className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          ) : (
            <Music className="w-3.5 h-3.5 text-amber-200/70" />
          )}
          <span className="tracking-wider uppercase">
            {isPlaying ? getModeLabel(mode) : 'PLAY BGM'}
          </span>
          {isPlaying && (
            <span className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-2.5 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-3.5 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-amber-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </button>

        {isPlaying && (
          <div className="hidden sm:flex items-center gap-1.5 bg-[#2a1b10]/90 border border-[#8c3220]/40 px-2.5 py-1 rounded-full">
            <Volume2 className="w-3 h-3 text-amber-200/70" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-14 h-1 accent-[#8c3220] cursor-pointer"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={handleToggle}
        onMouseEnter={() => { setShowSlider(true); }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
          isPlaying
            ? 'border-[#ff8533]/50 bg-[#ff8533]/20 text-[#ff8533] shadow-lg shadow-[#ff8533]/10'
            : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
        }`}
        title={isPlaying ? 'Mute Music' : 'Play Mystery Theme'}
      >
        {isPlaying ? (
          <Volume2 className="h-3.5 w-3.5 text-[#ff8533] animate-pulse" />
        ) : (
          <VolumeX className="h-3.5 w-3.5 text-slate-400" />
        )}
        <span className="hidden sm:inline tracking-wider uppercase text-[10px]">
          {isPlaying ? getModeLabel(mode) : 'BGM OFF'}
        </span>
        {isPlaying && (
          <span className="flex items-center gap-0.5">
            <span className="w-0.5 h-2 bg-[#ff8533] rounded-full animate-pulse" />
            <span className="w-0.5 h-3 bg-[#ff8533] rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            <span className="w-0.5 h-2.5 bg-[#ff8533] rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
          </span>
        )}
      </button>

      {/* Popover volume slider on hover or active */}
      {(isPlaying || showSlider) && (
        <div 
          onMouseLeave={() => { setShowSlider(false); }}
          className="hidden md:flex items-center gap-1.5 bg-slate-900/90 border border-white/10 px-2.5 py-1 rounded-xl"
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 accent-[#ff8533] cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
