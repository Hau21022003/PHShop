export function extractDay(inputDate: Date | string | number) {
  const date = new Date(inputDate);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return daysOfWeek[date.getDay()];
}

export function extractMonth(inputDate: Date | string | number) {
  const date = new Date(inputDate);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months[date.getMonth()];
}

export const formatDateShort = (inputDate: Date | string | number) => {
  if (!inputDate) return "";

  const date = new Date(inputDate);
  if (isNaN(date.getTime())) return "";

  const monthAbbr = extractMonth(date).slice(0, 3);
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${monthAbbr}, ${day}, ${year}`;
};

export function timeAgo(inputDate: Date | string | number): string {
  const date = new Date(inputDate);
  const now = new Date();

  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(seconds / 31536000);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}
