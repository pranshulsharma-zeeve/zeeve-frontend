const setCookie = (name: string, value: string, timeInMin?: number, toExpire = false): void => {
  let expires = "";
  if (typeof timeInMin === "number") {
    const date = new Date();
    date.setTime(date.getTime() + timeInMin * 60 * 1000);
    expires = ";expires=" + date.toUTCString();
  } else if (toExpire) {
    expires = ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) {
    return match[2];
  }
  return null;
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export { setCookie, getCookie, deleteCookie };
