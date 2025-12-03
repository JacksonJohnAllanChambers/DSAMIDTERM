import { ShortAnswerEvalItem, ShortAnswerQuestion } from '../types'

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'

export async function getShortAnswerFeedback(params: {
  items: Array<ShortAnswerQuestion & { userAnswer: string }>,
  apiKey?: string,
  userName?: string
}): Promise<{ evaluations: ShortAnswerEvalItem[], mock?: boolean }> {
  const { items, apiKey } = params

  // In production (GitHub Pages), call Gemini API directly
  // In development, use the proxy server
  if (import.meta.env.DEV) {
    const r = await fetch('/api/short-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, apiKey, userName: params.userName })
    })
    if (!r.ok) throw new Error('Failed to fetch feedback')
    return await r.json()
  }

  // Production: call Gemini directly
  if (!apiKey) {
    // Mock response when no API key
    const evaluations = items.map((it) => ({
      id: it.id,
      score: 0.7,
      verdict: 'partial' as const,
      strengths: ['Addresses main idea'],
      issues: ['Missing detail or example'],
      suggestions: ['Add a concrete example and define key term precisely']
    }))
    return { evaluations, mock: true }
  }

  const system = `You are a strict but helpful grader for Data Structures & Algorithms short answers in Java. Return ONLY valid JSON. Schema:
{
  "evaluations": [
    {
      "id": "string",
      "score": 0.0, // 0..1
      "verdict": "correct" | "partial" | "incorrect",
      "strengths": ["..."],
      "issues": ["..."],
      "suggestions": ["..."]
    }
  ]
}
Scoring: award partial credit when key ideas are present; be concise in bullets. Do not include any other text.`

  const cases = items.map((it, idx) => `Q${idx+1} id=${it.id}
PROMPT: ${it.prompt}
RUBRIC: ${it.rubric}
EXAMPLE_ANSWER: ${it.exampleAnswer}
USER_ANSWER: ${it.userAnswer}`).join('\n\n')

  const content = `${system}\n\nEvaluate the following ${items.length} answers and produce the JSON.\n\n${cases}`

  const body = {
    contents: [
      { role: 'user', parts: [{ text: content }] }
    ]
  }

  const url = `${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`
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

  // Try to parse JSON
  let parsed
  try { parsed = JSON.parse(text) } catch {
    const m = text.match(/\{[\s\S]*\}/)
    if (m) {
      try { parsed = JSON.parse(m[0]) } catch {}
    }
  }

  if (!parsed?.evaluations) {
    throw new Error('Invalid model output')
  }

  return parsed
}
