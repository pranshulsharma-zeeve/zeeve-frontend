import moment from "moment";

const ALERT_MAX_AGE_DAYS = 15;
const ALERT_CLOCK_FORMATS = ["M/D/YYYY, h:mm:ss A", "M/D/YYYY, hh:mm:ss A"];

const parseAlertClock = (clock: string) => {
  if (!clock) {
    return null;
  }

  const numericClock = Number(clock);
  if (!Number.isNaN(numericClock)) {
    // API may send Unix epoch in seconds (e.g. "1772799496") or milliseconds.
    const isSeconds = clock.length <= 10;
    const parsedUnix = isSeconds ? moment.unix(numericClock) : moment(numericClock);
    if (parsedUnix.isValid()) {
      return parsedUnix;
    }
  }

  const parsed = moment(clock, ALERT_CLOCK_FORMATS, true);
  if (parsed.isValid()) {
    return parsed;
  }

  const fallback = moment(new Date(clock));
  return fallback.isValid() ? fallback : null;
};

const isAlertWithinDays = (clock: string | undefined, maxAgeDays = ALERT_MAX_AGE_DAYS, now = moment()): boolean => {
  const parsed = clock ? parseAlertClock(clock) : null;
  if (!parsed) {
    return false;
  }

  const diffDays = now.diff(parsed, "days", true);
  return diffDays <= maxAgeDays;
};

const filterAlertsWithinDays = <T extends { clock?: string }>(alerts: T[], maxAgeDays = ALERT_MAX_AGE_DAYS): T[] => {
  if (!Array.isArray(alerts)) {
    return [];
  }
  const now = moment();
  return alerts.filter((alert) => isAlertWithinDays(alert.clock, maxAgeDays, now));
};

export { ALERT_MAX_AGE_DAYS, filterAlertsWithinDays, isAlertWithinDays };
