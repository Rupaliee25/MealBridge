import { useState, useEffect } from 'react';

export default function CountdownRing({ expiryTimer, size = 64 }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculate = () => {
      if (!expiryTimer) {
        setTimeLeft(0);
        return;
      }

      // Ensure ISO string ends with Z if it lacks a timezone offset
      let formattedTimer = expiryTimer;
      if (typeof expiryTimer === 'string' && !expiryTimer.endsWith('Z') && !expiryTimer.includes('+')) {
        formattedTimer = `${expiryTimer}Z`;
      }

      const diff = new Date(formattedTimer).getTime() - Date.now();
      setTimeLeft(Math.max(diff, 0));
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [expiryTimer]);

  const totalMinutes = Math.floor(timeLeft / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Color shifts based on urgency
  const color =
    totalMinutes <= 0 ? '#9CA3AF' :      // gray - expired
    totalMinutes <= 30 ? '#FF6B4A' :     // red - urgent
    totalMinutes <= 60 ? '#FFB020' :     // amber - soon
    '#1B5E3F';                            // green - safe

  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const maxMinutes = 240; // 4-hour safety window
  const progress = Math.min(totalMinutes / maxMinutes, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth="4" />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>
          {totalMinutes <= 0 ? 'Expired' : `${hours}h ${minutes}m`}
        </span>
      </div>
    </div>
  );
}