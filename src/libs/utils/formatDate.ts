import { DateTime } from "luxon";

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};

export const timeAgo = (date: string): string | null => {
  const parsedDate = DateTime.fromISO(date);
  if (!parsedDate.isValid) {
    return `Invalid Date`;
  }

  return parsedDate.toRelative({ style: "short" });
};
