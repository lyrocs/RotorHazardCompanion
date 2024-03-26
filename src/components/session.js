'use client'
import { getCsrfToken } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'
import { useSession } from 'next-auth/react'

export function Child() {
  const { data: session, status } = useSession()
  return <div> {status === 'authenticated' && session.user?.name}</div>
}

export default function () {
  return (
    <SessionProvider>
      <Child />
    </SessionProvider>
  )
}
