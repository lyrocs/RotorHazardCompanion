import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Login from '@/components/login'
import Logout from '@/components/logout'
import Session from '@/components/session'
import { options } from '@/pages/api/auth/[...nextauth]'
import { signOut } from 'next-auth/react'

export default async function Page() {
  const session = await getServerSession(options)

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/admin')
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <a className="bg-indigo-700 rounded p-2 text-center text-lg" href="/admin/pilots">
        Pilots list
      </a>
      <a className="bg-indigo-700 rounded p-2 text-center text-lg" href="/admin/heats">
        Heats list
      </a>
      <a className="bg-indigo-700 rounded p-2 text-center text-lg" href="/admin/generator">
        Generator
      </a>
      <Logout />
    </div>
  )
}
