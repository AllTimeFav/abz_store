// app/api/products/[id]/reviews/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await getPayload({ config })
    const waitedParams = await params

    const reviews = await payload.find({
      collection: 'reviews',
      where: {
        and: [{ product: { equals: waitedParams.id } }, { approved: { equals: true } }],
      },
      sort: '-createdAt',
      depth: 1, // Populate relationships
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
