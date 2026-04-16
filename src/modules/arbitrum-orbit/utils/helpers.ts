import { format, parseISO, intervalToDuration } from "date-fns";

/**
 * Returns passed url with basePath (from next.config.js) prefix.
 * @param url url (e.g. "/url")
 */
const withBasePath = (url: string): string => {
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    return `${process.env.NEXT_PUBLIC_BASE_PATH}${url}`;
  }
  return url;
};

/**
 * to copy content.source to clipboard
 * @param src source that to be copied
 * @returns
 */
const copyToClipboard = (src: string): void => {
  if (navigator) navigator.clipboard.writeText(src);
};

const copyText = (val: string, fieldType: string) => {
  const element: HTMLElement | null = document.getElementById(val);
  if (element) {
    let txt = "";
    if (fieldType === "input") {
      txt = element.getAttribute("value") || "";
    } else {
      txt = element.innerText || "";
    }
    copyToClipboard(txt);
  }
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

const convertNumber = (value: string | number | undefined) => {
  if (value === undefined) {
    return "NA";
  }
  const number = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(number)) return "NA";

  const roundedString = number.toFixed(number % 1 !== 0 ? 5 : 0);
  return roundedString;
};

/**
 * to formate number into required notation
 * @param number value in number
 * @param notation type of notation
 * @param spaced to give space between number and unit
 * @returns
 */
const formatNumber = (
  number: number | string,
  notation: "standard" | "scientific" | "engineering" | "compact" = "compact",
  spaced = false,
): string => {
  const regexAlphabet = new RegExp(/^[a-zA-Z]+$/);
  const string = new Intl.NumberFormat("en", { notation }).format(
    typeof number === "string" ? parseFloat(number) : number,
  );
  return spaced && regexAlphabet.test(string.slice(-1)) ? `${string.slice(0, -1)} ${string.slice(-1)}` : string;
};

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
  try {
    return format(parseISO(isString ? date : date.toISOString()), "dd MMM yyyy, hh:mm:ss a");
  } catch (error) {
    console.log(error);
  }

  return "NA";
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

/**
 * to short the string
 * @param string string to format
 * @returns `string`
 */
const toShortString = (string: string, startCharCount = 5, endCharCount = 5) => {
  if (string.length <= startCharCount) return string;
  const finalEndCharCount =
    string.length - startCharCount > endCharCount
      ? endCharCount
      : string.length - startCharCount < 0
        ? 0
        : string.length - startCharCount;
  return `${string.slice(0, startCharCount)}....${string.slice(string.length - finalEndCharCount, string.length)}`;
};

/**
 * to capitalize characters of the string
 * @param string string to format
 * @param capitalizeCharacter how characters will capitalize
 * @returns `string`
 */
const toCapitalize = (string: string, capitalizeCharacter: "first" | "all" = "first") => {
  if (capitalizeCharacter === "all") {
    return string.toUpperCase();
  }
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

/***
 * convert wei to eth
 * @param wei wei balance
 */
const weiToEth = (wei: string): string => {
  const weiValue = parseInt(wei);
  if (weiValue === 0) return "0";
  const ether = weiValue / 1e18;
  return ether.toFixed(4);
};

/***
 * calcualte how many days left in trial period
 * @param end date of trial period
 */

const calculateDaysLeft = (end: Date): number => {
  // Input dates
  const currentDate = new Date();
  const endDate = new Date(end);

  // Calculate the difference in milliseconds
  const timeDiff = endDate.getTime() - currentDate.getTime();

  // Convert milliseconds to days
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

  // Round down to get the whole number of days
  const daysLeft = Math.floor(daysDiff);

  return daysLeft;
};

/***
 * To validate the URL links if it includes https or not.
 * if not then append the 'https://' in the beginning of URL
 * @returns `string`
 */

const formatURL = (url: string): string => {
  // Check whether the url includes 'https' already, if not then append it.
  const formattedUrl = url.includes("https://") ? url : `https://${url}`;
  return formattedUrl;
};

export {
  withBasePath,
  copyToClipboard,
  copyText,
  downloadFile,
  convertNumber,
  formatNumber,
  formatIntoAge,
  formatDate,
  toShortString,
  toCapitalize,
  weiToEth,
  calculateDaysLeft,
  formatURL,
};
