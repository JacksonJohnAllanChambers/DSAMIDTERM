import React, { useMemo } from 'react'
import la from '../data/longAnswers'
import { LA_Topic } from '../types'

export default function LongTopicSelect({ onStart }: { onStart: (t: LA_Topic) => void }){
  const topics = useMemo(() => Array.from(new Set(la.map(q => q.topic))) as LA_Topic[], [])
  return (
    <div className="container">
      <header className="header">
        <div className="brand">Long Answer • Choose Topic</div>
      </header>
      <div className="card">
        <div className="choices">
          {topics.map(t => (
            <button key={t} className="choice" onClick={() => onStart(t)}>{t}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
