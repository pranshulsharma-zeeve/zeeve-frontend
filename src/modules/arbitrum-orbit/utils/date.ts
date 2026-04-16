import { format, parseISO, intervalToDuration } from "date-fns";

/**
 * to show standard formatted time and make it common throughout the application
 * @param date date object or ISO string
 * @returns
 */
const formatDate = (date?: Date | string) => {
  if (!date) {
    return "NA";
  }

  const isString = typeof date == "string";
  return format(parseISO(isString ? date : date.toISOString()), "dd MMM yyyy, hh:mm:ss a");
};

/**
 * to convert into formatted human readable age string
 * @param startDate starting date object or ISO string
 * @param endDate ending date object or ISO string
 * @returns `staring`
 */
const formatIntoAge = (startDate?: Date | string, endDate?: Date | string): string => {
  if (!startDate || !endDate) {
    return "NA";
  }
  const { years, months, days, hours, minutes, seconds } = intervalToDuration({
    start: new Date(startDate).getTime(),
    end: new Date(endDate).getTime(),
  });

  if (years) {
    return `${years} years ${months} months`;
  } else if (months) {
    return `${months} months ${days} days`;
  } else if (days) {
    return `${days} days ${hours} hours`;
  } else if (hours) {
    return `${hours} hours ${minutes} mins`;
  } else if (minutes) {
    return `${minutes} mins ${seconds} sec`;
  } else {
    return `${seconds} sec`;
  }
};

export { formatDate, formatIntoAge };
