import React, { useMemo, useState } from 'react'
import { Question, TopicModule } from '../types'
import { Stats, exportStatsToCsv } from '../lib/storage'
import Pie from './Pie'
import laData from '../data/longAnswers'

interface Props {
  stats: Stats
  allQuestions: Question[]
  onBackHome: () => void
  onResetStats?: () => void
}

type Level = 'total' | 'topic' | 'question'
type Mode = 'MC' | 'SA' | 'LA'

export default function StatsView({ stats, allQuestions, onBackHome, onResetStats }: Props){
  const [level, setLevel] = useState<Level>('total')
  const [topic, setTopic] = useState<TopicModule | null>(null)
  const [questionId, setQuestionId] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('MC')

  const topics = useMemo(() => Object.keys(stats.byTopic) as TopicModule[], [stats])
  const questionMap = useMemo(() => {
    const m = new Map<string, Question>()
    for (const q of allQuestions) m.set(q.id, q)
    return m
  }, [allQuestions])
  const laMap = useMemo(() => {
    const m = new Map<string, { id: string, prompt: string, topic: TopicModule }>()
    for (const q of laData) m.set(q.id, { id: q.id, prompt: q.prompt, topic: q.topic })
    return m
  }, [])

  const goTopic = (t: TopicModule) => { setTopic(t); setLevel('topic') }
  const goQuestion = (id: string) => { setQuestionId(id); setLevel('question') }

  const percent = (a: number, b: number) => b === 0 ? 0 : Math.round((a / b) * 100)

  const onExportCsv = () => {
    const csv = exportStatsToCsv(stats)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dsa-stats-${new Date().toISOString().replace(/[:.]/g,'-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container">
      <div className="header" style={{marginTop:8}}>
        <div className="brand">Statistics</div>
        <div className="actions">
          <button onClick={() => setMode('MC')} disabled={mode==='MC'}>MC</button>
          <button onClick={() => setMode('SA')} disabled={mode==='SA'}>Short</button>
          <button onClick={() => setMode('LA')} disabled={mode==='LA'}>Long</button>
          <button onClick={onExportCsv}>Export CSV</button>
          <button onClick={() => { setLevel('total'); setTopic(null); setQuestionId(null) }}>Reset View</button>
          <button
            onClick={() => {
              if (confirm('Are you really sure you want to reset ALL statistics? This cannot be undone.')) {
                onResetStats && onResetStats()
              }
            }}
            title="Reset all stored statistics (local to this browser and name)"
            style={{ borderColor: 'var(--danger)', color: 'white' }}
          >
            Reset Statistics
          </button>
          <button onClick={onBackHome}>Back</button>
        </div>
      </div>
      <div className="card">
        {level === 'total' && mode === 'MC' && (
          <div>
            <h3 style={{marginTop:0}}>Totals</h3>
            <p>Attempts: {stats.total.attempts} • Correct: {stats.total.correct} • Wrong: {stats.total.wrong}</p>
            <p>Unique correct: {stats.total.uniqueCorrectIds.length}</p>
            <p>Current hot streak: {stats.total.currentHotStreak} • Best hot streak: {stats.total.bestHotStreak}</p>
            <h4>By Topic</h4>
            <div className="choices">
              {topics.map(t => {
                const s = stats.byTopic[t]
                return (
                  <button key={t} className="choice" style={{justifyContent:'space-between'}} onClick={() => goTopic(t)}>
                    <span style={{display:'flex', alignItems:'center', gap:10}}>
                      <Pie size={28} values={[s.correct, Math.max(0, s.wrong)]} colors={['var(--accent)', 'var(--danger)']} title={`${t} accuracy`} />
                      {t}
                    </span>
                    <span style={{color:'var(--muted)'}}>{percent(s.correct, s.attempts)}% • A:{s.attempts} C:{s.correct} W:{s.wrong}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {level === 'total' && mode === 'SA' && (
          <div>
            <h3 style={{marginTop:0}}>Short Answer Totals</h3>
            <p>Attempts: {stats.sa.totals.attempts} • Correct: {stats.sa.totals.correct} • Accuracy: {percent(stats.sa.totals.correct, stats.sa.totals.attempts)}%</p>
            <h4>By Topic</h4>
            <div className="choices">
              {topics.map(t => {
                const s = stats.sa.byTopic[t]
                return (
                  <button key={t} className="choice" style={{justifyContent:'space-between'}} onClick={() => goTopic(t)}>
                    <span style={{display:'flex', alignItems:'center', gap:10}}>
                      <Pie size={28} values={[s.correct, Math.max(0, s.attempts - s.correct)]} colors={['var(--accent)', 'var(--danger)']} title={`${t} accuracy`} />
                      {t}
                    </span>
                    <span style={{color:'var(--muted)'}}>{percent(s.correct, s.attempts)}% • A:{s.attempts} C:{s.correct}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {level === 'total' && mode === 'LA' && (
          <div>
            <h3 style={{marginTop:0}}>Long Answer Totals</h3>
            <p>Attempts: {stats.la.totals.attempts}</p>
            <h4>By Topic</h4>
            <div className="choices">
              {topics.map(t => {
                const s = stats.la.byTopic[t]
                const topicScores: number[] = Object.values(stats.la.byQuestion)
                  .filter(q => q.topic === t && q.lastScore != null)
                  .map(q => q.lastScore as number)
                const avg = topicScores.length ? (topicScores.reduce((a,b)=>a+b,0) / topicScores.length) : 0
                return (
                  <button key={t} className="choice" style={{justifyContent:'space-between'}} onClick={() => goTopic(t)}>
                    <span style={{display:'flex', alignItems:'center', gap:10}}>
                      <Pie size={28} values={[avg, Math.max(0, 1-avg)]} colors={['var(--accent)', 'var(--danger)']} title={`${t} avg score`} />
                      {t}
                    </span>
                    <span style={{color:'var(--muted)'}}>Avg: {(avg*100).toFixed(0)}% • A:{s.attempts}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {level === 'topic' && topic && mode === 'MC' && (
          <div>
            <h3 style={{marginTop:0}}>Topic: {topic}</h3>
            <p>Attempts: {stats.byTopic[topic].attempts} • Correct: {stats.byTopic[topic].correct} • Wrong: {stats.byTopic[topic].wrong}</p>
            <h4>By Question</h4>
            <div className="choices">
              {Object.entries(stats.byTopic[topic].byQuestion).map(([id, s]) => (
                <button key={id} className="choice" style={{justifyContent:'space-between'}} onClick={() => goQuestion(id)}>
                  <span>{questionMap.get(id)?.prompt ?? id}</span>
                  <span style={{color:'var(--muted)'}}>{percent(s.correct, s.attempts)}% • A:{s.attempts} C:{s.correct} W:{s.wrong} • 1stTry:{s.firstTryCorrectCount}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {level === 'topic' && topic && mode === 'SA' && (
          <div>
            <h3 style={{marginTop:0}}>Short Answer • {topic}</h3>
            <p>Attempts: {stats.sa.byTopic[topic].attempts} • Correct: {stats.sa.byTopic[topic].correct}</p>
            <h4>By Question</h4>
            <div className="choices">
              {Object.entries(stats.sa.byQuestion).filter(([_, q]) => q.topic === topic).map(([id, s]) => (
                <button key={id} className="choice" style={{justifyContent:'space-between'}} onClick={() => goQuestion(id)}>
                  <span>{questionMap.get(id)?.prompt ?? id}</span>
                  <span style={{color:'var(--muted)'}}>{percent(s.correct, s.attempts)}% • A:{s.attempts} C:{s.correct}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {level === 'topic' && topic && mode === 'LA' && (
          <div>
            <h3 style={{marginTop:0}}>Long Answer • {topic}</h3>
            <p>Attempts: {stats.la.byTopic[topic].attempts}</p>
            <h4>By Question</h4>
            <div className="choices">
              {Object.entries(stats.la.byQuestion).filter(([_, q]) => q.topic === topic).map(([id, s]) => (
                <button key={id} className="choice" style={{justifyContent:'space-between'}} onClick={() => goQuestion(id)}>
                  <span>{laMap.get(id)?.prompt ?? id}</span>
                  <span style={{color:'var(--muted)'}}>A:{s.attempts}{s.lastScore!=null?` • Last score: ${(s.lastScore*100).toFixed(0)}%`:''}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {level === 'question' && questionId && mode === 'MC' && (
          <div>
            <h3 style={{marginTop:0}}>Question</h3>
            <div style={{marginBottom:8}}>{questionMap.get(questionId)?.prompt ?? questionId}</div>
            {(() => {
              const s = stats.byQuestion[questionId]
              if (!s) return <p>No data.</p>
              return (
                <div>
                  <p>Attempts: {s.attempts} • Correct: {s.correct} • Wrong: {s.wrong}</p>
                  <p>First-try correct count: {s.firstTryCorrectCount}</p>
                  <p>Accuracy: {percent(s.correct, s.attempts)}%</p>
                </div>
              )
            })()}
            <div className="actions">
              <button onClick={() => setLevel('topic')}>Back to Topic</button>
            </div>
          </div>
        )}

        {level === 'question' && questionId && mode === 'SA' && (
          <div>
            <h3 style={{marginTop:0}}>Short Answer • Question</h3>
            <div style={{marginBottom:8}}>{questionMap.get(questionId)?.prompt ?? questionId}</div>
            {(() => {
              const s = stats.sa.byQuestion[questionId]
              if (!s) return <p>No data.</p>
              return (
                <div>
                  <p>Attempts: {s.attempts} • Correct: {s.correct} • Accuracy: {percent(s.correct, s.attempts)}%</p>
                  {s.lastScore != null && <p>Last score: {(s.lastScore*100).toFixed(0)}%</p>}
                  {s.lastAt && <p>Last attempt: {new Date(s.lastAt).toLocaleString()}</p>}
                  {s.lastAnswer && (
                    <div>
                      <div className="kbd">Last submitted answer</div>
                      <div style={{whiteSpace:'pre-wrap'}}>{s.lastAnswer}</div>
                    </div>
                  )}
                </div>
              )
            })()}
            <div className="actions">
              <button onClick={() => setLevel('topic')}>Back to Topic</button>
            </div>
          </div>
        )}

        {level === 'question' && questionId && mode === 'LA' && (
          <div>
            <h3 style={{marginTop:0}}>Long Answer • Question</h3>
            <div style={{marginBottom:8}}>{laMap.get(questionId)?.prompt ?? questionId}</div>
            {(() => {
              const s = stats.la.byQuestion[questionId]
              if (!s) return <p>No data.</p>
              return (
                <div>
                  <p>Attempts: {s.attempts} {s.lastScore!=null?`• Last score: ${(s.lastScore*100).toFixed(0)}%`:''}</p>
                  {s.lastAt && <p>Last attempt: {new Date(s.lastAt).toLocaleString()}</p>}
                  {s.lastAnswer && (
                    <div>
                      <div className="kbd">Last submitted answer</div>
                      <div style={{whiteSpace:'pre-wrap'}}>{s.lastAnswer}</div>
                    </div>
                  )}
                  {s.lastFeedback && (
                    <div style={{marginTop:8}}>
                      <div className="kbd">Last feedback</div>
                      <div style={{whiteSpace:'pre-wrap'}}>{s.lastFeedback}</div>
                    </div>
                  )}
                </div>
              )
            })()}
            <div className="actions">
              <button onClick={() => setLevel('topic')}>Back to Topic</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
