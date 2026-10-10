export function fmtDate(d?: string | Date | null): string | null {
  if (!d) return null;

  const dt = new Date(d as string);

  if (isNaN(dt.getTime())) return null;

  const hasTime =
    dt.getUTCHours() !== 0 ||
    dt.getUTCMinutes() !== 0 ||
    dt.getUTCSeconds() !== 0;

  if (hasTime) {
    return dt.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return dt.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


/**
 * Convert a stored UTC timestamp into the value expected by
 * HTML date/time inputs, using Indian Standard Time (IST).
 *
 * Returns YYYY-MM-DDTHH:mm or YYYY-MM-DD.
 */
export function toDateTimeLocalValue(
  value?: string | Date | null,
  dateOnly = false
): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const part = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const dateValue =
    `${part("year")}-${part("month")}-${part("day")}`;

  if (dateOnly) return dateValue;

  return `${dateValue}T${part("hour")}:${part("minute")}`;
}

/**
 * Keep a date/time input value as a string.
 * The API will interpret this as IST and convert it to UTC.
 */
export function toDateValue(
  value?: string | null
): string | null {
  if (!value) return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2})?$/.test(trimmed)) {
    return null;
  }

  return trimmed;
}
