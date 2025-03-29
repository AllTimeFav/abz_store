// src/email-templates/review-request.ts
import { Order } from '../payload-types'

export const generateReviewEmail = (order: Order) => ({
  subject: `Review your ${order?.items?.length} purchase(s) from order ${order.orderId}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
        .product-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
        .product-image { width: 100px; height: 100px; object-fit: cover; border-radius: 4px; }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #171717;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 10px;
        }
        .footer { margin-top: 20px; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>How was your order?</h1>
          <p>Order #${order.orderId}</p>
        </div>
        
        <p>Hello ${order.customer.name},</p>
        <p>We hope you're enjoying your recent purchases! Please take a moment to review each item below.</p>
        
        <h3>Your Purchases:</h3>
        
        ${
          order?.items &&
          order?.items
            .map((item) => {
              const product = typeof item.product === 'object' ? item.product : null
              return `
            <div class="product-card">
              <div style="display: flex; gap: 16px; align-items: center;">
                ${
                  product?.images && process.env.NEXT_PUBLIC_SERVER_URL
                    ? `<img src="${process.env.NEXT_PUBLIC_SERVER_URL}${product.images[0].image.url}" alt="${product.name}" class="product-image">`
                    : '<div style="width:100px;height:100px;background:#f3f4f6;"></div>'
                }
                <div>
                  <h4 style="margin:0;">${product?.name || 'Your Product'}</h4>
                  <p style="margin:4px 0;">Quantity: ${item.quantity}</p>
                  <p style="margin:4px 0;">Price: ${item.price}Rs</p>
                  ${item.color ? `<p style="margin:4px 0;">Color: ${item.color}</p>` : ''}
                  ${item.size ? `<p style="margin:4px 0;">Size: ${item.size}</p>` : ''}
                </div>
              </div>
              <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/review?user=${order.customer.email}&order=${order.id}&product=${product?.id || item.product}" class="button" style={{color : "white"}}>
                Review This Item
              </a>
            </div>
          `
            })
            .join('')
        }
        
        <p>Your feedback helps us improve and helps other shoppers make informed decisions.</p>
        
      </div>
    </body>
    </html>
  `,
  text: `
    How was your order ${order.orderId}, ${order.customer.name}?

    We hope you're enjoying your recent purchases. Please review each item:

    ${
      order?.items &&
      order?.items
        .map((item) => {
          const product = typeof item.product === 'object' ? item.product : null
          return `
      - ${item.quantity}x ${product?.name || 'Product'} (${item.price}Rs)
        Review: ${process.env.NEXT_PUBLIC_SERVER_URL}/review?order=${order.id}&product=${product?.id || item.product}
      `
        })
        .join('\n')
    }

    Review all items at once: ${process.env.NEXT_PUBLIC_SERVER_URL}/review/order/${order.id}

    Thank you for your feedback!
    The ${process.env.NEXT_PUBLIC_SITE_NAME || 'ABZ Store'} Team
  `,
})
