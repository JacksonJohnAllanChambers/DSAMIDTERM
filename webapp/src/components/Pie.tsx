import React from 'react'

export default function Pie({ size=36, values, colors, title }: { size?: number, values: number[], colors: string[], title?: string }){
  const total = Math.max(0, values.reduce((a,b)=>a+b,0)) || 1
  let acc = 0
  const radius = (size/2) - 2
  const circumference = 2 * Math.PI * radius
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={title}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1f2937" strokeWidth={4} />
      {values.map((v, i) => {
        const frac = v / total
        const dash = frac * circumference
        const gap = circumference - dash
        const rot = (acc / total) * 360
        acc += v
        return (
          <circle key={i}
            cx={size/2} cy={size/2} r={radius}
            fill="none"
            stroke={colors[i] || 'white'}
            strokeWidth={4}
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rot} ${size/2} ${size/2})`}
          />
        )
      })}
    </svg>
  )
}
