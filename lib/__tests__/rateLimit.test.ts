import { describe, it, expect, beforeEach, vi } from 'vitest'

// Reset module between tests so the Map starts fresh
beforeEach(() => {
  vi.resetModules()
})

describe('checkRateLimit', () => {
  it('allows the first request', async () => {
    const { checkRateLimit } = await import('../rateLimit')
    const result = checkRateLimit('user1')
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('allows up to 5 requests within the window', async () => {
    const { checkRateLimit } = await import('../rateLimit')
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit('user2').allowed).toBe(true)
    }
  })

  it('blocks the 6th request within the window', async () => {
    const { checkRateLimit } = await import('../rateLimit')
    for (let i = 0; i < 5; i++) checkRateLimit('user3')
    const result = checkRateLimit('user3')
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('isolates limits per userId', async () => {
    const { checkRateLimit } = await import('../rateLimit')
    for (let i = 0; i < 5; i++) checkRateLimit('userA')
    // userA is blocked, userB should still be allowed
    expect(checkRateLimit('userA').allowed).toBe(false)
    expect(checkRateLimit('userB').allowed).toBe(true)
  })

  it('allows requests again after the window expires', async () => {
    vi.useFakeTimers()
    const { checkRateLimit } = await import('../rateLimit')

    for (let i = 0; i < 5; i++) checkRateLimit('user4')
    expect(checkRateLimit('user4').allowed).toBe(false)

    // Advance past the 60-second window
    vi.advanceTimersByTime(61_000)

    expect(checkRateLimit('user4').allowed).toBe(true)
    vi.useRealTimers()
  })
})
