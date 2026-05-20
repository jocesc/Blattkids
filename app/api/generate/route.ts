import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/systemPrompt'
import { getSession } from '@/lib/session'
import { saveDesign } from '@/lib/supabase'
import { checkRateLimit } from '@/lib/rateLimit'

const ANTHROPIC_TIMEOUT_MS = 60_000

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { allowed } = checkRateLimit(session.userId)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Espera un minuto antes de generar otro diseño.' },
      { status: 429 }
    )
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey.startsWith('sk-ant-XXX')) {
    return NextResponse.json(
      { error: 'El servicio de diseño no está disponible en este momento. Por favor intenta más tarde o contacta a soporte.' },
      { status: 503 }
    )
  }

  const { prompt, idioma = 'es' } = await request.json()
  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'El texto de descripción es requerido' }, { status: 400 })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ANTHROPIC_TIMEOUT_MS)

  let claudeRes: Response
  try {
    claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2024-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        stream: true,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [
          {
            role: 'user',
            content: `Idioma: ${idioma}\nSolicitud: ${prompt}`,
          },
        ],
      }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json(
        { error: 'El servicio tardó demasiado en responder. Intenta de nuevo.' },
        { status: 504 }
      )
    }
    return NextResponse.json({ error: 'Error de conexión con el servicio de IA.' }, { status: 502 })
  }

  if (!claudeRes.ok) {
    clearTimeout(timeout)
    const err = await claudeRes.text()
    console.error('Anthropic API error:', claudeRes.status, err)
    return NextResponse.json(
      { error: 'Error al procesar tu solicitud. Intenta de nuevo.' },
      { status: 502 }
    )
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const stream = new ReadableStream({
    async start(ctrl) {
      clearTimeout(timeout)

      const reader = claudeRes.body!.getReader()
      let fullText = ''
      let buffer = ''

      function send(event: Record<string, unknown>) {
        ctrl.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (!raw || raw === '[DONE]') continue

            try {
              const evt = JSON.parse(raw)
              if (
                evt.type === 'content_block_delta' &&
                evt.delta?.type === 'text_delta'
              ) {
                const chunk = evt.delta.text as string
                fullText += chunk
                send({ chunk })
              }
            } catch {
              // ignore malformed SSE lines from Claude
            }
          }
        }

        let result
        try {
          result = JSON.parse(fullText)
        } catch {
          console.error('Claude JSON parse error. Raw:', fullText.slice(0, 500))
          send({ error: 'La IA respondió con un formato inesperado. Intenta de nuevo.' })
          ctrl.close()
          return
        }

        if (result.estado === 'completo') {
          await saveDesign({
            user_id: session.userId,
            prompt_text: prompt,
            result_json: result,
            idioma,
          })
        }

        send({ done: true, result })
      } catch (err) {
        console.error('Stream processing error:', err)
        send({ error: 'Error durante la generación. Intenta de nuevo.' })
      } finally {
        ctrl.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
