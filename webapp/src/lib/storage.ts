import { TopicModule } from '../types'

export type QuestionStat = {
  attempts: number
  correct: number
  wrong: number
  firstTryCorrectCount: number
}

export type Stats = {
  total: {
    attempts: number
    correct: number
    wrong: number
    uniqueCorrectIds: string[]
    currentHotStreak: number
    bestHotStreak: number
  }
  byTopic: Record<TopicModule, {
    attempts: number
    correct: number
    wrong: number
    uniqueCorrectIds: string[]
    byQuestion: Record<string, QuestionStat>
  }>
  byQuestion: Record<string, QuestionStat & { topic: TopicModule }>
  // Short Answer stats (optional)
  sa: ShortAnswerStats
  // Long Answer stats (optional)
  la: LongAnswerStats
}

export type ShortAnswerQuestionStats = {
  attempts: number
  correct: number // count of verdict === 'correct'
  lastScore?: number
  lastAnswer?: string
  lastAt?: number
  topic: TopicModule
}

export type ShortAnswerStats = {
  totals: { attempts: number, correct: number }
  byTopic: Record<TopicModule, { attempts: number, correct: number }>
  byQuestion: Record<string, ShortAnswerQuestionStats>
}

export type LongAnswerQuestionStats = {
  attempts: number
  lastScore?: number
  lastAnswer?: string
  lastFeedback?: string
  lastAt?: number
  topic: TopicModule
}

export type LongAnswerStats = {
  totals: { attempts: number }
  byTopic: Record<TopicModule, { attempts: number }>
  byQuestion: Record<string, LongAnswerQuestionStats>
}

export type UserData = {
  name: string
  stats: Stats
  apiKey?: string // Optional per-user Gemini API key entered in UI
}

export function defaultStats(): Stats {
  return {
    total: { attempts: 0, correct: 0, wrong: 0, uniqueCorrectIds: [], currentHotStreak: 0, bestHotStreak: 0 },
    byTopic: {
      'OOP Basics': { attempts: 0, correct: 0, wrong: 0, uniqueCorrectIds: [], byQuestion: {} },
      'Complexity': { attempts: 0, correct: 0, wrong: 0, uniqueCorrectIds: [], byQuestion: {} },
      'Linked Lists': { attempts: 0, correct: 0, wrong: 0, uniqueCorrectIds: [], byQuestion: {} },
      'Inheritance & Polymorphism': { attempts: 0, correct: 0, wrong: 0, uniqueCorrectIds: [], byQuestion: {} },
      'Java Basics': { attempts: 0, correct: 0, wrong: 0, uniqueCorrectIds: [], byQuestion: {} },
    },
    byQuestion: {},
    sa: {
      totals: { attempts: 0, correct: 0 },
      byTopic: {
        'OOP Basics': { attempts: 0, correct: 0 },
        'Complexity': { attempts: 0, correct: 0 },
        'Linked Lists': { attempts: 0, correct: 0 },
        'Inheritance & Polymorphism': { attempts: 0, correct: 0 },
        'Java Basics': { attempts: 0, correct: 0 },
      },
      byQuestion: {}
    },
    la: {
      totals: { attempts: 0 },
      byTopic: {
        'OOP Basics': { attempts: 0 },
        'Complexity': { attempts: 0 },
        'Linked Lists': { attempts: 0 },
        'Inheritance & Polymorphism': { attempts: 0 },
        'Java Basics': { attempts: 0 },
      },
      byQuestion: {}
    }
  }
}

const KEY_PREFIX = 'dsa_practice_user_'

export function loadUser(name: string): UserData {
  const key = KEY_PREFIX + name
  const raw = localStorage.getItem(key)
  if (!raw) return { name, stats: defaultStats() }
  try {
    const parsed = JSON.parse(raw) as UserData
    // ensure shapes exist for new fields
    return {
      name: parsed.name || name,
      stats: { ...defaultStats(), ...parsed.stats,
        total: { ...defaultStats().total, ...(parsed.stats?.total || {}) },
        byTopic: { ...defaultStats().byTopic, ...(parsed.stats?.byTopic || {}) },
        byQuestion: parsed.stats?.byQuestion || {},
        sa: {
          totals: { attempts: parsed.stats?.sa?.totals?.attempts || 0, correct: parsed.stats?.sa?.totals?.correct || 0 },
          byTopic: {
            'OOP Basics': { attempts: parsed.stats?.sa?.byTopic?.['OOP Basics']?.attempts || 0, correct: parsed.stats?.sa?.byTopic?.['OOP Basics']?.correct || 0 },
            'Complexity': { attempts: parsed.stats?.sa?.byTopic?.['Complexity']?.attempts || 0, correct: parsed.stats?.sa?.byTopic?.['Complexity']?.correct || 0 },
            'Linked Lists': { attempts: parsed.stats?.sa?.byTopic?.['Linked Lists']?.attempts || 0, correct: parsed.stats?.sa?.byTopic?.['Linked Lists']?.correct || 0 },
            'Inheritance & Polymorphism': { attempts: parsed.stats?.sa?.byTopic?.['Inheritance & Polymorphism']?.attempts || 0, correct: parsed.stats?.sa?.byTopic?.['Inheritance & Polymorphism']?.correct || 0 },
            'Java Basics': { attempts: parsed.stats?.sa?.byTopic?.['Java Basics']?.attempts || 0, correct: parsed.stats?.sa?.byTopic?.['Java Basics']?.correct || 0 },
          },
          byQuestion: parsed.stats?.sa?.byQuestion || {}
        },
        la: {
          totals: { attempts: parsed.stats?.la?.totals?.attempts || 0 },
          byTopic: {
            'OOP Basics': { attempts: parsed.stats?.la?.byTopic?.['OOP Basics']?.attempts || 0 },
            'Complexity': { attempts: parsed.stats?.la?.byTopic?.['Complexity']?.attempts || 0 },
            'Linked Lists': { attempts: parsed.stats?.la?.byTopic?.['Linked Lists']?.attempts || 0 },
            'Inheritance & Polymorphism': { attempts: parsed.stats?.la?.byTopic?.['Inheritance & Polymorphism']?.attempts || 0 },
            'Java Basics': { attempts: parsed.stats?.la?.byTopic?.['Java Basics']?.attempts || 0 },
          },
          byQuestion: parsed.stats?.la?.byQuestion || {}
        }
      },
      apiKey: parsed.apiKey
    }
  } catch {
    return { name, stats: defaultStats() }
  }
}

export function saveUser(data: UserData) {
  const key = KEY_PREFIX + data.name
  localStorage.setItem(key, JSON.stringify(data))
}

export function recordAttempt(stats: Stats, params: { id: string, topic: TopicModule, wasCorrect: boolean, firstAttempt: boolean, countForCompletion?: boolean }): Stats {
  const { id, topic, wasCorrect, firstAttempt, countForCompletion = true } = params
  const next: Stats = JSON.parse(JSON.stringify(stats))

  // totals
  next.total.attempts += 1
  if (wasCorrect) {
    next.total.correct += 1
    if (countForCompletion && !next.total.uniqueCorrectIds.includes(id)) next.total.uniqueCorrectIds.push(id)
    if (firstAttempt) {
      next.total.currentHotStreak += 1
      if (next.total.currentHotStreak > next.total.bestHotStreak) next.total.bestHotStreak = next.total.currentHotStreak
    } else {
      next.total.currentHotStreak = 0
    }
  } else {
    next.total.wrong += 1
    // wrong on first attempt breaks the hot streak
    if (firstAttempt) next.total.currentHotStreak = 0
  }

  // by topic
  const t = next.byTopic[topic]
  t.attempts += 1
  if (wasCorrect) {
    t.correct += 1
    if (countForCompletion && !t.uniqueCorrectIds.includes(id)) t.uniqueCorrectIds.push(id)
  } else t.wrong += 1

  // by question
  if (!t.byQuestion[id]) t.byQuestion[id] = { attempts: 0, correct: 0, wrong: 0, firstTryCorrectCount: 0 }
  if (!next.byQuestion[id]) next.byQuestion[id] = { attempts: 0, correct: 0, wrong: 0, firstTryCorrectCount: 0, topic }
  const qT = t.byQuestion[id]
  const q = next.byQuestion[id]
  qT.attempts += 1; q.attempts += 1
  if (wasCorrect) { qT.correct += 1; q.correct += 1 } else { qT.wrong += 1; q.wrong += 1 }
  if (wasCorrect && firstAttempt) { qT.firstTryCorrectCount += 1; q.firstTryCorrectCount += 1 }

  return next
}

export function completionPercent(stats: Stats, totalQuestions: number): number {
  if (totalQuestions === 0) return 0
  return Math.round((stats.total.uniqueCorrectIds.length / totalQuestions) * 100)
}

export function recordShortAttempts(stats: Stats, items: Array<{ questionId: string, topic: TopicModule, verdict: 'correct' | 'partial' | 'incorrect', score?: number, answerText?: string, timestamp?: number }>): Stats {
  const next: Stats = JSON.parse(JSON.stringify(stats))
  for (const it of items) {
    const correct = it.verdict === 'correct'
    next.sa.totals.attempts += 1
    if (correct) next.sa.totals.correct += 1
    const t = next.sa.byTopic[it.topic]
    t.attempts += 1
    if (correct) t.correct += 1
    if (!next.sa.byQuestion[it.questionId]) next.sa.byQuestion[it.questionId] = { attempts: 0, correct: 0, topic: it.topic }
    const q = next.sa.byQuestion[it.questionId]
    q.attempts += 1
    if (correct) q.correct += 1
    if (it.score !== undefined) q.lastScore = it.score
    if (it.answerText !== undefined) q.lastAnswer = it.answerText
    q.lastAt = it.timestamp || Date.now()
    q.topic = it.topic
  }
  return next
}

export function recordLongAttempt(stats: Stats, item: { questionId: string, topic: TopicModule, score?: number, answerText?: string, feedbackText?: string, timestamp?: number }): Stats {
  const next: Stats = JSON.parse(JSON.stringify(stats))
  next.la.totals.attempts += 1
  next.la.byTopic[item.topic].attempts += 1
  if (!next.la.byQuestion[item.questionId]) next.la.byQuestion[item.questionId] = { attempts: 0, topic: item.topic }
  const q = next.la.byQuestion[item.questionId]
  q.attempts += 1
  q.lastScore = item.score
  if (item.answerText !== undefined) q.lastAnswer = item.answerText
  if (item.feedbackText !== undefined) q.lastFeedback = item.feedbackText
  q.lastAt = item.timestamp || Date.now()
  q.topic = item.topic
  return next
}

// CSV export/import utilities
export function exportStatsToCsv(stats: Stats): string {
  const rows: string[][] = []
  rows.push(['type','key','attempts','correct','accuracy','lastScore','lastAnswer','lastAt','lastFeedback'])
  const toAcc = (c:number,a:number)=> a? (c/a).toFixed(4):'0'
  // MC Topics
  for (const [topic, t] of Object.entries(stats.byTopic)) {
    rows.push(['MC_TOPIC', topic, String(t.attempts), String(t.correct), toAcc(t.correct, t.attempts), '', '', ''])
  }
  // MC Questions
  for (const [qid, q] of Object.entries(stats.byQuestion)) {
    rows.push(['MC_QUESTION', qid, String(q.attempts), String(q.correct), toAcc(q.correct, q.attempts), '', '', ''])
  }
  // SA Topics
  for (const [topic, t] of Object.entries(stats.sa.byTopic)) {
    rows.push(['SA_TOPIC', topic, String(t.attempts), String(t.correct), toAcc(t.correct, t.attempts), '', '', ''])
  }
  // SA Questions
  for (const [qid, q] of Object.entries(stats.sa.byQuestion)) {
    rows.push([
      'SA_QUESTION',
      qid,
      String(q.attempts),
      String(q.correct),
      toAcc(q.correct, q.attempts),
      q.lastScore != null ? String(q.lastScore) : '',
      q.lastAnswer || '',
      q.lastAt ? new Date(q.lastAt).toISOString() : '',
      ''
    ])
  }
  // LA Topics
  for (const [topic, t] of Object.entries(stats.la.byTopic)) {
    rows.push(['LA_TOPIC', topic, String(t.attempts), '', '', '', '', ''])
  }
  // LA Questions (serialize last values)
  for (const [qid, q] of Object.entries(stats.la.byQuestion)) {
    rows.push([
      'LA_QUESTION',
      qid,
      String(q.attempts),
      '',
      '',
      q.lastScore != null ? String(q.lastScore) : '',
      q.lastAnswer || '',
      q.lastAt ? new Date(q.lastAt).toISOString() : '',
      q.lastFeedback || ''
    ])
  }
  const toCsvValue = (v:string)=> /[",\n]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v
  return rows.map(r=> r.map(toCsvValue).join(',')).join('\n')
}

export function importStatsFromCsv(stats: Stats, csvText: string, mode: 'merge'|'replace' = 'merge'): Stats {
  const parse = (text:string): string[][] => {
    const lines = text.split(/\r?\n/).filter(l=>l.length>0)
    const rows: string[][] = []
    for (const line of lines) {
      const out: string[] = []
      let cur = ''
      let inQ = false
      for (let i=0;i<line.length;i++){
        const ch = line[i]
        if (inQ){
          if (ch==='"' && line[i+1]==='"'){ cur+='"'; i++ }
          else if (ch==='"'){ inQ=false }
          else { cur+=ch }
        } else {
          if (ch===','){ out.push(cur); cur='' }
          else if (ch==='"'){ inQ=true }
          else { cur+=ch }
        }
      }
      out.push(cur)
      rows.push(out)
    }
    return rows
  }
  const rows = parse(csvText)
  if (rows.length===0) return stats
  const header = rows[0]
  const idx = (h:string)=> header.indexOf(h)
  const iType = idx('type'), iKey = idx('key'), iAttempts = idx('attempts'), iCorrect = idx('correct'), iLastScore = idx('lastScore'), iLastAnswer = idx('lastAnswer'), iLastAt = idx('lastAt'), iLastFeedback = idx('lastFeedback')
  let next = mode==='replace' ? defaultStats() : JSON.parse(JSON.stringify(stats)) as Stats
  for (let r=1;r<rows.length;r++){
    const row = rows[r]
    const type = row[iType]
    const key = row[iKey]
    const attempts = Number(row[iAttempts]||0)
    const correct = Number(row[iCorrect]||0)
    if (type==='MC_TOPIC'){
      const t = next.byTopic[key as TopicModule]
      if (t){ t.attempts += attempts; t.correct += correct; t.wrong = Math.max(0, t.attempts - t.correct) }
    } else if (type==='MC_QUESTION'){
      const q = next.byQuestion[key] || { attempts:0, correct:0, wrong:0, firstTryCorrectCount:0, topic: 'OOP Basics' as TopicModule }
      q.attempts += attempts
      q.correct += correct
      q.wrong = Math.max(0, q.attempts - q.correct)
      next.byQuestion[key] = q
    } else if (type==='SA_TOPIC'){
      const t = next.sa.byTopic[key as TopicModule]
      if (t){ t.attempts += attempts; t.correct += correct }
      next.sa.totals.attempts += attempts
      next.sa.totals.correct += correct
    } else if (type==='SA_QUESTION'){
      const q = next.sa.byQuestion[key] || { attempts:0, correct:0, topic: 'OOP Basics' as TopicModule }
      q.attempts += attempts
      q.correct += correct
      const ls = row[iLastScore]; if (ls) q.lastScore = Number(ls)
      const la = row[iLastAnswer]; if (la) q.lastAnswer = la
      const lt = row[iLastAt]; if (lt) q.lastAt = Date.parse(lt)
      next.sa.byQuestion[key] = q
    } else if (type==='LA_TOPIC'){
      const t = next.la.byTopic[key as TopicModule]
      if (t) t.attempts += attempts
      next.la.totals.attempts += attempts
    } else if (type==='LA_QUESTION'){
      const q = next.la.byQuestion[key] || { attempts: 0, topic: 'OOP Basics' as TopicModule }
      q.attempts += attempts
      const ls = row[iLastScore]; if (ls) q.lastScore = Number(ls)
      const la = row[iLastAnswer]; if (la) q.lastAnswer = la
      const lt = row[iLastAt]; if (lt) q.lastAt = Date.parse(lt)
      const lf = iLastFeedback>=0 ? row[iLastFeedback] : ''
      if (lf) q.lastFeedback = lf
      next.la.byQuestion[key] = q
    }
  }
  return next
}
