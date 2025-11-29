import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe('sk_test_51SV0NsLQ1qA2EZ9RmR1DPwnqHMb92UNhzLIkq3U7eUEwbxJMZSVXSa26hhsnbgo5aCyKHrXYJiEVUQoAKJW8WPNf00GK2SjsiI', {
  apiVersion: '2024-12-18.acacia',
})

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
    })
  } catch (error: any) {
    console.error('Error retrieving session:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}




