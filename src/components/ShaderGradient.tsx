import React, { useEffect, useRef } from 'react';

// brand color tokens from DESIGN.md
const COLORS = [
  '#8052ff', // Electric Iris
  '#ffb829', // Saffron Spark
  '#15846e', // Deep Verdant
  '#ec4899', // Vivid Magenta
  '#3b82f6', // Bright Blue
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX?: number;
  baseY?: number;
  size: number;
  color: string;
  angle: number;
  spin: number;
  alpha: number;
  phase: number;
  speed: number;
  isBrain: boolean;
}

export default function ShaderGradient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Helper to generate coordinates in a brain shape
    const getBrainCoords = (t: number, scale: number) => {
      // Parametric formula for a dual-lobed organic brain/cortex shape
      const lobe = Math.sin(t) > 0 ? 1 : -1;
      const r = scale * (1 - 0.2 * Math.sin(6 * t) * Math.cos(2 * t) + 0.15 * Math.sin(12 * t));
      const x = r * Math.cos(t) * (1.1 + 0.2 * lobe);
      const y = r * Math.sin(t) * 0.85;
      return { x, y };
    };

    // Initialize particle field (Thousands of tiny triangular glyphs as specified)
    const initParticles = () => {
      particles = [];
      const numBrainParticles = 900;
      const numAmbientParticles = 400;
      
      const centerX = width * 0.72; // Offset slightly to the right to leave space for left text grids
      const centerY = height * 0.5;
      const scale = Math.min(width, height) * 0.22;

      // 1. Brain constellation particles
      for (let i = 0; i < numBrainParticles; i++) {
        const t = (i / numBrainParticles) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;
        const brainRadiusFactor = 0.1 + Math.random() * 0.9;
        
        // Cortex folds and lobes
        const coords = getBrainCoords(t, scale * brainRadiusFactor);
        
        // Add random variance inside coordinates
        const posX = centerX + coords.x + (Math.random() - 0.5) * 20;
        const posY = centerY + coords.y + (Math.random() - 0.5) * 20;

        particles.push({
          x: posX,
          y: posY,
          baseX: posX,
          baseY: posY,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: 2 + Math.random() * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.02,
          alpha: 0.3 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          speed: 0.01 + Math.random() * 0.02,
          isBrain: true,
        });
      }

      // 2. Ambient drifting particles (drift across viewport)
      for (let i = 0; i < numAmbientParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: 1.5 + Math.random() * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.01,
          alpha: 0.05 + Math.random() * 0.15,
          phase: Math.random() * Math.PI * 2,
          speed: 0.005 + Math.random() * 0.01,
          isBrain: false,
        });
      }
    };

    initParticles();

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    // Mouse movement listener for responsive interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Render loop
    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const centerX = width * 0.72;
      const centerY = height * 0.5;
      const scale = Math.min(width, height) * 0.22;

      // Draw subtle constellation networks in the brain lobe region
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i += 8) {
        const p1 = particles.at(i);
        if (!p1 || !p1.isBrain) continue;

        for (let j = i + 1; j < particles.length; j += 12) {
          const p2 = particles.at(j);
          if (!p2 || !p2.isBrain) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 45) {
            ctx.strokeStyle = p1.color;
            ctx.globalAlpha = (1 - dist / 45) * 0.1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;

      // Update & Draw particles
      particles.forEach((p) => {
        p.angle += p.spin;

        if (p.isBrain) {
          // Slow breathing pulsation to simulate distributed organic brain
          const pulse = 1 + 0.05 * Math.sin(tick * 0.02 + p.phase);
          const currentBaseX = centerX + (p.baseX! - centerX) * pulse;
          const currentBaseY = centerY + (p.baseY! - centerY) * pulse;

          // Organic jitter movement
          p.x += Math.sin(tick * 0.05 + p.phase) * 0.15 + p.vx;
          p.y += Math.cos(tick * 0.05 + p.phase) * 0.15 + p.vy;

          // Pull back to brain base coordinates
          p.x += (currentBaseX - p.x) * 0.05;
          p.y += (currentBaseY - p.y) * 0.05;
        } else {
          // Ambient drift logic
          p.x += p.vx;
          p.y += p.vy;

          // Boundary wrap check for ambient space
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        // Responsive mouse repulsion interaction
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) * 0.08;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Render outlined triangle geometry
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // Outlined triangle coords
        const r = p.size;
        ctx.moveTo(0, -r);
        ctx.lineTo(r * 0.866, r * 0.5);
        ctx.lineTo(-r * 0.866, r * 0.5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
