'use client'
import { signIn } from 'next-auth/react'

export default () => <button onClick={() => signIn()}>Sign in</button>
