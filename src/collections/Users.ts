import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: ({ req }) => req.user?.role === 'admin' || { id: { equals: req.user?.id } },
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin' || { id: { equals: req.user?.id } },
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'user'],
      defaultValue: 'user',
      access: {
        update: ({ req }) => req.user?.role === 'admin', // Only admins can change roles
      },
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
      access: {
        update: ({ req }) => req.user?.role === 'admin', // Only admins can change roles
      },
    },
    {
      name: 'verificationCode',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      access: {
        update: ({ req }) => req.user?.role === 'admin', // Only admins can change roles
      },
    },
  ],
}
