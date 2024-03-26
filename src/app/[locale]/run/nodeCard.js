import NodeChart from './nodeChart.js'
import Card from '@/components/card.js'

export default function NodeCard({
  chartData,
  chartTimes,
  chartIndex,
  frequencies = [],
  currentLaps,
}) {
  const frequency = frequencies[chartIndex] || {}
  const currentLapsNode = currentLaps?.node_index?.[chartIndex] || {}
  return (
    <Card
      customClass="flex-1"
      header={
        <div className="flex gap-4 items-center justify-center">
          <span className="text-4xl">
            {frequency.band}
            {frequency.channel}
          </span>
          -<span className="text-2xl truncate">{currentLapsNode.pilot?.name || 'None'}</span>
        </div>
      }
      children={
        <div className="flex flex-col">
          <NodeChart chartData={chartData} chartTimes={chartTimes} chartIndex={chartIndex} />
          <ul>
            {currentLapsNode.laps?.map((lap, index) => (
              <li key={`lap-${index}`}>
                {lap.lap_time_formatted} - {lap.lap_time}
              </li>
            ))}
          </ul>
        </div>
      }
    />
  )
}
