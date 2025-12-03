export type TopicModule =
  | 'OOP Basics'
  | 'Complexity'
  | 'Linked Lists'
  | 'Inheritance & Polymorphism'
  | 'Java Basics';

export interface QuestionStem {
  id: string;
  title?: string;
  description?: string;
  code?: string; // optional shared code block
}

export interface Question {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  topic: TopicModule;
  source?: string; // e.g., "MidtermPracticeMultipleChoice-Clean.txt #17"
  // Optional enhancements for code-dependent questions
  stemId?: string; // reference to a shared code/context block
  code?: string; // inline code to render for this question
  statements?: string[]; // e.g., I/II/III statements listed above choices
}

// Short answer
export type SA_Topic = TopicModule // reuse same topics for simplicity

export interface ShortAnswerQuestion {
  id: string
  prompt: string
  topic: SA_Topic
  rubric: string // concise bullet expectations
  exampleAnswer: string // model answer shown after feedback
}

export interface ShortAnswerEvalItem {
  id: string
  score: number // 0..1
  verdict: 'correct' | 'partial' | 'incorrect'
  strengths: string[]
  issues: string[]
  suggestions: string[]
}

// Long answer
export type LA_Topic = TopicModule

export interface LongAnswerQuestion {
  id: string
  prompt: string
  topic: LA_Topic
  rubric: string
  exampleAnswer?: string
  code?: string // optional provided code to render in the prompt
}

export interface LongAnswerEvalItem {
  id: string
  score?: number // 0..1 (optional if model chooses not to score)
  summary?: string // free-form summary/assessment
  strengths?: string[]
  issues?: string[]
  suggestions?: string[]
  text?: string // raw text fallback if JSON parsing fails
}
