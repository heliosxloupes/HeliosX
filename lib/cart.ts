export type CartItem = {
  productSlug: string
  name: string
  shortName?: string
  price: number
  quantity: number
  image: string | null
  selectedFrameId?: string | null
  selectedFrameName?: string | null
  selectedFrameImage?: string | null
  selectedMagnification?: string | null
  hasPrescriptionLenses?: boolean
  hasExtendedWarranty?: boolean
  stripeProductId?: string | null
}

const CART_STORAGE_KEY = 'heliosx_cart'

// Get cart from localStorage
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

// Save cart to localStorage
function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

// Get total number of items in cart
export function getCartItemCount(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.quantity, 0)
}

// Add item to cart
export function addToCart(item: CartItem): void {
  const cart = getCart()
  
  // Check if item already exists in cart
  const existingIndex = cart.findIndex(cartItem => 
    cartItem.productSlug === item.productSlug &&
    cartItem.selectedFrameId === item.selectedFrameId &&
    cartItem.selectedMagnification === item.selectedMagnification
  )
  
  if (existingIndex >= 0) {
    // Update quantity if item exists
    cart[existingIndex].quantity += item.quantity
  } else {
    // Add new item
    cart.push(item)
  }
  
  saveCart(cart)
}

// Update quantity of a cart item
export function updateCartItemQuantity(productSlug: string, quantity: number): void {
  const cart = getCart()
  const itemIndex = cart.findIndex(item => item.productSlug === productSlug)
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.splice(itemIndex, 1)
    } else {
      cart[itemIndex].quantity = quantity
    }
    saveCart(cart)
  }
}

// Remove item from cart
export function removeFromCart(productSlug: string): void {
  const cart = getCart()
  const filteredCart = cart.filter(item => item.productSlug !== productSlug)
  saveCart(filteredCart)
}

// Update add-on selections for all cart items
export function updateCartAddOns(hasPrescriptionLenses: boolean, hasExtendedWarranty: boolean): void {
  const cart = getCart()
  const updatedCart = cart.map(item => ({
    ...item,
    hasPrescriptionLenses,
    hasExtendedWarranty,
  }))
  saveCart(updatedCart)
}

// Clear entire cart
export function clearCart(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(CART_STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  } catch (error) {
    console.error('Error clearing cart:', error)
  }
}

// Get total price of cart
export function getCartTotal(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
}

// Get Stripe product ID based on product slug and magnification
export function getStripeProductId(slug: string, magnification: string | null): string | null {
  if (!magnification) return null
  
  // Map of product slugs and magnifications to Stripe product IDs
  // These would need to be configured based on your actual Stripe products
  const stripeProductMap: Record<string, Record<string, string>> = {
    galileo: {
      '2.5x': 'price_galileo_25x',
      '3.0x': 'price_galileo_30x',
      '3.5x': 'price_galileo_35x',
    },
    newton: {
      '2.5x': 'price_newton_25x',
      '3.0x': 'price_newton_30x',
      '3.5x': 'price_newton_35x',
    },
    apollo: {
      '2.5x': 'price_apollo_25x',
      '3.0x': 'price_apollo_30x',
      '3.5x': 'price_apollo_35x',
    },
    kepler: {
      '3.0x': 'price_kepler_30x',
      '3.5x': 'price_kepler_35x',
      '4.0x': 'price_kepler_40x',
      '4.5x': 'price_kepler_45x',
    },
  }
  
  const productMap = stripeProductMap[slug]
  if (!productMap || !magnification) return null
  
  return productMap[magnification] || null
}
