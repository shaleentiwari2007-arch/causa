import { findKnowledge } from '../data/knowledge'

const CACHE_KEY = 'causa.traces.v1'
const MAX_CACHED = 40

const readCache = () => {
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY)) || {}
  } catch {
    return {}
  }
}

const writeCache = (cache) => {
  try {
    const keys = Object.keys(cache)
    if (keys.length > MAX_CACHED) delete cache[keys[0]]
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    /* storage unavailable: skip caching */
  }
}

const keyFor = (query, domain) => `${domain || 'all'}::${query.trim().toLowerCase()}`

const ERROR_COPY = {
  rate_limited: 'Too many traces in a short time. Wait a few seconds and try again.',
  missing_api_key: 'The AI engine is not configured yet. Curated traces still work.',
  invalid_api_key: 'The AI engine rejected its credentials. Curated traces still work.',
  no_credits: 'The AI engine is out of credits. Curated traces still work.',
  overloaded: 'The AI engine is busy right now. Try again in a moment.',
  timeout: 'That trace took too long. Try again or pick a simpler topic.',
  network: 'Could not reach the CAUSA engine. Check your connection.',
}

/**
 * 1. curated chain (instant)  2. browser cache  3. AI engine (/api/trace)
 * Returns { status: 'ok' | 'offTopic' | 'error', ... }
 */
export async function requestTrace(query, domain = null, { signal } = {}) {
  const text = String(query || '').trim().slice(0, 120)

  if (text.length < 2) {
    return { status: 'error', message: 'Type at least two characters.' }
  }

  const curated = findKnowledge(text, domain)
  if (curated) {
    return { status: 'ok', result: { ...curated, source: 'curated', query: text } }
  }

  const cache = readCache()
  const cached = cache[keyFor(text, domain)]
  if (cached) return { status: 'ok', result: cached }

  let response

  try {
    response = await fetch('/api/trace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: text, domain }),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    return { status: 'error', message: ERROR_COPY.network }
  }

  let payload = null

  try {
    payload = await response.json()
  } catch {
    /* non-JSON response */
  }

  if (!response.ok || !payload) {
    return {
      status: 'error',
      message: ERROR_COPY[payload?.error] || 'The trace failed. Please try again.',
    }
  }

  if (payload.offTopic) return { status: 'offTopic', reason: payload.reason }

  const result = { ...payload, source: 'ai', query: text }
  cache[keyFor(text, domain)] = result
  writeCache(cache)

  return { status: 'ok', result }
}