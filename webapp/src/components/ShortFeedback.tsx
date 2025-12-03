import React from 'react'
import { ShortAnswerEvalItem, ShortAnswerQuestion } from '../types'

interface Props {
  batch: Array<ShortAnswerQuestion & { userAnswer: string }>
  result: { evaluations: ShortAnswerEvalItem[], mock?: boolean }
  onBack: () => void
}

export default function ShortFeedback({ batch, result, onBack }: Props){
  const map = new Map(result.evaluations.map(e => [e.id, e]))
  return (
    <div className="container">
      <header className="header">
        <div className="brand">Short Answer • Feedback</div>
        <div className="topic">{result.mock ? 'Mock feedback (no API key)' : 'AI-generated feedback'}</div>
      </header>
      <div className="card">
        {batch.map((q, i) => {
          const ev = map.get(q.id)
          return (
            <div key={q.id} style={{marginBottom:20}}>
              <div style={{fontWeight:700, marginBottom:6}}>{i+1}. {q.prompt}</div>
              <div style={{marginBottom:6}}>
                <span className="kbd">Your answer</span>
                <div style={{whiteSpace:'pre-wrap'}}>{q.userAnswer}</div>
              </div>
              {ev && (
                <div className={`feedback ${ev.verdict === 'correct' ? 'ok' : ev.verdict === 'partial' ? '' : 'bad'}`} style={{marginBottom:8}}>
                  Verdict: {ev.verdict.toUpperCase()} • Score: {(ev.score*100).toFixed(0)}%
                </div>
              )}
              {ev && (
                <div style={{display:'grid', gap:6}}>
                  <div><strong>Strengths:</strong> <ul>{ev.strengths.map((s,idx)=>(<li key={idx}>{s}</li>))}</ul></div>
                  <div><strong>Issues:</strong> <ul>{ev.issues.map((s,idx)=>(<li key={idx}>{s}</li>))}</ul></div>
                  <div><strong>Suggestions:</strong> <ul>{ev.suggestions.map((s,idx)=>(<li key={idx}>{s}</li>))}</ul></div>
                </div>
              )}
              <div style={{marginTop:8}}>
                <span className="kbd">Example solution</span>
                <div style={{whiteSpace:'pre-wrap'}}>{q.exampleAnswer}</div>
              </div>
            </div>
          )
        })}
        <div className="actions">
          <button onClick={onBack}>Back</button>
        </div>
      </div>
    </div>
  )
}
