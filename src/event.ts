'use strict';

import uuid from 'uuid-random';
import {
    addOrGetCustomAttributes,
    checkDate,
    checkEnum,
    checkNameAndMail,
    escape,
    formatDate,
    formatDateTZ,
    generateCustomAttributes,
    isRRule,
    toDate,
    toJSON
} from './tools.js';
import ICalAttendee, {ICalAttendeeData} from './attendee.js';
import ICalAlarm, {ICalAlarmData} from './alarm.js';
import ICalCategory, {ICalCategoryData} from './category.js';
import ICalCalendar from './calendar.js';
import {
    ICalDateTimeValue,
    ICalDescription,
    ICalEventRepeatingFreq,
    ICalLocation,
    ICalOrganizer,
    ICalRepeatingOptions,
    ICalRRuleStub,
    ICalWeekday
} from './types.js';


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

export enum ICalEventClass {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    CONFIDENTIAL = 'CONFIDENTIAL'
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
    repeating?: ICalRepeatingOptions | ICalRRuleStub | string | null,
    summary?: string,
    location?: ICalLocation | string | null,
    description?: ICalDescription | string | null,
    organizer?: ICalOrganizer | string | null,
    attendees?: ICalAttendee[] | ICalAttendeeData[],
    alarms?: ICalAlarm[] | ICalAlarmData[],
    categories?: ICalCategory[] | ICalCategoryData[],
    status?: ICalEventStatus | null,
    busystatus?: ICalEventBusyStatus | null,
    priority?: number | null,
    url?: string | null,
    attachments?: string[],
    transparency?: ICalEventTransparency | null,
    created?: ICalDateTimeValue | null,
    lastModified?: ICalDateTimeValue | null,
    class?: ICalEventClass | null;
    x?: {key: string, value: string}[] | [string, string][] | Record<string, string>;
}

interface ICalEventInternalData {
    id: string,
    sequence: number,
    start: ICalDateTimeValue | null,
    end: ICalDateTimeValue | null,
    recurrenceId: ICalDateTimeValue | null,
    timezone: string | null,
    stamp: ICalDateTimeValue,
    allDay: boolean,
    floating: boolean,
    repeating: ICalEventInternalRepeatingData | ICalRRuleStub | string | null,
    summary: string,
    location: ICalLocation | null,
    description: ICalDescription | null,
    organizer: ICalOrganizer | null,
    attendees: ICalAttendee[],
    alarms: ICalAlarm[],
    categories: ICalCategory[],
    status: ICalEventStatus | null,
    busystatus: ICalEventBusyStatus | null,
    priority: number | null,
    url: string | null,
    attachments: string[],
    transparency: ICalEventTransparency | null,
    created: ICalDateTimeValue | null,
    lastModified: ICalDateTimeValue | null,
    class: ICalEventClass | null,
    x: [string, string][];
}

export interface ICalEventJSONData {
    id: string,
    sequence: number,
    start: string | null,
    end: string | null,
    recurrenceId: string | null,
    timezone: string | null,
    stamp: string,
    allDay: boolean,
    floating: boolean,
    repeating: ICalEventInternalRepeatingData | string | null,
    summary: string,
    location: ICalLocation | null,
    description: ICalDescription | null,
    organizer: ICalOrganizer | null,
    attendees: ICalAttendee[],
    alarms: ICalAlarm[],
    categories: ICalCategory[],
    status: ICalEventStatus | null,
    busystatus: ICalEventBusyStatus | null,
    priority?: number | null,
    url: string | null,
    attachments: string[],
    transparency: ICalEventTransparency | null,
    created: string | null,
    lastModified: string | null,
    x: {key: string, value: string}[];
}

interface ICalEventInternalRepeatingData {
    freq: ICalEventRepeatingFreq;
    count?: number;
    interval?: number;
    until?: ICalDateTimeValue;
    byDay?: ICalWeekday[];
    byMonth?: number[];
    byMonthDay?: number[];
    bySetPos?: number[];
    exclude?: ICalDateTimeValue[];
    startOfWeek?: ICalWeekday;
}


/**
 * Usually you get an `ICalCalendar` object like this:
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * const event = calendar.createEvent();
 * ```
 */
export default class ICalEvent {
    private readonly data: ICalEventInternalData;
    private readonly calendar: ICalCalendar;

    /**
     * Constructor of [[`ICalEvent`]. The calendar reference is
     * required to query the calendar's timezone when required.
     *
     * @param data Calendar Event Data
     * @param calendar Reference to ICalCalendar object
     */
    constructor(data: ICalEventData, calendar: ICalCalendar) {
        this.data = {
            id: uuid(),
            sequence: 0,
            start: null,
            end: null,
            recurrenceId: null,
            timezone: null,
            stamp: new Date(),
            allDay: false,
            floating: false,
            repeating: null,
            summary: '',
            location: null,
            description: null,
            organizer: null,
            attendees: [],
            alarms: [],
            categories: [],
            status: null,
            busystatus: null,
            priority: null,
            url: null,
            attachments: [],
            transparency: null,
            created: null,
            lastModified: null,
            class: null,
            x: []
        };

        this.calendar = calendar;
        if (!calendar) {
            throw new Error('`calendar` option required!');
        }

        data.id && this.id(data.id);
        data.sequence !== undefined && this.sequence(data.sequence);
        data.start && this.start(data.start);
        data.end !== undefined && this.end(data.end);
        data.recurrenceId !== undefined && this.recurrenceId(data.recurrenceId);
        data.timezone !== undefined && this.timezone(data.timezone);
        data.stamp !== undefined && this.stamp(data.stamp);
        data.allDay !== undefined && this.allDay(data.allDay);
        data.floating !== undefined && this.floating(data.floating);
        data.repeating !== undefined && this.repeating(data.repeating);
        data.summary !== undefined && this.summary(data.summary);
        data.location !== undefined && this.location(data.location);
        data.description !== undefined && this.description(data.description);
        data.organizer !== undefined && this.organizer(data.organizer);
        data.attendees !== undefined && this.attendees(data.attendees);
        data.alarms !== undefined && this.alarms(data.alarms);
        data.categories !== undefined && this.categories(data.categories);
        data.status !== undefined && this.status(data.status);
        data.busystatus !== undefined && this.busystatus(data.busystatus);
        data.priority !== undefined && this.priority(data.priority);
        data.url !== undefined && this.url(data.url);
        data.attachments !== undefined && this.attachments(data.attachments);
        data.transparency !== undefined && this.transparency(data.transparency);
        data.created !== undefined && this.created(data.created);
        data.lastModified !== undefined && this.lastModified(data.lastModified);
        data.class !== undefined && this.class(data.class);
        data.x !== undefined && this.x(data.x);
    }

    /**
     * Get the event's ID
     * @since 0.2.0
     */
    id(): string;

    /**
     * Use this method to set the event's ID.
     * If not set, a UUID will be generated randomly.
     *
     * @param id Event ID you want to set
     */
    id(id: string | number): this;
    id(id?: string | number): this | string {
        if (id === undefined) {
            return this.data.id;
        }

        this.data.id = String(id);
        return this;
    }

    /**
     * Get the event's ID
     * @since 0.2.0
     * @alias id
     */
    uid(): string;

    /**
     * Use this method to set the event's ID.
     * If not set, a UUID will be generated randomly.
     *
     * @param id Event ID you want to set
     * @alias id
     */
    uid(id: string | number): this;
    uid(id?: string | number): this | string {
        return id === undefined ? this.id() : this.id(id);
    }

    /**
     * Get the event's SEQUENCE number. Use this method to get the event's
     * revision sequence number of the calendar component within a sequence of revisions.
     *
     * @since 0.2.6
     */
    sequence(): number;

    /**
     * Set the event's SEQUENCE number. For a new event, this should be zero.
     * Each time the organizer  makes a significant revision, the sequence
     * number should be incremented.
     *
     * @param sequence Sequence number or null to unset it
     */
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
     * Get the event start time which is currently
     * set. Can be any supported date object.
     *
     * @since 0.2.0
     */
    start(): ICalDateTimeValue | null;

    /**
     * Set the appointment date of beginning, which is required for all events.
     * You can use any supported date object, see
     * [Readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * @since 0.2.0
     */
    start(start: ICalDateTimeValue): this;
    start(start?: ICalDateTimeValue): this | ICalDateTimeValue | null {
        if (start === undefined) {
            return this.data.start;
        }

        this.data.start = checkDate(start, 'start');
        if (this.data.start && this.data.end && toDate(this.data.start).getTime() > toDate(this.data.end).getTime()) {
            const t = this.data.start;
            this.data.start = this.data.end;
            this.data.end = t;
        }

        return this;
    }

    /**
     * Get the event end time which is currently
     * set. Can be any supported date object.
     *
     * @since 0.2.0
     */
    end(): ICalDateTimeValue | null;

    /**
     * Set the appointment date of end. You can use any supported date object, see
     * [readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * @since 0.2.0
     */
    end(end: ICalDateTimeValue | null): this;
    end(end?: ICalDateTimeValue | null): this | ICalDateTimeValue | null {
        if (end === undefined) {
            return this.data.end;
        }
        if (end === null) {
            this.data.end = null;
            return this;
        }

        this.data.end = checkDate(end, 'end');
        if (this.data.start && this.data.end && toDate(this.data.start).getTime() > toDate(this.data.end).getTime()) {
            const t = this.data.start;
            this.data.start = this.data.end;
            this.data.end = t;
        }

        return this;
    }

    /**
     * Get the event's recurrence id
     * @since 0.2.0
     */
    recurrenceId(): ICalDateTimeValue | null;

    /**
     * Set the event's recurrence id. You can use any supported date object, see
     * [readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * @since 0.2.0
     */
    recurrenceId(recurrenceId: ICalDateTimeValue | null): this;
    recurrenceId(recurrenceId?: ICalDateTimeValue | null): this | ICalDateTimeValue | null {
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
     * Get the event's timezone.
     * @since 0.2.6
     */
    timezone(): string | null;

    /**
     * Sets the time zone to be used for this event. If a time zone has been
     * defined in both the event and the calendar, the time zone of the event
     * is used.
     *
     * Please note that if the time zone is set, ical-generator assumes
     * that all times are already in the correct time zone. Alternatively,
     * a `moment-timezone` or a Luxon object can be passed with `setZone`,
     * ical-generator will then set the time zone itself.
     *
     * This and the 'floating' flag (see below) are mutually exclusive, and setting a timezone will unset the
     * 'floating' flag.  If neither 'timezone' nor 'floating' are set, the date will be output with in UTC format
     * (see [date-time form #2 in section 3.3.5 of RFC 554](https://tools.ietf.org/html/rfc5545#section-3.3.5)).
     *
     * See [Readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones) for details about
     * supported values and timezone handling.
     *
     * ```javascript
     * event.timezone('America/New_York');
     * ```
     *
     * @see https://github.com/sebbo2002/ical-generator#-date-time--timezones
     * @since 0.2.6
     */
    timezone(timezone: string | null): this;
    timezone(timezone?: string | null): this | string | null {
        if (timezone === undefined && this.data.timezone !== null) {
            return this.data.timezone;
        }
        if (timezone === undefined) {
            return this.calendar.timezone();
        }

        this.data.timezone = timezone && timezone !== 'UTC' ? timezone.toString() : null;
        if (this.data.timezone) {
            this.data.floating = false;
        }

        return this;
    }

    /**
     * Get the event's timestamp
     * @since 0.2.0
     */
    stamp(): ICalDateTimeValue;

    /**
     * Set the appointment date of creation. Defaults to the current time and date (`new Date()`). You can use
     * any supported date object, see [readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * @since 0.2.0
     */
    stamp(stamp: ICalDateTimeValue): this;
    stamp(stamp?: ICalDateTimeValue): this | ICalDateTimeValue {
        if (stamp === undefined) {
            return this.data.stamp;
        }

        this.data.stamp = checkDate(stamp, 'stamp');
        return this;
    }

    /**
     * Get the event's timestamp
     * @since 0.2.0
     * @alias stamp
     */
    timestamp(): ICalDateTimeValue;

    /**
     * Set the appointment date of creation. Defaults to the current time and date (`new Date()`). You can use
     * any supported date object, see [readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * @since 0.2.0
     * @alias stamp
     */
    timestamp(stamp: ICalDateTimeValue): this;
    timestamp(stamp?: ICalDateTimeValue): this | ICalDateTimeValue {
        if (stamp === undefined) {
            return this.stamp();
        }

        return this.stamp(stamp);
    }

    /**
     * Get the event's allDay flag
     * @since 0.2.0
     */
    allDay(): boolean;

    /**
     * Set the event's allDay flag.
     *
     * ```javascript
     * event.allDay(true); // → appointment is for the whole day
     * ```
     *
     * @since 0.2.0
     */
    allDay(allDay: boolean): this;
    allDay(allDay?: boolean): this | boolean {
        if (allDay === undefined) {
            return this.data.allDay;
        }

        this.data.allDay = Boolean(allDay);
        return this;
    }

    /**
     * Get the event's floating flag.
     * @since 0.2.0
     */
    floating(): boolean;
    floating(floating: boolean): this;

    /**
     * Set the event's floating flag. This unsets the event's timezone.
     * Events whose floating flag is set to true always take place at the
     * same time, regardless of the time zone.
     *
     * @since 0.2.0
     */
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
     * Get the event's repeating options
     * @since 0.2.0
     */
    repeating(): ICalEventInternalRepeatingData | ICalRRuleStub | string | null;

    /**
     * Set the event's repeating options by passing an [[`ICalRepeatingOptions`]] object.
     *
     * ```javascript
     * event.repeating({
     *    freq: 'MONTHLY', // required
     *    count: 5,
     *    interval: 2,
     *    until: new Date('Jan 01 2014 00:00:00 UTC'),
     *    byDay: ['su', 'mo'], // repeat only sunday and monday
     *    byMonth: [1, 2], // repeat only in january and february,
     *    byMonthDay: [1, 15], // repeat only on the 1st and 15th
     *    bySetPos: 3, // repeat every 3rd sunday (will take the first element of the byDay array)
     *    exclude: [new Date('Dec 25 2013 00:00:00 UTC')], // exclude these dates
     *    excludeTimezone: 'Europe/Berlin', // timezone of exclude
     *    wkst: 'SU' // Start the week on Sunday, default is Monday
     * });
     * ```
     *
     * @since 0.2.0
     */
    repeating(repeating: ICalRepeatingOptions | null): this;

    /**
     * Set the event's repeating options by passing an [RRule object](https://github.com/jakubroztocil/rrule).
     * @since 2.0.0-develop.5
     */
    repeating(repeating: ICalRRuleStub | null): this;

    /**
     * Set the events repeating options by passing a string which is inserted in the ical file.
     * @since 2.0.0-develop.5
     */
    repeating(repeating: string | null): this;

    /**
     * @internal
     */
    repeating(repeating: ICalRepeatingOptions | ICalRRuleStub | string | null): this;
    repeating(repeating?: ICalRepeatingOptions | ICalRRuleStub | string | null): this | ICalEventInternalRepeatingData | ICalRRuleStub | string | null {
        if (repeating === undefined) {
            return this.data.repeating;
        }
        if (!repeating) {
            this.data.repeating = null;
            return this;
        }
        if(isRRule(repeating) || typeof repeating === 'string') {
            this.data.repeating = repeating;
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
                if (typeof monthDay !== 'number' || monthDay < -31 || monthDay > 31 || monthDay === 0) {
                    throw new Error('`repeating.byMonthDay` contains invalid value `' + monthDay + '`!');
                }

                return monthDay;
            });
        }

        if (repeating.bySetPos) {
            if (!this.data.repeating.byDay) {
                throw '`repeating.bySetPos` must be used along with `repeating.byDay`!';
            }
            const bySetPosArray = Array.isArray(repeating.bySetPos) ? repeating.bySetPos : [repeating.bySetPos];
            this.data.repeating.bySetPos = bySetPosArray.map(bySetPos => {
                if (typeof bySetPos !== 'number' || bySetPos < -366 || bySetPos > 366 || bySetPos === 0) {
                    throw '`repeating.bySetPos` contains invalid value `' + bySetPos + '`!';
                }
                return bySetPos;
            });
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
     * Get the event's summary
     * @since 0.2.0
     */
    summary(): string;

    /**
     * Set the event's summary.
     * Defaults to an empty string if nothing is set.
     *
     * @since 0.2.0
     */
    summary(summary: string): this;
    summary(summary?: string): this | string {
        if (summary === undefined) {
            return this.data.summary;
        }

        this.data.summary = summary ? String(summary) : '';
        return this;
    }


    /**
     * Get the event's location
     * @since 0.2.0
     */
    location(): ICalLocation | null;

    /**
     * Set the event's location by passing a string (minimum) or
     * an [[`ICalLocation`]] object which will also fill the iCal
     * `GEO` attribute and Apple's `X-APPLE-STRUCTURED-LOCATION`.
     *
     * ```javascript
     * event.location({
     *    title: 'Apple Store Kurfürstendamm',
     *    address: 'Kurfürstendamm 26, 10719 Berlin, Deutschland',
     *    radius: 141.1751386318387,
     *    geo: {
     *        lat: 52.503630,
     *        lon: 13.328650
     *    }
     * });
     * ```
     *
     * @since 0.2.0
     */
    location(location: ICalLocation | string | null): this;
    location(location?: ICalLocation | string | null): this | ICalLocation | null {
        if (location === undefined) {
            return this.data.location;
        }
        if (typeof location === 'string') {
            this.data.location = {
                title: location
            };
            return this;
        }
        if (
            (location && !location.title) ||
            (location?.geo && (!isFinite(location.geo.lat) || !isFinite(location.geo.lon)))
        ) {
            throw new Error(
                '`location` isn\'t formatted correctly. See https://sebbo2002.github.io/ical-generator/'+
                'develop/reference/classes/ICalEvent.html#location'
            );
        }

        this.data.location = location || null;
        return this;
    }


    /**
     * Get the event's description as an [[`ICalDescription`]] object.
     * @since 0.2.0
     */
    description(): ICalDescription | null;

    /**
     * Set the events description by passing a plaintext string or
     * an object containing both a plaintext and a html description.
     * Only a few calendar apps support html descriptions and like in
     * emails, supported HTML tags and styling is limited.
     *
     * ```javascript
     * event.description({
     *     plain: 'Hello World!';
     *     html: '<p>Hello World!</p>';
     * });
     * ```
     *
     * @since 0.2.0
     */
    description(description: ICalDescription | string | null): this;
    description(description?: ICalDescription | string | null): this | ICalDescription | null {
        if (description === undefined) {
            return this.data.description;
        }
        if (description === null) {
            this.data.description = null;
            return this;
        }

        if (typeof description === 'string') {
            this.data.description = {plain: description};
        }
        else {
            this.data.description = description;
        }
        return this;
    }


    /**
     * Get the event's organizer
     * @since 0.2.0
     */
    organizer(): ICalOrganizer | null;

    /**
     * Set the event's organizer
     *
     * ```javascript
     * event.organizer({
     *    name: 'Organizer\'s Name',
     *    email: 'organizer@example.com'
     * });
     *
     * // OR
     *
     * event.organizer('Organizer\'s Name <organizer@example.com>');
     * ```
     *
     * You can also add an explicit `mailto` email address or or the sentBy address.
     *
     * ```javascript
     *     event.organizer({
     *    name: 'Organizer\'s Name',
     *    email: 'organizer@example.com',
     *    mailto: 'explicit@mailto.com',
     *    sentBy: 'substitute@example.com'
     * })
     * ```
     *
     * @since 0.2.0
     */
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
     * Creates a new [[`ICalAttendee`]] and returns it. Use options to prefill
     * the attendee's attributes. Calling this method without options will create
     * an empty attendee.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const attendee = event.createAttendee({email: 'hui@example.com', name: 'Hui'});
     *
     * // add another attendee
     * event.createAttendee('Buh <buh@example.net>');
     * ```
     *
     * As with the organizer, you can also add an explicit `mailto` address.
     *
     * ```javascript
     * event.createAttendee({email: 'hui@example.com', name: 'Hui', mailto: 'another@mailto.com'});
     *
     * // overwrite an attendee's mailto address
     * attendee.mailto('another@mailto.net');
     * ```
     *
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
     * Get all attendees
     * @since 0.2.0
     */
    attendees(): ICalAttendee[];

    /**
     * Add multiple attendees to your event
     *
     * ```javascript
     * const event = ical().createEvent();
     *
     * cal.attendees([
     *     {email: 'a@example.com', name: 'Person A'},
     *     {email: 'b@example.com', name: 'Person B'}
     * ]);
     *
     * cal.attendees(); // --> [ICalAttendee, ICalAttendee]
     * ```
     *
     * @since 0.2.0
     */
    attendees(attendees: (ICalAttendee | ICalAttendeeData | string)[]): this;
    attendees(attendees?: (ICalAttendee | ICalAttendeeData | string)[]): this | ICalAttendee[] {
        if (!attendees) {
            return this.data.attendees;
        }

        attendees.forEach(attendee => this.createAttendee(attendee));
        return this;
    }


    /**
     * Creates a new [[`ICalAlarm`]] and returns it. Use options to prefill
     * the alarm's attributes. Calling this method without options will create
     * an empty alarm.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const alarm = event.createAlarm({type: ICalAlarmType.display, trigger: 300});
     *
     * // add another alarm
     * event.createAlarm({
     *     type: ICalAlarmType.audio,
     *     trigger: 300, // 5min before event
     * });
     * ```
     *
     * @since 0.2.1
     */
    createAlarm(data: ICalAlarm | ICalAlarmData = {}): ICalAlarm {
        const alarm = data instanceof ICalAlarm ? data : new ICalAlarm(data, this);
        this.data.alarms.push(alarm);
        return alarm;
    }


    /**
     * Get all alarms
     * @since 0.2.0
     */
    alarms(): ICalAlarm[];

    /**
     * Add one or multiple alarms
     *
     * ```javascript
     * const event = ical().createEvent();
     *
     * cal.alarms([
     *     {type: ICalAlarmType.display, trigger: 600},
     *     {type: ICalAlarmType.audio, trigger: 300}
     * ]);
     *
     * cal.alarms(); // --> [ICalAlarm, ICalAlarm]
     ```
     *
     * @since 0.2.0
     */
    alarms(alarms: ICalAlarm[] | ICalAlarmData[]): this;
    alarms(alarms?: ICalAlarm[] | ICalAlarmData[]): this | ICalAlarm[] {
        if (!alarms) {
            return this.data.alarms;
        }

        alarms.forEach((alarm: ICalAlarm | ICalAlarmData) => this.createAlarm(alarm));
        return this;
    }


    /**
     * Creates a new [[`ICalCategory`]] and returns it. Use options to prefill the categories' attributes.
     * Calling this method without options will create an empty category.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const category = event.createCategory({name: 'APPOINTMENT'});
     *
     * // add another alarm
     * event.createCategory({
     *     name: 'MEETING'
     * });
     * ```
     *
     * @since 0.3.0
     */
    createCategory(data: ICalCategory | ICalCategoryData = {}): ICalCategory {
        const category = data instanceof ICalCategory ? data : new ICalCategory(data);
        this.data.categories.push(category);
        return category;
    }


    /**
     * Get all categories
     * @since 0.3.0
     */
    categories(): ICalCategory[];

    /**
     * Add categories to the event or return all selected categories.
     *
     * ```javascript
     * const event = ical().createEvent();
     *
     * cal.categories([
     *     {name: 'APPOINTMENT'},
     *     {name: 'MEETING'}
     * ]);
     *
     * cal.categories(); // --> [ICalCategory, ICalCategory]
     * ```
     *
     * @since 0.3.0
     */
    categories(categories: (ICalCategory | ICalCategoryData)[]): this;
    categories(categories?: (ICalCategory | ICalCategoryData)[]): this | ICalCategory[] {
        if (!categories) {
            return this.data.categories;
        }

        categories.forEach(category => this.createCategory(category));
        return this;
    }


    /**
     * Get the event's status
     * @since 0.2.0
     */
    status(): ICalEventStatus | null;

    /**
     * Set the event's status
     *
     * ```javascript
     * import ical, {ICalEventStatus} from 'ical-generator';
     * event.status(ICalEventStatus.CONFIRMED);
     * ```
     *
     * @since 0.2.0
     */
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
     * Get the event's busy status
     * @since 1.0.2
     */
    busystatus(): ICalEventBusyStatus | null;

    /**
     * Set the event's busy status. Will add the
     * [`X-MICROSOFT-CDO-BUSYSTATUS`](https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcical/cd68eae7-ed65-4dd3-8ea7-ad585c76c736)
     * attribute to your event.
     *
     * ```javascript
     * import ical, {ICalEventBusyStatus} from 'ical-generator';
     * event.busystatus(ICalEventBusyStatus.BUSY);
     * ```
     *
     * @since 1.0.2
     */
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
     * Get the event's priority. A value of 1 represents
     * the highest priority, 9 the lowest. 0 specifies an undefined
     * priority.
     *
     * @since v2.0.0-develop.7
     */
    priority(): number | null;

    /**
     * Set the event's priority. A value of 1 represents
     * the highest priority, 9 the lowest. 0 specifies an undefined
     * priority.
     *
     * @since v2.0.0-develop.7
     */
    priority(priority: number | null): this;
    priority(priority?: number | null): this | number | null {
        if (priority === undefined) {
            return this.data.priority;
        }
        if (priority === null) {
            this.data.priority = null;
            return this;
        }

        if(priority < 0 || priority > 9) {
            throw new Error('`priority` is invalid, musst be 0 ≤ priority ≤ 9.');
        }

        this.data.priority = Math.round(priority);
        return this;
    }


    /**
     * Get the event's URL
     * @since 0.2.0
     */
    url(): string | null;

    /**
     * Set the event's URL
     * @since 0.2.0
     */
    url(url: string | null): this;
    url(url?: string | null): this | string | null {
        if (url === undefined) {
            return this.data.url;
        }

        this.data.url = url ? String(url) : null;
        return this;
    }

    /**
     * Adds an attachment to the event by adding the file URL to the calendar.
     *
     * `ical-generator` only supports external attachments. File attachments that
     * are directly included in the file are not supported, because otherwise the
     * calendar file could easily become unfavourably large.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * event.createAttachment('https://files.sebbo.net/calendar/attachments/foo');
     * ```
     *
     * @since 3.2.0-develop.1
     */
    createAttachment(url: string): this {
        this.data.attachments.push(url);
        return this;
    }


    /**
     * Get all attachment urls
     * @since 3.2.0-develop.1
     */
    attachments(): string[];

    /**
     * Add one or multiple alarms
     *
     * ```javascript
     * const event = ical().createEvent();
     *
     * cal.attachments([
     *     'https://files.sebbo.net/calendar/attachments/foo',
     *     'https://files.sebbo.net/calendar/attachments/bar'
     * ]);
     *
     * cal.attachments(); // --> [string, string]
     ```
     *
     * 3.2.0-develop.1
     */
    attachments(attachments: string[]): this;
    attachments(attachments?: string[]): this | string[] {
        if (!attachments) {
            return this.data.attachments;
        }

        attachments.forEach((attachment: string) => this.createAttachment(attachment));
        return this;
    }

    /**
     * Get the event's transparency
     * @since 1.7.3
     */
    transparency(): ICalEventTransparency | null;

    /**
     * Set the event's transparency
     *
     * Set the field to `OPAQUE` if the person or resource is no longer
     * available due to this event. If the calendar entry has no influence
     * on availability, you can set the field to `TRANSPARENT`. This value
     * is mostly used to find out if a person has time on a certain date or
     * not (see `TRANSP` in iCal specification).
     *
     * ```javascript
     * import ical, {ICalEventTransparency} from 'ical-generator';
     * event.transparency(ICalEventTransparency.OPAQUE);
     * ```
     *
     * @since 1.7.3
     */
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
     * Get the event's creation date
     * @since 0.3.0
     */
    created(): ICalDateTimeValue | null;

    /**
     * Set the event's creation date
     * @since 0.3.0
     */
    created(created: ICalDateTimeValue | null): this;
    created(created?: ICalDateTimeValue | null): this | ICalDateTimeValue | null {
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
     * Get the event's last modification date
     * @since 0.3.0
     */
    lastModified(): ICalDateTimeValue | null;

    /**
     * Set the event's last modification date
     * @since 0.3.0
     */
    lastModified(lastModified: ICalDateTimeValue | null): this;
    lastModified(lastModified?: ICalDateTimeValue | null): this | ICalDateTimeValue | null {
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
     * Get the event's class
     * @since 2.0.0
     */
    class(): ICalEventClass | null;

    /**
     * Set the event's class
     *
     * ```javascript
     * import ical, { ICalEventClass } from 'ical-generator';
     * event.class(ICalEventClass.PRIVATE);
     * ```
     *
     * @since 2.0.0
     */
    class(class_: ICalEventClass | null): this;
    class(class_?: ICalEventClass | null): this | ICalEventClass | null {
        if (class_ === undefined) {
            return this.data.class;
        }
        if (class_ === null) {
            this.data.class = null;
            return this;
        }

        this.data.class = checkEnum(ICalEventClass, class_) as ICalEventClass;
        return this;
    }


    /**
     * Set X-* attributes. Woun't filter double attributes,
     * which are also added by another method (e.g. summary),
     * so these attributes may be inserted twice.
     *
     * ```javascript
     * event.x([
     *     {
     *         key: "X-MY-CUSTOM-ATTR",
     *         value: "1337!"
     *     }
     * ]);
     *
     * event.x([
     *     ["X-MY-CUSTOM-ATTR", "1337!"]
     * ]);
     *
     * event.x({
     *     "X-MY-CUSTOM-ATTR": "1337!"
     * });
     * ```
     *
     * @since 1.9.0
     */
    x (keyOrArray: {key: string, value: string}[] | [string, string][] | Record<string, string>): this;

    /**
     * Set a X-* attribute. Woun't filter double attributes,
     * which are also added by another method (e.g. summary),
     * so these attributes may be inserted twice.
     *
     * ```javascript
     * event.x("X-MY-CUSTOM-ATTR", "1337!");
     * ```
     *
     * @since 1.9.0
     */
    x (keyOrArray: string, value: string): this;

    /**
     * Get all custom X-* attributes.
     * @since 1.9.0
     */
    x (): {key: string, value: string}[];
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
     * Return a shallow copy of the events's options for JSON stringification.
     * Third party objects like moment.js values or RRule objects are stringified
     * as well. Can be used for persistence.
     *
     * ```javascript
     * const event = ical().createEvent();
     * const json = JSON.stringify(event);
     *
     * // later: restore event data
     * const calendar = ical().createEvent(JSON.parse(json));
     * ```
     *
     * @since 0.2.4
     */
    toJSON(): ICalEventJSONData {
        let repeating: ICalEventInternalRepeatingData | string | null = null;
        if(isRRule(this.data.repeating) || typeof this.data.repeating === 'string') {
            repeating = this.data.repeating.toString();
        }
        else if(this.data.repeating) {
            repeating = Object.assign({}, this.data.repeating, {
                until: toJSON(this.data.repeating.until) || undefined,
                exclude: this.data.repeating.exclude?.map(d => toJSON(d)),
            });
        }

        return Object.assign({}, this.data, {
            start: toJSON(this.data.start) || null,
            end: toJSON(this.data.end) || null,
            recurrenceId: toJSON(this.data.recurrenceId) || null,
            stamp: toJSON(this.data.stamp) || null,
            created: toJSON(this.data.created) || null,
            lastModified: toJSON(this.data.lastModified) || null,
            repeating,
            x: this.x()
        });
    }


    /**
     * Return generated event as a string.
     *
     * ```javascript
     * const event = ical().createEvent();
     * console.log(event.toString()); // → BEGIN:VEVENT…
     * ```
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
        if(isRRule(this.data.repeating) || typeof this.data.repeating === 'string') {
            let repeating = this.data.repeating
                .toString()
                .replace(/\r\n/g, '\n')
                .split('\n')
                .filter(l => l && !l.startsWith('DTSTART:'))
                .join('\r\n');

            if(!repeating.includes('\r\n') && !repeating.startsWith('RRULE:')) {
                repeating = 'RRULE:' + repeating;
            }

            g += repeating.trim() + '\r\n';
        }
        else if (this.data.repeating) {
            g += 'RRULE:FREQ=' + this.data.repeating.freq;

            if (this.data.repeating.count) {
                g += ';COUNT=' + this.data.repeating.count;
            }

            if (this.data.repeating.interval) {
                g += ';INTERVAL=' + this.data.repeating.interval;
            }

            if (this.data.repeating.until) {
                g += ';UNTIL=' + formatDate(this.calendar.timezone(), this.data.repeating.until, false, this.floating());
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
                g += ';BYSETPOS=' + this.data.repeating.bySetPos.join(',');
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
                            return formatDate(this.timezone(), excludedDate, false, this.floating());
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
        g += 'SUMMARY:' + escape(this.data.summary, false) + '\r\n';

        // TRANSPARENCY
        if (this.data.transparency) {
            g += 'TRANSP:' + escape(this.data.transparency, false) + '\r\n';
        }

        // LOCATION
        if (this.data.location?.title) {
            g += 'LOCATION:' + escape(
                this.data.location.title +
                (this.data.location.address ? '\n' + this.data.location.address : ''),
                false
            ) + '\r\n';

            if (this.data.location.radius && this.data.location.geo) {
                g += 'X-APPLE-STRUCTURED-LOCATION;VALUE=URI;' +
                    (this.data.location.address ? 'X-ADDRESS=' + escape(this.data.location.address, false) + ';' : '') +
                    'X-APPLE-RADIUS=' + escape(this.data.location.radius, false) + ';' +
                    'X-TITLE=' + escape(this.data.location.title, false) +
                    ':geo:' + escape(this.data.location.geo?.lat, false) + ',' +
                    escape(this.data.location.geo?.lon, false) + '\r\n';
            }

            if (this.data.location.geo) {
                g += 'GEO:' + escape(this.data.location.geo?.lat, false) + ';' +
                    escape(this.data.location.geo?.lon, false) + '\r\n';
            }
        }

        // DESCRIPTION
        if (this.data.description) {
            g += 'DESCRIPTION:' + escape(this.data.description.plain, false) + '\r\n';

            // HTML DESCRIPTION
            if (this.data.description.html) {
                g += 'X-ALT-DESC;FMTTYPE=text/html:' + escape(this.data.description.html, false) + '\r\n';
            }
        }

        // ORGANIZER
        if (this.data.organizer) {
            g += 'ORGANIZER;CN="' + escape(this.data.organizer.name, true) + '"';

            if (this.data.organizer.sentBy) {
                g += ';SENT-BY="mailto:' + escape(this.data.organizer.sentBy, true) + '"';
            }
            if (this.data.organizer.email && this.data.organizer.mailto) {
                g += ';EMAIL=' + escape(this.data.organizer.email, false);
            }
            if(this.data.organizer.email) {
                g += ':mailto:' + escape(this.data.organizer.mailto || this.data.organizer.email, false);
            }
            g += '\r\n';
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
            g += 'URL;VALUE=URI:' + escape(this.data.url, false) + '\r\n';
        }

        // ATTACHMENT
        if (this.data.attachments.length > 0) {
            this.data.attachments.forEach(url => {
                g += 'ATTACH:' + escape(url, false) + '\r\n';
            });
        }

        // STATUS
        if (this.data.status) {
            g += 'STATUS:' + this.data.status.toUpperCase() + '\r\n';
        }

        // BUSYSTATUS
        if (this.data.busystatus) {
            g += 'X-MICROSOFT-CDO-BUSYSTATUS:' + this.data.busystatus.toUpperCase() + '\r\n';
        }

        // PRIORITY
        if (this.data.priority !== null) {
            g += 'PRIORITY:' + this.data.priority + '\r\n';
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

        if (this.data.class) {
            g+= 'CLASS:' + this.data.class.toUpperCase() + '\r\n';
        }

        g += 'END:VEVENT\r\n';
        return g;
    }
}
