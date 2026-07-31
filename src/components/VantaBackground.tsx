import React, { useEffect, useRef } from 'react';

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let effect: { destroy?: () => void } | null = null;
    let timer: NodeJS.Timeout | null = null;

    const initVanta = () => {
      const windowObj = window as unknown as { VANTA?: { CLOUDS?: (options: Record<string, unknown>) => { destroy?: () => void } } };
      if (vantaRef.current && typeof windowObj.VANTA?.CLOUDS === 'function') {
        try {
          effect = windowObj.VANTA.CLOUDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            skyColor: 0x68b8d7,
            cloudColor: 0xadc1de,
            cloudShadowColor: 0x183550,
            sunColor: 0xff9919,
            sunGlareColor: 0xff6633,
            sunlightColor: 0xff9933,
            speed: 1.0
          });
        } catch (err) {
          console.error("Vanta Clouds initialization error:", err);
        }
      }
    };

    const windowObj = window as unknown as { VANTA?: { CLOUDS?: (options: Record<string, unknown>) => { destroy?: () => void } } };
    if (typeof windowObj.VANTA?.CLOUDS === 'function') {
      initVanta();
    } else {
      let attempts = 0;
      timer = setInterval(() => {
        attempts++;
        if (typeof windowObj.VANTA?.CLOUDS === 'function') {
          if (timer) clearInterval(timer);
          initVanta();
        } else if (attempts > 30) {
          if (timer) clearInterval(timer);
        }
      }, 200);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (effect && typeof effect.destroy === 'function') {
        effect.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 w-full h-full -z-20 pointer-events-none transition-opacity duration-1000 overflow-hidden"
      id="vanta-clouds-container"
    />
  );
}
