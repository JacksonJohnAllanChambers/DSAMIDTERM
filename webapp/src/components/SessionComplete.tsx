import React from 'react'

interface Props {
  topicLabel: string
  onGoTopics: () => void
  onPracticeAll: () => void
}

export default function SessionComplete({ topicLabel, onGoTopics, onPracticeAll }: Props){
  return (
    <div className="container">
      <div className="card">
        <h2 style={{marginTop:0}}>Congratulations!</h2>
        <p>You completed all unseen questions in <strong>{topicLabel}</strong>.</p>
        <div className="actions">
          <button className="primary" onClick={onGoTopics}>Choose another section</button>
          <button onClick={onPracticeAll}>Practice all topics</button>
        </div>
      </div>
    </div>
  )
}
