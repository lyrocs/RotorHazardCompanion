export default function Card({ header, children, customClass = '' }) {
  return (
    <div className={`card h-full ${customClass}`}>
      {header && <div className="card-header h-full">{header}</div>}
      <div className="card-body h-full">{children}</div>
      <div className="card-arrow">
        <div className="card-arrow-top-left"></div>
        <div className="card-arrow-top-right"></div>
        <div className="card-arrow-bottom-left"></div>
        <div className="card-arrow-bottom-right"></div>
      </div>
    </div>
  )
}
