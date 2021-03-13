'use strict';

import moment from 'moment-timezone';
import uuid from 'uuid-random';
import {
    addOrGetCustomAttributes,
    checkDate,
    checkEnum,
    checkNameAndMail,
    escape,
    formatDate,
    formatDateTZ,
    generateCustomAttributes
} from './tools';
import ICalAttendee, {ICalAttendeeData} from './attendee';
import ICalAlarm, {ICalAlarmData} from './alarm';
import ICalCategory, {ICalCategoryData} from './category';
import ICalCalendar from './calendar';
import {
    ICalDateTimeValue,
    ICalEventRepeatingFreq,
    ICalGeo,
    ICalLocation,
    ICalOrganizer,
    ICalRepeatingOptions,
    ICalWeekday
} from './types';


export enum ICalEventStatus {
    CONFIRMED = 'CONFIRMED',
    TENTATIVE = 'TENTATIVE',
    CANCELLED = 'CANCELLED'
}

export enum ICalEventBusyStatus {
    FREE = 'FREE',
    TENTATIVE = 'TENTATIVE',
    BUSY = 'BUSY',
    OOF = 'OOF'
}

export enum ICalEventTransparency {
    TRANSPARENT = 'TRANSPARENT',
    OPAQUE = 'OPAQUE'
}

export interface ICalEventData {
    id?: string | number | null,
    sequence?: number,
    start?: ICalDateTimeValue | null,
    end?: ICalDateTimeValue | null,
    recurrenceId?: ICalDateTimeValue | null,
    timezone?: string | null,
    stamp?: ICalDateTimeValue,
    allDay?: boolean,
    floating?: boolean,
    repeating?: ICalRepeatingOptions | null,
    summary?: string,
    location?: string | null,
    appleLocation?: ICalLocation | null,
    geo?: ICalGeo | null,
    description?: string | null,
    htmlDescription?: string | null,
    organizer?: ICalOrganizer | string | null,
    attendees?: ICalAttendee[] | ICalAttendeeData[],
    alarms?: ICalAlarm[] | ICalAlarmData[],
    categories?: ICalCategory[] | ICalCategoryData[],
    status?: ICalEventStatus | null,
    busystatus?: ICalEventBusyStatus | null,
    url?: string | null,
    transparency?: ICalEventTransparency | null,
    created?: ICalDateTimeValue | null,
    lastModified?: ICalDateTimeValue | null,
    x?: ({key: string, value: string})[] | [string, string][] | Record<string, string>;
}

export interface ICalEventInternalData {
    id: string,
    sequence: number,
    start: moment.Moment | null,
    end: moment.Moment | null,
    recurrenceId: moment.Moment | null,
    timezone: string | null,
    stamp: moment.Moment,
    allDay: boolean,
    floating: boolean,
    repeating: ICalEventInternalRepeatingData | null,
    summary: string,
    location: string | null,
    appleLocation: ICalLocation | null,
    geo: ICalGeo | null,
    description: string | null,
    htmlDescription: string | null,
    organizer: ICalOrganizer | null,
    attendees: ICalAttendee[],
    alarms: ICalAlarm[],
    categories: ICalCategory[],
    status: ICalEventStatus | null,
    busystatus: ICalEventBusyStatus | null,
    url: string | null,
    transparency: ICalEventTransparency | null,
    created: moment.Moment | null,
    lastModified: moment.Moment | null,
    x: [string, string][];
}

export interface ICalEventInternalRepeatingData {
    freq: ICalEventRepeatingFreq;
    count?: number;
    interval?: number;
    until?: moment.Moment;
    byDay?: ICalWeekday[];
    byMonth?: number[];
    byMonthDay?: number[];
    bySetPos?: number;
    exclude?: moment.Moment[];
    startOfWeek?: ICalWeekday;
}


/**
 * @author Sebastian Pekarek
 * @class ICalEvent
 */
export default class ICalEvent {
    private readonly data: ICalEventInternalData;
    private readonly calendar: ICalCalendar;

    constructor(data: ICalEventData, calendar: ICalCalendar) {
        this.data = {
            id: uuid(),
            sequence: 0,
            start: null,
            end: null,
            recurrenceId: null,
            timezone: null,
            stamp: moment(),
            allDay: false,
            floating: false,
            repeating: null,
            summary: '',
            location: null,
            appleLocation: null,
            geo: null,
            description: null,
            htmlDescription: null,
            organizer: null,
            attendees: [],
            alarms: [],
            categories: [],
            status: null,
            busystatus: null,
            url: null,
            transparency: null,
            created: null,
            lastModified: null,
            x: []
        };

        this.calendar = calendar;
        if (!calendar) {
            throw new Error('`calendar` option required!');
        }

        data?.id && this.id(data.id);
        data?.sequence && this.sequence(data.sequence);
        data?.start && this.start(data.start);
        data?.end && this.end(data.end);
        data?.recurrenceId && this.recurrenceId(data.recurrenceId);
        data?.timezone && this.timezone(data.timezone);
        data?.stamp && this.stamp(data.stamp);
        data?.allDay && this.allDay(data.allDay);
        data?.floating && this.floating(data.floating);
        data?.repeating && this.repeating(data.repeating);
        data?.summary && this.summary(data.summary);
        data?.location && this.location(data.location);
        data?.appleLocation && this.appleLocation(data.appleLocation);
        data?.geo && this.geo(data.geo);
        data?.description && this.description(data.description);
        data?.htmlDescription && this.htmlDescription(data.htmlDescription);
        data?.organizer && this.organizer(data.organizer);
        data?.attendees && this.attendees(data.attendees);
        data?.alarms && this.alarms(data.alarms);
        data?.categories && this.categories(data.categories);
        data?.status && this.status(data.status);
        data?.busystatus && this.busystatus(data.busystatus);
        data?.url && this.url(data.url);
        data?.transparency && this.transparency(data.transparency);
        data?.created && this.created(data.created);
        data?.lastModified && this.lastModified(data.lastModified);
        data?.x && this.x(data.x);
    }

    /**
     * Set/Get the event's ID
     * @since 0.2.0
     */
    id(): string;
    id(id: string | number): this;
    id(id?: string | number): this | string {
        if (id === undefined) {
            return this.data.id;
        }

        this.data.id = String(id);
        return this;
    }

    /**
     * Set/Get the event's ID
     *
     * @since 0.2.0
     * @alias id
     */
    uid(): string;
    uid(id: string | number): this;
    uid(id?: string | number): this | string {
        return id === undefined ? this.id() : this.id(id);
    }

    /**
     * Set/Get the event's SEQUENCE number
     *
     * @param {Number} sequence
     * @since 0.2.6
     * @returns {ICalEvent|Number}
     */
    sequence(): number;
    sequence(sequence: number): this;
    sequence(sequence?: number): this | number {
        if (sequence === undefined) {
            return this.data.sequence;
        }

        const s = parseInt(String(sequence), 10);
        if (isNaN(s)) {
            throw new Error('`sequence` must be a number!');
        }

        this.data.sequence = sequence;
        return this;
    }

    /**
     * Set/Get the event's start date
     *
     * @since 0.2.0
     */
    start(): moment.Moment | null;
    start(start: ICalDateTimeValue): this;
    start(start?: ICalDateTimeValue): this | moment.Moment | null {
        if (start === undefined) {
            return this.data.start;
        }

        this.data.start = checkDate(start, 'start');
        if (this.data.start && this.data.end && this.data.start.isAfter(this.data.end)) {
            const t = this.data.start;
            this.data.start = this.data.end;
            this.data.end = t;
        }

        return this;
    }

    /**
     * Set/Get the event's end date
     *
     * @since 0.2.0
     */
    end(): moment.Moment | null;
    end(end: ICalDateTimeValue | null): this;
    end(end?: ICalDateTimeValue | null): this | moment.Moment | null {
        if (end === undefined) {
            return this.data.end;
        }
        if (end === null) {
            this.data.end = null;
            return this;
        }

        this.data.end = checkDate(end, 'end');
        if (this.data.start && this.data.end && this.data.start.isAfter(this.data.end)) {
            const t = this.data.start;
            this.data.start = this.data.end;
            this.data.end = t;
        }

        return this;
    }

    /**
     * Set/Get the event's recurrence id
     * @since 0.2.0
     */
    recurrenceId(): moment.Moment | null;
    recurrenceId(recurrenceId: ICalDateTimeValue | null): this;
    recurrenceId(recurrenceId?: ICalDateTimeValue | null): this | moment.Moment | null {
        if (recurrenceId === undefined) {
            return this.data.recurrenceId;
        }
        if (recurrenceId === null) {
            this.data.recurrenceId = null;
            return this;
        }

        this.data.recurrenceId = checkDate(recurrenceId, 'recurrenceId');
        return this;
    }

    /**
     * Set/Get the event's timezone. This unsets the event's floating flag.
     * Used on date properties
     *
     * @example event.timezone('America/New_York');
     * @since 0.2.6
     */
    timezone(): string | null;
    timezone(timezone: string | null): this;
    timezone(timezone?: string | null): this | string | null {
        if (timezone === undefined && this.data.timezone !== null) {
            return this.data.timezone;
        }
        if (timezone === undefined) {
            return this.calendar.timezone();
        }

        this.data.timezone = timezone ? timezone.toString() : null;
        if (this.data.timezone) {
            this.data.floating = false;
        }

        return this;
    }

    /**
     * Set/Get the event's timestamp
     * @since 0.2.0
     */
    stamp(): moment.Moment;
    stamp(stamp: ICalDateTimeValue): this;
    stamp(stamp?: ICalDateTimeValue): this | moment.Moment {
        if (stamp === undefined) {
            return this.data.stamp;
        }

        this.data.stamp = checkDate(stamp, 'stamp');
        return this;
    }

    /**
     * Set/Get the event's timestamp
     *
     * @since 0.2.0
     * @alias stamp
     */
    timestamp(): moment.Moment;
    timestamp(stamp: ICalDateTimeValue): this;
    timestamp(stamp?: ICalDateTimeValue): this | moment.Moment {
        if (stamp === undefined) {
            return this.stamp();
        }

        return this.stamp(stamp);
    }

    /**
     * Set/Get the event's allDay flag
     * @since 0.2.0
     */
    allDay(): boolean;
    allDay(allDay: boolean): this;
    allDay(allDay?: boolean): this | boolean {
        if (allDay === undefined) {
            return this.data.allDay;
        }

        this.data.allDay = Boolean(allDay);
        return this;
    }

    /**
     * Set/Get the event's floating flag. This unsets the event's timezone.
     * See https://tools.ietf.org/html/rfc5545#section-3.3.12
     *
     * @since 0.2.0
     */
    floating(): boolean;
    floating(floating: boolean): this;
    floating(floating?: boolean): this | boolean {
        if (floating === undefined) {
            return this.data.floating;
        }

        this.data.floating = Boolean(floating);
        if (this.data.floating) {
            this.data.timezone = null;
        }

        return this;
    }

    /**
     * Set/Get the event's repeating stuff
     * @since 0.2.0
     */
    repeating(): ICalEventInternalRepeatingData | null;
    repeating(repeating: ICalRepeatingOptions | null): this;
    repeating(repeating?: ICalRepeatingOptions | null): this | ICalEventInternalRepeatingData | null {
        if (repeating === undefined) {
            return this.data.repeating;
        }
        if (!repeating) {
            this.data.repeating = null;
            return this;
        }

        this.data.repeating = {
            freq: checkEnum(ICalEventRepeatingFreq, repeating.freq) as ICalEventRepeatingFreq
        };

        if (repeating.count) {
            if (!isFinite(repeating.count)) {
                throw new Error('`repeating.count` must be a finite number!');
            }

            this.data.repeating.count = repeating.count;
        }

        if (repeating.interval) {
            if (!isFinite(repeating.interval)) {
                throw new Error('`repeating.interval` must be a finite number!');
            }

            this.data.repeating.interval = repeating.interval;
        }

        if (repeating.until !== undefined) {
            this.data.repeating.until = checkDate(repeating.until, 'repeating.until');
        }

        if (repeating.byDay) {
            const byDayArray = Array.isArray(repeating.byDay) ? repeating.byDay : [repeating.byDay];
            this.data.repeating.byDay = byDayArray.map(day => checkEnum(ICalWeekday, day) as ICalWeekday);
        }

        if (repeating.byMonth) {
            const byMonthArray = Array.isArray(repeating.byMonth) ? repeating.byMonth : [repeating.byMonth];
            this.data.repeating.byMonth = byMonthArray.map(month => {
                if (typeof month !== 'number' || month < 1 || month > 12) {
                    throw new Error('`repeating.byMonth` contains invalid value `' + month + '`!');
                }

                return month;
            });
        }

        if (repeating.byMonthDay) {
            const byMonthDayArray = Array.isArray(repeating.byMonthDay) ? repeating.byMonthDay : [repeating.byMonthDay];


            this.data.repeating.byMonthDay = byMonthDayArray.map(monthDay => {
                if (typeof monthDay !== 'number' || monthDay < 1 || monthDay > 31) {
                    throw new Error('`repeating.byMonthDay` contains invalid value `' + monthDay + '`!');
                }

                return monthDay;
            });
        }

        if (repeating.bySetPos) {
            if (!this.data.repeating.byDay) {
                throw '`repeating.bySetPos` must be used along with `repeating.byDay`!';
            }
            if (typeof repeating.bySetPos !== 'number' || repeating.bySetPos < -1 || repeating.bySetPos > 4) {
                throw '`repeating.bySetPos` contains invalid value `' + repeating.bySetPos + '`!';
            }

            this.data.repeating.byDay.splice(1);
            this.data.repeating.bySetPos = repeating.bySetPos;
        }

        if (repeating.exclude) {
            const excludeArray = Array.isArray(repeating.exclude) ? repeating.exclude : [repeating.exclude];
            this.data.repeating.exclude = excludeArray.map((exclude, i) => {
                return checkDate(exclude, `repeating.exclude[${i}]`);
            });
        }

        if (repeating.startOfWeek) {
            this.data.repeating.startOfWeek = checkEnum(ICalWeekday, repeating.startOfWeek) as ICalWeekday;
        }

        return this;
    }

    /**
     * Set/Get the event's summary
     * @since 0.2.0
     */
    summary(): string;
    summary(summary: string): this;
    summary(summary?: string): this | string {
        if (summary === undefined) {
            return this.data.summary;
        }

        this.data.summary = summary ? String(summary) : '';
        return this;
    }


    /**
     * Set/Get the event's location
     *
     * @param {String} [location]
     * @since 0.2.0
     * @returns {ICalEvent|String}
     */
    location(): string | null;
    location(location: string | null): this;
    location(location?: string | null): this | string | null {
        if (location === undefined) {
            return this.data.location;
        }
        if (this.data.appleLocation && location) {
            this.data.appleLocation = null;
        }

        this.data.location = location ? String(location) : null;
        return this;
    }

    /**
     * Set/Get the Apple event's location
     * @since 1.10.0
     */
    appleLocation(): ICalLocation | null;
    appleLocation(location: ICalLocation | null): this;
    appleLocation(location?: ICalLocation | null): this | ICalLocation | null {
        if (location === undefined) {
            return this.data.appleLocation;
        }
        if (location === null) {
            this.data.appleLocation = null;
            return this;
        }

        if (!location.title || !location.address || !location.radius || !location.geo || !location.geo.lat || !location.geo.lon) {
            throw new Error('`appleLocation` isn\'t formatted correctly. See https://github.com/sebbo2002/ical-generator#applelocationobject-applelocation');
        }

        this.data.appleLocation = location;
        this.data.location = location.title + '\n' + location.address;
        return this;
    }

    /**
     * Set/Get the event's geo
     * @since 1.5.0
     */
    geo(): ICalGeo | null;
    geo(geo: ICalGeo | null): this;
    geo(geo?: ICalGeo | null): this | ICalGeo | null {
        if (geo === undefined) {
            return this.data.geo;
        }
        if (geo === null) {
            this.data.geo = null;
            return this;
        }

        if ((!geo || !isFinite(geo.lat) || !isFinite(geo.lon))) {
            throw new Error('`geo` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#geostringobject-geo');
        }

        this.data.geo = geo;
        return this;
    }


    /**
     * Set/Get the event's description
     * @since 0.2.0
     */
    description(): string | null;
    description(description: string | null): this;
    description(description?: string | null): this | string | null {
        if (description === undefined) {
            return this.data.description;
        }

        this.data.description = description ? String(description) : null;
        return this;
    }

    /**
     * Set/Get the event's HTML description
     * @since 0.2.8
     */
    htmlDescription(): string | null;
    htmlDescription(description: string | null): this;
    htmlDescription(description?: string | null): this | string | null {
        if (description === undefined) {
            return this.data.htmlDescription;
        }

        this.data.htmlDescription = description ? String(description) : null;
        return this;
    }


    /**
     * Set/Get the event's organizer
     * @since 0.2.0
     */
    organizer(): ICalOrganizer | null;
    organizer(organizer: ICalOrganizer | string | null): this;
    organizer(organizer?: ICalOrganizer | string | null): this | ICalOrganizer | null {
        if (organizer === undefined) {
            return this.data.organizer;
        }
        if (organizer === null) {
            this.data.organizer = null;
            return this;
        }

        this.data.organizer = checkNameAndMail('organizer', organizer);
        return this;
    }


    /**
     * Create a new Attendee and return the attendee object…
     * @since 0.2.0
     */
    createAttendee(data: ICalAttendee | ICalAttendeeData | string = {}): ICalAttendee {
        if (data instanceof ICalAttendee) {
            this.data.attendees.push(data);
            return data;
        }
        if (typeof data === 'string') {
            data = checkNameAndMail('data', data);
        }

        const attendee = new ICalAttendee(data, this);
        this.data.attendees.push(attendee);
        return attendee;
    }


    /**
     * Get all attendees or add attendees…
     * @since 0.2.0
     */
    attendees(): ICalAttendee[];
    attendees(attendees: (ICalAttendee | ICalAttendeeData | string)[]): this;
    attendees(attendees?: (ICalAttendee | ICalAttendeeData | string)[]): this | ICalAttendee[] {
        if (!attendees) {
            return this.data.attendees;
        }

        attendees.forEach(attendee => this.createAttendee(attendee));
        return this;
    }


    /**
     * Create a new Alarm and return the alarm object…
     * @since 0.2.1
     */
    createAlarm(data: ICalAlarm | ICalAlarmData = {}): ICalAlarm {
        const alarm = data instanceof ICalAlarm ? data : new ICalAlarm(data, this);
        this.data.alarms.push(alarm);
        return alarm;
    }


    /**
     * Get all alarms or add alarms…
     *
     * @param {Array<Object>} [alarms]
     * @since 0.2.0
     * @returns {ICalAlarms[]|ICalEvent}
     */
    alarms(): ICalAlarm[];
    alarms(alarms: ICalAlarm[] | ICalAlarmData[]): this;
    alarms(alarms?: ICalAlarm[] | ICalAlarmData[]): this | ICalAlarm[] {
        if (!alarms) {
            return this.data.alarms;
        }

        alarms.forEach((alarm: ICalAlarm | ICalAlarmData) => this.createAlarm(alarm));
        return this;
    }


    /**
     * Create a new categorie and return the category object…
     * @since 0.3.0
     */
    createCategory(data: ICalCategory | ICalCategoryData = {}): ICalCategory {
        const category = data instanceof ICalCategory ? data : new ICalCategory(data);
        this.data.categories.push(category);
        return category;
    }


    /**
     * Get all categories or add categories…
     * @since 0.3.0
     */
    categories(): ICalCategory[];
    categories(categories: (ICalCategory | ICalCategoryData)[]): this;
    categories(categories?: (ICalCategory | ICalCategoryData)[]): this | ICalCategory[] {
        if (!categories) {
            return this.data.categories;
        }

        categories.forEach(category => this.createCategory(category));
        return this;
    }


    /**
     * Set/Get the event's status
     * @since 0.2.0
     */
    status(): ICalEventStatus | null;
    status(status: ICalEventStatus | null): this;
    status(status?: ICalEventStatus | null): this | ICalEventStatus | null {
        if (status === undefined) {
            return this.data.status;
        }
        if (status === null) {
            this.data.status = null;
            return this;
        }

        this.data.status = checkEnum(ICalEventStatus, status) as ICalEventStatus;
        return this;
    }


    /**
     * Set/Get the event's busy status on Microsoft param
     * @since 1.0.2
     */
    busystatus(): ICalEventBusyStatus | null;
    busystatus(busystatus: ICalEventBusyStatus | null): this;
    busystatus(busystatus?: ICalEventBusyStatus | null): this | ICalEventBusyStatus | null {
        if (busystatus === undefined) {
            return this.data.busystatus;
        }
        if (busystatus === null) {
            this.data.busystatus = null;
            return this;
        }

        this.data.busystatus = checkEnum(ICalEventBusyStatus, busystatus) as ICalEventBusyStatus;
        return this;
    }


    /**
     * Set/Get the event's URL
     * @since 0.2.0
     */
    url(): string | null;
    url(url: string | null): this;
    url(url?: string | null): this | string | null {
        if (url === undefined) {
            return this.data.url;
        }

        this.data.url = url ? String(url) : null;
        return this;
    }

    /**
     * Set/Get the event's transparency
     * @since 1.7.3
     */
    transparency(): ICalEventTransparency | null;
    transparency(transparency: ICalEventTransparency | null): this;
    transparency(transparency?: ICalEventTransparency | null): this | ICalEventTransparency | null {
        if (transparency === undefined) {
            return this.data.transparency;
        }
        if (!transparency) {
            this.data.transparency = null;
            return this;
        }

        this.data.transparency = checkEnum(ICalEventTransparency, transparency) as ICalEventTransparency;
        return this;
    }


    /**
     * Set/Get the event's creation date
     * @since 0.3.0
     */
    created(): moment.Moment | null;
    created(created: ICalDateTimeValue | null): this;
    created(created?: ICalDateTimeValue | null): this | moment.Moment | null {
        if (created === undefined) {
            return this.data.created;
        }
        if (created === null) {
            this.data.created = null;
            return this;
        }

        this.data.created = checkDate(created, 'created');
        return this;
    }


    /**
     * Set/Get the event's last modification date
     * @since 0.3.0
     */
    lastModified(): moment.Moment | null;
    lastModified(lastModified: ICalDateTimeValue | null): this;
    lastModified(lastModified?: ICalDateTimeValue | null): this | moment.Moment | null {
        if (lastModified === undefined) {
            return this.data.lastModified;
        }
        if (lastModified === null) {
            this.data.lastModified = null;
            return this;
        }

        this.data.lastModified = checkDate(lastModified, 'lastModified');
        return this;
    }


    /**
     * Get/Set X-* attributes. Woun't filter double attributes,
     * which are also added by another method (e.g. busystatus),
     * so these attributes may be inserted twice.
     *
     * @param {Array<Object<{key: String, value: String}>>|String} [key]
     * @param {String} [value]
     * @since 1.9.0
     * @returns {ICalEvent|Array<Object<{key: String, value: String}>>}
     */
    x (keyOrArray: ({key: string, value: string})[] | [string, string][] | Record<string, string>): this;
    x(keyOrArray: string, value: string): this;
    x(): { key: string, value: string }[];
    x(keyOrArray?: ({ key: string, value: string })[] | [string, string][] | Record<string, string> | string, value?: string): this | void | ({ key: string, value: string })[] {
        if (keyOrArray === undefined) {
            return addOrGetCustomAttributes(this.data);
        }

        if (typeof keyOrArray === 'string' && typeof value === 'string') {
            addOrGetCustomAttributes(this.data, keyOrArray, value);
        }
        if (typeof keyOrArray === 'object') {
            addOrGetCustomAttributes(this.data, keyOrArray);
        }

        return this;
    }


    /**
     * Export calender as JSON Object to use it later…
     * @since 0.2.4
     */
    toJSON(): ICalEventInternalData {
        return Object.assign({}, this.data, {
            start: this.data.start?.toJSON() || null,
            end: this.data.end?.toJSON() || null,
            recurrenceId: this.data.recurrenceId?.toJSON() || null,
            stamp: this.data.stamp?.toJSON() || null,
            created: this.data.created?.toJSON() || null,
            lastModified: this.data.lastModified?.toJSON() || null,
            repeating: this.data.repeating ? Object.assign({}, this.data.repeating, {
                until: this.data.repeating.until?.toJSON(),
                exclude: this.data.repeating.exclude?.map(d => d.toJSON()),
            }) : null,
            x: this.x()
        });
    }


    /**
     * Export Event to iCal
     * @since 0.2.0
     */
    toString(): string {
        let g = '';

        if (!this.data.start) {
            throw new Error('No value for `start` in ICalEvent #' + this.data.id + ' given!');
        }

        // DATE & TIME
        g += 'BEGIN:VEVENT\r\n';
        g += 'UID:' + this.data.id + '\r\n';

        // SEQUENCE
        g += 'SEQUENCE:' + this.data.sequence + '\r\n';

        g += 'DTSTAMP:' + formatDate(this.calendar.timezone(), this.data.stamp) + '\r\n';
        if (this.data.allDay) {
            g += 'DTSTART;VALUE=DATE:' + formatDate(this.calendar.timezone(), this.data.start, true) + '\r\n';
            if (this.data.end) {
                g += 'DTEND;VALUE=DATE:' + formatDate(this.calendar.timezone(), this.data.end, true) + '\r\n';
            }

            g += 'X-MICROSOFT-CDO-ALLDAYEVENT:TRUE\r\n';
            g += 'X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT:TRUE\r\n';
        }
        else {
            g += formatDateTZ(this.timezone(), 'DTSTART', this.data.start, this.data) + '\r\n';
            if (this.data.end) {
                g += formatDateTZ(this.timezone(), 'DTEND', this.data.end, this.data) + '\r\n';
            }
        }

        // REPEATING
        if (this.data.repeating) {
            g += 'RRULE:FREQ=' + this.data.repeating.freq;

            if (this.data.repeating.count) {
                g += ';COUNT=' + this.data.repeating.count;
            }

            if (this.data.repeating.interval) {
                g += ';INTERVAL=' + this.data.repeating.interval;
            }

            if (this.data.repeating.until) {
                g += ';UNTIL=' + formatDate(this.calendar.timezone(), this.data.repeating.until);
            }

            if (this.data.repeating.byDay) {
                g += ';BYDAY=' + this.data.repeating.byDay.join(',');
            }

            if (this.data.repeating.byMonth) {
                g += ';BYMONTH=' + this.data.repeating.byMonth.join(',');
            }

            if (this.data.repeating.byMonthDay) {
                g += ';BYMONTHDAY=' + this.data.repeating.byMonthDay.join(',');
            }

            if (this.data.repeating.bySetPos) {
                g += ';BYSETPOS=' + this.data.repeating.bySetPos;
            }

            if (this.data.repeating.startOfWeek) {
                g += ';WKST=' + this.data.repeating.startOfWeek;
            }

            g += '\r\n';

            // REPEATING EXCLUSION
            if (this.data.repeating.exclude) {
                if (this.data.allDay) {
                    g += 'EXDATE;VALUE=DATE:' + this.data.repeating.exclude.map(excludedDate => {
                        return formatDate(this.calendar.timezone(), excludedDate, true);
                    }).join(',') + '\r\n';
                }
                else {
                    g += 'EXDATE';
                    if (this.timezone()) {
                        g += ';TZID=' + this.timezone() + ':' + this.data.repeating.exclude.map(excludedDate => {
                            // This isn't a 'floating' event because it has a timezone;
                            // but we use it to omit the 'Z' UTC specifier in formatDate()
                            return formatDate(this.timezone(), excludedDate, false, true);
                        }).join(',') + '\r\n';
                    }
                    else {
                        g += ':' + this.data.repeating.exclude.map(excludedDate => {
                            return formatDate(this.timezone(), excludedDate);
                        }).join(',') + '\r\n';
                    }
                }
            }
        }

        // RECURRENCE
        if (this.data.recurrenceId) {
            g += formatDateTZ(this.timezone(), 'RECURRENCE-ID', this.data.recurrenceId, this.data) + '\r\n';
        }

        // SUMMARY
        g += 'SUMMARY:' + escape(this.data.summary) + '\r\n';

        // TRANSPARENCY
        if (this.data.transparency) {
            g += 'TRANSP:' + escape(this.data.transparency) + '\r\n';
        }

        // LOCATION
        if (this.data.location) {
            g += 'LOCATION:' + escape(this.data.location) + '\r\n';
        }

        // APPLE LOCATION
        if (this.data.appleLocation) {
            g += 'X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS=' + escape(this.data.appleLocation.address) + ';' +
                'X-APPLE-RADIUS=' + escape(this.data.appleLocation.radius) + ';' +
                'X-TITLE=' + escape(this.data.appleLocation.title) +
                ':geo:' + escape(this.data.appleLocation.geo.lat) + ',' + escape(this.data.appleLocation.geo.lon) + '\r\n';
        }

        // GEO
        if (this.data.geo) {
            g += 'GEO:' + escape(this.data.geo.lat) + ';' + escape(this.data.geo.lon) + '\r\n';
        }

        // DESCRIPTION
        if (this.data.description) {
            g += 'DESCRIPTION:' + escape(this.data.description) + '\r\n';
        }

        // HTML DESCRIPTION
        if (this.data.htmlDescription) {
            g += 'X-ALT-DESC;FMTTYPE=text/html:' + escape(this.data.htmlDescription) + '\r\n';
        }

        // ORGANIZER
        if (this.data.organizer) {
            g += 'ORGANIZER;CN="' + escape(this.data.organizer.name) + '"';
            if (this.data.organizer.email && this.data.organizer.mailto) {
                g += ';EMAIL=' + escape(this.data.organizer.email);
            }
            g += ':mailto:' + escape(this.data.organizer.mailto || this.data.organizer.email) + '\r\n';
        }

        // ATTENDEES
        this.data.attendees.forEach(function (attendee) {
            g += attendee.toString();
        });

        // ALARMS
        this.data.alarms.forEach(function (alarm) {
            g += alarm.toString();
        });

        // CATEGORIES
        if (this.data.categories.length > 0) {
            g += 'CATEGORIES:' + this.data.categories.map(function (category) {
                return category.toString();
            }).join() + '\r\n';
        }

        // URL
        if (this.data.url) {
            g += 'URL;VALUE=URI:' + escape(this.data.url) + '\r\n';
        }

        // STATUS
        if (this.data.status) {
            g += 'STATUS:' + this.data.status.toUpperCase() + '\r\n';
        }

        // BUSYSTATUS
        if (this.data.busystatus) {
            g += 'X-MICROSOFT-CDO-BUSYSTATUS:' + this.data.busystatus.toUpperCase() + '\r\n';
        }

        // CUSTOM X ATTRIBUTES
        g += generateCustomAttributes(this.data);

        // CREATED
        if (this.data.created) {
            g += 'CREATED:' + formatDate(this.calendar.timezone(), this.data.created) + '\r\n';
        }

        // LAST-MODIFIED
        if (this.data.lastModified) {
            g += 'LAST-MODIFIED:' + formatDate(this.calendar.timezone(), this.data.lastModified) + '\r\n';
        }

        g += 'END:VEVENT\r\n';
        return g;
    }
}
