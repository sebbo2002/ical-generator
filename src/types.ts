import type {Moment} from 'moment';
import type {Moment as MomentTZ} from 'moment-timezone';
import type {Dayjs} from 'dayjs';
import type {DateTime as LuxonDateTime} from 'luxon';


/**
 * ical-generator supports [native Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date),
 * [moment.js](https://momentjs.com/) (and [moment-timezone](https://momentjs.com/timezone/), [Day.js](https://day.js.org/en/) and
 * [Luxon](https://moment.github.io/luxon/)'s [DateTime](https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html)
 * objects. You can also pass a string which is then passed to javascript's Date internally.
 */
export type ICalDateTimeValue = Date | Moment | MomentTZ | Dayjs | LuxonDateTime | string;

export interface ICalRepeatingOptions {
    freq: ICalEventRepeatingFreq;
    count?: number;
    interval?: number;
    until?: ICalDateTimeValue;
    byDay?: ICalWeekday[] | ICalWeekday;
    byMonth?: number[] | number;
    byMonthDay?: number[] | number;
    bySetPos?: number;
    exclude?: ICalDateTimeValue[] | ICalDateTimeValue;
    startOfWeek?: ICalWeekday;
}

export interface ICalLocation {
    title: string;
    address?: string;
    radius?: number;
    geo?: ICalGeo;
}

export interface ICalGeo {
    lat: number;
    lon: number;
}

export interface ICalOrganizer {
    name: string;
    email?: string;
    mailto?: string;
}

export interface ICalDescription {
    plain: string;
    html?: string;
}

export interface ICalTimezone {
    name: string | null;
    generator?: (timezone: string) => string|null;
}

export enum ICalEventRepeatingFreq {
    SECONDLY = 'SECONDLY',
    MINUTELY = 'MINUTELY',
    HOURLY = 'HOURLY',
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY'
}

export enum ICalWeekday {
    SU = 'SU',
    MO = 'MO',
    TU = 'TU',
    WE = 'WE',
    TH = 'TH',
    FR = 'FR',
    SA = 'SA'
}
