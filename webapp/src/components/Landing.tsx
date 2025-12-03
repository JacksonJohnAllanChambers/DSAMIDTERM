import React, { useRef, useState } from 'react'
import { importStatsFromCsv, loadUser, saveUser } from '../lib/storage'

interface Props {
  name: string
  onNameChange: (v: string) => void
  apiKey?: string
  onApiKeyChange?: (v: string) => void
  onChooseMC: () => void
  onChooseSA: () => void
  onChooseLA?: () => void
}

export default function Landing({ name, onNameChange, apiKey, onApiKeyChange, onChooseMC, onChooseSA, onChooseLA }: Props){
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [replaceMode, setReplaceMode] = useState(false)

  const onPickFile = async (f: File) => {
    try {
      const text = await f.text()
      const current = loadUser(name || 'anonymous')
      const merged = importStatsFromCsv(current.stats, text, replaceMode ? 'replace' : 'merge')
      saveUser({ name: current.name, stats: merged, apiKey })
      alert('Import successful!')
    } catch (e) {
      console.error(e)
      alert('Failed to import CSV. Please check the file format.')
    }
  }
  return (
    <div className="container">
      <header className="header">
        <div className="brand">CSCI 2110 Practice</div>
      </header>
      <div className="card">
        <h2 style={{marginTop:0}}>Choose Mode</h2>
        <div style={{marginBottom:12}}>
          <label style={{display:'block', marginBottom:6}}>Your name</label>
          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter your name"
            style={{width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #374151', background:'#0b1220', color:'var(--text)'}}
          />
          <small style={{color:'var(--muted)'}}>Your statistics and API key are saved per-name in this browser.</small>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:'block', marginBottom:6}}>Gemini API key (optional; used for Short & Long Answer)</label>
          <input
            value={apiKey || ''}
            onChange={(e) => onApiKeyChange && onApiKeyChange(e.target.value)}
            placeholder="Paste your API key (leave blank for mock feedback)"
            style={{width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #374151', background:'#0b1220', color:'var(--text)'}}
          />
          <small style={{color:'var(--muted)'}}>Stored locally in your browser for this name only.</small>
          <details style={{marginTop:8, fontSize:'0.85em', color:'var(--muted)'}}>
            <summary style={{cursor:'pointer', color:'var(--accent)'}}>How to get a free API key</summary>
            <ol style={{marginTop:8, paddingLeft:20, lineHeight:1.6}}>
              <li>Go to <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{color:'var(--accent)'}}>Google AI Studio</a></li>
              <li>Sign in with your Google account</li>
              <li>Click <strong>"Create API Key"</strong></li>
              <li>Copy the key and paste it above</li>
            </ol>
            <p style={{margin:'8px 0 0'}}>The free tier includes generous usage limits for Gemini models. Your key is stored only in your browser.</p>
          </details>
        </div>
        <div className="actions" style={{flexWrap:'wrap'}}>
          <button className="primary" onClick={onChooseMC} disabled={!name.trim()}>
            Multiple Choice
          </button>
          <button onClick={onChooseSA} disabled={!name.trim()}>Short Answer</button>
          <button onClick={onChooseLA} disabled={!name.trim()}>Long Answer</button>
        </div>
        <hr style={{margin:'16px 0', borderColor:'#1f2937'}} />
        <h3 style={{marginTop:0}}>Data import</h3>
        <p style={{color:'var(--muted)'}}>Load saved progress from a CSV exported on the Statistics page.</p>
        <div style={{display:'flex', gap:12, alignItems:'center', flexWrap:'wrap'}}>
          <button onClick={() => fileRef.current?.click()} disabled={!name.trim()}>Import CSV</button>
          <label style={{display:'inline-flex', alignItems:'center', gap:6}}>
            <input type="checkbox" checked={replaceMode} onChange={(e)=> setReplaceMode(e.target.checked)} />
            Replace existing stats (otherwise merges)
          </label>
          <input ref={fileRef} type="file" accept=".csv,text/csv" style={{display:'none'}} onChange={(e)=>{
            const f = e.target.files?.[0]; if (f) onPickFile(f)
          }} />
        </div>
      </div>
    </div>
  )
}
