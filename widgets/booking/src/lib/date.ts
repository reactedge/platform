import type {DaysType, WeeksType} from "../types/domain/bookingsystem.type.ts";

export const getDays = (): DaysType[] => {
    const current = new Date()
    const week = [];
    // Starting Monday not Sunday
    const first = current.getDate() - current.getDay() + 1;
    current.setDate(first);
    for (let i = 0; i < 7; i++) {
        week.push({
            day: current.toLocaleString('en-GB', {  weekday: 'long' }).toLowerCase(),
            dayLabel: current.toLocaleString('en-GB', {  weekday: 'long' })
        });
        current.setDate(current.getDate()+1);
    }

    return week;
}

export function maxDate(a: Date, b: Date): Date {
    return a > b ? a : b;
}

const getWeekLabel = (index: number) => {
    switch (index) {
        case 0:
            return 'This week'
        case 1:
            return 'Next week'
        default:
            return `in ${index} weeks`
    }
}

const getDateWithoutTime = (date: Date) => {
    return date.toISOString().split('T')[0]
}

export const getDayTimeStart = (date: Date) => {
    const day = getDateWithoutTime(date)

    return `${day}T00:00:00.101Z`
}

export const getDayTimeEnd = (date: Date) => {
    const day = getDateWithoutTime(date)
    return `${day}T23:59:59.101Z`
}

export const getDateInNumberDays = (days: number) => {
    const current = new Date()
    current.setDate(current.getDate()+ days);

    return current
}

export const getWeeks = (scheduleWeekSpan: number): WeeksType[] => {
    const current = new Date()
    const week = [];
    // Starting Monday not Sunday
    const first = current.getDate() - current.getDay() + 1;
    current.setDate(first);
    for (let i = 0; i < scheduleWeekSpan; i++) {
        week.push({
            weekStart: getDayTimeStart(current),
            weekLabel: getWeekLabel(i)
        });
        current.setDate(current.getDate()+7);
    }

    return week;
}

export const getTime = (time: string) => {
    if (time === undefined) return ''

    const date = new Date(time)
    let min = date.getMinutes().toString()

    if (min.length === 1) {
        min = "0" + min.toString();
    }

    let hour = date.getHours().toString()
    if (hour.length === 1) {
        hour = "0" + hour.toString();
    }
    return `${hour}:${min}`
}

export const getDate = (time: string) => {
    const date = new Date(time)
    return date.toLocaleDateString('en-GB', { year:"numeric", month:"short", day:"numeric"})
}

export function getWeekRangeLabel(
    weekStart: string
): string {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 7 - 1);

    const weekNumber = getISOWeekNumber(start);

    const format = (d: Date) =>
        d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });

    return `Week ${weekNumber} (${format(start)} – ${format(end)})`;
}

function getISOWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function getWeekRangeInfo(
    weekStart: string,
    spanInWeeks = 1
) {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + spanInWeeks * 7 - 1);

    return {
        weekNumber: getISOWeekNumber(start),
        startDate: start,
        endDate: end,
    };
}

export function formatShortDate(d: Date) {
    const format = (d: Date) =>
        d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });

    return format(d);
}
