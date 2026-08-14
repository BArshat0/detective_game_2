// Cyber Detective - Forensic Scene Sketches Generator for All Cases and Scenes
import { encodeSvgDataUri } from './suspectSketches';

export const CASE_SCENE_SKETCHES: Record<string, string[]> = {
  // =========================================================================
  // CASE 1: THE PROMISE BEYOND THE BORDER (case_border_promise / borderland-trap)
  // =========================================================================
  'case_border_promise': [
    // Scene 0: Late Night Code & Family Dreams (Kaelen's Workstation)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_bp0" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1814"/><stop offset="50%" stop-color="#14100c"/><stop offset="100%" stop-color="#0a0806"/>
        </linearGradient>
        <radialGradient id="vig_bp0" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
        <pattern id="grid_bp0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_bp0)"/>
      <rect width="100%" height="100%" fill="url(#grid_bp0)"/>
      <rect width="100%" height="100%" fill="url(#vig_bp0)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">CAMERA ELEVATION 1.6M // TAMPINES GRID B-4</text>
        <line x1="30" y1="200" x2="470" y2="200" stroke-dasharray="4,4"/><text x="35" y="195">MONITOR AXIS :: 1080P REACT IDE VIEWPORT</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">DESK SURFACE LEVEL // MEDICAL DEBT LEDGER</text>
      </g>
      <g transform="translate(10, 20)">
        <polygon points="40,380 460,380 480,480 20,480" fill="#1c1612" stroke="#4a3b2c" stroke-width="2"/>
        <!-- Main IDE Monitor -->
        <rect x="80" y="130" width="230" height="190" rx="4" fill="#0f0c09" stroke="#524233" stroke-width="3"/>
        <rect x="90" y="140" width="210" height="170" fill="#17120e" stroke="#2b2017" stroke-width="1.5"/>
        <text x="100" y="160" font-family="monospace" font-size="9" fill="#38bdf8" font-weight="bold">// App.tsx - MedicalFundTracker</text>
        <line x1="100" y1="175" x2="220" y2="175" stroke="#eab308" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="110" y1="190" x2="260" y2="190" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
        <line x1="110" y1="205" x2="240" y2="205" stroke="#a855f7" stroke-width="2" stroke-linecap="round"/>
        <line x1="120" y1="220" x2="190" y2="220" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>
        <line x1="120" y1="235" x2="280" y2="235" stroke="#e2e8f0" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="100" y1="255" x2="230" y2="255" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
        <!-- Secondary Monitor: Unpaid Medical Bill -->
        <rect x="325" y="145" width="125" height="170" rx="4" fill="#0f0c09" stroke="#524233" stroke-width="3"/>
        <rect x="333" y="153" width="109" height="154" fill="#1c1210" stroke="#8c3220" stroke-width="1.5"/>
        <text x="343" y="175" font-family="sans-serif" font-size="9" fill="#ef4444" font-weight="bold">CLINIC INVOICE</text>
        <text x="343" y="195" font-family="monospace" font-size="8" fill="#e2d2be">TOTAL: $14,200</text>
        <text x="343" y="210" font-family="monospace" font-size="7" fill="#94a3b8">PATIENT: ELEANOR M.</text>
        <text x="343" y="222" font-family="monospace" font-size="7" fill="#94a3b8">PROCEDURE: KNEE</text>
        <rect x="343" y="240" width="85" height="20" fill="#8c3220" rx="2"/>
        <text x="352" y="254" font-family="monospace" font-size="9" fill="#ffffff" font-weight="bold">UNPAID OVERDUE</text>
        <!-- Desk Lamp & Glow -->
        <path d="M 410 380 Q 430 280 395 210 L 365 225 L 395 250" fill="none" stroke="#eab308" stroke-width="3"/>
        <path d="M 355 210 L 395 190 L 405 230 L 360 240 Z" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
        <polygon points="365,230 70,450 450,450" fill="#fef08a" opacity="0.08"/>
        <!-- Desk Items: Coffee Mug & Student Metro Card -->
        <ellipse cx="75" cy="410" rx="12" ry="9" fill="#291a10" stroke="#6e4a30" stroke-width="2"/>
        <rect x="110" y="405" width="45" height="28" rx="2" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" transform="rotate(-8 132 419)"/>
        <text x="114" y="422" font-family="monospace" font-size="7" fill="#ffffff" transform="rotate(-8 132 419)">METRO #8819</text>
      </g>
      <!-- Forensic Stamp Badge -->
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#f59e0b" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#f59e0b" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: KAELEN'S WORKSTATION • EXHIBIT A-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CRIME SCENE</text>
      </g>
    </svg>`,

    // Scene 1: The Unsolicited Executive Offer (Aura Talent Dispatch)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_bp1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#18141c"/><stop offset="50%" stop-color="#100c14"/><stop offset="100%" stop-color="#080509"/>
        </linearGradient>
        <radialGradient id="vig_bp1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_bp1)"/>
      <rect width="100%" height="100%" fill="url(#vig_bp1)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">EXECUTIVE SUITE // AURA TALENT DISPATCH</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">UNSOLICITED CONTRACT PRESENTATION</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Skyline Window Backdrop -->
        <rect x="50" y="80" width="400" height="220" fill="#0f0b14" stroke="#3b2b42" stroke-width="2"/>
        <polygon points="100,280 130,160 160,280" fill="#24192b"/>
        <polygon points="180,280 210,120 250,280" fill="#2e1f38"/>
        <polygon points="270,280 300,180 340,280" fill="#24192b"/>
        <polygon points="360,280 390,140 420,280" fill="#1b1221"/>
        <!-- Executive Table -->
        <polygon points="30,340 470,340 490,470 10,470" fill="#19121f" stroke="#6b4682" stroke-width="2"/>
        <!-- Contract Folder -->
        <polygon points="120,355 380,355 400,455 100,455" fill="#2d1c38" stroke="#a855f7" stroke-width="2"/>
        <rect x="135" y="370" width="230" height="70" fill="#efedfa" rx="3" stroke="#4c1d95" stroke-width="2"/>
        <text x="150" y="390" font-family="sans-serif" font-size="11" font-weight="extrabold" fill="#4c1d95">AURA EXECUTIVE CONTRACT</text>
        <text x="150" y="408" font-family="monospace" font-size="10" fill="#059669" font-weight="bold">SALARY: $8,500/MONTH (TAX FREE)</text>
        <text x="150" y="424" font-family="monospace" font-size="8" fill="#dc2626">REQUIREMENT: IMMEDIATE DEPARTURE</text>
        <!-- Flight Boarding Pass -->
        <rect x="300" y="380" width="85" height="42" rx="3" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" transform="rotate(-10 342 400)"/>
        <text x="308" y="398" font-family="monospace" font-size="8" fill="#ffffff" font-weight="bold" transform="rotate(-10 342 400)">FLIGHT AG-802</text>
        <text x="308" y="410" font-family="monospace" font-size="7" fill="#dbeafe" transform="rotate(-10 342 400)">FIRST CLASS</text>
        <!-- Hand Silhouette Presenting Contract -->
        <path d="M 380 460 C 350 420, 320 400, 280 395 C 260 392, 250 400, 270 410 C 300 425, 340 450, 360 470 Z" fill="#2d1f36" stroke="#a855f7" stroke-width="2"/>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#120e0c" stroke="#a855f7" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#a855f7" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: EXECUTIVE RECRUITMENT OFFER • EXHIBIT B-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CRIME SCENE</text>
      </g>
    </svg>`,

    // Scene 2: Official Contract & Video Calls (Virtual Call Terminal)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_bp2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#141c24"/><stop offset="50%" stop-color="#0c1218"/><stop offset="100%" stop-color="#06090d"/>
        </linearGradient>
        <radialGradient id="vig_bp2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_bp2)"/>
      <rect width="100%" height="100%" fill="url(#vig_bp2)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">ENCRYPTED VIDEO TERMINAL // AURA GLOBAL HR</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">AUTHENTICATED CONTRACT VERIFICATION STREAM</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Video Conference Window -->
        <rect x="50" y="90" width="220" height="170" rx="6" fill="#0b131e" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="160" cy="150" r="35" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <path d="M 125 210 C 125 185, 140 180, 160 180 C 180 180, 195 185, 195 210 Z" fill="#334155"/>
        <rect x="60" y="235" width="200" height="18" fill="#0369a1" rx="2"/>
        <text x="70" y="248" font-family="monospace" font-size="8" fill="#ffffff">ELENA VANCE // RECRUITER [LIVE 1080P]</text>
        <!-- Official PDF Contract with Corporate Seal -->
        <rect x="290" y="90" width="160" height="230" rx="4" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
        <text x="305" y="115" font-family="serif" font-size="9" font-weight="bold" fill="#0f172a">AURA GLOBAL LTD</text>
        <line x1="305" y1="125" x2="435" y2="125" stroke="#94a3b8" stroke-width="1"/>
        <text x="305" y="145" font-family="monospace" font-size="7" fill="#334155">POSITION: OVERSEAS LEAD</text>
        <text x="305" y="160" font-family="monospace" font-size="7" fill="#059669">SALARY: $8,500 USD/MO</text>
        <text x="305" y="175" font-family="monospace" font-size="7" fill="#2563eb">RELOCATION: $2,000 BONUS</text>
        <!-- Gold Corporate Seal -->
        <circle cx="370" cy="230" r="24" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
        <circle cx="370" cy="230" r="18" fill="#eab308" stroke="#a16207" stroke-width="1"/>
        <text x="355" y="234" font-family="serif" font-size="7" font-weight="bold" fill="#713f12">SEALED</text>
        <!-- Signatures -->
        <path d="M 310 280 Q 330 270 350 285 Q 370 275 390 280" fill="none" stroke="#1e293b" stroke-width="1.5"/>
        <text x="310" y="295" font-family="monospace" font-size="6" fill="#64748b">V. Sterling, Managing Dir.</text>
        <!-- Chat Dialogue Banner -->
        <rect x="50" y="340" width="400" height="85" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="65" y="365" font-family="monospace" font-size="9" fill="#38bdf8" font-weight="bold">RECRUITER CHAT STREAM:</text>
        <text x="65" y="385" font-family="sans-serif" font-size="9" fill="#e2e8f0">"Kaelen, pack your bags tonight. Your flight leaves at 07:00 tomorrow!"</text>
        <text x="65" y="405" font-family="monospace" font-size="8" fill="#22c55e">✓ RELOCATION BONUS APPROVED • PASSPORT VERIFIED</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#06090d" stroke="#38bdf8" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#38bdf8" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: VIDEO INTERVIEW &amp; CONTRACT • EXHIBIT C-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#f59e0b">VERIFIED</text>
      </g>
    </svg>`,

    // Scene 3: Tourist Visa & Crypto Deposit Pressure (Transit Terminal)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_bp3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1f1414"/><stop offset="50%" stop-color="#120a0a"/><stop offset="100%" stop-color="#070303"/>
        </linearGradient>
        <radialGradient id="vig_bp3" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_bp3)"/>
      <rect width="100%" height="100%" fill="url(#vig_bp3)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">AIRPORT TRANSIT GATE // IMMIGRATION CONCOURSE</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">CRYPTO ESCROW PRESSURE // 2-HOUR EXPIRATION</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Passport with Tourist Visa Stamp -->
        <rect x="50" y="100" width="180" height="240" rx="6" fill="#1e1b4b" stroke="#4338ca" stroke-width="2"/>
        <text x="80" y="130" font-family="serif" font-size="12" font-weight="bold" fill="#fbbf24">PASSPORT</text>
        <rect x="70" y="150" width="140" height="90" fill="#f8fafc" rx="3"/>
        <text x="80" y="170" font-family="sans-serif" font-size="8" fill="#0f172a">NAME: KAELEN MILLER</text>
        <text x="80" y="185" font-family="monospace" font-size="7" fill="#64748b">NAT: SGP • DOB: 2016</text>
        <!-- Red Tourist Stamp -->
        <rect x="75" y="200" width="130" height="30" fill="#dc2626" rx="2" transform="rotate(-6 140 215)"/>
        <text x="82" y="218" font-family="monospace" font-size="8" font-weight="bold" fill="#ffffff" transform="rotate(-6 140 215)">30-DAY TOURIST VISA ONLY</text>
        <text x="82" y="226" font-family="monospace" font-size="5" fill="#fecaca" transform="rotate(-6 140 215)">EMPLOYMENT PROHIBITED</text>
        <!-- Crypto Payment Screen with Countdown Timer -->
        <rect x="260" y="100" width="190" height="240" rx="6" fill="#0f0909" stroke="#ef4444" stroke-width="2"/>
        <text x="275" y="130" font-family="monospace" font-size="9" fill="#ef4444" font-weight="bold">URGENT DEPOSIT DEMAND</text>
        <!-- QR Code Placeholder -->
        <rect x="295" y="145" width="80" height="80" fill="#ffffff" rx="4"/>
        <rect x="305" y="155" width="20" height="20" fill="#000000"/>
        <rect x="345" y="155" width="20" height="20" fill="#000000"/>
        <rect x="305" y="195" width="20" height="20" fill="#000000"/>
        <rect x="330" y="180" width="15" height="15" fill="#000000"/>
        <text x="275" y="245" font-family="monospace" font-size="10" fill="#f59e0b" font-weight="bold">FEE: $450 USD CRYPTO</text>
        <!-- Countdown Timer -->
        <rect x="275" y="260" width="160" height="30" fill="#7f1d1d" rx="4"/>
        <text x="290" y="280" font-family="monospace" font-size="12" font-weight="bold" fill="#fef2f2">TIMER: 01:54:18</text>
        <text x="275" y="310" font-family="sans-serif" font-size="7" fill="#fca5a5">"Pay within 2h or flight ticket will be canceled"</text>
        <!-- Airport Flight Board Display in Foreground -->
        <rect x="50" y="360" width="400" height="80" rx="4" fill="#0a0505" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="65" y="385" font-family="monospace" font-size="10" fill="#f59e0b" font-weight="bold">DEPARTURES // GATE A12</text>
        <text x="65" y="405" font-family="monospace" font-size="9" fill="#22c55e">FLIGHT AG-802 -> BORDER TRANSIT AIRFIELD [BOARDING NOW]</text>
        <text x="65" y="425" font-family="monospace" font-size="8" fill="#ef4444">⚠️ ILLEGAL TOURIST WORK ENTRY DETECTED</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#070303" stroke="#ef4444" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#ef4444" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: TRANSIT VISA &amp; CRYPTO DEMAND • EXHIBIT D-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">RED FLAG</text>
      </g>
    </svg>`,

    // Scene 4: Passport Confiscation & Scripted Call (Compound Perimeter)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_bp4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#141818"/><stop offset="50%" stop-color="#0c1010"/><stop offset="100%" stop-color="#060808"/>
        </linearGradient>
        <radialGradient id="vig_bp4" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_bp4)"/>
      <rect width="100%" height="100%" fill="url(#vig_bp4)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">PERIMETER CONTROL // AURA ISLAND FACILITY</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">GUARD POST // PHONE &amp; PASSPORT LOCKERS</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Watchtower & Searchlight -->
        <polygon points="360,360 380,110 420,110 440,360" fill="#171f1d" stroke="#334743" stroke-width="2"/>
        <rect x="365" y="90" width="70" height="40" fill="#243330" stroke="#0ea5e9" stroke-width="2"/>
        <polygon points="380,120 50,440 250,440" fill="#e0f2fe" opacity="0.12"/>
        <!-- Razor Wire High Fencing -->
        <line x1="20" y1="180" x2="480" y2="180" stroke="#334743" stroke-width="3"/>
        <line x1="20" y1="220" x2="480" y2="220" stroke="#334743" stroke-width="2"/>
        <line x1="20" y1="260" x2="480" y2="260" stroke-dasharray="4,4" stroke="#334743" stroke-width="2"/>
        <path d="M 20 170 Q 30 150 40 170 Q 50 150 60 170 Q 70 150 80 170 Q 90 150 100 170 Q 110 150 120 170 Q 130 150 140 170 Q 150 150 160 170 Q 170 150 180 170 Q 190 150 200 170 Q 210 150 220 170 Q 230 150 240 170 Q 250 150 260 170 Q 270 150 280 170 Q 290 150 300 170 Q 310 150 320 170 Q 330 150 340 170 Q 350 150 360 170 Q 370 150 380 170 Q 390 150 400 170 Q 410 150 420 170 Q 430 150 440 170 Q 450 150 460 170 Q 470 150 480 170" fill="none" stroke="#64748b" stroke-width="2"/>
        <!-- Confiscation Locker Bank -->
        <rect x="60" y="270" width="260" height="150" fill="#141a18" stroke="#0ea5e9" stroke-width="2"/>
        <line x1="145" y1="270" x2="145" y2="420" stroke="#2a3834" stroke-width="2"/>
        <line x1="230" y1="270" x2="230" y2="420" stroke="#2a3834" stroke-width="2"/>
        <line x1="60" y1="345" x2="320" y2="345" stroke="#2a3834" stroke-width="2"/>
        <text x="75" y="300" font-family="monospace" font-size="9" fill="#ef4444" font-weight="bold">LOCKER #01</text>
        <text x="75" y="315" font-family="monospace" font-size="8" fill="#cbd5e1">PASSPORTS [120]</text>
        <text x="160" y="300" font-family="monospace" font-size="9" fill="#ef4444" font-weight="bold">LOCKER #02</text>
        <text x="160" y="315" font-family="monospace" font-size="8" fill="#cbd5e1">PHONES [120]</text>
        <rect x="75" y="360" width="230" height="40" fill="#dc2626" rx="3"/>
        <text x="85" y="385" font-family="monospace" font-size="10" fill="#ffffff" font-weight="bold">SEIZED ON INGRESS // NO EXIT</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#060808" stroke="#0ea5e9" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#0ea5e9" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: COMPOUND INGRESS &amp; CONFISCATION • EXHIBIT E-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">CONFISCATED</text>
      </g>
    </svg>`,

    // Scene 5: The Cyber Crime Division Responds (Tactical Rescue & Server Seizure)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_bp5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#141a24"/><stop offset="50%" stop-color="#0c1018"/><stop offset="100%" stop-color="#06080d"/>
        </linearGradient>
        <radialGradient id="vig_bp5" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_bp5)"/>
      <rect width="100%" height="100%" fill="url(#vig_bp5)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">INTERPOL CYBER TASK FORCE // TACTICAL BREACH</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">SERVER FARM EXTRACTION // EVIDENCE LOCKER #04</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Server Racks Left and Right -->
        <rect x="30" y="100" width="110" height="260" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
        <rect x="360" y="100" width="110" height="260" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
        <!-- Tactical Flashlight Beams -->
        <polygon points="120,160 450,450 300,450" fill="#e0f2fe" opacity="0.2"/>
        <polygon points="380,180 50,450 200,450" fill="#e0f2fe" opacity="0.2"/>
        <!-- Cyber Forensics SWAT Operative Silhouette -->
        <path d="M 180 420 C 180 340, 220 300, 250 300 C 280 300, 320 340, 320 420 Z" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
        <circle cx="250" cy="270" r="30" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
        <rect x="230" y="260" width="40" height="15" rx="3" fill="#38bdf8"/>
        <!-- Master SSD Drive Seizure Bag -->
        <rect x="175" y="375" width="150" height="65" fill="#1e293b" stroke="#22c55e" stroke-width="2" rx="4"/>
        <text x="185" y="398" font-family="monospace" font-size="9" fill="#22c55e" font-weight="bold">MASTER SSD SEIZED</text>
        <text x="185" y="415" font-family="monospace" font-size="8" fill="#94a3b8">TAG #9901 • HASH MATCH</text>
        <text x="185" y="430" font-family="monospace" font-size="7" fill="#a7f3d0">120 VICTIMS RESCUED</text>
        <!-- Police Line Banner -->
        <polygon points="0,450 500,420 500,460 0,490" fill="#eab308" stroke="#854d0e" stroke-width="1.5" transform="rotate(-3 250 455)"/>
        <text x="20" y="472" font-family="sans-serif" font-size="12" font-weight="extrabold" fill="#000000" letter-spacing="3" transform="rotate(-3 250 455)">POLICE LINE DO NOT CROSS // CRIME SCENE FORENSICS</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#06080d" stroke="#3b82f6" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#3b82f6" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: TASK FORCE BREACH &amp; RESCUE • EXHIBIT F-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#22c55e">SECURED</text>
      </g>
    </svg>`
  ],

  // =========================================================================
  // CASE 2: THE ECHOES IN THE STATIC (case_echoes_static)
  // =========================================================================
  'case_echoes_static': [
    // Scene 0: Morning Goodbye & Mountain Vlog (Maya's Camp Vlog)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_es0" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#141e28"/><stop offset="50%" stop-color="#0c131a"/><stop offset="100%" stop-color="#06090e"/>
        </linearGradient>
        <radialGradient id="vig_es0" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_es0)"/>
      <rect width="100%" height="100%" fill="url(#vig_es0)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">NORTH PASS SECTOR // ELEVATION 2,400M</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">PUBLIC YOUTUBE AUDIO HARVESTING SOURCE</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Mountain Ridge Silhouette -->
        <polygon points="20,280 120,120 220,240 320,100 440,260 480,280" fill="#132332" stroke="#2563eb" stroke-width="2"/>
        <polygon points="60,280 180,160 260,260" fill="#1a3145"/>
        <polygon points="280,280 360,150 440,280" fill="#1a3145"/>
        <!-- Camping Dome Tent -->
        <path d="M 60 380 Q 140 260 220 380 Z" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
        <path d="M 140 260 L 140 380" stroke="#38bdf8" stroke-width="2"/>
        <polygon points="120,380 140,320 160,380" fill="#0c4a6e"/>
        <!-- DSLR Camera on Tripod with Shotgun Mic -->
        <line x1="340" y1="380" x2="360" y2="260" stroke="#94a3b8" stroke-width="3"/>
        <line x1="380" y1="380" x2="360" y2="260" stroke="#94a3b8" stroke-width="3"/>
        <line x1="360" y1="380" x2="360" y2="260" stroke="#94a3b8" stroke-width="3"/>
        <rect x="335" y="225" width="50" height="35" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="360" cy="242" r="12" fill="#0284c7" stroke="#e0f2fe" stroke-width="2"/>
        <!-- Red Recording Tally Light -->
        <circle cx="375" cy="232" r="3" fill="#ef4444"/>
        <!-- Shotgun Mic on Top -->
        <rect x="330" y="210" width="40" height="10" rx="3" fill="#334155" stroke="#64748b" stroke-width="1.5"/>
        <!-- YouTube Vlog Display Overlay -->
        <rect x="50" y="395" width="400" height="75" rx="4" fill="#030712" stroke="#ef4444" stroke-width="1.5"/>
        <rect x="60" y="405" width="55" height="55" fill="#1e293b" rx="2"/>
        <polygon points="80,425 80,445 98,435" fill="#ef4444"/>
        <text x="125" y="422" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff">YOUTUBE: "North Pass Geology Vlog Day 1"</text>
        <text x="125" y="438" font-family="monospace" font-size="8" fill="#38bdf8">AUDIO CLONING SOURCE • 2:14 MIN CLEAN SPEECH</text>
        <text x="125" y="454" font-family="monospace" font-size="7" fill="#ef4444">⚠️ HARVESTED BY AI VOICE SYNTHESIZER</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#06090e" stroke="#38bdf8" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#38bdf8" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: NORTH PASS GEOLOGY VLOG • EXHIBIT ES-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">HARVESTED</text>
      </g>
    </svg>`,

    // Scene 1: The Incoming Satellite Call (Dr. Pendelton's Study)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_es1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#241a14"/><stop offset="50%" stop-color="#140e0a"/><stop offset="100%" stop-color="#080504"/>
        </linearGradient>
        <radialGradient id="vig_es1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_es1)"/>
      <rect width="100%" height="100%" fill="url(#vig_es1)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">PROFESSOR STUDY // UNIVERSITY RESIDENCE</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">INCOMING VOIP CALL INTERCEPT // SPOOFED ID</text>
      </g>
      <g transform="translate(10, 20)">
        <polygon points="40,360 460,360 480,480 20,480" fill="#2b1a10" stroke="#5c3820" stroke-width="2"/>
        <!-- Gooseneck Lamp -->
        <path d="M 80 360 Q 60 220 110 190" fill="none" stroke="#d97706" stroke-width="4"/>
        <path d="M 100 180 L 130 170 L 140 210 L 105 215 Z" fill="#b45309" stroke="#f59e0b" stroke-width="2"/>
        <polygon points="120,200 40,430 320,430" fill="#fef08a" opacity="0.09"/>
        <!-- Stack of History Exams Graded in Red Ink -->
        <rect x="70" y="380" width="100" height="60" fill="#fdf8f6" stroke="#94a3b8" stroke-width="1.5" transform="rotate(-5 120 410)"/>
        <text x="85" y="405" font-family="serif" font-size="11" fill="#dc2626" font-weight="bold" transform="rotate(-5 120 410)">GRADE: A-</text>
        <text x="85" y="420" font-family="sans-serif" font-size="8" fill="#334155" transform="rotate(-5 120 410)">HIST 302 EXAM</text>
        <!-- Reading Glasses on Desk -->
        <ellipse cx="190" cy="405" rx="14" ry="10" fill="none" stroke="#94a3b8" stroke-width="2"/>
        <ellipse cx="225" cy="405" rx="14" ry="10" fill="none" stroke="#94a3b8" stroke-width="2"/>
        <line x1="204" y1="405" x2="211" y2="405" stroke="#94a3b8" stroke-width="2"/>
        <!-- Smartphone Buzzing with Spoofed Satellite Caller ID -->
        <rect x="255" y="140" width="180" height="270" rx="16" fill="#030712" stroke="#ef4444" stroke-width="3"/>
        <rect x="265" y="155" width="160" height="240" rx="10" fill="#111827"/>
        <circle cx="345" cy="210" r="30" fill="#1f2937" stroke="#ef4444" stroke-width="2"/>
        <polygon points="340,195 355,210 340,225" fill="#ef4444"/>
        <text x="280" y="260" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">EMERGENCY SATELLITE</text>
        <text x="285" y="280" font-family="monospace" font-size="9" fill="#f87171">+1 (800) 555-EMRG</text>
        <text x="290" y="298" font-family="monospace" font-size="7" fill="#cbd5e1">LOCATION: NORTH PASS</text>
        <!-- Swipe to Answer Slider -->
        <rect x="280" y="325" width="130" height="35" rx="18" fill="#15803d" stroke="#4ade80" stroke-width="1.5"/>
        <text x="305" y="347" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff">SWIPE TO ANSWER</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#080504" stroke="#f59e0b" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#f59e0b" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: SPOOFED SATELLITE CALL • EXHIBIT ES-2</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">INTERCEPT</text>
      </g>
    </svg>`,

    // Scene 2: The Panicked Voice Stream (AI Voice Spectral Forensics)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_es2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0c1a24"/><stop offset="50%" stop-color="#060f17"/><stop offset="100%" stop-color="#02060a"/>
        </linearGradient>
        <radialGradient id="vig_es2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_es2)"/>
      <rect width="100%" height="100%" fill="url(#vig_es2)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">ACOUSTIC FORENSIC LAB // SPECTRAL FREQUENCY</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">AI CLONED HARMONICS VS HUMAN ORGANIC TIMBRE</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Top Track: Real Maya Voice Harmonics -->
        <rect x="40" y="90" width="420" height="150" rx="6" fill="#030712" stroke="#0ea5e9" stroke-width="2"/>
        <text x="55" y="115" font-family="monospace" font-size="9" fill="#38bdf8" font-weight="bold">SOURCE A: MAYA'S ORGANIC SPEECH [YOUTUBE]</text>
        <!-- Organic Smooth Harmonics Wave -->
        <path d="M 60 170 Q 90 120 120 170 T 180 170 T 240 170 T 300 170 T 360 170 T 420 170" fill="none" stroke="#22c55e" stroke-width="2.5"/>
        <path d="M 60 170 Q 80 140 100 170 T 140 170 T 180 170 T 220 170 T 260 170 T 300 170 T 340 170 T 380 170 T 420 170" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.6"/>
        <text x="55" y="225" font-family="monospace" font-size="8" fill="#a7f3d0">NATURAL TIMBRE • DYNAMIC LUNG INHALATION MARKERS</text>
        <!-- Bottom Track: Synthetic AI Cloned Stream -->
        <rect x="40" y="260" width="420" height="170" rx="6" fill="#030712" stroke="#ef4444" stroke-width="2"/>
        <text x="55" y="285" font-family="monospace" font-size="9" fill="#ef4444" font-weight="bold">SOURCE B: EXTORTION CALL STREAM [SYNTHETIC]</text>
        <!-- Robotic Rigid Step Waveform -->
        <path d="M 60 340 L 90 310 L 110 370 L 140 310 L 160 370 L 190 310 L 210 370 L 240 310 L 260 370 L 290 310 L 310 370 L 340 310 L 360 370 L 390 310 L 420 340" fill="none" stroke="#ef4444" stroke-width="2.5"/>
        <!-- Artificial Flatline Artifact Flag -->
        <rect x="150" y="325" width="80" height="40" fill="#7f1d1d" stroke="#f87171" stroke-width="1" stroke-dasharray="3,2"/>
        <text x="155" y="340" font-family="monospace" font-size="7" fill="#fecaca">UNNATURAL</text>
        <text x="155" y="352" font-family="monospace" font-size="7" fill="#fecaca">PITCH LOCK</text>
        <text x="55" y="395" font-family="monospace" font-size="8" fill="#fca5a5">AI ARTIFACT DETECTED: ZERO BREATH ACOUSTICS</text>
        <text x="55" y="415" font-family="monospace" font-size="8" fill="#f59e0b">MODEL SIGNATURE: ELEVEN_TTS_V2 (99.8% CLONE MATCH)</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#02060a" stroke="#ef4444" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#ef4444" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: AI VOICE SPECTRAL FORENSICS • EXHIBIT ES-3</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">SYNTHETIC</text>
      </g>
    </svg>`,

    // Scene 3: Hostage Demands & 20-Minute Countdown (Extortion Command)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_es3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1f0c0c"/><stop offset="50%" stop-color="#120505"/><stop offset="100%" stop-color="#060202"/>
        </linearGradient>
        <radialGradient id="vig_es3" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_es3)"/>
      <rect width="100%" height="100%" fill="url(#vig_es3)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">EXTORTION COMMAND INTERCEPT // EMERGENCY HOLD</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">20-MINUTE WIRE RANSOM COUNTDOWN</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Digital Countdown Stopwatch -->
        <rect x="50" y="90" width="400" height="120" rx="8" fill="#030202" stroke="#dc2626" stroke-width="3"/>
        <text x="75" y="120" font-family="monospace" font-size="11" fill="#f87171" font-weight="bold">EXTORTION DEMAND COUNTDOWN</text>
        <rect x="75" y="135" width="350" height="55" fill="#260909" rx="4"/>
        <text x="130" y="175" font-family="monospace" font-size="34" font-weight="extrabold" fill="#ef4444" letter-spacing="4">19:54</text>
        <text x="270" y="175" font-family="monospace" font-size="14" fill="#fca5a5">REMAINING</text>
        <!-- Demand Terms & Amount Box -->
        <rect x="50" y="230" width="400" height="190" rx="8" fill="#140707" stroke="#b91c1c" stroke-width="2"/>
        <text x="70" y="260" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ef4444">COLLISION DAMAGE SETTLEMENT FEE</text>
        <line x1="70" y1="270" x2="430" y2="270" stroke="#7f1d1d" stroke-width="1.5"/>
        <text x="70" y="295" font-family="monospace" font-size="11" fill="#ffffff">AMOUNT DEMANDED: <tspan fill="#f59e0b" font-weight="bold">$4,800.00 USD</tspan></text>
        <text x="70" y="320" font-family="monospace" font-size="9" fill="#fca5a5">PAYMENT METHOD: INSTANT PEER-TO-PEER WIRE</text>
        <text x="70" y="340" font-family="monospace" font-size="9" fill="#fca5a5">TARGET WALLET: P2P_ESCROW_NODE_77</text>
        <rect x="70" y="360" width="360" height="40" fill="#7f1d1d" rx="4"/>
        <text x="80" y="385" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff">⚠️ STRICT WARNING: DO NOT DISCONNECT OR CONTACT POLICE</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#060202" stroke="#dc2626" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#dc2626" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: EXTORTION COUNTDOWN INTERCEPT • EXHIBIT ES-4</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">THREAT</text>
      </g>
    </svg>`,

    // Scene 4: Drained Savings & The Peaceful Post (Dual Timeline Contrast)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_es4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#141820"/><stop offset="50%" stop-color="#0c1016"/><stop offset="100%" stop-color="#05070a"/>
        </linearGradient>
        <radialGradient id="vig_es4" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_es4)"/>
      <rect width="100%" height="100%" fill="url(#vig_es4)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">TIMELINE CORRELATION // DUAL EVENT RECONSTRUCTION</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">DRAINED BANK WIRE VS PEACEFUL CAMPFIRE POST</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Left Side: Drained Bank Account Wire Receipt -->
        <rect x="40" y="90" width="200" height="330" rx="6" fill="#1c1212" stroke="#dc2626" stroke-width="2"/>
        <rect x="50" y="105" width="180" height="30" fill="#7f1d1d" rx="3"/>
        <text x="60" y="125" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff">WIRE TRANSFER RECEIPT</text>
        <text x="55" y="160" font-family="monospace" font-size="8" fill="#fca5a5">DATE: YESTERDAY 15:42</text>
        <text x="55" y="180" font-family="monospace" font-size="9" fill="#ffffff">AMOUNT: <tspan fill="#ef4444" font-weight="bold">-$4,800.00</tspan></text>
        <text x="55" y="200" font-family="monospace" font-size="8" fill="#94a3b8">STATUS: EXECUTED</text>
        <line x1="50" y1="220" x2="230" y2="220" stroke="#7f1d1d" stroke-width="1"/>
        <text x="55" y="250" font-family="sans-serif" font-size="9" fill="#f87171" font-weight="bold">ACCOUNT BALANCE:</text>
        <text x="55" y="280" font-family="monospace" font-size="18" font-weight="bold" fill="#ef4444">$12.40</text>
        <text x="55" y="310" font-family="monospace" font-size="8" fill="#ef4444">⚠️ SAVINGS DRAINED</text>
        <!-- Right Side: Maya's Peaceful Instagram Post -->
        <rect x="260" y="90" width="200" height="330" rx="6" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>
        <rect x="270" y="105" width="180" height="30" fill="#15803d" rx="3"/>
        <text x="280" y="125" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff">INSTAGRAM POST [16:00]</text>
        <!-- Campfire Photo Placeholder -->
        <rect x="275" y="145" width="170" height="120" rx="4" fill="#1e293b"/>
        <polygon points="360,230 340,250 380,250" fill="#ea580c"/>
        <polygon points="360,220 350,245 370,245" fill="#f59e0b"/>
        <circle cx="360" cy="180" r="14" fill="#38bdf8"/>
        <text x="275" y="285" font-family="sans-serif" font-size="8" fill="#e2e8f0">"Peaceful sunset at camp! No cell signal till Sunday!"</text>
        <text x="275" y="310" font-family="monospace" font-size="8" fill="#22c55e">✓ ZERO ACCIDENT OCCURRED</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#05070a" stroke="#f59e0b" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#f59e0b" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: DRAINED WIRE VS PEACEFUL TIMELINE • EXHIBIT ES-5</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">SCAM CONFIRMED</text>
      </g>
    </svg>`,

    // Scene 5: Acoustic Forensics & VOIP Tracing (Audio Forensics Lab)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_es5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0c1824"/><stop offset="50%" stop-color="#060f18"/><stop offset="100%" stop-color="#02070c"/>
        </linearGradient>
        <radialGradient id="vig_es5" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_es5)"/>
      <rect width="100%" height="100%" fill="url(#vig_es5)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">CYBER ACOUSTICS LAB // MULTI-NODE VOIP TRACE</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">AI MODEL CLONE HASH IDENTIFIED</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Multi-Node Network Routing Map -->
        <rect x="40" y="90" width="420" height="190" rx="6" fill="#030712" stroke="#0ea5e9" stroke-width="2"/>
        <text x="55" y="115" font-family="monospace" font-size="9" fill="#38bdf8" font-weight="bold">VOIP PACKET HOP TELEMETRY MAP</text>
        <!-- Node Circles and Arrows -->
        <circle cx="80" cy="170" r="18" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="65" y="174" font-family="monospace" font-size="7" fill="#ffffff">SEATTLE</text>
        <circle cx="170" cy="150" r="18" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <text x="155" y="154" font-family="monospace" font-size="7" fill="#ffffff">REYKJAVIK</text>
        <circle cx="270" cy="180" r="18" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <text x="255" y="184" font-family="monospace" font-size="7" fill="#ffffff">ZURICH</text>
        <circle cx="370" cy="150" r="22" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
        <text x="355" y="154" font-family="monospace" font-size="7" fill="#ffffff">PANAMA</text>
        <line x1="98" y1="166" x2="152" y2="154" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,2"/>
        <line x1="188" y1="156" x2="252" y2="174" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,2"/>
        <line x1="288" y1="174" x2="348" y2="156" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="55" y="235" font-family="monospace" font-size="8" fill="#a7f3d0">ORIGIN SERVER LOCATED: PROXY CLUSTER #902</text>
        <text x="55" y="255" font-family="monospace" font-size="8" fill="#f87171">SUSPECT: JULIAN VANCE (IT ASSISTANT)</text>
        <!-- Sealed Forensic Evidence Cassette -->
        <rect x="40" y="300" width="420" height="120" rx="6" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>
        <rect x="60" y="320" width="120" height="80" rx="4" fill="#020617" stroke="#64748b" stroke-width="1.5"/>
        <circle cx="90" cy="360" r="14" fill="#1e293b" stroke="#cbd5e1" stroke-width="2"/>
        <circle cx="150" cy="360" r="14" fill="#1e293b" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="200" y="325" width="240" height="70" fill="#1e293b" rx="4"/>
        <text x="210" y="348" font-family="monospace" font-size="9" fill="#22c55e" font-weight="bold">SEALED EVIDENCE CASSETTE #VOIP-902</text>
        <text x="210" y="368" font-family="monospace" font-size="8" fill="#e2e8f0">HASH: SHA256: 9e01...b842</text>
        <text x="210" y="384" font-family="monospace" font-size="8" fill="#38bdf8">VOICE CLONE ENGINE LOCATED &amp; SEIZED</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#02070c" stroke="#22c55e" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#22c55e" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: FORENSIC AUDIO LAB &amp; VOIP TRACE • EXHIBIT ES-6</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#22c55e">RESOLVED</text>
      </g>
    </svg>`
  ],

  // =========================================================================
  // CASE 3: THE GHOST IN THE LEDGER (case_ghost_ledger)
  // =========================================================================
  'case_ghost_ledger': [
    // Scene 0: Art Studio & Home Savings (Sophia's Design Studio)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_gl0" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1814"/><stop offset="50%" stop-color="#14100c"/><stop offset="100%" stop-color="#0a0806"/>
        </linearGradient>
        <radialGradient id="vig_gl0" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_gl0)"/>
      <rect width="100%" height="100%" fill="url(#vig_gl0)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">SOPHIA LIN'S ART STUDIO // DESIGN WORKSPACE</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">PARENTS CONDO SAVINGS LEDGER // $25,000</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Wood Desk -->
        <polygon points="40,360 460,360 480,480 20,480" fill="#1c1612" stroke="#4a3b2c" stroke-width="2"/>
        <!-- Graphic Drawing Tablet & Stylus -->
        <rect x="70" y="120" width="220" height="200" rx="8" fill="#0f0c09" stroke="#38bdf8" stroke-width="2.5"/>
        <rect x="80" y="130" width="200" height="180" fill="#091824" rx="4"/>
        <!-- Digital Art Painting Landscape -->
        <polygon points="80,260 140,180 200,240 280,160 280,310 80,310" fill="#0284c7" opacity="0.6"/>
        <circle cx="230" cy="180" r="20" fill="#f59e0b"/>
        <!-- Stylus Pen resting beside tablet -->
        <line x1="300" y1="160" x2="315" y2="280" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
        <!-- Savings Passbook with Sticky Note -->
        <rect x="325" y="150" width="135" height="180" rx="4" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
        <text x="335" y="175" font-family="serif" font-size="9" font-weight="bold" fill="#0f172a">SAVINGS PASSBOOK</text>
        <line x1="335" y1="185" x2="450" y2="185" stroke="#cbd5e1" stroke-width="1"/>
        <text x="335" y="205" font-family="monospace" font-size="8" fill="#334155">ACCT: ****8912</text>
        <text x="335" y="225" font-family="monospace" font-size="10" font-weight="bold" fill="#059669">$25,000.00</text>
        <!-- Yellow Sticky Note -->
        <rect x="335" y="240" width="115" height="75" fill="#fef08a" rx="2" stroke="#ca8a04" stroke-width="1" transform="rotate(-4 392 277)"/>
        <text x="340" y="260" font-family="sans-serif" font-size="7" font-weight="bold" fill="#854d0e" transform="rotate(-4 392 277)">FOR MOM &amp; DAD'S</text>
        <text x="340" y="275" font-family="sans-serif" font-size="7" font-weight="bold" fill="#854d0e" transform="rotate(-4 392 277)">CONDO DEPOSIT!</text>
        <text x="340" y="295" font-family="monospace" font-size="7" fill="#b45309" transform="rotate(-4 392 277)">GOAL REACHED! ✨</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#0a0806" stroke="#f59e0b" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#f59e0b" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: SOPHIA'S STUDIO &amp; SAVINGS LEDGER • EXHIBIT GL-1</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#f59e0b">TARGET</text>
      </g>
    </svg>`,

    // Scene 1: The Wealth Advisor Recruiter (David Sterling Commission & Pitch)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_gl1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1a1622"/><stop offset="50%" stop-color="#100d16"/><stop offset="100%" stop-color="#08050c"/>
        </linearGradient>
        <radialGradient id="vig_gl1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_gl1)"/>
      <rect width="100%" height="100%" fill="url(#vig_gl1)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">AEGIS WEALTH ADVISORY // VIP PROPOSAL</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">COMMISSION PURCHASE &amp; GUARANTEED 18% YIELD</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Art Commission Receipt Pane -->
        <rect x="40" y="90" width="200" height="240" rx="6" fill="#140f1c" stroke="#a855f7" stroke-width="2"/>
        <text x="55" y="115" font-family="sans-serif" font-size="10" font-weight="bold" fill="#a855f7">ART COMMISSION RECEIPT</text>
        <line x1="55" y1="125" x2="225" y2="125" stroke="#4c1d95" stroke-width="1"/>
        <text x="55" y="145" font-family="monospace" font-size="8" fill="#e2e8f0">BUYER: DAVID STERLING</text>
        <text x="55" y="165" font-family="monospace" font-size="8" fill="#22c55e">PAID: $2,400.00 (2 PIECES)</text>
        <text x="55" y="185" font-family="monospace" font-size="7" fill="#94a3b8">STATUS: TRUST ESTABLISHED</text>
        <text x="55" y="210" font-family="sans-serif" font-size="8" fill="#d8b4fe">"Sophia, your talent is rare. Let me help you grow your savings."</text>
        <!-- Aegis Wealth VIP Investment Invitation -->
        <rect x="260" y="90" width="200" height="240" rx="6" fill="#0f172a" stroke="#eab308" stroke-width="2"/>
        <circle cx="360" cy="140" r="24" fill="#ca8a04" stroke="#fef08a" stroke-width="2"/>
        <text x="346" y="145" font-family="serif" font-size="12" font-weight="bold" fill="#ffffff">AW</text>
        <text x="280" y="185" font-family="serif" font-size="10" font-weight="bold" fill="#fef08a">AEGIS WEALTH VIP POOL</text>
        <text x="280" y="205" font-family="monospace" font-size="8" fill="#a7f3d0">GUARANTEED 18.4% APY</text>
        <text x="280" y="225" font-family="monospace" font-size="7" fill="#cbd5e1">INSTITUTIONAL ARBITRAGE</text>
        <rect x="275" y="245" width="170" height="30" fill="#ca8a04" rx="3"/>
        <text x="290" y="264" font-family="sans-serif" font-size="9" font-weight="bold" fill="#000000">EXCLUSIVE ACCESS</text>
        <!-- Email Header Banner -->
        <rect x="40" y="350" width="420" height="80" rx="6" fill="#0b0811" stroke="#a855f7" stroke-width="1.5"/>
        <text x="55" y="375" font-family="monospace" font-size="9" fill="#a855f7" font-weight="bold">EMAIL: david.sterling@aegiswealthterminal.org</text>
        <text x="55" y="395" font-family="sans-serif" font-size="9" fill="#e2e8f0">"Register with $500 today, test a withdrawal to verify for yourself."</text>
        <text x="55" y="415" font-family="monospace" font-size="8" fill="#ef4444">⚠️ SOCIAL ENGINEERING LURE: INITIAL SMALL PURCHASE</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#08050c" stroke="#a855f7" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#a855f7" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: ART COMMISSION &amp; VIP PITCH • EXHIBIT GL-2</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">THE HOOK</text>
      </g>
    </svg>`,

    // Scene 2: The Small Test Withdrawal (Aegis Trading Dashboard & Trap)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_gl2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0c1a18"/><stop offset="50%" stop-color="#061210"/><stop offset="100%" stop-color="#020807"/>
        </linearGradient>
        <radialGradient id="vig_gl2" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_gl2)"/>
      <rect width="100%" height="100%" fill="url(#vig_gl2)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">AEGIS TRADING DASHBOARD // RIGGED LEDGER</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">TEST WITHDRAWAL TRAP: $50 SUCCESS VERIFIED</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Aegis Terminal Web UI -->
        <rect x="40" y="90" width="420" height="230" rx="6" fill="#030c0a" stroke="#22c55e" stroke-width="2"/>
        <text x="55" y="115" font-family="monospace" font-size="10" fill="#22c55e" font-weight="bold">AEGIS WEALTH TERMINAL [LIVE TRADING]</text>
        <text x="320" y="115" font-family="monospace" font-size="9" fill="#86efac">BALANCE: $590.00</text>
        <!-- Fake Parabolic Green Chart -->
        <path d="M 60 220 L 100 210 L 140 225 L 180 180 L 220 190 L 260 150 L 300 160 L 340 130 L 380 140 L 420 115" fill="none" stroke="#22c55e" stroke-width="3"/>
        <polygon points="60,220 100,210 140,225 180,180 220,190 260,150 300,160 340,130 380,140 420,115 420,240 60,240" fill="#22c55e" opacity="0.1"/>
        <text x="55" y="260" font-family="monospace" font-size="9" fill="#86efac">+18.4% DAILY YIELD SIMULATION ACTIVE</text>
        <!-- Verified Test Withdrawal Pop-Up Notification -->
        <rect x="40" y="335" width="420" height="95" rx="6" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
        <circle cx="70" cy="370" r="16" fill="#10b981"/>
        <polyline points="63,370 68,375 78,365" fill="none" stroke="#ffffff" stroke-width="2.5"/>
        <text x="95" y="365" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">BANK ALERT: $50.00 WITHDRAWAL RECEIVED</text>
        <text x="95" y="385" font-family="monospace" font-size="8" fill="#d1fae5">Instant Settlement Transferred to Checking Account ****8912</text>
        <text x="95" y="405" font-family="monospace" font-size="8" fill="#fef08a">⚠️ THE TRAP: Bait withdrawal designed to lure full $25,000 savings</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#020807" stroke="#22c55e" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#22c55e" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: AEGIS TRADING &amp; TEST TRAP • EXHIBIT GL-3</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">BAIT DEPLOYED</text>
      </g>
    </svg>`,

    // Scene 3: The 20% Tax Clearance Demand (Advance Fee Extortion)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_gl3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1f0a0a"/><stop offset="50%" stop-color="#120404"/><stop offset="100%" stop-color="#070202"/>
        </linearGradient>
        <radialGradient id="vig_gl3" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_gl3)"/>
      <rect width="100%" height="100%" fill="url(#vig_gl3)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">AEGIS COMPLIANCE PORTAL // LOCKOUT STATE</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">20% ADVANCE AML TAX CLEARANCE EXTORTION</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- Red Lockout Security Modal -->
        <rect x="40" y="90" width="420" height="330" rx="8" fill="#140505" stroke="#dc2626" stroke-width="3"/>
        <!-- Heavy Padlock Graphic -->
        <rect x="220" y="120" width="60" height="50" rx="6" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
        <path d="M 235 120 L 235 95 Q 250 80 265 95 L 265 120" fill="none" stroke="#ef4444" stroke-width="4"/>
        <circle cx="250" cy="145" r="5" fill="#fca5a5"/>
        <text x="130" y="200" font-family="sans-serif" font-size="14" font-weight="extrabold" fill="#ef4444">WITHDRAWAL FROZEN // AML AUDIT</text>
        <text x="65" y="230" font-family="monospace" font-size="10" fill="#ffffff">TOTAL HELD BALANCE: <tspan fill="#22c55e" font-weight="bold">$29,500.00 USD</tspan></text>
        <rect x="60" y="245" width="380" height="90" fill="#260808" rx="4" stroke="#ef4444" stroke-width="1.5"/>
        <text x="75" y="270" font-family="monospace" font-size="9" fill="#f87171" font-weight="bold">REQUIREMENT: 20% TAX CLEARANCE DEPOSIT</text>
        <text x="75" y="290" font-family="monospace" font-size="12" font-weight="bold" fill="#fef2f2">AMOUNT TO DEPOSIT: $5,000.00 USD</text>
        <text x="75" y="310" font-family="monospace" font-size="8" fill="#fca5a5">DEADLINE: 24 HOURS OR ENTIRE ACCOUNT FORFEITED</text>
        <text x="65" y="365" font-family="sans-serif" font-size="8" fill="#ef4444" font-weight="bold">⚠️ SCAM INDICATOR: Legitimate brokers NEVER demand advance cash taxes to withdraw.</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#070202" stroke="#dc2626" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#dc2626" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: ADVANCE TAX EXTORTION • EXHIBIT GL-4</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">EXTORTION</text>
      </g>
    </svg>`,

    // Scene 4: 404 Error & Stolen Identity (Platform Collapse & Fraud Alert)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_gl4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#14141c"/><stop offset="50%" stop-color="#0c0c12"/><stop offset="100%" stop-color="#050508"/>
        </linearGradient>
        <radialGradient id="vig_gl4" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_gl4)"/>
      <rect width="100%" height="100%" fill="url(#vig_gl4)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">PLATFORM COLLAPSE // DOMAIN RESOLUTION FAILURE</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">IDENTITY THEFT &amp; FRAUDULENT LOAN WARNING</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- 404 Web Browser Window -->
        <rect x="40" y="90" width="230" height="230" rx="6" fill="#0a0a10" stroke="#ef4444" stroke-width="2"/>
        <rect x="40" y="90" width="230" height="24" fill="#1e1e2d" rx="6"/>
        <circle cx="55" cy="102" r="4" fill="#ef4444"/>
        <circle cx="67" cy="102" r="4" fill="#f59e0b"/>
        <circle cx="79" cy="102" r="4" fill="#22c55e"/>
        <text x="90" y="180" font-family="monospace" font-size="36" font-weight="extrabold" fill="#ef4444">404</text>
        <text x="65" y="210" font-family="sans-serif" font-size="10" font-weight="bold" fill="#ffffff">PAGE NOT FOUND</text>
        <text x="55" y="230" font-family="monospace" font-size="7" fill="#94a3b8">aegiswealthterminal.org unreachable</text>
        <text x="55" y="245" font-family="monospace" font-size="7" fill="#ef4444">Server IP disconnected by registrar</text>
        <!-- Deleted Profile Silhouette -->
        <rect x="290" y="90" width="170" height="100" rx="6" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>
        <circle cx="330" cy="135" r="16" fill="#334155"/>
        <text x="360" y="130" font-family="sans-serif" font-size="9" font-weight="bold" fill="#ffffff">David S.</text>
        <text x="360" y="145" font-family="monospace" font-size="7" fill="#ef4444">[USER DELETED]</text>
        <!-- Credit Bureau Fraud Alert Notification -->
        <rect x="40" y="340" width="420" height="90" rx="6" fill="#1c0a0a" stroke="#ef4444" stroke-width="2"/>
        <text x="55" y="365" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ef4444">CREDIT BUREAU FRAUD WARNING</text>
        <text x="55" y="385" font-family="monospace" font-size="9" fill="#ffffff">NEW $15,000 LOAN APPLICATION OPENED UNDER: SOPHIA LIN</text>
        <text x="55" y="405" font-family="monospace" font-size="8" fill="#fca5a5">IDENTITY SOURCE: KYC PASSPORT UPLOADED TO AEGIS</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#050508" stroke="#ef4444" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#ef4444" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: 404 COLLAPSE &amp; IDENTITY THEFT • EXHIBIT GL-5</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#ef4444">BREACHED</text>
      </g>
    </svg>`,

    // Scene 5: Financial Forensics & Domain Analysis (Taskforce & Blockchain Tree)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="100%" height="100%">
      <defs>
        <linearGradient id="bg_gl5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0e1724"/><stop offset="50%" stop-color="#080e18"/><stop offset="100%" stop-color="#03060c"/>
        </linearGradient>
        <radialGradient id="vig_gl5" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg_gl5)"/>
      <rect width="100%" height="100%" fill="url(#vig_gl5)"/>
      <g stroke="#ffffff" stroke-opacity="0.12" stroke-width="1" font-family="monospace" font-size="10" fill="#ffffff" fill-opacity="0.3">
        <line x1="30" y1="80" x2="470" y2="80" stroke-dasharray="4,4"/><text x="35" y="75">FINANCIAL CRIMES TASK FORCE // BLOCKCHAIN MAP</text>
        <line x1="30" y1="360" x2="470" y2="360" stroke-dasharray="4,4"/><text x="35" y="355">WHOIS PANAMA PROXY TRACE // CRYPTO MIXER TRAIL</text>
      </g>
      <g transform="translate(10, 20)">
        <!-- WHOIS Domain Registry Record -->
        <rect x="40" y="90" width="420" height="150" rx="6" fill="#030712" stroke="#38bdf8" stroke-width="2"/>
        <text x="55" y="115" font-family="monospace" font-size="9" fill="#38bdf8" font-weight="bold">DOMAIN WHOIS INTELLIGENCE LOG</text>
        <text x="55" y="135" font-family="monospace" font-size="8" fill="#cbd5e1">DOMAIN: aegiswealthterminal.org</text>
        <text x="55" y="150" font-family="monospace" font-size="8" fill="#ef4444">CREATION DATE: 5 DAYS PRIOR TO SCAM</text>
        <text x="55" y="165" font-family="monospace" font-size="8" fill="#f59e0b">REGISTRANT: PANAMA PRIVACY SHIELD CORP</text>
        <text x="55" y="180" font-family="monospace" font-size="8" fill="#94a3b8">HOSTING IP: 185.220.101.44 (BULLETPROOF HOST)</text>
        <text x="55" y="200" font-family="monospace" font-size="8" fill="#22c55e">DEVELOPER LINK: JULIAN VANCE / STERLING SYNDICATE</text>
        <!-- Blockchain Crypto Laundering Graph -->
        <rect x="40" y="260" width="420" height="160" rx="6" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>
        <text x="55" y="285" font-family="monospace" font-size="9" fill="#22c55e" font-weight="bold">BLOCKCHAIN TRANSACTION TRACER</text>
        <circle cx="80" cy="340" r="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="65" y="344" font-family="monospace" font-size="7" fill="#ffffff">SOPHIA</text>
        <circle cx="180" cy="340" r="18" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
        <text x="165" y="344" font-family="monospace" font-size="7" fill="#ffffff">AEGIS</text>
        <circle cx="290" cy="320" r="16" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <text x="275" y="324" font-family="monospace" font-size="7" fill="#ffffff">MIXER 1</text>
        <circle cx="290" cy="360" r="16" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
        <text x="275" y="364" font-family="monospace" font-size="7" fill="#ffffff">MIXER 2</text>
        <circle cx="400" cy="340" r="20" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
        <text x="380" y="344" font-family="monospace" font-size="7" fill="#ffffff">OFFSHORE</text>
        <line x1="96" y1="340" x2="162" y2="340" stroke="#ef4444" stroke-width="2"/>
        <line x1="198" y1="334" x2="274" y2="322" stroke="#f59e0b" stroke-width="2"/>
        <line x1="198" y1="346" x2="274" y2="358" stroke="#f59e0b" stroke-width="2"/>
        <line x1="306" y1="324" x2="380" y2="336" stroke="#22c55e" stroke-width="2"/>
        <line x1="306" y1="356" x2="380" y2="344" stroke="#22c55e" stroke-width="2"/>
        <text x="55" y="405" font-family="monospace" font-size="8" fill="#a7f3d0">EVIDENCE SECURED // ARREST WARRANTS ISSUED</text>
      </g>
      <g transform="translate(25, 515)">
        <rect width="450" height="65" rx="8" fill="#03060c" stroke="#22c55e" stroke-width="1.5" opacity="0.95"/>
        <text x="15" y="24" font-family="monospace" font-weight="bold" font-size="13" fill="#22c55e" letter-spacing="2">CLASSIFIED POLICE FORENSIC SCENE SKETCH</text>
        <text x="15" y="45" font-family="monospace" font-size="11" fill="#e2d2be">SCENE: FINANCIAL TASK FORCE &amp; BLOCKCHAIN MAP • EXHIBIT GL-6</text>
        <text x="340" y="45" font-family="monospace" font-weight="bold" font-size="11" fill="#22c55e">SOLVED</text>
      </g>
    </svg>`
  ]
};

// Aliases for backwards compatibility
CASE_SCENE_SKETCHES['borderland-trap'] = CASE_SCENE_SKETCHES['case_border_promise'];

export function getSceneSketchArt(caseIdOrSceneIdx?: string | number, sceneIdxParam?: number): string {
  let caseId = 'case_border_promise';
  let sceneIdx = 0;

  if (typeof caseIdOrSceneIdx === 'number') {
    sceneIdx = caseIdOrSceneIdx;
  } else if (typeof caseIdOrSceneIdx === 'string') {
    caseId = caseIdOrSceneIdx.toLowerCase();
    if (typeof sceneIdxParam === 'number') {
      sceneIdx = sceneIdxParam;
    }
  }

  // Normalize case identifier
  let normalizedKey = 'case_border_promise';
  if (caseId.includes('echo') || caseId.includes('static') || caseId.includes('voice') || caseId.includes('deepfake')) {
    normalizedKey = 'case_echoes_static';
  } else if (caseId.includes('ghost') || caseId.includes('ledger') || caseId.includes('quantum') || caseId.includes('sophia')) {
    normalizedKey = 'case_ghost_ledger';
  } else {
    normalizedKey = 'case_border_promise';
  }

  const sketchesForCase = CASE_SCENE_SKETCHES[normalizedKey] || CASE_SCENE_SKETCHES['case_border_promise'];
  const safeIdx = Math.max(0, Math.min(sceneIdx, sketchesForCase.length - 1));
  const rawSvg = sketchesForCase[safeIdx] || sketchesForCase[0];

  return encodeSvgDataUri(rawSvg);
}
