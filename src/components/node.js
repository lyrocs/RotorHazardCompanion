export default function Node(name, finals) {
  const currentNode = (finals && finals[name]) || []

  const names = currentNode.map(pilot => {
    const points = pilot.points
      ? pilot.points.map((point, index) => {
          return <div className={`${index && 'border-l pl-2'}`}>{point}</div>
        })
      : ''
    const position = <div className="pos">{pilot.position}</div>
    return (
      <div className="flex">
        <div className="flex-1 border px-2  w-36 truncate">{pilot.name}</div>
        {(points || position) && <div className="px-2 border flex gap-2">{points || position}</div>}
      </div>
    )
  })

  return (
    <div className="flex flex-nowrap border mb-4 min-w-52">
      <div className="bg-gray-700 w-8 flex ">
        <div className="flex-1 self-center text-center">{name}</div>
      </div>
      <div className="flex-1">{names}</div>
    </div>
  )
}
