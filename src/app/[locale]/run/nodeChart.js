'use client'
import React, { useEffect, useState } from 'react'
import { SmoothieChart, TimeSeries } from 'smoothie'
import socketHelper from '@/helpers/socket.helper'
import fetchApi from '@/helpers/api.helper.js'
import ReactPlayer from 'react-player'

export default function nodeChart({ chartData, chartTimes, chartIndex }) {
  const canvas = React.useRef(null)
  const chart = React.useRef(null)
  const series = React.useRef(null)

  useEffect(() => {
    chart.current = new SmoothieChart({
      responsive: true,
      grid: {
        strokeStyle: 'rgba(255,255,255,0.25)',
        // millisPerLine:1, // Smoothie thinks the timestamps are in seconds
        sharpLines: true,
        verticalSections: 0,
        borderVisible: false,
      },
      labels: {
        precision: 0,
      },
      scaleSmoothing: 1,
    })
    series.current = new TimeSeries()
    chart.current.addTimeSeries(series.current, { lineWidth: 2, strokeStyle: '#00ff00' })
    chart.current.streamTo(canvas.current, 1000)
  }, [])

  const renderChart = () => {
    if (!chartData || !chartData.values?.length || !chartData.times?.length) {
      return
    }

    const nodeValues = chartData.values.map(value => value[chartIndex])

    // const history_times = raceDetail.history_times
    // const history_values = raceDetail.history_values
    // chart.current.options.minValue = Math.min.apply(null, nodeValues) - 5
    // chart.current.options.maxValue = Math.max.apply(null, nodeValues) + 5
    chart.current.options.minValue = 40
    chart.current.options.maxValue = 180
    

    chartData.times.forEach((time, index) => {
      series.current.append(time, chartData.values[index][chartIndex])
    })

    chart.current.streamTo(canvas.current, 1)

    // // chart.stop()
    // var graphWidth = 0.5
    // // console.log('graphWidth', graphWidth)

    // var startTime = chartData.values[0][chartIndex]
    // var endTime = chartData.values[chartData.values.length - 1][chartIndex]
    // var duration = endTime - startTime
    // var span = duration / graphWidth

    // chart.options.millisPerPixel = span / 1000

    // chart.options.horizontalLines = [
    //   { color: 'hsl(8.2, 86.5%, 53.7%)', lineWidth: 1.7, value: raceDetail?.enter_at || 0 }, // red
    //   { color: 'hsl(25, 85%, 55%)', lineWidth: 1.7, value: raceDetail?.exit_at || 0 }, // orange
    // ]

    // chart.render(canvas.current, endTime)
  }

  useEffect(() => {
    renderChart()
  }, [chartData])
  // useEffect(() => {
  //   renderChart()
  // }, [chartTimes])

  return (
    <div className="flex justify-center">
      <canvas ref={canvas} id="smoothie-chart" style={{width: '100%', height: '100px'}} />
    </div>
  )
}
