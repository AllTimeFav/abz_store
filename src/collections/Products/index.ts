import { CollectionConfig } from 'payload'
import { ribbonOptions, colorOptions, sizeOptions } from './Options'

const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'ribbon',
      type: 'select',
      hasMany: true,
      options: ribbonOptions,
      admin: {
        description: 'Add a ribbon to highlight this product',
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Product Name',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Product Description',
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
        {
          name: 'altText',
          type: 'text',
          label: 'Alt Text',
        },
      ],
      maxRows: 4,
    },
    {
      name: 'pricing',
      type: 'group',
      label: 'Base Pricing',
      admin: {
        description: 'Set base price when no color/size variants exist',
        condition: (data) =>
          !data?.options?.colors?.length &&
          !data?.options?.sizes?.length &&
          !data?.options?.combinations?.length,
      },
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          label: 'Base Price',
        },
        {
          name: 'onSale',
          type: 'checkbox',
          label: 'On Sale?',
        },
        {
          name: 'discount',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            condition: (data, siblingData) => Boolean(siblingData?.onSale),
            description: 'Discount percentage',
          },
        },
        {
          name: 'discountedPrice',
          type: 'number',
          admin: {
            readOnly: true,
            condition: (data, siblingData) => Boolean(siblingData?.onSale),
            description: 'Final price after discount (automatically calculated)',
          },
          hooks: {
            beforeValidate: [
              ({ siblingData }) => {
                const { price, discount, onSale } = siblingData
                if (onSale && typeof price === 'number' && typeof discount === 'number') {
                  return Number((price - (price * discount) / 100).toFixed(2))
                }
                return price || 0
              },
            ],
          },
        },
      ],
    },
    {
      name: 'inventory',
      type: 'group',
      label: 'Base Inventory',
      admin: {
        description: 'Set base inventory when no color/size variants exist',
        condition: (data) =>
          !data?.options?.colors?.length &&
          !data?.options?.sizes?.length &&
          !data?.options?.combinations?.length,
      },
      fields: [
        {
          name: 'trackInventory',
          type: 'checkbox',
          label: 'Track Inventory',
          defaultValue: false,
        },
        {
          name: 'quantity',
          type: 'number',
          label: 'Quantity',
          min: 0,
          admin: {
            condition: (data, siblingData) => Boolean(siblingData?.trackInventory),
          },
        },
      ],
    },
    {
      name: 'options',
      type: 'group',
      fields: [
        {
          name: 'colors',
          type: 'array',
          fields: [
            {
              name: 'color',
              type: 'select',
              options: colorOptions,
              required: true,
              admin: {
                description: 'Select a color',
              },
            },
            {
              name: 'pricing',
              type: 'group',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  label: 'Color Price',
                  min: 0,
                },
                {
                  name: 'onSale',
                  type: 'checkbox',
                  label: 'On Sale?',
                },
                {
                  name: 'discount',
                  type: 'number',
                  min: 0,
                  max: 100,
                  admin: {
                    condition: (data, siblingData) => Boolean(siblingData?.onSale),
                    description: 'Discount percentage',
                  },
                },
                {
                  name: 'discountedPrice',
                  type: 'number',
                  admin: {
                    readOnly: true,
                    condition: (data, siblingData) => Boolean(siblingData?.onSale),
                    description: 'Final price after discount (automatically calculated)',
                  },
                  hooks: {
                    beforeValidate: [
                      ({ siblingData }) => {
                        const { price, discount, onSale } = siblingData
                        if (onSale && typeof price === 'number' && typeof discount === 'number') {
                          return Number((price - (price * discount) / 100).toFixed(2))
                        }
                        return price || 0
                      },
                    ],
                  },
                },
              ],
            },
            {
              name: 'trackInventory',
              type: 'checkbox',
              label: 'Track Color Inventory',
              defaultValue: false,
            },
            {
              name: 'quantity',
              type: 'number',
              label: 'Color Quantity',
              min: 0,
              admin: {
                condition: (data, siblingData) => Boolean(siblingData?.trackInventory),
                description: 'Enter quantity for this color',
              },
            },
          ],
        },
        {
          name: 'sizes',
          type: 'array',
          fields: [
            {
              name: 'value',
              type: 'select',
              options: sizeOptions,
              required: true,
            },
            {
              name: 'pricing',
              type: 'group',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  label: 'Size Price',
                  min: 0,
                },
                {
                  name: 'onSale',
                  type: 'checkbox',
                  label: 'On Sale?',
                },
                {
                  name: 'discount',
                  type: 'number',
                  min: 0,
                  max: 100,
                  admin: {
                    condition: (data, siblingData) => Boolean(siblingData?.onSale),
                    description: 'Discount percentage',
                  },
                },
                {
                  name: 'discountedPrice',
                  type: 'number',
                  admin: {
                    readOnly: true,
                    condition: (data, siblingData) => Boolean(siblingData?.onSale),
                    description: 'Final price after discount (automatically calculated)',
                  },
                  hooks: {
                    beforeValidate: [
                      ({ siblingData }) => {
                        const { price, discount, onSale } = siblingData
                        if (onSale && typeof price === 'number' && typeof discount === 'number') {
                          return Number((price - (price * discount) / 100).toFixed(2))
                        }
                        return price || 0
                      },
                    ],
                  },
                },
              ],
            },
            {
              name: 'trackInventory',
              type: 'checkbox',
              label: 'Track Size Inventory',
              defaultValue: false,
            },
            {
              name: 'quantity',
              type: 'number',
              label: 'Size Quantity',
              min: 0,
              admin: {
                condition: (data, siblingData) => Boolean(siblingData?.trackInventory),
                description: 'Enter quantity for this size',
              },
            },
          ],
        },
        {
          name: 'combinations',
          type: 'array',
          label: 'Color & Size Combinations',
          admin: {
            description: 'Track inventory and pricing for specific combinations',
          },
          fields: [
            {
              name: 'combination',
              type: 'group',
              fields: [
                {
                  name: 'color',
                  type: 'select',
                  options: colorOptions.map((color) => ({
                    label: color.label,
                    value: color.value,
                  })),
                  required: true,
                  admin: {
                    isClearable: false,
                  },
                },
                {
                  name: 'colorLabel',
                  type: 'text',
                  admin: {
                    readOnly: true,
                    hidden: true,
                  },
                  hooks: {
                    beforeValidate: [
                      ({ siblingData }) => {
                        const colorOption = colorOptions.find((c) => c.value === siblingData?.color)
                        return colorOption?.label || ''
                      },
                    ],
                  },
                },
                {
                  name: 'size',
                  type: 'select',
                  options: sizeOptions,
                  required: true,
                },
              ],
            },
            {
              name: 'pricing',
              type: 'group',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  label: 'Combination Price',
                  min: 0,
                },
                {
                  name: 'onSale',
                  type: 'checkbox',
                  label: 'On Sale?',
                },
                {
                  name: 'discount',
                  type: 'number',
                  min: 0,
                  max: 100,
                  admin: {
                    condition: (data, siblingData) => Boolean(siblingData?.onSale),
                    description: 'Discount percentage',
                  },
                },
                {
                  name: 'discountedPrice',
                  type: 'number',
                  admin: {
                    readOnly: true,
                    condition: (data, siblingData) => Boolean(siblingData?.onSale),
                    description: 'Final price after discount (automatically calculated)',
                  },
                  hooks: {
                    beforeValidate: [
                      ({ siblingData }) => {
                        const { price, discount, onSale } = siblingData
                        if (onSale && typeof price === 'number' && typeof discount === 'number') {
                          return Number((price - (price * discount) / 100).toFixed(2))
                        }
                        return price || 0
                      },
                    ],
                  },
                },
              ],
            },
            {
              name: 'trackInventory',
              type: 'checkbox',
              label: 'Track Combination Inventory',
              defaultValue: false,
            },
            {
              name: 'quantity',
              type: 'number',
              label: 'Combination Quantity',
              min: 0,
              admin: {
                condition: (data, siblingData) => Boolean(siblingData?.trackInventory),
                description: 'Enter quantity for this combination',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Select one or more categories for this product',
      },
    },
  ],
}

export default Products
