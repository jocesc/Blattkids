'use client'

import { useState } from 'react'
import type { BlattkidsResult, Design } from '@/types/blattkids'
import NavBar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import DesignInput from '@/components/DesignInput'
import ResultPanel from '@/components/ResultPanel'
import HistoryView from '@/components/HistoryView'

interface Props {
  displayName: string
  initialDesigns: Design[]
}

export default function DashboardClient({ displayName, initialDesigns }: Props) {
  const [idioma, setIdioma] = useState<'es' | 'en'>('es')
  const [view, setView] = useState<'new' | 'history'>('new')
  const [result, setResult] = useState<BlattkidsResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [designs, setDesigns] = useState<Design[]>(initialDesigns)
  const [exporting, setExporting] = useState(false)

  function handleResult(r: BlattkidsResult) {
    setResult(r)
    setErrorMsg(null)
    // Optimistically add to local designs list (Supabase saves on the server)
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
    <div className="flex flex-col h-full">
      <NavBar
        displayName={displayName}
        idioma={idioma}
        onIdiomaChange={setIdioma}
      />

      <div className="flex flex-1 min-h-0">
        <Sidebar
          view={view}
          onViewChange={v => { setView(v); if (v === 'new') setResult(null) }}
          recentDesigns={designs}
          onSelectDesign={handleSelectDesign}
        />

        <main className="flex-1 overflow-y-auto p-8">
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

              {/* Error message */}
              {errorMsg && (
                <div className="mt-6 bg-white border border-orange-200 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🤔</span>
                    <div>
                      <p className="text-sm font-medium text-ink mb-1">
                        {errorMsg.startsWith('Para diseñar') || errorMsg.startsWith('Age is') || errorMsg.startsWith('La edad')
                          ? 'Necesito más información'
                          : errorMsg.includes('no está disponible') || errorMsg.includes('not available')
                          ? 'Servicio no disponible'
                          : errorMsg.includes('conexión') || errorMsg.includes('connection')
                          ? 'Error de conexión'
                          : 'Algo salió mal'}
                      </p>
                      <p className="text-sm text-ink-soft">{errorMsg}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Result */}
              {result && (
                <div className="mt-8">
                  <ResultPanel
                    result={result}
                    onExportPDF={handleExportPDF}
                    onExportDOCX={handleExportDOCX}
                    exporting={exporting}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
