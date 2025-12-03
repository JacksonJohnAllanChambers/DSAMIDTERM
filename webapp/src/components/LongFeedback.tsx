import React from 'react'
import { LongAnswerEvalItem, LongAnswerQuestion } from '../types'

export default function LongFeedback({ item, result, onNext, onPrev, onBackTopic }: {
  item: LongAnswerQuestion & { userAnswer: string },
  result: { evaluation: LongAnswerEvalItem, mock?: boolean },
  onNext: () => void,
  onPrev?: () => void,
  onBackTopic: () => void
}){
  const ev = result.evaluation
  return (
    <div className="container">
      <header className="header">
        <div className="brand">Long Answer • Feedback</div>
        <div className="topic">{result.mock ? 'Mock feedback' : 'AI-generated feedback (Gemini 2.5 Flash)'}</div>
      </header>
      <div className="card">
        <div style={{fontWeight:700, marginBottom:6}}>{item.prompt}</div>
        {item.code && (
          <pre style={{whiteSpace:'pre-wrap', background:'#0b1220', padding:12, borderRadius:8, border:'1px solid #374151', overflowX:'auto'}}>
            <code>{item.code}</code>
          </pre>
        )}
        <div style={{marginBottom:10}}>
          <span className="kbd">Your answer</span>
          <div style={{whiteSpace:'pre-wrap'}}>{item.userAnswer}</div>
        </div>
        {ev.text ? (
          <div>
            <div className="kbd">Feedback</div>
            <div style={{whiteSpace:'pre-wrap'}}>{ev.text}</div>
          </div>
        ) : (
          <div>
            <div className={`feedback`} style={{marginBottom:8}}>
              {ev.score != null ? `Score: ${(ev.score*100).toFixed(0)}%` : 'Scored qualitatively'}
            </div>
            {ev.summary && <p><strong>Summary:</strong> {ev.summary}</p>}
            {ev.strengths && ev.strengths.length>0 && (
              <div><strong>Strengths:</strong><ul>{ev.strengths.map((s,i)=>(<li key={i}>{s}</li>))}</ul></div>
            )}
            {ev.issues && ev.issues.length>0 && (
              <div><strong>Issues:</strong><ul>{ev.issues.map((s,i)=>(<li key={i}>{s}</li>))}</ul></div>
            )}
            {ev.suggestions && ev.suggestions.length>0 && (
              <div><strong>Suggestions:</strong><ul>{ev.suggestions.map((s,i)=>(<li key={i}>{s}</li>))}</ul></div>
            )}
          </div>
        )}
        {item.exampleAnswer && (
          <div style={{marginTop:10}}>
            <span className="kbd">Example solution</span>
            <div style={{whiteSpace:'pre-wrap'}}>{item.exampleAnswer}</div>
          </div>
        )}
        <div className="actions" style={{marginTop:12}}>
          <button onClick={onBackTopic}>Back to topic</button>
          <div style={{display:'flex', gap:10, marginLeft:'auto'}}>
            <button onClick={onPrev} disabled={!onPrev}>Prev question</button>
            <button className="primary" onClick={onNext}>Next question</button>
          </div>
        </div>
      </div>
    </div>
  )
}
