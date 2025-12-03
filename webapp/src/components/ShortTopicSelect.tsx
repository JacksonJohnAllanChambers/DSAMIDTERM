import React, { useMemo, useState } from 'react'
import sa from '../data/shortAnswers'
import { SA_Topic } from '../types'

interface Props {
  onStart: (topic: SA_Topic) => void
}

export default function ShortTopicSelect({ onStart }: Props){
  const topics = useMemo(() => {
    const t = new Set<SA_Topic>()
    for (const q of sa) t.add(q.topic)
    return Array.from(t.values()).sort()
  }, [])
  const [selected, setSelected] = useState<SA_Topic>(topics[0])

  return (
    <div className="container">
      <header className="header">
        <div className="brand">Short Answer</div>
        <div className="topic">Choose a topic (5 questions batch)</div>
      </header>
      <div className="card">
        <div className="choices">
          {topics.map(t => (
            <label key={t} className="choice">
              <input type="radio" name="sa-topic" checked={selected === t} onChange={() => setSelected(t)} />
              <span>{t}</span>
            </label>
          ))}
        </div>
        <div className="actions">
          <button className="primary" onClick={() => onStart(selected)}>Start</button>
        </div>
      </div>
    </div>
  )
}
