'use client'
import { useState } from 'react'
import { useCart } from '@/lib/cart'
import type { Product } from '@/lib/products'

export default function AddToCartButton({ product }: { product: Product }) {
  const { add, items } = useCart()
  const [added, setAdded] = useState(false)
  const inCart = items.some(i => i.slug === product.slug)

  function handleAdd() {
    add({
      slug:     product.slug,
      name:     product.name,
      emoji:    product.emoji,
      priceNum: product.priceNum,
      ageRange: product.ageRange,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className={`block w-full py-4 rounded-xl font-medium text-base transition-all ${
        added
          ? 'bg-[#7A9E7E] text-white'
          : inCart
          ? 'bg-[#2C1A0E] text-white hover:bg-[#8B5E2D]'
          : 'bg-[#C8924A] text-white hover:bg-[#8B5E2D]'
      }`}
    >
      {added
        ? '✓ Agregado al carrito'
        : inCart
        ? 'Agregar otra unidad'
        : 'Agregar al carrito'}
    </button>
  )
}
