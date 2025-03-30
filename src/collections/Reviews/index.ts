// src/collections/Reviews.ts
import { CollectionConfig } from 'payload'

const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        condition: (data) => Boolean(data?.user), // Only show if user exists
      },
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      maxRows: 5,
    },
    {
      name: 'verifiedPurchase',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Should this review be displayed publicly?',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data, operation }) => {
        // For guest users, we'll store their email instead of user ID
        if (operation === 'create') {
          // If user is logged in, associate with their account
          if (req.user) {
            return {
              ...data,
              user: req.user.id,
              email: req.user.email,
            }
          }
          // For guest users, ensure we have email
          if (!data.email) {
            throw new Error('Email is required for guest reviews')
          }
        }
        return data
      },
    ],
  },
}

export default Reviews
