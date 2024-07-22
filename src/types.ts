/**
 * ical-generator supports [native Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date),
 * [moment.js](https://momentjs.com/) (and [moment-timezone](https://momentjs.com/timezone/), [Day.js](https://day.js.org/en/) and
 * [Luxon](https://moment.github.io/luxon/)'s [DateTime](https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html)
 * objects. You can also pass a string which is then passed to javascript's Date internally.
 */
export type ICalDateTimeValue = Date | ICalMomentStub | ICalMomentTimezoneStub | ICalLuxonDateTimeStub | ICalDayJsStub | string;

export interface ICalRepeatingOptions {
    freq: ICalEventRepeatingFreq;
    count?: number;
    interval?: number;
    until?: ICalDateTimeValue;
    byDay?: ICalWeekday[] | ICalWeekday;
    byMonth?: number[] | number;
    byMonthDay?: number[] | number;
    bySetPos?: number[] | number;
    exclude?: ICalDateTimeValue[] | ICalDateTimeValue;
    startOfWeek?: ICalWeekday;
}

export type ICalLocation = ICalLocationWithTitle | ICalLocationWithoutTitle;

export interface ICalLocationWithTitle {
    title: string;
    address?: string;
    radius?: number;
    geo?: ICalGeo;
}

export interface ICalLocationWithoutTitle {
    geo: ICalGeo;
}

export interface ICalGeo {
    lat: number;
    lon: number;
}

export interface ICalOrganizer {
    name: string;
    email?: string;
    mailto?: string;
    sentBy?: string;
}

export interface ICalDescription {
    plain: string;
    html?: string;
}

export interface ICalTimezone {
    name: string | null;
    generator?: (timezone: string) => string|null;
}

export interface ICalMomentStub {
    format(format?: string): string;
    clone(): ICalMomentStub;
    utc(): ICalMomentStub;
    toDate(): Date;
    isValid(): boolean;
    toJSON(): string;
}

export interface ICalMomentTimezoneStub extends ICalMomentStub {
    clone(): ICalMomentTimezoneStub;
    utc(): ICalMomentTimezoneStub;
    tz(): string | undefined;
    tz(timezone: string): ICalMomentTimezoneStub;
}

export interface ICalMomentDurationStub {
    asSeconds(): number;
}

export interface ICalLuxonDateTimeStub {
    setZone(zone?: string): ICalLuxonDateTimeStub;
    zone: { type: string; };
    toFormat(fmt: string): string;
    toJSDate(): Date;
    get isValid(): boolean;
    toJSON(): string | null;
}

export interface ICalDayJsStub {
    tz(zone?: string): ICalDayJsStub;
    utc(): ICalDayJsStub;
    format(format?: string): string;
    toDate(): Date;
    isValid(): boolean;
    toJSON(): string;
}

export interface ICalRRuleStub {
    between(after: Date, before: Date, inc?: boolean, iterator?: (d: Date, len: number) => boolean): Date[];
    toString(): string;
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
