import { Case } from '../types';

export const HANDCRAFTED_CASES: Case[] = [
  // =========================================================================
  // CASE 1: THE ECHO CHAMBER (Viral Manipulation & Context Splicing)
  // =========================================================================
  {
    id: 'case_echo_chamber',
    title: 'The Echo Chamber: The Fall and Rise of Maya Lin',
    topic: 'Viral Outrage, Context Splicing & Recommender Filter Bubbles',
    difficulty: 'EASY',
    status: 'HIGH PRIORITY',
    tag: 'ALGORITHMIC BIAS',
    threatActor: 'Anonymous Splicer & CliqClok Recommender Engine',
    timeLimit: '12:00 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    introduction: 'Maya Lin, a dedicated 17-year-old student leader and volunteer tutor, has become the target of intense online mobbing after a 10-second video snippet went viral on CliqClok. The video claims she wants to shut down the local Youth Community Center. In reality, Maya was defending the center against budget cuts. Trapped inside algorithmically reinforced filter bubbles, students accepted the edited clip as truth without verification. Your mission is to inspect the unedited forum footage, trace the recommendation metrics, interview key peers, and dismantle the echo chamber.',
    storyIntro: {
      summary: "A 10-second context-spliced video posted on CliqClok ignited a massive wave of hostility against 17-year-old student leader Maya Lin. Within hours, platform algorithms trapped local students in a outrage-driven filter bubble, turning her friends and teachers against her before anyone checked the original speech.",
      victimName: "Maya Lin",
      victimRole: "17-Year-Old High School Student Leader",
      incidentTime: "July 10, 08:30 AM",
      scenes: [
        {
          id: "ec_s1",
          sceneNumber: 1,
          title: "Chapter 1: A Normal Day — The Community Center Proposal",
          locationName: "Kyoto Central High School Assembly Hall",
          mediaType: "dialogue",
          speaker: {
            name: "Maya Lin",
            role: "High School Junior & Youth Volunteer",
            avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
            mood: "confident"
          },
          dialogueText: "Good afternoon everyone! As student council delegate, I'm thrilled to present our plan to double funding for the Youth Community Center's library and computer lab. This space saved my academic career when my family couldn't afford a home laptop, and every student deserves that same shelter.",
          narration: "Maya Lin is a bright, passionate 17-year-old whose dream is to earn a university scholarship in public policy. She spends four evenings a week tutoring younger kids at the community center. Her classmates Clara and Chloe applaud loudly from the front row.",
          keyTakeaway: "Character Background: Maya is deeply committed to expanding the Youth Community Center and rely on it personally.",
          soundEffect: "keyboard"
        },
        {
          id: "ec_s2",
          sceneNumber: 2,
          title: "Chapter 2: The Opportunity — The Student Forum Debate",
          locationName: "Student Association Town Hall",
          mediaType: "dialogue",
          speaker: {
            name: "Chloe Smith",
            role: "Student Council President",
            avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
            mood: "neutral"
          },
          dialogueText: "During the Q&A session, an aggressive online commenter accused Maya of secret corporate ties. Maya stepped up to the microphone and answered firmly: 'A few online trolls falsely claim that I do not care about the community center and we should close it down, but that is completely absurd and untrue!'",
          narration: "The town hall ended with warm applause. Several students recorded the presentation on their phones for local student news channels.",
          keyTakeaway: "Original Context: Maya explicitly quoted an online rumor ('A few online trolls falsely claim that...') before refuting it.",
          soundEffect: "notification"
        },
        {
          id: "ec_s3",
          sceneNumber: 3,
          title: "Chapter 3: Building Trust — The Snipped Clip Emerges",
          locationName: "CliqClok Trending Feed",
          mediaType: "text_chat",
          speaker: {
            name: "Clara Oswald",
            role: "Classmate & Maya's Best Friend",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
            mood: "worried"
          },
          dialogueText: "Maya! Wake up! An account called @KyotoStudentTruth posted an 11-second clip of your speech. It literally shows you saying: 'I do not care about the community center and we should close it down!' They edited out your opening words! People in the main school group chat are going crazy!",
          narration: "An anonymous account uploaded a surgical edit of Maya's speech, cutting her introductory qualifier. With dramatic background music added, the clip looks shockingly authentic.",
          keyTakeaway: "Manipulation Technique: Context Splicing — removing opening/closing words to invert the speaker's true meaning.",
          soundEffect: "notification"
        },
        {
          id: "ec_s4",
          sceneNumber: 4,
          title: "Chapter 4: Warning Signs — Algorithmic Lock-In",
          locationName: "CliqClok Recommender System Engine",
          mediaType: "news_alert",
          mediaContent: {
            header: "TRENDING IN YOUR DISTRICT // 48,000 Views in 90 Minutes",
            body: "'LOCAL STUDENT LEADER BETRAYS COMMUNITY!' — 92% of local high school feeds are receiving this video as their #1 recommended clip."
          },
          dialogueText: "The CliqClok recommendation algorithm detects high comment velocity and outrage-driven watch time. It applies a 4.5x priority weight, trapping local students inside an inescapable outrage loop.",
          narration: "When students open their phones, the algorithm feeds them dozens of reaction videos bashing Maya. Anyone expressing doubt is downvoted and ridiculed. Confirmation bias sets in rapidly.",
          keyTakeaway: "Algorithmic Filter Bubbles: Recommendation engines prioritize conflict and engagement over factual accuracy.",
          soundEffect: "static"
        },
        {
          id: "ec_s5",
          sceneNumber: 5,
          title: "Chapter 5: The Incident — Ostracization & Collapse",
          locationName: "High School Main Hallway",
          mediaType: "phone_call",
          speaker: {
            name: "Chloe Smith",
            role: "Student Council President",
            avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
            mood: "panicked"
          },
          dialogueText: "Maya, I had to kick you out of the student council chat and suspend your university recommendation letter. Look at my feed—twenty different creators shared the same video! The algorithm doesn't lie. Until this blows over, you're off the project.",
          narration: "Maya arrives at school to find her locker vandalized with slurs. Her tutoring shifts are cancelled, and her scholarship nomination is placed on hold. Crying in the counselor's office, she insists she was framed.",
          keyTakeaway: "Human Impact: Social pressure and echo chambers lead to real-world harm before evidence is verified.",
          soundEffect: "phone_ring"
        },
        {
          id: "ec_s6",
          sceneNumber: 6,
          title: "Chapter 6: Investigation Begins — Cyber Forensics Dispatch",
          locationName: "Cyber Detective Academy Dispatch",
          mediaType: "police_dispatch",
          speaker: {
            name: "Chief Investigator Vance",
            role: "Digital Safety Dispatcher",
            mood: "urgent"
          },
          dialogueText: "Investigator, Maya Lin was the victim of a sophisticated context-splicing attack combined with algorithmic amplification! We need you in the CliqClok Analysis Hub now. Inspect the unedited audio waveforms, audit the recommendation weight logs, interview witnesses, and clear Maya's name.",
          narration: "Your official investigation begins. Uncover the truth behind the viral clip and expose how the echo chamber was manufactured.",
          keyTakeaway: "Lateral Reading Protocol: Always locate primary, unedited source media before accepting viral clips.",
          soundEffect: "siren"
        }
      ]
    },
    learningObjectives: [
      'Understand how recommendation algorithms create "filter bubbles" by favoring high-outrage content.',
      'Recognize how confirmation bias makes individuals accept false rumors when reinforced by peer echo chambers.',
      'Identify visual and audio frame cuts that indicate context splicing or deceptive editing.',
      'Master lateral reading techniques to locate unedited primary source materials.'
    ],
    warningSigns: [
      'Short-form viral videos featuring sudden jump cuts right before or after controversial statements.',
      'Social media feeds where 90%+ of suggested content reinforces a single emotional narrative with zero counter-perspectives.',
      'Sudden surges of extreme hostility toward an individual based solely on a snippet under 15 seconds.',
      'Comment sections where users who ask for unedited source footage are silenced or accused of defending a villain.'
    ],
    manipulationTechniques: [
      'Context Splicing (cutting out introductory or concluding phrases to invert the meaning of a speech).',
      'Algorithmic Amplification (recommender loops weighting anger and watch-time retention over truth).',
      'Confirmation Bias & Peer Mobbing (exploiting group dynamics so users follow the crowd without verifying).'
    ],
    evidences: [
      {
        id: 'ev_spliced_video',
        name: 'Unedited Student Forum Audio-Video Log',
        type: 'image',
        description: 'Frame-by-frame forensic analysis comparing the viral 11-second CliqClok clip with the unedited 3-minute raw recording.',
        category: 'Audio/Video Forensics',
        dateCollected: 'July 10, 08:30 AM',
        source: 'Town Hall AV Archives',
        importance: 'Critical',
        content: `[FORENSIC VIDEO TIMELINE COMPARISON]
Unedited Raw Recording (Timestamp 14:22):
"A few online trolls falsely claim that [0:05 FRAME CUT] I do not care about the community center and we should close it down [0:16 FRAME CUT], but that is completely absurd and untrue!"

Viral CliqClok Post (@KyotoStudentTruth):
"I do not care about the community center and we should close it down!"

Audio Waveform Audit:
- Sharp 12dB amplitude drop at timestamp 0:05 indicating a hard splices cut.
- Inaudible room reverb shift at 0:16 confirming missing trailing sentence.
- Conclusion: The statement was deliberately inverted by removing qualifying clauses.`,
        isLocked: false
      },
      {
        id: 'ev_algo_variables',
        name: 'CliqClok Recommender Metrics Log',
        type: 'system_file',
        description: 'Internal platform analytics showing how engagement algorithms generated an isolated filter bubble.',
        category: 'System Performance Logs',
        dateCollected: 'July 10, 09:15 AM',
        source: 'CliqClok Server Analytics',
        importance: 'High',
        content: `[CLIQLOK ALGORITHMIC DISTRIBUTION AUDIT]
Recommender Engine ID: RecLoop_v4.2
Parameters Triggered:
- Outrage/Conflict Sentiment Multiplier: 4.5x (highest weight allocated to angry comment threads)
- User Watch-Time Retention: 94.2%
- Filter Bubble Metric: 92.1% of local high school accounts received ONLY negative reaction videos within 120 minutes.
- Alternative Source Reach: 0.3% (unedited debunk videos suppressed due to lower outrage velocity).

Key Insight: The platform algorithm maximized user screen-time by deliberately starving users of counter-evidence.`,
        isLocked: false
      },
      {
        id: 'ev_chat_reconciliation',
        name: 'Student Council Group Chat Export',
        type: 'chat',
        description: 'Exported chat history showing the rapid spread of peer pressure and confirmation bias among student leaders.',
        category: 'Messaging Logs',
        dateCollected: 'July 10, 10:00 AM',
        source: 'Student Association Messaging App',
        importance: 'Medium',
        content: `[STUDENT ASSOCIATION OFFICIAL CHAT]
July 10, 08:15 AM
Chloe Smith: "Did everyone see that CliqClok video of Maya? She lied to our faces!"
Clara Oswald: "Wait guys, I was standing right next to Maya during the assembly. That clip cuts off mid-sentence! Can we please wait for the full video?"
Chloe Smith: "Clara, my feed has 30 different posts saying she betrayed us. The algorithm doesn't lie! If you keep defending her, you'll be removed from the council too."
Student Member #4: "Yeah Clara, don't stand up for a fake leader."
Chloe Smith: [Maya Lin was removed from Student Association Chat]`,
        isLocked: true,
        unlockCondition: 'interview_witness_clara'
      },
      {
        id: 'ev_school_suspension',
        name: 'Principal\'s Recommendation Hold Notice',
        type: 'document',
        description: 'Official school administration memo showing how the viral outrage impacted Maya\'s university scholarship.',
        category: 'Administrative Document',
        dateCollected: 'July 10, 11:30 AM',
        source: 'High School Principal Office',
        importance: 'High',
        content: `[KYOTO HIGH SCHOOL ADMINISTRATIVE MEMORANDUM]
Date: July 10
Subject: Temporary Suspension of State Scholarship Nomination
Target Student: Maya Lin (Grade 11)

In light of widespread student unrest and viral footage indicating conduct unbecoming of a student representative, Maya Lin's nomination for the Governor's Merit Scholarship is placed on administrative hold pending disciplinary review.

Signed,
Principal Arthur Davis`,
        isLocked: true,
        unlockCondition: 'interview_witness_chloe'
      }
    ],
    witnesses: [
      {
        id: 'wit_clara',
        name: 'Clara Oswald',
        role: 'Classmate & Maya\'s Best Friend',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
        description: 'Maya\'s closest friend who noticed the video jump cut but stayed silent out of fear of social rejection.',
        promptKnowledge: 'You are Clara Oswald, 17. You are wracked with guilt. You say: "I knew Maya was innocent! I was standing three feet away from her at the microphone. But when I tried to say something in the group chat, Chloe threatened to turn everyone against me. My whole CliqClok feed was wall-to-wall hate posts with scary music. It felt like living in an alternate reality where no one cared about what actually happened. I am so relieved you are looking at the original raw town hall recording!"',
        status: 'available'
      },
      {
        id: 'wit_chloe',
        name: 'Chloe Smith',
        role: 'Student Council President',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
        description: 'The student president who banned Maya after being overwhelmed by algorithmically boosted notifications.',
        promptKnowledge: 'You are Chloe Smith, 17. You are defensive, stressed, and beginning to realize you made a terrible mistake. You say: "Look, my phone was literally vibrating nonstop with hundreds of tags and angry messages. CliqClok kept showing me video after video of people saying Maya betrayed us. It was trending #1 in our city! I thought if everyone agreed, it had to be true. I didn\'t know about context splicing or audio cuts... I just wanted to protect our student council from the mob backlash."',
        status: 'available'
      },
      {
        id: 'wit_maya',
        name: 'Maya Lin',
        role: 'Targeted Student Leader',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
        description: 'The victim of the viral campaign, heartbroken that her dedication to the community center was turned against her.',
        promptKnowledge: 'You are Maya Lin, 17. You are tearful but resolute. You say: "I built my whole life around helping at the Youth Community Center. That center gave me a quiet place to study when my family was struggling. When I saw that fake 10-second clip on CliqClok, my stomach dropped. They stripped away my opening words and made me sound like a monster. People I\'ve known for six years refused to even talk to me. Please show everyone the full unedited town hall tape."',
        status: 'available'
      }
    ],
    timeline: [
      {
        id: 'time_ec1',
        time: 'TIMESTAMP: UNVERIFIED',
        description: 'Maya Lin delivers her proposal at the Student Town Hall, quoting and refuting an online rumor about closing the community center.',
        isCorrect: true,
        orderIndex: 0
      },
      {
        id: 'time_ec2',
        time: 'TIMESTAMP: UNVERIFIED',
        description: 'An anonymous account (@KyotoStudentTruth) surgical cuts an 11-second video snippet, removing Maya\'s introductory and concluding qualifiers.',
        isCorrect: true,
        orderIndex: 1
      },
      {
        id: 'time_ec3',
        time: 'TIMESTAMP: UNVERIFIED',
        description: 'CliqClok\'s algorithm applies a 4.5x outrage weight to the spliced clip, flooding 92% of local student feeds.',
        isCorrect: true,
        orderIndex: 2
      },
      {
        id: 'time_ec4',
        time: 'TIMESTAMP: UNVERIFIED',
        description: 'Students trapped inside the outrage filter bubble ban Maya from council chats and suspend her scholarship recommendation.',
        isCorrect: true,
        orderIndex: 3
      }
    ],
    clues: [
      { id: 'cl_context_splice', text: 'Audio waveform analysis proves the viral clip omitted Maya\'s opening phrase ("A few trolls falsely claim that...").', isDiscovered: false, evidenceId: 'ev_spliced_video' },
      { id: 'cl_algorithm_echo', text: 'CliqClok\'s recommender engine assigned a 4.5x outrage multiplier that locked local users in a filter bubble.', isDiscovered: false, evidenceId: 'ev_algo_variables' },
      { id: 'cl_red_herring_editor', text: 'Red Herring: A classmate\'s video editing assignment was flagged as suspicious but turned out to be an innocent media class project.', isDiscovered: false }
    ],
    solution: {
      questions: [
        {
          id: 'q1',
          question: 'What is a "filter bubble" created by social media recommendation algorithms?',
          choices: [
            'A network security tool that filters out computer viruses.',
            'An algorithmically enforced state where users are repeatedly served content matching their outrage history, isolating them from counter-evidence.',
            'A private group chat created for high school study teams.',
            'An encrypted messaging protocol used by student councils.'
          ],
          correctAnswer: 'An algorithmically enforced state where users are repeatedly served content matching their outrage history, isolating them from counter-evidence.',
          explanation: 'Filter bubbles occur when recommendation algorithms prioritize outrage and engagement over factual accuracy. Users are fed identical emotional clips, giving the false illusion that "everyone agrees" and suppressing critical thinking.'
        },
        {
          id: 'q2',
          question: 'What is "lateral reading" and why is it essential when encountering viral outrage media?',
          choices: [
            'Reading a news article repeatedly from top to bottom to check for spelling errors.',
            'Leaving the emotional social media post to independently search for unedited primary sources, verification logs, and neutral reporting.',
            'Asking friends in your group chat if they believe the video is real.',
            'Checking how many likes and shares the viral video has received.'
          ],
          correctAnswer: 'Leaving the emotional social media post to independently search for unedited primary sources, verification logs, and neutral reporting.',
          explanation: 'Lateral reading is the core digital literacy practice of opening new browser tabs to check the credibility of a claim using primary sources, rather than relying on the comments or aesthetics of the viral post itself.'
        }
      ]
    },
    location: {
      name: 'CliqClok Analysis Hub',
      description: 'The digital media analytics lab where investigators examine audio spectrographs and recommender algorithm parameters.',
      coordinates: '35.6762° N, 139.6503° E',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      hotspots: [
        { id: 'hs_server', name: 'Algorithm Database Node', x: 45, y: 35, description: 'The CliqClok server node displaying watch-time multipliers and echo chamber metrics.', revealsEvidenceId: 'ev_algo_variables' }
      ]
    }
  },

  // =========================================================================
  // CASE 2: THE PHANTOM VOICE (AI Voice Cloning & Deepfake Impersonation)
  // =========================================================================
  {
    id: 'case_synthetic_impostor',
    title: 'The Phantom Voice: The Midnight Impostor',
    topic: 'AI Voice Cloning, Deepfakes & Scraped Audio Harvesting',
    difficulty: 'MED',
    status: 'URGENT',
    tag: 'AI FORENSICS',
    threatActor: 'VoiceSyndicate Cyber Group',
    timeLimit: '24:00 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800',
    introduction: 'At 11:42 PM, Devon Miller—head of the Parent Association—received a frantic telephone call from High School Principal Arthur Davis\'s official office line. The trembling voice claimed Davis was detained at police headquarters due to a district audit error and needed an emergency $12,000 wire transfer to avoid an immediate school shutdown. Panicked, Devon transferred the funds and forwarded an urgent audio alert to 850 parents. But the real Principal Davis was asleep at home. Attackers harvested 22 hours of public school podcast audio to train a neural voice clone. Uncover the spectrographic evidence, trace the spoofed telecommunications gateway, and solve the mystery.',
    storyIntro: {
      summary: "A neural AI voice clone of Principal Arthur Davis was used in a late-night telephone extortion scheme. Devon Miller was duped into wiring $12,000 from the parent emergency fund and broadcasting a emergency panic alert before realizing the principal's voice had been artificially harvested from public podcasts.",
      victimName: "Arthur Davis & Devon Miller",
      victimRole: "School Principal & Parent Association Lead",
      incidentTime: "July 15, 11:42 PM",
      scenes: [
        {
          id: "si_s1",
          sceneNumber: 1,
          title: "Chapter 1: A Normal Day — The Principal's Weekly Address",
          locationName: "Kyoto Central High School Studio",
          mediaType: "dialogue",
          speaker: {
            name: "Arthur Davis",
            role: "High School Principal (54 y/o)",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
            mood: "confident"
          },
          dialogueText: "Welcome to Episode 50 of the Principal's Weekly Address! I want to personally congratulate our science bowl team and remind all parents about our upcoming annual summer excursion. Thank you for your continued trust in our school community.",
          narration: "Principal Arthur Davis is a warm, dedicated educator who has served the school for 20 years. To maintain transparency with families, he records a weekly 30-minute podcast hosted publicly on the school's website.",
          keyTakeaway: "Audio Source: Principal Davis has published 50+ hours of clean, high-quality speech publicly on the internet.",
          soundEffect: "keyboard"
        },
        {
          id: "si_s2",
          sceneNumber: 2,
          title: "Chapter 2: The Opportunity — The Midnight Call",
          locationName: "Devon Miller's Residence",
          mediaType: "phone_call",
          speaker: {
            name: "Devon Miller",
            role: "Parent Association Lead (42 y/o)",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
            mood: "panicked"
          },
          dialogueText: "My phone rang at 11:42 PM. The caller ID clearly displayed '+1 (555) 0192' — Principal Davis's official office desk number. When I answered, I heard Mr. Davis's exact voice, breathless and sobbing!",
          narration: "Devon Miller was asleep when his phone buzzed. Seeing the principal's official office number on the caller ID instantly bypassed his suspicion.",
          keyTakeaway: "Authority Spoofing: Attackers falsified the caller ID to match the principal's official school telephone number.",
          soundEffect: "phone_ring"
        },
        {
          id: "si_s3",
          sceneNumber: 3,
          title: "Chapter 3: Building Trust — The High-Stakes Emergency",
          locationName: "Intercepted Telephone Audio Stream",
          mediaType: "phone_call",
          speaker: {
            name: "Synthetic Voice (Arthur Davis Clone)",
            role: "AI Impostor",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
            mood: "panicked"
          },
          dialogueText: "Devon! Please, listen to me! I'm at the central precinct. There was a catastrophic accounting error with the summer trip bond! If we don't post a $12,000 cash guarantee by midnight, the district will seize our accounts and cancel all classes tomorrow! You must wire the money from the parent emergency fund right now!",
          narration: "The caller's voice sounds identical to Arthur Davis—including his distinct cadence and polite tone. The sense of catastrophic urgency overrides rational hesitation.",
          keyTakeaway: "Manipulation Technique: Fear & Extreme Urgency — forcing immediate decision-making before facts can be checked.",
          soundEffect: "phone_ring"
        },
        {
          id: "si_s4",
          sceneNumber: 4,
          title: "Chapter 4: Warning Signs — Unnatural Hesitations",
          locationName: "Parent Fund Management Console",
          mediaType: "dialogue",
          speaker: {
            name: "Devon Miller",
            role: "Parent Association Lead",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
            mood: "worried"
          },
          dialogueText: "I asked him: 'Arthur, shouldn't we call Vice Principal Sato first?' But the voice paused strangely for two seconds with zero background breathing, then repeated in the same rigid tone: 'No time! Wire the funds to this emergency clearing account immediately!' There was a subtle metallic tone in his voice, but I was too panicked to question it.",
          narration: "Devon noticed two subtle red flags: the caller ignored a specific question about staff members and had unnatural silent gaps without natural breathing sounds.",
          keyTakeaway: "AI Voice Anomaly: Synthetic TTS generators struggle with interactive conversation context and natural inhalation pauses.",
          soundEffect: "static"
        },
        {
          id: "si_s5",
          sceneNumber: 5,
          title: "Chapter 5: The Incident — Fund Wire & Morning Chaos",
          locationName: "High School Courtyard",
          mediaType: "news_alert",
          mediaContent: {
            header: "ALERT // $12,000 EXPORTED & 850 PARENTS PANICKED",
            body: "Devon wired $12,000 from the parent fund and sent a panic voicemail to all parent chat groups. At 07:30 AM, Principal Davis arrived at school completely unaware of any emergency."
          },
          dialogueText: "Principal Davis stepped out of his car to find 100 distressed parents crying in the courtyard. When Devon showed him the voicemail, Davis stood frozen in shock: 'This is my voice... but I was in bed asleep with my wife all night!'",
          narration: "The $12,000 parent emergency fund was drained into an unrecoverable cryptocurrency mixer, and the school was thrown into turmoil.",
          keyTakeaway: "Devastating Outcome: Financial theft and public panic achieved through synthetic voice cloning and spoofed communications.",
          soundEffect: "notification"
        },
        {
          id: "si_s6",
          sceneNumber: 6,
          title: "Chapter 6: Investigation Begins — AI Forensics Dispatch",
          locationName: "AI Audio Forensics Laboratory",
          mediaType: "police_dispatch",
          speaker: {
            name: "Lead Forensics Specialist",
            role: "Cyber Biometrics Unit",
            mood: "urgent"
          },
          dialogueText: "Investigator, you are needed on scene! We are analyzing a high-fidelity synthetic voice attack. Step into the AI Forensics Lab, inspect the spectrographic wave boundaries, trace the scraper bot that harvested Davis's podcasts, and track the caller ID spoofing gateway.",
          narration: "Equip your audio spectrograph and uncover the neural signature behind the synthetic phone call.",
          keyTakeaway: "Verification Protocol: Establish family/organization safety code words and always hang up to call back directly on known numbers.",
          soundEffect: "siren"
        }
      ]
    },
    learningObjectives: [
      'Identify spectrographic and auditory anomalies (flat silence, missing breath cycles, metallic boundary cuts) of AI voice clones.',
      'Understand how cybercriminals harvest public audio/video recordings to build custom neural speech models.',
      'Implement fail-safe verification protocols (direct callback verification, pre-shared family passphrases).',
      'Recognize telephone caller-ID spoofing techniques and how to bypass them.'
    ],
    warningSigns: [
      'An emergency call claiming a loved one or authority figure is in distress and demanding immediate money transfer.',
      'A familiar voice that pauses awkwardly during custom questions or displays zero background breathing/room noise.',
      'Insistence on absolute secrecy and refusal to allow you to call other family members or colleagues.',
      'Requests for payment via non-standard wire transfers, gift cards, or cryptocurrency addresses.'
    ],
    manipulationTechniques: [
      'Panic & Extreme Urgency (setting artificial time constraints to prevent verification).',
      'Neural Voice Cloning (harvesting open-source podcasts to train neural text-to-speech models).',
      'Caller-ID Spoofing (falsifying telecommunication headers to display trusted numbers).'
    ],
    evidences: [
      {
        id: 'ev_voice_log',
        name: 'Emergency Voicemail Spectrographic Analysis',
        type: 'image',
        description: 'Audio spectrograph report analyzing the 0.04-second neural wave chunks of the voicemail sent to Devon Miller.',
        category: 'Audio Forensic Report',
        dateCollected: 'July 15, 11:45 PM',
        source: 'Parent Phone Network Intercept',
        importance: 'Critical',
        content: `[AUDIO FORENSICS SPECTRAL ANALYSIS REPORT]
Source Sample: "Davis_Emergency_Call.wav" (Length: 42 seconds)
Biometric Frequency Match: 98.4% match with Arthur Davis's vocal timbre.

SPECTRAL ANOMALIES DISCOVERED:
1. Physiological Inhalation Deficit: 0.00% natural breath sounds detected between clauses (human speech displays 4-8 breaths per minute).
2. Spectral Silence Floor: Noise floor drops to absolute digital zero (-inf dB) during pauses, indicating synthetic text-to-speech rendering blocks.
3. Plosive Boundary Artifacts: Hard consonant transitions (p, t, k) show synthetic phase alignments characteristic of neural vocoder patch outputs.`,
        isLocked: false
      },
      {
        id: 'ev_harvest_source',
        name: 'Podcast Harvester Server Logs',
        type: 'document',
        description: 'Web server logs exposing the automated scraping bot that downloaded 22 hours of Principal Davis\'s weekly podcast episodes.',
        category: 'Server Traffic Logs',
        dateCollected: 'July 14, 11:30 PM',
        source: 'School Web Server Repository',
        importance: 'High',
        content: `[WEB SERVER HARVESTING INCIDENT LOG]
Target URL: https://kyotohigh.edu/media/podcasts/Davis_Weekly/
Date: July 14, 02:15 AM
User-Agent: "Python-urllib/3.10 (AudioScraperBot)"
Downloaded Assets: 50 MP3 files (Total length: 22 hours, 14 minutes)
Destination IP: 198.51.100.42 (Anonymous VPN Node)
Compilation Tool Artifact: Meta-header "ElevenLabs_NeuralStudio_v2.1"
Voice Model ID: "Model_Davis_v3" created July 14th at 04:30 AM.`,
        isLocked: false
      },
      {
        id: 'ev_spoofed_sms',
        name: 'Telecommunications Spoofing Packet Dump',
        type: 'system_file',
        description: 'SIP header packet trace exposing the anonymous VoIP gateway used to falsify Principal Davis\'s desk phone number.',
        category: 'Network Packet Logs',
        dateCollected: 'July 15, 11:42 PM',
        source: 'District Telecom Exchange',
        importance: 'Critical',
        content: `[SIP TELECOM HEADER PACKET TRACE]
Call ID: SIP-40912-US
Header Display Name: "Principal Davis Office"
Header Display Number: +1 (555) 0192 (Official School Desk)

REAL ORIGINATING NODE:
Originating IP: 198.51.100.88 (Osaka Telecom Proxy Gateway)
Routing Protocol: Simplex-VoIP-Bulk-Relay
Authentication Status: UNVERIFIED (STIR/SHAKEN Protocol Failed - Invalid Certificate)
Conclusion: Caller ID header was injected via an unauthenticated VoIP gateway.`,
        isLocked: true,
        unlockCondition: 'interview_witness_arthur'
      },
      {
        id: 'ev_crypto_invoice',
        name: 'Emergency Fund Wire & Crypto Transfer Receipt',
        type: 'crypto_fragment',
        description: 'Financial ledger showing the $12,000 wire transfer from the Parent Fund to a synthetic laundering wallet.',
        category: 'Financial Forensics',
        dateCollected: 'July 16, 01:00 AM',
        source: 'Parent Association Bank Account',
        importance: 'High',
        content: `[WIRE TRANSFER CONFIRMATION]
Sender: Kyoto Parent Association Emergency Fund
Amount: $12,000.00 USD
Beneficiary Account: "Global Clearing Service LLC"
Recipient Wallet: 0x71C...9B42 (Automated Mixer Pool)
Status: Completed (Non-reversible wire transfer)
Note: Triggered by urgent phone request at 11:55 PM.`,
        isLocked: true,
        unlockCondition: 'interview_witness_devon'
      }
    ],
    witnesses: [
      {
        id: 'wit_arthur',
        name: 'Arthur Davis',
        role: 'High School Principal',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
        description: 'The school principal whose voice was harvested from weekly podcasts to train a neural clone.',
        promptKnowledge: 'You are Arthur Davis, 54. You are shocked and deeply concerned. You say: "I host a weekly podcast to keep parents connected to our school. I never imagined someone would harvest my voice to steal from our parents! When I arrived at school this morning and saw crying parents in the courtyard, I thought there was a real disaster. Hearing my own voice demanding money in a voicemail was horrifying. How can we trust audio anymore if AI can replicate us so seamlessly?"',
        status: 'available'
      },
      {
        id: 'wit_devon',
        name: 'Devon Miller',
        role: 'Parent Association Lead',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        description: 'The parent leader who wired $12,000 after being deceived by caller ID spoofing and synthetic voice audio.',
        promptKnowledge: 'You are Devon Miller, 42. You are wracked with guilt and shame. You say: "The caller ID literally said Principal Davis\'s office! And the voice sounded exactly like him—panicked, breathless, crying. He said the school was going to be locked down in 20 minutes if I didn\'t wire the money. I panicked because I wanted to save the school trip. Looking back, I should have hung up and called his personal mobile phone directly. I feel terrible for losing $12,000 of parent funds."',
        status: 'available'
      },
      {
        id: 'wit_tech_janitor',
        name: 'Kenji Sato',
        role: 'School IT Technician',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        description: 'The IT technician who noticed high night-time server bandwidth downloading the podcast archive.',
        promptKnowledge: 'You are Kenji Sato, 29. You are observant and eager to help. You say: "On July 14 at 2:00 AM, our firewall alerted me to a single IP address downloading all 50 MP3 episodes of Principal Davis\'s podcast in under three minutes. I thought it was an enthusiastic student catching up, but when I looked closer at the headers, the user agent belonged to an automated scraping bot. That scraped audio was definitely used to train their AI speech generator!"',
        status: 'available'
      }
    ],
    timeline: [
      {
        id: 'time_si1',
        time: 'TIMESTAMP: UNVERIFIED',
        description: 'An automated scraping bot downloads 22 hours of Principal Davis\'s public podcasts from the school server.',
        isCorrect: true,
        orderIndex: 0
      },
      {
        id: 'time_si2',
        time: 'TIMESTAMP: UNVERIFIED',
        description: 'Attackers compile neural voice model "Model_Davis_v3" using an AI text-to-speech voice studio.',
        isCorrect: true,
        orderIndex: 1
      },
      {
        id: 'time_si3',
        time: 'TIMESTAMP: UNVERIFIED',
        description: 'Attackers use a spoofed VoIP gateway to call Devon Miller, displaying Davis\'s office desk number on the caller ID.',
        isCorrect: true,
        orderIndex: 2
      },
      {
        id: 'time_si4',
        time: 'TIMESTAMP: UNVERIFIED',
        description: 'Devon wires $12,000 from the parent fund and broadcasts an emergency alert to 850 parent chat groups.',
        isCorrect: true,
        orderIndex: 3
      }
    ],
    clues: [
      { id: 'cl_voice_synth_markers', text: 'Audio spectrograph reveals 0.00% natural breathing cycles and digital zero noise floors characteristic of AI voice cloning.', isDiscovered: false, evidenceId: 'ev_voice_log' },
      { id: 'cl_podcasts_harvest', text: 'Server traffic logs prove 22 hours of podcast audio were scraped to build the neural voice model.', isDiscovered: false, evidenceId: 'ev_harvest_source' },
      { id: 'cl_red_herring_mic', text: 'Red Herring: Old microphone static in Episode 12 was suspected to be an insertion key but proved to be hardware noise.', isDiscovered: false }
    ],
    solution: {
      questions: [
        {
          id: 'q1',
          question: 'What is the most secure protocol when receiving an unexpected emergency phone call from a family member or authority figure demanding immediate funds?',
          choices: [
            'Wire the funds right away to prevent any potential harm.',
            'Hang up, independently locate the official phone number from a trusted directory, and call back directly to verify.',
            'Ask the caller to send a text message with their bank details.',
            'Trust the call if the caller ID matches a saved phone number.'
          ],
          correctAnswer: 'Hang up, independently locate the official phone number from a trusted directory, and call back directly to verify.',
          explanation: 'Generative AI can clone a human voice print with less than 10 seconds of clear sample audio, and VoIP caller ID headers can be easily spoofed. Independent direct callbacks are mandatory for emergency verification.'
        },
        {
          id: 'q2',
          question: 'Which of the following spectrographic features strongly indicates an AI-generated voice recording?',
          choices: [
            'High audio fidelity and clear pronunciation.',
            'Complete absence of natural human breathing sounds between phrases and absolute digital zero silence during pauses.',
            'The presence of background traffic noise.',
            'The speaker using regional dialect words.'
          ],
          correctAnswer: 'Complete absence of natural human breathing sounds between phrases and absolute digital zero silence during pauses.',
          explanation: 'Neural text-to-speech models struggle to synthesize subtle human physiological cues such as micro-inhalations, lip smacks, and ambient room noise floors, leaving unnatural digital silences.'
        }
      ]
    },
    location: {
      name: 'AI Audio Forensics Lab',
      description: 'The police department\'s biometric security lab equipped with audio spectrographs and SIP telecom packet analyzers.',
      coordinates: '34.6937° N, 135.5021° E',
      imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800',
      hotspots: [
        { id: 'hs_analyzer', name: 'Audio Spectral Console', x: 50, y: 45, description: 'The audio console where voice wave metrics and biometric boundary cuts are analyzed.', revealsEvidenceId: 'ev_voice_log' }
      ]
    }
  },

  // =========================================================================
  // CASE 3: THE POISONED WELL (Commercial Disinformation & WHOIS Audits)
  // =========================================================================
  {
    id: 'case_profit_propaganda',
    title: 'The Poisoned Well: The AquaShield Conspiracy',
    topic: 'Commercial Disinformation, WHOIS Audits & Bot Networks',
    difficulty: 'HIGH',
    status: 'NEW',
    tag: 'MEDIA ECONOMICS',
    threatActor: 'HypeMedia LLC & AquaGuard Domestic Filters',
    timeLimit: '48:00 Hours',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    introduction: 'A viral news report published on "EcoShield News" claimed that Kyoto\'s municipal drinking water was contaminated with a dangerous chemical compound called "Toxin-X". The article triggered citywide panic buying, clearing supermarket shelves of bottled water within two hours. However, municipal safety labs confirmed tap water is 100% clean. Investigative journalist Renee Carter revealed she was offered $5,000 to publish a fake contamination story. Who created EcoShield News? Who is profiting from public terror? Audit domain ownership records, inspect campaign ledgers, and dismantle the profit-driven panic machine.',
    storyIntro: {
      summary: "A fabricated news article claiming tap water was contaminated with industrial toxins triggered mass panic buying across Kyoto. Investigations revealed 'EcoShield News' was secretly registered by the vice president of a home water filtration manufacturer to boost $500 filter sales.",
      victimName: "Municipal Water Board & Citizens of Kyoto",
      victimRole: "Public Infrastructure & Consumers",
      incidentTime: "July 12, 10:00 AM",
      scenes: [
        {
          id: "pp_s1",
          sceneNumber: 1,
          title: "Chapter 1: A Normal Day — Clean Municipal Water Testing",
          locationName: "Kyoto Water Testing Facility",
          mediaType: "dialogue",
          speaker: {
            name: "Renee Carter",
            role: "Environmental Reporter (32 y/o)",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
            mood: "confident"
          },
          dialogueText: "I was covering a routine story on Kyoto's water infrastructure. Dr. Kenzo showed me the automated sensors that test tap water every 15 seconds. Kyoto has some of the cleanest municipal water in the world, certified by global health boards.",
          narration: "Renee Carter is an award-winning investigative journalist who takes pride in factual environmental reporting. Public municipal water tests were completely green.",
          keyTakeaway: "Verified Fact: Municipal water testing facilities maintain automated 24/7 public safety logs showing zero contamination.",
          soundEffect: "keyboard"
        },
        {
          id: "pp_s2",
          sceneNumber: 2,
          title: "Chapter 2: The Opportunity — The $5,000 Bribe",
          locationName: "Downtown Coffee House",
          mediaType: "dialogue",
          speaker: {
            name: "Renee Carter",
            role: "Environmental Reporter",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
            mood: "suspicious"
          },
          dialogueText: "On July 8th, Marcus Sterling—CEO of HypeMedia PR—asked to meet. He offered me $5,000 in cash if I would copy-paste a pre-written draft stating that 'secret lab tests detected Toxin-X in tap water'. I angrily refused and threatened to report him!",
          narration: "Commercial disinformers often attempt to bribe real journalists first to lend credibility to their fabrications.",
          keyTakeaway: "Commercial Bribe Attempt: PR agencies attempt to hire credentialed reporters to launch manufactured scares.",
          soundEffect: "notification"
        },
        {
          id: "pp_s3",
          sceneNumber: 3,
          title: "Chapter 3: Building Trust — EcoShield News Appears",
          locationName: "EcoShieldNews.com Portal",
          mediaType: "news_alert",
          mediaContent: {
            header: "ECOSHIELD NEWS SPECIAL REPORT // 140,000 SHARES",
            body: "⚠️ TOXIC TAP WATER HAZARD: Industrial compound Toxin-X detected in Kyoto reservoirs! Tap water is corrosive to skin. Protect your family with certified home filters!"
          },
          dialogueText: "Four days after Renee rejected the bribe, a sleek new website named 'EcoShield News' appeared online, carrying the exact same fake article! It cited 'anonymous biosafety experts' and featured sleek scientific diagrams.",
          narration: "The website looked highly professional, complete with fake editorial badges and green environmental branding designed to instill total trust.",
          keyTakeaway: "Manufactured Media: Creating fake news outlets that masquerade as trusted environmental organizations.",
          soundEffect: "notification"
        },
        {
          id: "pp_s4",
          sceneNumber: 4,
          title: "Chapter 4: Warning Signs — Bot Farm & Discount Codes",
          locationName: "Osaka Bot Farm Operations",
          mediaType: "email_preview",
          mediaContent: {
            header: "CONFIDENTIAL // CAMPAIGN AQUA-FEAR",
            sender: "marcus@hypemedia-pr.jp",
            recipient: "botnet-dispatch@osaka-nodes.com",
            body: "Execute 10,000 retweets targeting Kyoto parent demographics. Embed promo code 'AQUASAFE' for $500 AquaGuard filters alongside the crisis article."
          },
          dialogueText: "An automated bot farm flooded local social networks with the EcoShield link. Conveniently, sponsored ads for 'AquaGuard $500 Home Filters' with discount code 'AQUASAFE' popped up right beside every article share!",
          narration: "The article generated immediate panic while seamlessly offering a $500 commercial solution to the manufactured problem.",
          keyTakeaway: "Follow the Money: Panic campaigns are designed to sell expensive commercial solutions to manufactured problems.",
          soundEffect: "keyboard"
        },
        {
          id: "pp_s5",
          sceneNumber: 5,
          title: "Chapter 5: The Incident — Panic Buying & Revenue Spike",
          locationName: "Kyoto Supermarkets & Stores",
          mediaType: "news_alert",
          mediaContent: {
            header: "PANIC BUYING SPREADS // $189,000 IN FILTER SALES",
            body: "Supermarket shelves were stripped of bottled water within two hours. AquaGuard's home filter sales exploded by +450%, generating $189,000 in 24 hours."
          },
          dialogueText: "Elderly citizens queued for hours in summer heat for bottled water. Meanwhile, AquaGuard Domestic Filters experienced its highest sales day in company history, collecting $189,000 in profits.",
          narration: "Panic buying caused genuine hardship for vulnerable residents while the corporate instigators celebrated record profits.",
          keyTakeaway: "Disinformation Monetization: Commercial panic campaigns convert public fear into corporate revenue.",
          soundEffect: "notification"
        },
        {
          id: "pp_s6",
          sceneNumber: 6,
          title: "Chapter 6: Investigation Begins — Media Economics Dispatch",
          locationName: "AquaGuard Investigation Bureau",
          mediaType: "police_dispatch",
          speaker: {
            name: "Chief Investigator Vance",
            role: "Media Economics Unit",
            mood: "urgent"
          },
          dialogueText: "Investigator, we need you to follow the money! 'EcoShield News' was registered anonymously behind WHOIS privacy shields. Step into the Media Economics Lab, audit the domain domain registry, inspect the corporate marketing ledgers, and expose the conspirators.",
          narration: "Your investigation begins. Perform WHOIS domain lookups and follow the financial trail to expose the commercial disinformers.",
          keyTakeaway: "WHOIS Domain Audits: Uncover domain creation dates and secret corporate registrants behind fake news portals.",
          soundEffect: "siren"
        }
      ]
    },
    learningObjectives: [
      'Apply the "Follow-the-Money" principle to uncover commercial motivations behind online panic campaigns.',
      'Audit domain registration records (WHOIS lookups) to uncover secret corporate ownership and domain age.',
      'Recognize how bot farms artificially boost clickbait engagement to force algorithms to trend stories.',
      'Identify conflicts of interest when a news publisher directly profits from selling a solution to the crisis it reports.'
    ],
    warningSigns: [
      'A scientific crisis article published on a domain registered only a few days prior.',
      'An article citing "anonymous scientists" without linking to official government or university laboratory test reports.',
      'Sleek commercial advertisements for filters, supplements, or security items embedded directly inside the "breaking crisis" story.',
      'Social media accounts sharing the story that were created recently and exhibit automated bot posting behavior.'
    ],
    manipulationTechniques: [
      'Fear Harvesting (using health hazard scares to trigger immediate panic buying).',
      'Synthetic Amplification (hiring bot networks to artificially boost share counts).',
      'Conflict of Interest (owning both the "news" portal spreading panic and the company selling the solution).'
    ],
    evidences: [
      {
        id: 'ev_eco_article',
        name: 'Viral EcoShield News Article & Post Log',
        type: 'chat',
        description: 'Sensational news post claiming tap water was poisoned with Toxin-X, driving supermarket panic buying.',
        category: 'Social Media Capture',
        dateCollected: 'July 12, 10:00 AM',
        source: 'EcoShield News Portal',
        importance: 'High',
        content: `[VIRAL NEWS ARTICLE CAPTURE]
Publisher: "EcoShield News Network" (@EcoShieldNews_Global)
Headline: "⚠️ URGENT WATER CRISIS: Industrial Toxin-X detected in Kyoto municipal reservoirs! Tap water is corrosive to skin!"
Embedded Promo: "Protect your family with AquaGuard Home Filtration Units! Use promo code 'AQUASAFE' for 20% off today!"

Social Velocity: 140,000 shares in 3 hours.
Account Audit: 88.4% of initial retweets originated from newly created automated bot profiles in Osaka.`,
        isLocked: false
      },
      {
        id: 'ev_whois_record',
        name: 'WHOIS Domain Registration Audit Record',
        type: 'document',
        description: 'Public domain registry lookup revealing that EcoShield News was secretly created by the VP of Marketing at AquaGuard.',
        category: 'Public Registry Audit',
        dateCollected: 'July 12, 11:15 AM',
        source: 'Global Domain Name Registry',
        importance: 'Critical',
        content: `[WHOIS PUBLIC DOMAIN AUDIT - ECOSHIELDNEWS.COM]
Domain Creation Date: July 5th (7 days before rumor outbreak)
Registrant Name: WHOIS Privacy Protection Corp (Shielded)
Real Billing Owner Identified: Eric Vance
Billing Address: AquaGuard Domestic Filters LLC, Suite 400, Kyoto Industrial Park
IP Host: 198.51.100.89

CRITICAL FINDING: The "independent environmental news site" reporting tap water contamination is owned directly by the marketing VP of a water filter manufacturer!`,
        isLocked: false
      },
      {
        id: 'ev_marketing_ledger',
        name: 'Confidential Marketing Budget Spreadsheet',
        type: 'document',
        description: 'Internal corporate accounting spreadsheet detailing the financial budget spent to manufacture the water safety panic.',
        category: 'Financial Accounting',
        dateCollected: 'July 12, 02:00 PM',
        source: 'AquaGuard Corporate Server',
        importance: 'Critical',
        content: `[CONFIDENTIAL MARKETING BUDGET - PROJECT "AQUA-FEAR"]
Budget Itemization:
1. EcoShield News Portal Domain & Design: $4,500
2. Osaka Bot Farm Retweet Campaign (10,000 retweets): $8,500
3. Sponsored Search Ads ("Toxin-X Water"): $15,000

REVENUE RETURN ON INVESTMENT:
Filter Sales (July 12-13): $189,000.00 (Surge of +450% over baseline average)
Projected Net Profit: $161,000.00

Conclusion: Manufactured panic campaign generated $161k net profit in 48 hours.`,
        isLocked: true,
        unlockCondition: 'interview_witness_renee'
      },
      {
        id: 'ev_water_lab_cert',
        name: 'Municipal Water Safety Certification',
        type: 'document',
        description: 'Official Kyoto Water Authority laboratory test certificate proving 100% clean drinking water.',
        category: 'Public Health Certificate',
        dateCollected: 'July 12, 09:00 AM',
        source: 'Kyoto Municipal Testing Lab',
        importance: 'High',
        content: `[KYOTO MUNICIPAL WATER QUALITY CERTIFICATE]
Date: July 12
Testing Node: Reservoirs #1 through #6
Chemical Analysis:
- Toxin-X / Industrial Contaminants: 0.000 ppm (UNDETECTED)
- Heavy Metals / Microplastics: Pass (Well within WHO Safety Standards)
- Microbiological Safety: 100% Pure

Certified By: Dr. Kenzo Takahashi, Chief Water Biologist`,
        isLocked: true,
        unlockCondition: 'interview_witness_marcus'
      }
    ],
    witnesses: [
      {
        id: 'wit_renee',
        name: 'Renee Carter',
        role: 'Environmental Reporter',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        description: 'The investigative journalist who refused a $5,000 bribe to publish the fake water contamination story.',
        promptKnowledge: 'You are Renee Carter, 32. You are furious at the corporate corruption of journalism. You say: "Marcus Sterling from HypeMedia offered me five thousand dollars to copy-paste a fake story about Toxin-X in tap water. I refused! But four days later, I saw the exact same draft published on EcoShieldNews.com. It is 100% fake news created to scare people into buying five-hundred-dollar water filters. Dr. Kenzo\'s municipal lab tests show our tap water is completely safe!"',
        status: 'available'
      },
      {
        id: 'wit_marcus',
        name: 'Marcus Sterling',
        role: 'HypeMedia PR CEO',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
        description: 'The marketing executive who planned and executed the "Aqua-Fear" disinfo campaign.',
        promptKnowledge: 'You are Marcus Sterling, 41, a slick, defensive corporate marketer. If confronted with the WHOIS records or Marketing Ledger, you break down and say: "Alright, look! AquaGuard paid us to create demand for their filters. Nobody buys a $500 filter if they think tap water is safe, right? We created EcoShield News, hired the bot farm in Osaka to trend it, and ran the campaign. It’s just aggressive marketing! People got clean water filters anyway, so who really got hurt?"',
        status: 'available'
      },
      {
        id: 'wit_dr_kenzo',
        name: 'Dr. Kenzo Takahashi',
        role: 'Chief Water Biologist',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        description: 'The chief scientist at the Kyoto Municipal Water Testing Facility whose lab reports were smeared.',
        promptKnowledge: 'You are Dr. Kenzo Takahashi, 58. You are distressed and indignant. You say: "Our testing facility runs automated spectrographic analysis every 15 seconds! There is zero Toxin-X in Kyoto\'s water supply. Seeing elderly citizens panicking in supermarkets and buying bottled water when our tap water is 100% clean broke my heart. Disinformation for commercial profit is a public health hazard!"',
        status: 'available'
      }
    ],
    timeline: [
      {
        id: 'time_cf1',
        time: 'TIMESTAMP: UNVERIFIED',
        description: 'AquaGuard Marketing VP anonymously registers "ecoshieldnews.com" using WHOIS privacy shields.',
        isCorrect: true,
        orderIndex: 0
      },
      {
        id: 'time_cf2',
        time: 'TIMESTAMP: UNVERIFIED',
        description: 'Marcus Sterling offers journalist Renee Carter a $5,000 bribe to publish the fake Toxin-X article; Renee rejects it.',
        isCorrect: true,
        orderIndex: 1
      },
      {
        id: 'time_cf3',
        time: 'TIMESTAMP: UNVERIFIED',
        description: 'AquaGuard launches EcoShield News with the fake article and hires an Osaka bot farm to flood 10,000 retweets to local parents.',
        isCorrect: true,
        orderIndex: 2
      },
      {
        id: 'time_cf4',
        time: 'TIMESTAMP: UNVERIFIED',
        description: 'Panic buying clears stores of bottled water while AquaGuard generates $189,000 in filter sales.',
        isCorrect: true,
        orderIndex: 3
      }
    ],
    clues: [
      { id: 'cl_whois_conflict', text: 'WHOIS audit reveals the "independent news site" is registered directly to AquaGuard\'s VP of Marketing.', isDiscovered: false, evidenceId: 'ev_whois_record' },
      { id: 'cl_disinfo_roi', text: 'Internal corporate ledgers prove $28,000 was spent on ads and bot farms to generate $189,000 in filter sales.', isDiscovered: false, evidenceId: 'ev_marketing_ledger' },
      { id: 'cl_red_herring_spill', text: 'Red Herring: A 10-year-old river spill report was circulated on forums but had no connection to current municipal tap water.', isDiscovered: false }
    ],
    solution: {
      questions: [
        {
          id: 'q1',
          question: 'What is the "Follow-the-Money" principle in Media and Information Literacy (MIL)?',
          choices: [
            'A technique for calculating cryptocurrency exchange rates.',
            'Analyzing who profits financially or politically from the creation and spread of a panic rumor to uncover hidden motives.',
            'Tracking government tax expenditures on public libraries.',
            'Comparing prices between different online shopping platforms.'
          ],
          correctAnswer: 'Analyzing who profits financially or politically from the creation and spread of a panic rumor to uncover hidden motives.',
          explanation: 'Disinformation is rarely accidental. In many cases, it is a deliberate commercial campaign designed to induce fear because fearful consumers buy solutions (such as expensive filters, supplements, or subscriptions).'
        },
        {
          id: 'q2',
          question: 'How does performing a WHOIS domain lookup assist a media investigator?',
          choices: [
            'It automatically removes fake news websites from the internet.',
            'It exposes the domain registration date, billing details, and hidden corporate ownership, revealing conflicts of interest.',
            'It translates foreign language news websites into English.',
            'It speeds up internet connection bandwidth during investigations.'
          ],
          correctAnswer: 'It exposes the domain registration date, billing details, and hidden corporate ownership, revealing conflicts of interest.',
          explanation: 'A WHOIS lookup reveals when a domain was registered and who paid for it. If a "breaking news site" was created seven days ago by the marketing director of a product featured in the article, it exposes a massive conflict of interest.'
        }
      ]
    },
    location: {
      name: 'AquaGuard Marketing Office',
      description: 'The corporate marketing suite where campaign ledgers and clickbait analytics were engineered.',
      coordinates: '34.6902° N, 135.5021° E',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
      hotspots: [
        { id: 'hs_marketing_desk', name: 'Marcus Sterling\'s Desk', x: 60, y: 70, description: 'Marcus\'s computer terminal displaying advertising receipts and bot network orders.', revealsEvidenceId: 'ev_marketing_ledger' }
      ]
    }
  }
];
