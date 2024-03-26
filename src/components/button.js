export default function Button({
  children,
  onClick,
  className,
  type = 'success',
  disable = false,
}) {
  const TYPES = {
    success: 'border-green-500',
    disable: 'border-gray-500',
    danger: 'border-red-500',
    warning: 'border-yellow-500',
  }
  return (
    <button
      className={`px-4 py-2 border-2 rounded ${TYPES[type]}`}
      onClick={onClick}
      disable={type === 'disable' || disable ? 'disable' : ''}
    >
      {children}
    </button>
  )
}
