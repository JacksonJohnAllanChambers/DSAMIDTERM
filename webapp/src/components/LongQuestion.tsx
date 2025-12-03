import React, { useEffect, useMemo, useState } from 'react'
import la from '../data/longAnswers'
import { LA_Topic, LongAnswerQuestion } from '../types'

interface Props {
  topic: LA_Topic
  index?: number
  onEvaluated: (q: LongAnswerQuestion & { userAnswer: string }) => void
  onPrev?: () => void
  onNext?: () => void
}

export default function LongQuestion({ topic, index = 0, onEvaluated, onPrev, onNext }: Props){
  const qs = useMemo(() => la.filter(q => q.topic === topic), [topic])
  const q = qs[index]
  const [answer, setAnswer] = useState('')
  const allFilled = answer.trim().length > 0
  useEffect(() => { setAnswer('') }, [q?.id])
  if (!q) return <div className="container"><div className="card">No questions for {topic}.</div></div>
  return (
    <div className="container">
      <header className="header">
        <div className="brand">Long Answer • {topic}</div>
        <div className="topic">Question {index+1} of {qs.length}</div>
      </header>
      <div className="card">
        <div style={{fontWeight:700, marginBottom:8}}>{q.prompt}</div>
        {q.code && (
          <pre style={{whiteSpace:'pre-wrap', background:'#0b1220', padding:12, borderRadius:8, border:'1px solid #374151', overflowX:'auto'}}>
            <code>{q.code}</code>
          </pre>
        )}
        <textarea
          value={answer}
          onChange={(e)=> setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={10}
          style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #374151', background:'#0b1220', color:'var(--text)'}}
        />
        <div className="actions" style={{justifyContent:'space-between', flexWrap:'wrap'}}>
          <div style={{display:'flex', gap:10}}>
            <button onClick={onPrev} disabled={!onPrev}>Prev</button>
            <button onClick={onNext} disabled={!onNext}>Next</button>
          </div>
          <button className="primary" disabled={!allFilled} onClick={() => onEvaluated({ ...q, userAnswer: answer })}>Submit for feedback</button>
        </div>
      </div>
    </div>
  )
}
