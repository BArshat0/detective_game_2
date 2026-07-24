import React, { useEffect, useRef, useState } from 'react';

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement | null>(null);
  const [vantaEffect, setVantaEffect] = useState<unknown>(null);

  useEffect(() => {
    const VANTA = (window as unknown as Record<string, any>).VANTA;
    if (!vantaEffect && vantaRef.current && VANTA?.BIRDS) {
      try {
        const effect = VANTA.BIRDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          backgroundColor: 0x000000,
          color1: 0x8052ff, // Electric Iris
          color2: 0x15846e, // Deep Verdant
          birdSize: 1.3,
          wingSpan: 20.0,
          speedLimit: 4.0,
          quantity: 4.0,
          separation: 40.0,
          alignment: 40.0,
          cohesion: 40.0
        });
        setVantaEffect(effect);
      } catch (err) {
        console.error("Vanta Birds initialization error:", err);
      }
    }

    return () => {
      if (vantaEffect && typeof (vantaEffect as { destroy?: () => void }).destroy === 'function') {
        (vantaEffect as { destroy: () => void }).destroy();
      }
    };
  }, [vantaEffect]);

  // Fallback in case the scripts load asynchronously or slightly delayed
  useEffect(() => {
    if (vantaEffect) return;

    let attempts = 0;
    const checkInterval = setInterval(() => {
      attempts++;
      const VANTA = (window as unknown as Record<string, any>).VANTA;
      if (VANTA?.BIRDS && vantaRef.current) {
        clearInterval(checkInterval);
        // Force a state update to trigger the initialization effect
        setVantaEffect(null);
      }
      if (attempts > 30) {
        clearInterval(checkInterval);
      }
    }, 300);

    return () => { clearInterval(checkInterval); };
  }, [vantaEffect]);

  return (
    <div 
      ref={vantaRef} 
      className="fixed inset-0 w-full h-full -z-20 bg-black pointer-events-none opacity-85 transition-opacity duration-1000"
      id="vanta-birds-container"
    />
  );
}
