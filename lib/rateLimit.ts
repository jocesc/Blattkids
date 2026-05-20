const requests = new Map<string, number[]>()

const WINDOW_MS = 60_000
const MAX_REQUESTS = 5

export function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const timestamps = (requests.get(userId) ?? []).filter(t => now - t < WINDOW_MS)

  if (timestamps.length >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  timestamps.push(now)
  requests.set(userId, timestamps)
  return { allowed: true, remaining: MAX_REQUESTS - timestamps.length }
}
