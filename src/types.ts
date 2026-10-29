export enum ICalEventRepeatingFreq {
    DAILY = 'DAILY',
    HOURLY = 'HOURLY',
    MINUTELY = 'MINUTELY',
    MONTHLY = 'MONTHLY',
    SECONDLY = 'SECONDLY',
    WEEKLY = 'WEEKLY',
    YEARLY = 'YEARLY',
}

/**
 * Used in ICalEvent.travelTime()
 *
 * Controls whether Apple clients give suggestions like "Time to leave" notifications, route prompts in Apple Maps, etc.
 */
export enum ICalEventTravelTimeSuggestion {
    AUTOMATIC = 'AUTOMATIC',
    DISABLED = 'DISABLED',
    ENABLED = 'ENABLED',
}

/**
 * Used in ICalEvent.travelTime()
 *
 * Controls which mode of transportation is used by Apple Calendar clients for calculating travel time and suggesting routes
 */
export enum ICalEventTravelTimeTransportation {
    BICYCLE = 'BICYCLE',
    CAR = 'CAR',
    TRANSIT = 'TRANSIT',
    WALKING = 'WALKING',
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
 * [moment.js](https://momentjs.com/) (and [moment-timezone](https://momentjs.com/timezone/), [Day.js](https://day.js.org/en/),
 * [Luxon](https://moment.github.io/luxon/)'s [DateTime](https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html)
 * and [Temporal](https://tc39.es/proposal-temporal/docs/) objects. You can also pass a string which is then passed to javascript's Date internally.
 */
export type ICalDateTimeValue =
    | Date
    | ICalDayJsStub
    | ICalLuxonDateTimeStub
    | ICalMomentStub
    | ICalMomentTimezoneStub
    | ICalTemporalInstantStub
    | ICalTemporalPlainDateStub
    | ICalTemporalPlainDateTimeStub
    | ICalTemporalZonedDateTimeStub
    | string;

export interface ICalDayJsStub {
    format(format?: string): string;
    isValid(): boolean;
    toDate(): Date;
    toJSON(): string;
    tz?(zone?: string): ICalDayJsStub;
    utc?(): ICalDayJsStub;
}

export interface ICalDescription {
    html?: string;
    plain: string;
}

export interface ICalEventTravelTime {
    seconds: number;
    startFrom?: {
        location: ICalLocation;
        transportation: ICalEventTravelTimeTransportation;
    };
    suggestionBehavior?: ICalEventTravelTimeSuggestion;
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
    email: string;
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

export interface ICalTemporalInstantStub {
    epochMilliseconds: number;
    epochSeconds?: number;
    toJSON(): string;
    toString(): string;
    toZonedDateTimeISO(timeZone: string): ICalTemporalZonedDateTimeStub;
}

export interface ICalTemporalPlainDateStub {
    day: number;
    month: number;
    toJSON(): string;
    toString(): string;
    year: number;
}

export interface ICalTemporalPlainDateTimeStub {
    day: number;
    hour: number;
    minute: number;
    month: number;
    second: number;
    toJSON(): string;
    toPlainDate(): ICalTemporalPlainDateStub;
    toString(): string;
    toZonedDateTime(timeZone: string): ICalTemporalZonedDateTimeStub;
    year: number;
}

export interface ICalTemporalZonedDateTimeStub {
    day: number;
    hour: number;
    minute: number;
    month: number;
    second: number;
    timeZoneId: string;
    toInstant(): ICalTemporalInstantStub;
    toJSON(): string;
    toPlainDateTime(): ICalTemporalPlainDateTimeStub;
    toString(): string;
    withTimeZone(timeZone: string): ICalTemporalZonedDateTimeStub;
    year: number;
}

export interface ICalTimezone {
    generator?: (timezone: string) => null | string;
    name: null | string;
}

export interface ICalTZDateStub extends Date {
    timeZone?: string;
    withTimeZone(timezone?: null | string): ICalTZDateStub;
}
