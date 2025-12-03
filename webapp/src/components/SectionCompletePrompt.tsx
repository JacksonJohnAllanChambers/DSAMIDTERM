import React from 'react'
import { TopicModule } from '../types'

interface Props {
  topicLabel: string
  onReview: () => void
  onChooseAnother: () => void
}

export default function SectionCompletePrompt({ topicLabel, onReview, onChooseAnother }: Props){
  return (
    <div className="container">
      <div className="card">
        <h2 style={{marginTop:0}}>Section Complete</h2>
        <p>You have already completed all questions in <strong>{topicLabel}</strong>.</p>
        <p>Would you like to review this section again without affecting your completion? (Statistics will still be counted.)</p>
        <div className="actions">
          <button className="primary" onClick={onReview}>Review anyway</button>
          <button onClick={onChooseAnother}>Choose another section</button>
        </div>
      </div>
    </div>
  )
}
