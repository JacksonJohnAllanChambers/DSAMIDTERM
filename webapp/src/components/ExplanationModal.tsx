import React from 'react'

interface Props {
  open: boolean
  onClose: () => void
  explanation: string
}

export default function ExplanationModal({ open, onClose, explanation }: Props) {
  if (!open) return null
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Explanation">
      <div className="modal">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <h3 style={{margin:0}}>Explanation</h3>
          <button onClick={onClose} aria-label="Close explanation">Close</button>
        </div>
        <div style={{whiteSpace:'pre-wrap', lineHeight:1.5}}>{explanation}</div>
      </div>
    </div>
  )
}
