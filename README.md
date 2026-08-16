# Cyber Detective

> **Learn digital and social safety by solving realistic mysteries.**

Cyber Detective is an interactive social-crime awareness and digital-literacy game developed for the **UNESCO Youth Hackathon 2026** under the theme of **Media and Information Literacy (MIL)**.

Instead of teaching safety through conventional quizzes, the project places players inside realistic investigations. Players experience a story, examine evidence, follow leads, question witnesses, reconstruct events, connect clues, and prepare a case report. The objective is to develop the player's ability to recognize manipulation, deception, fraud, social engineering, and other warning signs through active investigation.

## Why Cyber Detective?

Many awareness campaigns tell people what a scam or manipulation attempt looks like. Cyber Detective takes a different approach:

> **Don't just tell people what to watch out for. Teach them how to recognize it themselves.**

The game is designed for a **non-technical audience**, so technical concepts are introduced through understandable stories, evidence, characters, and decisions rather than requiring prior cybersecurity knowledge.

## Core Experience

A typical investigation follows this flow:

```text
Case Library
    ↓
Story Introduction
    ↓
Investigation Room
    ↓
Follow Leads
    ↓
Examine Evidence
    ↓
Interrogate Witnesses
    ↓
Discover & Connect Clues
    ↓
Reconstruct the Timeline
    ↓
Prepare the Detective Case Report
    ↓
Case Outcome & Learning Feedback
```

### Story-driven investigations

Each case begins with a narrative introduction containing characters, locations, events, dialogue, and warning signs. The story establishes the context before the player enters the investigation.

### Evidence investigation

Evidence is presented as investigation material rather than a static list. Depending on the case, players can work with documents, messages, contracts, records, images, calls, and other pieces of information. Some evidence is initially locked and becomes available as the investigation progresses.

### Investigation leads

Leads provide the player with investigative objectives. Completing a lead can unlock additional leads, evidence, witnesses, or later stages of the case.

### Witness interrogation

Players can question witnesses and use information discovered elsewhere in the investigation to challenge or verify testimony. This encourages players to compare statements against evidence rather than accepting every claim at face value.

### Detective board and clues

Players can discover clues and organize relationships between information while building their understanding of the case.

### Case timeline

Events can be reconstructed into a chronological sequence. The timeline is intended to help players identify contradictions and understand how the incident unfolded.

### Detective Case Report

The investigation culminates in a case conference/report rather than a conventional knowledge quiz. The player's findings and reasoning are used to form a final investigative conclusion.

### AI-assisted investigation

The application integrates **Google Gemini** for AI-powered functionality, including dynamically generated case content and investigation-oriented AI interactions. AI-generated content follows a structured case schema so that generated cases contain consistent story, evidence, witness, clue, timeline, solution, and location data.

## Current Case Themes

The handcrafted case data includes social-crime and digital-safety scenarios such as:

- **The Promise Beyond the Border** — overseas employment fraud, recruitment manipulation, and human-trafficking awareness.
- **The Echoes in the Static** — AI-generated voice impersonation and emergency-payment deception.
- Additional case content and dynamically generated cases are supported by the application's case model.

The cases are designed around a central principle: **the manipulation should initially appear believable**, requiring the player to investigate before reaching a conclusion.

## Educational Goals

Cyber Detective is designed to strengthen:

- **Media & Information Literacy** — questioning and verifying information.
- **Digital Literacy** — understanding common digital risks and deceptive online behavior.
- **Critical Thinking** — forming conclusions from evidence instead of assumptions.
- **Social-Crime Awareness** — recognizing manipulation and exploitation tactics.
- **Digital Safety** — identifying warning signs before making risky decisions.
- **Responsible AI Awareness** — understanding how AI can be used in deceptive scenarios.

Each case can communicate practical warning signs, manipulation techniques, learning objectives, and prevention strategies.

## Features

- Story-driven case introductions
- Interactive case library
- Investigation leads and progression
- Evidence viewer and evidence inspection
- Locked evidence and progression-based unlocking
- Witness interrogation
- Clue discovery and detective-board investigation
- Chronological case timeline
- Detective notebook
- Detective case report / case conference
- AI-assisted investigation and case generation
- Player profiles and case progress
- XP and achievements
- Persistent case state
- Custom case support
- Supabase authentication and database persistence
- Responsive, animated investigation interface
- Mystery-focused audio controls
- AI-generated learning and investigation content

## Technology Stack

### Frontend

- **React 19** — UI and application architecture
- **TypeScript** — type-safe development
- **Vite** — frontend development and production bundling
- **Tailwind CSS 4** — styling and responsive UI
- **Anime.js** — advanced interface and game-style animations
- **Framer Motion** — component and transition animations
- **Lucide React** — interface icons
- **React Markdown** — rendering formatted AI/content responses
- **Three.js** — 3D/visual effects where required

### Backend

- **Node.js**
- **Express** — API server and authentication/data endpoints
- **TypeScript**
- **esbuild** — production server bundling

### Database & Authentication

- **Supabase**
- **PostgreSQL** through Supabase
- Supabase Authentication
- Persistent player profiles
- Persistent case state
- Custom case storage

### AI

- **Google Gemini API** via `@google/genai`
- Structured case generation using a defined case-response schema
- Server-side AI requests
- Retry and response parsing utilities

## Architecture

```text
┌───────────────────────────────────────────────┐
│                 React + Vite                  │
│                                               │
│  Case Library  Story  Investigation  Reports  │
│       │         │          │          │       │
│       └─────────┴──────────┴──────────┘       │
│                    │                          │
│              Client API Calls                │
└────────────────────┼──────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────┐
│              Express / Node.js                │
│                                               │
│ Authentication │ Profiles │ Case State        │
│ Custom Cases   │ AI APIs │ Server Utilities   │
└───────────────┬─────────────────┬─────────────┘
                │                 │
                ▼                 ▼
       ┌────────────────┐  ┌──────────────────┐
       │    Supabase    │  │   Google Gemini  │
       │                │  │                  │
       │ Auth           │  │ Case generation  │
       │ PostgreSQL     │  │ AI interactions  │
       │ Player state   │  │ Structured data  │
       └────────────────┘  └──────────────────┘
```

### Important project directories

```text
.
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── CaseLibraryView.tsx
│   │   ├── EvidenceViewer.tsx
│   │   ├── InvestigationLeads.tsx
│   │   ├── InterrogationTerminal.tsx
│   │   ├── ClueBoard.tsx
│   │   ├── DetectiveNotebook.tsx
│   │   ├── DetectiveCaseReportForm.tsx
│   │   ├── DigitalSafetyReport.tsx
│   │   └── ...
│   ├── data/
│   │   ├── cases.ts
│   │   └── caseSchema.ts
│   ├── assets/
│   └── types.ts
├── server/
│   ├── geminiService.ts
│   └── supabaseService.ts
├── server.ts
├── SUPABASE_SCHEMA.sql
├── public/
├── index.html
├── package.json
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- A Supabase project
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/BArshat0/detective_game_2.git
cd detective_game_2
```

### 2. Install dependencies

```bash
npm install
```

The repository also contains a Bun lockfile if Bun is used in your development environment.

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=https://your-project.supabase.co
```

The expected variables are also documented in `.env.example`.

**Never commit real API keys or credentials to Git.**

### 4. Configure Supabase

Create a Supabase project and apply the SQL contained in:

```text
SUPABASE_SCHEMA.sql
```

The application uses Supabase for authentication and persistent user/case data.

### 5. Start the development server

```bash
npm run dev
```

The development command starts the TypeScript Express/Vite server defined by `server.ts`.

### 6. Production build

```bash
npm run build
npm start
```

### 7. Type checking

```bash
npm run lint
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Server-side Google Gemini API access |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase client/authentication key |

## Data Persistence

The application persists user-specific information through Supabase, including:

- Player profiles
- Cases solved
- Solved case IDs
- Achievements
- XP
- Investigation/case state
- Custom cases

Case state is associated with the authenticated user and case ID so that investigation progress can be restored.

## Security Considerations

The backend includes several protections and security-oriented practices, including:

- Authentication middleware for protected API routes
- Server-side handling of Gemini API calls
- Environment-based secret configuration
- JSON request-size limits
- Response security headers
- User-scoped Supabase clients for authenticated operations
- Case-state access restricted to the authenticated user
- Sanitization utilities for AI input handling
- Structured AI response parsing

Do not expose Gemini credentials, Supabase service credentials, or other private environment variables in frontend code or source control.

## Design Philosophy

Cyber Detective is intentionally designed as a **game first and lesson second**.

The player should not simply be told:

> "This is a scam."

Instead, the player should encounter a believable situation and ask:

> "What doesn't add up?"

They then investigate the available information, challenge assumptions, connect clues, and form a conclusion.

This approach is intended to make digital and social-safety lessons more memorable for people without a technical background.

## Project Status

Cyber Detective is an actively developed hackathon project. The repository contains the working web application, handcrafted investigation cases, AI-assisted case functionality, Supabase persistence, and the interactive investigation components.

## Hackathon Context

Developed for the **UNESCO Youth Hackathon 2026**, with a focus on **Media and Information Literacy** and practical digital/social-crime awareness.

The project aims to turn passive awareness into active investigation and critical thinking.

## Team

- **Barshat Panday**
- **Dev Adhikari**
- **Suyog Maharjan**
- **Barun Panday**

## License

No open-source license has currently been specified for this repository. Unless a license is added, the project remains subject to the default copyright terms applicable to the repository owner.
