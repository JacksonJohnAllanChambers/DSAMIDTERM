import React from 'react'

interface Props {
  name: string
  completionPct: number
  currentHotStreak: number
  onHome: () => void
  onPractice: () => void
  onShort: () => void
  onLong?: () => void
  onStats: () => void
}

export default function NavBar({ name, completionPct, currentHotStreak, onHome, onPractice, onShort, onLong, onStats }: Props){
  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="link" onClick={onHome}>CSCI 2110</button>
        <button className="link" onClick={onPractice}>Multiple Choice</button>
        <button className="link" onClick={onShort}>Short Answer</button>
        {onLong && <button className="link" onClick={onLong}>Long Answer</button>}
        <button className="link" onClick={onStats}>Statistics</button>
      </div>
      <div className="nav-center">
        <div className="user-name">{name || 'Guest'}</div>
        <div className="progress" title={`Completion ${completionPct}%`}>
          <div className="bar" style={{width: `${completionPct}%`}} />
          <div className="pct">{completionPct}%</div>
        </div>
      </div>
      <div className="nav-right">
        <div className="streak" title="Current hot streak (first-try correct)">🔥 {currentHotStreak}</div>
      </div>
    </nav>
  )
}
