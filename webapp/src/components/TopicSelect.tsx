import React, { useMemo, useState } from 'react'
import { Question, TopicModule } from '../types'

interface Props {
  allQuestions: Question[]
  onStart: (topic: 'All' | TopicModule) => void
}

export default function TopicSelect({ allQuestions, onStart }: Props){
  const topics = useMemo(() => {
    const t = new Set<TopicModule>()
    for (const q of allQuestions) t.add(q.topic)
    return Array.from(t.values()).sort()
  }, [allQuestions])

  const [selected, setSelected] = useState<'All' | TopicModule>('All')

  return (
    <div className="container">
      <header className="header">
        <div className="brand">Multiple Choice</div>
        <div className="topic">Choose a topic to practice</div>
      </header>
      <div className="card">
        <div className="choices" role="radiogroup" aria-label="Topic">
          <label className="choice">
            <input
              type="radio"
              name="topic"
              checked={selected === 'All'}
              onChange={() => setSelected('All')}
            />
            <span>All Topics</span>
          </label>
          {topics.map((t) => (
            <label key={t} className="choice">
              <input
                type="radio"
                name="topic"
                checked={selected === t}
                onChange={() => setSelected(t)}
              />
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
