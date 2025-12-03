# CSCI 2110 DSA Practice - Technical Documentation

A web application for practicing Data Structures & Algorithms concepts with AI-powered feedback.

**Live Demo:** https://jacksonjohnallanchambers.github.io/DSAMIDTERM/

---

## Table of Contents

1. [Overview](#overview)
2. [Security & Privacy](#security--privacy)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Features](#features)
6. [Data Flow](#data-flow)
7. [Question Banks](#question-banks)
8. [AI Integration](#ai-integration)
9. [Local Storage Schema](#local-storage-schema)
10. [Development Guide](#development-guide)
11. [Deployment](#deployment)

---

## Overview

This application provides three practice modes for CSCI 2110 (Data Structures & Algorithms in Java):

| Mode | Description | AI Required |
|------|-------------|-------------|
| **Multiple Choice** | Instant feedback with explanations | No |
| **Short Answer** | Batch submit 5 questions, AI grades against rubric | Yes (optional) |
| **Long Answer** | Extended responses with detailed AI feedback | Yes (optional) |

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite
- Styling: Vanilla CSS (dark theme)
- AI: Google Gemini API (2.0 Flash for short, 2.5 Flash for long)
- Persistence: Browser localStorage (per-user)
- Hosting: GitHub Pages (static)

---

## Security & Privacy

### ✅ Safe to Make Public

**No API keys or secrets are stored in this repository.**

| Item | Status | Notes |
|------|--------|-------|
| Hardcoded API keys | ❌ None | Verified via code search |
| Environment variables in code | ✅ Safe | Only `process.env.GEMINI_API_KEY` reference (for local dev server) |
| User API keys | ✅ Safe | Stored only in user's browser localStorage |
| User data | ✅ Safe | Never leaves the user's browser |

### How API Keys Work

1. **Local Development:** Optional `GEMINI_API_KEY` environment variable for the Express proxy server
2. **Production (GitHub Pages):** Users enter their own API key in the app UI
3. **Storage:** Keys are stored in browser localStorage, keyed by username
4. **Transmission:** Keys are sent directly to Google's Gemini API (HTTPS), never to any third-party server

---

## Project Structure

```
DSAMIDTERM/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── webapp/
│   ├── public/                 # Static assets
│   ├── server/
│   │   └── index.js            # Express proxy server (dev only)
│   ├── src/
│   │   ├── components/         # React UI components
│   │   │   ├── Landing.tsx         # Home page with mode selection
│   │   │   ├── NavBar.tsx          # Navigation bar
│   │   │   ├── TopicSelect.tsx     # MC topic selector
│   │   │   ├── QuestionCard.tsx    # MC question display
│   │   │   ├── Feedback.tsx        # MC result feedback
│   │   │   ├── ExplanationModal.tsx# MC explanation popup
│   │   │   ├── ShortTopicSelect.tsx# SA topic selector
│   │   │   ├── ShortBatch.tsx      # SA batch question form
│   │   │   ├── ShortFeedback.tsx   # SA AI feedback display
│   │   │   ├── LongTopicSelect.tsx # LA topic selector
│   │   │   ├── LongQuestion.tsx    # LA question form
│   │   │   ├── LongFeedback.tsx    # LA AI feedback display
│   │   │   ├── StatsView.tsx       # Statistics dashboard
│   │   │   ├── SessionComplete.tsx # Session completion screen
│   │   │   └── Pie.tsx             # Pie chart component
│   │   ├── data/
│   │   │   ├── questions.ts        # Multiple choice question bank
│   │   │   ├── shortAnswers.ts     # Short answer question bank
│   │   │   ├── longAnswers.ts      # Long answer question bank
│   │   │   └── stems.ts            # Shared code blocks for questions
│   │   ├── lib/
│   │   │   ├── storage.ts          # localStorage utilities & stats
│   │   │   ├── shortAi.ts          # Short answer AI integration
│   │   │   └── longAi.ts           # Long answer AI integration
│   │   ├── App.tsx                 # Main application & routing
│   │   ├── App.css                 # Application styles
│   │   ├── types.ts                # TypeScript type definitions
│   │   ├── main.tsx                # React entry point
│   │   └── index.css               # Global styles
│   ├── index.html                  # HTML template
│   ├── package.json                # Dependencies & scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── vite.config.ts              # Vite build configuration
│   └── README.md                   # Usage instructions
├── MidtermPracticeMultipleChoice-Clean.txt  # Source questions
├── MidtermPracticeShortAnswer-Clean.txt     # Source questions
├── MidtermPracticeLongAnswer-Clean.txt      # Source questions
└── DOCUMENTATION.md                # This file
```

---

## Architecture

### Component Hierarchy

```
App.tsx (state management & routing)
├── NavBar (navigation, stats display)
├── Landing (mode selection, name/API key input)
├── TopicSelect → QuestionCard → Feedback → ExplanationModal
├── ShortTopicSelect → ShortBatch → ShortFeedback
├── LongTopicSelect → LongQuestion → LongFeedback
└── StatsView (statistics dashboard)
```

### State Management

All state is managed in `App.tsx` using React's `useState` hooks:

| State | Purpose |
|-------|---------|
| `view` | Current screen/route |
| `name` | User's display name |
| `apiKey` | User's Gemini API key |
| `userStats` | Accumulated statistics |
| `sessionQuestions` | Current practice session queue |
| `idx` | Current question index |
| `selected` / `submitted` | MC answer state |

### Routing

The app uses a simple view-based routing system (no React Router):

```typescript
type View = 
  | 'landing'           // Home page
  | 'topic'             // MC topic selection
  | 'practice'          // MC practice mode
  | 'stats'             // Statistics view
  | 'short-topic'       // SA topic selection
  | 'short-batch'       // SA question batch
  | 'short-feedback'    // SA AI results
  | 'long-topic'        // LA topic selection
  | 'long-question'     // LA question form
  | 'long-feedback'     // LA AI results
  | 'sessionDone'       // Session complete
  | 'sectionCompletePrompt' // All questions in section done
```

---

## Features

### Multiple Choice Mode

- **Instant Feedback:** Know immediately if your answer is correct
- **Explanations:** Detailed explanations for each question
- **Hot Streak:** Track consecutive first-try correct answers
- **Progress Tracking:** See completion percentage per topic
- **Similar Questions:** Jump to related questions by topic
- **Session Queue:** Incorrect questions stay in rotation until answered correctly

### Short Answer Mode

- **Batch Submission:** Answer 5 questions at once
- **AI Grading:** Gemini evaluates against rubrics
- **Scoring:** 0-1 score with verdict (correct/partial/incorrect)
- **Feedback:** Strengths, issues, and suggestions for each answer
- **Example Answers:** View model answers after submission

### Long Answer Mode

- **Extended Responses:** Write detailed explanations and code
- **Deep Analysis:** Gemini 2.5 Flash provides thorough feedback
- **Code Questions:** Some questions include code to analyze
- **Navigation:** Move between questions within a topic

### Statistics Dashboard

- **Overview:** Total attempts, accuracy, hot streaks
- **By Topic:** Breakdown per DSA topic
- **By Question:** Drill down to individual question performance
- **Export/Import:** CSV backup of all statistics

---

## Data Flow

### Multiple Choice Flow

```
User selects answer → Submit → recordAttempt() → Update stats
                                    ↓
                              localStorage.setItem()
                                    ↓
                              Show Feedback component
```

### Short Answer Flow

```
User writes 5 answers → Submit batch
        ↓
getShortAnswerFeedback() → Gemini API
        ↓
Parse JSON response → recordShortAttempts()
        ↓
Display ShortFeedback with evaluations
```

### Long Answer Flow

```
User writes answer → Submit
        ↓
getLongAnswerFeedback() → Gemini 2.5 API
        ↓
Parse response → recordLongAttempt()
        ↓
Display LongFeedback with evaluation
```

---

## Question Banks

### Topics

All question types use the same topic categories:

```typescript
type TopicModule =
  | 'OOP Basics'
  | 'Complexity'
  | 'Linked Lists'
  | 'Inheritance & Polymorphism'
  | 'Java Basics'
```

### Multiple Choice Schema

```typescript
interface Question {
  id: string              // Unique identifier
  prompt: string          // Question text
  choices: string[]       // Answer options
  correctIndex: number    // 0-based correct answer index
  explanation: string     // Why the answer is correct
  topic: TopicModule      // Category
  code?: string           // Optional code block
  stemId?: string         // Reference to shared code in stems.ts
  statements?: string[]   // I/II/III style statements
}
```

### Short Answer Schema

```typescript
interface ShortAnswerQuestion {
  id: string
  prompt: string
  topic: SA_Topic
  rubric: string          // Grading criteria
  exampleAnswer: string   // Model answer
}
```

### Long Answer Schema

```typescript
interface LongAnswerQuestion {
  id: string
  prompt: string
  topic: LA_Topic
  rubric: string
  exampleAnswer?: string
  code?: string           // Code to analyze
}
```

---

## AI Integration

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Frontend)                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Development Mode:          Production Mode:            │
│  ┌─────────────┐           ┌─────────────┐             │
│  │ shortAi.ts  │           │ shortAi.ts  │             │
│  │ longAi.ts   │           │ longAi.ts   │             │
│  └──────┬──────┘           └──────┬──────┘             │
│         │                         │                     │
│         ▼                         ▼                     │
│  ┌─────────────┐           ┌─────────────┐             │
│  │ /api/...    │           │ Gemini API  │             │
│  │ (Express)   │           │ (Direct)    │             │
│  └──────┬──────┘           └─────────────┘             │
│         │                                               │
│         ▼                                               │
│  ┌─────────────┐                                       │
│  │ Gemini API  │                                       │
│  └─────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

### Gemini Models Used

| Mode | Model | Endpoint |
|------|-------|----------|
| Short Answer | gemini-2.0-flash-exp | generativelanguage.googleapis.com |
| Long Answer | gemini-2.5-flash | generativelanguage.googleapis.com |

### Response Schemas

**Short Answer Response:**
```json
{
  "evaluations": [
    {
      "id": "string",
      "score": 0.0,
      "verdict": "correct | partial | incorrect",
      "strengths": ["..."],
      "issues": ["..."],
      "suggestions": ["..."]
    }
  ]
}
```

**Long Answer Response:**
```json
{
  "evaluation": {
    "id": "string",
    "score": 0.0,
    "summary": "string",
    "strengths": ["..."],
    "issues": ["..."],
    "suggestions": ["..."]
  }
}
```

### Mock Mode

When no API key is provided, the app returns mock feedback:
- Short: Generic partial credit response
- Long: Placeholder evaluation

---

## Local Storage Schema

### Key Format

```
dsa_practice_user_{username}
```

### UserData Structure

```typescript
interface UserData {
  name: string
  stats: Stats
  apiKey?: string  // User's Gemini API key
}

interface Stats {
  total: {
    attempts: number
    correct: number
    wrong: number
    uniqueCorrectIds: string[]
    currentHotStreak: number
    bestHotStreak: number
  }
  byTopic: Record<TopicModule, TopicStats>
  byQuestion: Record<string, QuestionStat>
  sa: ShortAnswerStats
  la: LongAnswerStats
}
```

### CSV Export Format

```csv
type,key,attempts,correct,accuracy,lastScore,lastAnswer,lastAt,lastFeedback
MC_TOPIC,Complexity,15,12,0.8000,,,
MC_QUESTION,q001,3,2,0.6667,,,
SA_TOPIC,Linked Lists,5,3,0.6000,,,
SA_QUESTION,sa001,2,1,0.5000,0.75,"User answer",2025-01-01T00:00:00.000Z,
LA_QUESTION,la001,1,,0.8,"Long answer","2025-01-01T00:00:00.000Z","Feedback text"
```

---

## Development Guide

### Prerequisites

- Node.js 18+
- npm or npm.cmd (Windows)

### Setup

```powershell
cd webapp
npm install
```

### Running Locally

**Frontend only (MC mode works, SA/LA need API key in browser):**
```powershell
npm run dev
```

**With proxy server (optional, for SA/LA without browser API key):**
```powershell
# Set API key first
setx GEMINI_API_KEY "your-key-here"
# Restart terminal, then:
npm run dev:full
```

### Building

```powershell
npm run build    # Output in dist/
npm run preview  # Preview production build
```

### Adding Questions

1. **Multiple Choice:** Edit `src/data/questions.ts`
2. **Short Answer:** Edit `src/data/shortAnswers.ts`
3. **Long Answer:** Edit `src/data/longAnswers.ts`
4. **Shared Code Blocks:** Edit `src/data/stems.ts`

---

## Deployment

### GitHub Pages (Automatic)

The repository includes a GitHub Actions workflow that automatically deploys on push to `master`:

1. Push changes to `master` branch
2. GitHub Actions builds the Vite project
3. Deploys to GitHub Pages

**Configuration:** `.github/workflows/deploy.yml`

### Manual Deployment

```powershell
npm run deploy  # Uses gh-pages package
```

### Base Path Configuration

If deploying to a different repository name, update `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

---

## Getting a Free API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with Google
3. Click **"Create API Key"**
4. Paste into the app

**Free tier:** 15 requests/minute, 1,500 requests/day

---

## License

This project is for educational purposes (CSCI 2110 coursework).
