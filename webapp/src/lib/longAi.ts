import { LongAnswerEvalItem, LongAnswerQuestion } from '../types'

const GEMINI_25_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export async function getLongAnswerFeedback(params: {
  item: LongAnswerQuestion & { userAnswer: string },
  apiKey?: string,
  userName?: string
}): Promise<{ evaluation: LongAnswerEvalItem, mock?: boolean }>{
  const { item, apiKey } = params

  // In production (GitHub Pages), call Gemini API directly
  // In development, use the proxy server
  if (import.meta.env.DEV) {
    const r = await fetch('/api/long-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, apiKey, userName: params.userName })
    })
    if (!r.ok) throw new Error('Failed to fetch long-answer feedback')
    return await r.json()
  }

  // Production: call Gemini directly
  if (!apiKey) {
    return {
      evaluation: {
        id: item.id,
        score: 0.6,
        summary: 'Mock evaluation - provide an API key for real feedback',
        strengths: ['Touches on key ideas'],
        issues: ['Missing detail/code correctness checks'],
        suggestions: ['Provide complexity, edge cases, and clearer formatting.']
      },
      mock: true
    }
  }

  const system = `You are a friendly grader for long-form DSA answers in Java. Prefer structured JSON output but you may also include insightful free-form feedback. When outputting JSON, use this schema:
{
  "evaluation": {
    "id": "string",
    "score": 0.0, // 0..1, optional if not applicable
    "summary": "string",
    "strengths": ["..."],
    "issues": ["..."],
    "suggestions": ["..."]
  }
}`

  const partsText = [
    system,
    `QUESTION id=${item.id} (topic: ${item.topic})`,
    item.prompt,
    item.code ? `CODE:\n${item.code}` : '',
    `RUBRIC:\n${item.rubric}`,
    item.exampleAnswer ? `EXAMPLE_ANSWER:\n${item.exampleAnswer}` : '',
    `USER_ANSWER:\n${item.userAnswer}`,
    `Now produce the evaluation. Prefer the JSON above; if you need to elaborate, add free-form text after the JSON.`
  ].filter(Boolean).join('\n\n')

  const body = { contents: [{ role: 'user', parts: [{ text: partsText }] }] }
  const url = `${GEMINI_25_URL}?key=${encodeURIComponent(apiKey)}`

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!r.ok) {
    const txt = await r.text()
    throw new Error(`Gemini API error: ${txt}`)
  }

  const data = await r.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

  // Try JSON parse first
  let evalObj
  try { evalObj = JSON.parse(text)?.evaluation } catch {}
  if (!evalObj) {
    const m = text.match(/\{[\s\S]*\}/)
    if (m) {
      try { evalObj = JSON.parse(m[0])?.evaluation } catch {}
    }
  }

  if (evalObj) {
    return { evaluation: { id: item.id, ...evalObj } }
  }

  // Fallback to raw text
  return { evaluation: { id: item.id, text } as LongAnswerEvalItem, mock: false }
}
