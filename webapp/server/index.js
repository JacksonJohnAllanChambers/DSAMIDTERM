// Simple Express proxy for Gemini batch short-answer evaluation
// Requires: set environment variable GEMINI_API_KEY

import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const PORT = process.env.PORT || 8787
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'
const GEMINI_25_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

app.post('/api/short-feedback', async (req, res) => {
  try {
    const { items, userName, apiKey: bodyApiKey } = req.body || {}
    const apiKey = bodyApiKey || GEMINI_API_KEY
    // items: [{ id, prompt, rubric, exampleAnswer, userAnswer }]
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items provided' })
    console.log(`[short-feedback] items=${items.length} user=${userName || 'anon'} apiKeyProvided=${!!bodyApiKey} usingEnvKey=${!!GEMINI_API_KEY && !bodyApiKey}`)

    // Build a single prompt for batching
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

    if (!apiKey) {
      // Mock when key missing
      const evaluations = items.map((it) => ({
        id: it.id,
        score: 0.7,
        verdict: 'partial',
        strengths: ['Addresses main idea'],
        issues: ['Missing detail or example'],
        suggestions: ['Add a concrete example and define key term precisely']
      }))
      return res.json({ evaluations, mock: true })
    }

    const body = {
      contents: [
        { role: 'user', parts: [ { text: content } ] }
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
      return res.status(500).json({ error: 'Gemini API error', details: txt })
    }
    const data = await r.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Try to parse JSON
    let parsed
    try { parsed = JSON.parse(text) } catch {
      // Attempt to extract JSON block
      const m = text.match(/\{[\s\S]*\}/)
      if (m) {
        try { parsed = JSON.parse(m[0]) } catch {}
      }
    }
    if (!parsed?.evaluations) {
      return res.status(502).json({ error: 'Invalid model output', raw: text })
    }

    return res.json(parsed)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

// Long-answer single evaluation using Gemini 2.5 Flash
app.post('/api/long-feedback', async (req, res) => {
  try {
    const { item, userName, apiKey: bodyApiKey } = req.body || {}
    const apiKey = bodyApiKey || GEMINI_API_KEY
    if (!item) return res.status(400).json({ error: 'No item provided' })
    console.log(`[long-feedback] id=${item?.id} user=${userName || 'anon'} apiKeyProvided=${!!bodyApiKey} usingEnvKey=${!!GEMINI_API_KEY && !bodyApiKey}`)

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
}
`
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

    if (!apiKey) {
      return res.json({ evaluation: { id: item.id, score: 0.6, summary: 'Mock evaluation', strengths: ['Touches on key ideas'], issues: ['Missing detail/code correctness checks'], suggestions: ['Provide complexity, edge cases, and clearer formatting.'] }, mock: true })
    }

    const body = { contents: [{ role: 'user', parts: [{ text: partsText }] }] }
    const url = `${GEMINI_25_URL}?key=${encodeURIComponent(apiKey)}`
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!r.ok) {
      const txt = await r.text()
      return res.status(500).json({ error: 'Gemini API error (2.5)', details: txt })
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
      return res.json({ evaluation: { id: item.id, ...evalObj } })
    }
    // Fallback to raw text
    return res.json({ evaluation: { id: item.id, text }, mock: false })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Short Answer AI server listening on :${PORT}`)
})
