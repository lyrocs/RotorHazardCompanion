'use client'
import { signOut } from 'next-auth/react'

export default () => (
  <button className="bg-red-700 rounded p-2 text-center text-lg" onClick={() => signOut()}>
    Sign out
  </button>
)
