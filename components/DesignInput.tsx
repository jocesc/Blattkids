'use client'

import { useState } from 'react'
import type { BlattkidsResult } from '@/types/blattkids'

const CHIPS = [
  { emoji: '🛏', label: 'Cama' },
  { emoji: '📚', label: 'Estantería' },
  { emoji: '🪑', label: 'Silla + Mesa' },
  { emoji: '🏗', label: 'Torre' },
  { emoji: '🎨', label: 'Estación Arte' },
  { emoji: '👗', label: 'Armario Ropa' },
]

const AGE_RANGES = [
  { value: '0-1', label_es: '0 – 1 año', label_en: '0 – 1 year' },
  { value: '1-2', label_es: '1 – 2 años', label_en: '1 – 2 years' },
  { value: '2-3', label_es: '2 – 3 años', label_en: '2 – 3 years' },
  { value: '3-4', label_es: '3 – 4 años', label_en: '3 – 4 years' },
  { value: '4-5', label_es: '4 – 5 años', label_en: '4 – 5 years' },
  { value: '5-6', label_es: '5 – 6 años', label_en: '5 – 6 years' },
  { value: '6-7', label_es: '6 – 7 años', label_en: '6 – 7 years' },
  { value: '7-10', label_es: '7 – 10 años', label_en: '7 – 10 years' },
]

interface DesignInputProps {
  idioma: 'es' | 'en'
  onResult: (result: BlattkidsResult) => void
  onError: (msg: string) => void
}

export default function DesignInput({ idioma, onResult, onError }: DesignInputProps) {
  const [prompt, setPrompt] = useState('')
  const [age, setAge] = useState('')
  const [loading, setLoading] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [activeChip, setActiveChip] = useState<string | null>(null)

  const t = idioma === 'en'
    ? {
        title: 'Montessori Designer',
        subtitle: 'Describe the furniture you need — Blattkids does the rest',
        cardTitle: 'Describe your furniture',
        ageLabel: "Child's age",
        agePlaceholder: 'Select an age range',
        ageRequired: 'Age is required to calculate correct Montessori measurements.',
        placeholder: "E.g.: a shelf for books and art materials, in pine wood...",
        btn: 'Generate Complete Design',
        loading: 'Generating design...',
      }
    : {
        title: 'Diseñador Montessori',
        subtitle: 'Describe el mueble que necesitas — el resto lo hace Blattkids',
        cardTitle: 'Describe tu mueble',
        ageLabel: 'Edad del niño/a',
        agePlaceholder: 'Selecciona un rango de edad',
        ageRequired: 'La edad es obligatoria para calcular las medidas Montessori correctas.',
        placeholder: 'Ej: quiero una estantería para guardar libros y materiales de arte, en madera de pino...',
        btn: 'Generar Diseño Completo',
        loading: 'Generando diseño...',
      }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return
    if (!age) {
      onError(t.ageRequired)
      return
    }
    setLoading(true)
    setCharCount(0)
    const fullPrompt = `Edad del niño: ${age} años\n${prompt.trim()}`
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, idioma }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        onError(data.error || 'Error al generar el diseño')
        return
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buf = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const evt = JSON.parse(line.slice(6))
            if (evt.chunk) {
              setCharCount(c => c + (evt.chunk as string).length)
            } else if (evt.done && evt.result) {
              const result = evt.result
              if (result.estado === 'necesito_mas_informacion') {
                onError(result.pregunta || 'Necesito más información')
              } else {
                onResult(result)
              }
            } else if (evt.error) {
              onError(evt.error)
            }
          } catch {
            // ignore malformed events
          }
        }
      }
    } catch {
      onError('Error de conexión. Verifica que el servidor esté corriendo.')
    } finally {
      setLoading(false)
      setCharCount(0)
    }
  }

  function handleChipClick(label: string) {
    setActiveChip(label)
    const current = prompt.trim()
    const chipText = label.toLowerCase()
    if (!current.toLowerCase().includes(chipText)) {
      setPrompt(current ? `${current} (tipo: ${chipText})` : `Quiero un mueble tipo ${chipText}`)
    }
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[28px] font-bold text-ink leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {t.title}
          </h1>
          <p className="text-sm text-ink-soft opacity-70 mt-1">{t.subtitle}</p>
        </div>
      </div>

      {/* Wood accent */}
      <div className="h-[3px] rounded-full mb-6" style={{ background: 'linear-gradient(90deg, var(--color-wood), var(--color-sage))' }} />

      {/* Input card */}
      <div className="bg-white border border-border-bk rounded-2xl p-7">
        <p className="text-[12px] font-medium uppercase tracking-[1.2px] text-wood-dark mb-4">{t.cardTitle}</p>

        <form onSubmit={handleSubmit}>
          {/* Age selector — mandatory */}
          <div className="mb-4">
            <label className="block text-[12px] font-medium uppercase tracking-[1.2px] text-wood-dark mb-2">
              {t.ageLabel} <span className="text-red-400 normal-case tracking-normal">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AGE_RANGES.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setAge(r.value)}
                  className={`px-3.5 py-1.5 rounded-full text-sm transition-all ${
                    age === r.value
                      ? 'bg-wood border-[1.5px] border-wood text-white'
                      : 'border-[1.5px] border-border-bk text-ink-soft bg-white hover:border-wood hover:text-wood'
                  }`}
                >
                  {idioma === 'en' ? r.label_en : r.label_es}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={t.placeholder}
            rows={4}
            className="w-full border-[1.5px] border-border-bk rounded-xl p-4 text-[15px] text-ink bg-cream placeholder:text-ink-soft/40 outline-none focus:border-wood transition-colors resize-none leading-relaxed"
          />

          {/* Chips */}
          <div className="flex flex-wrap gap-2 mt-3.5">
            {CHIPS.map(c => (
              <button
                key={c.label}
                type="button"
                onClick={() => handleChipClick(c.label)}
                className={`px-3.5 py-1.5 rounded-full text-sm transition-all ${
                  activeChip === c.label
                    ? 'bg-wood border-[1.5px] border-wood text-white'
                    : 'border-[1.5px] border-border-bk text-ink-soft bg-white hover:border-wood hover:text-wood'
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !prompt.trim() || !age}
            className="mt-5 flex items-center gap-2.5 bg-ink text-white px-7 py-3.5 rounded-xl text-[15px] font-medium hover:bg-wood-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {loading
              ? charCount > 0
                ? `${t.loading} (${charCount.toLocaleString()} car.)`
                : t.loading
              : t.btn}
          </button>
        </form>
      </div>
    </div>
  )
}
