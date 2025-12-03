import React, { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Question, LA_Topic, LongAnswerQuestion } from './types'
import questionsData from './data/questions'
import QuestionCard from './components/QuestionCard'
import Feedback from './components/Feedback'
import ExplanationModal from './components/ExplanationModal'
import Landing from './components/Landing'
import TopicSelect from './components/TopicSelect'
import stems from './data/stems'
import NavBar from './components/NavBar'
import StatsView from './components/StatsView'
import { completionPercent, defaultStats, loadUser, recordAttempt, saveUser, Stats, UserData, recordShortAttempts, recordLongAttempt } from './lib/storage'
import SectionCompletePrompt from './components/SectionCompletePrompt'
import SessionComplete from './components/SessionComplete'
import ShortTopicSelect from './components/ShortTopicSelect'
import ShortBatch from './components/ShortBatch'
import ShortFeedback from './components/ShortFeedback'
import { getShortAnswerFeedback } from './lib/shortAi'
import LongTopicSelect from './components/LongTopicSelect'
import LongQuestion from './components/LongQuestion'
import LongFeedback from './components/LongFeedback'
import la from './data/longAnswers'
import { getLongAnswerFeedback } from './lib/longAi'

type View = 'landing' | 'topic' | 'practice' | 'stats' | 'sectionCompletePrompt' | 'sessionDone' | 'short-topic' | 'short-batch' | 'short-feedback' | 'long-topic' | 'long-question' | 'long-feedback'

export default function App(){
  const allQuestions = useMemo(() => questionsData, [])

  // navigation & session
  const [view, setView] = useState<View>('landing')
  const [name, setName] = useState<string>('')
  const [apiKey, setApiKey] = useState<string>('')
  const [userStats, setUserStats] = useState<Stats>(defaultStats())
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [reviewMode, setReviewMode] = useState(false)
  const [currentTopicLabel, setCurrentTopicLabel] = useState<string>('All Topics')
  const [pendingStart, setPendingStart] = useState<'All' | Question['topic'] | null>(null)
  const [saTopic, setSaTopic] = useState<Question['topic'] | null>(null)
  const [saBatch, setSaBatch] = useState<any[] | null>(null)
  const [saResult, setSaResult] = useState<any | null>(null)
  // Long Answer state
  const [laTopic, setLaTopic] = useState<LA_Topic | null>(null)
  const [laIndex, setLaIndex] = useState<number>(0)
  const [laItem, setLaItem] = useState<(LongAnswerQuestion & { userAnswer: string }) | null>(null)
  const [laResult, setLaResult] = useState<any | null>(null)

  // in-question state
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)

  const q: Question | undefined = sessionQuestions[idx]
  const isCorrect = !!q && submitted && selected === q.correctIndex

  const resetQA = () => { setSubmitted(false); setSelected(null); setShowExplanation(false) }

  // load user stats when name is set
  useEffect(() => {
    if (!name.trim()) return
    const data = loadUser(name.trim())
    setUserStats(data.stats)
    setApiKey(data.apiKey || '')
  }, [name])

  const startMC = () => setView('topic')
  const startSA = () => setView('short-topic')
  const startLA = () => setView('long-topic')
  const startWithTopic = (topic: 'All' | Question['topic']) => {
    const filteredAll = topic === 'All' ? allQuestions : allQuestions.filter((qq: Question) => qq.topic === topic)
    const unseenIds = new Set(userStats.total.uniqueCorrectIds)
  const unseen = filteredAll.filter((q: Question) => !unseenIds.has(q.id))
    setCurrentTopicLabel(topic === 'All' ? 'All Topics' : topic)
    if (unseen.length === 0) {
      // already complete -> prompt to review
      setPendingStart(topic)
      setView('sectionCompletePrompt')
      return
    }
    setReviewMode(false)
    setSessionQuestions(shuffle([...unseen]))
    setIdx(0)
    resetQA(); setAttemptCount(0)
    setView('practice')
  }

  const startReview = () => {
    if (!pendingStart) return setView('topic')
    const filteredAll = pendingStart === 'All' ? allQuestions : allQuestions.filter((qq: Question) => qq.topic === pendingStart)
    setReviewMode(true)
    setSessionQuestions(shuffle([...filteredAll]))
    setIdx(0)
    resetQA(); setAttemptCount(0)
    setView('practice')
  }

  const submit = () => {
    if (!q) return
    const wasCorrect = selected === q.correctIndex
    const firstAttempt = attemptCount === 0
  const nextStats = recordAttempt(userStats, { id: q.id, topic: q.topic, wasCorrect, firstAttempt, countForCompletion: !reviewMode })
    setUserStats(nextStats)
    if (name.trim()) saveUser({ name: name.trim(), stats: nextStats })
    setAttemptCount((c) => c + 1)
    setSubmitted(true)
  }
  const retry = () => { setSubmitted(false); setSelected(null) }
  const next = () => {
    if (!q) return
    // If correct and not in review mode, remove the question from the current session
    const wasCorrect = submitted && selected === q.correctIndex
    let nextList = sessionQuestions
    let nextIdx = idx
    if (wasCorrect && !reviewMode) {
      nextList = sessionQuestions.filter((item, i) => i !== idx)
      if (nextList.length === 0) {
        // session complete
        setSessionQuestions([])
        setView('sessionDone')
        resetQA(); setAttemptCount(0)
        return
      }
      if (nextIdx >= nextList.length) nextIdx = 0
      setSessionQuestions(nextList)
      setIdx(nextIdx)
      resetQA(); setAttemptCount(0)
      return
    }
    // otherwise move to next
    resetQA(); setIdx((i) => (i + 1) % sessionQuestions.length); setAttemptCount(0)
  }
  const similar = () => {
    if (!q) return
    const unseenIds = new Set(userStats.total.uniqueCorrectIds)
    let candidates = allQuestions.filter((qq: Question) => qq.topic === q.topic && qq.id !== q.id)
    if (!reviewMode) {
  const onlyUnseen = candidates.filter((c: Question) => !unseenIds.has(c.id))
      if (onlyUnseen.length > 0) candidates = onlyUnseen
    }
    if (candidates.length === 0) { next(); return }
    const pick = candidates[Math.floor(Math.random() * candidates.length)]
    // if not already in session, insert right after current
    const existing = sessionQuestions.findIndex(qq => qq.id === pick.id)
    if (existing === -1) {
      const newSess = [...sessionQuestions]
      newSess.splice(idx + 1, 0, pick)
      setSessionQuestions(newSess)
      setIdx(idx + 1)
    } else {
      setIdx(existing)
    }
    resetQA(); setAttemptCount(0)
  }

  if (view === 'landing') return <>
    <NavBar
      name={name}
      completionPct={completionPercent(userStats, allQuestions.length)}
      currentHotStreak={userStats.total.currentHotStreak}
      onHome={() => setView('landing')}
      onPractice={() => setView('topic')}
      onShort={() => setView('short-topic')}
      onLong={() => setView('long-topic')}
      onStats={() => setView('stats')}
    />
    <Landing
      name={name}
      onNameChange={setName}
      apiKey={apiKey}
      onApiKeyChange={(k) => {
        setApiKey(k)
        const trimmed = name.trim()
        if (trimmed) {
          const existing = loadUser(trimmed)
          const toSave: UserData = { name: trimmed, stats: existing.stats, apiKey: k }
          saveUser(toSave)
        }
      }}
      onChooseMC={startMC}
      onChooseSA={startSA}
      onChooseLA={startLA}
    />
  </>
  if (view === 'topic') return <>
    <NavBar
      name={name}
      completionPct={completionPercent(userStats, allQuestions.length)}
      currentHotStreak={userStats.total.currentHotStreak}
      onHome={() => setView('landing')}
      onPractice={() => setView('topic')}
      onShort={() => setView('short-topic')}
      onLong={() => setView('long-topic')}
      onStats={() => setView('stats')}
    />
    <TopicSelect allQuestions={allQuestions} onStart={startWithTopic} />
  </>
  if (view === 'sectionCompletePrompt') return <>
    <NavBar
      name={name}
      completionPct={completionPercent(userStats, allQuestions.length)}
      currentHotStreak={userStats.total.currentHotStreak}
      onHome={() => setView('landing')}
      onPractice={() => setView('topic')}
      onShort={() => setView('short-topic')}
      onLong={() => setView('long-topic')}
      onStats={() => setView('stats')}
    />
    <SectionCompletePrompt
      topicLabel={currentTopicLabel}
      onReview={startReview}
      onChooseAnother={() => setView('topic')}
    />
  </>
  if (view === 'stats') return <>
    <NavBar
      name={name}
      completionPct={completionPercent(userStats, allQuestions.length)}
      currentHotStreak={userStats.total.currentHotStreak}
      onHome={() => setView('landing')}
      onPractice={() => setView('topic')}
      onShort={() => setView('short-topic')}
      onLong={() => setView('long-topic')}
      onStats={() => setView('stats')}
    />
    <StatsView
      stats={userStats}
      allQuestions={allQuestions}
      onBackHome={() => setView('landing')}
      onResetStats={() => {
        const ns = defaultStats()
        setUserStats(ns)
        if (name.trim()) saveUser({ name: name.trim(), stats: ns, apiKey })
        alert('All statistics have been reset for this user.')
      }}
    />
  </>

  // Short Answer Routes
  if (view === 'short-topic') return <>
    <NavBar
      name={name}
      completionPct={completionPercent(userStats, allQuestions.length)}
      currentHotStreak={userStats.total.currentHotStreak}
      onHome={() => setView('landing')}
      onPractice={() => setView('topic')}
      onShort={() => setView('short-topic')}
      onLong={() => setView('long-topic')}
      onStats={() => setView('stats')}
    />
    <ShortTopicSelect onStart={(t) => { setSaTopic(t); setView('short-batch') }} />
  </>
  if (view === 'short-batch' && saTopic) return <>
    <NavBar
      name={name}
      completionPct={completionPercent(userStats, allQuestions.length)}
      currentHotStreak={userStats.total.currentHotStreak}
      onHome={() => setView('landing')}
      onPractice={() => setView('topic')}
      onShort={() => setView('short-topic')}
      onLong={() => setView('long-topic')}
      onStats={() => setView('stats')}
    />
    <ShortBatch topic={saTopic} onSubmitBatch={async (items) => {
      try {
        setSaBatch(items)
        const result = await getShortAnswerFeedback({ items, apiKey, userName: name })
        // Record SA stats
        const evalMap = new Map(result.evaluations.map(e => [e.id, e]))
        const attempts = items.map(it => ({
          questionId: it.id,
          topic: it.topic as any,
          verdict: (evalMap.get(it.id)?.verdict || 'partial') as 'correct'|'partial'|'incorrect',
          score: evalMap.get(it.id)?.score,
          answerText: it.userAnswer,
          timestamp: Date.now()
        }))
        const updated = recordShortAttempts(userStats, attempts)
        setUserStats(updated)
        if (name.trim()) saveUser({ name: name.trim(), stats: updated, apiKey })
        setSaResult(result)
        setView('short-feedback')
      } catch (e) {
        console.error('Short feedback error', e)
        alert('Failed to fetch short-answer feedback. Please ensure the server is running (npm run server or npm run dev:full).')
      }
    }} />
  </>
  // Long Answer Routes
  if (view === 'long-topic') return <>
    <NavBar
      name={name}
      completionPct={completionPercent(userStats, allQuestions.length)}
      currentHotStreak={userStats.total.currentHotStreak}
      onHome={() => setView('landing')}
      onPractice={() => setView('topic')}
      onShort={() => setView('short-topic')}
      onLong={() => setView('long-topic')}
      onStats={() => setView('stats')}
    />
    <LongTopicSelect onStart={(t) => { setLaTopic(t); setLaIndex(0); setView('long-question') }} />
  </>
  if (view === 'long-question' && laTopic) return <>
    <NavBar
      name={name}
      completionPct={completionPercent(userStats, allQuestions.length)}
      currentHotStreak={userStats.total.currentHotStreak}
      onHome={() => setView('landing')}
      onPractice={() => setView('topic')}
      onShort={() => setView('short-topic')}
      onStats={() => setView('stats')}
    />
    <LongQuestion topic={laTopic} index={laIndex}
      onPrev={() => {
        if (!laTopic) return
        const inTopic = la.filter(x => x.topic === laTopic)
        const nextIdx = (laIndex - 1 + inTopic.length) % inTopic.length
        setLaIndex(nextIdx)
      }}
      onNext={() => {
        if (!laTopic) return
        const inTopic = la.filter(x => x.topic === laTopic)
        const nextIdx = (laIndex + 1) % inTopic.length
        setLaIndex(nextIdx)
      }}
      onEvaluated={async (item) => {
      try {
        setLaItem(item)
        const result = await getLongAnswerFeedback({ item, apiKey, userName: name })
        // Record LA stats
        const ev = (result as any).evaluation || {}
        const fb = ev.text ?? [
          ev.summary ? `Summary: ${ev.summary}` : null,
          ev.strengths && ev.strengths.length ? `Strengths: ${ev.strengths.join('; ')}` : null,
          ev.issues && ev.issues.length ? `Issues: ${ev.issues.join('; ')}` : null,
          ev.suggestions && ev.suggestions.length ? `Suggestions: ${ev.suggestions.join('; ')}` : null,
        ].filter(Boolean).join('\n')
        const updated = recordLongAttempt(userStats, {
          questionId: item.id,
          topic: item.topic as any,
          score: ev.score,
          answerText: item.userAnswer,
          feedbackText: fb,
          timestamp: Date.now()
        })
        setUserStats(updated)
        if (name.trim()) saveUser({ name: name.trim(), stats: updated, apiKey })
        setLaResult(result)
        setView('long-feedback')
      } catch (e) {
        console.error('Long feedback error', e)
        alert('Failed to fetch long-answer feedback. Is the server running?')
      }
  }} />
  </>
  if (view === 'long-feedback' && laItem && laResult) return <>
    <NavBar
      name={name}
      completionPct={completionPercent(userStats, allQuestions.length)}
      currentHotStreak={userStats.total.currentHotStreak}
      onHome={() => setView('landing')}
      onPractice={() => setView('topic')}
      onShort={() => setView('short-topic')}
      onStats={() => setView('stats')}
    />
    <LongFeedback
      item={laItem}
      result={laResult as any}
      onBackTopic={() => setView('long-topic')}
      onNext={() => {
        if (!laTopic) { setView('long-topic'); return }
        const inTopic = la.filter(x => x.topic === laTopic)
        const nextIdx = (laIndex + 1) % inTopic.length
        setLaIndex(nextIdx)
        setLaItem(null); setLaResult(null)
        setView('long-question')
      }}
      onPrev={() => {
        if (!laTopic) { setView('long-topic'); return }
        const inTopic = la.filter(x => x.topic === laTopic)
        const prevIdx = (laIndex - 1 + inTopic.length) % inTopic.length
        setLaIndex(prevIdx)
        setLaItem(null); setLaResult(null)
        setView('long-question')
      }}
    />
  </>
  if (view === 'short-feedback' && saBatch && saResult) return <>
    <NavBar
      name={name}
      completionPct={completionPercent(userStats, allQuestions.length)}
      currentHotStreak={userStats.total.currentHotStreak}
      onHome={() => setView('landing')}
      onPractice={() => setView('topic')}
      onShort={() => setView('short-topic')}
      onStats={() => setView('stats')}
    />
    <ShortFeedback batch={saBatch as any} result={saResult as any} onBack={() => setView('short-topic')} />
  </>

  if (!q) return (
    <AppSessionDoneWrapper
      name={name}
      completion={completionPercent(userStats, allQuestions.length)}
      streak={userStats.total.currentHotStreak}
      topicLabel={currentTopicLabel}
      onGoTopics={() => setView('topic')}
      onPracticeAll={() => startWithTopic('All')}
    />
  )

  return (
    <>
      <NavBar
        name={name}
        completionPct={completionPercent(userStats, allQuestions.length)}
        currentHotStreak={userStats.total.currentHotStreak}
        onHome={() => setView('landing')}
        onPractice={() => setView('topic')}
        onShort={() => setView('short-topic')}
        onLong={() => setView('long-topic')}
        onStats={() => setView('stats')}
      />
      <div className="container">
      <header className="header">
        <div className="brand">CSCI 2110 Practice • Multiple Choice</div>
        <div className="topic">Topic: {q.topic}</div>
      </header>

      {!submitted && (
        <QuestionCard
          prompt={q.prompt}
          choices={q.choices}
          selectedIndex={selected}
          onSelect={setSelected}
          onSubmit={submit}
          stem={q.stemId ? stems[q.stemId] : undefined}
          code={q.code}
          statements={q.statements}
        />
      )}

      {submitted && (
        <Feedback
          isCorrect={isCorrect}
          onRetry={retry}
          onExplain={() => setShowExplanation(true)}
          onContinue={next}
          onSimilar={similar}
          retryDisabled={isCorrect}
        />
      )}

      <ExplanationModal
        open={showExplanation}
        onClose={() => setShowExplanation(false)}
        explanation={q.explanation}
      />
      </div>
    </>
  )
}

// post-practice session complete view
export function AppSessionDoneWrapper(props: { name: string, completion: number, streak: number, onGoTopics: () => void, onPracticeAll: () => void, topicLabel: string }){
  return (
    <>
      <NavBar
        name={props.name}
        completionPct={props.completion}
        currentHotStreak={props.streak}
        onHome={props.onGoTopics}
        onPractice={() => props.onGoTopics()}
        onShort={() => props.onGoTopics()}
        onStats={() => props.onGoTopics()}
      />
      <SessionComplete topicLabel={props.topicLabel} onGoTopics={props.onGoTopics} onPracticeAll={props.onPracticeAll} />
    </>
  )
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
