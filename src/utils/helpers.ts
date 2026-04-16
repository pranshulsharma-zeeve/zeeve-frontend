import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { getPreferredBasePath } from "./path";
import { REST_API_INSTANCE } from "@/constants/auth";
import { NetworkType } from "@/types/common";

dayjs.extend(duration);

/*
 * Returns the passed url with the configured basePath (from next.config.js) prefix.
 * When no basePath is configured, the url is returned as-is.
 * @param url url (e.g. "/url")
 */
type GetAddressBalanceApiRes = {
  balances: {
    denom: string;
    amount: string;
  }[];
};
const withBasePath = (url: string): string => {
  if (typeof url !== "string" || !url.startsWith("/")) {
    return url;
  }

  const basePath = getPreferredBasePath();
  if (!basePath) {
    return url;
  }

  const normalizedBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  if (!normalizedBase || normalizedBase === "/") {
    return url;
  }

  return `${normalizedBase}${url === "/" ? "" : url}`;
};

/**
 * Type for periodic dates
 * @property weekly - Last weekly date
 * @property monthly - Last monthly date
 * @property quarterly - Last quarterly date
 */
type PeriodicDates = {
  weekly: Date;
  monthly: Date;
  quarterly: Date;
};

function getLastIntervalDate(creationDate: Date | string): PeriodicDates {
  const creation = new Date(creationDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date
  creation.setHours(0, 0, 0, 0); // Normalize creation date

  const getLastDate = (intervalDays: number): Date => {
    const diffDays = Math.floor((today.getTime() - creation.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < intervalDays) return new Date(creation);
    const intervalsPassed = Math.floor(diffDays / intervalDays);
    const lastDate = new Date(creation);
    lastDate.setDate(creation.getDate() + intervalsPassed * intervalDays);
    return lastDate < creation ? new Date(creation) : lastDate;
  };

  const getLastMonthlyDate = (months: number): Date => {
    if (today < creation) return new Date(creation);

    const last = new Date(creation);
    const originalDay = creation.getDate();

    let loopGuard = 0;
    const MAX_LOOPS = 1200;

    while (true) {
      loopGuard++;
      if (loopGuard > MAX_LOOPS) {
        console.warn("Loop safety break triggered");
        break;
      }
      const next = new Date(last);
      const previousTime = next.getTime();
      next.setMonth(next.getMonth() + months);
      if (next.getDate() < originalDay) {
        next.setDate(0);
      }
      // // stop if date did not move forward
      if (next.getTime() <= previousTime) {
        break;
      }

      if (next > today) {
        break;
      }
      last.setTime(next.getTime());
    }

    return last < creation ? new Date(creation) : last;
  };

  return {
    weekly: getLastDate(7),
    monthly: getLastMonthlyDate(1),
    quarterly: getLastMonthlyDate(3),
  };
}

// returns the nodeType based on the current path
const getNodeType = () => {
  const path = window.location.pathname;
  return path.includes("full") ? "full" : path.includes("archive") ? "archive" : "validator";
};
/**
 * to capitalize characters of the string
 * @param string string to format
 * @param capitalizeCharacter how characters will capitalize
 * @returns `string`
 */
const toCapitalize = (str: string, capitalizeCharacter: "first" | "all" = "first") => {
  // Handle non-string values
  if (!str || typeof str !== "string") {
    return "";
  }

  if (capitalizeCharacter === "all") {
    return str.toUpperCase();
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * to make the capitalize the first letter
 * @param string string to format
 * @returns `string`
 */
const capitalizeFirstLetter = (value?: string) => {
  if (!value) {
    return "";
  }
  const first = value.charAt(0).toUpperCase();
  return `${first}${value.slice(1)}`;
};

/**
 * to short the string
 * @param string string to format
 * @returns `string`
 */
const toShortString = (string: string, startCharCount = 5, endCharCount = 5) => {
  const finalEndCharCount =
    string?.length - startCharCount > endCharCount
      ? endCharCount
      : string?.length - startCharCount < 0
        ? 0
        : string?.length - startCharCount;
  return `${string?.slice(0, startCharCount)}....${string?.slice(string?.length - finalEndCharCount, string?.length)}`;
};

const convertNumber = (value: string | number | undefined) => {
  if (value === undefined) {
    return "NA";
  }
  const number = typeof value === "number" ? value : parseFloat(value);
  if (Number.isNaN(number)) return "NA";

  return number % 1 !== 0 ? number.toFixed(5) : number.toFixed(0);
};

const formatDate = (date?: Date | string) => {
  if (!date) {
    return "NA";
  }

  const parsed = typeof date === "string" ? new Date(date) : new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "NA";
  }

  const day = parsed.getDate().toString().padStart(2, "0");
  const month = parsed.toLocaleString("en-US", { month: "short" });
  const year = parsed.getFullYear();
  const time = parsed.toLocaleTimeString("en-US", { hour12: true });
  return `${day} ${month} ${year}, ${time}`;
};

/**
 * Formats the time difference between two dates into a human-readable age string.
 *
 * The function calculates the duration between the start and end dates and returns
 * the most significant time units (e.g., years and months, or days and hours).
 *
 * @param startDate - The start date for the age calculation. Can be a Date object or a date string.
 * @param endDate - The end date for the age calculation. Can be a Date object or a date string.
 *
 * @returns A formatted string representing the age/duration between the two dates.
 * Returns "NA" if either date is missing or invalid.
 *
 * @example
 * ```typescript
 * formatIntoAge('2023-01-01', '2024-03-15')
 * // Returns: "1 years 2 months"
 *
 * formatIntoAge('2024-01-01', '2024-01-05')
 * // Returns: "4 days 0 hours"
 *
 * formatIntoAge(undefined, '2024-01-01')
 * // Returns: "NA"
 * ```
 */
const formatIntoAge = (startDate?: Date | string, endDate?: Date | string): string => {
  if (!startDate || !endDate) {
    return "NA";
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) {
    return "NA";
  }

  const diff = dayjs.duration(end.diff(start));

  if (diff.years()) {
    return `${diff.years()} years ${diff.months()} months`;
  }
  if (diff.months()) {
    return `${diff.months()} months ${diff.days()} days`;
  }
  if (diff.days()) {
    return `${diff.days()} days ${diff.hours()} hours`;
  }
  if (diff.hours()) {
    return `${diff.hours()} hours ${diff.minutes()} mins`;
  }
  if (diff.minutes()) {
    return `${diff.minutes()} mins ${diff.seconds()} sec`;
  }
  return `${diff.seconds()} sec`;
};
/**
 * to formate number into required notation
 * @param number value in number or string
 * @param notation type of notation
 * @param spaced to give space between number and unit
 * @returns
 */
const formateNumber = (
  number: number | string,
  decimalPlaces = 10,
  notation: "standard" | "scientific" | "engineering" | "compact" = "standard",
  spaced = false,
): string => {
  const regexAlphabet = new RegExp(/^[a-zA-Z]+$/);
  const string = new Intl.NumberFormat("en", {
    notation,
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPlaces,
  }).format(typeof number === "number" ? number : parseFloat(number));
  return spaced && regexAlphabet.test(string.slice(-1)) ? `${string.slice(0, -1)} ${string.slice(-1)}` : string;
};

const divideValueByDecimals = (value: string | undefined, decimals: string | number, precision: number): string => {
  if (!value) return "NA";

  return new BigNumber(value)
    .dividedBy(BigNumber(10 ** Number(decimals ?? 18)))
    .decimalPlaces(precision)
    .toFixed();
};
/**
 * to short the string
 * @param string string to format
 * @returns `string`
 */
const kebabToTitleCase = (string: string): string => {
  return string
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/***
 * format the near amount
 * @param string string to format
 * @returns `string`
 */
const formatNearAmount = (nearBalance: string): string => {
  // Ensure nearBalance is a valid string
  if (typeof nearBalance !== "string") {
    return "Invalid balance Ⓝ";
  }

  // Pad the balance to ensure it has at least 24 digits
  const paddedBalance = nearBalance.padStart(25, "0");

  // Split the integer and fractional parts
  const integerPart = paddedBalance.slice(0, -24);
  const fractionalPart = paddedBalance.slice(-24, -19); // Show only first 5 fractional digits

  // Format the integer part with commas
  const formattedIntegerPart = Number(integerPart).toLocaleString();

  // Combine integer and fractional parts
  return `${formattedIntegerPart}.${fractionalPart} Ⓝ`;
};

/**
 * Removes the decimal values from a numeric string.
 * @param {string | null} value - The string representation of a number, or null.
 * @returns {number | string} The value without decimals, or "NA" if the input is null.
 */
function removeDecimals(value: string | null): number | string {
  const numericValue = Number(value);
  // Truncate the number to remove decimals
  return Math.trunc(numericValue);
}

const calculatePercentage = (regularMonthly: number, totalPeriodPrice: number, months: number) => {
  const equivalentMonthlyPrice = totalPeriodPrice / months;
  return (((regularMonthly - equivalentMonthlyPrice) / regularMonthly) * 100).toFixed(2);
};

const capitalizeRegion = (region: unknown): string => {
  // Accept string, string[], or any value; produce a human-friendly string
  if (Array.isArray(region)) {
    return region.map((r) => capitalizeRegion(r)).join(", ");
  }
  const value = typeof region === "string" ? region : String(region ?? "");
  if (!value) return "";
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
};

const getTimeDiffrenceInHrs = (time: string) => {
  const t2 = new Date();
  const t1 = new Date(time);
  const timeDiffInMs = Math.abs(t2.getTime() - t1.getTime());
  return timeDiffInMs / (1000 * 60 * 60);
};

/**
 * Converts a dash-separated string (e.g., "UPDATE-VALIDATOR-NAME")
 * into a capitalized space-separated format (e.g., "Update Validator Name").
 *
 * - Converts the entire string to lowercase first.
 * - Splits the string by dashes.
 * - Capitalizes the first letter of each word.
 * - Joins the words back with spaces.
 *
 * @param input - The dash-separated input string.
 * @returns A formatted string with each word capitalized and dashes replaced by spaces.
 */
const formatDashedString = (input: string): string => {
  return input
    .toLowerCase()
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// convert utestcore/ucore to testcore/core unit
const convertMicroToUnit = (value: number | string) => Number(value) / 1e6;

// get explorer url and notation for coreum validator node
const getExplorerUrl = (networkType: string) => {
  switch (networkType) {
    case "mainnet":
      return {
        href: "https://explorer.coreum.com",
        notation: "CORE",
      };

    case "testnet":
    default:
      return {
        href: "https://explorer.testnet-1.coreum.dev",
        notation: "TESTCORE",
      };
  }
};

const getRestakeUrl = (networkType: string, validatorAddr: string | undefined) => {
  switch (networkType) {
    case "testnet":
      return {
        href: "https://testnet.restake.app/coreumtestnet/" + validatorAddr,
        notation: "CORE",
      };

    case "mainnet":
    default:
      return {
        href: "https://restake.app/coreum/" + validatorAddr,
        notation: "TESTCORE",
      };
  }
};
// const getExpiryDateFromLifetime = (lifetime?: string): string => {
//   if (!lifetime) return "N/A";

//   let match = lifetime.match(/^\d+$/);
//   if (!match) {
//     match = lifetime.match(/^(\d+)d$/);
//     if (!match) {
//       return "Invalid";
//     }
//   }

//   const days = parseInt(match[1], 10);
//   const expiryDate = new Date();
//   expiryDate.setDate(expiryDate.getDate() + days);

//   const day = String(expiryDate.getDate()).padStart(2, "0");
//   const month = String(expiryDate.getMonth() + 1).padStart(2, "0");
//   const year = expiryDate.getFullYear();
//   return `${day}/${month}/${year}`;
// };

const truncateMiddle = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) {
    return value;
  }
  const half = Math.floor((maxLength - 3) / 2);
  return `${value.slice(0, half)}...${value.slice(-half)}`;
};

const validateInput = (key: string, value: string): string | null => {
  const trimmedValue = value.trim();

  // identity, email, and description are optional in Cosmos
  if (!trimmedValue && key !== "validatorIdentity" && key !== "email" && key !== "description") {
    return `${key} is required.`;
  }

  switch (key) {
    case "validatorName": {
      // Cosmos allows up to 70 chars, underscores & dots are common
      const nameRegex = /^[A-Za-z0-9\s._-]{3,70}$/;
      if (!nameRegex.test(trimmedValue)) {
        return "Validator name must be 3–70 characters and can contain letters, numbers, spaces, dots, underscores, or hyphens.";
      }
      break;
    }

    case "validatorIdentity": {
      // Keybase PGP fingerprint (optional)
      const identityRegex = /^[A-Fa-f0-9]{0,64}$/;
      if (!identityRegex.test(trimmedValue)) {
        return "Validator identity must be a hexadecimal string up to 64 characters.";
      }
      break;
    }

    case "description": {
      if (trimmedValue.length > 280) {
        return "Description must be 280 characters or fewer.";
      }
      break;
    }

    // case "commissionRate": {
    //   // UI input as percentage (0–100), decimals allowed
    //   const commissionRegex = /^(100(\.0+)?|[0-9]{1,2}(\.\d{1,2})?)$/;
    //   if (!commissionRegex.test(trimmedValue)) {
    //     return "Commission rate must be between 0 and 100 (up to 2 decimal places).";
    //   }
    //   break;
    // }

    case "email": {
      if (trimmedValue.length > 140) {
        return "Email must be 140 characters or fewer.";
      }
      break;
    }

    case "website": {
      try {
        new URL(trimmedValue);
      } catch {
        return "Please enter a valid website URL.";
      }
      break;
    }

    default:
      break;
  }

  return null;
};

/**
 * to download the file using the provided content
 * @param data file stringified content
 * @param name file name
 * @param mimeType file content type
 * @returns `void`
 */
const downloadFile = (
  data: string | Blob,
  name: string,

  mimeType:
    | "application/json"
    | "application/octet-stream"
    | "application/x-pem-file"
    | "text/plain" = "application/json",
) => {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function formatDateToReadableString(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
    // timeZoneName: "short",
  };
  return date.toLocaleString(undefined, options).replace(",", " at");
}

/** get balance of the address */
const getAddressBalanceApi = async (network: NetworkType, address: string): Promise<GetAddressBalanceApiRes> => {
  const res = await REST_API_INSTANCE[network].get(`/cosmos/bank/v1beta1/balances/${address}`);
  return res.data;
};

/** Get expiry date from lifetime */
function getExpiryDateFromLifetime(lifetime?: string): string {
  if (!lifetime) return "N/A";

  let match = lifetime.match(/^(\d+)$/); // match "7d", "30d", etc.
  if (!match) {
    match = lifetime.match(/^(\d+)d$/);
    if (!match) {
      return "Invalid";
    }
  }

  const days = parseInt(match[1], 10);
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);

  const day = String(expiryDate.getDate()).padStart(2, "0");
  const month = String(expiryDate.getMonth() + 1).padStart(2, "0");
  const year = expiryDate.getFullYear(); // Get full year
  return `${day}/${month}/${year}`;
}

export {
  toShortString,
  getLastIntervalDate,
  kebabToTitleCase,
  withBasePath,
  capitalizeFirstLetter,
  divideValueByDecimals,
  formateNumber,
  toCapitalize,
  formatNearAmount,
  removeDecimals,
  getNodeType,
  calculatePercentage,
  capitalizeRegion,
  getTimeDiffrenceInHrs,
  formatDashedString,
  convertMicroToUnit,
  getExplorerUrl,
  validateInput,
  getRestakeUrl,
  getExpiryDateFromLifetime,
  truncateMiddle,
  downloadFile,
  getAddressBalanceApi,
  convertNumber,
  formatDate,
  formatIntoAge,
  formatDateToReadableString,
};
