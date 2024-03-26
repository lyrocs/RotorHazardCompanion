import type { ReactNode } from 'react'
import '@/styles/globals.css'
import '@/styles/index.scss'

type Props = {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
