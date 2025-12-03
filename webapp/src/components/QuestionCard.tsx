import React from 'react'
import { QuestionStem } from '../types'

interface Props {
  prompt: string
  choices: string[]
  selectedIndex: number | null
  onSelect: (idx: number) => void
  onSubmit: () => void
  stem?: QuestionStem
  code?: string
  statements?: string[]
}

export default function QuestionCard({ prompt, choices, selectedIndex, onSelect, onSubmit, stem, code, statements }: Props){
  return (
    <div className="card" role="group" aria-label="Question">
      <div className="prompt">{prompt}</div>
      {stem && (
        <div style={{margin:'8px 0 12px'}}>
          {stem.title && <div style={{fontWeight:600, marginBottom:6}}>{stem.title}</div>}
          {stem.description && <div style={{color:'var(--muted)', marginBottom:6}}>{stem.description}</div>}
          {stem.code && (
            <pre style={{background:'#0b1220', border:'1px solid #1f2937', borderRadius:8, padding:12, overflowX:'auto'}}>
              <code>{stem.code}</code>
            </pre>
          )}
        </div>
      )}
      {code && (
        <pre style={{background:'#0b1220', border:'1px solid #1f2937', borderRadius:8, padding:12, overflowX:'auto', marginBottom:12}}>
          <code>{code}</code>
        </pre>
      )}
      {Array.isArray(statements) && statements.length > 0 && (
        <div style={{margin:'8px 0 12px'}}>
          {statements.map((s, i) => (
            <div key={i} style={{display:'flex', gap:8}}>
              <div style={{width:22, color:'var(--muted)'}}>{roman(i+1)}.</div>
              <div style={{flex:1}}>{s}</div>
            </div>
          ))}
        </div>
      )}
      <div className="choices">
        {choices.map((c, idx) => (
          <label key={idx} className="choice">
            <input
              type="radio"
              name="choice"
              checked={selectedIndex === idx}
              onChange={() => onSelect(idx)}
            />
            <span>{c}</span>
          </label>
        ))}
      </div>
      <div className="actions">
        <button className="primary" onClick={onSubmit} disabled={selectedIndex === null}>
          Submit
        </button>
      </div>
    </div>
  )
}

function roman(n: number): string {
  const map: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ]
  let res = ''
  for (const [val, sym] of map) {
    while (n >= val) { res += sym; n -= val }
  }
  return res
}
