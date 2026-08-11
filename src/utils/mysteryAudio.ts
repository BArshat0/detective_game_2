/**
 * Dynamic Game Audio Engine for Cyber Detective Academy
 * Synthesizes procedural background music and dynamic theme transitions using Web Audio API.
 * Inspired by Harry Potter (enchanting celeste & mystery motifs) and Sherlock Holmes (clockwork arpeggios & plucked strings)
 */

export type AudioMode = 'hub' | 'story' | 'investigation' | 'interrogation' | 'conference' | 'solved';

type AudioListener = (isPlaying: boolean, isMuted: boolean, volume: number, currentMode: AudioMode) => void;

interface ModeConfig {
  stepMs: number;
  melody: (string | null)[];
  bass: (string | null)[];
  instrument: 'celeste' | 'plucked' | 'synth';
  droneFreq: number; // Hz
  padFilter: number; // Hz
  tickEvery: number; // 0 for off, 2 for half-tempo ticks, 1 for full tempo ticks
  masterVolMultiplier: number;
}

class MysteryAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private masterVolume: number = 0.35; // 35% default
  private currentMode: AudioMode = 'hub';
  private masterGainNode: GainNode | null = null;
  private loopTimer: number | null = null;
  private currentStep: number = 0;
  private listeners: Set<AudioListener> = new Set();
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;

  // Frequencies for mystery scale (A minor / E harmonic minor / C major arpeggios)
  private notes: Record<string, number> = {
    'E2': 82.41,
    'A2': 110.00,
    'E3': 164.81,
    'G3': 196.00,
    'G#3': 207.65,
    'A3': 220.00,
    'B3': 246.94,
    'C4': 261.63,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'G#4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'B4': 493.88,
    'C5': 523.25,
    'D5': 587.33,
    'D#5': 622.25,
    'E5': 659.25,
    'F5': 698.46,
    'G#5': 830.61,
    'A5': 880.00,
    'C6': 1046.50,
  };

  // Distinct Game Audio Themes
  private modeConfigs: Record<AudioMode, ModeConfig> = {
    // 🏛️ MAIN ACADEMY HUB / CASE LIBRARY: Subtle, mysterious cyber noir briefing
    hub: {
      stepMs: 250,
      melody: [
        'A4', null, 'C5', null, 'E5', null, 'D#5', null,
        'B4', null, 'C5', null, 'A4', null, null, null,
        'E4', null, 'G#4', null, 'B4', null, 'D5', null,
        'C5', null, 'B4', null, 'A4', null, null, null
      ],
      bass: [
        'A3', null, null, null, 'E3', null, null, null,
        'G#3', null, null, null, 'E3', null, null, null,
        'F4', null, null, null, 'E4', null, null, null,
        'A3', null, null, null, 'E3', null, null, null
      ],
      instrument: 'celeste',
      droneFreq: 110.00, // A2
      padFilter: 220,
      tickEvery: 4,
      masterVolMultiplier: 0.8
    },

    // 📜 STORY INTRO / DOSSIER PROLOGUE: Harry Potter-esque enchanting celeste & mystery motif
    story: {
      stepMs: 230,
      melody: [
        'A4', 'C5', 'E5', 'D#5', 'B4', 'C5', 'A4', null,
        'E4', 'G#4', 'B4', 'D5', 'C5', 'B4', 'A4', null,
        'A4', 'C5', 'E5', 'F5', 'E5', 'C5', 'D#5', 'B4',
        'A4', 'E4', 'G#4', 'A4', 'C5', 'E5', 'A5', null
      ],
      bass: [
        'A3', null, 'E4', null, 'A3', null, 'E4', null,
        'G#4', null, 'E4', null, 'A3', null, 'E4', null,
        'F4', null, 'C4', null, 'E4', null, 'B4', null,
        'A3', null, 'E4', null, 'A3', 'C4', 'E4', null
      ],
      instrument: 'celeste',
      droneFreq: 110.00,
      padFilter: 320,
      tickEvery: 2,
      masterVolMultiplier: 1.0
    },

    // 🕵️ ACTIVE INVESTIGATION ROOM: Sherlock Holmes clockwork pizzicato drive & rhythm
    investigation: {
      stepMs: 180,
      melody: [
        'A4', 'E5', 'C5', 'E5', 'D#5', 'B4', 'C5', 'A4',
        'G#4', 'E5', 'B4', 'E5', 'C5', 'A4', 'B4', 'E4',
        'A4', 'C5', 'E5', 'A5', 'G#5', 'E5', 'F5', 'D5',
        'E5', 'C5', 'B4', 'G#4', 'A4', 'E4', 'A3', null
      ],
      bass: [
        'A3', 'E4', 'A3', 'E4', 'G#3', 'E4', 'G#3', 'E4',
        'F4', 'C4', 'F4', 'C4', 'E4', 'B3', 'E4', 'B3',
        'A3', 'E4', 'A3', 'E4', 'G#3', 'E4', 'G#3', 'E4',
        'A3', 'C4', 'E4', 'A4', 'A3', null, null, null
      ],
      instrument: 'plucked',
      droneFreq: 110.00,
      padFilter: 450,
      tickEvery: 1, // Full clockwork tick
      masterVolMultiplier: 0.9
    },

    // 🚨 WITNESS INTERROGATION TERMINAL: Tense psychological suspense & minor interval swells
    interrogation: {
      stepMs: 240,
      melody: [
        'A4', null, 'A#4', null, 'A4', null, 'G#4', null,
        'E4', null, 'F4', null, 'E4', null, 'D#4', null,
        'A4', 'C5', 'D#5', null, 'D5', 'C5', 'B4', null,
        'A4', null, 'G#4', null, 'A4', null, null, null
      ],
      bass: [
        'A2', null, 'A2', null, 'G#2', null, 'G#2', null,
        'F2', null, 'F2', null, 'E2', null, 'E2', null,
        'A2', null, 'C3', null, 'E3', null, 'G#3', null,
        'A2', null, null, null, 'A2', null, null, null
      ],
      instrument: 'synth',
      droneFreq: 82.41, // Low E2 suspense
      padFilter: 160,
      tickEvery: 2,
      masterVolMultiplier: 1.1
    },

    // ⚖️ CASE CONFERENCE / FINAL ACCUSATION: High stakes trial deduction climax
    conference: {
      stepMs: 165,
      melody: [
        'A4', 'C5', 'E5', 'A5', 'G#5', 'E5', 'C5', 'G#4',
        'A4', 'D5', 'F5', 'A5', 'G#5', 'F5', 'D5', 'B4',
        'C5', 'E5', 'A5', 'C6', 'B5', 'G#5', 'E5', 'C5',
        'A5', 'E5', 'C5', 'A4', 'G#4', 'E4', 'A4', null
      ],
      bass: [
        'A3', 'A3', 'E4', 'E4', 'G#3', 'G#3', 'E4', 'E4',
        'F4', 'F4', 'C4', 'C4', 'E4', 'E4', 'B3', 'B3',
        'A3', 'E4', 'A4', 'E4', 'G#3', 'E4', 'G#4', 'E4',
        'A3', 'C4', 'E4', 'A4', 'A5', null, null, null
      ],
      instrument: 'celeste',
      droneFreq: 110.00,
      padFilter: 600,
      tickEvery: 1,
      masterVolMultiplier: 1.0
    },

    // 🏆 CASE SOLVED FANFARE: Triumphant victory jingle
    solved: {
      stepMs: 200,
      melody: [
        'A4', 'C5', 'E5', 'A5', null, 'A5', 'C6', 'E6',
        null, 'E6', 'D6', 'C6', 'B5', 'C6', 'A5', null
      ],
      bass: [
        'A3', 'C4', 'E4', 'A4', 'A3', 'C4', 'E4', 'A4',
        'F4', 'A4', 'C5', 'F5', 'E4', 'G#4', 'B4', 'E5'
      ],
      instrument: 'celeste',
      droneFreq: 220.00,
      padFilter: 800,
      tickEvery: 0,
      masterVolMultiplier: 1.2
    }
  };

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying, this.isMuted, this.masterVolume, this.currentMode);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.isPlaying, this.isMuted, this.masterVolume, this.currentMode));
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  /** Change music mode smoothly (e.g. story -> investigation -> interrogation) */
  public setMode(mode: AudioMode) {
    if (this.currentMode === mode) return;
    this.currentMode = mode;

    if (this.isPlaying && this.ctx && this.droneFilter && this.droneOsc1) {
      const cfg = this.modeConfigs[mode];
      // Update drone pad filter smoothly
      this.droneFilter.frequency.setTargetAtTime(cfg.padFilter, this.ctx.currentTime, 0.8);
      
      // Reset step loop timer to match new step tempo
      if (this.loopTimer !== null) {
        clearInterval(this.loopTimer);
        this.loopTimer = window.setInterval(this.stepLoop, cfg.stepMs);
      }
    }

    this.notify();
  }

  /** Play celeste chime (Harry Potter theme) */
  private playCelesteChime(freq: number, time: number, vol: number = 0.2) {
    if (!this.ctx || !this.masterGainNode) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.76, time); // Bell overtone

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.85);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGainNode);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.9);
    osc2.stop(time + 0.9);
  }

  /** Play plucked string (Sherlock Holmes clockwork theme) */
  private playPluckedString(freq: number, time: number, vol: number = 0.15) {
    if (!this.ctx || !this.masterGainNode) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, time);
    filter.frequency.exponentialRampToValueAtTime(250, time + 0.3);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGainNode);

    osc.start(time);
    osc.stop(time + 0.4);
  }

  /** Play synth lead (Interrogation suspense) */
  private playSynthLead(freq: number, time: number, vol: number = 0.18) {
    if (!this.ctx || !this.masterGainNode) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, time);
    filter.frequency.exponentialRampToValueAtTime(150, time + 0.5);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGainNode);

    osc.start(time);
    osc.stop(time + 0.6);
  }

  /** Play clockwork tick */
  private playClockworkTick(time: number) {
    if (!this.ctx || !this.masterGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, time);
    osc.frequency.exponentialRampToValueAtTime(250, time + 0.025);

    gain.gain.setValueAtTime(0.035, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.025);

    osc.connect(gain);
    gain.connect(this.masterGainNode);

    osc.start(time);
    osc.stop(time + 0.03);
  }

  /** Start ambient drone pad */
  private startDronePad(cfg: ModeConfig) {
    if (!this.ctx || !this.masterGainNode) return;

    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneFilter = this.ctx.createBiquadFilter();
    const droneGain = this.ctx.createGain();

    this.droneOsc1.type = 'sawtooth';
    this.droneOsc1.frequency.setValueAtTime(cfg.droneFreq, this.ctx.currentTime);

    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(cfg.droneFreq * 1.006, this.ctx.currentTime);

    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(cfg.padFilter, this.ctx.currentTime);

    droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.07, this.ctx.currentTime + 2.5);

    this.droneOsc1.connect(this.droneFilter);
    this.droneOsc2.connect(this.droneFilter);
    this.droneFilter.connect(droneGain);
    droneGain.connect(this.masterGainNode);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  private stepLoop = () => {
    if (!this.isPlaying || !this.ctx || !this.masterGainNode) return;

    const cfg = this.modeConfigs[this.currentMode];
    const now = this.ctx.currentTime;

    // Melody step
    const melodyNote = cfg.melody[this.currentStep % cfg.melody.length];
    if (melodyNote && this.notes[melodyNote]) {
      const freq = this.notes[melodyNote];
      const vol = 0.2 * cfg.masterVolMultiplier;

      if (cfg.instrument === 'celeste') {
        this.playCelesteChime(freq, now, vol);
      } else if (cfg.instrument === 'plucked') {
        this.playPluckedString(freq, now, vol);
      } else {
        this.playSynthLead(freq, now, vol);
      }
    }

    // Bass / counterpoint step
    const bassNote = cfg.bass[this.currentStep % cfg.bass.length];
    if (bassNote && this.notes[bassNote]) {
      const freq = this.notes[bassNote];
      this.playPluckedString(freq, now, 0.14 * cfg.masterVolMultiplier);
    }

    // Ticks
    if (cfg.tickEvery > 0 && this.currentStep % cfg.tickEvery === 0) {
      this.playClockworkTick(now);
    }

    this.currentStep++;
  };

  public start(initialMode?: AudioMode) {
    if (initialMode) {
      this.currentMode = initialMode;
    }

    this.initCtx();
    if (!this.ctx) return;

    if (this.isPlaying) return;

    this.isPlaying = true;
    this.isMuted = false;

    const cfg = this.modeConfigs[this.currentMode];

    // Master Gain
    this.masterGainNode = this.ctx.createGain();
    this.masterGainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGainNode.gain.linearRampToValueAtTime(this.masterVolume, this.ctx.currentTime + 1.2);
    this.masterGainNode.connect(this.ctx.destination);

    // Drone
    this.startDronePad(cfg);

    // Loop
    this.currentStep = 0;
    this.stepLoop();
    this.loopTimer = window.setInterval(this.stepLoop, cfg.stepMs);

    this.notify();
  }

  public stop() {
    if (!this.isPlaying) return;

    if (this.loopTimer !== null) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }

    if (this.masterGainNode && this.ctx) {
      try {
        this.masterGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGainNode.gain.setValueAtTime(this.masterGainNode.gain.value, this.ctx.currentTime);
        this.masterGainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      try {
        this.droneOsc1?.stop();
        this.droneOsc2?.stop();
        this.droneOsc1?.disconnect();
        this.droneOsc2?.disconnect();
        this.droneOsc1 = null;
        this.droneOsc2 = null;
      } catch {
        // ignore
      }
      this.isPlaying = false;
      this.notify();
    }, 120);
  }

  public toggle(mode?: AudioMode) {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start(mode);
    }
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGainNode && this.ctx && this.isPlaying) {
      this.masterGainNode.gain.linearRampToValueAtTime(this.masterVolume, this.ctx.currentTime + 0.1);
    }
    this.notify();
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentMode(): AudioMode {
    return this.currentMode;
  }

  public getVolume(): number {
    return this.masterVolume;
  }
}

export const mysteryAudio = new MysteryAudioEngine();
