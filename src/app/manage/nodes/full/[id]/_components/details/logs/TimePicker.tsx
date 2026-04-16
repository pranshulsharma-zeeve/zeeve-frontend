"use client";

import { Button, Label } from "@zeeve-platform/ui";
import { Dispatch, SetStateAction, useState } from "react";
import { format, parse } from "date-fns";
import { IconXMark } from "@zeeve-platform/icons/essential/outline";
import { MINUTE } from "@/utils/time";

function isValidDateTime(value: string) {
  const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  if (!datetimeRegex.test(value)) return false;

  const [datePart, timePart] = value.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  const date = new Date(`${datePart}T${timePart}`);
  if (isNaN(date.getTime())) return false;

  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day &&
    date.getHours() === hour &&
    date.getMinutes() === minute &&
    date.getSeconds() === second
  );
}

interface TimeRangePickerProps {
  setShowTimePicker: Dispatch<SetStateAction<boolean>>;
  setQueryParams: Dispatch<SetStateAction<{ endTime: Date; startTime: Date }>>;
}

const TimeRangePicker = ({ setShowTimePicker, setQueryParams }: TimeRangePickerProps) => {
  const [fromDateTime, setFromDateTime] = useState<string>(
    format(new Date(new Date().getTime() - 5 * MINUTE), "yyyy-MM-dd HH:mm:ss"),
  );
  const [toDateTime, setToDateTime] = useState<string>(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
  const [error, setError] = useState<string>("");

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDateTime(e.target.value);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDateTime(e.target.value);
  };

  const handleApply = () => {
    if (!isValidDateTime(fromDateTime)) {
      setError("Invalid 'From' datetime.");
      return;
    }

    if (!isValidDateTime(toDateTime)) {
      setError("Invalid 'To' datetime.");
      return;
    }

    setError("");
    let finalFrom = fromDateTime;
    let finalTo = toDateTime;

    // Swap strings if needed for valid range
    if (new Date(fromDateTime) > new Date(toDateTime)) {
      finalTo = fromDateTime;
      finalFrom = toDateTime;
      setToDateTime(finalTo);
      setFromDateTime(finalFrom);
    }
    console.log(`Applied Time Range:\nFrom: ${finalFrom}\nTo: ${finalTo}`);
    const parsedFromDate = parse(finalFrom, "yyyy-MM-dd HH:mm:ss", new Date());
    const parsedToDate = parse(finalTo, "yyyy-MM-dd HH:mm:ss", new Date());

    setQueryParams({
      startTime: parsedFromDate,
      endTime: parsedToDate,
    });
    setShowTimePicker(false);
  };

  return (
    <div className="relative bottom-96 left-0 rounded-lg bg-gray-900 text-white shadow md:bottom-80 md:left-56">
      <div className="flex justify-between p-2 pb-0">
        <h2 className="ml-3 mt-3 text-lg font-semibold">Absolute Time Range</h2>
        <IconXMark className="size-5 cursor-pointer" onClick={() => setShowTimePicker(false)} />
      </div>

      <div className="p-6">
        <div className="mb-4 space-y-2">
          <Label className="block text-sm text-gray-300">From</Label>
          <input
            type="text"
            value={fromDateTime}
            onChange={handleFromChange}
            placeholder="YYYY-MM-DD HH:MM:SS"
            className="w-full rounded border border-gray-600 bg-gray-700 p-2 text-white"
          />
        </div>

        <div className="mb-8 space-y-2">
          <Label className="block text-sm text-gray-300">To</Label>
          <input
            type="text"
            value={toDateTime}
            onChange={handleToChange}
            placeholder="YYYY-MM-DD HH:MM:SS"
            className="w-full rounded border border-gray-600 bg-gray-700 p-2 text-white"
          />
        </div>

        {error && <p className="mb-2 text-sm text-brand-red">{error}</p>}
        <Button onClick={handleApply} className="w-full rounded p-2">
          Apply Time Range
        </Button>
      </div>
    </div>
  );
};

export default TimeRangePicker;
