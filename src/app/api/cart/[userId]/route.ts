import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const waitedParams = await params
    const userId = waitedParams.userId

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    // Fetch the user's cart
    const cart = await payload.find({
      collection: 'carts',
      where: { user: { equals: userId } },
    })

    if (!cart?.docs?.length) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    return NextResponse.json(cart.docs[0], { status: 200 })
  } catch (error) {
    console.log('Error loding cart ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  const waitedParams = await params
  const userId = waitedParams.userId

  try {
    // Parse the request body
    const { items } = await req.json()

    // Initialize Payload
    const payload = await getPayload({ config })

    // Fetch the user's cart
    const userCart = await payload.find({
      collection: 'carts',
      where: {
        user: { equals: userId },
      },
    })

    if (items.length > 0) {
      if (userCart.docs.length > 0) {
        // Update existing cart
        const cart = await payload.update({
          collection: 'carts',
          id: userCart.docs[0].id,
          data: { items },
        })
        console.log('Update exixting cart ', cart)
      } else {
        // Create new cart
        const cart = await payload.create({
          collection: 'carts',
          data: { user: userId, items },
        })
        console.log('created new cart ', cart)
      }
    }

    // Return success response
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error saving cart:', error)
    return NextResponse.json({ error: 'Failed to save cart' }, { status: 500 })
  }
}
