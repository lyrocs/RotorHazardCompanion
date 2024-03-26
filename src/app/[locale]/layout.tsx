import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import '@/styles/index.scss'
import { useLocale } from 'next-intl'
import moment from 'moment'
import 'moment/locale/fr'
import 'moment/locale/en-gb'
import { notFound } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AuthProvider from '@/components/auth-provider'

const inter = Inter({ subsets: ['latin'] })

const locales = ['fr', 'en']

export const metadata: Metadata = {
  title: 'RotorHazard Board',
  description: 'RotorHazard Board',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const isValidLocale = locales.some(cur => cur === locale)
  if (!isValidLocale) notFound()
  fetch(process.env.NEXT_PUBLIC_API_URL + '/api/socket')

  return (
    <AuthProvider>
      <div className="App bg-dark-blue font-sans">
        <Header />
        <div className="page-body">{children}</div>
        <Footer locale={locale} />
      </div>
    </AuthProvider>
  )
}
