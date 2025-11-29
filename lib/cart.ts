// Cart utility functions using localStorage

export interface CartItem {
  productSlug: string
  name: string
  shortName: string
  price: number
  quantity: number
  image: string | null
  selectedFrameId?: string | null
  selectedFrameName?: string | null
  selectedFrameImage?: string | null
  selectedMagnification?: string | null
  stripeProductId?: string | null
}

// Mapping function to get Stripe product ID based on product slug and magnification
export function getStripeProductId(productSlug: string, magnification: string | null): string | null {
  if (!magnification) return null
  
  const mapping: Record<string, string> = {
    // Galileo
    'galileo-2.5x': 'prod_TVL806L4Ly1eoH',
    'galileo-3.0x': 'prod_TVL8IrqBwfngHC',
    'galileo-3.5x': 'prod_TVL9qi1CvI4e9J',
    // Newton
    'newton-2.5x': 'prod_TVL9Gc1YlhDVWi',
    'newton-3.0x': 'prod_TVL9Fn3WKJOlsm',
    'newton-3.5x': 'prod_TVLAq23xnfOcsQ',
    // Apollo
    'apollo-3.0x': 'prod_TVLA5W9utgVVts',
    'apollo-4.0x': 'prod_TVLAKxUG6nJOqA',
    'apollo-5.0x': 'prod_TVLBUYvVZ9B7Fa',
    'apollo-6.0x': 'prod_TVLBJFerE3aooV',
    // Kepler
    'kepler-4.0x': 'prod_TVLCZCDc4Arsnq',
    'kepler-5.0x': 'prod_TVLCaJSk25Xrsb',
    'kepler-6.0x': 'prod_TVLCgzfP1ENcpN',
  }
  
  const key = `${productSlug}-${magnification}`
  return mapping[key] || null
}

const CART_STORAGE_KEY = 'heliosx_cart'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY)
    return cartData ? JSON.parse(cartData) : []
  } catch (error) {
    console.error('Error reading cart from localStorage:', error)
    return []
  }
}

export function addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }): CartItem[] {
  const cart = getCart()
  const existingItemIndex = cart.findIndex(i => i.productSlug === item.productSlug)
  
  if (existingItemIndex >= 0) {
    // Update quantity if item already exists
    cart[existingItemIndex].quantity += item.quantity || 1
  } else {
    // Add new item
    cart.push({
      ...item,
      quantity: item.quantity || 1,
    })
  }
  
  saveCart(cart)
  return cart
}

export function updateCartItemQuantity(productSlug: string, quantity: number): CartItem[] {
  const cart = getCart()
  const itemIndex = cart.findIndex(i => i.productSlug === productSlug)
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1)
    } else {
      cart[itemIndex].quantity = quantity
    }
    saveCart(cart)
  }
  
  return cart
}

export function removeFromCart(productSlug: string): CartItem[] {
  const cart = getCart()
  const filteredCart = cart.filter(i => i.productSlug !== productSlug)
  saveCart(filteredCart)
  return filteredCart
}

export function clearCart(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CART_STORAGE_KEY)
  // Dispatch custom event for cart updates
  window.dispatchEvent(new CustomEvent('cartUpdated'))
}

function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

export function getCartTotal(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
}

export function getCartItemCount(): number {
  const cart = getCart()
  return cart.reduce((count, item) => count + item.quantity, 0)
}

