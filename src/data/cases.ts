import { Case } from '../types';

export const HANDCRAFTED_CASES: Case[] = [
  // =========================================================================
  // CASE 1: The Promise Beyond the Border
  // Theme: Fake Overseas Employment, Digital Recruitment Fraud & Human Trafficking Prevention
  // =========================================================================
  {
    id: 'case_border_promise',
    title: 'The Promise Beyond the Border',
    topic: 'Overseas Job Fraud & Human Trafficking',
    difficulty: 'HIGH',
    status: 'HIGH PRIORITY',
    tag: 'HUMAN TRAFFICKING & RECRUITMENT FRAUD',
    threatActor: 'Aura Syndicate',
    timeLimit: '48 HOURS',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    introduction: 'A gifted 19-year-old developer, Kaelen Miller, abruptly departed after accepting an unverified "VIP Tech Specialist Contract" in Southeast Asia. 36 hours later, his mother received distressed, scripted voice messages demanding passport clearance fees. Uncover the human trafficking network behind Aura Global Recruitment.',
    storyIntro: {
      summary: 'Kaelen Miller accepted an overseas job offer promising $8,500/month with free housing and flight tickets. Immediately upon arrival in a border transit zone, his passport was confiscated and his phone switched to automated scripted messaging. His family fears he has been trapped inside a forced cyber-scam compound.',
      victimName: 'Kaelen Miller',
      victimRole: 'Junior Web Developer (Age 19)',
      incidentTime: '48 Hours Ago',
      scenes: [
        {
          id: 'sc_border_ch1_1',
          sceneNumber: 1,
          chapterNumber: 1,
          chapterTitle: 'A Normal Day',
          title: 'Late Night Code & Family Dreams',
          locationName: 'Kaelen\'s Apartment - Riverdale',
          mediaType: 'dialogue',
          speaker: {
            name: 'Kaelen Miller',
            role: 'Junior Web Developer (Age 19)',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
            mood: 'neutral'
          },
          narration: 'Kaelen Miller sits at his desk surrounded by open code editors. Having worked two part-time freelance gigs since high school, his main goal in life is helping his widowed mother, Eleanor, pay for her upcoming knee replacement surgery.',
          dialogueText: 'If I can just secure one stable full-time developer job this year, Mom won\'t have to work double shifts at the clinic anymore. My GitHub portfolio is finally looking solid.',
          keyTakeaway: 'Understanding Kaelen\'s financial goals and desire to help his family explains why he was emotionally receptive to high-paying job offers.'
        },
        {
          id: 'sc_border_ch2_2',
          sceneNumber: 2,
          chapterNumber: 2,
          chapterTitle: 'The Opportunity',
          title: 'The Unsolicited Executive Offer',
          locationName: 'Kaelen\'s Professional Network Inbox',
          mediaType: 'email_preview',
          speaker: {
            name: 'Elena Vance',
            role: 'Head Talent Scout, Aura Solutions',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
            mood: 'confident'
          },
          narration: 'Out of nowhere, Kaelen receives a direct message from "Elena Vance", representing Aura Global Solutions Ltd. She offers an immediate Senior Web Lead role in Southeast Asia starting at $8,500/month.',
          dialogueText: 'Kaelen, our executive engineering team reviewed your open-source React repositories. We are skipping standard technical coding rounds! We need you on tomorrow\'s flight for our offshore AI lab. Luxury housing and full medical included.',
          mediaContent: {
            sender: 'elena.vance@auraglobaljobs.org',
            recipient: 'kaelen.m@devmail.io',
            header: 'EXECUTIVE DIRECT OFFER: Senior Web Lead ($8,500/mo)',
            body: 'Dear Kaelen, Aura Global Solutions is expanding its regional AI hub. Based on your open-source projects, we have selected you for immediate placement. No technical interviews required. Flight tickets fully covered.'
          },
          keyTakeaway: 'Skipping technical interviews and offering absurdly high salaries to junior developers are classic lures used by fraudulent recruiters.'
        },
        {
          id: 'sc_border_ch3_3',
          sceneNumber: 3,
          chapterNumber: 3,
          chapterTitle: 'Building Trust',
          title: 'Official Contract & Video Calls',
          locationName: 'Virtual Call Terminal',
          mediaType: 'text_chat',
          speaker: {
            name: 'Elena Vance',
            role: 'Head Talent Scout, Aura Solutions',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
            mood: 'confident'
          },
          narration: 'Elena schedules a video chat, speaks with extreme professionalism, and emails an official-looking PDF employment offer letter complete with corporate stamps and signed by Managing Director Victor Sterling.',
          dialogueText: 'Kaelen, we understand taking an overseas leap is a big decision. Here is your official employment contract and $2,000 relocation bonus authorization. You will be building cutting-edge web tools with our senior team.',
          mediaContent: {
            timestamp: 'Yesterday 02:15 PM',
            body: 'OFFER LETTER ATTACHED: Aura Global Solutions Ltd. - Position: Overseas Web Lead. Salary: $8,500 USD/month. Relocation Bonus: $2,000 upon arrival.'
          },
          keyTakeaway: 'Professional-looking PDF contracts and corporate stamps do not guarantee legitimacy. Anyone can design convincing corporate templates.'
        },
        {
          id: 'sc_border_ch4_4',
          sceneNumber: 4,
          chapterNumber: 4,
          chapterTitle: 'Warning Signs',
          title: 'Tourist Visa & Crypto Deposit Pressure',
          locationName: 'Airport Transit Terminal',
          mediaType: 'text_chat',
          speaker: {
            name: 'Elena Vance',
            role: 'Head Talent Scout, Aura Solutions',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
            mood: 'urgent'
          },
          narration: 'When Kaelen asks about foreign work visas, Elena insists he must fly out on a 30-day Tourist Transit Visa, claiming official work permits take 2 months and can be "swapped" at the compound. She also demands a $450 advance deposit.',
          dialogueText: 'Kaelen, flight seats are extremely limited! You must transfer a $450 crypto deposit within 2 hours to secure your express visa clearance ticket. Once landed, our local manager will handle the work permit swap.',
          keyTakeaway: 'Traveling for overseas employment on a tourist visa is illegal. Combined with advance fee demands, this is a major indicator of human trafficking.'
        },
        {
          id: 'sc_border_ch5_5',
          sceneNumber: 5,
          chapterNumber: 5,
          chapterTitle: 'The Incident',
          title: 'Passport Confiscation & Scripted Call',
          locationName: 'Border Sub-District Compound',
          mediaType: 'phone_call',
          speaker: {
            name: 'Eleanor Miller (Mother)',
            role: 'Distressed Relative',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
            mood: 'panicked'
          },
          narration: 'Upon landing at the border airport, heavy compound guards escort Kaelen into a guarded tech park and confiscate his passport and phone under "security protocol". 36 hours later, his mother receives a monotone, coerced phone message.',
          dialogueText: 'Detective! Kaelen called me sounding terrified, like someone was dictating every word right next to his head! He told me his travel papers were held and begged me to wire $2,000 right now to free him. Please find my son!',
          keyTakeaway: 'Scripted monotone voice calls and demands for clearance fees from stranded travelers are clear signs of physical coercion and forced cyber labor.'
        },
        {
          id: 'sc_border_ch6_6',
          sceneNumber: 6,
          chapterNumber: 6,
          chapterTitle: 'Investigation Begins',
          title: 'The Cyber Crime Division Responds',
          locationName: 'Cyber Crime Investigation Division',
          mediaType: 'police_dispatch',
          speaker: {
            name: 'Chief Investigator Vance',
            role: 'Digital Forensics Unit',
            mood: 'urgent'
          },
          narration: 'The Cyber Crime Unit has officially taken over the case. All emails, offer letters, WHOIS domain logs, flight tickets, and chat histories encountered during the narrative are now indexed in your Investigation Room.',
          dialogueText: 'Investigator, Kaelen Miller is trapped inside an unlicensed border compound. We must verify Aura Global\'s domain registry, interrogate the recruiter Elena Vance, and trace the syndicate leader Victor Sterling before they move him.',
          keyTakeaway: 'Proceed to the Investigation Room to examine evidence, interview witnesses, and reconstruct the chronological timeline.'
        }
      ]
    },
    learningObjectives: [
      'Recognize overseas employment fraud indicators and fake corporate registries.',
      'Identify social engineering tactics used by human trafficking recruiters.',
      'Verify domain registration WHOIS records, flight itineraries, and official labor export licenses.'
    ],
    warningSigns: [
      'Job offers promising unusually high salaries with zero technical assessment or interview panel.',
      'Recruiters urging immediate departure with one-way tickets on Tourist Visas.',
      'Insistence on advance crypto/wire deposits for visa processing and passport retainment upon arrival.'
    ],
    manipulationTechniques: [
      'Financial Flattery (praising skills to rush emotional decisions)',
      'Sense of Urgency (claiming limited flight seats and 2-hour timers)',
      'Isolation Strategy (moving communication away from verified corporate channels)'
    ],
    leads: [
      {
        id: 'lead_audit_contract',
        title: 'Audit the Aura Global Employment Contract',
        description: 'Inspect the PDF employment offer letter in the evidence cabinet. Look for suspicious terms, missing registration numbers, and upfront fee demands.',
        targetType: 'evidence',
        targetId: 'ev_border_contract',
        isUnlocked: true,
        isCompleted: false,
        unlocksLeads: ['lead_check_whois', 'lead_interview_elena'],
        unlocksEvidenceIds: ['ev_border_whois'],
        unlocksWitnessIds: ['wit_elena_vance'],
        rewardXp: 100,
        hint: 'Click "Inspect File" on the Employment Contract to examine fee terms and company seal.'
      },
      {
        id: 'lead_check_whois',
        title: 'Examine Aura Global Domain & License Registry',
        description: 'Cross-reference the company domain "auraglobaljobs.org" against the official government labor registry to verify if it is a registered recruitment agency.',
        targetType: 'evidence',
        targetId: 'ev_border_whois',
        isUnlocked: false,
        isCompleted: false,
        unlocksLeads: ['lead_interrogate_sterling'],
        unlocksWitnessIds: ['wit_victor_sterling'],
        rewardXp: 120,
        hint: 'Use the Evidence Verification Toolkit in Evidence Lab to perform a Source Audit on WHOIS records.'
      },
      {
        id: 'lead_interview_elena',
        title: 'Interrogate Recruiter Elena Vance',
        description: 'Question Elena about her physical office location, employee identification number, and why Kaelen was issued a tourist visa instead of a work permit.',
        targetType: 'witness',
        targetId: 'wit_elena_vance',
        isUnlocked: false,
        isCompleted: false,
        unlocksLeads: ['lead_confront_elena'],
        unlocksEvidenceIds: ['ev_border_chat_logs'],
        rewardXp: 150,
        hint: 'Ask Elena about the flight itinerary and visa type in the Interrogation Terminal.'
      },
      {
        id: 'lead_confront_elena',
        title: 'Confront Elena with WHOIS Record',
        description: 'Present the WHOIS domain evidence during interrogation to prove her recruitment portal was registered just 5 days ago.',
        targetType: 'witness',
        targetId: 'wit_elena_vance',
        isUnlocked: false,
        isCompleted: false,
        unlocksLeads: ['lead_reconstruct_border_timeline'],
        rewardXp: 200,
        hint: 'Click "Present Evidence" in the Interrogation terminal and select the WHOIS record file.'
      },
      {
        id: 'lead_reconstruct_border_timeline',
        title: 'Reconstruct Kaelen\'s Departure Timeline',
        description: 'Arrange the sequence of events from initial recruitment to airport arrival in the Case Timeline tool.',
        targetType: 'timeline',
        isUnlocked: false,
        isCompleted: false,
        unlocksLeads: ['lead_border_conference'],
        rewardXp: 180,
        hint: 'Drag timeline events into correct chronological order.'
      },
      {
        id: 'lead_border_conference',
        title: 'Present Case Brief to Chief Detective',
        description: 'Gather your findings and submit your investigation report at the Detective Case Conference.',
        targetType: 'conference',
        isUnlocked: false,
        isCompleted: false,
        rewardXp: 300,
        hint: 'Go to Case Conference tab and outline the perpetrator, method, and prevention plan.'
      }
    ],
    evidences: [
      {
        id: 'ev_border_contract',
        name: 'Aura Global VIP Offer Letter',
        type: 'document',
        description: 'Employment contract issued to Kaelen Miller offering $8,500/month as "Overseas Web Lead". Demands $450 advance visa processing fee and passport surrender upon arrival.',
        content: `AURA GLOBAL SOLUTIONS LTD. — RECRUITMENT DIVISION
OFFER OF EMPLOYMENT & OVERSEAS PLACEMENT CONTRACT

Candidate: Kaelen Miller (Age 19)
Position: Overseas Senior Web Lead (Special Project)
Monthly Remuneration: $8,500 USD (Net) + Luxury Housing Allowance
Location: Border Special Economic Zone, Sub-District 9

TERMS & MANDATORY REQUIREMENTS:
1. Candidate agrees to depart within 24 hours on Flight AG-802 (Tourist Transit Visa Category V-1).
2. Candidate agrees to deposit $450 USD processing fee to designated wallet address for express clearance.
3. Official passport will be retained by local site manager upon arrival for "security registration".
4. Personal mobile devices will be deposited in office storage during working shifts.

Signed: Victor Sterling (Managing Director)
Recruiter: Elena Vance (Talent Acquisition)`,
        isLocked: false,
        dateCollected: '10:15 AM Today',
        source: 'Family Email Archive',
        category: 'CONTRACTUAL EVIDENCE',
        importance: 'Critical',
        inspectablePoints: [
          {
            id: 'p1',
            label: 'Tourist Transit Visa Requirement',
            detail: 'Working overseas on a Tourist Visa is illegal in most jurisdictions and leaves workers completely vulnerable without labor rights or legal protections.',
            revealsLeadId: 'lead_check_whois'
          },
          {
            id: 'p2',
            label: 'Passport Retainment Clause',
            detail: 'Confiscating passports upon arrival is a direct indicator of forced labor and human trafficking.',
            revealsLeadId: 'lead_interview_elena'
          },
          {
            id: 'p3',
            label: 'Advance Crypto Deposit',
            detail: 'Legitimate employers never demand job seekers pay upfront processing fees or deposit crypto.',
            revealsLeadId: 'lead_check_whois'
          }
        ],
        metadata: {
          sender: 'elena.vance@auraglobaljobs.org',
          recipient: 'kaelen.m@devmail.io',
          ipAddress: '185.220.101.42 (Anonymous Proxy)',
          domainAge: '5 Days Old'
        }
      },
      {
        id: 'ev_border_whois',
        name: 'WHOIS & Corporate Registry Report',
        type: 'website',
        description: 'Domain WHOIS lookup and Ministry of Labor verification log for auraglobaljobs.org.',
        content: `DOMAIN REGISTRATION AUDIT
Domain: auraglobaljobs.org
Registered Date: 5 Days Ago
Registrant Name: REDACTED FOR PRIVACY (Proxy Protection)
Hosting Provider: Offshore Crypto Server (Panama)

GOVERNMENT LABOR MINISTRY DATABASE QUERY:
Organization Search: "Aura Global Solutions Ltd."
Result: NOT FOUND IN REGISTERED OVERSEAS EMPLOYMENT AGENCIES.
License Status: UNLICENSED / FRAUDULENT RECRUITER ALERT ISSUED.`,
        isLocked: true,
        unlockCondition: 'Inspect Offer Letter or Complete Lead: Audit Contract',
        dateCollected: '11:30 AM Today',
        source: 'Cyber Forensics Terminal',
        category: 'DOMAIN ANALYSIS',
        importance: 'Critical',
        inspectablePoints: [
          {
            id: 'p4',
            label: 'Domain Age (5 Days)',
            detail: 'A company claiming 10 years of global recruitment experience whose domain was registered 5 days ago is fake.',
            revealsLeadId: 'lead_interview_elena'
          },
          {
            id: 'p5',
            label: 'Unlicensed Status',
            detail: 'Not registered with the Ministry of Labor — unauthorized to recruit citizens for abroad work.',
            revealsLeadId: 'lead_interrogate_sterling'
          }
        ]
      },
      {
        id: 'ev_border_chat_logs',
        name: 'Recruiter Chat History',
        type: 'chat',
        description: 'Exported WhatsApp chat between recruiter Elena Vance and victim Kaelen Miller.',
        content: `[Elena 14:02]: Kaelen, the executive board is impressed! They want you on tomorrow's plane for our offshore hub.
[Kaelen 14:05]: Isn't this too fast? I haven't even had a technical coding interview or met the engineering team.
[Elena 14:06]: Opportunities like this don't wait. Other candidates are applying. Pay the $450 visa deposit now or we pass to candidate #2.
[Kaelen 14:10]: Okay, I just sent the deposit. Where do I pick up my foreign work permit?
[Elena 14:11]: You will enter on a tourist visa first, then we swap it at the compound. Keep this off social media!`,
        isLocked: true,
        unlockCondition: 'Interview Elena Vance',
        dateCollected: '12:00 PM Today',
        source: 'Victim Phone Backup',
        category: 'COMMUNICATION TRAIL',
        importance: 'High'
      }
    ],
    witnesses: [
      {
        id: 'wit_elena_vance',
        name: 'Elena Vance',
        role: 'Talent Scout / Recruiter (Aura Global)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        description: 'Polished recruiter operating out of a regional virtual co-working space. Claims she was hired by Victor Sterling to find young tech talent quickly.',
        promptKnowledge: 'You are Elena Vance, a recruiter for Aura Global. You insist the job is 100% legitimate and high paying. You claim you were hired by Victor Sterling to find young talent. If confronted with the WHOIS record showing the domain is 5 days old, you act surprised and admit Victor told you to use that portal.',
        status: 'available',
        personalityTrait: 'Polished, Persuasive, Evasive',
        motive: 'Receives commission per recruited candidate; claims ignorance of human trafficking compound.',
        suspicionLevel: 'Suspect',
        confrontationTriggers: [
          {
            evidenceId: 'ev_border_whois',
            dialogueResponse: 'Wait... the domain was created 5 days ago?! Mr. Sterling told me Aura was a 10-year-old firm! He gave me $500 cash per recruit to onboard candidates fast on tourist visas...',
            revealsLeadId: 'lead_interrogate_sterling',
            revealsWitnessId: 'wit_victor_sterling'
          }
        ]
      },
      {
        id: 'wit_victor_sterling',
        name: 'Victor Sterling',
        role: 'Managing Director / Alleged Operator',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
        description: 'Self-styled international entrepreneur operating shell companies under multiple aliases across offshore accounts.',
        promptKnowledge: 'You are Victor Sterling. You deflect blame, claiming Kaelen is an independent contractor who agreed to all terms willingly. If confronted with evidence of passport retention and forced messaging, you claim "standard site security procedures".',
        status: 'locked',
        personalityTrait: 'Arrogant, Deflective, Corporate',
        motive: 'Operates illicit cyber scam compounds using trapped overseas workers.',
        suspicionLevel: 'Prime Suspect'
      }
    ],
    timeline: [
      {
        id: 'tl_border_1',
        time: 'Day 1 - 09:00 AM',
        description: 'Elena Vance messages Kaelen on social professional platform with high-salary overseas job offer.',
        isCorrect: true,
        orderIndex: 1,
        isInitiallyKnown: true
      },
      {
        id: 'tl_border_2',
        time: 'Day 1 - 02:10 PM',
        description: 'Kaelen transfers $450 crypto deposit under pressure for urgent visa clearance.',
        isCorrect: true,
        orderIndex: 2,
        isInitiallyKnown: true
      },
      {
        id: 'tl_border_3',
        time: 'Day 2 - 06:30 AM',
        description: 'Kaelen departs on a one-way flight using a tourist visa.',
        isCorrect: true,
        orderIndex: 3,
        isInitiallyKnown: false
      },
      {
        id: 'tl_border_4',
        time: 'Day 2 - 08:00 PM',
        description: 'Arrival at border sub-district; passport confiscated by site handlers under guise of "security clearance".',
        isCorrect: true,
        orderIndex: 4,
        isInitiallyKnown: false
      }
    ],
    clues: [
      {
        id: 'cl_border_1',
        text: 'Employer urged candidate to fly on a Tourist Visa instead of a verified Work Permit.',
        evidenceId: 'ev_border_contract',
        isDiscovered: true
      },
      {
        id: 'cl_border_2',
        text: 'Aura Global website was registered 5 days ago on offshore servers and lacks labor licensing.',
        evidenceId: 'ev_border_whois',
        isDiscovered: false
      },
      {
        id: 'cl_border_3',
        text: 'Recruiter Elena Vance admitted receiving cash bonuses from Victor Sterling to rush candidates.',
        evidenceId: 'ev_border_chat_logs',
        isDiscovered: false
      }
    ],
    initialWallNodes: [
      { id: 'node_kaelen', title: 'Kaelen Miller (Victim)', type: 'suspect', x: 20, y: 30, description: '19yo Developer, Trapped Overseas' },
      { id: 'node_elena', title: 'Elena Vance', type: 'suspect', x: 50, y: 20, description: 'Recruiter, Aura Global' },
      { id: 'node_sterling', title: 'Victor Sterling', type: 'suspect', x: 80, y: 30, description: 'Mastermind, Shell Company Director' },
      { id: 'node_contract', title: 'Fake Job Offer', type: 'evidence', x: 35, y: 70, description: 'Demanded crypto fee & tourist visa' },
      { id: 'node_whois', title: '5-Day Domain WHOIS', type: 'digital', x: 65, y: 70, description: 'Unlicensed Fake Entity' }
    ],
    conferenceConfig: {
      promptContext: 'Evaluating overseas job scam and human trafficking network investigation.',
      suspectOptions: [
        { id: 'wit_victor_sterling', name: 'Victor Sterling', role: 'Syndicate Operator & Fake Agency Director' },
        { id: 'wit_elena_vance', name: 'Elena Vance', role: 'Unwitting / Commissioned Recruiter' },
        { id: 'kaelen_roommate', name: 'Leo (Roommate)', role: 'Casual Acquaintance' }
      ],
      mechanismOptions: [
        { id: 'm1', label: 'Overseas Recruitment Trafficking', description: 'Baiting victims with high tech salaries, tourist visas, and advance fees then trapping them in forced labor compounds.' },
        { id: 'm2', label: 'Standard Identity Theft', description: 'Stealing credentials without physical coercion.' },
        { id: 'm3', label: 'Local Corporate Embezzlement', description: 'Stealing local company funds.' }
      ],
      preventionOptions: [
        { id: 'p1', label: 'Ministry Labor Verification & No Upfront Fees', description: 'Always verify recruiters on official government labor portals, never pay advance job fees, and never travel for work on a tourist visa.' },
        { id: 'p2', label: 'Pay All Upfront Fees Immediately', description: 'Pay fees to speed up visa processing.' },
        { id: 'p3', label: 'Keep Communications Off Official Record', description: 'Use private unmonitored apps.' }
      ]
    },
    location: {
      name: 'Aura Global Co-Working Suite',
      description: 'A rented virtual office space used temporarily by recruiters to meet candidates and issue fake contracts.',
      coordinates: '35.6762° N, 139.6503° E',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      hotspots: [
        {
          id: 'hs_border_1',
          name: 'Discarded Contract Shreds',
          x: 28,
          y: 45,
          description: 'A trash bin containing draft contracts with identical wording sent to 12 other young applicants.',
          revealsEvidenceId: 'ev_border_contract'
        },
        {
          id: 'hs_border_2',
          name: 'Unclaimed Router Terminal',
          x: 72,
          y: 60,
          description: 'Network terminal showing recent connections to offshore proxy IP addresses.',
          revealsLeadId: 'lead_check_whois'
        }
      ]
    },
    solution: {
      questions: [
        {
          id: 'q1',
          question: 'Who was the primary mastermind operating the fraudulent recruitment compound?',
          choices: ['Victor Sterling', 'Elena Vance', 'Kaelen Miller', 'Mrs. Miller'],
          correctAnswer: 'Victor Sterling',
          explanation: 'Victor Sterling operated the unlicensed shell company Aura Global, paying recruiters cash to lure victims abroad onto tourist visas.'
        },
        {
          id: 'q2',
          question: 'Which key warning sign proved that the job offer was a scam?',
          choices: [
            'Demanding an advance visa fee, requiring travel on a tourist visa, and passport retainment terms.',
            'Offering remote work flexible hours.',
            'Asking for a resume and cover letter.',
            'Using video calls for meetings.'
          ],
          correctAnswer: 'Demanding an advance visa fee, requiring travel on a tourist visa, and passport retainment terms.',
          explanation: 'Legitimate employers do not demand advance crypto fees or require workers to travel on tourist visas with surrendered passports.'
        }
      ]
    }
  },

  // =========================================================================
  // CASE 2: The Echoes in the Static
  // Theme: AI Deepfake Voice Cloning & Emergency Family Ransom Extortion
  // =========================================================================
  {
    id: 'case_echoes_static',
    title: 'The Echoes in the Static',
    topic: 'AI Voice Cloning & Family Extortion',
    difficulty: 'MED',
    status: 'URGENT',
    tag: 'DEEPFAKE AUDIO & EMERGENCY EXTORTION',
    threatActor: 'Phantom Audio Syndicate',
    timeLimit: '24 HOURS',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    introduction: 'Dr. Arthur Pendelton received a panicked phone call featuring the crying voice of his daughter Maya, claiming she was in a severe mountain car accident and held for $4,800 emergency damages. Spectrogram analysis revealed the voice was an AI clone synthesized from public YouTube vlogs.',
    storyIntro: {
      summary: 'Dr. Arthur Pendelton received a satellite call with Maya\'s sobbing voice begging for emergency funds after an alleged car crash in the mountains. A stern operator demanded $4,800 via instant transfer within 20 minutes. Maya later confirmed she was at camp with zero cell knowledge of the event.',
      victimName: 'Dr. Arthur Pendelton & Maya Pendelton',
      victimRole: 'University Professor (Age 58) & Daughter (Age 22)',
      incidentTime: 'Yesterday Afternoon',
      scenes: [
        {
          id: 'sc_echo_ch1_1',
          sceneNumber: 1,
          chapterNumber: 1,
          chapterTitle: 'A Normal Day',
          title: 'Morning Goodbye & Mountain Vlog',
          locationName: 'Dr. Pendelton\'s Study',
          mediaType: 'text_chat',
          speaker: {
            name: 'Maya Pendelton',
            role: 'Geology Student (Age 22)',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            mood: 'neutral'
          },
          narration: 'Dr. Arthur Pendelton, a university history professor, receives a warm text from his daughter Maya, who is heading out on a 3-day geology field trip in the remote Cascade Mountains. Maya posts a 2-minute video blog on YouTube showing her field gear.',
          dialogueText: 'Morning Dad! Setting up camp at North Pass. Cell signal is weak here, but I posted a quick 2-minute vlog update on YouTube for the geology club. Love you!',
          mediaContent: {
            timestamp: '08:15 AM Yesterday',
            body: 'Text Message from Maya: "Heading into the mountain valley now! Check out my YouTube vlog if you want to see our camp setup!"'
          },
          keyTakeaway: 'Public video blogs and social media audio clips provide cybercriminals with high-quality voice samples needed to train AI cloning models.'
        },
        {
          id: 'sc_echo_ch2_2',
          sceneNumber: 2,
          chapterNumber: 2,
          chapterTitle: 'The Opportunity',
          title: 'The Incoming Satellite Call',
          locationName: 'Dr. Pendelton\'s Home Office',
          mediaType: 'phone_call',
          speaker: {
            name: 'Unknown Satellite Line',
            role: 'VOIP Spoofed Caller',
            avatar: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80',
            mood: 'urgent'
          },
          narration: 'Late afternoon, while Arthur is grading papers, his phone buzzes with an incoming call from an unlisted VOIP satellite number displaying +1 (800) 555-EMRG.',
          dialogueText: '[Phone Ringing] Incoming Encrypted Satellite Call from North Pass Region...',
          keyTakeaway: 'Spoofed caller IDs can make calls appear to come from local law enforcement or satellite emergency networks.'
        },
        {
          id: 'sc_echo_ch3_3',
          sceneNumber: 3,
          chapterNumber: 3,
          chapterTitle: 'Building Trust',
          title: 'The Panicked Voice Stream',
          locationName: 'Encrypted Audio Stream',
          mediaType: 'phone_call',
          speaker: {
            name: 'Synthesized Maya Voice',
            role: 'AI Audio Clone',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            mood: 'panicked'
          },
          narration: 'Arthur answers. A weeping, trembling voice sounding 100% identical to Maya screams through the speaker.',
          dialogueText: 'Dad! Dad, please help me! I was in a terrible crash on the mountain road... my brake line snapped and I hit a transport vehicle... these local operators won\'t let me leave unless you pay the damages right now!',
          keyTakeaway: 'AI voice models clone pitch, tone, and inflection with terrifying accuracy, weaponizing emotional panic to bypass logical reasoning.'
        },
        {
          id: 'sc_echo_ch4_4',
          sceneNumber: 4,
          chapterNumber: 4,
          chapterTitle: 'Warning Signs',
          title: 'Hostage Demands & 20-Minute Countdown',
          locationName: 'Phone Intercept',
          mediaType: 'phone_call',
          speaker: {
            name: 'Operator Vance (Scammer)',
            role: 'Extortion Operator',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            mood: 'urgent'
          },
          narration: 'A harsh male voice takes the phone, prohibiting Arthur from hanging up or placing a secondary call to Maya\'s mother.',
          dialogueText: 'Listen carefully, old man. Your daughter caused $4,800 in vehicle damages. You must wire $4,800 via instant peer-to-peer transfer within 20 minutes, or we turn her over to local detention! Do not hang up or call police or we disconnect!',
          keyTakeaway: 'Forbidding secondary verification calls and setting tight 20-minute timers are telltale signs of emergency extortion scams.'
        },
        {
          id: 'sc_echo_ch5_5',
          sceneNumber: 5,
          chapterNumber: 5,
          chapterTitle: 'The Incident',
          title: 'Drained Savings & The Peaceful Post',
          locationName: 'Dr. Pendelton\'s Residence',
          mediaType: 'news_alert',
          speaker: {
            name: 'Cyber Crime Emergency Alert',
            role: 'Fraud Warning Notice',
            mood: 'panicked'
          },
          narration: 'Terrified for his daughter\'s life, Arthur wire-transfers $4,800. An hour later, Maya posts a peaceful photo on Instagram eating lunch at her geology camp, entirely unaware of any accident. Arthur realizes he was scammed by an AI voice clone synthesized from her YouTube vlog.',
          dialogueText: 'FRAUD ALERT: Cybercriminals harvested 2 minutes of speech from Maya\'s YouTube video, trained an ElevenTTS AI model, and spoofed a satellite call to extort her family.',
          keyTakeaway: 'Always perform out-of-band verification by calling the person directly or contacting field supervisors before sending money.'
        },
        {
          id: 'sc_echo_ch6_6',
          sceneNumber: 6,
          chapterNumber: 6,
          chapterTitle: 'Investigation Begins',
          title: 'Acoustic Forensics & VOIP Tracing',
          locationName: 'Forensics Audio Laboratory',
          mediaType: 'police_dispatch',
          speaker: {
            name: 'Chief Investigator Vance',
            role: 'Acoustic Forensics Director',
            mood: 'urgent'
          },
          narration: 'The Cyber Crime Unit initiates acoustic spectrogram analysis on the recorded voicemail and traces the VOIP server.',
          dialogueText: 'Investigator, inspect the voicemail audio file in the Evidence Lab. Look for synthetic pitch artifacts, run WHOIS traces on the VOIP proxy, and interrogate student IT assistant Julian Vance to locate the cloning engine.',
          keyTakeaway: 'Proceed to the Investigation Room to examine the audio recording, analyze spectral logs, and interview witnesses.'
        }
      ]
    },
    learningObjectives: [
      'Understand how AI voice cloning models harvest voice samples from public videos.',
      'Detect synthetic audio artifacts (robotic cadence, unnatural pitch stability, static loops).',
      'Establish strict out-of-band verification protocols for emergency or financial requests.'
    ],
    warningSigns: [
      'Voicemails or phone calls demanding secret financial transfers to bypass official approval steps.',
      'Caller voice exhibits subtle mechanical pauses, missing background ambient noise, or unnatural pitch stability.',
      'Extreme emotional pressure forbidding secondary verification calls to family or authorities.'
    ],
    manipulationTechniques: [
      'Biometric Deception (AI Voice Cloning)',
      'Emergency Family Panic Fabrication',
      'Strict Out-of-Band Prevention (Forbidding hang-ups)'
    ],
    leads: [
      {
        id: 'lead_analyze_audio_spectrogram',
        title: 'Run Spectrogram Analysis on Voicemail',
        description: 'Load the recorded voicemail in the Evidence Lab and inspect audio spectral frequencies for synthetic voice generator artifacts.',
        targetType: 'evidence',
        targetId: 'ev_voice_recording',
        isUnlocked: true,
        isCompleted: false,
        unlocksLeads: ['lead_trace_voice_sample', 'lead_interview_harrison'],
        unlocksEvidenceIds: ['ev_voice_spectral_log'],
        unlocksWitnessIds: ['wit_principal_harrison'],
        rewardXp: 110,
        hint: 'Use the Source Audit button in Evidence Lab on the Voice Recording.'
      },
      {
        id: 'lead_trace_voice_sample',
        title: 'Trace Public Audio Harvesting Source',
        description: 'Find where the perpetrators obtained Maya\'s voice sample used to train the voice model.',
        targetType: 'evidence',
        targetId: 'ev_voice_spectral_log',
        isUnlocked: false,
        isCompleted: false,
        unlocksLeads: ['lead_interrogate_sam'],
        unlocksWitnessIds: ['wit_sam_coder'],
        rewardXp: 130,
        hint: 'Inspect the Spectral Analysis Log in the Evidence cabinet.'
      },
      {
        id: 'lead_interview_harrison',
        title: 'Interview Dr. Arthur Pendelton',
        description: 'Confirm Arthur\'s timeline during the call and verify Maya\'s public YouTube video uploads.',
        targetType: 'witness',
        targetId: 'wit_principal_harrison',
        isUnlocked: false,
        isCompleted: false,
        rewardXp: 100,
        hint: 'Ask Dr. Pendelton about Maya\'s YouTube vlog in the Interrogation Terminal.'
      },
      {
        id: 'lead_interrogate_sam',
        title: 'Interrogate IT Assistant Julian Vance',
        description: 'Confront student IT assistant Julian Vance about the voice cloning repository found on his server.',
        targetType: 'witness',
        targetId: 'wit_sam_coder',
        isUnlocked: false,
        isCompleted: false,
        unlocksLeads: ['lead_voice_conference'],
        rewardXp: 180,
        hint: 'Present the Voice Spectral Log to Julian during interrogation.'
      },
      {
        id: 'lead_voice_conference',
        title: 'Present Case Brief at Case Conference',
        description: 'Present your findings to Chief Detective showing how voice cloning was executed.',
        targetType: 'conference',
        isUnlocked: false,
        isCompleted: false,
        rewardXp: 280,
        hint: 'Go to Case Conference tab and submit your analysis.'
      }
    ],
    evidences: [
      {
        id: 'ev_voice_recording',
        name: 'Voicemail & Call Intercept MP3',
        type: 'audio',
        description: 'Recorded satellite call received by Dr. Arthur Pendelton demanding $4,800 emergency transfer.',
        content: `AUDIO TRANSCRIPT // DURATION: 00:32
"Dad! Dad, please help me! I was in a terrible crash on the mountain road... my brake line snapped and I hit a local driver's vehicle... these local operators won't let me leave unless you pay the damages right now!"

FORENSIC AUDIO NOTE:
Unnatural pitch stability detected at 1.2 kHz. Lack of physiological breath pause between sentences.`,
        isLocked: false,
        dateCollected: '04:30 PM Yesterday',
        source: 'Victim Phone Recorder',
        category: 'AUDIO EVIDENCE',
        importance: 'Critical',
        inspectablePoints: [
          {
            id: 'vp1',
            label: 'Unnatural Pitch Stability',
            detail: 'Human speech has pitch micro-variations. Flat synthetic frequencies indicate AI generative models.',
            revealsLeadId: 'lead_trace_voice_sample'
          },
          {
            id: 'vp2',
            label: 'Command Not to Hang Up',
            detail: 'Scammers instruct victims not to hang up or call family to prevent out-of-band verification.',
            revealsLeadId: 'lead_interview_harrison'
          }
        ]
      },
      {
        id: 'ev_voice_spectral_log',
        name: 'Spectral Frequency & Model Hash Log',
        type: 'system_file',
        description: 'Audio forensic spectrogram analysis comparing Maya\'s speech from YouTube clips against the emergency voicemail.',
        content: `SPECTRAL WAVEFORM COMPARISON REPORT
Source Sample A: "North Pass Geology Camp Vlog" (YouTube Channel - 2 mins speech)
Target Sample B: Emergency Voicemail

MATCH RESULTS:
- Voice Print Similarity: 98.7%
- Synthesis Engine Identified: ElevenTTS-v2 (Cloned Model Hash #88192)
- Training Audio Origin: Scraped directly from YouTube video URL: youtube.com/watch?v=maya_geology_vlog
- Creator Account IP: 192.168.1.104 (Campus IT Lab Proxy)`,
        isLocked: true,
        unlockCondition: 'Inspect Voicemail or Complete Lead: Run Spectrogram Analysis',
        dateCollected: '06:00 PM Yesterday',
        source: 'Acoustic Forensics Lab',
        category: 'FORENSIC SPECTROGRAM',
        importance: 'Critical'
      }
    ],
    witnesses: [
      {
        id: 'wit_principal_harrison',
        name: 'Dr. Arthur Pendelton',
        role: 'University History Professor (Victim)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        description: 'History professor for 18 years. Devoted father who acted out of sheer panic when he heard his daughter crying.',
        promptKnowledge: 'You are Dr. Arthur Pendelton. You were grading papers when you received the panicked call. The voice sounded 100% like Maya. You transferred $4,800 out of fear.',
        status: 'available',
        personalityTrait: 'Calm, Protective, Devastated',
        motive: 'Protecting his daughter and assisting the investigation.',
        suspicionLevel: 'Innocent'
      },
      {
        id: 'wit_sam_coder',
        name: 'Julian Vance',
        role: 'Student IT Assistant & Developer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        description: 'Tech-savvy student assistant with administrative access to video tools and audio processing APIs.',
        promptKnowledge: 'You are Julian Vance. You initially claim your code was stolen from GitHub. When confronted with spectral logs, you confess you were paid $1,500 by a Telegram contact named "Nexus" to build the voice model.',
        status: 'locked',
        personalityTrait: 'Defensive, Tech-savvy, Nervous',
        motive: 'Sold voice clone models online for cash.',
        suspicionLevel: 'Prime Suspect',
        confrontationTriggers: [
          {
            evidenceId: 'ev_voice_spectral_log',
            dialogueResponse: 'Okay! I downloaded Maya\'s YouTube vlog audio and trained an ElevenTTS voice clone because a contact named "Nexus" on Telegram paid me $1,500 in crypto!',
            revealsLeadId: 'lead_voice_conference'
          }
        ]
      }
    ],
    timeline: [
      {
        id: 'tl_voice_1',
        time: 'Day 1 - 08:15 AM',
        description: 'Maya uploads 2-minute mountain geology vlog to public YouTube channel.',
        isCorrect: true,
        orderIndex: 1,
        isInitiallyKnown: true
      },
      {
        id: 'tl_voice_2',
        time: 'Day 1 - 02:00 PM',
        description: 'Perpetrators scrape YouTube audio and generate ElevenTTS voice clone model.',
        isCorrect: true,
        orderIndex: 2,
        isInitiallyKnown: true
      },
      {
        id: 'tl_voice_3',
        time: 'Day 1 - 04:30 PM',
        description: 'Dr. Arthur Pendelton receives spoofed satellite call demanding $4,800 emergency transfer.',
        isCorrect: true,
        orderIndex: 3,
        isInitiallyKnown: false
      }
    ],
    clues: [
      {
        id: 'cl_voice_1',
        text: 'Voicemail exhibited synthetic pitch artifacts and unnatural sentence pauses.',
        evidenceId: 'ev_voice_recording',
        isDiscovered: true
      },
      {
        id: 'cl_voice_2',
        text: 'Voice model was trained on YouTube video scraped by IT assistant Julian Vance.',
        evidenceId: 'ev_voice_spectral_log',
        isDiscovered: false
      }
    ],
    initialWallNodes: [
      { id: 'node_harrison', title: 'Dr. Pendelton (Target)', type: 'suspect', x: 20, y: 30, description: 'Voice Cloned Victim' },
      { id: 'node_sam', title: 'Julian Vance', type: 'suspect', x: 80, y: 30, description: 'IT Assistant Developer' },
      { id: 'node_voicemail', title: 'Voicemail MP3', type: 'evidence', x: 35, y: 70, description: 'Synthetic Frequencies' },
      { id: 'node_spectrogram', title: 'Acoustic Log', type: 'digital', x: 65, y: 70, description: 'Model Hash Match' }
    ],
    conferenceConfig: {
      promptContext: 'Evaluating AI voice cloning & family extortion case.',
      suspectOptions: [
        { id: 'wit_sam_coder', name: 'Julian Vance', role: 'IT Assistant & Voice Model Synthesizer' },
        { id: 'wit_principal_harrison', name: 'Dr. Arthur Pendelton', role: 'Victim' }
      ],
      mechanismOptions: [
        { id: 'm1', label: 'AI Voice Cloning & Out-of-Band Bypassing', description: 'Scraping public audio to build synthetic voice models, then calling under emergency pretexts while telling victims not to call back.' },
        { id: 'm2', label: 'Physical Phone Tap', description: 'Tapping landline wires.' }
      ],
      preventionOptions: [
        { id: 'p1', label: 'Out-of-Band Callback & Secondary Verification', description: 'Always verify emergency financial calls by calling back on known personal numbers or contacting supervisors.' },
        { id: 'p2', label: 'Trust Voice Alone Without Verification', description: 'Rely on voice recognition.' }
      ]
    },
    location: {
      name: 'Campus IT Media Suite',
      description: 'The broadcasting studio where campus videos are edited and server logs are archived.',
      coordinates: '34.0522° N, 118.2437° W',
      imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
      hotspots: [
        {
          id: 'hs_voice_1',
          name: 'Editing Console #2',
          x: 50,
          y: 50,
          description: 'Console containing audio extraction tools and ElevenTTS voice model project folders.',
          revealsEvidenceId: 'ev_voice_spectral_log'
        }
      ]
    },
    solution: {
      questions: [
        {
          id: 'q1',
          question: 'Who synthesized Maya\'s voice clone model from her YouTube vlog?',
          choices: ['Julian Vance', 'Dr. Arthur Pendelton', 'Maya Pendelton', 'Mrs. Miller'],
          correctAnswer: 'Julian Vance',
          explanation: 'Julian Vance downloaded Maya\'s public YouTube audio and generated the synthetic voice model.'
        },
        {
          id: 'q2',
          question: 'What is the most effective defense against voice cloning emergency scams?',
          choices: [
            'Out-of-band verification (calling back on a trusted personal number or checking with colleagues).',
            'Hanging up and ignoring all calls.',
            'Sending cash instead of wire transfers.',
            'Relying purely on pitch quality.'
          ],
          correctAnswer: 'Out-of-band verification (calling back on a trusted personal number or checking with colleagues).',
          explanation: 'Always verify financial requests by placing a separate call to a known verified number.'
        }
      ]
    }
  },

  // =========================================================================
  // CASE 3: The Ghost in the Ledger
  // Theme: Investment Fraud, Identity Theft & Fake Trading Terminal
  // =========================================================================
  {
    id: 'case_ghost_ledger',
    title: 'The Ghost in the Ledger',
    topic: 'Investment Fraud & Identity Theft',
    difficulty: 'HIGH',
    status: 'HIGH PRIORITY',
    tag: 'INVESTMENT FRAUD & IDENTITY THEFT',
    threatActor: 'Aegis Wealth Syndicate',
    timeLimit: '36 HOURS',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    introduction: 'Sophia Lin, a freelance graphic artist saving for her family home, was approached by a charming investor offering access to "Aegis Wealth Terminal". After depositing her $25,000 savings into fake trading pools and uploading identity papers, the platform vanished into thin air.',
    storyIntro: {
      summary: 'Sophia Lin was befriended by "David Sterling", a high-profile venture advisor who bought her digital artwork and introduced her to Aegis Wealth Terminal. After showing false 18% daily returns and letting her make a small $50 test withdrawal, the site vanished along with her $25,000 life savings.',
      victimName: 'Sophia Lin',
      victimRole: 'Freelance Graphic Artist (Age 26)',
      incidentTime: 'Yesterday Morning',
      scenes: [
        {
          id: 'sc_ghost_ch1_1',
          sceneNumber: 1,
          chapterNumber: 1,
          chapterTitle: 'A Normal Day',
          title: 'Art Studio & Home Savings',
          locationName: 'Sophia\'s Design Studio',
          mediaType: 'text_chat',
          speaker: {
            name: 'Sophia Lin',
            role: 'Freelance Artist (Age 26)',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
            mood: 'neutral'
          },
          narration: 'Sophia Lin balances accounting work with digital illustration. She has spent 4 years meticulously saving $25,000 to purchase a modest condo for her elderly parents.',
          dialogueText: 'I just hit $25,000 in my savings account! If I can find a safe investment vehicle that yields decent returns, I can finally put down a home deposit by next winter.',
          keyTakeaway: 'Understanding Sophia\'s personal goal to buy a home for her parents explains her receptivity to wealth management opportunities.'
        },
        {
          id: 'sc_ghost_ch2_2',
          sceneNumber: 2,
          chapterNumber: 2,
          chapterTitle: 'The Opportunity',
          title: 'The Wealth Advisor Recruiter',
          locationName: 'Professional Art Network',
          mediaType: 'email_preview',
          speaker: {
            name: 'David Sterling',
            role: 'Venture Collector & Advisor',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
            mood: 'confident'
          },
          narration: 'Sophia receives a highly complimentary message from "David Sterling", claiming to be a venture investor who wants to commission her artwork and mentor her in wealth management.',
          dialogueText: 'Sophia, your digital art portfolio is extraordinary! I want to buy 2 pieces for $1,200 each. By the way, my firm operates Aegis Wealth Terminal—an exclusive institutional trading portal with guaranteed 18% yields.',
          mediaContent: {
            sender: 'david.sterling@aegiswealthterminal.org',
            recipient: 'sophia.lin@artmail.com',
            header: 'Art Commission Inquiry & Aegis Wealth Invitation',
            body: 'Dear Sophia, I am thrilled to commission your artwork. Additionally, I would be honored to mentor you in high-yield institutional asset pools.'
          },
          keyTakeaway: 'Scammers frequently build trust by purchasing goods or paying small commissions before introducing fake investment schemes.'
        },
        {
          id: 'sc_ghost_ch3_3',
          sceneNumber: 3,
          chapterNumber: 3,
          chapterTitle: 'Building Trust',
          title: 'The Small Test Withdrawal',
          locationName: 'Aegis Wealth Terminal Dashboard',
          mediaType: 'text_chat',
          speaker: {
            name: 'David Sterling',
            role: 'Venture Collector & Advisor',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
            mood: 'confident'
          },
          narration: 'David guides Sophia to register on aegiswealthterminal.org, deposit $500, and watch her balance tick up on realistic live charts. To prove legitimacy, he encourages her to withdraw $50 back into her real bank account.',
          dialogueText: 'See Sophia? You just withdrew $50 of profit in 2 minutes! Aegis is fully regulated. Now is the perfect time to transfer your main savings into our VIP Institutional Pool before the round closes tonight.',
          keyTakeaway: 'Allowing victims to make small initial test withdrawals is a calculated trap to build total confidence before soliciting large sums.'
        },
        {
          id: 'sc_ghost_ch4_4',
          sceneNumber: 4,
          chapterNumber: 4,
          chapterTitle: 'Warning Signs',
          title: 'The 20% Tax Clearance Demand',
          locationName: 'Aegis Compliance Portal',
          mediaType: 'email_preview',
          speaker: {
            name: 'Aegis Compliance Officer',
            role: 'Fake Terminal Audit',
            mood: 'urgent'
          },
          narration: 'Convinced, Sophia deposits her full $25,000 savings. A week later, when she requests her full balance withdrawal, the portal blocks her request, demanding a 20% "IRS Anti-Money Laundering Tax Fee" of $5,000 upfront.',
          dialogueText: 'WITHDRAWAL HOLD NOTICE: Account #9912 flags AML inspection. Customer must deposit an advance 20% Tax Clearance Fee ($5,000 USD) in crypto within 24 hours to release held funds.',
          mediaContent: {
            sender: 'compliance@aegiswealthterminal.org',
            recipient: 'sophia.lin@artmail.com',
            header: '⚠️ URGENT HOLD: 20% AML Tax Clearance Fee Required',
            body: 'Notice: Your balance of $29,500 is locked pending AML verification. Wire $5,000 in crypto to complete release.'
          },
          keyTakeaway: 'Demanding advance tax clearance fees or "release deposits" to access your own investment funds is a 100% guarantee of investment fraud.'
        },
        {
          id: 'sc_ghost_ch5_5',
          sceneNumber: 5,
          chapterNumber: 5,
          chapterTitle: 'The Incident',
          title: '404 Error & Stolen Identity',
          locationName: 'Sophia\'s Apartment',
          mediaType: 'news_alert',
          speaker: {
            name: 'Financial Fraud Warning',
            role: 'Identity Theft Incident',
            mood: 'panicked'
          },
          narration: 'Refusing to pay more money, Sophia tries to message David. His profile is deleted. Aegis Wealth Terminal collapses into a 404 error. Two days later, Sophia receives bank alerts for unauthorized loan applications opened in her name using identity documents she uploaded during "KYC verification".',
          dialogueText: 'CRIME LOG: Aegis Wealth Terminal was a fake trading portal designed to harvest $25,000 in crypto savings and steal national identity papers.',
          keyTakeaway: 'Fake trading platforms steal both money and identity papers, enabling cybercriminals to open fraudulent bank loans under victim identities.'
        },
        {
          id: 'sc_ghost_ch6_6',
          sceneNumber: 6,
          chapterNumber: 6,
          chapterTitle: 'Investigation Begins',
          title: 'Financial Forensics & Domain Analysis',
          locationName: 'Financial Crimes Task Force',
          mediaType: 'police_dispatch',
          speaker: {
            name: 'Chief Investigator Vance',
            role: 'Financial Crimes Task Force',
            mood: 'urgent'
          },
          narration: 'The Financial Crimes Unit takes over the case. All domain records,fake trading scripts, WHOIS logs, and email headers are indexed in your Investigation Room.',
          dialogueText: 'Investigator, inspect the Aegis portal code, trace the fake WHOIS domain registration, and interrogate student IT developer Julian Vance to unmask the mastermind behind Aegis Wealth.',
          keyTakeaway: 'Proceed to the Investigation Room to examine financial records, audit WHOIS data, and interview witnesses.'
        }
      ]
    },
    learningObjectives: [
      'Identify investment fraud indicators (guaranteed high yields, test withdrawal traps, advance tax fees).',
      'Understand how fake trading portals harvest both money and identity papers.',
      'Verify investment firm licensing on official national financial registries.'
    ],
    warningSigns: [
      'Investment offers guaranteeing 18%+ returns with zero risk.',
      'Demands for advance tax clearance fees or AML release deposits to withdraw funds.',
      'Unlicensed trading portals hosted on newly registered offshore domains (.org / .net).'
    ],
    manipulationTechniques: [
      'Romance & Mentorship Grooming (buying art to build trust)',
      'False Proof of Legitimacy (small test withdrawal trap)',
      'Advance Fee Extortion (20% AML Tax fee demand)'
    ],
    leads: [
      {
        id: 'lead_inspect_email_headers',
        title: 'Inspect Aegis Email Headers & WHOIS',
        description: 'Examine the raw email headers and WHOIS domain registry for aegiswealthterminal.org to verify company credentials.',
        targetType: 'evidence',
        targetId: 'ev_scholar_email',
        isUnlocked: true,
        isCompleted: false,
        unlocksLeads: ['lead_analyze_grant_portal', 'lead_interrogate_thorne'],
        unlocksEvidenceIds: ['ev_scholar_portal'],
        unlocksWitnessIds: ['wit_dr_thorne'],
        rewardXp: 100,
        hint: 'Open the Aegis Email in Evidence Lab and run Source Audit.'
      },
      {
        id: 'lead_analyze_grant_portal',
        title: 'Analyze the Phishing Trading Portal URL',
        description: 'Compare "aegiswealthterminal.org" against official government financial registers.',
        targetType: 'evidence',
        targetId: 'ev_scholar_portal',
        isUnlocked: false,
        isCompleted: false,
        unlocksLeads: ['lead_confront_julian'],
        unlocksWitnessIds: ['wit_julian_vance'],
        rewardXp: 120,
        hint: 'Use the Evidence Verification Toolkit to check the Fact-Check database on the domain.'
      },
      {
        id: 'lead_interrogate_thorne',
        title: 'Interview Financial Fraud Analyst',
        description: 'Speak with Dean Dr. Aris Thorne to verify regulatory compliance standards.',
        targetType: 'witness',
        targetId: 'wit_dr_thorne',
        isUnlocked: false,
        isCompleted: false,
        unlocksLeads: ['lead_unmask_julian'],
        rewardXp: 140,
        hint: 'Interview Dr. Thorne in the Interrogation Terminal.'
      },
      {
        id: 'lead_unmask_julian',
        title: 'Interrogate Web Developer Julian Vance',
        description: 'Confront student IT developer Julian Vance about why his API keys were embedded in the fake trading portal code.',
        targetType: 'witness',
        targetId: 'wit_julian_vance',
        isUnlocked: false,
        isCompleted: false,
        unlocksLeads: ['lead_scholar_conference'],
        rewardXp: 180,
        hint: 'Present the Trading Portal source code evidence to Julian.'
      },
      {
        id: 'lead_scholar_conference',
        title: 'Present Case Brief at Case Conference',
        description: 'Present your findings to Chief Detective confirming how the investment scam operated.',
        targetType: 'conference',
        isUnlocked: false,
        isCompleted: false,
        rewardXp: 250,
        hint: 'Go to Case Conference tab and submit your deduction.'
      }
    ],
    evidences: [
      {
        id: 'ev_scholar_email',
        name: 'Aegis Wealth Terminal Invitation & Tax Fee Notice',
        type: 'email',
        description: 'Email sent to Sophia Lin demanding an advance 20% AML Tax Fee ($5,000) to release her $29,500 trading balance.',
        content: `From: "Aegis Compliance" <compliance@aegiswealthterminal.org>
To: sophia.lin@artmail.com
Subject: ⚠️ URGENT: 20% AML Tax Clearance Fee Required

Dear Sophia,
Your account balance of $29,500 USD is currently locked pending Anti-Money Laundering tax clearance.

To release funds directly into your bank account, deposit a 20% tax clearance fee ($5,000 USD) in crypto to wallet #9942 within 24 hours.

WARNING: Failure to comply will result in account asset forfeiture.`,
        isLocked: false,
        dateCollected: '09:00 AM Yesterday',
        source: 'Victim Inbox',
        category: 'PHISHING EMAIL',
        importance: 'Critical',
        inspectablePoints: [
          {
            id: 'sp1',
            label: 'Fake Domain Extension (.org vs regulated financial .com)',
            detail: 'The domain "aegiswealthterminal.org" is not a registered financial brokerage.',
            revealsLeadId: 'lead_analyze_grant_portal'
          },
          {
            id: 'sp2',
            label: '20% Advance Tax Clearance Fee Demand',
            detail: 'Demanding advance tax fees in crypto to release trading balances is a 100% indicator of investment fraud.',
            revealsLeadId: 'lead_interrogate_thorne'
          }
        ]
      },
      {
        id: 'ev_scholar_portal',
        name: 'Fake Trading Terminal Portal Code',
        type: 'website',
        description: 'Source code and WHOIS data for aegiswealthterminal.org showing form submission routing to an external wallet harvesting server.',
        content: `PORTAL SOURCE CODE AUDIT:
Target Form Action: https://api.shadow-pay.net/harvest/credentials
Submitted Fields: [full_name, national_id_scan, bank_account, online_banking_password]
Developer Signature: // Built by J_Vance_Lab_Dev
Server Host: Offshore Anonymous VPS`,
        isLocked: true,
        unlockCondition: 'Inspect Email or Complete Lead: Analyze Grant Portal',
        dateCollected: '11:15 AM Yesterday',
        source: 'Cyber Forensics Lab',
        category: 'HARVESTING CODE',
        importance: 'Critical'
      }
    ],
    witnesses: [
      {
        id: 'wit_dr_thorne',
        name: 'Dr. Aris Thorne',
        role: 'Financial Crimes Compliance Director',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        description: 'Authentic financial regulator. Confirms that legitimate brokerages never request advance tax fees in crypto to release funds.',
        promptKnowledge: 'You are Dr. Aris Thorne. You state clearly that legitimate investment firms NEVER demand advance tax clearance fees in crypto to release funds.',
        status: 'available',
        personalityTrait: 'Authoritative, Protective, Academic',
        motive: 'Protecting citizens from financial fraud.',
        suspicionLevel: 'Innocent'
      },
      {
        id: 'wit_julian_vance',
        name: 'Julian Vance',
        role: 'Student IT Assistant & Web Developer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        description: 'Web developer who built the fake trading terminal interface.',
        promptKnowledge: 'You are Julian Vance. You admit you were paid $2,000 by an online contact to build the fake trading terminal interface.',
        status: 'locked',
        personalityTrait: 'Nervous, Defensive, Tech-savvy',
        motive: 'Paid by cybercriminals to host fake trading portals.',
        suspicionLevel: 'Prime Suspect',
        confrontationTriggers: [
          {
            evidenceId: 'ev_scholar_portal',
            dialogueResponse: 'Okay, okay! I built the Aegis trading terminal template because a contact named "Nexus" paid me $2,000 in crypto!',
            revealsLeadId: 'lead_scholar_conference'
          }
        ]
      }
    ],
    timeline: [
      {
        id: 'tl_scholar_1',
        time: 'Day 1 - 08:30 AM',
        description: 'Julian Vance deploys aegiswealthterminal.org fake trading portal.',
        isCorrect: true,
        orderIndex: 1,
        isInitiallyKnown: true
      },
      {
        id: 'tl_scholar_2',
        time: 'Day 1 - 09:00 AM',
        description: 'David Sterling contacts Sophia Lin, buys art pieces, and introduces Aegis Wealth Terminal.',
        isCorrect: true,
        orderIndex: 2,
        isInitiallyKnown: true
      },
      {
        id: 'tl_scholar_3',
        time: 'Day 5 - 02:15 PM',
        description: 'Sophia deposits $25,000 savings into Aegis terminal after completing a $50 test withdrawal.',
        isCorrect: true,
        orderIndex: 3,
        isInitiallyKnown: false
      },
      {
        id: 'tl_scholar_4',
        time: 'Day 7 - 04:00 PM',
        description: 'Aegis portal blocks withdrawal, demands $5,000 20% AML Tax clearance fee, then goes offline (404 Error).',
        isCorrect: true,
        orderIndex: 4,
        isInitiallyKnown: false
      }
    ],
    clues: [
      {
        id: 'cl_scholar_1',
        text: 'The Aegis terminal demanded an advance 20% AML Tax fee in crypto to release trading funds.',
        evidenceId: 'ev_scholar_email',
        isDiscovered: true
      },
      {
        id: 'cl_scholar_2',
        text: 'Developer signature in trading portal code matched student IT developer Julian Vance.',
        evidenceId: 'ev_scholar_portal',
        isDiscovered: false
      }
    ],
    initialWallNodes: [
      { id: 'node_sophia', title: 'Sophia Lin (Victim)', type: 'suspect', x: 20, y: 30, description: 'Freelance Artist' },
      { id: 'node_david', title: 'David Sterling', type: 'suspect', x: 50, y: 20, description: 'Fake Wealth Mentor' },
      { id: 'node_julian', title: 'Julian Vance', type: 'suspect', x: 80, y: 30, description: 'Web Developer' },
      { id: 'node_phish_email', title: 'Tax Clearance Email', type: 'evidence', x: 35, y: 70, description: '20% AML Fee Demand' },
      { id: 'node_phish_portal', title: 'Trading Portal Code', type: 'digital', x: 65, y: 70, description: 'Credential Harvester' }
    ],
    conferenceConfig: {
      promptContext: 'Evaluating investment fraud & identity theft case.',
      suspectOptions: [
        { id: 'wit_julian_vance', name: 'Julian Vance', role: 'Web Developer & Fake Trading Portal Host' },
        { id: 'wit_dr_thorne', name: 'Dr. Aris Thorne', role: 'Legitimate Financial Regulator' },
        { id: 'sophia_lin', name: 'Sophia Lin', role: 'Victim Artist' }
      ],
      mechanismOptions: [
        { id: 'm1', label: 'Investment Fraud & Identity Harvesting', description: 'Using fake trading portals, test withdrawals, and advance tax demands to steal savings and identity papers.' },
        { id: 'm2', label: 'Physical Burglary', description: 'Physically breaking into home offices.' }
      ],
      preventionOptions: [
        { id: 'p1', label: 'Regulatory Financial Registry Check & No Advance Fees', description: 'Verify brokers on official government financial registries, and never pay advance tax clearance fees to release funds.' },
        { id: 'p2', label: 'Pay All Upfront Fees Immediately', description: 'Pay advance tax fees to unlock balances.' }
      ]
    },
    location: {
      name: 'Aegis Server Hosting Hub',
      description: 'The server hosting room where domain registration traffic was routed.',
      coordinates: '37.7749° N, 122.4194° W',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      hotspots: [
        {
          id: 'hs_scholar_1',
          name: 'IT Terminal #4',
          x: 40,
          y: 50,
          description: 'Terminal logged into Julian Vance\'s account showing open SSH connections to aegiswealthterminal.org.',
          revealsEvidenceId: 'ev_scholar_portal'
        }
      ]
    },
    solution: {
      questions: [
        {
          id: 'q1',
          question: 'Who hosted the fake Aegis Wealth Terminal portal?',
          choices: ['Julian Vance', 'Dr. Aris Thorne', 'Sophia Lin', 'Victor Sterling'],
          correctAnswer: 'Julian Vance',
          explanation: 'Julian Vance built and hosted the fake trading terminal interface for cybercriminals.'
        },
        {
          id: 'q2',
          question: 'What is the primary indicator of investment fraud?',
          choices: [
            'Guaranteed 18%+ returns, test withdrawal traps, and demands for advance 20% AML tax clearance fees in crypto.',
            'Receiving quarterly financial statements.',
            'Trading during regular market hours.',
            'Opening an account with a licensed broker.'
          ],
          correctAnswer: 'Guaranteed 18%+ returns, test withdrawal traps, and demands for advance 20% AML tax clearance fees in crypto.',
          explanation: 'Real brokerages never guarantee 18%+ returns or demand advance tax clearance fees in crypto to release your own money.'
        }
      ]
    }
  }
];
