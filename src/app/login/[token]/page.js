'use client'
import { useRouter } from "next/navigation";


export default function LoginToken({params}) {
    const router = useRouter();
    if (params.token) {
        localStorage.setItem('token', params.token)
        router.push('/account')
    } else {
        router.push('/login')
    }
}