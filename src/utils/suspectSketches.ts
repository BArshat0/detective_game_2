// Cyber Detective - High-Quality Police Composite Sketch Artwork Engine

export function encodeSvgDataUri(raw: string): string {
  if (!raw) return '';
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }
  if (raw.startsWith('data:image/svg+xml;base64,')) {
    return raw;
  }
  if (raw.startsWith('data:image/svg+xml,') && raw.includes('%3Csvg')) {
    return raw;
  }
  let svgContent = raw.replace(/^data:image\/svg\+xml;(utf8,)?/, '');
  svgContent = svgContent.replace(/%23/g, '#');
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
}

export const SUSPECT_SKETCHES = {
  // 1. VICTOR STERLING - Mastermind & Shell Company Director
  victor_sterling: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1a17"/>
        <stop offset="50%" stop-color="#14110f"/>
        <stop offset="100%" stop-color="#0a0807"/>
      </linearGradient>
      <radialGradient id="vignette" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
        <stop offset="70%" stop-color="#000000" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <linearGradient id="skin_shade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e2d2be"/>
        <stop offset="50%" stop-color="#b89e83"/>
        <stop offset="100%" stop-color="#695341"/>
      </linearGradient>
      <pattern id="grid_pattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
      <filter id="pencil_texture" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
        <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.15 0"/>
      </filter>
    </defs>

    <!-- Canvas Background -->
    <rect width="100%" height="100%" fill="url(#bg_grad)"/>
    <rect width="100%" height="100%" fill="url(#grid_pattern)"/>
    <rect width="100%" height="100%" fill="url(#vignette)"/>

    <!-- Height Measure Scale Grid Lines -->
    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="11" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="100" x2="470" y2="100" stroke-dasharray="4,4"/>
      <text x="35" y="95">6'2" [188 cm]</text>
      <line x1="30" y1="180" x2="470" y2="180" stroke-dasharray="4,4"/>
      <text x="35" y="175">6'0" [183 cm]</text>
      <line x1="30" y1="260" x2="470" y2="260" stroke-dasharray="4,4"/>
      <text x="35" y="255">5'10" [178 cm]</text>
      <line x1="30" y1="340" x2="470" y2="340" stroke-dasharray="4,4"/>
    </g>

    <!-- Character Portrait Group -->
    <g transform="translate(0, 20)">
      <!-- Suit & Shoulders -->
      <path d="M 100 520 L 160 410 L 210 390 L 250 420 L 290 390 L 340 410 L 400 520 Z" fill="#141110" stroke="#3d342f" stroke-width="2"/>
      <!-- Collar & Tie -->
      <polygon points="210,390 250,470 290,390" fill="#2b2521" stroke="#524740" stroke-width="1.5"/>
      <polygon points="230,390 250,400 270,390 260,490 240,490" fill="#d4c3b3" stroke="#1f1a17" stroke-width="1.5"/>
      <polygon points="245,400 255,400 258,485 242,485" fill="#8f1d1d"/>

      <!-- Neck -->
      <path d="M 215 340 L 215 400 L 285 400 L 285 340 Z" fill="#a88e76" stroke="#423428" stroke-width="2"/>
      <path d="M 215 340 L 285 340 L 270 380 L 230 380 Z" fill="#6e5a48" opacity="0.5"/>

      <!-- Head Structure & Face Jaw -->
      <path d="M 175 180 C 175 110, 325 110, 325 180 C 325 240, 310 330, 250 350 C 190 330, 175 240, 175 180 Z" fill="url(#skin_shade)" stroke="#2b2018" stroke-width="3"/>

      <!-- Ears -->
      <path d="M 165 210 C 155 210, 160 260, 178 250" fill="#b89e83" stroke="#2b2018" stroke-width="2"/>
      <path d="M 335 210 C 345 210, 340 260, 322 250" fill="#b89e83" stroke="#2b2018" stroke-width="2"/>

      <!-- Hair - Sleek Slicked Back Mastermind Style -->
      <path d="M 168 185 C 160 140, 200 95, 250 92 C 300 95, 340 140, 332 185 C 320 135, 290 115, 250 115 C 210 115, 180 135, 168 185 Z" fill="#1c1714" stroke="#000000" stroke-width="3"/>
      <path d="M 175 150 Q 250 110 325 150 Q 250 125 175 150 Z" fill="#3a302a" opacity="0.6"/>

      <!-- Eyebrows - Sharp & Calculating -->
      <path d="M 195 200 Q 220 190 235 202" fill="none" stroke="#1c140e" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M 305 200 Q 280 190 265 202" fill="none" stroke="#1c140e" stroke-width="4.5" stroke-linecap="round"/>

      <!-- Eyes - Piercing & Cold -->
      <!-- Left Eye -->
      <ellipse cx="215" cy="218" rx="14" ry="8" fill="#ffffff" stroke="#241b14" stroke-width="2"/>
      <circle cx="215" cy="218" r="6" fill="#1a140e"/>
      <circle cx="213" cy="216" r="2" fill="#ffffff"/>
      <path d="M 198 212 Q 215 206 232 212" fill="none" stroke="#241b14" stroke-width="2"/>

      <!-- Right Eye -->
      <ellipse cx="285" cy="218" rx="14" ry="8" fill="#ffffff" stroke="#241b14" stroke-width="2"/>
      <circle cx="285" cy="218" r="6" fill="#1a140e"/>
      <circle cx="283" cy="216" r="2" fill="#ffffff"/>
      <path d="M 268 212 Q 285 206 302 212" fill="none" stroke="#241b14" stroke-width="2"/>

      <!-- Nose - Prominent Aquiline Bridge -->
      <path d="M 250 205 L 254 260 L 262 268 L 250 272 L 238 268 L 246 260 Z" fill="#9e856e" opacity="0.5"/>
      <path d="M 250 205 L 254 262 L 263 268 M 237 268 L 246 262" fill="none" stroke="#2e2118" stroke-width="2.5" stroke-linecap="round"/>

      <!-- Mouth - Thin Firm Lip Line -->
      <path d="M 220 305 Q 250 308 280 305" fill="none" stroke="#241912" stroke-width="3" stroke-linecap="round"/>
      <path d="M 230 305 Q 250 318 270 305" fill="#523d2f" opacity="0.6"/>

      <!-- Cheekbone & Jaw Hatching / Shading -->
      <path d="M 185 230 Q 195 270 210 295" fill="none" stroke="#4a3b2d" stroke-width="1.5" stroke-dasharray="2,3"/>
      <path d="M 315 230 Q 305 270 290 295" fill="none" stroke="#4a3b2d" stroke-width="1.5" stroke-dasharray="2,3"/>
      <!-- Stubble / Beard Shadow -->
      <path d="M 200 320 Q 250 355 300 320 C 280 355, 220 355, 200 320 Z" fill="#2e231b" opacity="0.35"/>
    </g>

    <!-- Overlay Pencil Hatching Effect -->
    <rect width="100%" height="100%" fill="#000000" filter="url(#pencil_texture)" style="mix-blend-mode: overlay;"/>

    <!-- Police Forensic Stamp Footer Badge -->
    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#ff8533" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#ff8533" letter-spacing="2">CLASSIFIED POLICE FORENSIC COMPOSITE</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SUBJECT: VICTOR STERLING • ALIAS: "THE DIRECTOR"</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">PRIME SUSPECT</text>
    </g>
  </svg>`,

  // 2. ELENA VANCE - Recruiter & Operative
  elena_vance: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_grad_elena" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1a181c"/>
        <stop offset="50%" stop-color="#121014"/>
        <stop offset="100%" stop-color="#080709"/>
      </linearGradient>
      <radialGradient id="vignette_elena" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <linearGradient id="skin_elena" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ebd8c8"/>
        <stop offset="50%" stop-color="#c9b09c"/>
        <stop offset="100%" stop-color="#7a604f"/>
      </linearGradient>
      <pattern id="grid_pattern2" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg_grad_elena)"/>
    <rect width="100%" height="100%" fill="url(#grid_pattern2)"/>
    <rect width="100%" height="100%" fill="url(#vignette_elena)"/>

    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="11" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="120" x2="470" y2="120" stroke-dasharray="4,4"/>
      <text x="35" y="115">5'10" [178 cm]</text>
      <line x1="30" y1="200" x2="470" y2="200" stroke-dasharray="4,4"/>
      <text x="35" y="195">5'8" [173 cm]</text>
      <line x1="30" y1="280" x2="470" y2="280" stroke-dasharray="4,4"/>
      <text x="35" y="275">5'6" [168 cm]</text>
    </g>

    <!-- Character Portrait Group -->
    <g transform="translate(0, 25)">
      <!-- Trench Coat Collar -->
      <path d="M 120 520 L 170 410 L 220 390 L 250 420 L 280 390 L 330 410 L 380 520 Z" fill="#181418" stroke="#3b323d" stroke-width="2"/>
      <path d="M 170 410 L 220 480 L 250 420" fill="#2b222d" stroke="#524357" stroke-width="1.5"/>
      <path d="M 330 410 L 280 480 L 250 420" fill="#2b222d" stroke="#524357" stroke-width="1.5"/>

      <!-- Neck & Collarbone -->
      <path d="M 225 330 L 225 400 L 275 400 L 275 330 Z" fill="#c9b09c" stroke="#3d2d23" stroke-width="2"/>
      <path d="M 225 330 L 275 330 L 260 375 L 240 375 Z" fill="#8c705c" opacity="0.5"/>

      <!-- Face Shape - Sharp Oval & High Cheekbones -->
      <path d="M 180 175 C 180 110, 320 110, 320 175 C 320 235, 300 330, 250 345 C 200 330, 180 235, 180 175 Z" fill="url(#skin_elena)" stroke="#38281f" stroke-width="3"/>

      <!-- Earrings -->
      <circle cx="172" cy="255" r="8" fill="none" stroke="#d4af37" stroke-width="2.5"/>
      <circle cx="328" cy="255" r="8" fill="none" stroke="#d4af37" stroke-width="2.5"/>

      <!-- Hair - Dark Pulled Back Updo with Free Wisps -->
      <path d="M 170 180 C 150 110, 210 70, 250 68 C 290 70, 350 110, 330 180 C 310 115, 280 90, 250 90 C 220 90, 190 115, 170 180 Z" fill="#171212" stroke="#000000" stroke-width="3"/>
      <!-- Side Wisps -->
      <path d="M 175 180 Q 165 240 180 280" fill="none" stroke="#171212" stroke-width="3.5"/>
      <path d="M 325 180 Q 335 240 320 280" fill="none" stroke="#171212" stroke-width="3.5"/>

      <!-- Arched Eyebrows -->
      <path d="M 195 192 Q 220 178 238 194" fill="none" stroke="#1c1410" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 305 192 Q 280 178 262 194" fill="none" stroke="#1c1410" stroke-width="3.5" stroke-linecap="round"/>

      <!-- Eyes - Almond Piercing Gaze -->
      <ellipse cx="215" cy="210" rx="15" ry="9" fill="#ffffff" stroke="#2e1d15" stroke-width="2"/>
      <circle cx="215" cy="210" r="6" fill="#1c120c"/>
      <circle cx="213" cy="208" r="2" fill="#ffffff"/>
      <path d="M 196 206 Q 215 198 234 206" fill="none" stroke="#2e1d15" stroke-width="2.5"/>

      <ellipse cx="285" cy="210" rx="15" ry="9" fill="#ffffff" stroke="#2e1d15" stroke-width="2"/>
      <circle cx="285" cy="210" r="6" fill="#1c120c"/>
      <circle cx="283" cy="208" r="2" fill="#ffffff"/>
      <path d="M 266 206 Q 285 198 304 206" fill="none" stroke="#2e1d15" stroke-width="2.5"/>

      <!-- Nose - Refined Thin Nose -->
      <path d="M 250 198 L 253 252 L 260 258 L 250 262 L 240 258 L 247 252 Z" fill="#aa907d" opacity="0.4"/>
      <path d="M 250 198 L 253 254 L 260 260 M 240 260 L 247 254" fill="none" stroke="#3d2a1f" stroke-width="2" stroke-linecap="round"/>

      <!-- Lips - Full Defined Lips -->
      <path d="M 225 298 Q 250 292 275 298" fill="none" stroke="#331d15" stroke-width="2.5"/>
      <path d="M 225 298 Q 250 312 275 298 Z" fill="#693b32" stroke="#331d15" stroke-width="1.5"/>

      <!-- High Cheekbone Contour Lines -->
      <path d="M 190 225 Q 200 255 215 275" fill="none" stroke="#5c4538" stroke-width="1.5" stroke-dasharray="2,3"/>
      <path d="M 310 225 Q 300 255 285 275" fill="none" stroke="#5c4538" stroke-width="1.5" stroke-dasharray="2,3"/>
    </g>

    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#a855f7" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#a855f7" letter-spacing="2">CLASSIFIED POLICE FORENSIC COMPOSITE</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#ebd8c8">SUBJECT: ELENA VANCE • ALIAS: "AURA RECRUITER"</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">KEY OPERATIVE</text>
    </g>
  </svg>`,

  // 3. KAELEN MILLER - Victim & Trapped Developer
  kaelen_miller: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_grad_kaelen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#181c1a"/>
        <stop offset="50%" stop-color="#101412"/>
        <stop offset="100%" stop-color="#080a09"/>
      </linearGradient>
      <radialGradient id="vignette_kaelen" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <linearGradient id="skin_kaelen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f2dfce"/>
        <stop offset="50%" stop-color="#ccb199"/>
        <stop offset="100%" stop-color="#735e4d"/>
      </linearGradient>
      <pattern id="grid_pattern3" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg_grad_kaelen)"/>
    <rect width="100%" height="100%" fill="url(#grid_pattern3)"/>
    <rect width="100%" height="100%" fill="url(#vignette_kaelen)"/>

    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="11" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="120" x2="470" y2="120" stroke-dasharray="4,4"/>
      <text x="35" y="115">6'0" [183 cm]</text>
      <line x1="30" y1="200" x2="470" y2="200" stroke-dasharray="4,4"/>
      <text x="35" y="195">5'11" [180 cm]</text>
      <line x1="30" y1="280" x2="470" y2="280" stroke-dasharray="4,4"/>
      <text x="35" y="275">5'9" [175 cm]</text>
    </g>

    <!-- Character Portrait Group -->
    <g transform="translate(0, 25)">
      <!-- Developer Hoodie -->
      <path d="M 110 520 C 130 420, 180 390, 210 390 L 250 410 L 290 390 C 320 390, 370 420, 390 520 Z" fill="#1d2421" stroke="#384540" stroke-width="2"/>
      <path d="M 210 390 C 230 430, 270 430, 290 390" fill="#2d3833" stroke="#4a5c54" stroke-width="2"/>
      <!-- Drawstrings -->
      <path d="M 230 410 L 225 470" stroke="#d1e0da" stroke-width="3" stroke-linecap="round"/>
      <path d="M 270 410 L 275 470" stroke="#d1e0da" stroke-width="3" stroke-linecap="round"/>

      <!-- Neck -->
      <path d="M 220 330 L 220 400 L 280 400 L 280 330 Z" fill="#ccb199" stroke="#3b2f26" stroke-width="2"/>

      <!-- Face Shape - Younger Slender Jaw -->
      <path d="M 180 180 C 180 120, 320 120, 320 180 C 320 240, 295 325, 250 345 C 205 325, 180 240, 180 180 Z" fill="url(#skin_kaelen)" stroke="#38281f" stroke-width="3"/>

      <!-- Messy Developer Hair Fringe -->
      <path d="M 170 175 C 160 110, 210 60, 250 58 C 290 60, 340 110, 330 175 C 310 130, 280 110, 250 110 C 220 110, 190 130, 170 175 Z" fill="#241e1a" stroke="#000000" stroke-width="3"/>
      <!-- Messy Bangs Over Forehead -->
      <path d="M 175 140 Q 210 170 230 150 Q 250 180 280 150 Q 310 170 325 140 Z" fill="#241e1a"/>

      <!-- Eyebrows - Concerned / Troubled Angle -->
      <path d="M 195 198 Q 220 190 238 200" fill="none" stroke="#241e1a" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 305 198 Q 280 190 262 200" fill="none" stroke="#241e1a" stroke-width="3.5" stroke-linecap="round"/>

      <!-- Eyes - Anxious / Wide Eyed -->
      <ellipse cx="215" cy="214" rx="14" ry="9" fill="#ffffff" stroke="#291e17" stroke-width="2"/>
      <circle cx="215" cy="214" r="6" fill="#1f1611"/>
      <circle cx="213" cy="212" r="2" fill="#ffffff"/>

      <ellipse cx="285" cy="214" rx="14" ry="9" fill="#ffffff" stroke="#291e17" stroke-width="2"/>
      <circle cx="285" cy="214" r="6" fill="#1f1611"/>
      <circle cx="283" cy="212" r="2" fill="#ffffff"/>

      <!-- Nose -->
      <path d="M 250 202 L 253 254 L 260 260 M 240 260 L 247 254" fill="none" stroke="#3b2b20" stroke-width="2" stroke-linecap="round"/>

      <!-- Mouth - Slightly Parted Concerned Expression -->
      <path d="M 225 302 Q 250 298 275 302" fill="none" stroke="#2e2118" stroke-width="2.5"/>
      <path d="M 230 302 Q 250 312 270 302" fill="#4d3527" opacity="0.6"/>
    </g>

    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#3b82f6" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#3b82f6" letter-spacing="2">CLASSIFIED POLICE FORENSIC COMPOSITE</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#f2dfce">SUBJECT: KAELEN MILLER • AGE: 19 • DEVELOPER</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#f59e0b">MISSING / VICTIM</text>
    </g>
  </svg>`,

  // 4. JULIAN VANCE - Audio Deepfake Engineer Suspect
  julian_vance: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_grad_julian" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#181824"/>
        <stop offset="50%" stop-color="#101018"/>
        <stop offset="100%" stop-color="#08080d"/>
      </linearGradient>
      <radialGradient id="vignette_julian" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <linearGradient id="skin_julian" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e8d5c5"/>
        <stop offset="50%" stop-color="#c2a793"/>
        <stop offset="100%" stop-color="#6e5746"/>
      </linearGradient>
      <pattern id="grid_pattern4" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg_grad_julian)"/>
    <rect width="100%" height="100%" fill="url(#grid_pattern4)"/>
    <rect width="100%" height="100%" fill="url(#vignette_julian)"/>

    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="11" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="120" x2="470" y2="120" stroke-dasharray="4,4"/>
      <text x="35" y="115">6'1" [185 cm]</text>
      <line x1="30" y1="200" x2="470" y2="200" stroke-dasharray="4,4"/>
      <text x="35" y="195">5'11" [180 cm]</text>
    </g>

    <!-- Character Portrait Group -->
    <g transform="translate(0, 25)">
      <!-- Crewneck Sweater -->
      <path d="M 110 520 C 130 420, 180 390, 210 390 L 290 390 C 320 390, 370 420, 390 520 Z" fill="#13131c" stroke="#33334d" stroke-width="2"/>

      <!-- Studio Headphones Around Neck -->
      <path d="M 180 350 Q 250 400 320 350" fill="none" stroke="#47475c" stroke-width="16" stroke-linecap="round"/>
      <rect x="160" y="325" width="28" height="42" rx="8" fill="#1f1f2e" stroke="#666680" stroke-width="2"/>
      <rect x="312" y="325" width="28" height="42" rx="8" fill="#1f1f2e" stroke="#666680" stroke-width="2"/>

      <!-- Neck -->
      <path d="M 220 320 L 220 380 L 280 380 L 280 320 Z" fill="#c2a793" stroke="#38291e" stroke-width="2"/>

      <!-- Face Shape -->
      <path d="M 178 180 C 178 115, 322 115, 322 180 C 322 240, 300 325, 250 345 C 200 325, 178 240, 178 180 Z" fill="url(#skin_julian)" stroke="#38281f" stroke-width="3"/>

      <!-- Modern Hair Cut - Undercut / Fade -->
      <path d="M 170 170 C 160 100, 210 55, 250 55 C 290 55, 340 100, 330 170 C 320 110, 290 85, 250 85 C 210 85, 180 110, 170 170 Z" fill="#141118" stroke="#000000" stroke-width="3"/>

      <!-- Eyebrows -->
      <path d="M 195 192 Q 220 182 238 194" fill="none" stroke="#17121c" stroke-width="4" stroke-linecap="round"/>
      <path d="M 305 192 Q 280 182 262 194" fill="none" stroke="#17121c" stroke-width="4" stroke-linecap="round"/>

      <!-- Eyes -->
      <ellipse cx="215" cy="210" rx="14" ry="8" fill="#ffffff" stroke="#211724" stroke-width="2"/>
      <circle cx="215" cy="210" r="6" fill="#130d17"/>
      <circle cx="213" cy="208" r="2" fill="#ffffff"/>

      <ellipse cx="285" cy="210" rx="14" ry="8" fill="#ffffff" stroke="#211724" stroke-width="2"/>
      <circle cx="285" cy="210" r="6" fill="#130d17"/>
      <circle cx="283" cy="208" r="2" fill="#ffffff"/>

      <!-- Nose -->
      <path d="M 250 198 L 253 250 L 260 256 M 240 256 L 247 250" fill="none" stroke="#332218" stroke-width="2" stroke-linecap="round"/>

      <!-- Stubble / Beard Shadow -->
      <path d="M 195 290 Q 250 350 305 290 C 285 345, 215 345, 195 290 Z" fill="#211a14" opacity="0.45"/>
      <path d="M 225 298 Q 250 295 275 298" fill="none" stroke="#211710" stroke-width="2.5"/>
    </g>

    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#10b981" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#10b981" letter-spacing="2">CLASSIFIED POLICE FORENSIC COMPOSITE</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#e8d5c5">SUBJECT: JULIAN VANCE • AUDIO SYNTHESIS ENGINEER</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#a855f7">DEEPFAKE SUSPECT</text>
    </g>
  </svg>`,

  // 5. DR. ARTHUR PENDELTON - Rogue Professor
  dr_pendelton: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_grad_doc" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1f1a14"/>
        <stop offset="50%" stop-color="#14100c"/>
        <stop offset="100%" stop-color="#080604"/>
      </linearGradient>
      <radialGradient id="vignette_doc" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <linearGradient id="skin_doc" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e0cfbe"/>
        <stop offset="50%" stop-color="#b59c86"/>
        <stop offset="100%" stop-color="#6e5643"/>
      </linearGradient>
      <pattern id="grid_pattern5" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg_grad_doc)"/>
    <rect width="100%" height="100%" fill="url(#grid_pattern5)"/>
    <rect width="100%" height="100%" fill="url(#vignette_doc)"/>

    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="11" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="120" x2="470" y2="120" stroke-dasharray="4,4"/>
      <text x="35" y="115">5'9" [175 cm]</text>
    </g>

    <!-- Character Portrait Group -->
    <g transform="translate(0, 25)">
      <!-- Tweed Jacket -->
      <path d="M 100 520 L 160 410 L 210 390 L 250 420 L 290 390 L 340 410 L 400 520 Z" fill="#2b231b" stroke="#524335" stroke-width="2"/>
      <polygon points="230,390 250,400 270,390 260,490 240,490" fill="#e2d2c2" stroke="#1f1a17" stroke-width="1.5"/>

      <!-- Neck -->
      <path d="M 215 340 L 215 400 L 285 400 L 285 340 Z" fill="#b59c86" stroke="#3d2c1f" stroke-width="2"/>

      <!-- Face Shape -->
      <path d="M 175 180 C 175 115, 325 115, 325 180 C 325 240, 310 330, 250 350 C 190 330, 175 240, 175 180 Z" fill="url(#skin_doc)" stroke="#38281f" stroke-width="3"/>

      <!-- Receding Grey Hair -->
      <path d="M 170 190 C 160 120, 200 90, 250 90 C 300 90, 340 120, 330 190 C 320 140, 290 125, 250 125 C 210 125, 180 140, 170 190 Z" fill="#8c827a" stroke="#000000" stroke-width="2.5"/>

      <!-- Round Glasses Spectacles -->
      <circle cx="215" cy="212" r="22" fill="none" stroke="#d4af37" stroke-width="3"/>
      <circle cx="285" cy="212" r="22" fill="none" stroke="#d4af37" stroke-width="3"/>
      <line x1="237" y1="212" x2="263" y2="212" stroke="#d4af37" stroke-width="3"/>

      <!-- Eyes Behind Glasses -->
      <ellipse cx="215" cy="212" rx="11" ry="7" fill="#ffffff" stroke="#2e1d15" stroke-width="1.5"/>
      <circle cx="215" cy="212" r="5" fill="#1c120c"/>

      <ellipse cx="285" cy="212" rx="11" ry="7" fill="#ffffff" stroke="#2e1d15" stroke-width="1.5"/>
      <circle cx="285" cy="212" r="5" fill="#1c120c"/>

      <!-- Nose -->
      <path d="M 250 205 L 254 256 L 262 262 M 238 262 L 246 256" fill="none" stroke="#332318" stroke-width="2"/>

      <!-- Full Grey Professor Beard & Mustache -->
      <path d="M 185 260 C 180 340, 220 365, 250 365 C 280 365, 320 340, 315 260 C 295 285, 205 285, 185 260 Z" fill="#a89d93" stroke="#4d443d" stroke-width="2"/>
    </g>

    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#f59e0b" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#f59e0b" letter-spacing="2">CLASSIFIED POLICE FORENSIC COMPOSITE</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#e0cfbe">SUBJECT: DR. ARTHUR PENDELTON • PROFESSOR</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#3b82f6">WITNESS / SUSPECT</text>
    </g>
  </svg>`,

  // 6. DAVID STERLING - Offshore Accountant
  david_sterling: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_grad_david" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141c18"/>
        <stop offset="50%" stop-color="#0c1210"/>
        <stop offset="100%" stop-color="#060807"/>
      </linearGradient>
      <radialGradient id="vignette_david" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <linearGradient id="skin_david" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ebd2bd"/>
        <stop offset="50%" stop-color="#c4a58b"/>
        <stop offset="100%" stop-color="#735740"/>
      </linearGradient>
      <pattern id="grid_pattern6" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg_grad_david)"/>
    <rect width="100%" height="100%" fill="url(#grid_pattern6)"/>
    <rect width="100%" height="100%" fill="url(#vignette_david)"/>

    <!-- Character Portrait Group -->
    <g transform="translate(0, 25)">
      <!-- Suit -->
      <path d="M 100 520 L 160 410 L 210 390 L 250 420 L 290 390 L 340 410 L 400 520 Z" fill="#0f1713" stroke="#2b3b33" stroke-width="2"/>
      <polygon points="230,390 250,400 270,390 260,490 240,490" fill="#ffffff" stroke="#1f1a17" stroke-width="1.5"/>

      <!-- Neck -->
      <path d="M 215 340 L 215 400 L 285 400 L 285 340 Z" fill="#c4a58b" stroke="#332318" stroke-width="2"/>

      <!-- Face Shape -->
      <path d="M 175 180 C 175 115, 325 115, 325 180 C 325 240, 310 330, 250 350 C 190 330, 175 240, 175 180 Z" fill="url(#skin_david)" stroke="#38281f" stroke-width="3"/>

      <!-- Hair - Neat Side Part -->
      <path d="M 168 180 C 160 115, 200 85, 250 85 C 300 85, 340 115, 332 180 C 320 130, 290 110, 250 110 C 210 110, 180 130, 168 180 Z" fill="#241b14" stroke="#000000" stroke-width="3"/>

      <!-- Rectangular Glasses -->
      <rect x="190" y="196" width="50" height="30" rx="4" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
      <rect x="260" y="196" width="50" height="30" rx="4" fill="none" stroke="#94a3b8" stroke-width="2.5"/>
      <line x1="240" y1="210" x2="260" y2="210" stroke="#94a3b8" stroke-width="2.5"/>

      <!-- Eyes -->
      <ellipse cx="215" cy="211" rx="12" ry="7" fill="#ffffff" stroke="#241b14" stroke-width="1.5"/>
      <circle cx="215" cy="211" r="5" fill="#140f0b"/>

      <ellipse cx="285" cy="211" rx="12" ry="7" fill="#ffffff" stroke="#241b14" stroke-width="1.5"/>
      <circle cx="285" cy="211" r="5" fill="#140f0b"/>

      <!-- Nose -->
      <path d="M 250 202 L 253 252 L 260 258 M 240 258 L 247 252" fill="none" stroke="#332218" stroke-width="2"/>

      <!-- Lip Line -->
      <path d="M 220 300 Q 250 302 280 300" fill="none" stroke="#211710" stroke-width="2.5"/>
    </g>

    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#22c55e" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#22c55e" letter-spacing="2">CLASSIFIED POLICE FORENSIC COMPOSITE</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#ebd2bd">SUBJECT: DAVID STERLING • ACCOUNTANT</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">FINANCIAL SUSPECT</text>
    </g>
  </svg>`,

  // 7. SOPHIA LIN - Freelance Artist & Victim
  sophia_lin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_grad_sophia" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1c1822"/>
        <stop offset="50%" stop-color="#120e18"/>
        <stop offset="100%" stop-color="#08060a"/>
      </linearGradient>
      <radialGradient id="vignette_sophia" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <linearGradient id="skin_sophia" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f5e6d8"/>
        <stop offset="50%" stop-color="#d6bca8"/>
        <stop offset="100%" stop-color="#806250"/>
      </linearGradient>
      <pattern id="grid_pattern_sophia" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg_grad_sophia)"/>
    <rect width="100%" height="100%" fill="url(#grid_pattern_sophia)"/>
    <rect width="100%" height="100%" fill="url(#vignette_sophia)"/>

    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="11" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="120" x2="470" y2="120" stroke-dasharray="4,4"/>
      <text x="35" y="115">5'6" [168 cm]</text>
      <line x1="30" y1="200" x2="470" y2="200" stroke-dasharray="4,4"/>
      <text x="35" y="195">AGE: 26 // ARTIST</text>
    </g>

    <!-- Character Portrait Group -->
    <g transform="translate(0, 25)">
      <!-- Stylish Artist Sweater & Scarf -->
      <path d="M 110 520 C 130 420, 180 390, 210 390 L 250 410 L 290 390 C 320 390, 370 420, 390 520 Z" fill="#1e1828" stroke="#48365e" stroke-width="2"/>
      <path d="M 200 390 C 220 425, 280 425, 300 390 C 280 435, 220 435, 200 390 Z" fill="#6b3ba7" opacity="0.8"/>

      <!-- Neck -->
      <path d="M 225 330 L 225 395 L 275 395 L 275 330 Z" fill="#d6bca8" stroke="#3b2b20" stroke-width="2"/>

      <!-- Face Shape -->
      <path d="M 180 175 C 180 110, 320 110, 320 175 C 320 235, 300 330, 250 345 C 200 330, 180 235, 180 175 Z" fill="url(#skin_sophia)" stroke="#38281f" stroke-width="3"/>

      <!-- Stylish Wavy Dark Bob Hair cut with Bangs -->
      <path d="M 165 180 C 150 110, 200 60, 250 58 C 300 60, 350 110, 335 180 C 350 240, 330 310, 310 310 C 290 280, 280 110, 250 110 C 220 110, 210 280, 190 310 C 170 310, 150 240, 165 180 Z" fill="#18121e" stroke="#000000" stroke-width="3"/>
      <!-- Soft Side Bangs -->
      <path d="M 175 145 Q 220 175 245 155 Q 275 175 325 145 Z" fill="#18121e"/>

      <!-- Round Artist Glasses Frames -->
      <circle cx="215" cy="208" r="20" fill="none" stroke="#e0a96d" stroke-width="2.5"/>
      <circle cx="285" cy="208" r="20" fill="none" stroke="#e0a96d" stroke-width="2.5"/>
      <line x1="235" y1="208" x2="265" y2="208" stroke="#e0a96d" stroke-width="2.5"/>

      <!-- Eyes Behind Glasses -->
      <ellipse cx="215" cy="208" rx="12" ry="7" fill="#ffffff" stroke="#291a13" stroke-width="1.5"/>
      <circle cx="215" cy="208" r="5" fill="#17100b"/>
      <circle cx="213" cy="206" r="1.5" fill="#ffffff"/>

      <ellipse cx="285" cy="208" rx="12" ry="7" fill="#ffffff" stroke="#291a13" stroke-width="1.5"/>
      <circle cx="285" cy="208" r="5" fill="#17100b"/>
      <circle cx="283" cy="206" r="1.5" fill="#ffffff"/>

      <!-- Eyebrows -->
      <path d="M 195 188 Q 215 180 232 192" fill="none" stroke="#1c1318" stroke-width="3" stroke-linecap="round"/>
      <path d="M 305 188 Q 285 180 268 192" fill="none" stroke="#1c1318" stroke-width="3" stroke-linecap="round"/>

      <!-- Nose -->
      <path d="M 250 198 L 253 250 L 260 256 M 240 256 L 247 250" fill="none" stroke="#3b2b20" stroke-width="2" stroke-linecap="round"/>

      <!-- Lips -->
      <path d="M 228 296 Q 250 292 272 296" fill="none" stroke="#331c17" stroke-width="2"/>
      <path d="M 228 296 Q 250 308 272 296 Z" fill="#7a3f33" stroke="#331c17" stroke-width="1.5"/>
    </g>

    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#ec4899" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#ec4899" letter-spacing="2">CLASSIFIED POLICE FORENSIC COMPOSITE</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#f5e6d8">SUBJECT: SOPHIA LIN • FREELANCE ARTIST</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#3b82f6">VICTIM / WITNESS</text>
    </g>
  </svg>`,

  // 8. DR. ARIS THORNE - Compliance Director & Financial Expert
  dr_thorne: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_grad_thorne" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141820"/>
        <stop offset="50%" stop-color="#0d1118"/>
        <stop offset="100%" stop-color="#06080c"/>
      </linearGradient>
      <radialGradient id="vignette_thorne" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <linearGradient id="skin_thorne" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e3d4c5"/>
        <stop offset="50%" stop-color="#ba9f8a"/>
        <stop offset="100%" stop-color="#695343"/>
      </linearGradient>
      <pattern id="grid_pattern_thorne" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg_grad_thorne)"/>
    <rect width="100%" height="100%" fill="url(#grid_pattern_thorne)"/>
    <rect width="100%" height="100%" fill="url(#vignette_thorne)"/>

    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="11" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="120" x2="470" y2="120" stroke-dasharray="4,4"/>
      <text x="35" y="115">6'0" [183 cm]</text>
      <line x1="30" y1="200" x2="470" y2="200" stroke-dasharray="4,4"/>
      <text x="35" y="195">FINANCIAL CRIMES TASK FORCE</text>
    </g>

    <!-- Character Portrait Group -->
    <g transform="translate(0, 25)">
      <!-- Director Dark Suit & Tie -->
      <path d="M 100 520 L 160 410 L 210 390 L 250 420 L 290 390 L 340 410 L 400 520 Z" fill="#0f141d" stroke="#2c3a52" stroke-width="2"/>
      <polygon points="210,390 250,470 290,390" fill="#1e2838" stroke="#3b4d6b" stroke-width="1.5"/>
      <polygon points="230,390 250,400 270,390 260,490 240,490" fill="#ffffff" stroke="#1f1a17" stroke-width="1.5"/>
      <polygon points="245,400 255,400 258,485 242,485" fill="#2563eb"/>

      <!-- Neck -->
      <path d="M 215 340 L 215 400 L 285 400 L 285 340 Z" fill="#ba9f8a" stroke="#3a2a1e" stroke-width="2"/>

      <!-- Head Structure -->
      <path d="M 175 180 C 175 110, 325 110, 325 180 C 325 240, 310 330, 250 350 C 190 330, 175 240, 175 180 Z" fill="url(#skin_thorne)" stroke="#2d2017" stroke-width="3"/>

      <!-- Salt and Pepper Hair -->
      <path d="M 168 180 C 160 110, 200 80, 250 78 C 300 80, 340 110, 332 180 C 320 125, 290 100, 250 100 C 210 100, 180 125, 168 180 Z" fill="#3a3735" stroke="#000000" stroke-width="2.5"/>
      <path d="M 175 140 Q 250 105 325 140 Q 250 120 175 140 Z" fill="#8c8580" opacity="0.6"/>

      <!-- Rectangular Frameless Glasses -->
      <rect x="190" y="196" width="48" height="28" rx="3" fill="none" stroke="#60a5fa" stroke-width="2"/>
      <rect x="262" y="196" width="48" height="28" rx="3" fill="none" stroke="#60a5fa" stroke-width="2"/>
      <line x1="238" y1="208" x2="262" y2="208" stroke="#60a5fa" stroke-width="2"/>

      <!-- Perceptive Eyes -->
      <ellipse cx="214" cy="210" rx="12" ry="7" fill="#ffffff" stroke="#241912" stroke-width="1.5"/>
      <circle cx="214" cy="210" r="5" fill="#140d0a"/>

      <ellipse cx="286" cy="210" rx="12" ry="7" fill="#ffffff" stroke="#241912" stroke-width="1.5"/>
      <circle cx="286" cy="210" r="5" fill="#140d0a"/>

      <!-- Eyebrows -->
      <path d="M 195 190 Q 220 182 236 192" fill="none" stroke="#241912" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 305 190 Q 280 182 264 192" fill="none" stroke="#241912" stroke-width="3.5" stroke-linecap="round"/>

      <!-- Nose -->
      <path d="M 250 200 L 253 252 L 260 258 M 240 258 L 247 252" fill="none" stroke="#38261b" stroke-width="2"/>

      <!-- Firm Lip Line -->
      <path d="M 222 302 Q 250 304 278 302" fill="none" stroke="#211610" stroke-width="2.5"/>
    </g>

    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#3b82f6" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#3b82f6" letter-spacing="2">CLASSIFIED POLICE FORENSIC COMPOSITE</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#e3d4c5">SUBJECT: DR. ARIS THORNE • COMPLIANCE DIRECTOR</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#10b981">EXPERT WITNESS</text>
    </g>
  </svg>`,

  // 9. ELEANOR MILLER - Distressed Relative / Mother
  eleanor_miller: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_grad_eleanor" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1c1618"/>
        <stop offset="50%" stop-color="#120e10"/>
        <stop offset="100%" stop-color="#080607"/>
      </linearGradient>
      <radialGradient id="vignette_eleanor" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <linearGradient id="skin_eleanor" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f0ded0"/>
        <stop offset="50%" stop-color="#cfb4a0"/>
        <stop offset="100%" stop-color="#806250"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg_grad_eleanor)"/>
    <rect width="100%" height="100%" fill="url(#vignette_eleanor)"/>
    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="11" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="120" x2="470" y2="120" stroke-dasharray="4,4"/><text x="35" y="115">5'6" [168 cm]</text>
      <line x1="30" y1="200" x2="470" y2="200" stroke-dasharray="4,4"/><text x="35" y="195">5'4" [162 cm]</text>
    </g>
    <g transform="translate(0, 25)">
      <!-- Wool Cardigan & Blouse -->
      <path d="M 120 520 L 170 410 L 220 390 L 250 420 L 280 390 L 330 410 L 380 520 Z" fill="#2d2226" stroke="#4a373f" stroke-width="2"/>
      <polygon points="220,390 250,450 280,390" fill="#eed9cb" stroke="#695144" stroke-width="1.5"/>
      <!-- Neck -->
      <path d="M 225 330 L 225 400 L 275 400 L 275 330 Z" fill="#cfb4a0" stroke="#4a372d" stroke-width="2"/>
      <!-- Head -->
      <path d="M 180 180 C 180 115, 320 115, 320 180 C 320 240, 295 330, 250 345 C 205 330, 180 240, 180 180 Z" fill="url(#skin_eleanor)" stroke="#38281f" stroke-width="3"/>
      <!-- Soft Wavy Hair -->
      <path d="M 165 190 C 150 110, 200 70, 250 68 C 300 70, 350 110, 335 190 C 345 280, 325 330, 310 350 C 310 260, 330 170, 305 120 C 270 95, 230 95, 195 120 C 170 170, 190 260, 190 350 C 175 330, 155 280, 165 190 Z" fill="#42342c" stroke="#211712" stroke-width="2.5"/>
      <!-- Eyes with worry lines -->
      <ellipse cx="215" cy="216" rx="13" ry="8" fill="#ffffff" stroke="#241b14" stroke-width="1.5"/>
      <circle cx="215" cy="216" r="5.5" fill="#2d1c14"/>
      <circle cx="213" cy="214" r="1.8" fill="#ffffff"/>
      <ellipse cx="285" cy="216" rx="13" ry="8" fill="#ffffff" stroke="#241b14" stroke-width="1.5"/>
      <circle cx="285" cy="216" r="5.5" fill="#2d1c14"/>
      <circle cx="283" cy="214" r="1.8" fill="#ffffff"/>
      <!-- Worried arched Eyebrows -->
      <path d="M 195 198 Q 215 186 235 194" fill="none" stroke="#291a10" stroke-width="3" stroke-linecap="round"/>
      <path d="M 305 198 Q 285 186 265 194" fill="none" stroke="#291a10" stroke-width="3" stroke-linecap="round"/>
      <!-- Tear / Distress lines -->
      <path d="M 200 230 Q 215 238 230 230" fill="none" stroke="#856b5a" stroke-width="1" opacity="0.6"/>
      <path d="M 270 230 Q 285 238 300 230" fill="none" stroke="#856b5a" stroke-width="1" opacity="0.6"/>
      <!-- Gentle distressed mouth -->
      <path d="M 225 304 Q 250 298 275 304" fill="none" stroke="#331e15" stroke-width="2.5" stroke-linecap="round"/>
    </g>
    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#f59e0b" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#f59e0b" letter-spacing="2">CLASSIFIED POLICE WITNESS DOSSIER</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SUBJECT: ELEANOR MILLER • DISTRESSED MOTHER</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#38bdf8">WITNESS</text>
    </g>
  </svg>`,

  // 10. LEO ROOMMATE - Informant & Casual Acquaintance
  leo_roommate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_grad_leo" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#14181a"/>
        <stop offset="50%" stop-color="#0e1214"/>
        <stop offset="100%" stop-color="#06090a"/>
      </linearGradient>
      <radialGradient id="vignette_leo" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <linearGradient id="skin_leo" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#eddac6"/>
        <stop offset="50%" stop-color="#c7ab91"/>
        <stop offset="100%" stop-color="#73573e"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg_grad_leo)"/>
    <rect width="100%" height="100%" fill="url(#vignette_leo)"/>
    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="11" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="120" x2="470" y2="120" stroke-dasharray="4,4"/><text x="35" y="115">5'11" [180 cm]</text>
    </g>
    <g transform="translate(0, 25)">
      <!-- Denim Jacket & T-Shirt -->
      <path d="M 110 520 L 160 410 L 215 390 L 250 420 L 285 390 L 340 410 L 390 520 Z" fill="#1b2a38" stroke="#314e68" stroke-width="2"/>
      <polygon points="215,390 250,440 285,390" fill="#2d3748" stroke="#4a5568" stroke-width="1.5"/>
      <!-- Neck -->
      <path d="M 220 330 L 220 400 L 280 400 L 280 330 Z" fill="#c7ab91" stroke="#38291d" stroke-width="2"/>
      <!-- Head -->
      <path d="M 175 180 C 175 115, 325 115, 325 180 C 325 245, 305 335, 250 350 C 195 335, 175 245, 175 180 Z" fill="url(#skin_leo)" stroke="#2b2018" stroke-width="3"/>
      <!-- Messy Tousled Hair -->
      <path d="M 160 170 C 150 110, 190 70, 250 68 C 310 70, 350 110, 340 170 C 330 130, 290 100, 250 100 C 210 100, 170 130, 160 170 Z" fill="#2b1d14" stroke="#120b06" stroke-width="3"/>
      <path d="M 190 90 L 220 130 L 250 85 L 280 130 L 310 90" fill="none" stroke="#3d291c" stroke-width="3"/>
      <!-- Eyes & Skeptical Brow -->
      <ellipse cx="215" cy="216" rx="13" ry="7.5" fill="#ffffff" stroke="#241b14" stroke-width="1.5"/>
      <circle cx="215" cy="216" r="5" fill="#1c241e"/>
      <ellipse cx="285" cy="216" rx="13" ry="7.5" fill="#ffffff" stroke="#241b14" stroke-width="1.5"/>
      <circle cx="285" cy="216" r="5" fill="#1c241e"/>
      <path d="M 195 196 Q 220 190 235 200" fill="none" stroke="#21150e" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 305 194 Q 280 188 265 198" fill="none" stroke="#21150e" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 220 300 Q 250 306 280 300" fill="none" stroke="#241912" stroke-width="2.5" stroke-linecap="round"/>
    </g>
    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#38bdf8" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#38bdf8" letter-spacing="2">CLASSIFIED POLICE INFORMANT LOG</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SUBJECT: LEO • ROOMMATE &amp; WITNESS</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#38bdf8">WITNESS</text>
    </g>
  </svg>`,

  // 11. MAYA PENDELTON - Geology Student / AI Voice Clone Victim
  maya_pendelton: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_grad_maya" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141a20"/>
        <stop offset="50%" stop-color="#0e1318"/>
        <stop offset="100%" stop-color="#06090c"/>
      </linearGradient>
      <radialGradient id="vignette_maya" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <linearGradient id="skin_maya" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f5e4d5"/>
        <stop offset="50%" stop-color="#dabcb0"/>
        <stop offset="100%" stop-color="#8c6c5e"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg_grad_maya)"/>
    <rect width="100%" height="100%" fill="url(#vignette_maya)"/>
    <!-- Voice Waveform Grid Overlay -->
    <g stroke="#38bdf8" stroke-opacity="0.15" stroke-width="1.5">
      <path d="M 40 100 Q 100 80 160 100 T 280 100 T 400 100 T 480 100" fill="none"/>
      <path d="M 40 120 Q 80 70 140 120 T 260 120 T 380 120 T 480 120" fill="none"/>
    </g>
    <g transform="translate(0, 25)">
      <!-- Campus Parka / Scarf -->
      <path d="M 120 520 L 170 410 L 220 390 L 250 420 L 280 390 L 330 410 L 380 520 Z" fill="#13231e" stroke="#24453a" stroke-width="2"/>
      <path d="M 180 390 C 210 430, 290 430, 320 390 Z" fill="#b45309" opacity="0.8"/>
      <!-- Neck -->
      <path d="M 225 330 L 225 400 L 275 400 L 275 330 Z" fill="#dabcb0" stroke="#3d2c23" stroke-width="2"/>
      <!-- Head -->
      <path d="M 180 175 C 180 110, 320 110, 320 175 C 320 235, 295 330, 250 345 C 205 330, 180 235, 180 175 Z" fill="url(#skin_maya)" stroke="#38281f" stroke-width="3"/>
      <!-- Ponytail & Fringe -->
      <path d="M 165 170 C 155 100, 200 65, 250 65 C 300 65, 345 100, 335 170 C 320 110, 290 90, 250 90 C 210 90, 180 110, 165 170 Z" fill="#1f140e" stroke="#000000" stroke-width="3"/>
      <path d="M 330 160 C 370 180, 380 260, 360 300" fill="none" stroke="#1f140e" stroke-width="12" stroke-linecap="round"/>
      <!-- Eyes with clear gaze -->
      <ellipse cx="215" cy="214" rx="13" ry="8" fill="#ffffff" stroke="#241b14" stroke-width="1.5"/>
      <circle cx="215" cy="214" r="5.5" fill="#1e293b"/>
      <circle cx="213" cy="212" r="1.8" fill="#ffffff"/>
      <ellipse cx="285" cy="214" rx="13" ry="8" fill="#ffffff" stroke="#241b14" stroke-width="1.5"/>
      <circle cx="285" cy="214" r="5.5" fill="#1e293b"/>
      <circle cx="283" cy="212" r="1.8" fill="#ffffff"/>
      <!-- Eyebrows -->
      <path d="M 195 195 Q 215 186 235 194" fill="none" stroke="#1f140e" stroke-width="3" stroke-linecap="round"/>
      <path d="M 305 195 Q 285 186 265 194" fill="none" stroke="#1f140e" stroke-width="3" stroke-linecap="round"/>
      <path d="M 225 300 Q 250 308 275 300" fill="none" stroke="#2e1b12" stroke-width="2.5" stroke-linecap="round"/>
    </g>
    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#38bdf8" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#38bdf8" letter-spacing="2">CLASSIFIED VICTIM BIOMETRIC FILE</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SUBJECT: MAYA PENDELTON • VOICE CLONE VICTIM</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#38bdf8">VICTIM</text>
    </g>
  </svg>`,

  // 12. CHIEF INVESTIGATOR VANCE - Digital Forensics Unit Lead
  chief_vance: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_grad_chief" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141824"/>
        <stop offset="50%" stop-color="#0d111c"/>
        <stop offset="100%" stop-color="#06080e"/>
      </linearGradient>
      <radialGradient id="vignette_chief" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <linearGradient id="skin_chief" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e8d5c4"/>
        <stop offset="50%" stop-color="#c2a48c"/>
        <stop offset="100%" stop-color="#6e533e"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg_grad_chief)"/>
    <rect width="100%" height="100%" fill="url(#vignette_chief)"/>
    <g transform="translate(0, 25)">
      <!-- Police Trenchcoat & Gold Badge -->
      <path d="M 100 520 L 150 400 L 210 380 L 250 410 L 290 380 L 350 400 L 400 520 Z" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
      <polygon points="210,380 250,460 290,380" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <polygon points="230,380 250,390 270,380 260,470 240,470" fill="#f8fafc" stroke="#0f172a" stroke-width="1.5"/>
      <polygon points="245,390 255,390 257,465 243,465" fill="#e11d48"/>
      <!-- Gold Shield Badge on Lapel -->
      <path d="M 170 430 L 185 425 L 200 430 L 195 455 L 185 465 L 175 455 Z" fill="#f59e0b" stroke="#fbbf24" stroke-width="1.5"/>
      <circle cx="185" cy="445" r="4" fill="#78350f"/>
      <!-- Neck -->
      <path d="M 215 330 L 215 390 L 285 390 L 285 330 Z" fill="#c2a48c" stroke="#3a2a1e" stroke-width="2"/>
      <!-- Head Structure -->
      <path d="M 175 175 C 175 110, 325 110, 325 175 C 325 240, 305 330, 250 345 C 195 330, 175 240, 175 175 Z" fill="url(#skin_chief)" stroke="#2b2018" stroke-width="3"/>
      <!-- Silver Templed Hair -->
      <path d="M 168 175 C 160 115, 200 85, 250 82 C 300 85, 340 115, 332 175 C 320 130, 290 105, 250 105 C 210 105, 180 130, 168 175 Z" fill="#334155" stroke="#0f172a" stroke-width="3"/>
      <path d="M 172 170 Q 200 130 220 150 M 328 170 Q 300 130 280 150" fill="none" stroke="#94a3b8" stroke-width="4"/>
      <!-- Determined Eyes -->
      <ellipse cx="215" cy="214" rx="14" ry="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
      <circle cx="215" cy="214" r="6" fill="#0f172a"/>
      <circle cx="213" cy="212" r="2" fill="#ffffff"/>
      <ellipse cx="285" cy="214" rx="14" ry="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
      <circle cx="285" cy="214" r="6" fill="#0f172a"/>
      <circle cx="283" cy="212" r="2" fill="#ffffff"/>
      <!-- Eyebrows -->
      <path d="M 195 196 Q 220 188 235 198" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
      <path d="M 305 196 Q 280 188 265 198" fill="none" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
      <!-- Nose & Mouth -->
      <path d="M 250 200 L 254 255 L 263 262 M 237 262 L 246 255" fill="none" stroke="#2e2118" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 220 300 Q 250 302 280 300" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
    </g>
    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#38bdf8" letter-spacing="2">CYBER FORENSICS UNIT • LEAD DOSSIER</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#f8fafc">SUBJECT: CHIEF INVESTIGATOR VANCE • FORENSICS DIRECTOR</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#3b82f6">COMMAND</text>
    </g>
  </svg>`,

  // 13. NOIR DETECTIVE TRAIN - Default High Quality Trenchcoat Silhouette
  noir_detective_train: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_grad_noir" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1c1917"/>
        <stop offset="50%" stop-color="#12100e"/>
        <stop offset="100%" stop-color="#080706"/>
      </linearGradient>
      <radialGradient id="vignette_noir" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <pattern id="grid_pattern7" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg_grad_noir)"/>
    <rect width="100%" height="100%" fill="url(#grid_pattern7)"/>
    <rect width="100%" height="100%" fill="url(#vignette_noir)"/>

    <g transform="translate(0, 30)">
      <!-- Popped Trenchcoat Collar -->
      <path d="M 100 520 L 150 380 L 220 360 L 250 400 L 280 360 L 350 380 L 400 520 Z" fill="#14110f" stroke="#3d342f" stroke-width="2"/>

      <!-- Shadow Silhouette Head -->
      <ellipse cx="250" cy="220" rx="75" ry="90" fill="#1c1714" stroke="#3a302a" stroke-width="3"/>

      <!-- Fedora Hat -->
      <path d="M 140 200 C 170 180, 330 180, 360 200 C 380 205, 380 215, 350 215 L 150 215 C 120 215, 120 205, 140 200 Z" fill="#0d0a08" stroke="#ff8533" stroke-width="1.5"/>
      <path d="M 180 200 C 180 120, 320 120, 320 200 Z" fill="#14100d" stroke="#ff8533" stroke-width="1.5"/>
      <rect x="180" y="185" width="140" height="15" fill="#8f1d1d"/>

      <!-- Glowing Cigarette / Mystery Light Accent -->
      <circle cx="230" cy="280" r="3" fill="#ff4500"/>
      <path d="M 230 280 Q 210 240 240 200" fill="none" stroke="#ffffff" stroke-opacity="0.2" stroke-width="2"/>
    </g>

    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#ff8533" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#ff8533" letter-spacing="2">CLASSIFIED POLICE FORENSIC COMPOSITE</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#d4c3b3">SUBJECT: UNIDENTIFIED SUSPECT / WITNESS</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#f59e0b">INVESTIGATION</text>
    </g>
  </svg>`
};

export const SCENE_SKETCHES = {
  // 1. WORKSTATION SCENE (Scene 1)
  workstation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_sc1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1814"/>
        <stop offset="50%" stop-color="#14100c"/>
        <stop offset="100%" stop-color="#0a0806"/>
      </linearGradient>
      <radialGradient id="vignette_sc1" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <pattern id="grid_sc1" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
      <filter id="pencil_sc1" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
        <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.15 0"/>
      </filter>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg_sc1)"/>
    <rect width="100%" height="100%" fill="url(#grid_sc1)"/>
    <rect width="100%" height="100%" fill="url(#vignette_sc1)"/>

    <!-- Forensic Grid Measurements -->
    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/>
      <text x="35" y="75">CAMERA ELEVATION 1.6M // ANGLE -15°</text>
      <line x1="30" y1="200" x2="470" y2="200" stroke-dasharray="4,4"/>
      <text x="35" y="195">MONITOR AXIS :: 1080P IDE VIEWPORT</text>
      <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/>
      <text x="35" y="355">DESK SURFACE LEVEL // TAMPINES GRID B-4</text>
    </g>

    <!-- Scene Artwork Drawing Group -->
    <g transform="translate(10, 20)">
      <!-- Desk Surface -->
      <polygon points="40,380 460,380 480,480 20,480" fill="#1c1612" stroke="#4a3b2c" stroke-width="2"/>

      <!-- Dual Monitors -->
      <!-- Left Main Monitor -->
      <rect x="80" y="140" width="220" height="180" rx="4" fill="#0f0c09" stroke="#524233" stroke-width="3"/>
      <rect x="90" y="150" width="200" height="160" fill="#17120e" stroke="#2b2017" stroke-width="1.5"/>
      <!-- IDE Code Lines -->
      <line x1="100" y1="165" x2="180" y2="165" stroke="#eab308" stroke-width="3" stroke-linecap="round"/>
      <line x1="110" y1="180" x2="220" y2="180" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <line x1="110" y1="195" x2="250" y2="195" stroke="#a855f7" stroke-width="2" stroke-linecap="round"/>
      <line x1="120" y1="210" x2="190" y2="210" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>
      <line x1="120" y1="225" x2="270" y2="225" stroke="#e2e8f0" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="100" y1="245" x2="210" y2="245" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>

      <!-- Right Secondary Monitor -->
      <rect x="315" y="160" width="130" height="150" rx="4" fill="#0f0c09" stroke="#524233" stroke-width="3"/>
      <rect x="323" y="168" width="114" height="134" fill="#17120e" stroke="#2b2017" stroke-width="1.5"/>
      <!-- Medical Invoice Document Display -->
      <rect x="335" y="180" width="90" height="110" fill="#2b2017" stroke="#8c3220" stroke-width="1"/>
      <text x="345" y="200" font-family="serif" font-size="9" fill="#ef4444" font-weight="bold">CLINIC BILL</text>
      <text x="345" y="215" font-family="monospace" font-size="8" fill="#e2d2be">TOTAL: $14,200</text>
      <rect x="345" y="230" width="70" height="18" fill="#8c3220" rx="2"/>
      <text x="350" y="242" font-family="monospace" font-size="8" fill="#ffffff" font-weight="bold">UNPAID</text>

      <!-- Monitor Stands -->
      <rect x="175" y="320" width="30" height="60" fill="#2b2017" stroke="#4a3b2c" stroke-width="2"/>
      <ellipse cx="190" cy="380" rx="40" ry="10" fill="#140f0b" stroke="#3d2e20" stroke-width="2"/>

      <!-- Desk Lamp Casting Light Cone -->
      <path d="M 400 380 Q 420 280 390 220 L 360 235 L 390 260" fill="none" stroke="#eab308" stroke-width="3"/>
      <!-- Lamp Shade -->
      <path d="M 350 220 L 390 200 L 400 240 L 355 250 Z" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
      <!-- Light Cone Overlay -->
      <polygon points="360,240 80,450 440,450" fill="#fef08a" opacity="0.08"/>

      <!-- Stacked Physical Medical Bills & Coffee Cup on Desk -->
      <rect x="60" y="400" width="70" height="45" fill="#3b2b1d" stroke="#78593a" stroke-width="1.5" transform="rotate(-6 95 422)"/>
      <rect x="65" y="395" width="70" height="45" fill="#4d3927" stroke="#a17a52" stroke-width="1.5" transform="rotate(4 100 417)"/>
      <text x="75" y="420" font-family="sans-serif" font-size="9" fill="#ef4444" font-weight="bold">OVERDUE</text>

      <!-- Keyboard & Mouse -->
      <rect x="160" y="415" width="140" height="35" rx="3" fill="#120e0a" stroke="#3d2f21" stroke-width="2"/>
      <ellipse cx="330" cy="430" rx="12" ry="18" fill="#120e0a" stroke="#3d2f21" stroke-width="2"/>

      <!-- Coffee Mug -->
      <ellipse cx="370" cy="410" rx="10" ry="8" fill="#291a10" stroke="#6e4a30" stroke-width="2"/>
      <path d="M 380 405 C 390 405, 390 415, 380 415" fill="none" stroke="#6e4a30" stroke-width="2"/>
    </g>

    <rect width="100%" height="100%" fill="#000000" filter="url(#pencil_sc1)" style="mix-blend-mode: overlay;"/>

    <!-- Police Forensic Stamp Badge -->
    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#f59e0b" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#f59e0b" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: KAELEN'S WORKSTATION • EXHIBIT A-1</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CRIME SCENE</text>
    </g>
  </svg>`,

  // 2. RECRUITMENT OFFER SCENE (Scene 2)
  recruitment: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_sc2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#18141c"/>
        <stop offset="50%" stop-color="#100c14"/>
        <stop offset="100%" stop-color="#080509"/>
      </linearGradient>
      <radialGradient id="vignette_sc2" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <pattern id="grid_sc2" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg_sc2)"/>
    <rect width="100%" height="100%" fill="url(#grid_sc2)"/>
    <rect width="100%" height="100%" fill="url(#vignette_sc2)"/>

    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/>
      <text x="35" y="75">EXECUTIVE SUITE // AURA TALENT DISPATCH</text>
      <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/>
      <text x="35" y="355">TABLE PERSPECTIVE // CONTRACT PRESENTATION</text>
    </g>

    <g transform="translate(10, 20)">
      <!-- High Rise Window Skyline Background -->
      <rect x="50" y="80" width="400" height="220" fill="#0f0b14" stroke="#3b2b42" stroke-width="2"/>
      <polygon points="100,280 130,160 160,280" fill="#24192b"/>
      <polygon points="180,280 210,120 250,280" fill="#2e1f38"/>
      <polygon points="270,280 300,180 340,280" fill="#24192b"/>
      <polygon points="360,280 390,140 420,280" fill="#1b1221"/>

      <!-- Executive Glass Desk -->
      <polygon points="30,340 470,340 490,470 10,470" fill="#19121f" stroke="#6b4682" stroke-width="2"/>

      <!-- Contract Document File Folder -->
      <polygon points="120,360 380,360 400,450 100,450" fill="#2d1c38" stroke="#a855f7" stroke-width="2"/>
      <rect x="140" y="375" width="220" height="60" fill="#efedfa" rx="2" stroke="#4c1d95" stroke-width="2"/>
      <text x="155" y="395" font-family="sans-serif" font-size="11" font-weight="extrabold" fill="#4c1d95">AURA EXECUTIVE CONTRACT</text>
      <text x="155" y="412" font-family="monospace" font-size="10" fill="#059669" font-weight="bold">SALARY: $8,500/MONTH</text>
      <text x="155" y="426" font-family="monospace" font-size="8" fill="#dc2626">REQUIREMENT: IMMEDIATE DEPARTURE</text>

      <!-- First Class Boarding Pass Ticket on Table -->
      <rect x="300" y="380" width="85" height="40" rx="3" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" transform="rotate(-10 342 400)"/>
      <text x="308" y="398" font-family="monospace" font-size="8" fill="#ffffff" font-weight="bold" transform="rotate(-10 342 400)">FLIGHT AG-802</text>
      <text x="308" y="410" font-family="monospace" font-size="7" fill="#dbeafe" transform="rotate(-10 342 400)">FIRST CLASS</text>

      <!-- Recruiter Hand Silhouette Presenting Contract -->
      <path d="M 380 460 C 350 420, 320 400, 280 395 C 260 392, 250 400, 270 410 C 300 425, 340 450, 360 470 Z" fill="#2d1f36" stroke="#a855f7" stroke-width="2"/>
    </g>

    <!-- Police Forensic Stamp Badge -->
    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#a855f7" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#a855f7" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: EXECUTIVE RECRUITMENT OFFER • EXHIBIT B-1</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CRIME SCENE</text>
    </g>
  </svg>`,

  // 3. OFFSHORE COMPOUND PERIMETER (Scene 3)
  compound: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_sc3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141818"/>
        <stop offset="50%" stop-color="#0c1010"/>
        <stop offset="100%" stop-color="#060808"/>
      </linearGradient>
      <radialGradient id="vignette_sc3" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <pattern id="grid_sc3" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg_sc3)"/>
    <rect width="100%" height="100%" fill="url(#grid_sc3)"/>
    <rect width="100%" height="100%" fill="url(#vignette_sc3)"/>

    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/>
      <text x="35" y="75">PERIMETER CONTROL // AURA ISLAND FACILITY</text>
      <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/>
      <text x="35" y="355">GUARD POST // PHONE &amp; PASSPORT LOCKERS</text>
    </g>

    <g transform="translate(10, 20)">
      <!-- Security Watchtower -->
      <polygon points="360,380 380,120 420,120 440,380" fill="#171f1d" stroke="#334743" stroke-width="2"/>
      <rect x="365" y="100" width="70" height="40" fill="#243330" stroke="#0ea5e9" stroke-width="2"/>
      <!-- Spotlight Beam -->
      <polygon points="380,130 50,450 250,450" fill="#e0f2fe" opacity="0.1"/>

      <!-- High Anti-Climb Fence with Razor Wire -->
      <line x1="20" y1="220" x2="480" y2="220" stroke="#334743" stroke-width="3"/>
      <line x1="20" y1="260" x2="480" y2="260" stroke="#334743" stroke-width="2"/>
      <line x1="20" y1="300" x2="480" y2="300" stroke="#334743" stroke-width="2"/>
      <line x1="20" y1="340" x2="480" y2="340" stroke="#334743" stroke-width="3"/>

      <!-- Razor Wire Loops -->
      <path d="M 20 210 Q 30 190 40 210 Q 50 190 60 210 Q 70 190 80 210 Q 90 190 100 210 Q 110 190 120 210 Q 130 190 140 210 Q 150 190 160 210 Q 170 190 180 210 Q 190 190 200 210 Q 210 190 220 210 Q 230 190 240 210 Q 250 190 260 210 Q 270 190 280 210 Q 290 190 300 210 Q 310 190 320 210 Q 330 190 340 210 Q 350 190 360 210 Q 370 190 380 210 Q 390 190 400 210 Q 410 190 420 210 Q 430 190 440 210 Q 450 190 460 210 Q 470 190 480 210" fill="none" stroke="#64748b" stroke-width="2"/>

      <!-- Confiscation Locker Bank in Guard House -->
      <rect x="80" y="320" width="220" height="130" fill="#141a18" stroke="#0ea5e9" stroke-width="2"/>
      <line x1="150" y1="320" x2="150" y2="450" stroke="#2a3834" stroke-width="2"/>
      <line x1="220" y1="320" x2="220" y2="450" stroke="#2a3834" stroke-width="2"/>
      <line x1="80" y1="385" x2="300" y2="385" stroke="#2a3834" stroke-width="2"/>

      <!-- Locker Labels -->
      <text x="90" y="350" font-family="monospace" font-size="9" fill="#ef4444" font-weight="bold">LOCKER #01</text>
      <text x="90" y="365" font-family="monospace" font-size="8" fill="#cbd5e1">PASSPORTS</text>

      <text x="160" y="350" font-family="monospace" font-size="9" fill="#ef4444" font-weight="bold">LOCKER #02</text>
      <text x="160" y="365" font-family="monospace" font-size="8" fill="#cbd5e1">PHONES</text>

      <rect x="90" y="400" width="120" height="30" fill="#dc2626" rx="3"/>
      <text x="96" y="418" font-family="monospace" font-size="9" fill="#ffffff" font-weight="bold">SEIZED ON ARRIVAL</text>
    </g>

    <!-- Police Forensic Stamp Badge -->
    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#0ea5e9" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#0ea5e9" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: AURA OFFSHORE COMPOUND • EXHIBIT C-1</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CRIME SCENE</text>
    </g>
  </svg>`,

  // 4. SUB-LEVEL 3 SCAM FLOOR (Scene 4)
  scam_floor: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_sc4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#181414"/>
        <stop offset="50%" stop-color="#100c0c"/>
        <stop offset="100%" stop-color="#080606"/>
      </linearGradient>
      <radialGradient id="vignette_sc4" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <pattern id="grid_sc4" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg_sc4)"/>
    <rect width="100%" height="100%" fill="url(#grid_sc4)"/>
    <rect width="100%" height="100%" fill="url(#vignette_sc4)"/>

    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/>
      <text x="35" y="75">SUB-LEVEL 3 // FORCED SCAM OPERATIONS</text>
      <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/>
      <text x="35" y="355">AUTOMATED CRYPTO SCAM &amp; BOT WORKSTATIONS</text>
    </g>

    <g transform="translate(10, 20)">
      <!-- Server Racks Background Overhead -->
      <rect x="40" y="90" width="100" height="240" fill="#141010" stroke="#522323" stroke-width="2"/>
      <line x1="40" y1="130" x2="140" y2="130" stroke="#331414" stroke-width="2"/>
      <line x1="40" y1="170" x2="140" y2="170" stroke="#331414" stroke-width="2"/>
      <line x1="40" y1="210" x2="140" y2="210" stroke="#331414" stroke-width="2"/>
      <circle cx="60" cy="110" r="3" fill="#ef4444"/>
      <circle cx="75" cy="110" r="3" fill="#22c55e"/>

      <!-- Workstation Desk Row Perspective -->
      <polygon points="120,320 460,320 480,460 60,460" fill="#1c1414" stroke="#8f2d2d" stroke-width="2"/>

      <!-- Multiple Scam Monitors Displaying Rigged Stock/Crypto Charts -->
      <!-- Monitor 1 -->
      <rect x="150" y="180" width="130" height="120" rx="3" fill="#0d0909" stroke="#b91c1c" stroke-width="2"/>
      <!-- Fake Chart Graph -->
      <path d="M 160 280 L 180 260 L 200 270 L 220 220 L 240 230 L 260 190" fill="none" stroke="#22c55e" stroke-width="2.5"/>
      <text x="160" y="200" font-family="monospace" font-size="8" fill="#ef4444" font-weight="bold">FAKE PROFIT: +500%</text>

      <!-- Monitor 2 -->
      <rect x="300" y="180" width="130" height="120" rx="3" fill="#0d0909" stroke="#b91c1c" stroke-width="2"/>
      <!-- Romance Scam Bot Script Window -->
      <rect x="310" y="195" width="110" height="90" fill="#1a0f0f" stroke="#7f1d1d" stroke-width="1"/>
      <text x="315" y="210" font-family="monospace" font-size="7" fill="#fca5a5">BOT SCRIPT ACTIVE</text>
      <text x="315" y="225" font-family="monospace" font-size="7" fill="#f87171">TARGET: VICTIM #908</text>
      <text x="315" y="240" font-family="monospace" font-size="7" fill="#ef4444">BLOCK WITHDRAWAL</text>

      <!-- YubiKey Hardware Token on Desk -->
      <rect x="220" y="380" width="40" height="16" rx="3" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/>
      <circle cx="230" cy="388" r="3" fill="#e0f2fe"/>
      <text x="270" y="392" font-family="monospace" font-size="8" fill="#93c5fd">YUBIKEY TOKEN #502</text>
    </g>

    <!-- Police Forensic Stamp Badge -->
    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#ef4444" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#ef4444" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: FORCED SCAM OPERATIONS FLOOR • EXHIBIT D-1</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CRIME SCENE</text>
    </g>
  </svg>`,

  // 5. TACTICAL BREACH & RESCUE (Scene 5)
  raid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bg_sc5" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141a24"/>
        <stop offset="50%" stop-color="#0c1018"/>
        <stop offset="100%" stop-color="#06080d"/>
      </linearGradient>
      <radialGradient id="vignette_sc5" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
      </radialGradient>
      <pattern id="grid_sc5" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg_sc5)"/>
    <rect width="100%" height="100%" fill="url(#grid_sc5)"/>
    <rect width="100%" height="100%" fill="url(#vignette_sc5)"/>

    <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
      <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/>
      <text x="35" y="75">INTERPOL CYBER TASK FORCE // TACTICAL BREACH</text>
      <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/>
      <text x="35" y="355">SERVER FARM EXTRACTION // EVIDENCE LOCKER #04</text>
    </g>

    <g transform="translate(10, 20)">
      <!-- Server Farm Racks Left and Right -->
      <rect x="30" y="100" width="110" height="260" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
      <rect x="360" y="100" width="110" height="260" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>

      <!-- Tactical Flashlight Beams Crossing -->
      <polygon points="120,160 450,450 300,450" fill="#e0f2fe" opacity="0.2"/>
      <polygon points="380,180 50,450 200,450" fill="#e0f2fe" opacity="0.2"/>

      <!-- Cyber Forensics SWAT Operative Silhouette -->
      <path d="M 180 420 C 180 340, 220 300, 250 300 C 280 300, 320 340, 320 420 Z" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
      <circle cx="250" cy="270" r="30" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
      <!-- Helmet Visor -->
      <rect x="230" y="260" width="40" height="15" rx="3" fill="#38bdf8"/>

      <!-- Master Evidence SSD Drive Seizure Bag in Foreground -->
      <rect x="180" y="380" width="140" height="60" fill="#1e293b" stroke="#22c55e" stroke-width="2" rx="4"/>
      <text x="190" y="402" font-family="monospace" font-size="9" fill="#22c55e" font-weight="bold">MASTER SSD SEIZED</text>
      <text x="190" y="418" font-family="monospace" font-size="8" fill="#94a3b8">TAG #9901 • HASH MATCH</text>

      <!-- Crime Scene Police Banner Across Foreground -->
      <polygon points="0,450 500,420 500,460 0,490" fill="#eab308" stroke="#854d0e" stroke-width="1.5" transform="rotate(-3 250 455)"/>
      <text x="20" y="472" font-family="sans-serif" font-size="12" font-weight="extrabold" fill="#000000" letter-spacing="3" transform="rotate(-3 250 455)">POLICE LINE DO NOT CROSS // CRIME SCENE FORENSICS</text>
    </g>

    <!-- Police Forensic Stamp Badge -->
    <g transform="translate(25, 515)">
      <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#3b82f6" stroke-width="1.5" opacity="0.95"/>
      <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#3b82f6" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
      <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: TACTICAL BREACH &amp; RESCUE • EXHIBIT E-1</text>
      <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#22c55e">EVIDENCE SECURED</text>
    </g>
  </svg>`
};

export const CASE_SCENE_SKETCHES: Record<string, string[]> = {
  // ==========================================
  // CASE 1: BORDERLAND TRAP (Operation Golden Silk)
  // ==========================================
  'borderland-trap': [
    // Scene 0: Workstation
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_bt0" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1814"/><stop offset="50%" stop-color="#14100c"/><stop offset="100%" stop-color="#0a0806"/>
        </linearGradient>
        <radialGradient id="vig_bt0" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
        <pattern id="grid_bt0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_bt0)"/>
      <rect width="100%" height="100%" fill="url(#grid_bt0)"/>
      <rect width="100%" height="100%" fill="url(#vig_bt0)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">CAMERA ELEVATION 1.6M // ANGLE -15°</text>
        <line x1="30" y1="200" x2="470" y2="200" stroke-dasharray="4,4"/><text x="35" y="195">MONITOR AXIS :: 1080P IDE VIEWPORT</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">DESK SURFACE LEVEL // TAMPINES GRID B-4</text>
      </g>
      <g transform="translate(10, 20)">
        <polygon points="40,380 460,380 480,480 20,480" fill="#1c1612" stroke="#4a3b2c" stroke-width="2"/>
        <rect x="80" y="140" width="220" height="180" rx="4" fill="#0f0c09" stroke="#524233" stroke-width="3"/>
        <rect x="90" y="150" width="200" height="160" fill="#17120e" stroke="#2b2017" stroke-width="1.5"/>
        <line x1="100" y1="165" x2="180" y2="165" stroke="#eab308" stroke-width="3" stroke-linecap="round"/>
        <line x1="110" y1="180" x2="220" y2="180" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
        <line x1="110" y1="195" x2="250" y2="195" stroke="#a855f7" stroke-width="2" stroke-linecap="round"/>
        <line x1="120" y1="210" x2="190" y2="210" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>
        <line x1="120" y1="225" x2="270" y2="225" stroke="#e2e8f0" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="100" y1="245" x2="210" y2="245" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
        <rect x="315" y="160" width="130" height="150" rx="4" fill="#0f0c09" stroke="#524233" stroke-width="3"/>
        <rect x="323" y="168" width="114" height="134" fill="#17120e" stroke="#2b2017" stroke-width="1.5"/>
        <rect x="335" y="180" width="90" height="110" fill="#2b2017" stroke="#8c3220" stroke-width="1"/>
        <text x="345" y="200" font-family="serif" font-size="9" fill="#ef4444" font-weight="bold">CLINIC BILL</text>
        <text x="345" y="215" font-family="monospace" font-size="8" fill="#e2d2be">TOTAL: $14,200</text>
        <rect x="345" y="230" width="70" height="18" fill="#8c3220" rx="2"/>
        <text x="350" y="242" font-family="monospace" font-size="8" fill="#ffffff" font-weight="bold">UNPAID</text>
        <rect x="175" y="320" width="30" height="60" fill="#2b2017" stroke="#4a3b2c" stroke-width="2"/>
        <ellipse cx="190" cy="380" rx="40" ry="10" fill="#140f0b" stroke="#3d2e20" stroke-width="2"/>
        <path d="M 400 380 Q 420 280 390 220 L 360 235 L 390 260" fill="none" stroke="#eab308" stroke-width="3"/>
        <path d="M 350 220 L 390 200 L 400 240 L 355 250 Z" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
        <polygon points="360,240 80,450 440,450" fill="#fef08a" opacity="0.08"/>
        <rect x="60" y="400" width="70" height="45" fill="#3b2b1d" stroke="#78593a" stroke-width="1.5" transform="rotate(-6 95 422)"/>
        <text x="75" y="420" font-family="sans-serif" font-size="9" fill="#ef4444" font-weight="bold">OVERDUE</text>
        <rect x="160" y="415" width="140" height="35" rx="3" fill="#120e0a" stroke="#3d2f21" stroke-width="2"/>
        <ellipse cx="330" cy="430" rx="12" ry="18" fill="#120e0a" stroke="#3d2f21" stroke-width="2"/>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#f59e0b" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#f59e0b" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: KAELEN'S WORKSTATION • EXHIBIT A-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CRIME SCENE</text>
      </g>
    </svg>`,

    // Scene 1: Recruitment Offer
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_bt1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#18141c"/><stop offset="50%" stop-color="#100c14"/><stop offset="100%" stop-color="#080509"/>
        </linearGradient>
        <radialGradient id="vig_bt1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
        <pattern id="grid_bt1" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_bt1)"/>
      <rect width="100%" height="100%" fill="url(#grid_bt1)"/>
      <rect width="100%" height="100%" fill="url(#vig_bt1)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">EXECUTIVE SUITE // AURA TALENT DISPATCH</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">TABLE PERSPECTIVE // CONTRACT PRESENTATION</text>
      </g>
      <g transform="translate(10, 20)">
        <rect x="50" y="80" width="400" height="220" fill="#0f0b14" stroke="#3b2b42" stroke-width="2"/>
        <polygon points="100,280 130,160 160,280" fill="#24192b"/>
        <polygon points="180,280 210,120 250,280" fill="#2e1f38"/>
        <polygon points="270,280 300,180 340,280" fill="#24192b"/>
        <polygon points="360,280 390,140 420,280" fill="#1b1221"/>
        <polygon points="30,340 470,340 490,470 10,470" fill="#19121f" stroke="#6b4682" stroke-width="2"/>
        <polygon points="120,360 380,360 400,450 100,450" fill="#2d1c38" stroke="#a855f7" stroke-width="2"/>
        <rect x="140" y="375" width="220" height="60" fill="#efedfa" rx="2" stroke="#4c1d95" stroke-width="2"/>
        <text x="155" y="395" font-family="sans-serif" font-size="11" font-weight="extrabold" fill="#4c1d95">AURA EXECUTIVE CONTRACT</text>
        <text x="155" y="412" font-family="monospace" font-size="10" fill="#059669" font-weight="bold">SALARY: $8,500/MONTH</text>
        <text x="155" y="426" font-family="monospace" font-size="8" fill="#dc2626">REQUIREMENT: IMMEDIATE DEPARTURE</text>
        <rect x="300" y="380" width="85" height="40" rx="3" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" transform="rotate(-10 342 400)"/>
        <text x="308" y="398" font-family="monospace" font-size="8" fill="#ffffff" font-weight="bold" transform="rotate(-10 342 400)">FLIGHT AG-802</text>
        <path d="M 380 460 C 350 420, 320 400, 280 395 C 260 392, 250 400, 270 410 C 300 425, 340 450, 360 470 Z" fill="#2d1f36" stroke="#a855f7" stroke-width="2"/>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#a855f7" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#a855f7" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: EXECUTIVE RECRUITMENT OFFER • EXHIBIT B-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CRIME SCENE</text>
      </g>
    </svg>`,

    // Scene 2: Perimeter Compound
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_bt2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#141818"/><stop offset="50%" stop-color="#0c1010"/><stop offset="100%" stop-color="#060808"/>
        </linearGradient>
        <radialGradient id="vig_bt2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
        <pattern id="grid_bt2" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_bt2)"/>
      <rect width="100%" height="100%" fill="url(#grid_bt2)"/>
      <rect width="100%" height="100%" fill="url(#vig_bt2)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">PERIMETER CONTROL // AURA ISLAND FACILITY</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">GUARD POST // PHONE &amp; PASSPORT LOCKERS</text>
      </g>
      <g transform="translate(10, 20)">
        <polygon points="360,380 380,120 420,120 440,380" fill="#171f1d" stroke="#334743" stroke-width="2"/>
        <rect x="365" y="100" width="70" height="40" fill="#243330" stroke="#0ea5e9" stroke-width="2"/>
        <polygon points="380,130 50,450 250,450" fill="#e0f2fe" opacity="0.1"/>
        <line x1="20" y1="220" x2="480" y2="220" stroke="#334743" stroke-width="3"/>
        <line x1="20" y1="260" x2="480" y2="260" stroke="#334743" stroke-width="2"/>
        <line x1="20" y1="300" x2="480" y2="300" stroke="#334743" stroke-width="2"/>
        <line x1="20" y1="340" x2="480" y2="340" stroke="#334743" stroke-width="3"/>
        <path d="M 20 210 Q 30 190 40 210 Q 50 190 60 210 Q 70 190 80 210 Q 90 190 100 210 Q 110 190 120 210 Q 130 190 140 210 Q 150 190 160 210 Q 170 190 180 210 Q 190 190 200 210 Q 210 190 220 210 Q 230 190 240 210 Q 250 190 260 210 Q 270 190 280 210 Q 290 190 300 210 Q 310 190 320 210 Q 330 190 340 210 Q 350 190 360 210 Q 370 190 380 210 Q 390 190 400 210 Q 410 190 420 210 Q 430 190 440 210 Q 450 190 460 210 Q 470 190 480 210" fill="none" stroke="#64748b" stroke-width="2"/>
        <rect x="80" y="320" width="220" height="130" fill="#141a18" stroke="#0ea5e9" stroke-width="2"/>
        <line x1="150" y1="320" x2="150" y2="450" stroke="#2a3834" stroke-width="2"/>
        <line x1="220" y1="320" x2="220" y2="450" stroke="#2a3834" stroke-width="2"/>
        <line x1="80" y1="385" x2="300" y2="385" stroke="#2a3834" stroke-width="2"/>
        <text x="90" y="350" font-family="monospace" font-size="9" fill="#ef4444" font-weight="bold">LOCKER #01</text>
        <text x="90" y="365" font-family="monospace" font-size="8" fill="#cbd5e1">PASSPORTS</text>
        <text x="160" y="350" font-family="monospace" font-size="9" fill="#ef4444" font-weight="bold">LOCKER #02</text>
        <text x="160" y="365" font-family="monospace" font-size="8" fill="#cbd5e1">PHONES</text>
        <rect x="90" y="400" width="120" height="30" fill="#dc2626" rx="3"/>
        <text x="96" y="418" font-family="monospace" font-size="9" fill="#ffffff" font-weight="bold">SEIZED ON ARRIVAL</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#0ea5e9" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#0ea5e9" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: AURA OFFSHORE COMPOUND • EXHIBIT C-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CRIME SCENE</text>
      </g>
    </svg>`,

    // Scene 3: Scam Floor
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_bt3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#181414"/><stop offset="50%" stop-color="#100c0c"/><stop offset="100%" stop-color="#080606"/>
        </linearGradient>
        <radialGradient id="vig_bt3" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
        <pattern id="grid_bt3" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_bt3)"/>
      <rect width="100%" height="100%" fill="url(#grid_bt3)"/>
      <rect width="100%" height="100%" fill="url(#vig_bt3)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">SUB-LEVEL 3 // FORCED SCAM OPERATIONS</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">AUTOMATED CRYPTO SCAM &amp; BOT WORKSTATIONS</text>
      </g>
      <g transform="translate(10, 20)">
        <rect x="40" y="90" width="100" height="240" fill="#141010" stroke="#522323" stroke-width="2"/>
        <line x1="40" y1="130" x2="140" y2="130" stroke="#331414" stroke-width="2"/>
        <line x1="40" y1="170" x2="140" y2="170" stroke="#331414" stroke-width="2"/>
        <polygon points="120,320 460,320 480,460 60,460" fill="#1c1414" stroke="#8f2d2d" stroke-width="2"/>
        <rect x="150" y="180" width="130" height="120" rx="3" fill="#0d0909" stroke="#b91c1c" stroke-width="2"/>
        <path d="M 160 280 L 180 260 L 200 270 L 220 220 L 240 230 L 260 190" fill="none" stroke="#22c55e" stroke-width="2.5"/>
        <text x="160" y="200" font-family="monospace" font-size="8" fill="#ef4444" font-weight="bold">FAKE PROFIT: +500%</text>
        <rect x="300" y="180" width="130" height="120" rx="3" fill="#0d0909" stroke="#b91c1c" stroke-width="2"/>
        <rect x="310" y="195" width="110" height="90" fill="#1a0f0f" stroke="#7f1d1d" stroke-width="1"/>
        <text x="315" y="210" font-family="monospace" font-size="7" fill="#fca5a5">BOT SCRIPT ACTIVE</text>
        <text x="315" y="225" font-family="monospace" font-size="7" fill="#f87171">TARGET: VICTIM #908</text>
        <text x="315" y="240" font-family="monospace" font-size="7" fill="#ef4444">BLOCK WITHDRAWAL</text>
        <rect x="220" y="380" width="40" height="16" rx="3" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/>
        <circle cx="230" cy="388" r="3" fill="#e0f2fe"/>
        <text x="270" y="392" font-family="monospace" font-size="8" fill="#93c5fd">YUBIKEY TOKEN #502</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#ef4444" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#ef4444" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: FORCED SCAM OPERATIONS FLOOR • EXHIBIT D-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CRIME SCENE</text>
      </g>
    </svg>`,

    // Scene 4: Raid & Rescue
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_bt4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#141a24"/><stop offset="50%" stop-color="#0c1018"/><stop offset="100%" stop-color="#06080d"/>
        </linearGradient>
        <radialGradient id="vig_bt4" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
        <pattern id="grid_bt4" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_bt4)"/>
      <rect width="100%" height="100%" fill="url(#grid_bt4)"/>
      <rect width="100%" height="100%" fill="url(#vig_bt4)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">INTERPOL CYBER TASK FORCE // TACTICAL BREACH</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">SERVER FARM EXTRACTION // EVIDENCE LOCKER #04</text>
      </g>
      <g transform="translate(10, 20)">
        <rect x="30" y="100" width="110" height="260" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
        <rect x="360" y="100" width="110" height="260" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
        <polygon points="120,160 450,450 300,450" fill="#e0f2fe" opacity="0.2"/>
        <polygon points="380,180 50,450 200,450" fill="#e0f2fe" opacity="0.2"/>
        <path d="M 180 420 C 180 340, 220 300, 250 300 C 280 300, 320 340, 320 420 Z" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
        <circle cx="250" cy="270" r="30" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
        <rect x="230" y="260" width="40" height="15" rx="3" fill="#38bdf8"/>
        <rect x="180" y="380" width="140" height="60" fill="#1e293b" stroke="#22c55e" stroke-width="2" rx="4"/>
        <text x="190" y="402" font-family="monospace" font-size="9" fill="#22c55e" font-weight="bold">MASTER SSD SEIZED</text>
        <text x="190" y="418" font-family="monospace" font-size="8" fill="#94a3b8">TAG #9901 • HASH MATCH</text>
        <polygon points="0,450 500,420 500,460 0,490" fill="#eab308" stroke="#854d0e" stroke-width="1.5" transform="rotate(-3 250 455)"/>
        <text x="20" y="472" font-family="sans-serif" font-size="12" font-weight="extrabold" fill="#000000" letter-spacing="3" transform="rotate(-3 250 455)">POLICE LINE DO NOT CROSS // CRIME SCENE FORENSICS</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#3b82f6" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#3b82f6" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: TACTICAL BREACH &amp; RESCUE • EXHIBIT E-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#22c55e">EVIDENCE SECURED</text>
      </g>
    </svg>`
  ],

  // ==========================================
  // CASE 2: QUANTUM HEIST (Quantum Ledger Heist)
  // ==========================================
  'quantum-heist': [
    // Scene 0: Vault Breach (Cracked Vault & Broken Laser Grid)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_qh0" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/><stop offset="50%" stop-color="#090d16"/><stop offset="100%" stop-color="#030712"/>
        </linearGradient>
        <radialGradient id="vig_qh0" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_qh0)"/>
      <rect width="100%" height="100%" fill="url(#vig_qh0)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">QUANTUM VAULT // LEVEL -4 SUBTERRANEAN</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">SECURITY STATUS: BREACHED // NITROGEN LEAK</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Heavy Vault Door Ajar -->
        <circle cx="200" cy="260" r="140" fill="#1e293b" stroke="#38bdf8" stroke-width="4"/>
        <circle cx="200" cy="260" r="100" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
        <path d="M 200 120 L 200 400 M 60 260 L 340 260" stroke="#0284c7" stroke-width="3"/>
        <!-- Nitrogen Frost Fog Overlay -->
        <polygon points="120,260 450,140 470,440" fill="#e0f2fe" opacity="0.15"/>
        <!-- Broken Laser Array Tripping -->
        <line x1="50" y1="180" x2="350" y2="180" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4"/>
        <line x1="50" y1="240" x2="380" y2="240" stroke="#ef4444" stroke-width="2"/>
        <line x1="50" y1="320" x2="350" y2="320" stroke="#ef4444" stroke-width="2" stroke-dasharray="10,6"/>
        <!-- Zero-Day Terminal Screen -->
        <rect x="280" y="320" width="160" height="110" rx="4" fill="#030712" stroke="#ef4444" stroke-width="2"/>
        <text x="290" y="342" font-family="monospace" font-size="9" fill="#ef4444" font-weight="bold">ZERO-DAY EXPLOIT ACTIVE</text>
        <text x="290" y="360" font-family="monospace" font-size="8" fill="#38bdf8">10,000 BTC IN FLIGHT</text>
        <text x="290" y="378" font-family="monospace" font-size="8" fill="#f59e0b">COOLING VALVE OVERRIDE</text>
        <rect x="290" y="390" width="140" height="18" fill="#dc2626" rx="2"/>
        <text x="298" y="402" font-family="monospace" font-size="8" fill="#ffffff" font-weight="bold">VAULT SEAL DESTROYED</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#030712" stroke="#38bdf8" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#38bdf8" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: QUANTUM VAULT BREACH • EXHIBIT Q-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CRIME SCENE</text>
      </g>
    </svg>`,

    // Scene 1: Ghost Cipher (Dilution Refrigerator & Ledger Matrix)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_qh1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1b4b"/><stop offset="50%" stop-color="#0f0e2f"/><stop offset="100%" stop-color="#050517"/>
        </linearGradient>
        <radialGradient id="vig_qh1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_qh1)"/>
      <rect width="100%" height="100%" fill="url(#vig_qh1)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">QUANTUM CORE // DILUTION REFRIGERATOR</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">CRYPTOGRAPHIC KEY EXCHANGE STREAM</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Dilution Refrigerator Cylinder hanging from top -->
        <rect x="200" y="60" width="100" height="60" fill="#312e81" stroke="#818cf8" stroke-width="2"/>
        <rect x="220" y="120" width="60" height="80" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
        <rect x="235" y="200" width="30" height="70" fill="#312e81" stroke="#a7f3d0" stroke-width="2"/>
        <path d="M 200 120 Q 150 180 180 250 M 300 120 Q 350 180 320 250" fill="none" stroke="#fbbf24" stroke-width="2"/>
        <!-- Intercepted Ledger Matrix Stream -->
        <rect x="60" y="310" width="380" height="130" fill="#0f172a" rx="4" stroke="#818cf8" stroke-width="2"/>
        <text x="75" y="335" font-family="monospace" font-size="9" fill="#a7f3d0" font-weight="bold">DARK WEB QUANTUM TRANSACTION STREAM</text>
        <text x="75" y="355" font-family="monospace" font-size="8" fill="#e0e7ff">INPUT KEY: 0x90A1...4F12 [DECRYPTED BY SHOR ALGORITHM]</text>
        <text x="75" y="375" font-family="monospace" font-size="8" fill="#f43f5e">DESTINATION: 12 ANONYMOUS COLD WALLETS</text>
        <text x="75" y="395" font-family="monospace" font-size="8" fill="#fbbf24">STATUS: NON-REVERSIBLE QUANTUM STATE</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#050517" stroke="#818cf8" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#818cf8" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: THE GHOST CIPHER CORE • EXHIBIT Q-2</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#a7f3d0">DECRYPTED</text>
      </g>
    </svg>`,

    // Scene 2: Air-Gapped Satellite Relay (Storm Roof Dish)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_qh2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0c1a24"/><stop offset="50%" stop-color="#060e14"/><stop offset="100%" stop-color="#020508"/>
        </linearGradient>
        <radialGradient id="vig_qh2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_qh2)"/>
      <rect width="100%" height="100%" fill="url(#vig_qh2)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">ROOFTOP RELAY // HIGH-FREQUENCY DISH</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">SATELLITE INTERCEPT BEAM // CUT FIBER</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Satellite Dish Array -->
        <path d="M 120 280 C 120 180, 280 180, 280 280 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
        <line x1="200" y1="230" x2="200" y2="150" stroke="#38bdf8" stroke-width="3"/>
        <circle cx="200" cy="150" r="10" fill="#f59e0b"/>
        <!-- High Frequency Laser Beam into Clouds -->
        <polygon points="195,140 205,140 320,40 280,40" fill="#06b6d4" opacity="0.4"/>
        <!-- Lightning Bolt Storm -->
        <path d="M 380 40 L 360 100 L 390 110 L 350 180" fill="none" stroke="#fef08a" stroke-width="3"/>
        <!-- Severed Fiber Optic Cable Conduit -->
        <rect x="60" y="360" width="160" height="30" rx="3" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>
        <text x="70" y="380" font-family="monospace" font-size="9" fill="#ef4444" font-weight="bold">CUT FIBER OPTIC CONDUIT</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#020508" stroke="#38bdf8" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#38bdf8" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: AIR-GAPPED SATELLITE RELAY • EXHIBIT Q-3</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#f59e0b">INTERCEPTED</text>
      </g>
    </svg>`,

    // Scene 3: Cold Storage Vault Pedestal
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_qh3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/><stop offset="50%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <radialGradient id="vig_qh3" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_qh3)"/>
      <rect width="100%" height="100%" fill="url(#vig_qh3)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">COLD STORAGE CHAMBER // TITANIUM CAPSULE</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">HARDWARE WALLET EXTRACTION // RECOVERED</text>
      </g>
      <g transform="translate(10, 20)">
        <polygon points="120,440 380,440 420,320 80,320" fill="#1e293b" stroke="#475569" stroke-width="2"/>
        <rect x="180" y="200" width="140" height="120" fill="#020617" stroke="#38bdf8" stroke-width="2" rx="6"/>
        <rect x="220" y="230" width="60" height="60" rx="30" fill="#38bdf8" opacity="0.3"/>
        <rect x="235" y="245" width="30" height="30" rx="4" fill="#38bdf8"/>
        <text x="210" y="305" font-family="monospace" font-size="8" fill="#a7f3d0" font-weight="bold">TITANIUM COLD CAPSULE</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#020617" stroke="#22c55e" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#22c55e" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: COLD STORAGE WALLET • EXHIBIT Q-4</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#22c55e">SECURED</text>
      </g>
    </svg>`
  ],

  // ==========================================
  // CASE 3: DEEPFAKE DYNASTY (Voice of Deceit)
  // ==========================================
  'deepfake-dynasty': [
    // Scene 0: Soundproof Audio Studio
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_df0" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2a1a10"/><stop offset="50%" stop-color="#180e08"/><stop offset="100%" stop-color="#0a0503"/>
        </linearGradient>
        <radialGradient id="vig_df0" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_df0)"/>
      <rect width="100%" height="100%" fill="url(#vig_df0)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">ACOUSTIC STUDIO // SOUNDPROOF ISOLATION BOOTH</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">SPECTRAL AUDIO WAVEFORM ANALYZER</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Acoustic Foam Wall Grid Pattern -->
        <rect x="40" y="100" width="420" height="180" fill="#180e08" stroke="#78350f" stroke-width="2"/>
        <line x1="40" y1="140" x2="460" y2="140" stroke="#451a03" stroke-width="1"/>
        <line x1="40" y1="180" x2="460" y2="180" stroke="#451a03" stroke-width="1"/>
        <line x1="40" y1="220" x2="460" y2="220" stroke="#451a03" stroke-width="1"/>
        <!-- Condenser Studio Mic on Boom Arm -->
        <path d="M 120 120 L 220 220 M 220 220 L 220 280" fill="none" stroke="#f59e0b" stroke-width="3"/>
        <circle cx="220" cy="280" r="16" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
        <!-- Studio Monitor Display Waveforms -->
        <rect x="120" y="320" width="280" height="120" fill="#0a0503" rx="4" stroke="#f59e0b" stroke-width="2"/>
        <path d="M 130 380 Q 150 320 170 380 Q 190 440 210 380 Q 230 310 250 380 Q 270 450 290 380 Q 310 330 330 380 Q 350 420 370 380" fill="none" stroke="#38bdf8" stroke-width="2"/>
        <path d="M 130 380 Q 150 340 170 380 Q 190 420 210 380 Q 230 330 250 380 Q 270 430 290 380 Q 310 350 330 380 Q 350 400 370 380" fill="none" stroke="#f43f5e" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="140" y="342" font-family="monospace" font-size="9" fill="#f59e0b" font-weight="bold">VOICE PRINT SPECTRAL MATCH: 99.8%</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#0a0503" stroke="#f59e0b" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#f59e0b" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: ACOUSTIC CLONING STUDIO • EXHIBIT DF-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CRIME SCENE</text>
      </g>
    </svg>`,

    // Scene 1: CEO Voice Clone Wire Dispatch
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_df1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1c1917"/><stop offset="50%" stop-color="#0c0a09"/><stop offset="100%" stop-color="#030202"/>
        </linearGradient>
        <radialGradient id="vig_df1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_df1)"/>
      <rect width="100%" height="100%" fill="url(#vig_df1)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">COMMAND TERMINAL // REAL-TIME AI VOICE SYNTH</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">EMERGENCY WIRE DISPATCH // $4,200,000 APPROVED</text>
      </g>
      <g transform="translate(10, 20)">
        <rect x="60" y="120" width="380" height="300" fill="#0c0a09" rx="6" stroke="#ea580c" stroke-width="2"/>
        <text x="80" y="150" font-family="monospace" font-size="11" fill="#f97316" font-weight="bold">AI SYNTHESIZER :: CEO VOICE MODEL #01</text>
        <line x1="80" y1="165" x2="420" y2="165" stroke="#78350f" stroke-width="1"/>
        <rect x="80" y="180" width="340" height="90" fill="#1c1917" stroke="#44403c" stroke-width="1"/>
        <text x="90" y="200" font-family="monospace" font-size="8" fill="#fef08a">AUDIO PAYLOAD: "Transfer $4.2M to Zurich account immediately."</text>
        <text x="90" y="220" font-family="monospace" font-size="8" fill="#22c55e">LATENCY: 42ms • NATURALNESS SCORE: 98.6%</text>
        <rect x="80" y="290" width="340" height="110" fill="#292524" stroke="#dc2626" stroke-width="2"/>
        <text x="90" y="315" font-family="serif" font-size="12" font-weight="bold" fill="#ef4444">BANK DISPATCH AUTHORIZATION</text>
        <text x="90" y="335" font-family="monospace" font-size="10" fill="#ffffff">BENEFICIARY: ZURICH SHELL HOLDINGS</text>
        <text x="90" y="355" font-family="monospace" font-size="10" fill="#22c55e">STATUS: WIRE EXECUTED (NON-REFUNDABLE)</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#030202" stroke="#ea580c" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#ea580c" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: CEO VOICE CLONE TERMINAL • EXHIBIT DF-2</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">FRAUDULENT</text>
      </g>
    </svg>`,

    // Scene 2: Offshore Bank Account Network
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_df2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#141824"/><stop offset="50%" stop-color="#0a0d14"/><stop offset="100%" stop-color="#030408"/>
        </linearGradient>
        <radialGradient id="vig_df2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_df2)"/>
      <rect width="100%" height="100%" fill="url(#vig_df2)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">FINANCIAL INTELLIGENCE // GLOBAL MONEY TRAIL</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">ZURICH &amp; CAYMAN SHELL COMPANY ROUTING TREE</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- World Node Diagram -->
        <circle cx="100" cy="220" r="30" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="80" y="225" font-family="monospace" font-size="8" fill="#ffffff">SINGAPORE</text>
        <circle cx="260" cy="180" r="35" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
        <text x="240" y="185" font-family="monospace" font-size="8" fill="#ffffff">ZURICH</text>
        <circle cx="400" cy="240" r="30" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <text x="380" y="245" font-family="monospace" font-size="8" fill="#ffffff">CAYMAN</text>
        <line x1="130" y1="210" x2="225" y2="185" stroke="#ef4444" stroke-width="3" stroke-dasharray="4,2"/>
        <line x1="295" y1="190" x2="370" y2="230" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4,2"/>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#030408" stroke="#38bdf8" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#38bdf8" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: OFFSHORE ACCOUNT NETWORK • EXHIBIT DF-3</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">LAUNDERED</text>
      </g>
    </svg>`
  ],

  // ==========================================
  // CASE 4: PHANTOM GRID (Power Plant Sabotage)
  // ==========================================
  'phantom-grid': [
    // Scene 0: SCADA Control Room Alpha
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_pg0" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1f1111"/><stop offset="50%" stop-color="#120909"/><stop offset="100%" stop-color="#050202"/>
        </linearGradient>
        <radialGradient id="vig_pg0" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_pg0)"/>
      <rect width="100%" height="100%" fill="url(#vig_pg0)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">SCADA CONTROL ROOM ALPHA // SECTOR 7</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">CASCADING GRID OVERLOAD // FREQUENCY DROPPING</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Wall-Sized Power Grid Display Screen -->
        <rect x="50" y="100" width="400" height="200" fill="#050202" rx="4" stroke="#ef4444" stroke-width="3"/>
        <!-- Grid Nodes and Lines -->
        <circle cx="100" cy="180" r="12" fill="#dc2626"/>
        <circle cx="200" cy="140" r="12" fill="#dc2626"/>
        <circle cx="300" cy="220" r="12" fill="#22c55e"/>
        <circle cx="380" cy="160" r="12" fill="#dc2626"/>
        <line x1="100" y1="180" x2="200" y2="140" stroke="#ef4444" stroke-width="3"/>
        <line x1="200" y1="140" x2="300" y2="220" stroke="#ef4444" stroke-width="3"/>
        <line x1="300" y1="220" x2="380" y2="160" stroke="#ef4444" stroke-width="3"/>
        <text x="70" y="280" font-family="monospace" font-size="12" fill="#ef4444" font-weight="extrabold">SYSTEM FAILURE: GRID FREQUENCY 48.2 Hz (CRITICAL)</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#050202" stroke="#ef4444" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#ef4444" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: CONTROL ROOM BLACKOUT • EXHIBIT PG-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CRITICAL</text>
      </g>
    </svg>`,

    // Scene 1: Substation 4 Physical Breach
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_pg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#17181c"/><stop offset="50%" stop-color="#0d0e12"/><stop offset="100%" stop-color="#040508"/>
        </linearGradient>
        <radialGradient id="vig_pg1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_pg1)"/>
      <rect width="100%" height="100%" fill="url(#vig_pg1)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">SUBSTATION 4 // TRANSFORMER YARD BREACH</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">ROGUE USB IMPLANT IN PLC CONTROL CABINET</text>
      </g>
      <g transform="translate(10, 20)">
        <rect x="80" y="120" width="160" height="240" fill="#1e293b" stroke="#64748b" stroke-width="3"/>
        <line x1="160" y1="120" x2="160" y2="60" stroke="#f59e0b" stroke-width="4"/>
        <circle cx="160" cy="50" r="15" fill="none" stroke="#f59e0b" stroke-width="3"/>
        <!-- SCADA Cabinet open with Rogue USB Stick -->
        <rect x="280" y="200" width="150" height="180" fill="#0f172a" stroke="#eab308" stroke-width="2"/>
        <rect x="310" y="260" width="40" height="15" rx="2" fill="#ef4444"/>
        <text x="360" y="272" font-family="monospace" font-size="8" fill="#ef4444" font-weight="bold">ROGUE USB</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#040508" stroke="#eab308" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#eab308" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: SUBSTATION 4 BREACH • EXHIBIT PG-2</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">SABOTAGED</text>
      </g>
    </svg>`,

    // Scene 2: Stuxnet Logic Analyzer
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_pg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1a0c0c"/><stop offset="50%" stop-color="#0f0606"/><stop offset="100%" stop-color="#050202"/>
        </linearGradient>
        <radialGradient id="vig_pg2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_pg2)"/>
      <rect width="100%" height="100%" fill="url(#vig_pg2)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">PLC LOGIC ANALYZER // OVERWRITTEN ASSEMBLY</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">TURBINE OVERHEAT EMERGENCY OVERRIDE</text>
      </g>
      <g transform="translate(10, 20)">
        <rect x="50" y="100" width="400" height="320" fill="#050202" rx="4" stroke="#dc2626" stroke-width="2"/>
        <text x="70" y="130" font-family="monospace" font-size="11" fill="#f87171" font-weight="bold">PLC LADDER LOGIC FORENSICS</text>
        <line x1="70" y1="145" x2="430" y2="145" stroke="#7f1d1d" stroke-width="1"/>
        <text x="70" y="170" font-family="monospace" font-size="9" fill="#22c55e">001: LD    SAFETY_VALVE_01</text>
        <text x="70" y="190" font-family="monospace" font-size="9" fill="#ef4444">002: NOP   [OVERWRITTEN BY PAYLOAD]</text>
        <text x="70" y="210" font-family="monospace" font-size="9" fill="#ef4444">003: JMP   0x8090_OVERHEAT</text>
        <rect x="70" y="240" width="360" height="150" fill="#1c0a0a" stroke="#ef4444" stroke-width="1.5"/>
        <text x="85" y="270" font-family="monospace" font-size="11" fill="#ef4444" font-weight="bold">WARNING: TURBINE COOLING OVERRIDE</text>
        <text x="85" y="295" font-family="monospace" font-size="9" fill="#ffffff">PRESSURE: 420 PSI (MAX 300)</text>
        <text x="85" y="320" font-family="monospace" font-size="9" fill="#f59e0b">PHYSICAL DAMAGE IMMINENT</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#050202" stroke="#dc2626" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#dc2626" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: STUXNET PLC PAYLOAD • EXHIBIT PG-3</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">MALICIOUS</text>
      </g>
    </svg>`
  ]
};

export function getSceneSketchArt(caseIdOrSceneIdx?: string | number, sceneIdxParam?: number): string {
  let caseId = 'borderland-trap';
  let sceneIdx = 0;

  if (typeof caseIdOrSceneIdx === 'number') {
    sceneIdx = caseIdOrSceneIdx;
  } else if (typeof caseIdOrSceneIdx === 'string') {
    caseId = caseIdOrSceneIdx;
    if (typeof sceneIdxParam === 'number') {
      sceneIdx = sceneIdxParam;
    }
  }

  const sketchesForCase = CASE_SCENE_SKETCHES[caseId] || CASE_SCENE_SKETCHES['borderland-trap'];
  const safeIdx = Math.max(0, Math.min(sceneIdx, sketchesForCase.length - 1));
  const rawSvg = sketchesForCase[safeIdx] || sketchesForCase[0];

  return encodeSvgDataUri(rawSvg);
}


// Helper function to resolve character name or suspect ID to police sketch art
export function getSuspectSketchArt(nameOrId: string, avatarFallback?: string): string {
  const clean = (nameOrId || '').toLowerCase();
  let result = SUSPECT_SKETCHES.noir_detective_train;

  if (clean.includes('eleanor')) {
    result = SUSPECT_SKETCHES.eleanor_miller;
  } else if (clean.includes('leo') || clean.includes('roommate')) {
    result = SUSPECT_SKETCHES.leo_roommate;
  } else if (clean.includes('maya')) {
    result = SUSPECT_SKETCHES.maya_pendelton;
  } else if (clean.includes('chief') || (clean.includes('vance') && clean.includes('investigator'))) {
    result = SUSPECT_SKETCHES.chief_vance;
  } else if (clean.includes('victor') || (clean.includes('sterling') && !clean.includes('david')) || clean.includes('operator')) {
    result = SUSPECT_SKETCHES.victor_sterling;
  } else if (clean.includes('elena') || (clean.includes('vance') && !clean.includes('julian') && !clean.includes('chief'))) {
    result = SUSPECT_SKETCHES.elena_vance;
  } else if (clean.includes('kaelen') || (clean.includes('miller') && !clean.includes('eleanor'))) {
    result = SUSPECT_SKETCHES.kaelen_miller;
  } else if (clean.includes('julian') || clean.includes('sam_coder')) {
    result = SUSPECT_SKETCHES.julian_vance;
  } else if (clean.includes('pendelton') || clean.includes('harrison') || clean.includes('arthur')) {
    result = SUSPECT_SKETCHES.dr_pendelton;
  } else if (clean.includes('david')) {
    result = SUSPECT_SKETCHES.david_sterling;
  } else if (clean.includes('sophia') || clean.includes('lin')) {
    result = SUSPECT_SKETCHES.sophia_lin;
  } else if (clean.includes('thorne') || clean.includes('aris')) {
    result = SUSPECT_SKETCHES.dr_thorne;
  } else if (avatarFallback?.trim()) {
    return encodeSvgDataUri(avatarFallback);
  }

  return encodeSvgDataUri(result);
}
