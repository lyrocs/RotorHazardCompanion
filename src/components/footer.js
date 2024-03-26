'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer({ locale }) {
  const pathname = usePathname()
  const newLocale = locale === 'fr' ? 'en' : 'fr'
  const newLocalePath = () => {
    return pathname.replace(/^\/(fr|en)/, `/${newLocale}`)
  }

  return (
    <footer className="bg-color-1 rounded-lg shadow m-4 dark:bg-gray-800">
      <div className="w-full mx-auto max-w-screen-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <span className="text-sm text-gray-200 flex-1 text-center md:text-left dark:text-gray-400">
          © 2024{' '}
          <a href="/" className="hover:underline">
            RH Board
          </a>
        </span>
        <ul className="flex justify-center flex-wrap items-center mt-3 text-sm font-medium text-gray-300 dark:text-gray-400 sm:mt-0">
          <li>
            <Link href={newLocalePath()} locale="en">
              <Image
                priority
                src={`/${newLocale}.svg`}
                height={32}
                width={32}
                alt="Change language"
                className="mx-4"
              />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
