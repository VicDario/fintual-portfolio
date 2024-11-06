import {
    isFuture,
    isWeekend,
    nextMonday,
    previousFriday,
    subBusinessDays,
} from "date-fns";

export interface IDateUtils {
    isWeekend(date: Date): boolean;
    isFuture(date: Date): boolean;
    nextMonday(date: Date): Date;
    previousFriday(date: Date): Date;
    subBusinessDays(date: Date, amount: number): Date;
}

/**
 * Wrapper for datefns
 */
class DateUtils implements IDateUtils {
    isFuture(date: Date): boolean {
        return isFuture(date);
    }
    subBusinessDays(date: Date, amount: number): Date {
        return subBusinessDays(date, amount);
    }
    isWeekend(date: Date): boolean {
        return isWeekend(date);
    }
    nextMonday(date: Date): Date {
        return nextMonday(date);
    }
    previousFriday(date: Date): Date {
        return previousFriday(date);
    }
}

export default DateUtils;