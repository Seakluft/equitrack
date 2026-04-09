import { addDays, eachDayOfInterval, format, isSaturday, isSameDay, startOfDay, parseISO } from 'date-fns';
import type { Holiday } from '../types';

export const getSaturdays = (start: string, end: string): Date[] => {
  const interval = { start: parseISO(start), end: parseISO(end) };
  return eachDayOfInterval(interval)
    .filter((date) => isSaturday(date))
    .map((date) => startOfDay(date));
};

export const isHolidaySaturday = (saturday: Date, holidays: Holiday[]): boolean => {
  const sDay = startOfDay(saturday);

  for (const holiday of holidays) {
    const holidayStart = startOfDay(parseISO(holiday.start_date));
    const holidayEnd = startOfDay(parseISO(holiday.end_date));

    // If Saturday falls within the holiday interval
    if (sDay >= holidayStart && sDay <= holidayEnd) {
      // Rule: If courses end Friday (start_date), Saturday (day after) is still a lesson.
      // So if Saturday is holidayStart or holidayStart + 1 day, it's still a lesson day.
      const dayAfterStart = addDays(holidayStart, 1);
      if (isSameDay(sDay, holidayStart) || isSameDay(sDay, dayAfterStart)) {
        return false; // Not a "hidden" holiday Saturday
      }
      return true; // Hidden holiday Saturday
    }
  }
  return false; // Regular lesson day
};

export const formatID = (date: Date): string => format(date, 'yyyy-MM-dd');
