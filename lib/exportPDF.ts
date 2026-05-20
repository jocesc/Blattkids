'use client'

import type { BlattkidsResult } from '@/types/blattkids'

function clp(n: number) {
  return `$${n.toLocaleString('es-CL')} CLP`
}

export async function exportToPDF(result: BlattkidsResult, promptText: string) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W = 210
  const margin = 18
  const contentW = W - margin * 2
  let y = margin

  const colors = {
    ink: [44, 26, 14] as [number, number, number],
    wood: [200, 146, 74] as [number, number, number],
    sage: [122, 158, 126] as [number, number, number],
    light: [250, 246, 240] as [number, number, number],
    border: [226, 213, 195] as [number, number, number],
    success: [76, 175, 125] as [number, number, number],
    warn: [232, 168, 56] as [number, number, number],
  }

  function addPage() {
    doc.addPage()
    y = margin
  }

  function checkY(needed = 15) {
    if (y + needed > 280) addPage()
  }

  function sectionTitle(text: string) {
    checkY(12)
    doc.setFillColor(...colors.wood)
    doc.rect(margin, y, contentW, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text(text.toUpperCase(), margin + 4, y + 5.5)
    y += 12
    doc.setTextColor(...colors.ink)
  }

  function label(text: string, value: string, indent = 0) {
    checkY(7)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...colors.ink)
    doc.text(text + ':', margin + indent, y)
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(value, contentW - 40 - indent)
    doc.text(lines, margin + 40 + indent, y)
    y += lines.length * 5 + 2
  }

  function paragraph(text: string, indent = 0) {
    checkY(8)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...colors.ink)
    const lines = doc.splitTextToSize(text, contentW - indent)
    doc.text(lines, margin + indent, y)
    y += lines.length * 5 + 3
  }

  // ── HEADER ────────────────────────────────────────────────────
  doc.setFillColor(...colors.ink)
  doc.rect(0, 0, W, 22, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(200, 146, 74)
  doc.text('BLATTKIDS', margin, 14)
  doc.setFontSize(10)
  doc.setTextColor(200, 200, 200)
  doc.text('Diseñador Montessori', margin + 46, 14)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(new Date().toLocaleDateString('es-CL'), W - margin, 14, { align: 'right' })
  y = 30

  // Nombre mueble
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...colors.ink)
  doc.text(result.metadata.nombre_mueble, margin, y)
  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...colors.sage)
  doc.text(
    `${result.metadata.edad_rango} · ${result.metadata.etapa_montessori} · ${result.metadata.area_pedagogica}`,
    margin, y
  )
  y += 10

  // ── 1. FICHA PEDAGÓGICA ───────────────────────────────────────
  sectionTitle('1. Ficha Pedagógica')
  label('Qué desarrolla', result.ficha_pedagogica.que_desarrolla)
  label('Cómo lo usa', result.ficha_pedagogica.como_lo_usa_el_nino)
  y += 2
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Principios Montessori:', margin, y)
  y += 5
  result.ficha_pedagogica.principios_montessori.forEach(p => {
    checkY(6)
    doc.setFont('helvetica', 'normal')
    doc.text(`• ${p}`, margin + 4, y)
    y += 5
  })
  y += 3

  // ── 2. DIMENSIONES ────────────────────────────────────────────
  sectionTitle('2. Dimensiones y Diseño')
  const d = result.diseno.dimensiones_generales
  label('Dimensiones', `${d.alto_cm} cm alto × ${d.ancho_cm} cm ancho × ${d.profundidad_cm} cm profundo`)
  label('Descripción', result.diseno.descripcion_forma)
  label('Notas', result.diseno.notas_diseno)
  y += 3

  // ASCII vistas
  doc.setFont('courier', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...colors.ink)
  checkY(30)
  doc.text('VISTA FRONTAL:', margin, y)
  y += 4
  const frontLines = result.diseno.vista_frontal_ascii.split('\n')
  frontLines.forEach(line => {
    checkY(4)
    doc.text(line, margin, y)
    y += 3.5
  })
  y += 4

  doc.text('VISTA LATERAL:', margin, y)
  y += 4
  const sideLines = result.diseno.vista_lateral_ascii.split('\n')
  sideLines.forEach(line => {
    checkY(4)
    doc.text(line, margin, y)
    y += 3.5
  })
  y += 4
  doc.setFont('helvetica', 'normal')

  // ── 3. PIEZAS CNC ─────────────────────────────────────────────
  sectionTitle('3. Lista de Corte CNC')

  const pHeaders = ['N°', 'Pieza', 'Largo', 'Ancho', 'Esp.', 'Cant.', 'Material']
  const pWidths = [10, 48, 18, 18, 14, 14, 28]
  const rowH = 7

  // header row
  checkY(rowH + 4)
  doc.setFillColor(...colors.light)
  doc.rect(margin, y, contentW, rowH, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  let xc = margin + 2
  pHeaders.forEach((h, i) => {
    doc.text(h, xc, y + 5)
    xc += pWidths[i]
  })
  y += rowH

  doc.setFont('helvetica', 'normal')
  result.piezas_cnc.piezas.forEach((p, idx) => {
    checkY(rowH + 2)
    if (idx % 2 === 1) {
      doc.setFillColor(247, 243, 238)
      doc.rect(margin, y, contentW, rowH, 'F')
    }
    xc = margin + 2
    const row = [
      String(p.numero),
      p.nombre,
      `${p.largo_cm} cm`,
      `${p.ancho_cm} cm`,
      `${p.espesor_cm} cm`,
      String(p.cantidad),
      p.material,
    ]
    row.forEach((cell, i) => {
      doc.setFontSize(8)
      doc.setTextColor(...colors.ink)
      doc.text(String(cell).substring(0, 20), xc, y + 5)
      xc += pWidths[i]
    })
    y += rowH
  })
  y += 4

  label(
    'Planchas',
    `${result.piezas_cnc.numero_planchas} × ${result.piezas_cnc.plancha_estandar} · Aprovechamiento: ${result.piezas_cnc.aprovechamiento_porcentaje}%`
  )
  label('Ensamble', `${result.piezas_cnc.tipo_ensamble} · Tolerancia ${result.piezas_cnc.tolerancia_mm} mm`)

  y += 3
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Secuencia de ensamble:', margin, y)
  y += 5
  result.piezas_cnc.secuencia_ensamble.forEach((paso, i) => {
    checkY(6)
    doc.setFont('helvetica', 'normal')
    paragraph(`${i + 1}. ${paso}`)
  })

  const ac = result.piezas_cnc.acabado
  y += 3
  label('Acabado', `${ac.producto} · ${ac.aplicacion} · ${ac.manos} mano(s) · Secado: ${ac.tiempo_secado_horas}h`)
  y += 4

  // ── 4. SEGURIDAD ──────────────────────────────────────────────
  sectionTitle('4. Validación de Seguridad')

  const checks = [
    ['Acceso independiente', result.seguridad.validacion_montessori.acceso_sin_adulto, result.seguridad.validacion_montessori.acceso_sin_adulto_nota],
    ['Peso manejable', result.seguridad.validacion_montessori.peso_manejable, result.seguridad.validacion_montessori.peso_manejable_nota],
    ['Orden visual', result.seguridad.validacion_montessori.orden_visual, ''],
    ['Belleza humble', result.seguridad.validacion_montessori.belleza_humble, ''],
    ['Independencia progresiva', result.seguridad.validacion_montessori.independencia_progresiva, ''],
    ['Norma EN 71', result.seguridad.normas.en71_cumple, result.seguridad.normas.en71_nota],
    ['Norma ASTM F963', result.seguridad.normas.astm_f963_cumple, result.seguridad.normas.astm_f963_nota],
  ] as [string, boolean, string][]

  checks.forEach(([label2, ok, note]) => {
    checkY(7)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(ok ? colors.success[0] : colors.warn[0], ok ? colors.success[1] : colors.warn[1], ok ? colors.success[2] : colors.warn[2])
    doc.text(ok ? '✓' : '!', margin + 2, y)
    doc.setTextColor(...colors.ink)
    doc.text(label2, margin + 8, y)
    if (note) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(100, 80, 60)
      const nl = doc.splitTextToSize(note, contentW - 50)
      doc.text(nl, margin + 8, y + 4)
      y += nl.length * 4 + 4
    } else {
      y += 6
    }
  })

  if (result.seguridad.advertencias.length) {
    y += 3
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...colors.warn)
    doc.text('Advertencias:', margin, y)
    y += 5
    result.seguridad.advertencias.forEach(adv => {
      checkY(6)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(...colors.ink)
      paragraph(`⚠ ${adv}`)
    })
  }
  y += 4

  // ── 5. COSTOS ─────────────────────────────────────────────────
  sectionTitle('5. Costos y Precio de Venta')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Materiales', margin, y)
  y += 5
  result.costos_clp.materiales.forEach(m => {
    checkY(6)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(`${m.item} (${m.especificacion} · ${m.cantidad})`, margin + 3, y)
    doc.text(clp(m.total), W - margin, y, { align: 'right' })
    y += 5
  })
  doc.setFont('helvetica', 'bold')
  doc.text('Subtotal materiales', margin + 3, y)
  doc.text(clp(result.costos_clp.resumen.subtotal_materiales), W - margin, y, { align: 'right' })
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Fabricación', margin, y)
  y += 5
  result.costos_clp.fabricacion.forEach(f => {
    checkY(6)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(`${f.concepto} (${f.horas}h × ${clp(f.valor_hora)})`, margin + 3, y)
    doc.text(clp(f.total), W - margin, y, { align: 'right' })
    y += 5
  })
  doc.setFont('helvetica', 'bold')
  doc.text('Subtotal fabricación', margin + 3, y)
  doc.text(clp(result.costos_clp.resumen.subtotal_fabricacion), W - margin, y, { align: 'right' })
  y += 10

  // Price summary box
  checkY(28)
  doc.setFillColor(...colors.ink)
  doc.roundedRect(margin, y, contentW, 25, 3, 3, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(180, 180, 180)
  doc.text('Precio de venta sugerido', margin + 6, y + 8)
  doc.setFontSize(8)
  doc.text(
    `Costo producción ${clp(result.costos_clp.resumen.costo_total_produccion)} · Margen ${result.costos_clp.resumen.margen_porcentaje}%`,
    margin + 6, y + 14
  )
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(200, 146, 74)
  doc.text(clp(result.costos_clp.resumen.precio_venta_sugerido), W - margin - 4, y + 15, { align: 'right' })

  // save
  const filename = `Blattkids_${result.metadata.nombre_mueble.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}
