'use strict';

import ICalAlarm, { type ICalAlarmData } from './alarm.ts';
import ICalAttendee, { type ICalAttendeeData } from './attendee.ts';
import ICalCalendar from './calendar.ts';
import ICalCategory, { type ICalCategoryData } from './category.ts';
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
    toJSON,
} from './tools.ts';
import {
    type ICalDateTimeValue,
    type ICalDescription,
    ICalEventRepeatingFreq,
    type ICalLocation,
    type ICalOrganizer,
    type ICalRepeatingOptions,
    type ICalRRuleStub,
    ICalWeekday,
} from './types.ts';

export enum ICalEventBusyStatus {
    BUSY = 'BUSY',
    FREE = 'FREE',
    OOF = 'OOF',
    TENTATIVE = 'TENTATIVE',
}

export enum ICalEventClass {
    CONFIDENTIAL = 'CONFIDENTIAL',
    PRIVATE = 'PRIVATE',
    PUBLIC = 'PUBLIC',
}

export enum ICalEventStatus {
    CANCELLED = 'CANCELLED',
    CONFIRMED = 'CONFIRMED',
    TENTATIVE = 'TENTATIVE',
}

export enum ICalEventTransparency {
    OPAQUE = 'OPAQUE',
    TRANSPARENT = 'TRANSPARENT',
}

export interface ICalEventData {
    alarms?: ICalAlarm[] | ICalAlarmData[];
    allDay?: boolean;
    attachments?: string[];
    attendees?: ICalAttendee[] | ICalAttendeeData[];
    busystatus?: ICalEventBusyStatus | null;
    categories?: ICalCategory[] | ICalCategoryData[];
    class?: ICalEventClass | null;
    created?: ICalDateTimeValue | null;
    description?: ICalDescription | null | string;
    end?: ICalDateTimeValue | null;
    floating?: boolean;
    id?: null | number | string;
    lastModified?: ICalDateTimeValue | null;
    location?: ICalLocation | null | string;
    organizer?: ICalOrganizer | null | string;
    priority?: null | number;
    recurrenceId?: ICalDateTimeValue | null;
    repeating?: ICalRepeatingOptions | ICalRRuleStub | null | string;
    sequence?: number;
    stamp?: ICalDateTimeValue;
    start: ICalDateTimeValue;
    status?: ICalEventStatus | null;
    summary?: string;
    timezone?: null | string;
    transparency?: ICalEventTransparency | null;
    url?: null | string;
    x?:
        | [string, string][]
        | Record<string, string>
        | { key: string; value: string }[];
}

export interface ICalEventJSONData {
    alarms: ICalAlarm[];
    allDay: boolean;
    attachments: string[];
    attendees: ICalAttendee[];
    busystatus: ICalEventBusyStatus | null;
    categories: ICalCategory[];
    created: null | string;
    description: ICalDescription | null;
    end: null | string;
    floating: boolean;
    id: string;
    lastModified: null | string;
    location: ICalLocation | null;
    organizer: ICalOrganizer | null;
    priority?: null | number;
    recurrenceId: null | string;
    repeating: ICalEventJSONRepeatingData | null | string;
    sequence: number;
    stamp: string;
    start: string;
    status: ICalEventStatus | null;
    summary: string;
    timezone: null | string;
    transparency: ICalEventTransparency | null;
    url: null | string;
    x: { key: string; value: string }[];
}

export interface ICalEventJSONRepeatingData {
    byDay?: ICalWeekday[];
    byMonth?: number[];
    byMonthDay?: number[];
    bySetPos?: number[];
    count?: number;
    exclude?: ICalDateTimeValue[];
    freq: ICalEventRepeatingFreq;
    interval?: number;
    startOfWeek?: ICalWeekday;
    until?: ICalDateTimeValue;
}

interface ICalEventInternalData {
    alarms: ICalAlarm[];
    allDay: boolean;
    attachments: string[];
    attendees: ICalAttendee[];
    busystatus: ICalEventBusyStatus | null;
    categories: ICalCategory[];
    class: ICalEventClass | null;
    created: ICalDateTimeValue | null;
    description: ICalDescription | null;
    end: ICalDateTimeValue | null;
    floating: boolean;
    id: string;
    lastModified: ICalDateTimeValue | null;
    location: ICalLocation | null;
    organizer: ICalOrganizer | null;
    priority: null | number;
    recurrenceId: ICalDateTimeValue | null;
    repeating: ICalEventJSONRepeatingData | ICalRRuleStub | null | string;
    sequence: number;
    stamp: ICalDateTimeValue;
    start: ICalDateTimeValue;
    status: ICalEventStatus | null;
    summary: string;
    timezone: null | string;
    transparency: ICalEventTransparency | null;
    url: null | string;
    x: [string, string][];
}

/**
 * Usually you get an {@link ICalEvent} object like this:
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * const event = calendar.createEvent();
 * ```
 */
export default class ICalEvent {
    private readonly calendar: ICalCalendar;
    private readonly data: ICalEventInternalData;

    /**
     * Constructor of [[`ICalEvent`]. The calendar reference is
     * required to query the calendar's timezone when required.
     *
     * @param data Calendar Event Data
     * @param calendar Reference to ICalCalendar object
     */
    constructor(data: ICalEventData, calendar: ICalCalendar) {
        this.data = {
            alarms: [],
            allDay: false,
            attachments: [],
            attendees: [],
            busystatus: null,
            categories: [],
            class: null,
            created: null,
            description: null,
            end: null,
            floating: false,
            id: crypto.randomUUID(),
            lastModified: null,
            location: null,
            organizer: null,
            priority: null,
            recurrenceId: null,
            repeating: null,
            sequence: 0,
            stamp: new Date(),
            start: new Date(),
            status: null,
            summary: '',
            timezone: null,
            transparency: null,
            url: null,
            x: [],
        };

        this.calendar = calendar;
        if (!calendar) {
            throw new Error('`calendar` option required!');
        }

        if (data.id) this.id(data.id);
        if (data.sequence !== undefined) this.sequence(data.sequence);
        if (data.start) this.start(data.start);
        if (data.end !== undefined) this.end(data.end);
        if (data.recurrenceId !== undefined)
            this.recurrenceId(data.recurrenceId);
        if (data.timezone !== undefined) this.timezone(data.timezone);
        if (data.stamp !== undefined) this.stamp(data.stamp);
        if (data.allDay !== undefined) this.allDay(data.allDay);
        if (data.floating !== undefined) this.floating(data.floating);
        if (data.repeating !== undefined) this.repeating(data.repeating);
        if (data.summary !== undefined) this.summary(data.summary);
        if (data.location !== undefined) this.location(data.location);
        if (data.description !== undefined) this.description(data.description);
        if (data.organizer !== undefined) this.organizer(data.organizer);
        if (data.attendees !== undefined) this.attendees(data.attendees);
        if (data.alarms !== undefined) this.alarms(data.alarms);
        if (data.categories !== undefined) this.categories(data.categories);
        if (data.status !== undefined) this.status(data.status);
        if (data.busystatus !== undefined) this.busystatus(data.busystatus);
        if (data.priority !== undefined) this.priority(data.priority);
        if (data.url !== undefined) this.url(data.url);
        if (data.attachments !== undefined) this.attachments(data.attachments);
        if (data.transparency !== undefined)
            this.transparency(data.transparency);
        if (data.created !== undefined) this.created(data.created);
        if (data.lastModified !== undefined)
            this.lastModified(data.lastModified);
        if (data.class !== undefined) this.class(data.class);
        if (data.x !== undefined) this.x(data.x);
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
    alarms(alarms?: ICalAlarm[] | ICalAlarmData[]): ICalAlarm[] | this {
        if (!alarms) {
            return this.data.alarms;
        }

        alarms.forEach((alarm: ICalAlarm | ICalAlarmData) =>
            this.createAlarm(alarm),
        );
        return this;
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
     * ```typescript
     * import ical from 'ical-generator';
     *
     * const cal = ical();
     *
     * cal.createEvent({
     *   start: new Date('2020-01-01'),
     *   summary: 'Very Important Day',
     *   allDay: true
     * });
     *
     * cal.toString();
     * ```
     *
     * ```text
     * BEGIN:VCALENDAR
     * VERSION:2.0
     * PRODID:-//sebbo.net//ical-generator//EN
     * BEGIN:VEVENT
     * UID:1964fe8d-32c5-4f2a-bd62-7d9d7de5992b
     * SEQUENCE:0
     * DTSTAMP:20240212T191956Z
     * DTSTART;VALUE=DATE:20200101
     * X-MICROSOFT-CDO-ALLDAYEVENT:TRUE
     * X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT:TRUE
     * SUMMARY:Very Important Day
     * END:VEVENT
     * END:VCALENDAR
     * ```
     *
     * @since 0.2.0
     */
    allDay(allDay: boolean): this;
    allDay(allDay?: boolean): boolean | this {
        if (allDay === undefined) {
            return this.data.allDay;
        }

        this.data.allDay = Boolean(allDay);
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
    attachments(attachments?: string[]): string[] | this {
        if (!attachments) {
            return this.data.attachments;
        }

        attachments.forEach((attachment: string) =>
            this.createAttachment(attachment),
        );
        return this;
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
    attendees(
        attendees?: (ICalAttendee | ICalAttendeeData | string)[],
    ): ICalAttendee[] | this {
        if (!attendees) {
            return this.data.attendees;
        }

        attendees.forEach((attendee) => this.createAttendee(attendee));
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
    busystatus(
        busystatus?: ICalEventBusyStatus | null,
    ): ICalEventBusyStatus | null | this {
        if (busystatus === undefined) {
            return this.data.busystatus;
        }
        if (busystatus === null) {
            this.data.busystatus = null;
            return this;
        }

        this.data.busystatus = checkEnum(
            ICalEventBusyStatus,
            busystatus,
        ) as ICalEventBusyStatus;
        return this;
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
    categories(
        categories?: (ICalCategory | ICalCategoryData)[],
    ): ICalCategory[] | this {
        if (!categories) {
            return this.data.categories;
        }

        categories.forEach((category) => this.createCategory(category));
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
    class(class_?: ICalEventClass | null): ICalEventClass | null | this {
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
     * Creates a new {@link ICalAlarm} and returns it. Use options to prefill
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
    createAlarm(data: ICalAlarm | ICalAlarmData): ICalAlarm {
        const alarm =
            data instanceof ICalAlarm ? data : new ICalAlarm(data, this);
        this.data.alarms.push(alarm);
        return alarm;
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
     * Creates a new {@link ICalAttendee} and returns it. Use options to prefill
     * the attendee's attributes. Calling this method without options will create
     * an empty attendee.
     *
     * ```javascript
     * import ical from 'ical-generator';
     *
     * const cal = ical();
     * const event = cal.createEvent({
     *   start: new Date()
     * });
     *
     * event.createAttendee({email: 'hui@example.com', name: 'Hui'});
     *
     * // add another attendee
     * event.createAttendee('Buh <buh@example.net>');
     * ```
     *
     * ```text
     * BEGIN:VCALENDAR
     * VERSION:2.0
     * PRODID:-//sebbo.net//ical-generator//EN
     * BEGIN:VEVENT
     * UID:b4944f07-98e4-4581-ac80-2589bb20273d
     * SEQUENCE:0
     * DTSTAMP:20240212T194232Z
     * DTSTART:20240212T194232Z
     * SUMMARY:
     * ATTENDEE;ROLE=REQ-PARTICIPANT;CN="Hui":MAILTO:hui@example.com
     * ATTENDEE;ROLE=REQ-PARTICIPANT;CN="Buh":MAILTO:buh@example.net
     * END:VEVENT
     * END:VCALENDAR
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
    createAttendee(
        data: ICalAttendee | ICalAttendeeData | string,
    ): ICalAttendee {
        if (data instanceof ICalAttendee) {
            this.data.attendees.push(data);
            return data;
        }
        if (typeof data === 'string') {
            data = { email: data, ...checkNameAndMail('data', data) };
        }

        const attendee = new ICalAttendee(data, this);
        this.data.attendees.push(attendee);
        return attendee;
    }
    /**
     * Creates a new {@link ICalCategory} and returns it. Use options to prefill the category's attributes.
     * Calling this method without options will create an empty category.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const category = event.createCategory({name: 'APPOINTMENT'});
     *
     * // add another category
     * event.createCategory({
     *     name: 'MEETING'
     * });
     * ```
     *
     * @since 0.3.0
     */
    createCategory(data: ICalCategory | ICalCategoryData): ICalCategory {
        const category =
            data instanceof ICalCategory ? data : new ICalCategory(data);
        this.data.categories.push(category);
        return category;
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
    created(
        created?: ICalDateTimeValue | null,
    ): ICalDateTimeValue | null | this {
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
     * Get the event's description as an {@link ICalDescription} object.
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
     *     plain: 'Hello World!',
     *     html: '<p>Hello World!</p>'
     * });
     * ```
     *
     * ```text
     * DESCRIPTION:Hello World!
     * X-ALT-DESC;FMTTYPE=text/html:<p>Hello World!</p>
     * ```
     *
     * @since 0.2.0
     */
    description(description: ICalDescription | null | string): this;
    description(
        description?: ICalDescription | null | string,
    ): ICalDescription | null | this {
        if (description === undefined) {
            return this.data.description;
        }
        if (description === null) {
            this.data.description = null;
            return this;
        }

        if (typeof description === 'string') {
            this.data.description = { plain: description };
        } else {
            this.data.description = description;
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
    end(end?: ICalDateTimeValue | null): ICalDateTimeValue | null | this {
        if (end === undefined) {
            this.swapStartAndEndIfRequired();
            return this.data.end;
        }
        if (end === null) {
            this.data.end = null;
            return this;
        }

        this.data.end = checkDate(end, 'end');
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
     * ```typescript
     * import ical from 'ical-generator';
     *
     * const cal = ical();
     *
     * cal.createEvent({
     *   start: new Date('2020-01-01T20:00:00Z'),
     *   summary: 'Always at 20:00 in every <Timezone',
     *   floating: true
     * });
     *
     * cal.toString();
     * ```
     *
     * ```text
     * BEGIN:VCALENDAR
     * VERSION:2.0
     * PRODID:-//sebbo.net//ical-generator//EN
     * BEGIN:VEVENT
     * UID:5d7278f9-ada3-40ef-83d1-23c29ce0a763
     * SEQUENCE:0
     * DTSTAMP:20240212T192214Z
     * DTSTART:20200101T200000
     * SUMMARY:Always at 20:00 in every <Timezone
     * END:VEVENT
     * END:VCALENDAR
     * ```
     *
     * @since 0.2.0
     */
    floating(floating?: boolean): boolean | this {
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
    id(id: number | string): this;
    id(id?: number | string): string | this {
        if (id === undefined) {
            return this.data.id;
        }

        this.data.id = String(id);
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
    lastModified(
        lastModified?: ICalDateTimeValue | null,
    ): ICalDateTimeValue | null | this {
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
     * Get the event's location
     * @since 0.2.0
     */
    location(): ICalLocation | null;
    /**
     * Set the event's location by passing a string (minimum) or
     * an {@link ICalLocationWithTitle} object which will also fill the iCal
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
     * ```text
     * LOCATION:Apple Store Kurfürstendamm\nKurfürstendamm 26\, 10719 Berlin\,
     *  Deutschland
     * X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS=Kurfürstendamm 26\, 10719
     *   Berlin\, Deutschland;X-APPLE-RADIUS=141.1751386318387;X-TITLE=Apple Store
     *   Kurfürstendamm:geo:52.50363,13.32865
     * GEO:52.50363;13.32865
     * ```
     *
     * Since v6.1.0 you can also pass a {@link ICalLocationWithoutTitle} object to pass
     * the geolocation only. This will only fill the iCal `GEO` attribute.
     *
     * ```javascript
     * event.location({
     *    geo: {
     *        lat: 52.503630,
     *        lon: 13.328650
     *    }
     * });
     * ```
     *
     * ```text
     * GEO:52.50363;13.32865
     * ```
     *
     * @since 0.2.0
     */
    location(location: ICalLocation | null | string): this;
    location(
        location?: ICalLocation | null | string,
    ): ICalLocation | null | this {
        if (location === undefined) {
            return this.data.location;
        }
        if (typeof location === 'string') {
            this.data.location = {
                title: location,
            };
            return this;
        }
        if (
            location &&
            (('title' in location && !location.title) ||
                (location?.geo &&
                    (typeof location.geo.lat !== 'number' ||
                        !isFinite(location.geo.lat) ||
                        typeof location.geo.lon !== 'number' ||
                        !isFinite(location.geo.lon))) ||
                (!('title' in location) && !location?.geo))
        ) {
            throw new Error(
                "`location` isn't formatted correctly. See https://sebbo2002.github.io/ical-generator/" +
                    'develop/reference/classes/ICalEvent.html#location',
            );
        }

        this.data.location = location || null;
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
    organizer(organizer: ICalOrganizer | null | string): this;
    organizer(
        organizer?: ICalOrganizer | null | string,
    ): ICalOrganizer | null | this {
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
     * Get the event's priority. A value of 1 represents
     * the highest priority, 9 the lowest. 0 specifies an undefined
     * priority.
     *
     * @since v2.0.0-develop.7
     */
    priority(): null | number;
    /**
     * Set the event's priority. A value of 1 represents
     * the highest priority, 9 the lowest. 0 specifies an undefined
     * priority.
     *
     * @since v2.0.0-develop.7
     */
    priority(priority: null | number): this;
    priority(priority?: null | number): null | number | this {
        if (priority === undefined) {
            return this.data.priority;
        }
        if (priority === null) {
            this.data.priority = null;
            return this;
        }

        if (priority < 0 || priority > 9) {
            throw new Error(
                '`priority` is invalid, musst be 0 ≤ priority ≤ 9.',
            );
        }

        this.data.priority = Math.round(priority);
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
    recurrenceId(
        recurrenceId?: ICalDateTimeValue | null,
    ): ICalDateTimeValue | null | this {
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
     * Get the event's repeating options
     * @since 0.2.0
     */
    repeating(): ICalEventJSONRepeatingData | ICalRRuleStub | null | string;
    /**
     * Set the event's repeating options by passing an {@link ICalRepeatingOptions} object.
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
     * **Example:**
     *
     *```typescript
     * import ical, { ICalEventRepeatingFreq } from 'ical-generator';
     *
     * const cal = ical();
     *
     * const event = cal.createEvent({
     *   start: new Date('2020-01-01T20:00:00Z'),
     *   summary: 'Repeating Event'
     * });
     * event.repeating({
     *   freq: ICalEventRepeatingFreq.WEEKLY,
     *   count: 4
     * });
     *
     * cal.toString();
     * ```
     *
     * ```text
     * BEGIN:VCALENDAR
     * VERSION:2.0
     * PRODID:-//sebbo.net//ical-generator//EN
     * BEGIN:VEVENT
     * UID:b80e6a68-c2cd-48f5-b94d-cecc7ce83871
     * SEQUENCE:0
     * DTSTAMP:20240212T193646Z
     * DTSTART:20200101T200000Z
     * RRULE:FREQ=WEEKLY;COUNT=4
     * SUMMARY:Repeating Event
     * END:VEVENT
     * END:VCALENDAR
     * ```
     *
     * @since 0.2.0
     */
    repeating(repeating: ICalRepeatingOptions | null): this;
    /**
     * Set the event's repeating options by passing an [RRule object](https://github.com/jakubroztocil/rrule).
     * @since 2.0.0-develop.5
     *
     * ```typescript
     * import ical from 'ical-generator';
     * import { datetime, RRule } from 'rrule';
     *
     * const cal = ical();
     *
     * const event = cal.createEvent({
     *   start: new Date('2020-01-01T20:00:00Z'),
     *   summary: 'Repeating Event'
     * });
     *
     * const rule = new RRule({
     *   freq: RRule.WEEKLY,
     *   interval: 5,
     *   byweekday: [RRule.MO, RRule.FR],
     *   dtstart: datetime(2012, 2, 1, 10, 30),
     *   until: datetime(2012, 12, 31)
     * })
     * event.repeating(rule);
     *
     * cal.toString();
     * ```
     *
     * ```text
     * BEGIN:VCALENDAR
     * VERSION:2.0
     * PRODID:-//sebbo.net//ical-generator//EN
     * BEGIN:VEVENT
     * UID:36585e40-8fa8-460d-af0c-88b6f434030b
     * SEQUENCE:0
     * DTSTAMP:20240212T193827Z
     * DTSTART:20200101T200000Z
     * RRULE:FREQ=WEEKLY;INTERVAL=5;BYDAY=MO,FR;UNTIL=20121231T000000Z
     * SUMMARY:Repeating Event
     * END:VEVENT
     * END:VCALENDAR
     * ```
     */
    repeating(repeating: ICalRRuleStub | null): this;
    /**
     * Set the events repeating options by passing a string which is inserted in the ical file.
     * @since 2.0.0-develop.5
     */
    repeating(repeating: null | string): this;
    /**
     * @internal
     */
    repeating(
        repeating: ICalRepeatingOptions | ICalRRuleStub | null | string,
    ): this;
    repeating(
        repeating?: ICalRepeatingOptions | ICalRRuleStub | null | string,
    ): ICalEventJSONRepeatingData | ICalRRuleStub | null | string | this {
        if (repeating === undefined) {
            return this.data.repeating;
        }
        if (!repeating) {
            this.data.repeating = null;
            return this;
        }
        if (isRRule(repeating) || typeof repeating === 'string') {
            this.data.repeating = repeating;
            return this;
        }

        this.data.repeating = {
            freq: checkEnum(
                ICalEventRepeatingFreq,
                repeating.freq,
            ) as ICalEventRepeatingFreq,
        };

        if (repeating.count) {
            if (!isFinite(repeating.count)) {
                throw new Error('`repeating.count` must be a finite number!');
            }

            this.data.repeating.count = repeating.count;
        }

        if (repeating.interval) {
            if (!isFinite(repeating.interval)) {
                throw new Error(
                    '`repeating.interval` must be a finite number!',
                );
            }

            this.data.repeating.interval = repeating.interval;
        }

        if (repeating.until !== undefined) {
            this.data.repeating.until = checkDate(
                repeating.until,
                'repeating.until',
            );
        }

        if (repeating.byDay) {
            const byDayArray = Array.isArray(repeating.byDay)
                ? repeating.byDay
                : [repeating.byDay];
            this.data.repeating.byDay = byDayArray.map(
                (day) => checkEnum(ICalWeekday, day) as ICalWeekday,
            );
        }

        if (repeating.byMonth) {
            const byMonthArray = Array.isArray(repeating.byMonth)
                ? repeating.byMonth
                : [repeating.byMonth];
            this.data.repeating.byMonth = byMonthArray.map((month) => {
                if (typeof month !== 'number' || month < 1 || month > 12) {
                    throw new Error(
                        '`repeating.byMonth` contains invalid value `' +
                            month +
                            '`!',
                    );
                }

                return month;
            });
        }

        if (repeating.byMonthDay) {
            const byMonthDayArray = Array.isArray(repeating.byMonthDay)
                ? repeating.byMonthDay
                : [repeating.byMonthDay];

            this.data.repeating.byMonthDay = byMonthDayArray.map((monthDay) => {
                if (
                    typeof monthDay !== 'number' ||
                    monthDay < -31 ||
                    monthDay > 31 ||
                    monthDay === 0
                ) {
                    throw new Error(
                        '`repeating.byMonthDay` contains invalid value `' +
                            monthDay +
                            '`!',
                    );
                }

                return monthDay;
            });
        }

        if (repeating.bySetPos) {
            if (!this.data.repeating.byDay) {
                throw '`repeating.bySetPos` must be used along with `repeating.byDay`!';
            }
            const bySetPosArray = Array.isArray(repeating.bySetPos)
                ? repeating.bySetPos
                : [repeating.bySetPos];
            this.data.repeating.bySetPos = bySetPosArray.map((bySetPos) => {
                if (
                    typeof bySetPos !== 'number' ||
                    bySetPos < -366 ||
                    bySetPos > 366 ||
                    bySetPos === 0
                ) {
                    throw (
                        '`repeating.bySetPos` contains invalid value `' +
                        bySetPos +
                        '`!'
                    );
                }
                return bySetPos;
            });
        }

        if (repeating.exclude) {
            const excludeArray = Array.isArray(repeating.exclude)
                ? repeating.exclude
                : [repeating.exclude];
            this.data.repeating.exclude = excludeArray.map((exclude, i) => {
                return checkDate(exclude, `repeating.exclude[${i}]`);
            });
        }

        if (repeating.startOfWeek) {
            this.data.repeating.startOfWeek = checkEnum(
                ICalWeekday,
                repeating.startOfWeek,
            ) as ICalWeekday;
        }

        return this;
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
    sequence(sequence?: number): number | this {
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
     * Get the event's timestamp
     * @since 0.2.0
     * @see {@link timestamp}
     */
    stamp(): ICalDateTimeValue;
    /**
     * Set the appointment date of creation. Defaults to the current time and date (`new Date()`). You can use
     * any supported date object, see [readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * @since 0.2.0
     * @see {@link timestamp}
     */
    stamp(stamp: ICalDateTimeValue): this;
    stamp(stamp?: ICalDateTimeValue): ICalDateTimeValue | this {
        if (stamp === undefined) {
            return this.data.stamp;
        }

        this.data.stamp = checkDate(stamp, 'stamp');
        return this;
    }

    /**
     * Get the event start time which is currently
     * set. Can be any supported date object.
     *
     * @since 0.2.0
     */
    start(): ICalDateTimeValue;
    /**
     * Set the appointment date of beginning, which is required for all events.
     * You can use any supported date object, see
     * [Readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * ```typescript
     * import ical from 'ical-generator';
     *
     * const cal = ical();
     *
     * const event = cal.createEvent({
     *   start: new Date('2020-01-01')
     * });
     *
     * // overwrites old start date
     * event.start(new Date('2024-02-01'));
     *
     * cal.toString();
     * ```
     *
     * ```text
     * BEGIN:VCALENDAR
     * VERSION:2.0
     * PRODID:-//sebbo.net//ical-generator//EN
     * BEGIN:VEVENT
     * UID:7e2aee64-b07a-4256-9b3e-e9eaa452bac8
     * SEQUENCE:0
     * DTSTAMP:20240212T190915Z
     * DTSTART:20240201T000000Z
     * SUMMARY:
     * END:VEVENT
     * END:VCALENDAR
     * ```
     *
     * @since 0.2.0
     */
    start(start: ICalDateTimeValue): this;
    start(start?: ICalDateTimeValue): ICalDateTimeValue | this {
        if (start === undefined) {
            this.swapStartAndEndIfRequired();
            return this.data.start;
        }

        this.data.start = checkDate(start, 'start');
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
    status(status?: ICalEventStatus | null): ICalEventStatus | null | this {
        if (status === undefined) {
            return this.data.status;
        }
        if (status === null) {
            this.data.status = null;
            return this;
        }

        this.data.status = checkEnum(
            ICalEventStatus,
            status,
        ) as ICalEventStatus;
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
    summary(summary?: string): string | this {
        if (summary === undefined) {
            return this.data.summary;
        }

        this.data.summary = summary ? String(summary) : '';
        return this;
    }

    /**
     * Get the event's timestamp
     * @since 0.2.0
     * @see {@link stamp}
     */
    timestamp(): ICalDateTimeValue;
    /**
     * Set the appointment date of creation. Defaults to the current time and date (`new Date()`). You can use
     * any supported date object, see [readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * @since 0.2.0
     * @see {@link stamp}
     */
    timestamp(stamp: ICalDateTimeValue): this;
    timestamp(stamp?: ICalDateTimeValue): ICalDateTimeValue | this {
        if (stamp === undefined) {
            return this.stamp();
        }

        return this.stamp(stamp);
    }
    /**
     * Get the event's timezone.
     * @since 0.2.6
     */
    timezone(): null | string;
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
    timezone(timezone: null | string): this;
    timezone(timezone?: null | string): null | string | this {
        if (timezone === undefined && this.data.timezone !== null) {
            return this.data.timezone;
        }
        if (timezone === undefined) {
            return this.calendar.timezone();
        }

        this.data.timezone =
            timezone && timezone !== 'UTC' ? timezone.toString() : null;
        if (this.data.timezone) {
            this.data.floating = false;
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
        let repeating: ICalEventJSONRepeatingData | null | string = null;
        if (
            isRRule(this.data.repeating) ||
            typeof this.data.repeating === 'string'
        ) {
            repeating = this.data.repeating.toString();
        } else if (this.data.repeating) {
            repeating = Object.assign({}, this.data.repeating, {
                exclude: this.data.repeating.exclude?.map((d) => toJSON(d)),
                until: toJSON(this.data.repeating.until) || undefined,
            });
        }

        this.swapStartAndEndIfRequired();
        return Object.assign({}, this.data, {
            created: toJSON(this.data.created) || null,
            end: toJSON(this.data.end) || null,
            lastModified: toJSON(this.data.lastModified) || null,
            recurrenceId: toJSON(this.data.recurrenceId) || null,
            repeating,
            stamp: toJSON(this.data.stamp) || null,
            start: toJSON(this.data.start) || null,
            x: this.x(),
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

        // DATE & TIME
        g += 'BEGIN:VEVENT\r\n';
        g += 'UID:' + this.data.id + '\r\n';

        // SEQUENCE
        g += 'SEQUENCE:' + this.data.sequence + '\r\n';

        this.swapStartAndEndIfRequired();
        g +=
            'DTSTAMP:' +
            formatDate(this.calendar.timezone(), this.data.stamp) +
            '\r\n';
        if (this.data.allDay) {
            g +=
                'DTSTART;VALUE=DATE:' +
                formatDate(this.timezone(), this.data.start, true) +
                '\r\n';
            if (this.data.end) {
                g +=
                    'DTEND;VALUE=DATE:' +
                    formatDate(this.timezone(), this.data.end, true) +
                    '\r\n';
            }

            g += 'X-MICROSOFT-CDO-ALLDAYEVENT:TRUE\r\n';
            g += 'X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT:TRUE\r\n';
        } else {
            g +=
                formatDateTZ(
                    this.timezone(),
                    'DTSTART',
                    this.data.start,
                    this.data,
                ) + '\r\n';
            if (this.data.end) {
                g +=
                    formatDateTZ(
                        this.timezone(),
                        'DTEND',
                        this.data.end,
                        this.data,
                    ) + '\r\n';
            }
        }

        // REPEATING
        if (
            isRRule(this.data.repeating) ||
            typeof this.data.repeating === 'string'
        ) {
            let repeating = this.data.repeating
                .toString()
                .replace(/\r\n/g, '\n')
                .split('\n')
                .filter((l) => l && !l.startsWith('DTSTART:'))
                .join('\r\n');

            if (
                !repeating.includes('\r\n') &&
                !repeating.startsWith('RRULE:')
            ) {
                repeating = 'RRULE:' + repeating;
            }

            g += repeating.trim() + '\r\n';
        } else if (this.data.repeating) {
            g += 'RRULE:FREQ=' + this.data.repeating.freq;

            if (this.data.repeating.count) {
                g += ';COUNT=' + this.data.repeating.count;
            }

            if (this.data.repeating.interval) {
                g += ';INTERVAL=' + this.data.repeating.interval;
            }

            if (this.data.repeating.until) {
                g +=
                    ';UNTIL=' +
                    formatDate(
                        this.calendar.timezone(),
                        this.data.repeating.until,
                        false,
                        this.floating(),
                    );
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
                    g +=
                        'EXDATE;VALUE=DATE:' +
                        this.data.repeating.exclude
                            .map((excludedDate) => {
                                return formatDate(
                                    this.calendar.timezone(),
                                    excludedDate,
                                    true,
                                );
                            })
                            .join(',') +
                        '\r\n';
                } else {
                    g += 'EXDATE';
                    if (this.timezone()) {
                        g +=
                            ';TZID=' +
                            this.timezone() +
                            ':' +
                            this.data.repeating.exclude
                                .map((excludedDate) => {
                                    // This isn't a 'floating' event because it has a timezone;
                                    // but we use it to omit the 'Z' UTC specifier in formatDate()
                                    return formatDate(
                                        this.timezone(),
                                        excludedDate,
                                        false,
                                        true,
                                    );
                                })
                                .join(',') +
                            '\r\n';
                    } else {
                        g +=
                            ':' +
                            this.data.repeating.exclude
                                .map((excludedDate) => {
                                    return formatDate(
                                        this.timezone(),
                                        excludedDate,
                                        false,
                                        this.floating(),
                                    );
                                })
                                .join(',') +
                            '\r\n';
                    }
                }
            }
        }

        // RECURRENCE
        if (this.data.recurrenceId) {
            g +=
                formatDateTZ(
                    this.timezone(),
                    'RECURRENCE-ID',
                    this.data.recurrenceId,
                    this.data,
                ) + '\r\n';
        }

        // SUMMARY
        g += 'SUMMARY:' + escape(this.data.summary, false) + '\r\n';

        // TRANSPARENCY
        if (this.data.transparency) {
            g += 'TRANSP:' + escape(this.data.transparency, false) + '\r\n';
        }

        // LOCATION
        if (
            this.data.location &&
            'title' in this.data.location &&
            this.data.location.title
        ) {
            g +=
                'LOCATION:' +
                escape(
                    this.data.location.title +
                        (this.data.location.address
                            ? '\n' + this.data.location.address
                            : ''),
                    false,
                ) +
                '\r\n';

            if (this.data.location.radius && this.data.location.geo) {
                g +=
                    'X-APPLE-STRUCTURED-LOCATION;VALUE=URI;' +
                    (this.data.location.address
                        ? 'X-ADDRESS=' +
                          escape(this.data.location.address, false) +
                          ';'
                        : '') +
                    'X-APPLE-RADIUS=' +
                    escape(this.data.location.radius, false) +
                    ';' +
                    'X-TITLE=' +
                    escape(this.data.location.title, false) +
                    ':geo:' +
                    escape(this.data.location.geo?.lat, false) +
                    ',' +
                    escape(this.data.location.geo?.lon, false) +
                    '\r\n';
            }
        }

        // GEO
        if (this.data.location?.geo?.lat && this.data.location.geo.lon) {
            g +=
                'GEO:' +
                escape(this.data.location.geo.lat, false) +
                ';' +
                escape(this.data.location.geo.lon, false) +
                '\r\n';
        }

        // DESCRIPTION
        if (this.data.description) {
            g +=
                'DESCRIPTION:' +
                escape(this.data.description.plain, false) +
                '\r\n';

            // HTML DESCRIPTION
            if (this.data.description.html) {
                g +=
                    'X-ALT-DESC;FMTTYPE=text/html:' +
                    escape(this.data.description.html, false) +
                    '\r\n';
            }
        }

        // ORGANIZER
        if (this.data.organizer) {
            g +=
                'ORGANIZER;CN="' + escape(this.data.organizer.name, true) + '"';

            if (this.data.organizer.sentBy) {
                g +=
                    ';SENT-BY="mailto:' +
                    escape(this.data.organizer.sentBy, true) +
                    '"';
            }
            if (this.data.organizer.email && this.data.organizer.mailto) {
                g += ';EMAIL=' + escape(this.data.organizer.email, false);
            }

            g += ':';
            if (this.data.organizer.email) {
                g +=
                    'mailto:' +
                    escape(
                        this.data.organizer.mailto || this.data.organizer.email,
                        false,
                    );
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
            g +=
                'CATEGORIES:' +
                this.data.categories
                    .map((category) => category.toString())
                    .join() +
                '\r\n';
        }

        // URL
        if (this.data.url) {
            g += 'URL;VALUE=URI:' + escape(this.data.url, false) + '\r\n';
        }

        // ATTACHMENT
        if (this.data.attachments.length > 0) {
            this.data.attachments.forEach((url) => {
                g += 'ATTACH:' + escape(url, false) + '\r\n';
            });
        }

        // STATUS
        if (this.data.status) {
            g += 'STATUS:' + this.data.status.toUpperCase() + '\r\n';
        }

        // BUSYSTATUS
        if (this.data.busystatus) {
            g +=
                'X-MICROSOFT-CDO-BUSYSTATUS:' +
                this.data.busystatus.toUpperCase() +
                '\r\n';
        }

        // PRIORITY
        if (this.data.priority !== null) {
            g += 'PRIORITY:' + this.data.priority + '\r\n';
        }

        // CUSTOM X ATTRIBUTES
        g += generateCustomAttributes(this.data);

        // CREATED
        if (this.data.created) {
            g +=
                'CREATED:' +
                formatDate(this.calendar.timezone(), this.data.created) +
                '\r\n';
        }

        // LAST-MODIFIED
        if (this.data.lastModified) {
            g +=
                'LAST-MODIFIED:' +
                formatDate(this.calendar.timezone(), this.data.lastModified) +
                '\r\n';
        }

        if (this.data.class) {
            g += 'CLASS:' + this.data.class.toUpperCase() + '\r\n';
        }

        g += 'END:VEVENT\r\n';
        return g;
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
    transparency(
        transparency?: ICalEventTransparency | null,
    ): ICalEventTransparency | null | this {
        if (transparency === undefined) {
            return this.data.transparency;
        }
        if (!transparency) {
            this.data.transparency = null;
            return this;
        }

        this.data.transparency = checkEnum(
            ICalEventTransparency,
            transparency,
        ) as ICalEventTransparency;
        return this;
    }

    /**
     * Get the event's ID
     * @since 0.2.0
     * @see {@link id}
     */
    uid(): string;
    /**
     * Use this method to set the event's ID.
     * If not set, a UUID will be generated randomly.
     *
     * @param id Event ID you want to set
     */
    uid(id: number | string): this;
    uid(id?: number | string): string | this {
        return id === undefined ? this.id() : this.id(id);
    }

    /**
     * Get the event's URL
     * @since 0.2.0
     */
    url(): null | string;
    /**
     * Set the event's URL
     * @since 0.2.0
     */
    url(url: null | string): this;
    url(url?: null | string): null | string | this {
        if (url === undefined) {
            return this.data.url;
        }

        this.data.url = url ? String(url) : null;
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
    x(
        keyOrArray:
            | [string, string][]
            | Record<string, string>
            | { key: string; value: string }[],
    ): this;
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
    x(keyOrArray: string, value: string): this;
    /**
     * Get all custom X-* attributes.
     * @since 1.9.0
     */
    x(): { key: string; value: string }[];
    x(
        keyOrArray?:
            | [string, string][]
            | Record<string, string>
            | string
            | { key: string; value: string }[],
        value?: string,
    ): this | void | { key: string; value: string }[] {
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
     * Checks if the start date is after the end date and swaps them if necessary.
     * @private
     */
    private swapStartAndEndIfRequired(): void {
        if (
            this.data.start &&
            this.data.end &&
            toDate(this.data.start).getTime() > toDate(this.data.end).getTime()
        ) {
            const t = this.data.start;
            this.data.start = this.data.end;
            this.data.end = t;
        }
    }
}
