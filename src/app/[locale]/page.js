import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations('Home')
  return (
    <>
      <div className="flex flex-wrap flex-col md:flex-row bg-color-2 relative bg-opacity-80 bg-color-4">
        Hello
      </div>
    </>
  )
}
