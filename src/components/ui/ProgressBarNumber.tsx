'use client';
import React from 'react';

type Props = {
  value: number;               // angka aktual
  max: number;                 // batas maksimal
  height?: number;             // tinggi bar (default 20px)
  bgColor?: string;            // warna background (default gray-200)
  fillColor?: string;          // warna isi bar (default sky-500)
  textColor?: string;          // warna teks (default white)
  rounded?: boolean;           // bar rounded (default true)
  animateMs?: number;          // durasi animasi
  className?: string;
};

const ProgressBarNumber: React.FC<Props> = ({
  value,
  max,
  height = 10,
  bgColor = '#e5e7eb',
  fillColor = '#0ea5e9',
  textColor = '#000',
  rounded = true,
  animateMs = 600,
  className = '',
}) => {
  const safeValue = Math.max(0, value);
  const safeMax = Math.max(1, max); // supaya tidak divide by zero
  const percent = Math.min(100, (safeValue / safeMax) * 100);

  return (
    <div
      className={`relative overflow-hidden ${rounded ? 'rounded-full' : ''} ${className}`}
      style={{
        width: '100%',
        height: `${height}px`,
        backgroundColor: bgColor,
      }}
    >
       {/* <span
        className="absolute inset-0 flex items-center justify-center font-semibold text-md"
        style={{ color: textColor, fontSize: height * 0.6 }}
      >
        {safeValue}
      </span> */}
      {/* Fill */}
      <div
        className={`h-full ${rounded ? 'rounded-full' : ''}`}
        style={{
          width: `${percent}%`,
          backgroundColor: fillColor,
          transition: `width ${animateMs}ms ease-in-out`,
        }}
      />

      {/* Label angka */}
     
    </div>
  );
};

export default ProgressBarNumber;
