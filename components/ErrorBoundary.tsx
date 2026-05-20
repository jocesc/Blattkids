'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="mt-8 bg-white border border-orange-200 rounded-2xl p-7">
          <p className="text-sm font-medium text-ink mb-1">Error al mostrar el resultado</p>
          <p className="text-sm text-ink-soft mb-4">
            El diseño se generó correctamente pero hubo un error al mostrarlo.
            Puedes intentar generarlo de nuevo o exportarlo desde el historial.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-sm text-wood underline"
          >
            Intentar mostrar de nuevo
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
