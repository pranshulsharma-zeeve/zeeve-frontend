export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

export const updateTime = (oldDate: Date, type: "SECOND" | "MINUTE" | "HOUR" | "DAY", value: number): Date => {
  let updatedTime = oldDate;
  switch (type) {
    case "SECOND":
      updatedTime = new Date(oldDate.getTime() + value * SECOND);
      break;
    case "MINUTE":
      updatedTime = new Date(oldDate.getTime() + value * MINUTE);
      break;

    case "HOUR":
      updatedTime = new Date(oldDate.getTime() + value * HOUR);
      break;

    case "DAY":
      updatedTime = new Date(oldDate.getTime() + value * DAY);
      break;

    default:
      break;
  }
  return updatedTime;
};
