import React, { useState, useEffect, useCallback } from "react";

const msToTime = (
  ms: number
): { seconds: string; minutes: string; hours: string } => {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / 1000 / 60) % 60;
  const hours = Math.floor(ms / 1000 / 60 / 60);

  return {
    seconds: `${seconds}`.padStart(2, "0"),
    minutes: `${minutes}`.padStart(2, "0"),
    hours: `${hours}`.padStart(2, "0"),
  };
};

interface TimerProps {
  maxTimeMs: number;
  isTimerPaused: boolean;
  onTimeOut: () => void;
}

export default function Timer({ maxTimeMs, onTimeOut }: TimerProps) {
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(maxTimeMs);
  const [timerInterval, setTimerInterval] = useState<number | undefined>();
  const updateTimer = () => {
    if (!timerInterval) {
      const newTimerInterval = setInterval(() => {
        setCurrentTimeMs((currentTimeMs) => {
          if (currentTimeMs <= 0) {
            onTimeOut();
            return 0;
          }

          return currentTimeMs - 1000;
        });
      }, 1000);
      setTimerInterval(newTimerInterval as unknown as number);
    }
  };

  useEffect(() => {
    updateTimer();

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  const { hours, minutes, seconds } = msToTime(currentTimeMs);

  return (
    <div>
      {hours}:{minutes}:{seconds}
    </div>
  );
}
