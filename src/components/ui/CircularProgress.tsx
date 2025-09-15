'use client';
import React, { useMemo } from 'react';

type Props = {
  percentage: number;            // 0 - 100
  size?: number;                 // diameter in px (default 120)
  strokeWidth?: number;          // line thickness (default 12)
  trackColor?: string;           // background ring color (default light gray)
  progressColor?: string;        // progress ring color (default #0ea5e9)
  textColor?: string;            // center text color
  showLabel?: boolean;           // show percentage text in center
  className?: string;
  ariaLabel?: string;
  animateMs?: number;            // animation duration in ms (default 800)
};

export const CircularProgress: React.FC<Props> = ({
  percentage,
  size = 120,
  strokeWidth = 12,
  trackColor = '#e6e6e6',
  progressColor = '#0ea5e9',
  textColor = '#111827',
  showLabel = true,
  className = '',
  ariaLabel = 'Progress',
  animateMs = 800,
}) => {
  // clamp percent 0..100
  const pct = Math.max(0, Math.min(100, Number(percentage) || 0));
  const half = size / 2;
  // radius must account for strokeWidth so it doesn't get clipped
  const radius = half - strokeWidth / 2;
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const dashOffset = useMemo(
    () => circumference * (1 - pct / 100),
    [circumference, pct]
  );

  // inline styles for animation
  const progressStyle: React.CSSProperties = {
    transition: `stroke-dashoffset ${animateMs}ms ease`,
    transform: 'rotate(-90deg)',
    transformOrigin: '50% 50%',
  };

  return (
    <div
      role="img"
      aria-label={`${ariaLabel}: ${pct}%`}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={half}
          cy={half}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress (rotated -90deg so it starts at top) */}
        <circle
          cx={half}
          cy={half}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={progressStyle}
        />
      </svg>

      {/* Center label (absolutely positioned over SVG) */}
      {showLabel && (
        <div
          style={{
            position: 'absolute',
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: Math.max(12, size * 0.18),
                fontWeight: 600,
                color: textColor,
                lineHeight: 1,
              }}
            >
              {/* {pct}% */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
