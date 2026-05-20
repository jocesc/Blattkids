export interface BlattkidsResult {
  estado: 'completo' | 'necesito_mas_informacion'
  pregunta?: string

  metadata: {
    nombre_mueble: string
    edad_rango: string
    etapa_montessori: string
    area_pedagogica: string
    material_principal: string
    idioma: 'es' | 'en'
  }

  ficha_pedagogica: {
    que_desarrolla: string
    como_lo_usa_el_nino: string
    principios_montessori: string[]
    beneficios_observables: string[]
  }

  diseno: {
    descripcion_forma: string
    dimensiones_generales: {
      alto_cm: number
      ancho_cm: number
      profundidad_cm: number
    }
    vista_frontal_ascii: string
    vista_lateral_ascii: string
    notas_diseno: string
  }

  piezas_cnc: {
    plancha_estandar: string
    numero_planchas: number
    aprovechamiento_porcentaje: number
    tipo_ensamble: string
    tolerancia_mm: number
    piezas: Array<{
      numero: number
      nombre: string
      largo_cm: number
      ancho_cm: number
      espesor_cm: number
      cantidad: number
      material: string
      peso_kg: number
      notas: string
    }>
    secuencia_ensamble: string[]
    acabado: {
      producto: string
      aplicacion: string
      manos: number
      tiempo_secado_horas: number
    }
  }

  seguridad: {
    validacion_montessori: {
      acceso_sin_adulto: boolean
      acceso_sin_adulto_nota: string
      peso_manejable: boolean
      peso_manejable_nota: string
      orden_visual: boolean
      belleza_humble: boolean
      independencia_progresiva: boolean
    }
    normas: {
      en71_cumple: boolean
      en71_nota: string
      astm_f963_cumple: boolean
      astm_f963_nota: string
      material_certificado: string
      cantos_radio_mm: number
    }
    advertencias: string[]
  }

  costos_clp: {
    materiales: Array<{
      item: string
      especificacion: string
      cantidad: string
      precio_unitario: number
      total: number
    }>
    fabricacion: Array<{
      concepto: string
      horas: number
      valor_hora: number
      total: number
    }>
    resumen: {
      subtotal_materiales: number
      subtotal_fabricacion: number
      costo_total_produccion: number
      margen_porcentaje: number
      precio_venta_sugerido: number
      precio_minimo_sin_ganancia: number
    }
    nota_precios: string
  }
}

export interface Design {
  id: string
  created_at: string
  user_id: string
  prompt_text: string
  result_json: BlattkidsResult
  idioma: 'es' | 'en'
}

export type TabName = 'pedagogia' | 'planos' | 'piezas' | 'seguridad' | 'costos'
