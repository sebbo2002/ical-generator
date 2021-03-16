import {Moment} from 'moment';
import {Moment as MomentTZ} from 'moment-timezone';
import {Dayjs} from 'dayjs';
import {DateTime as LuxonDateTime} from 'luxon';


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
    address: string;
    radius: number;
    geo: ICalGeo;
}

export interface ICalGeo {
    lat: number;
    lon: number;
}

export interface ICalOrganizer {
    name: string;
    email: string;
    mailto?: string;
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


