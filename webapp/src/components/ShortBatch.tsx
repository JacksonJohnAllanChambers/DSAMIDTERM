import React, { useMemo, useState } from 'react'
import { SA_Topic, ShortAnswerQuestion } from '../types'
import sa from '../data/shortAnswers'

interface Props {
  topic: SA_Topic
  onSubmitBatch: (items: Array<ShortAnswerQuestion & { userAnswer: string }>) => void
}

export default function ShortBatch({ topic, onSubmitBatch }: Props){
  const qs = useMemo(() => sa.filter(q => q.topic === topic).slice(0, 5), [topic])
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const allFilled = qs.every(q => (answers[q.id]?.trim()?.length ?? 0) > 0)

  return (
    <div className="container">
      <header className="header">
        <div className="brand">Short Answer • {topic}</div>
        <div className="topic">Answer all questions, then Submit for AI feedback (batched)</div>
      </header>
      <div className="card">
        {qs.map((q, i) => (
          <div key={q.id} style={{marginBottom:16}}>
            <div style={{fontWeight:600, marginBottom:6}}>{i+1}. {q.prompt}</div>
            <textarea
              value={answers[q.id] || ''}
              onChange={(e)=> setAnswers(prev => ({...prev, [q.id]: e.target.value}))}
              placeholder="Type your answer here"
              rows={4}
              style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #374151', background:'#0b1220', color:'var(--text)'}}
            />
          </div>
        ))}
        <div className="actions">
          <button className="primary" disabled={!allFilled} onClick={() => onSubmitBatch(qs.map(q => ({...q, userAnswer: answers[q.id]})))}>
            Submit for feedback
          </button>
        </div>
      </div>
    </div>
  )
}
