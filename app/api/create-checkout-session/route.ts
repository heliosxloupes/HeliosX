import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51SV0NsLQ1qA2EZ9RmR1DPwnqHMb92UNhzLIkq3U7eUEwbxJMZSVXSa26hhsnbgo5aCyKHrXYJiEVUQoAKJW8WPNf00GK2SjsiI', {
  apiVersion: '2025-11-17.clover',
})

// Product ID mapping
const productIdMap: Record<string, string> = {
  'galileo': 'prod_TRvB25KsrmZlBd',
  'apollo': 'prod_TRvCDmk391koM1',
  'kepler': 'prod_TRvCPJumJ9dEni',
  'newton': 'prod_TRvCAmr84ybszC',
}

// Add-on product IDs
const ADDON_PRODUCT_IDS = {
  prescriptionLenses: 'prod_TX171vMUMm8Rgd',
  extendedWarranty: 'prod_TX17JE6jXQ4OOJ',
}

// Product price mapping (in cents)
const productPriceMap: Record<string, number> = {
  'galileo': 49900, // $499.00
  'apollo': 59900,  // $599.00
  'kepler': 54900,  // $549.00
  'newton': 44900,  // $449.00
}

// Product name mapping
const productNameMap: Record<string, string> = {
  'galileo': 'Galileo Surgical Loupes',
  'apollo': 'Apollo Surgical Loupes',
  'kepler': 'Kepler Surgical Loupes',
  'newton': 'Newton Surgical Loupes',
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems, productSlug, quantity = 1 } = await req.json()

    // Map product slugs to image paths
    const productImagePaths: Record<string, string> = {
      'galileo': '/Galileo/GalileoMain2.png',
      'apollo': '/Apollo/Apollofinal.png',
      'kepler': '/Keppler/Kfinal.jpg',
      'newton': '/Newton/NewtonMain.png',
    }

    // Get the base URL for images
    const baseUrl = req.nextUrl.origin

    // If cartItems is provided, use it; otherwise fall back to single product
    let itemsToProcess: Array<{ productSlug: string; quantity: number; price: number; stripeProductId?: string | null; selectedMagnification?: string | null; hasPrescriptionLenses?: boolean; hasExtendedWarranty?: boolean }> = []
    
    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      console.log('Processing cart items:', cartItems.length)
      itemsToProcess = cartItems.map((item: any) => {
        console.log('Cart item:', item.productSlug, item.quantity, item.stripeProductId, item.selectedMagnification, item.hasPrescriptionLenses, item.hasExtendedWarranty)
        return {
          productSlug: item.productSlug,
          quantity: item.quantity,
          price: item.price,
          stripeProductId: item.stripeProductId || null,
          selectedMagnification: item.selectedMagnification || null,
          hasPrescriptionLenses: item.hasPrescriptionLenses || false,
          hasExtendedWarranty: item.hasExtendedWarranty || false,
        }
      })
      console.log('Items to process:', itemsToProcess.length)
    } else if (productSlug && productIdMap[productSlug]) {
      itemsToProcess = [{
        productSlug,
        quantity,
        price: productPriceMap[productSlug] / 100, // Convert from cents
        stripeProductId: null,
        selectedMagnification: null,
        hasPrescriptionLenses: false,
        hasExtendedWarranty: false,
      }]
    } else {
      return NextResponse.json(
        { error: 'Invalid request: no cart items or product slug provided' },
        { status: 400 }
      )
    }

    // Build line items for Stripe
    // Each cart item should create TWO line items:
    // 1. The base product (Galileo, Newton, etc.)
    // 2. The magnification product (2.5x, 3.0x, etc.) if selected
    console.log('Building line items for', itemsToProcess.length, 'items')
    console.log('Items to process:', JSON.stringify(itemsToProcess, null, 2))
    const lineItems: any[] = []
    
    for (const item of itemsToProcess) {
      console.log('Processing item:', item.productSlug, item.quantity, 'stripeProductId:', item.stripeProductId, 'selectedMagnification:', item.selectedMagnification)
      const priceInCents = productPriceMap[item.productSlug] || (item.price * 100)
      const baseProductName = productNameMap[item.productSlug] || `${item.productSlug} Surgical Loupes`
      const imagePath = productImagePaths[item.productSlug] || '/Galileo/GalileoMain2.png'
      
      // 1. Add the base product line item
      const baseProductId = productIdMap[item.productSlug]
      if (baseProductId) {
        try {
          const baseProduct = await stripe.products.retrieve(baseProductId)
          const basePrices = await stripe.prices.list({
            product: baseProductId,
            active: true,
            limit: 1,
          })
          
          if (basePrices.data.length > 0) {
            lineItems.push({
              price: basePrices.data[0].id,
              quantity: item.quantity,
            })
            console.log(`✓ Added base product: ${baseProduct.name} (ID: ${baseProduct.id}) with price ID: ${basePrices.data[0].id}`)
          } else {
            // Fallback to price_data
            lineItems.push({
              price_data: {
                currency: 'usd',
                product_data: {
                  name: baseProductName,
                  images: [`${baseUrl}${imagePath}`],
                },
                unit_amount: priceInCents,
              },
              quantity: item.quantity,
            })
          }
        } catch (error) {
          console.error(`Error retrieving base product ${baseProductId}:`, error)
          // Fallback to price_data
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: baseProductName,
                images: [`${baseUrl}${imagePath}`],
              },
              unit_amount: priceInCents,
            },
            quantity: item.quantity,
          })
        }
      }
      
      // 2. Add the magnification product line item if selected
      console.log(`Checking magnification: stripeProductId="${item.stripeProductId}", selectedMagnification="${item.selectedMagnification}"`)
      console.log(`Type check: stripeProductId is ${typeof item.stripeProductId}, selectedMagnification is ${typeof item.selectedMagnification}`)
      console.log(`Boolean check: stripeProductId truthy=${!!item.stripeProductId}, selectedMagnification truthy=${!!item.selectedMagnification}`)
      
      if (item.stripeProductId && item.selectedMagnification) {
        console.log(`✓ Processing magnification: ${item.selectedMagnification} with product ID: ${item.stripeProductId}`)
        try {
          const magnificationProduct = await stripe.products.retrieve(item.stripeProductId)
          console.log(`✓ Retrieved magnification product: ${magnificationProduct.name} (ID: ${magnificationProduct.id})`)
          
          const magnificationPrices = await stripe.prices.list({
            product: item.stripeProductId,
            active: true,
            limit: 1,
          })
          
          console.log(`✓ Found ${magnificationPrices.data.length} price(s) for magnification product`)
          
          if (magnificationPrices.data.length > 0) {
            const magnificationLineItem = {
              price: magnificationPrices.data[0].id,
              quantity: item.quantity,
            }
            lineItems.push(magnificationLineItem)
            console.log(`✓✓✓ SUCCESS: Added magnification product to lineItems`)
            console.log(`   Product: ${magnificationProduct.name}`)
            console.log(`   Magnification: ${item.selectedMagnification}`)
            console.log(`   Price ID: ${magnificationPrices.data[0].id}`)
            console.log(`   Quantity: ${item.quantity}`)
            console.log(`   Line item object:`, JSON.stringify(magnificationLineItem, null, 2))
          } else {
            // Fallback to price_data - get price from the product if available
            const magnificationName = magnificationProduct.name || `${item.selectedMagnification} Magnification`
            // Try to get a default price amount, or use 0 if not available
            const magnificationPriceAmount = 0 // Will be set by Stripe product if it has a default price
            lineItems.push({
              price_data: {
                currency: 'usd',
                product: item.stripeProductId,
                unit_amount: magnificationPriceAmount,
              },
              quantity: item.quantity,
            })
          }
        } catch (error: any) {
          console.error(`❌ ERROR retrieving magnification product ${item.stripeProductId}:`, error.message)
          console.error(`   Full error:`, error)
          // Fallback to price_data
          const magnificationName = `${item.selectedMagnification} Magnification`
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: magnificationName,
              },
              unit_amount: 0,
            },
            quantity: item.quantity,
          })
        }
      } else {
        console.warn(`⚠⚠⚠ SKIPPING magnification: stripeProductId="${item.stripeProductId}", selectedMagnification="${item.selectedMagnification}"`)
        console.warn(`   Reason: Condition failed - both values must be truthy`)
      }
      
      // 3. Add Prescription Lenses add-on if selected
      if (item.hasPrescriptionLenses) {
        console.log(`✓ Processing Prescription Lenses add-on`)
        try {
          const prescriptionProduct = await stripe.products.retrieve(ADDON_PRODUCT_IDS.prescriptionLenses)
          const prescriptionPrices = await stripe.prices.list({
            product: ADDON_PRODUCT_IDS.prescriptionLenses,
            active: true,
            limit: 1,
          })
          
          if (prescriptionPrices.data.length > 0) {
            lineItems.push({
              price: prescriptionPrices.data[0].id,
              quantity: item.quantity,
            })
            console.log(`✓ Added Prescription Lenses: ${prescriptionProduct.name} (Price ID: ${prescriptionPrices.data[0].id})`)
          } else {
            console.warn(`⚠ No active price found for Prescription Lenses product`)
          }
        } catch (error: any) {
          console.error(`❌ ERROR retrieving Prescription Lenses product:`, error.message)
        }
      }
      
      // 4. Add Extended Warranty add-on if selected
      if (item.hasExtendedWarranty) {
        console.log(`✓ Processing Extended Warranty add-on`)
        try {
          const warrantyProduct = await stripe.products.retrieve(ADDON_PRODUCT_IDS.extendedWarranty)
          const warrantyPrices = await stripe.prices.list({
            product: ADDON_PRODUCT_IDS.extendedWarranty,
            active: true,
            limit: 1,
          })
          
          if (warrantyPrices.data.length > 0) {
            lineItems.push({
              price: warrantyPrices.data[0].id,
              quantity: item.quantity,
            })
            console.log(`✓ Added Extended Warranty: ${warrantyProduct.name} (Price ID: ${warrantyPrices.data[0].id})`)
          } else {
            console.warn(`⚠ No active price found for Extended Warranty product`)
          }
        } catch (error: any) {
          console.error(`❌ ERROR retrieving Extended Warranty product:`, error.message)
        }
      }
    }

    console.log('=== FINAL LINE ITEMS ===')
    console.log('Total line items:', lineItems.length)
    console.log('Line items:', JSON.stringify(lineItems, null, 2))
    console.log('=======================')
    
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: lineItems,
      mode: 'payment',
      return_url: `${req.nextUrl.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    })
    
    console.log('✓ Stripe session created:', session.id, 'with', lineItems.length, 'line items')

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

