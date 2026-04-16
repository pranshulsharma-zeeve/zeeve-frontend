"use client";

import { useEffect, useMemo, useState } from "react";

interface ValidationCountdownProps {
  startDate: string;
  endDate: string;
}

interface TimeRemaining {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const parseDate = (dateString: string): Date => {
  if (!dateString) {
    return new Date(NaN);
  }

  // First attempt native parsing to support ISO formats like 2025-09-21.
  const nativeParsed = new Date(dateString);
  if (!Number.isNaN(nativeParsed.getTime())) {
    return nativeParsed;
  }

  // Fallback to DD/MM/YYYY strings coming from legacy payloads.
  const [day, month, year] = dateString.split("/").map(Number);
  if ([day, month, year].some((value) => Number.isNaN(value))) {
    return new Date(NaN);
  }

  return new Date(year, month - 1, day);
};

const calculateTimeRemaining = (endDate: Date): TimeRemaining => {
  const timeDiff = endDate.getTime() - new Date().getTime();

  if (timeDiff <= 0) {
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const totalSeconds = Math.floor(timeDiff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  return {
    months: Math.floor(totalDays / 30),
    days: totalDays % 30,
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60,
    isExpired: false,
  };
};

const TIME_UNITS = ["Months", "Days", "Hours", "Minutes", "Seconds"] as const;

interface CountdownCardProps {
  value: number;
  label: string;
  isHighlight: boolean;
}

const CountdownCard = ({ value, label, isHighlight }: CountdownCardProps) => (
  <div
    className={`flex flex-col items-center justify-center rounded-lg border p-3 transition-all sm:p-4 ${
      isHighlight
        ? "border-blue-300 bg-blue-50"
        : "border-[#E2E6F3] bg-gradient-to-b from-white to-gray-50 hover:border-blue-200"
    }`}
  >
    <div
      className={`text-2xl font-extrabold tabular-nums sm:text-3xl ${isHighlight ? "text-blue-600" : "text-[#09122D]"}`}
    >
      {value.toString().padStart(2, "0")}
    </div>
    <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#5C5F80]">{label}</div>
  </div>
);

const ValidationCountdown = ({ startDate, endDate }: ValidationCountdownProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);

  const start = useMemo(() => parseDate(startDate), [startDate]);
  const end = useMemo(() => parseDate(endDate), [endDate]);
  const hasInvalidDates = useMemo(() => Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()), [start, end]);

  useEffect(() => {
    if (hasInvalidDates) {
      return;
    }

    setTimeRemaining(calculateTimeRemaining(end));
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(end));
    }, 1000);
    return () => clearInterval(interval);
  }, [end, hasInvalidDates]);

  const progressPercentage = useMemo(() => {
    if (!timeRemaining) return 0;
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = new Date().getTime() - start.getTime();
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }, [timeRemaining, start, end]);

  const countdownValues = useMemo(
    () =>
      timeRemaining
        ? [timeRemaining.months, timeRemaining.days, timeRemaining.hours, timeRemaining.minutes, timeRemaining.seconds]
        : [],
    [timeRemaining],
  );

  if (hasInvalidDates) {
    return (
      <div className="rounded-2xl border border-[#E2E6F3] bg-white p-6">
        <h3 className="text-xl font-bold text-[#09122D]">Validation Period</h3>
        <p className="mt-2 text-sm text-red-600">Unable to display countdown: invalid date range provided.</p>
        <p className="mt-1 text-xs text-[#5C5F80]">
          Ensure the API returns ISO strings (YYYY-MM-DD) or DD/MM/YYYY values.
        </p>
      </div>
    );
  }

  if (!timeRemaining) {
    return <div className="h-80 animate-pulse rounded-2xl border border-[#E2E6F3] bg-gray-100" />;
  }

  return (
    <div className="rounded-2xl border border-[#E2E6F3] bg-gradient-to-br from-[#F8FAFF] via-white to-[#EEF2FF] p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 sm:items-center">
        <div>
          <h3 className="text-xl font-bold text-[#09122D]">Validation Period</h3>
          <p className="mt-1 text-xs text-[#5C5F80]">Epoch countdown</p>
        </div>
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white ${
            timeRemaining.isExpired ? "bg-red-500" : "bg-emerald-500"
          }`}
        >
          <div
            className={`size-1.5 rounded-full ${
              timeRemaining.isExpired ? "bg-red-200" : "animate-pulse bg-emerald-200"
            }`}
          />
          {timeRemaining.isExpired ? "EXPIRED" : "ACTIVE"}
        </div>
      </div>

      {/* Countdown Grid */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
        {TIME_UNITS.map((label, idx) => (
          <CountdownCard key={label} value={countdownValues[idx]} label={label} isHighlight={idx === 4} />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#5C5F80]">Progress</span>
          <span className="text-xs font-bold text-blue-600">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[#E2E6F3] bg-white/50 p-3">
          <p className="text-xs font-semibold uppercase text-[#5C5F80]">Start</p>
          <p className="mt-1 text-sm font-bold text-[#09122D]">
            {start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="rounded-lg border border-[#E2E6F3] bg-white/50 p-3">
          <p className="text-xs font-semibold uppercase text-[#5C5F80]">End</p>
          <p className="mt-1 text-sm font-bold text-[#09122D]">
            {end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Expired Alert */}
      {timeRemaining.isExpired && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
          <span className="text-lg">⚠️</span>
          <span className="text-sm font-semibold text-red-700">Validation period has expired</span>
        </div>
      )}
    </div>
  );
};

export default ValidationCountdown;
