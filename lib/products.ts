export interface Product {
  slug: string
  name: string
  tagline: string
  ageRange: string
  ageMin: number
  ageMax: number
  category: 'cama' | 'estanteria' | 'mesa-silla' | 'torre' | 'armario' | 'arte'
  price: string        // display string, e.g. "Desde $95.000"
  priceNum: number     // base price in CLP for cart/checkout
  emoji: string
  color: string
  description: string
  features: string[]
  dimensions: string
  material: string
  featured: boolean
  stock?: number       // undefined = made-to-order (always available)
}

export const products: Product[] = [
  {
    slug: 'estanteria-montessori-pino',
    name: 'Estantería Montessori',
    tagline: 'Acceso independiente a libros y materiales',
    ageRange: '1 – 6 años',
    ageMin: 1, ageMax: 6,
    category: 'estanteria',
    price: 'Desde $95.000',
    priceNum: 95000,
    emoji: '📚',
    color: '#E8C99A',
    description: 'Estantería de baja altura diseñada para que el niño acceda de forma autónoma a sus libros y materiales de trabajo. Proporciones calculadas según antropometría Montessori certificada.',
    features: ['Altura adaptada a cada rango de edad', 'Pino macizo tratado con cera de abeja', 'Sin bordes filosos — cantos redondeados 4mm', 'Estable por diseño (base ancha)'],
    dimensions: 'Alto 60–90 cm · Ancho 80 cm · Prof. 20 cm',
    material: 'Pino macizo o tablero abedul E0',
    featured: true,
  },
  {
    slug: 'cama-piso-montessori',
    name: 'Cama Piso Montessori',
    tagline: 'El primer espacio propio del niño',
    ageRange: '0 – 3 años',
    ageMin: 0, ageMax: 3,
    category: 'cama',
    price: 'Desde $120.000',
    priceNum: 120000,
    emoji: '🛏',
    color: '#B8D4BB',
    description: 'La cama piso permite al bebé y al niño pequeño acceder y salir de su cama de forma independiente, favoreciendo la autonomía desde los primeros meses de vida.',
    features: ['Nivel del suelo — sin riesgo de caídas', 'Madera natural sin pintura', 'Compatible con colchón estándar 60×120 cm', 'Diseño limpio, sin elementos decorativos superfluos'],
    dimensions: 'Largo 130 cm · Ancho 70 cm · Alto 12 cm',
    material: 'Pino macizo tratado con aceite de linaza',
    featured: true,
  },
  {
    slug: 'torre-aprendizaje',
    name: 'Torre de Aprendizaje',
    tagline: 'Participa en la cocina con seguridad',
    ageRange: '18 meses – 6 años',
    ageMin: 1, ageMax: 6,
    category: 'torre',
    price: 'Desde $110.000',
    priceNum: 110000,
    emoji: '🏗',
    color: '#C8924A',
    description: 'La torre de aprendizaje eleva al niño hasta la altura de la mesada para que participe activamente en actividades de cocina y vida práctica, siempre de forma segura.',
    features: ['Barandas de seguridad perimetrales', 'Altura regulable en 3 posiciones', 'Base extra ancha para máxima estabilidad', 'Pino macizo certificado E0'],
    dimensions: 'Alto 85 cm · Base 50×50 cm',
    material: 'Pino macizo tratado con cera de abeja',
    featured: true,
  },
  {
    slug: 'mesa-silla-montessori',
    name: 'Mesa + Silla Montessori',
    tagline: 'Proporciones exactas para trabajar cómodo',
    ageRange: '1 – 10 años',
    ageMin: 1, ageMax: 10,
    category: 'mesa-silla',
    price: 'Desde $85.000',
    priceNum: 85000,
    emoji: '🪑',
    color: '#7A9E7E',
    description: 'Conjunto de mesa y silla con medidas calculadas según la tabla antropométrica Montessori: la altura de la mesa corresponde al codo del niño sentado +7 cm.',
    features: ['Medidas validadas por tabla Montessori certificada', 'Cantos redondeados en toda la pieza', 'Diseño minimalista — sin distracciones visuales', 'Disponible para cada rango de edad (1–10 años)'],
    dimensions: 'Mesa 40–60 cm alto · Silla 18–35 cm asiento',
    material: 'Pino macizo o MDF E0',
    featured: false,
  },
  {
    slug: 'estacion-arte',
    name: 'Estación de Arte',
    tagline: 'Un lugar para crear con orden y belleza',
    ageRange: '2 – 8 años',
    ageMin: 2, ageMax: 8,
    category: 'arte',
    price: 'Desde $75.000',
    priceNum: 75000,
    emoji: '🎨',
    color: '#E8C99A',
    description: 'Mesa inclinada con superficie de trabajo, porta-lápices integrado y espacio para materiales. Invita al orden natural y la creatividad enfocada.',
    features: ['Superficie inclinada 15° — ideal para dibujo', 'Porta-lápices y organizadores integrados', 'Madera natural — sin plásticos', 'Tamaño de trabajo cómodo para el niño'],
    dimensions: 'Alto 55 cm · Ancho 60 cm · Prof. 45 cm',
    material: 'Pino macizo o tablero abedul E0',
    featured: false,
  },
  {
    slug: 'armario-montessori',
    name: 'Armario Ropa Montessori',
    tagline: 'El niño elige y guarda su ropa solo',
    ageRange: '18 meses – 6 años',
    ageMin: 1, ageMax: 6,
    category: 'armario',
    price: 'Desde $130.000',
    priceNum: 130000,
    emoji: '👗',
    color: '#B8D4BB',
    description: 'Armario de baja altura con barra colgadora accesible, cajones y espacio abierto. Diseñado para que el niño gestione su ropa de manera completamente autónoma.',
    features: ['Barra colgadora a altura del niño', 'Cajones deslizantes sin tirador — empuje suave', 'Espejo en la puerta a altura apropiada', 'Sin elementos decorativos — líneas puras'],
    dimensions: 'Alto 110 cm · Ancho 80 cm · Prof. 45 cm',
    material: 'Tablero abedul E0 tratado con cera de abeja',
    featured: false,
  },
]

export const categories = [
  { value: 'all', label: 'Todos' },
  { value: 'cama', label: 'Camas' },
  { value: 'estanteria', label: 'Estanterías' },
  { value: 'mesa-silla', label: 'Mesas y Sillas' },
  { value: 'torre', label: 'Torres' },
  { value: 'armario', label: 'Armarios' },
  { value: 'arte', label: 'Arte' },
]

export const ageFilters = [
  { value: 'all', label: 'Todas las edades' },
  { value: '0-2', label: '0 – 2 años', min: 0, max: 2 },
  { value: '2-4', label: '2 – 4 años', min: 2, max: 4 },
  { value: '4-6', label: '4 – 6 años', min: 4, max: 6 },
  { value: '6-10', label: '6 – 10 años', min: 6, max: 10 },
]
