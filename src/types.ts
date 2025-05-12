export enum ICalEventRepeatingFreq {
    DAILY = 'DAILY',
    HOURLY = 'HOURLY',
    MINUTELY = 'MINUTELY',
    MONTHLY = 'MONTHLY',
    SECONDLY = 'SECONDLY',
    WEEKLY = 'WEEKLY',
    YEARLY = 'YEARLY',
}

export enum ICalWeekday {
    FR = 'FR',
    MO = 'MO',
    SA = 'SA',
    SU = 'SU',
    TH = 'TH',
    TU = 'TU',
    WE = 'WE',
}

/**
 * ical-generator supports [native Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date),
 * [moment.js](https://momentjs.com/) (and [moment-timezone](https://momentjs.com/timezone/), [Day.js](https://day.js.org/en/) and
 * [Luxon](https://moment.github.io/luxon/)'s [DateTime](https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html)
 * objects. You can also pass a string which is then passed to javascript's Date internally.
 */
export type ICalDateTimeValue =
    | Date
    | ICalDayJsStub
    | ICalLuxonDateTimeStub
    | ICalMomentStub
    | ICalMomentTimezoneStub
    | string;

export interface ICalDayJsStub {
    format(format?: string): string;
    isValid(): boolean;
    toDate(): Date;
    toJSON(): string;
    tz(zone?: string): ICalDayJsStub;
    utc(): ICalDayJsStub;
}

export interface ICalDescription {
    html?: string;
    plain: string;
}

export interface ICalGeo {
    lat: number;
    lon: number;
}

export type ICalLocation = ICalLocationWithoutTitle | ICalLocationWithTitle;

export interface ICalLocationWithoutTitle {
    geo: ICalGeo;
}

export interface ICalLocationWithTitle {
    address?: string;
    geo?: ICalGeo;
    radius?: number;
    title: string;
}

export interface ICalLuxonDateTimeStub {
    get isValid(): boolean;
    setZone(zone?: string): ICalLuxonDateTimeStub;
    toFormat(fmt: string): string;
    toJSDate(): Date;
    toJSON(): null | string;
    zone: { type: string };
}

export interface ICalMomentDurationStub {
    asSeconds(): number;
}

export interface ICalMomentStub {
    clone(): ICalMomentStub;
    format(format?: string): string;
    isValid(): boolean;
    toDate(): Date;
    toJSON(): string;
    utc(): ICalMomentStub;
}

export interface ICalMomentTimezoneStub extends ICalMomentStub {
    clone(): ICalMomentTimezoneStub;
    tz(): string | undefined;
    tz(timezone: string): ICalMomentTimezoneStub;
    utc(): ICalMomentTimezoneStub;
}

export interface ICalOrganizer {
    email?: string;
    mailto?: string;
    name: string;
    sentBy?: string;
}

export interface ICalRepeatingOptions {
    byDay?: ICalWeekday | ICalWeekday[];
    byMonth?: number | number[];
    byMonthDay?: number | number[];
    bySetPos?: number | number[];
    count?: number;
    exclude?: ICalDateTimeValue | ICalDateTimeValue[];
    freq: ICalEventRepeatingFreq;
    interval?: number;
    startOfWeek?: ICalWeekday;
    until?: ICalDateTimeValue;
}

export interface ICalRRuleStub {
    between(
        after: Date,
        before: Date,
        inc?: boolean,
        iterator?: (d: Date, len: number) => boolean,
    ): Date[];
    toString(): string;
}

export interface ICalTimezone {
    generator?: (timezone: string) => null | string;
    name: null | string;
}

export interface ICalTZDateStub extends Date {
    timeZone?: string;
    withTimeZone(timezone?: null | string): ICalTZDateStub;
}
