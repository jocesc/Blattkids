'use client'

import type { BlattkidsResult } from '@/types/blattkids'

function clp(n: number) {
  return `$${n.toLocaleString('es-CL')} CLP`
}

export async function exportToDOCX(result: BlattkidsResult) {
  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    HeadingLevel, AlignmentType, WidthType, BorderStyle, ShadingType,
  } = await import('docx')

  const heading1 = (text: string) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })

  const heading2 = (text: string) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    })

  const para = (text: string, bold = false) =>
    new Paragraph({
      children: [new TextRun({ text, bold, size: 22 })],
      spacing: { after: 120 },
    })

  const labeledPara = (label: string, value: string) =>
    new Paragraph({
      children: [
        new TextRun({ text: label + ': ', bold: true, size: 22 }),
        new TextRun({ text: value, size: 22 }),
      ],
      spacing: { after: 100 },
    })

  const bullet = (text: string) =>
    new Paragraph({
      bullet: { level: 0 },
      children: [new TextRun({ text, size: 22 })],
      spacing: { after: 80 },
    })

  const tableHeaderCell = (text: string) =>
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18, color: '2C1A0E' })], alignment: AlignmentType.LEFT })],
      shading: { type: ShadingType.SOLID, color: 'FAF6F0' },
    })

  const tableCell = (text: string) =>
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, size: 18 })], alignment: AlignmentType.LEFT })],
    })

  const d = result.diseno.dimensiones_generales
  const res = result.costos_clp.resumen

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            children: [new TextRun({ text: 'BLATTKIDS', bold: true, size: 48, color: 'C8924A' })],
            alignment: AlignmentType.LEFT,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: result.metadata.nombre_mueble, bold: true, size: 36, color: '2C1A0E' })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({
              text: `${result.metadata.edad_rango} · ${result.metadata.etapa_montessori} · ${result.metadata.area_pedagogica} · ${new Date().toLocaleDateString('es-CL')}`,
              size: 20, color: '7A9E7E',
            })],
            spacing: { after: 400 },
          }),

          // 1. Ficha Pedagógica
          heading1('1. Ficha Pedagógica'),
          labeledPara('Qué desarrolla', result.ficha_pedagogica.que_desarrolla),
          labeledPara('Cómo lo usa el niño', result.ficha_pedagogica.como_lo_usa_el_nino),
          para('Principios Montessori:', true),
          ...result.ficha_pedagogica.principios_montessori.map(p => bullet(p)),
          para('Beneficios observables:', true),
          ...result.ficha_pedagogica.beneficios_observables.map(b => bullet(b)),

          // 2. Dimensiones
          heading1('2. Dimensiones y Diseño'),
          labeledPara('Dimensiones generales', `${d.alto_cm} cm alto × ${d.ancho_cm} cm ancho × ${d.profundidad_cm} cm profundo`),
          labeledPara('Descripción', result.diseno.descripcion_forma),
          labeledPara('Notas de diseño', result.diseno.notas_diseno),
          para('Vista frontal:'),
          new Paragraph({
            children: [new TextRun({ text: result.diseno.vista_frontal_ascii, font: 'Courier New', size: 16 })],
            spacing: { after: 200 },
          }),
          para('Vista lateral:'),
          new Paragraph({
            children: [new TextRun({ text: result.diseno.vista_lateral_ascii, font: 'Courier New', size: 16 })],
            spacing: { after: 300 },
          }),

          // 3. Piezas CNC
          heading1('3. Lista de Corte CNC'),
          labeledPara('Planchas', `${result.piezas_cnc.numero_planchas} × ${result.piezas_cnc.plancha_estandar} · Aprovechamiento: ${result.piezas_cnc.aprovechamiento_porcentaje}%`),
          labeledPara('Ensamble', `${result.piezas_cnc.tipo_ensamble} · Tolerancia: ${result.piezas_cnc.tolerancia_mm} mm`),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: ['N°', 'Pieza', 'Largo', 'Ancho', 'Espesor', 'Cant.', 'Material'].map(tableHeaderCell),
              }),
              ...result.piezas_cnc.piezas.map(p =>
                new TableRow({
                  children: [
                    tableCell(String(p.numero)),
                    tableCell(p.nombre),
                    tableCell(`${p.largo_cm} cm`),
                    tableCell(`${p.ancho_cm} cm`),
                    tableCell(`${p.espesor_cm} cm`),
                    tableCell(String(p.cantidad)),
                    tableCell(p.material),
                  ],
                })
              ),
            ],
          }),
          new Paragraph({ spacing: { after: 200 } }),
          heading2('Secuencia de ensamble'),
          ...result.piezas_cnc.secuencia_ensamble.map((paso, i) => bullet(`${i + 1}. ${paso}`)),
          heading2('Acabado'),
          labeledPara('Producto', result.piezas_cnc.acabado.producto),
          labeledPara('Aplicación', result.piezas_cnc.acabado.aplicacion),
          labeledPara('Manos', String(result.piezas_cnc.acabado.manos)),
          labeledPara('Tiempo de secado', `${result.piezas_cnc.acabado.tiempo_secado_horas} horas`),

          // 4. Seguridad
          heading1('4. Validación de Seguridad'),
          labeledPara('Acceso sin adulto', result.seguridad.validacion_montessori.acceso_sin_adulto ? `✓ ${result.seguridad.validacion_montessori.acceso_sin_adulto_nota}` : `✗ ${result.seguridad.validacion_montessori.acceso_sin_adulto_nota}`),
          labeledPara('Peso manejable', result.seguridad.validacion_montessori.peso_manejable ? `✓ ${result.seguridad.validacion_montessori.peso_manejable_nota}` : `✗ ${result.seguridad.validacion_montessori.peso_manejable_nota}`),
          labeledPara('Norma EN 71', result.seguridad.normas.en71_cumple ? `✓ ${result.seguridad.normas.en71_nota}` : `✗ ${result.seguridad.normas.en71_nota}`),
          labeledPara('Norma ASTM F963', result.seguridad.normas.astm_f963_cumple ? `✓ ${result.seguridad.normas.astm_f963_nota}` : `✗ ${result.seguridad.normas.astm_f963_nota}`),
          labeledPara('Material certificado', result.seguridad.normas.material_certificado),
          labeledPara('Cantos', `Radio ${result.seguridad.normas.cantos_radio_mm} mm`),
          para('Advertencias:', true),
          ...result.seguridad.advertencias.map(a => bullet(`⚠ ${a}`)),

          // 5. Costos
          heading1('5. Costos y Precio de Venta'),
          heading2('Materiales'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: ['Item', 'Especificación', 'Cantidad', 'P. Unitario', 'Total'].map(tableHeaderCell),
              }),
              ...result.costos_clp.materiales.map(m =>
                new TableRow({
                  children: [
                    tableCell(m.item),
                    tableCell(m.especificacion),
                    tableCell(m.cantidad),
                    tableCell(clp(m.precio_unitario)),
                    tableCell(clp(m.total)),
                  ],
                })
              ),
            ],
          }),
          new Paragraph({ spacing: { after: 200 } }),
          heading2('Fabricación'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: ['Concepto', 'Horas', 'Valor/hora', 'Total'].map(tableHeaderCell),
              }),
              ...result.costos_clp.fabricacion.map(f =>
                new TableRow({
                  children: [
                    tableCell(f.concepto),
                    tableCell(String(f.horas)),
                    tableCell(clp(f.valor_hora)),
                    tableCell(clp(f.total)),
                  ],
                })
              ),
            ],
          }),
          new Paragraph({ spacing: { after: 300 } }),
          heading2('Resumen'),
          labeledPara('Subtotal materiales', clp(res.subtotal_materiales)),
          labeledPara('Subtotal fabricación', clp(res.subtotal_fabricacion)),
          labeledPara('Costo total producción', clp(res.costo_total_produccion)),
          labeledPara('Margen', `${res.margen_porcentaje}%`),
          new Paragraph({
            children: [
              new TextRun({ text: 'PRECIO DE VENTA SUGERIDO: ', bold: true, size: 28, color: 'C8924A' }),
              new TextRun({ text: clp(res.precio_venta_sugerido), bold: true, size: 28, color: '2C1A0E' }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          para(result.costos_clp.nota_precios),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Blattkids_${result.metadata.nombre_mueble.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.docx`
  a.click()
  URL.revokeObjectURL(url)
}
