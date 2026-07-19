import { Case } from '../types';

export const HANDCRAFTED_CASES: Case[] = [
  {
    id: 'case_echo_chamber',
    title: 'The Echo Chamber Bubble',
    topic: 'Algorithms, Echo Chambers & Confirmation Bias',
    difficulty: 'EASY',
    status: 'HIGH PRIORITY',
    tag: 'ALGORITHMIC BIAS',
    threatActor: 'Viral Recommendation Engine',
    timeLimit: '12:00 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    introduction: 'Maya Lin, an active high school student leader, has been falsely accused of ruining a local youth project after a 10-second video of her was taken out of context on the "CliqClok" platform. The recommendation algorithm trapped local students in a "filter bubble," pushing repetitive outrage content that created confirmation bias. Our goal is to analyze the source footage, map how the platform algorithm amplified the bias, and dismantle the echo chamber.',
    learningObjectives: [
      'Understand how recommendation algorithms create "filter bubbles" by reinforcing personal biases.',
      'Recognize how confirmation bias makes individuals accept false rumors without cross-checking.',
      'Identify the visual and contextual cues that indicate video manipulation or out-of-context clips.',
      'Learn the digital literacy steps to break out of digital echo chambers.'
    ],
    warningSigns: [
      'Social media feeds showing extremely repetitive viewpoints with zero counter-opinions.',
      'Sensationalist short-form videos with sudden cuts or missing background context.',
      'A sudden surge of emotional hostility toward an individual based on a single video clip.',
      'The platform showing "suggested for you" content that escalates in emotional severity.'
    ],
    manipulationTechniques: [
      'Context Splicing (cutting out vital context to reverse the meaning of an event).',
      'Algorithmic Amplification (recommender loops favoring outrage to increase user screen-time).',
      'Confirmation Bias (appealing to existing peer dynamics so users immediately believe the worst).'
    ],
    evidences: [
      {
        id: 'ev_spliced_video',
        name: 'Spliced_CliqClok_Video.mp4',
        type: 'image',
        description: 'Analysis of the viral clip that sparked the school outrage.',
        content: '[VIDEO FRAME-BY-FRAME ANALYSIS]\nTimestamp: July 10th, 08:30 AM\nClip length: 11 seconds.\nVisual audit: The video shows Maya saying, "I do not care about the community center and we should close it down."\nForensic Discovery: At 0:05, there is an audio amplitude gap and an invisible frame cut. In the original unedited transcript, Maya actually said, "A few trolls claim that I do not care about the community center and we should close it down, but that is totally false."\nKey Lesson: Context slicing completely inverted the statement.',
        isLocked: false
      },
      {
        id: 'ev_algo_variables',
        name: 'CliqClok_Recommender_Metrics.json',
        type: 'system_file',
        description: 'Internal platform metrics showing how the video spread.',
        content: 'Algorithm Weighting Settings:\n- Watch-time retention multiplier: 4.5x (highest weight given to conflict/outrage)\n- User-comment velocity: 3.2x\n- Echo-Chamber Index: 92% of viewers of the spliced clip were only shown similar negative clips, creating an absolute feedback loop in under 2 hours.\nKey Lesson: Algorithms prioritize user watch-time over truth.',
        isLocked: false
      },
      {
        id: 'ev_chat_reconciliation',
        name: 'StudyGroup_Admin_Logs.txt',
        type: 'chat',
        description: 'School study group coordinator chats discussing the rumor.',
        content: '[STUDY GROUP SYSTEM]\nChloe: "Did you see that video of Maya? She is so selfish."\nClara: "Wait, has anyone actually asked Maya for her side? It looks edited."\nChloe: "Everyone on CliqClok is saying she said it. The algorithm doesn\'t lie, Clara! Let\'s ban her from the student project chats."\nKey Lesson: Peer pressure and echo chambers quickly silence critical thinking.',
        isLocked: true,
        unlockCondition: 'interview_witness_clara'
      }
    ],
    witnesses: [
      {
        id: 'wit_clara',
        name: 'Clara Oswald',
        role: 'Skeptical Student Peer',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
        description: 'A thoughtful classmate who felt pressured to go along with the crowd but noticed inconsistencies in the viral post.',
        promptKnowledge: 'You are Clara Oswald, a high school junior. You felt terrible about how quickly everyone turned on Maya. You say: "I wanted to help Maya, but the CliqClok feed was absolutely flooded with hate comments, and Chloe told everyone that if we supported Maya, we would be cancelled too. The algorithm kept feeding us the exact same edited clip with creepy background music. It felt impossible to argue because everyone believed it was real. I am so glad you are looking into the original full recording!"',
        status: 'available'
      },
      {
        id: 'wit_chloe',
        name: 'Chloe Smith',
        role: 'Group Admin / Coordinator',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
        description: 'The student project admin who banned Maya after receiving hundreds of algorithm-driven recommendations.',
        promptKnowledge: 'You are Chloe Smith. You are defensive but starting to realize you made a huge mistake. You say: "Look, my phone was literally vibrating every second with notifications. CliqClok showed me like twenty different videos of people reacting to Maya’s clip. They all said she was a fraud. It was trending! I thought since everyone agreed, it had to be true. I didn\'t know about context slicing. I just thought I was protecting the student project by removing her."',
        status: 'available'
      }
    ],
    timeline: [
      {
        id: 'time_ec1',
        time: 'July 9, 05:00 PM',
        description: 'Maya speaks at a student forum, defending the community center against bad faith criticisms.',
        isCorrect: true,
        orderIndex: 0
      },
      {
        id: 'time_ec2',
        time: 'July 9, 11:00 PM',
        description: 'An anonymous account cuts an 11-second snippet of Maya\'s speech, completely removing her introductory and concluding qualifiers.',
        isCorrect: true,
        orderIndex: 1
      },
      {
        id: 'time_ec3',
        time: 'July 10, 08:00 AM',
        description: 'The CliqClok recommender algorithm detects high early comment activity and prioritizes the clip, boosting its weight 4.5x for local users.',
        isCorrect: true,
        orderIndex: 2
      },
      {
        id: 'time_ec4',
        time: 'July 10, 12:00 PM',
        description: 'Students trapped in the algorithm-driven echo chamber ban Maya from student project networks without verifying the source.',
        isCorrect: true,
        orderIndex: 3
      }
    ],
    clues: [
      { id: 'cl_context_splice', text: 'The viral video contains a hidden frame cut and audio gap, hiding Maya\'s actual words.', isDiscovered: false, evidenceId: 'ev_spliced_video' },
      { id: 'cl_algorithm_echo', text: 'The platform algorithm used a 4.5x outrage multiplier to lock students inside a filter bubble.', isDiscovered: false, evidenceId: 'ev_algo_variables' }
    ],
    solution: {
      questions: [
        {
          id: 'q1',
          question: 'What is a "filter bubble" in the context of media recommendation algorithms?',
          choices: [
            'A security firewall that blocks malware.',
            'An algorithmically generated state of isolation where users only see content reinforcing their existing beliefs.',
            'A custom chat group created for classroom study.',
            'An interactive video game dashboard.'
          ],
          correctAnswer: 'An algorithmically generated state of isolation where users only see content reinforcing their existing beliefs.',
          explanation: 'Filter bubbles are created when platform algorithms repeatedly serve content similar to what a user has clicked or hovered over in the past. This blocks out alternate perspectives and accelerates echo chambers.'
        },
        {
          id: 'q2',
          question: 'What is the most effective Media Literacy action when encountering a highly emotional viral video about someone?',
          choices: [
            'Share it immediately with friends to warn them.',
            'Report the person featured to the police.',
            'Search for the unedited, full-length source video and check if it has been context-spliced.',
            'Trust the platform because trending videos are always true.'
          ],
          correctAnswer: 'Search for the unedited, full-length source video and check if it has been context-spliced.',
          explanation: 'A critical MIL skill is lateral reading: leaving the emotional platform post to search for primary unedited sources, identifying cuts, audio splices, or misleading headlines.'
        }
      ]
    },
    location: {
      name: 'CliqClok Analysis Hub',
      description: 'The digital analytics space where investigators examine recommender metrics and raw audio-visual logs.',
      coordinates: '35.6762° N, 139.6503° E',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      hotspots: [
        { id: 'hs_server', name: 'Algorithm Database Node', x: 45, y: 35, description: 'The CliqClok metadata register displaying the watch-time weightings.', revealsEvidenceId: 'ev_algo_variables' }
      ]
    }
  },
  {
    id: 'case_synthetic_impostor',
    title: 'The Deepfake Impostor',
    topic: 'Deepfakes, Voice Synthesis & AI Spoofing',
    difficulty: 'MED',
    status: 'URGENT',
    tag: 'AI FORENSICS',
    threatActor: 'AI Synthetics Ring',
    timeLimit: '24:00 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800',
    introduction: 'A voice recording of Principal Davis claiming that school funds were embezzled and that all classes are cancelled was sent directly to local parents, provoking deep anxiety and chaos. Principal Davis claims he never made such a call, but the voice sounds identical to his. This looks like a synthetic voice-cloning attack. We must examine audio frequency anomalies, trace the synthetic source, and understand the dangers of generative AI manipulation.',
    learningObjectives: [
      'Recognize structural anomalies (robotic pacing, flat breathing) that indicate AI voice cloning.',
      'Understand how cybercriminals harvest public audio to generate highly realistic voice prints.',
      'Establish personal verification strategies (family safety words, direct callback checks) to protect against spoofing.',
      'Understand the ethical implications of deepfake technology on public trust.'
    ],
    warningSigns: [
      'An emergency audio message pleading with you to keep it a secret and transfer immediate funds.',
      'A voice that sounds familiar but has unnatural breathing patterns, robotic pauses, or metallic interference.',
      'The caller refusing to answer custom questions or acting confused when asked about past shared memories.',
      'An urgent call coming from a spoofed, hidden, or completely unfamiliar phone number.'
    ],
    manipulationTechniques: [
      'Emotional Panicking (using a simulated disaster to override rational doubts).',
      'Artificial Voice Synthesis (harvesting open-source podcasts or videos to train neural voices).',
      'Urgent Authority Spoofing (impersonating figures of authority like principals or family heads).'
    ],
    evidences: [
      {
        id: 'ev_voice_log',
        name: 'Urgent_Davis_Voicemail.wav',
        type: 'image',
        description: 'Detailed spectral analysis of the voicemail received by parents.',
        content: '[SPECTRAL ANALYSIS REPORT]\nSource: 0.04-second sample chunks.\nBiometrics match: Davis\'s public video channel (98.2% frequency match).\nAI Forensic Markers:\n1. Total absence of background breathing or inhalation cues.\n2. Perfectly flat silent periods with zero ambient hum, indicating synthesized text-to-speech blocks.\n3. Robotic artifacts around hard consonants (p, t, k) showing neural network voice patch transitions.',
        isLocked: false
      },
      {
        id: 'ev_harvest_source',
        name: 'Davis_Public_Audio_Harvest.txt',
        type: 'document',
        description: 'Web scraping log from an open directory hosting local files.',
        content: '[WEB HARVESTER PROTOCOL]\nTarget URL: https://school.edu/podcasts/Davis_Weekly_Address\nDownloaded files: 45 MP3 files containing 22 hours of Principal Davis speaking.\nCompilation tool detected: "ElevenLabs_Synthetic_Studio_v2"\nVoice model created: "Davis_Model_v3" on July 14th.',
        isLocked: false
      },
      {
        id: 'ev_spoofed_sms',
        name: 'SMS_Spoofing_Gateway_Logs.json',
        type: 'system_file',
        description: 'SMS router metadata showing how the call was distributed.',
        content: 'SMS Broadcast Gateway: Simplex-Bulk-Gateway\nSpoofed Origin Number: +1 (555) 0192 (Principal Davis\'s official office number)\nReal Origin Node: IP 198.51.100.42 (Anonymous VPN server based in Osaka)\nAction: Coordinated broadcast of the voicemail file to 850 parent numbers.',
        isLocked: true,
        unlockCondition: 'interview_witness_arthur'
      }
    ],
    witnesses: [
      {
        id: 'wit_arthur',
        name: 'Arthur Davis',
        role: 'Targeted Principal',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
        description: 'The school principal whose voice was harvested from weekly school podcasts to train an AI model.',
        promptKnowledge: 'You are Arthur Davis, school principal. You are shocked and deeply concerned. You say: "I never recorded that voicemail. I host a weekly school podcast to keep parents updated about school activities—I guess the scammers downloaded all my podcasts to train an AI voice clone. I was shocked when parents called me crying. How can we trust any audio or video anymore if computers can copy us so easily?"',
        status: 'available'
      },
      {
        id: 'wit_devon',
        name: 'Devon Miller',
        role: 'Parent Coordinator',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        description: 'The parent coordinator who panicked and forwarded the audio to hundreds of group chats.',
        promptKnowledge: 'You are Devon Miller. You feel guilty for accelerating the panic. You say: "The voicemail sounded exactly like Mr. Davis. It said there was an embezzlement emergency and classes were cancelled. I freaked out and forwarded it to the school group chat immediately. In hindsight, I should have called his office directly to verify instead of spreading the panic to hundreds of families. I learned my lesson about media literacy the hard way."',
        status: 'available'
      }
    ],
    timeline: [
      {
        id: 'time_si1',
        time: 'July 1',
        description: 'Scammers scraper-bot downloads 22 hours of Principal Davis\'s school podcasts to compile high-quality speech libraries.',
        isCorrect: true,
        orderIndex: 0
      },
      {
        id: 'time_si2',
        time: 'July 14',
        description: 'The voice studio training model produces "Davis_Model_v3", a neural network voice clone capable of converting arbitrary text into Davis\'s voice.',
        isCorrect: true,
        orderIndex: 1
      },
      {
        id: 'time_si3',
        time: 'July 15, 08:00 AM',
        description: 'Scammers use an IP spoofing SMS gateway to send the synthesized Davis warning audio, falsifying the sender ID as the official school office.',
        isCorrect: true,
        orderIndex: 2
      },
      {
        id: 'time_si4',
        time: 'July 15, 09:00 AM',
        description: 'Panicked parent groups forward the audio message across social networks, causing school closures and neighborhood panic.',
        isCorrect: true,
        orderIndex: 3
      }
    ],
    clues: [
      { id: 'cl_voice_synth_markers', text: 'Voice file features flat breathing cycles and robotic spectral boundaries indicative of AI voice-cloning.', isDiscovered: false, evidenceId: 'ev_voice_log' },
      { id: 'cl_podcasts_harvest', text: 'Scammers scraped Davis\'s podcasts to construct a custom generative voice clone model.', isDiscovered: false, evidenceId: 'ev_harvest_source' }
    ],
    solution: {
      questions: [
        {
          id: 'q1',
          question: 'What is the most effective verification strategy when receiving an urgent, panic-inducing call or voice message from a relative or authority figure?',
          choices: [
            'Send money immediately to prevent any risks.',
            'Forward the voice note to all social media groups to warn others.',
            'Hang up, look up the official contact number independently, and call back directly to verify.',
            'Assume that if the voice sounds correct, it must be authentic.'
          ],
          correctAnswer: 'Hang up, look up the official contact number independently, and call back directly to verify.',
          explanation: 'Generative AI can clone a voice print with less than 10 seconds of high-quality sample audio. Direct callback verification using an independently sourced number is the gold standard for authentication.'
        },
        {
          id: 'q2',
          question: 'Which of the following is a key visual or auditory indicator of synthetic media (deepfakes)?',
          choices: [
            'High-definition camera resolutions.',
            'ロボットのような間 (robotic flat pauses), complete lack of inhalation sounds, and audio-level cuts between words.',
            'The presence of background crowd noise.',
            'The speaker using slang or informal phrasing.'
          ],
          correctAnswer: 'ロボットのような間 (robotic flat pauses), complete lack of inhalation sounds, and audio-level cuts between words.',
          explanation: 'AI-generated voices often struggle to accurately synthesize physiological breathing rhythms, natural vocal micro-hesitations, and ambient room noise, leaving flat visual wave-boundaries and perfect robotic silence.'
        }
      ]
    },
    location: {
      name: 'AI Audio Forensics Lab',
      description: 'The school district\'s security laboratory equipped with audio spectrographs and SMS routing analyzers.',
      coordinates: '34.6937° N, 135.5021° E',
      imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800',
      hotspots: [
        { id: 'hs_analyzer', name: 'Audio Spectral Console', x: 50, y: 45, description: 'The audio console where wave metrics and biometric transitions are charted.', revealsEvidenceId: 'ev_voice_log' }
      ]
    }
  },
  {
    id: 'case_profit_propaganda',
    title: 'The Clickbait Cash Machine',
    topic: 'Commercialized Disinformation & Troll Farms',
    difficulty: 'HIGH',
    status: 'NEW',
    tag: 'MEDIA ECONOMICS',
    threatActor: 'Hype Media LLC',
    timeLimit: '48:00 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    introduction: 'A viral news post claiming that a dangerous chemical has contaminated the city\'s public drinking water has triggered an overnight grocery-store rush on bottled water. However, municipal safety labs verify that the city\'s water is completely safe. We must look closely at who is benefiting, trace the domain ownership of the "EcoShield News" site, and uncover the financial incentives driving this public fear.',
    learningObjectives: [
      'Understand the "follow-the-money" principle in analyzing online disinformation campaigns.',
      'Audit website domain ownership records (WHOIS data) and server metadata to uncover hidden affiliations.',
      'Analyze how troll farms and botnets artificially boost clickbait engagement metrics.',
      'Evaluate media sources by looking at commercial conflicts of interest.'
    ],
    warningSigns: [
      'A scientific-sounding news article hosted on an unfamiliar domain lacking editorial credits.',
      'The article citing "anonymous biosafety scientists" rather than linking to peer-reviewed public reports.',
      'Sleek, targeted ads for a commercial water-filtering system popping up alongside the viral article.',
      'A WHOIS lookup revealing the news site was registered anonymously just days before the rumor broke.'
    ],
    manipulationTechniques: [
      'Fear Harvesting (using toxic hazard scares to induce logical shutdown and immediate spending).',
      'Synthetic Amplification (employing bot farms to generate fake retweets, creating a sense of urgency).',
      'Conflict of Interest (owning both the "news" platform that spreads panic and the company selling the "solution").'
    ],
    evidences: [
      {
        id: 'ev_eco_article',
        name: 'Viral_Water_Alert.txt',
        type: 'chat',
        description: 'The sensational headline shared by EcoShield News on social media.',
        content: '[VIRAL SOCIAL SHARING RECORD]\nPublisher: "EcoShield News Network" (@EcoShieldNews_Global)\nHeadline: "⚠️ URGENT WATER CRISIS: Toxic industrial leakage detected in Kyoto reservoirs. City tap water is corrosive to skin and plastic! Clean your local grocery store of bottled water immediately!"\nMetric: 140,000 interactions in 3 hours. 88% of initial sharing profiles were created this month and show automated tweet patterns.',
        isLocked: false
      },
      {
        id: 'ev_whois_record',
        name: 'EcoShield_Domain_Whois.json',
        type: 'document',
        description: 'Official WHOIS domain registration record for the news site.',
        content: '[DOMAIN REGISTER RECORD - ECOSHIELDNEWS.COM]\nCreation Date: July 5th (7 days ago)\nRegistrant Name: WHOIS Privacy Corp (Hidden)\nReal Billing Owner: Eric Vance, VP of Marketing at "AquaGuard Domestic Filters LLC"\nHost IP Address: 198.51.100.89\nKey Lesson: The news site claiming the water is poisoned is owned by a company selling water filters.',
        isLocked: false
      },
      {
        id: 'ev_marketing_ledger',
        name: 'AquaGuard_Campaign_Ledger.csv',
        type: 'document',
        description: 'Internal marketing spreadsheets showing direct payment logs.',
        content: '[CONFIDENTIAL MARKETING LEDGER - PROJECT AQUA-FEAR]\nAd Budget (EcoShield Article): $15,000\nBot Farm Retweet Coordination Cost: $8,500\nExpected filtration unit sales surge: +450%\nActual Filter Revenue (July 12-14): $189,000 (Up from $4,000 daily average)\nKey Lesson: Disinformation is a lucrative business model.',
        isLocked: true,
        unlockCondition: 'interview_witness_renee'
      }
    ],
    witnesses: [
      {
        id: 'wit_renee',
        name: 'Renee Carter',
        role: 'Environmental Reporter',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        description: 'A local reporter who was offered $5,000 to publish a pre-written article about Kyoto water toxicity.',
        promptKnowledge: 'You are Renee Carter, an environmental reporter. You are angry at the corruption of your profession. You say: "A marketing rep from AquaGuard Filters offered me five thousand dollars to copy-paste an anonymous draft stating that municipal water tests found high levels of toxin-X. I refused, but I saw they published it anyway on a brand-new site called EcoShield News. It is complete fiction—our municipal testing lab has live, public-facing testing logs that show the water is 100% clean!"',
        status: 'available'
      },
      {
        id: 'wit_marcus',
        name: 'Marcus Sterling',
        role: 'Marketing Agency CEO',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
        description: 'The marketing agency executive who executed the "Aqua-Fear" campaign for AquaGuard.',
        promptKnowledge: 'You are Marcus Sterling, a smooth, corporate marketing executive. You defend your work as "disruptive emotional marketing". If presented with the WHOIS records or the AquaGuard Campaign Ledger, you will break down and say: "Okay, fine! AquaGuard paid us to drive up demand for their home filtration units. It’s hard to sell a five-hundred-dollar filter if everyone thinks tap water is perfectly safe, right? We built EcoShield News, published the scary draft, and hired a bot farm in Osaka to trend it on Twitter. It’s just... smart business! It’s not illegal to advertise a filter!"',
        status: 'available'
      }
    ],
    timeline: [
      {
        id: 'time_cf1',
        time: 'July 5',
        description: 'AquaGuard Filters plans project "Aqua-Fear", anonymously registering "ecoshieldnews.com" via WHOIS privacy shields.',
        isCorrect: true,
        orderIndex: 0
      },
      {
        id: 'time_cf2',
        time: 'July 11',
        description: 'Marcus Sterling\'s team drafts the terrifying "chemical leak" article, citing anonymous scientists and providing links to purchase AquaGuard filters.',
        isCorrect: true,
        orderIndex: 1
      },
      {
        id: 'time_cf3',
        time: 'July 11, 01:00 PM',
        description: 'A bot farm automatically likes and shares the EcoShield post, triggering recommendation algorithms to trend the story to local families.',
        isCorrect: true,
        orderIndex: 2
      },
      {
        id: 'time_cf4',
        time: 'July 12',
        description: 'Panicked citizens clear stores of bottled water, while AquaGuard sales experience an unprecedented 450% revenue surge.',
        isCorrect: true,
        orderIndex: 3
      }
    ],
    clues: [
      { id: 'cl_whois_conflict', text: 'WHOIS database records link the "crisis news" domain to the marketing VP of a water filter company.', isDiscovered: false, evidenceId: 'ev_whois_record' },
      { id: 'cl_disinfo_roi', text: 'Internal company spreadsheets detail the direct budget spend on troll farms to manufacture the water safety panic.', isDiscovered: false, evidenceId: 'ev_marketing_ledger' }
    ],
    solution: {
      questions: [
        {
          id: 'q1',
          question: 'What is the "follow-the-money" principle in Media and Information Literacy (MIL)?',
          choices: [
            'Analyzing which digital wallets have the fastest transaction speeds.',
            'Evaluating who profits financially or politically from the creation and spread of a rumor.',
            'Supporting viral content creators with crowdfunding.',
            'Buying stock in trending tech companies.'
          ],
          correctAnswer: 'Evaluating who profits financially or politically from the creation and spread of a rumor.',
          explanation: 'Disinformation is rarely created by accident. In many cases, it is a commercialized operation designed to trigger fear or division because those emotional states drive click-through rates, product sales, or political donations.'
        },
        {
          id: 'q2',
          question: 'How can a WHOIS domain lookup assist you as a media literacy investigator?',
          choices: [
            'It tells you the exact price of the domain name.',
            'It allows you to download the entire website structure.',
            'It reveals registration dates and hidden ownership records, helping expose hidden corporate conflicts of interest.',
            'It translates foreign language news websites.'
          ],
          correctAnswer: 'It reveals registration dates and hidden ownership records, helping expose hidden corporate conflicts of interest.',
          explanation: 'A WHOIS lookup exposes when a website was created and who registered it. If a "longstanding independent news site" was registered only three days ago by a commercial competitor\'s marketing director, it reveals a massive conflict of interest.'
        }
      ]
    },
    location: {
      name: 'AquaGuard Marketing Office',
      description: 'The sleek commercial suite where clickbait metrics are engineered.',
      coordinates: '34.6902° N, 135.5021° E',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
      hotspots: [
        { id: 'hs_marketing_desk', name: 'Marcus Sterling\'s Desk', x: 60, y: 70, description: 'Marcus\'s terminal displaying advertising receipts and bot network orders.', revealsEvidenceId: 'ev_marketing_ledger' }
      ]
    }
  }
];
