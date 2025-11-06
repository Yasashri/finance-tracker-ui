import { format, parseISO } from "date-fns";

// Taiwan (Asia/Taipei) formatter returning YYYY-MM-DD (en-CA gives ISO-like ordering)
const taipeiDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Taipei",
});

export function fmtMoney(n) {
  const x = Number(n || 0);
  return x.toLocaleString(undefined, {
    style: "currency",
    currency: "NTD",
    maximumFractionDigits: 2,
  });
}

// Parse a variety of date inputs into a Date that represents the local calendar day
// We treat YYYY-MM-DD as a local date (midnight) to avoid timezone shifts.
export function parseToDate(value) {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  const s = String(value).trim();
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/;
  if (dateOnly.test(s)) {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  const dtMatch = s.match(
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/
  );
  if (dtMatch) {
    const [, y, m, d, hh, mm, ss] = dtMatch.map(Number);
    return new Date(y, m - 1, d, hh, mm, ss);
  }
  const parsed = new Date(s);
  if (!isNaN(parsed)) return parsed;
  return new Date();
}

// Return a YYYY-MM-DD string in Taipei timezone for the given value
export function formatToYYYYMMDDTaipei(value) {
  return taipeiDateFormatter.format(parseToDate(value));
}

// Format a value (Date or string) using date-fns format after parsing to a Date
export function fmtDate(value, pattern = "yyyy-MM-dd") {
  const d = parseToDate(value);
  return format(d, pattern);
}

export function ymLabel(ym) {
  const [y, m] = ym.split("-").map(Number);
  const d = parseToDate(`${y}-${String(m).padStart(2, "0")}-01`);
  return format(d, "LLLL yyyy");
}

export { parseISO };
