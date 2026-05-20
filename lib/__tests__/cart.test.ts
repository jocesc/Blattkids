import { describe, it, expect } from 'vitest'
import { cartTotals } from '../cart'

// ── cartTotals ────────────────────────────────────────────────────────────────

describe('cartTotals', () => {
  const base = { slug: 'a', name: 'Mesa', emoji: '🪑', priceNum: 100000, ageRange: '2-3' }

  it('returns zeros for empty cart', () => {
    expect(cartTotals([])).toEqual({ subtotal: 0, iva: 0, total: 0, count: 0 })
  })

  it('calculates subtotal, IVA 19%, and total correctly', () => {
    const result = cartTotals([{ ...base, quantity: 1 }])
    expect(result.subtotal).toBe(100000)
    expect(result.iva).toBe(19000)
    expect(result.total).toBe(119000)
    expect(result.count).toBe(1)
  })

  it('multiplies price by quantity', () => {
    const result = cartTotals([{ ...base, quantity: 3 }])
    expect(result.subtotal).toBe(300000)
    expect(result.count).toBe(3)
  })

  it('sums multiple items', () => {
    const items = [
      { ...base, slug: 'a', priceNum: 100000, quantity: 2 },
      { ...base, slug: 'b', priceNum: 50000,  quantity: 1 },
    ]
    const result = cartTotals(items)
    expect(result.subtotal).toBe(250000)
    expect(result.count).toBe(3)
  })

  it('rounds IVA to integer', () => {
    const result = cartTotals([{ ...base, priceNum: 1, quantity: 1 }])
    expect(Number.isInteger(result.iva)).toBe(true)
  })
})

// ── email validation (same regex used in checkout) ────────────────────────────

describe('email validation regex', () => {
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  it('accepts valid emails', () => {
    expect(emailOk('jose@blattkids.cl')).toBe(true)
    expect(emailOk('cliente+tag@empresa.com')).toBe(true)
    expect(emailOk('a@b.io')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(emailOk('')).toBe(false)
    expect(emailOk('noatsign')).toBe(false)
    expect(emailOk('@nodomain')).toBe(false)
    expect(emailOk('no@tld')).toBe(false)
    expect(emailOk('spaces @domain.com')).toBe(false)
  })
})
