import Image from 'next/image'

export default function Banner({ background, border, icon, title, description }) {
  return (
    <div
      className={`${background} ${border} border-t-4 rounded-b text-teal-900 px-4 py-3 shadow-md`}
      role="alert"
    >
      <div className="flex">
        <div className="py-1">
          <Image
            priority
            src={`/${icon}.svg`}
            height={25}
            width={25}
            alt="Success icon"
            className="fill-current h-6 w-6 mr-4"
          />
        </div>
        <div className="pr-2">
          <p className="font-bold">{title}</p>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  )
}
