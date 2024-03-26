import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import Login from '@/components/login'
import Logout from '@/components/logout'
import Session from '@/components/session'
import { options } from '@/pages/api/auth/[...nextauth]'

export default async function Page() {
  const session = await getServerSession(options)

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/admin')
  }

  return (
    <>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Login />
      <br />
      <Logout />
      <br />
      <Session />

      <a href="/admin/pilots">Pilots list</a>
    </>
  )
}
