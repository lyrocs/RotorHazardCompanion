export default function Node(name, finals) {
  const currentNode = (finals && finals[name]) || []

  const names = currentNode.map(pilot => {
    const points = pilot.points
      ? pilot.points.map(point => {
          return <div className="pos">{point}</div>
        })
      : ''
    const position = <div className="pos">{pilot.position}</div>
    return (
      <div className="table-pilot">
        <div className="name">{pilot.name}</div> {points || position}
      </div>
    )
  })

  return (
    <div className="table">
      <div className="table-name">{name}</div>
      <div className="table-pilots">{names}</div>
    </div>
  )
}
