# CSCI 2110 DSA Practice (Multiple Choice)

A lightweight React + Vite + TypeScript web app to practice multiple-choice questions for CSCI 2110 (Data Structures and Algorithms in Java).

## Features

- Landing page with mode selection (Multiple Choice enabled; Short/Long Answer coming soon)
- Name prompt with per-user persistence
- Navigation bar with:
  - Your name
  - Completion progress bar (% of unique questions answered correctly)
  - Current hot streak (first-try correct)
- Topic selector: practice All topics or a specific topic
- Practice mode flow:
  1. See a question and multiple-choice options.
  2. Submit an answer.
  3. Instant feedback (correct/wrong) with four actions: Retry, Explanation, Similar problem, Continue.
- Explanations for each question.
- Statistics page with drill-down:
  - Totals: attempts, correct, wrong, unique-correct, current & best hot streak
  - By Topic: accuracy % and counts
  - By Question (within topic): accuracy %, attempts, correct/wrong, first-try correct count
- Simple, fast UI. Keyboard-accessible radio choices.

## Getting started

From the `webapp` folder:

```powershell
# Install deps (use npm.cmd on Windows PowerShell if scripts are restricted)
npm.cmd install

# Start dev server
npm.cmd run dev

# Build for production
npm.cmd run build

# Preview production build locally
npm.cmd run preview
```

Then open the URL shown in the terminal (typically http://localhost:5173/).
From the landing page, choose Multiple Choice, select a topic, and start.

## Project structure

- `src/types.ts` — Type definitions for `Question`.
- `src/data/questions.ts` — Question bank (seeded from your Midterm practice file).
- `src/components/` — UI components (`QuestionCard`, `Feedback`, `ExplanationModal`).
- `src/App.tsx` — Practice flow and session state.

## Editing/adding questions

Edit `src/data/questions.ts`. Each question uses this shape:

```ts
export interface Question {
  id: string
  prompt: string
  choices: string[]
  correctIndex: number
  explanation: string
  topic: 'OOP Basics' | 'Complexity' | 'Linked Lists' | 'Inheritance & Polymorphism' | 'Java Basics'
  source?: string
}
```

Tips:
- Keep `id` unique.
- `correctIndex` is the 0-based index into `choices`.
- Use `topic` to group/filter later.
- Put a clear reasoning in `explanation` (key concept + why others are wrong).

## Roadmap / next steps

- Randomization & scoring (track correct answers, streaks, and score summary).
- Filters by module/topic and difficulty.
- Short-answer and long-answer modes with model answers and rubrics.
- Persistence (localStorage) to remember progress and last question.
- Import/generate questions from Topics section (semi-automated authoring helpers).
- Accessibility enhancements (focus traps in modal, ARIA labels polished).
- Unit tests for question flow.

## Notes

- Built with Vite 5, React 18, TypeScript 5. Minimal CSS for clarity.
- If PowerShell blocks `npm`, use `npm.cmd` as shown above.

## Deploying to GitHub Pages

This app can be deployed to GitHub Pages as a static site. The AI grading features will work directly in the browser (users provide their own Gemini API key).

### Option 1: Automatic Deployment (GitHub Actions)

1. Push your code to GitHub
2. Go to your repository Settings → Pages
3. Under "Build and deployment", select **GitHub Actions** as the source
4. Push to the `main` branch - the workflow will automatically build and deploy

Your site will be available at: `https://YOUR_USERNAME.github.io/DSAMIDTERM/`

### Option 2: Manual Deployment

```powershell
cd webapp

# Install dependencies (including gh-pages)
npm.cmd install

# Build and deploy to gh-pages branch
npm.cmd run deploy
```

Then in your GitHub repository Settings → Pages, set the source to the `gh-pages` branch.

### Configuration

If your repository has a different name, update the `base` path in `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

---

cd "c:\Users\jackc\OneDrive\Desktop\DSAMIDTERM\webapp"
npm.cmd install
npm.cmd run dev

# In PowerShell
setx GEMINI_API_KEY "YOUR_API_KEY_HERE"

# Reopen terminal so the env var is available, then:
cd "c:\Users\jackc\OneDrive\Desktop\DSAMIDTERM\webapp"
npm.cmd run dev:full