'use client'

import { useRef } from 'react'
import Image from 'next/image'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  name: string
  price: string
  image: string
  quantity: number
  onQuantityChange: (quantity: number) => void
}

export default function ProductCard({
  name,
  price,
  image,
  quantity,
  onQuantityChange,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const decreaseQuantity = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    onQuantityChange(quantity + 1)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const offsetX = (x - centerX) / 10
    const offsetY = (y - centerY) / 10
    
    cardRef.current.style.setProperty('--shadow-x', `${offsetX}px`)
    cardRef.current.style.setProperty('--shadow-y', `${offsetY}px`)
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.setProperty('--shadow-x', '0px')
    cardRef.current.style.setProperty('--shadow-y', '0px')
  }

  return (
    <div 
      ref={cardRef}
      className={styles.productCard}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.shadowLayer}></div>
      <div className={styles.productImageWrapper}>
        <Image
          src={image}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          className={styles.productImage}
        />
      </div>
      <div className={styles.productInfo}>
        <h2 className={styles.productName}>{name}</h2>
        <div className={styles.productPrice}>{price}</div>
        <div className={styles.quantitySelector}>
          <button 
            className={styles.quantityButton} 
            onClick={decreaseQuantity}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className={styles.quantityValue}>{quantity}</span>
          <button 
            className={styles.quantityButton} 
            onClick={increaseQuantity}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

