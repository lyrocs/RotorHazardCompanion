export default function Header() {
  return (
    <header className="ffc-header p-4">
      <div className="container mx-auto flex items-center justify-between">
        <a href="/" className=" text-2xl font-bold">
          RH Companion
        </a>
        <nav className="self-center flex items-center">
          <a href="/finals" className=" hover:underline link-with-bar">
            Finals
          </a>
          <a href="/current" className=" hover:underline link-with-bar">
            Current
          </a>
          <a href="/laps" className=" hover:underline link-with-bar">
            Laps
          </a>
          <a href="/run" className=" hover:underline link-with-bar">
            Run
          </a>
          <a href="/marshal" className=" hover:underline link-with-bar">
            Marshal
          </a>
          <a href="/admin" className=" hover:underline">
            Admin
          </a>
        </nav>
      </div>
    </header>
  )
}
