import { CollectionConfig } from 'payload'
import { generateReviewEmail } from '@/services/email-templates'

const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderId',
  },
  access: {
    create: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => req.user?.role === 'admin' || { id: { equals: req.user?.id } },
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Only send email when status changes to 'delivered'
        if (doc.status === 'delivered') {
          try {
            // Use the existing req.payload instance instead of creating a new one
            const fullOrder = await req.payload.findByID({
              collection: 'orders',
              id: doc.id,
              depth: 2, // This populates the product relationships
            })

            // Generate email content
            const email = generateReviewEmail(fullOrder)

            // Send email using the configured email adapter
            await req.payload.sendEmail({
              to: fullOrder.customer.email,
              from: process.env.EMAIL_FROM,
              subject: email.subject,
              html: email.html,
              text: email.text,
            })

            req.payload.logger.info(`Review request email sent for order ${fullOrder.orderId}`)
          } catch (error) {
            req.payload.logger.error(`Error sending review email for order ${doc.orderId}:`, error)
            // Add more detailed error logging
            if (error instanceof Error) {
              req.payload.logger.error(error.stack)
            }
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'orderId',
      type: 'text',
      unique: true,
      required: true,
      defaultValue: () => `ORD-${Date.now()}`, // Generate a unique order ID
    },
    {
      name: 'customer',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'address',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'zip',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'color',
          type: 'text',
        },
        {
          name: 'size',
          type: 'text',
        },
      ],
    },
    {
      name: 'totalPrice',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

export default Orders
