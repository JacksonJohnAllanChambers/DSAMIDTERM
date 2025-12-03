import React from 'react'

interface Props {
  isCorrect: boolean
  onRetry: () => void
  onExplain: () => void
  onContinue: () => void
  onSimilar: () => void
  retryDisabled: boolean
}

export default function Feedback({ isCorrect, onRetry, onExplain, onContinue, onSimilar, retryDisabled }: Props){
  return (
    <div className="card">
      <div className={`feedback ${isCorrect ? 'ok' : 'bad'}`}>
        {isCorrect ? 'Correct! 🎉' : 'Not quite. Give it another try!'}
      </div>
      <div className="actions">
        <button onClick={onRetry} disabled={retryDisabled} title={retryDisabled ? 'Already correct' : 'Try again'}>
          Retry
        </button>
        <button onClick={onExplain}>Explanation</button>
        <button onClick={onSimilar}>Similar problem</button>
        <button className="primary" onClick={onContinue}>Continue</button>
      </div>
    </div>
  )
}
