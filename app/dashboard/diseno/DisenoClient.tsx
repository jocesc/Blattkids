'use client'
import { useState } from 'react'
import type { BlattkidsResult, Design } from '@/types/blattkids'
import DesignInput from '@/components/DesignInput'
import ResultPanel from '@/components/ResultPanel'
import HistoryView from '@/components/HistoryView'
import ErrorBoundary from '@/components/ErrorBoundary'

interface Props {
  initialDesigns: Design[]
}

export default function DisenoClient({ initialDesigns }: Props) {
  const [idioma] = useState<'es' | 'en'>('es')
  const [view, setView] = useState<'new' | 'history'>('new')
  const [result, setResult] = useState<BlattkidsResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [designs, setDesigns] = useState<Design[]>(initialDesigns)
  const [exporting, setExporting] = useState(false)

  function handleResult(r: BlattkidsResult) {
    setResult(r)
    setErrorMsg(null)
    setDesigns(prev => [{
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
      user_id: '',
      prompt_text: '',
      result_json: r,
      idioma,
    }, ...prev])
  }

  function handleError(msg: string) {
    setErrorMsg(msg)
    setResult(null)
  }

  function handleSelectDesign(d: Design) {
    setResult(d.result_json)
    setView('new')
    setErrorMsg(null)
  }

  function handleDeleteDesign(id: string) {
    setDesigns(prev => prev.filter(d => d.id !== id))
  }

  async function handleExportPDF() {
    if (!result) return
    setExporting(true)
    try {
      const { exportToPDF } = await import('@/lib/exportPDF')
      await exportToPDF(result, '')
    } catch (e) {
      console.error('PDF export error', e)
    } finally {
      setExporting(false)
    }
  }

  async function handleExportDOCX() {
    if (!result) return
    setExporting(true)
    try {
      const { exportToDOCX } = await import('@/lib/exportDOCX')
      await exportToDOCX(result)
    } catch (e) {
      console.error('DOCX export error', e)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      {/* View toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setView('new'); setResult(null) }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            view === 'new'
              ? 'bg-ink text-white'
              : 'border border-border-bk text-ink-soft hover:border-wood'
          }`}
        >
          Nuevo diseño
        </button>
        <button
          onClick={() => setView('history')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            view === 'history'
              ? 'bg-ink text-white'
              : 'border border-border-bk text-ink-soft hover:border-wood'
          }`}
        >
          Historial ({designs.length})
        </button>
      </div>

      {view === 'history' ? (
        <HistoryView
          designs={designs}
          onSelect={handleSelectDesign}
          onDelete={handleDeleteDesign}
        />
      ) : (
        <>
          <DesignInput
            idioma={idioma}
            onResult={handleResult}
            onError={handleError}
          />

          {errorMsg && (
            <div className="mt-6 bg-white border border-orange-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤔</span>
                <div>
                  <p className="text-sm font-medium text-ink mb-1">
                    {errorMsg.startsWith('Para diseñar') || errorMsg.startsWith('La edad')
                      ? 'Necesito más información'
                      : errorMsg.includes('no está disponible')
                      ? 'Servicio no disponible'
                      : errorMsg.includes('conexión')
                      ? 'Error de conexión'
                      : 'Algo salió mal'}
                  </p>
                  <p className="text-sm text-ink-soft">{errorMsg}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-8">
              <ErrorBoundary>
                <ResultPanel
                  result={result}
                  onExportPDF={handleExportPDF}
                  onExportDOCX={handleExportDOCX}
                  exporting={exporting}
                />
              </ErrorBoundary>
            </div>
          )}
        </>
      )}
    </div>
  )
}
