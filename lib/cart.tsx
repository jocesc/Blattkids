'use client'
import { createContext, useContext, useEffect, useReducer, useCallback } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartItem {
  slug: string
  name: string
  emoji: string
  priceNum: number      // precio base en CLP (sin IVA)
  ageRange: string
  quantity: number
  note?: string         // nota libre del comprador (edad, medida, color, etc.)
}

export interface CartState {
  items: CartItem[]
  open: boolean         // drawer/sidebar visible
}

type Action =
  | { type: 'ADD';    item: Omit<CartItem, 'quantity'>; qty?: number }
  | { type: 'REMOVE'; slug: string }
  | { type: 'SET_QTY'; slug: string; qty: number }
  | { type: 'SET_NOTE'; slug: string; note: string }
  | { type: 'CLEAR' }
  | { type: 'OPEN_DRAWER' }
  | { type: 'CLOSE_DRAWER' }
  | { type: 'HYDRATE'; items: CartItem[] }

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items }

    case 'ADD': {
      const existing = state.items.find(i => i.slug === action.item.slug)
      const addQty = action.qty ?? 1
      if (existing) {
        return {
          ...state,
          open: true,
          items: state.items.map(i =>
            i.slug === action.item.slug ? { ...i, quantity: i.quantity + addQty } : i
          ),
        }
      }
      return {
        ...state,
        open: true,
        items: [...state.items, { ...action.item, quantity: addQty }],
      }
    }

    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.slug !== action.slug) }

    case 'SET_QTY':
      if (action.qty < 1) return { ...state, items: state.items.filter(i => i.slug !== action.slug) }
      return {
        ...state,
        items: state.items.map(i => i.slug === action.slug ? { ...i, quantity: action.qty } : i),
      }

    case 'SET_NOTE':
      return {
        ...state,
        items: state.items.map(i => i.slug === action.slug ? { ...i, note: action.note } : i),
      }

    case 'CLEAR':
      return { ...state, items: [] }

    case 'OPEN_DRAWER':
      return { ...state, open: true }

    case 'CLOSE_DRAWER':
      return { ...state, open: false }

    default:
      return state
  }
}

// ─── Derived helpers ─────────────────────────────────────────────────────────

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce((s, i) => s + i.priceNum * i.quantity, 0)
  const iva = Math.round(subtotal * 0.19)
  const total = subtotal + iva
  const count = items.reduce((s, i) => s + i.quantity, 0)
  return { subtotal, iva, total, count }
}

export function fmtCLP(n: number) {
  return n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface CartCtx {
  items: CartItem[]
  open: boolean
  count: number
  subtotal: number
  iva: number
  total: number
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => void
  remove: (slug: string) => void
  setQty: (slug: string, qty: number) => void
  setNote: (slug: string, note: string) => void
  clear: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

const Ctx = createContext<CartCtx | null>(null)

const STORAGE_KEY = 'bk_cart_v1'

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], open: false })

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as CartItem[]
        if (Array.isArray(saved)) dispatch({ type: 'HYDRATE', items: saved })
      }
    } catch { /* ignore parse errors */ }
  }, [])

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch { /* ignore quota errors */ }
  }, [state.items])

  const { subtotal, iva, total, count } = cartTotals(state.items)

  const add      = useCallback((item: Omit<CartItem, 'quantity'>, qty?: number) => dispatch({ type: 'ADD', item, qty }), [])
  const remove   = useCallback((slug: string) => dispatch({ type: 'REMOVE', slug }), [])
  const setQty   = useCallback((slug: string, qty: number) => dispatch({ type: 'SET_QTY', slug, qty }), [])
  const setNote  = useCallback((slug: string, note: string) => dispatch({ type: 'SET_NOTE', slug, note }), [])
  const clear    = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const openDrawer  = useCallback(() => dispatch({ type: 'OPEN_DRAWER' }), [])
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [])

  return (
    <Ctx.Provider value={{
      items: state.items, open: state.open,
      count, subtotal, iva, total,
      add, remove, setQty, setNote, clear, openDrawer, closeDrawer,
    }}>
      {children}
    </Ctx.Provider>
  )
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
