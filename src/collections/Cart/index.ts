import { CollectionConfig } from 'payload'

const Carts: CollectionConfig = {
  slug: 'carts',
  access: {
    create: ({ req }) => req.user?.role === 'admin',
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'id',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'image',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'maxQuantity',
          type: 'number',
          required: false,
        },
        {
          name: 'color',
          type: 'text',
          required: false,
        },
        {
          name: 'size',
          type: 'text',
          required: false,
        },
      ],
    },
  ],
}

export default Carts
