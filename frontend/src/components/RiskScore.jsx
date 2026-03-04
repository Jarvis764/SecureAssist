import React from 'react'

const RISK_THRESHOLDS = {
  CRITICAL: 30,
  HIGH: 50,
  MODERATE: 65,
  LOW: 80,
}

const getRiskInfo = (score) => {
  if (score <= RISK_THRESHOLDS.CRITICAL) return { label: 'CRITICAL RISK', color: '#ff4757', glow: 'rgba(255,71,87,0.4)' }
  if (score <= RISK_THRESHOLDS.HIGH) return { label: 'HIGH RISK', color: '#ff4757', glow: 'rgba(255,71,87,0.3)' }
  if (score <= RISK_THRESHOLDS.MODERATE) return { label: 'MODERATE RISK', color: '#ffa502', glow: 'rgba(255,165,2,0.3)' }
  if (score <= RISK_THRESHOLDS.LOW) return { label: 'LOW RISK', color: '#ffd32a', glow: 'rgba(255,211,42,0.3)' }
  return { label: 'SECURE', color: '#00ff88', glow: 'rgba(0,255,136,0.4)' }
}

export default function RiskScore({ score }) {
  const { label, color, glow } = getRiskInfo(score)
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex items-center justify-center"
        style={{ filter: `drop-shadow(0 0 20px ${glow})` }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#1e3a5f"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-5xl font-bold" style={{ color }}>{score}</div>
          <div className="text-xs text-slate-400 mt-1">/ 100</div>
        </div>
      </div>
      <div className="text-xs font-semibold mt-2 tracking-widest" style={{ color }}>
        {label}
      </div>
      <div className="text-xs text-slate-500 mt-1 tracking-widest">SECURITY SCORE</div>
    </div>
  )
}
