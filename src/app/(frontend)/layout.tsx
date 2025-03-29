import type { ReactNode } from 'react'
import React from 'react'
import '../globals.css'
export const metadata = {
  description: 'A Fully Customizeable E-Commerce Store',
  title: 'E-Commerce Store',
}

export default async function RootLayout(props: { children: ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>{children} </body>
    </html>
  )
}
