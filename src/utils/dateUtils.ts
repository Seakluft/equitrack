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
      // Standard rule: school holidays in France usually start on a Saturday AFTER classes.
      // So the Saturday of the start_date is often the last day of class.
      // However, the API often marks start_date as the Saturday morning.
      // We will consider it a holiday ONLY if it's strictly AFTER the start_date 
      // OR if the description doesn't imply it's the start day.
      
      // If it's the very first day of holidays (Saturday), it's usually the last lesson.
      if (isSameDay(sDay, holidayStart)) {
        return false; 
      }
      return true;
    }
  }
  return false;
};

export const formatID = (date: Date): string => format(date, 'yyyy-MM-dd');
