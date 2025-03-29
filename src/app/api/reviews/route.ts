// src/app/api/reviews/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Review } from '@/payload-types'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const payload = await getPayload({ config })

    // Extract text fields
    const productId = formData.get('product') as string
    const orderId = formData.get('order') as string
    const email = formData.get('email') as string
    const rating = parseInt(formData.get('rating') as string)
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const verifiedPurchase = formData.get('verifiedPurchase') === 'true'

    // Handle image uploads
    const uploadedImages: string[] = []
    let index = 0

    while (formData.has(`images-${index}`)) {
      const file = formData.get(`images-${index}`) as File

      // Convert browser File to Payload-compatible format
      const fileBuffer = Buffer.from(await file.arrayBuffer())

      // Create media document in Payload
      const uploadedImage = await payload.create({
        collection: 'media',
        data: {
          alt: `Review image for ${title}`,
        },
        file: {
          data: fileBuffer,
          mimetype: file.type,
          name: file.name,
          size: file.size,
        },
      })

      uploadedImages.push(uploadedImage.id)
      index++
    }

    // Create the review
    const reviewData = {
      product: productId,
      order: orderId,
      email,
      rating,
      title,
      content,
      verifiedPurchase,
      images: uploadedImages.map((id) => ({ image: id })),
      // These will be automatically added by Payload CMS
      id: '' as unknown as string, // Temporary placeholder
      createdAt: '' as unknown as string,
      updatedAt: '' as unknown as string,
    }

    // Create the review
    const review = await payload.create({
      collection: 'reviews',
      data: reviewData as unknown as Review, // Proper type casting
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to submit review. Please try again.' },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const reviews = await payload.find({
      collection: 'reviews',
      where: {
        and: [
          { product: { equals: productId } },
          { approved: { equals: true } }, // Only fetch approved reviews
        ],
      },
      sort: '-createdAt', // Newest first
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
