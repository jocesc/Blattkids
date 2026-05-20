'use client'
import { useState, useEffect } from 'react'

// ── TIPOS ────────────────────────────────────────────────────────────────────
type Palette = {
  id: string; name: string; type: 'clasica' | 'ludica'
  bg: string; ink: string; muted: string; accent: string; accentDk: string; border: string
}
type Font = {
  id: string; name: string; type: 'clasica' | 'ludica'
  displayCss: string; bodyCss: string; gfonts: string | null
}

// ── PALETAS ──────────────────────────────────────────────────────────────────
const PALETTES: Palette[] = [
  // Clásicas
  { id:'ambar',      name:'Ámbar',      type:'clasica',
    bg:'#FAF6F0', ink:'#1A0F07', muted:'#5C4033', accent:'#C8924A', accentDk:'#8B5E2D', border:'#E2D5C3' },
  { id:'bosque',     name:'Bosque',     type:'clasica',
    bg:'#EEF3EB', ink:'#1B2E1F', muted:'#3D5C42', accent:'#B89040', accentDk:'#826A1A', border:'#C8D9C2' },
  { id:'nordica',    name:'Nórdica',    type:'clasica',
    bg:'#FFFFFF',  ink:'#141414', muted:'#555555', accent:'#D4724A', accentDk:'#A84E28', border:'#E5E5E5' },
  { id:'medianoche', name:'Medianoche', type:'clasica',
    bg:'#F2F5F8', ink:'#0F1C2E', muted:'#4A5D75', accent:'#C8924A', accentDk:'#8B5E2D', border:'#CDD8E3' },
  { id:'arcilla',    name:'Arcilla',    type:'clasica',
    bg:'#FBF7F3', ink:'#201A16', muted:'#6B4E40', accent:'#B86B52', accentDk:'#8B4535', border:'#E4D5C8' },
  // Lúdicas
  { id:'primavera',  name:'Primavera',  type:'ludica',
    bg:'#F2F8EE', ink:'#1C361A', muted:'#3D6638', accent:'#E87D3A', accentDk:'#B55A1C', border:'#BED9B4' },
  { id:'durazno',    name:'Durazno',    type:'ludica',
    bg:'#FFF7F3', ink:'#2B1510', muted:'#7A4035', accent:'#E07050', accentDk:'#A84F36', border:'#F4D5C5' },
  { id:'cielo',      name:'Cielo',      type:'ludica',
    bg:'#EFF5FD', ink:'#0C2040', muted:'#385A7A', accent:'#F5A623', accentDk:'#B87A10', border:'#C2D8EF' },
  { id:'frambuesa',  name:'Frambuesa',  type:'ludica',
    bg:'#FEF4F6', ink:'#280E18', muted:'#784050', accent:'#C83060', accentDk:'#96203F', border:'#F2CAD5' },
  { id:'menta',      name:'Menta',      type:'ludica',
    bg:'#F0F9F4', ink:'#0E2C1A', muted:'#2A6040', accent:'#D4724A', accentDk:'#A84E28', border:'#B5DCCA' },
]

// ── FUENTES ──────────────────────────────────────────────────────────────────
const FONTS: Font[] = [
  // Clásicas
  { id:'fraunces',  name:'Fraunces',  type:'clasica',
    displayCss:"'Fraunces', Georgia, serif",           bodyCss:"'Plus Jakarta Sans', sans-serif",
    gfonts: null },
  { id:'nunito',    name:'Nunito',    type:'clasica',
    displayCss:"'Nunito', sans-serif",                 bodyCss:"'Nunito Sans', sans-serif",
    gfonts:'https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,700;0,900;1,700&family=Nunito+Sans:wght@400;500;600;700&display=swap' },
  { id:'dm',        name:'DM Serif', type:'clasica',
    displayCss:"'DM Serif Display', Georgia, serif",   bodyCss:"'DM Sans', sans-serif",
    gfonts:'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;700&display=swap' },
  { id:'cormorant', name:'Cormorant', type:'clasica',
    displayCss:"'Cormorant Garamond', Georgia, serif",  bodyCss:"'Raleway', sans-serif",
    gfonts:'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400;1,700&family=Raleway:wght@400;500;600;700&display=swap' },
  { id:'playfair',  name:'Playfair',  type:'clasica',
    displayCss:"'Playfair Display', Georgia, serif",   bodyCss:"'Lato', sans-serif",
    gfonts:'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Lato:wght@300;400;700&display=swap' },
  // Lúdicas
  { id:'baloo',     name:'Baloo 2',   type:'ludica',
    displayCss:"'Baloo 2', sans-serif",                bodyCss:"'Nunito Sans', sans-serif",
    gfonts:'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&family=Nunito+Sans:wght@400;500;600;700&display=swap' },
  { id:'poppins',   name:'Poppins',   type:'ludica',
    displayCss:"'Poppins', sans-serif",                bodyCss:"'Poppins', sans-serif",
    gfonts:'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap' },
  { id:'quicksand', name:'Quicksand', type:'ludica',
    displayCss:"'Quicksand', sans-serif",              bodyCss:"'Nunito Sans', sans-serif",
    gfonts:'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700&display=swap' },
  { id:'comfortaa', name:'Comfortaa', type:'ludica',
    displayCss:"'Comfortaa', sans-serif",              bodyCss:"'Nunito', sans-serif",
    gfonts:'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&family=Nunito:wght@400;600;700;900&display=swap' },
  { id:'fredoka',   name:'Fredoka',   type:'ludica',
    displayCss:"'Fredoka', sans-serif",                bodyCss:"'Nunito Sans', sans-serif",
    gfonts:'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700&display=swap' },
]

// ── GENERADOR DE CSS ─────────────────────────────────────────────────────────
// Estrategia: sobreescribir variables CSS (@theme) + clases Tailwind con hex
// hardcodeado usando selectores de atributo [class~="..."] sin tocar los JSX.
function buildCSS(p: Palette, f: Font): string {
  return `
/* ── Blattkids Theme Panel ── */
:root {
  --color-cream:     ${p.bg};
  --color-ink:       ${p.ink};
  --color-ink-soft:  ${p.muted};
  --color-wood:      ${p.accent};
  --color-wood-dark: ${p.accentDk};
  --color-border-bk: ${p.border};
  --font-display:    ${f.displayCss};
  --font-sans:       ${f.bodyCss};
}
/* fuentes: aplicar directamente a html/body además de via variable */
html, body { font-family: ${f.bodyCss} !important; }
h1, h2, h3, h4, h5, h6 { font-family: ${f.displayCss} !important; }
[style*="var(--font-display)"] { font-family: ${f.displayCss} !important; }
/* ink / dark backgrounds */
[class~="text-[#1A0F07]"]                { color: ${p.ink} !important }
[class~="hover:text-[#1A0F07]"]:hover    { color: ${p.ink} !important }
[class~="bg-[#1A0F07]"]                  { background-color: ${p.ink} !important }
[class~="hover:bg-[#1A0F07]"]:hover      { background-color: ${p.ink} !important }
[class~="border-[#1A0F07]"]              { border-color: ${p.ink} !important }
/* muted */
[class~="text-[#5C4033]"]                { color: ${p.muted} !important }
[class~="hover:text-[#5C4033]"]:hover    { color: ${p.muted} !important }
[class~="bg-[#5C4033]"]                  { background-color: ${p.muted} !important }
[class~="hover:bg-[#5C4033]"]:hover      { background-color: ${p.muted} !important }
/* accent */
[class~="text-[#C8924A]"]                { color: ${p.accent} !important }
[class~="hover:text-[#C8924A]"]:hover    { color: ${p.accent} !important }
[class~="bg-[#C8924A]"]                  { background-color: ${p.accent} !important }
[class~="hover:bg-[#C8924A]"]:hover      { background-color: ${p.accent} !important }
[class~="border-[#C8924A]"]              { border-color: ${p.accent} !important }
[class~="hover:border-[#C8924A]"]:hover  { border-color: ${p.accent} !important }
/* accent dark */
[class~="text-[#8B5E2D]"]                { color: ${p.accentDk} !important }
[class~="hover:text-[#8B5E2D]"]:hover    { color: ${p.accentDk} !important }
[class~="bg-[#8B5E2D]"]                  { background-color: ${p.accentDk} !important }
[class~="hover:bg-[#8B5E2D]"]:hover      { background-color: ${p.accentDk} !important }
/* border */
[class~="border-[#E2D5C3]"]              { border-color: ${p.border} !important }
[class~="hover:border-[#E2D5C3]"]:hover  { border-color: ${p.border} !important }
/* border + opacity (hex 8-digit: 40% = 66, 60% = 99) */
[class~="border-[#C8924A]/40"]           { border-color: ${p.accent}66 !important }
[class~="hover:border-[#C8924A]/40"]:hover { border-color: ${p.accent}66 !important }
`.trim()
}

// ── COMPONENTE ───────────────────────────────────────────────────────────────
export default function ThemePanel() {
  const [open, setOpen]       = useState(false)
  const [palette, setPalette] = useState('ambar')
  const [font, setFont]       = useState('fraunces')

  // Carga una fuente Google si no está ya cargada
  function loadFont(f: Font) {
    if (!f.gfonts) return
    if (document.getElementById('bk-gf-' + f.id)) return
    const link = document.createElement('link')
    link.id = 'bk-gf-' + f.id
    link.rel = 'stylesheet'
    link.href = f.gfonts
    document.head.appendChild(link)
  }

  // Aplica paleta + fuente inyectando / reemplazando el <style id="bk-theme">
  function apply(pId: string, fId: string) {
    const p = PALETTES.find(x => x.id === pId)!
    const f = FONTS.find(x => x.id === fId)!
    loadFont(f)
    let el = document.getElementById('bk-theme') as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = 'bk-theme'
      document.head.appendChild(el)
    }
    el.textContent = buildCSS(p, f)
    localStorage.setItem('bk_p', pId)
    localStorage.setItem('bk_f', fId)
  }

  // Precarga todas las fuentes en segundo plano y restaura selección guardada
  useEffect(() => {
    FONTS.forEach(loadFont)
    const pId = localStorage.getItem('bk_p') || 'ambar'
    const fId = localStorage.getItem('bk_f') || 'fraunces'
    setPalette(pId)
    setFont(fId)
    if (pId !== 'ambar' || fId !== 'fraunces') apply(pId, fId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function selP(id: string) { setPalette(id); apply(id, font) }
  function selF(id: string) { setFont(id);    apply(palette, id) }
  function reset()          { setPalette('ambar'); setFont('fraunces'); apply('ambar','fraunces') }

  const activePalette = PALETTES.find(p => p.id === palette)!
  const activeFont    = FONTS.find(f => f.id === font)!

  const clasicasP = PALETTES.filter(p => p.type === 'clasica')
  const ludicasP  = PALETTES.filter(p => p.type === 'ludica')
  const clasicasF = FONTS.filter(f => f.type === 'clasica')
  const ludicasF  = FONTS.filter(f => f.type === 'ludica')

  // Panel usa estilos inline para no verse afectado por sus propios overrides
  const panel: React.CSSProperties = {
    position: 'absolute', bottom: 68, right: 0, width: 308,
    background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 18, padding: '18px 18px 14px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.65)',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: 12, color: 'white',
  }

  function swatchStyle(p: Palette): React.CSSProperties {
    const active = palette === p.id
    return {
      width: 32, height: 32, borderRadius: '50%',
      background: `linear-gradient(135deg, ${p.bg} 45%, ${p.accent} 45%)`,
      border: active ? '2px solid white' : '2px solid rgba(255,255,255,0.1)',
      boxShadow: active ? `0 0 0 2px ${p.accent}` : 'none',
      cursor: 'pointer', outline: 'none',
      transition: 'all 0.15s', flexShrink: 0,
    }
  }

  function fontBtnStyle(f: Font): React.CSSProperties {
    const active = font === f.id
    const isLudica = f.type === 'ludica'
    return {
      padding: '4px 10px', borderRadius: 7,
      fontFamily: f.displayCss, fontSize: 11.5,
      cursor: 'pointer', transition: 'all 0.15s',
      border: active
        ? `1px solid ${isLudica ? activePalette.accent : 'rgba(255,255,255,0.4)'}`
        : '1px solid rgba(255,255,255,0.07)',
      background: active
        ? (isLudica ? `${activePalette.accent}22` : 'rgba(255,255,255,0.12)')
        : 'rgba(255,255,255,0.04)',
      color: active
        ? (isLudica ? activePalette.accent : 'white')
        : 'rgba(255,255,255,0.45)',
    }
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 8.5, fontWeight: 700, letterSpacing: '2px',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
    marginBottom: 8, display: 'block',
  }
  const subLabelStyle = (color = 'rgba(255,255,255,0.18)'): React.CSSProperties => ({
    fontSize: 8, color, marginBottom: 6, display: 'block',
  })

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, userSelect: 'none' }}>

      {open && (
        <div style={panel}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <span style={labelStyle}>Preview de tema</span>
              <span style={{ fontSize: 10.5, color: activePalette.accent, fontWeight: 600 }}>
                {activePalette.name} · {activeFont.name}
              </span>
            </div>
            <button onClick={reset}
              style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer', padding: '3px 9px' }}>
              Reset
            </button>
          </div>

          {/* ── PALETAS ── */}
          <span style={labelStyle}>Paleta</span>

          <span style={subLabelStyle()}>Clásicas</span>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {clasicasP.map(p => (
              <button key={p.id} title={p.name} onClick={() => selP(p.id)} style={swatchStyle(p)} />
            ))}
          </div>

          <span style={subLabelStyle('#F5A623')}>Lúdicas</span>
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            {ludicasP.map(p => (
              <button key={p.id} title={p.name} onClick={() => selP(p.id)} style={swatchStyle(p)} />
            ))}
          </div>

          {/* divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 16 }} />

          {/* ── FUENTES ── */}
          <span style={labelStyle}>Tipografía</span>

          <span style={subLabelStyle()}>Clásicas</span>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
            {clasicasF.map(f => (
              <button key={f.id} onClick={() => selF(f.id)} style={fontBtnStyle(f)}>
                {f.name}
              </button>
            ))}
          </div>

          <span style={subLabelStyle('#F5A623')}>Lúdicas</span>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {ludicasF.map(f => (
              <button key={f.id} onClick={() => selF(f.id)} style={fontBtnStyle(f)}>
                {f.name}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 9, color: 'rgba(255,255,255,0.15)', textAlign: 'center' }}>
            Solo visible localmente · Blattkids preview
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button onClick={() => setOpen(o => !o)}
        style={{
          width: 52, height: 52, borderRadius: '50%',
          background: open ? activePalette.accent : '#2A2A2A',
          border: 'none', color: 'white', fontSize: 22,
          cursor: 'pointer', transition: 'all 0.2s',
          boxShadow: open
            ? `0 4px 20px ${activePalette.accent}80`
            : '0 4px 20px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        🎨
      </button>
    </div>
  )
}
