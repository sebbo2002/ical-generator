'use strict';

import type {Duration} from 'moment-timezone';
import {
    addOrGetCustomAttributes,
    checkEnum,
    foldLines,
    generateCustomAttributes,
    isMomentDuration,
    toDurationString
} from './tools';
import ICalEvent, {ICalEventData, ICalEventJSONData} from './event';
import {writeFile, writeFileSync} from 'fs';
import {promises as fsPromises} from 'fs';
import {ServerResponse} from 'http';
import {ICalTimezone} from './types';


export interface ICalCalendarData {
    prodId?: ICalCalendarProdIdData | string;
    method?: ICalCalendarMethod | null;
    name?: string | null;
    description?: string | null;
    timezone?: ICalTimezone | string | null;
    source?: string | null;
    url?: string | null;
    scale?: string | null;
    ttl?: number | Duration | null;
    events?: (ICalEvent | ICalEventData)[];
    x?: {key: string, value: string}[] | [string, string][] | Record<string, string>;
}

interface ICalCalendarInternalData {
    prodId: string;
    method: ICalCalendarMethod | null;
    name: string | null;
    description: string | null;
    timezone: ICalTimezone | null;
    source: string | null;
    url: string | null;
    scale: string | null;
    ttl: number | null;
    events: ICalEvent[];
    x: [string, string][];
}

export interface ICalCalendarJSONData {
    prodId: string;
    method: ICalCalendarMethod | null;
    name: string | null;
    description: string | null;
    timezone: string | null;
    source: string | null;
    url: string | null;
    scale: string | null;
    ttl: number | null;
    events: ICalEventJSONData[];
    x: {key: string, value: string}[];
}

export interface ICalCalendarProdIdData {
    company: string;
    product: string;
    language?: string;
}

export enum ICalCalendarMethod {
    PUBLISH = 'PUBLISH',
    REQUEST = 'REQUEST',
    REPLY = 'REPLY',
    ADD = 'ADD',
    CANCEL = 'CANCEL',
    REFRESH = 'REFRESH',
    COUNTER = 'COUNTER',
    DECLINECOUNTER = 'DECLINECOUNTER'
}


/**
 * Usually you get an `ICalCalendar` object like this:
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * ```
 *
 * But you can also use the constructor directly like this:
 * ```javascript
 * import {ICalCalendar} from 'ical-generator';
 * const calendar = new ICalCalendar();
 * ```
 */
export default class ICalCalendar {
    private readonly data: ICalCalendarInternalData;

    /**
     * You can pass options to setup your calendar or use setters to do this.
     *
     * ```javascript
     *  * import ical from 'ical-generator';
     *
     * // or use require:
     * // const ical = require('ical-generator');
     *
     *
     * const cal = ical({name: 'my first iCal'});
     *
     * // is the same as
     *
     * const cal = ical().name('my first iCal');
     *
     * // is the same as
     *
     * const cal = ical();
     * cal.name('sebbo.net');
     * ```
     *
     * @param data Calendar data
     */
    constructor(data: ICalCalendarData = {}) {
        this.data = {
            prodId: '//sebbo.net//ical-generator//EN',
            method: null,
            name: null,
            description: null,
            timezone: null,
            source: null,
            url: null,
            scale: null,
            ttl: null,
            events: [],
            x: []
        };

        data.prodId !== undefined && this.prodId(data.prodId);
        data.method !== undefined && this.method(data.method);
        data.name !== undefined && this.name(data.name);
        data.description !== undefined && this.description(data.description);
        data.timezone !== undefined && this.timezone(data.timezone);
        data.source !== undefined && this.source(data.source);
        data.url !== undefined && this.url(data.url);
        data.scale !== undefined && this.scale(data.scale);
        data.ttl !== undefined && this.ttl(data.ttl);
        data.events !== undefined && this.events(data.events);
        data.x !== undefined && this.x(data.x);
    }


    /**
     * Get your feed's prodid. Will always return a string.
     * @since 0.2.0
     */
    prodId(): string;

    /**
     * Set your feed's prodid. `prodid` can be either a
     * string like `//sebbo.net//ical-generator//EN` or a
     * valid [[`ICalCalendarProdIdData`]] object. `language`
     * is optional and defaults to `EN`.
     *
     * ```javascript
     * cal.prodId({
     *     company: 'My Company',
     *     product: 'My Product',
     *     language: 'EN' // optional, defaults to EN
     * });
     * ```
     *
     * @since 0.2.0
     */
    prodId(prodId: ICalCalendarProdIdData | string): this;
    prodId(prodId?: ICalCalendarProdIdData | string): this | string {
        if (!prodId) {
            return this.data.prodId;
        }

        const prodIdRegEx = /^\/\/(.+)\/\/(.+)\/\/([A-Z]{1,4})$/;

        if (typeof prodId === 'string' && prodIdRegEx.test(prodId)) {
            this.data.prodId = prodId;
            return this;
        }
        if (typeof prodId === 'string') {
            throw new Error(
                '`prodId` isn\'t formated correctly. See https://sebbo2002.github.io/ical-generator/develop/reference/'+
                'classes/ICalCalendar.html#prodId'
            );
        }

        if (typeof prodId !== 'object') {
            throw new Error('`prodid` needs to be a valid formed string or an object!');
        }

        if (!prodId.company) {
            throw new Error('`prodid.company` is a mandatory item!');
        }
        if (!prodId.product) {
            throw new Error('`prodid.product` is a mandatory item!');
        }

        const language = (prodId.language || 'EN').toUpperCase();
        this.data.prodId = '//' + prodId.company + '//' + prodId.product + '//' + language;
        return this;
    }


    /**
     * Get the feed method attribute.
     * See [[`ICalCalendarMethod`]] for possible results.
     *
     * @since 0.2.8
     */
    method(): ICalCalendarMethod | null;

    /**
     * Set the feed method attribute.
     * See [[`ICalCalendarMethod`]] for available options.
     *
     * #### Typescript Example
     * ```typescript
     * import {ICalCalendarMethod} from 'ical-generator';
     * calendar.method(ICalCalendarMethod.PUBLISH);
     * ```
     *
     * @since 0.2.8
     */
    method(method: ICalCalendarMethod | null): this;
    method(method?: ICalCalendarMethod | null): this | ICalCalendarMethod | null {
        if (method === undefined) {
            return this.data.method;
        }
        if (!method) {
            this.data.method = null;
            return this;
        }

        this.data.method = checkEnum(ICalCalendarMethod, method) as ICalCalendarMethod;
        return this;
    }


    /**
     * Get your feed's name
     * @since 0.2.0
     */
    name(): string | null;

    /**
     * Set your feed's name. Is used to fill `NAME`
     * and `X-WR-CALNAME` in your iCal file.
     *
     * @since 0.2.0
     */
    name(name: string | null): this;
    name(name?: string | null): this | string | null {
        if (name === undefined) {
            return this.data.name;
        }

        this.data.name = name ? String(name) : null;
        return this;
    }


    /**
     * Get your feed's description
     * @since 0.2.7
     */
    description(): string | null;

    /**
     * Set your feed's description
     * @since 0.2.7
     */
    description(description: string | null): this;
    description(description?: string | null): this | string | null {
        if (description === undefined) {
            return this.data.description;
        }

        this.data.description = description ? String(description) : null;
        return this;
    }


    /**
     * Get the current calendar timezone
     * @since 0.2.0
     */
    timezone(): string | null;

    /**
     * Use this method to set your feed's timezone. Is used
     * to fill `TIMEZONE-ID` and `X-WR-TIMEZONE` in your iCal export.
     * Please not that all date values are treaded differently, if
     * a timezone was set. See [[`formatDate`]] for details. If no
     * time zone is specified, all information is output as UTC.
     *
     * ```javascript
     * cal.timezone('America/New_York');
     * ```
     *
     * @see https://github.com/sebbo2002/ical-generator#-date-time--timezones
     * @since 0.2.0
     */
    timezone(timezone: string | null): this;

    /**
     * Sets the time zone to be used in this calendar file for all times of all
     * events. Please note that if the time zone is set, ical-generator assumes
     * that all times are already in the correct time zone. Alternatively, a
     * `moment-timezone` or a Luxon object can be passed with `setZone`,
     * ical-generator will then set the time zone itself.
     *
     * For the best support of time zones, a VTimezone entry in the calendar is
     * recommended, which informs the client about the corresponding time zones
     * (daylight saving time, deviation from UTC, etc.). `ical-generator` itself
     * does not have a time zone database, so an external generator is needed here.
     *
     * A VTimezone generator is a function that takes a time zone as a string and
     * returns a VTimezone component according to the ical standard. For example,
     * ical-timezones can be used for this:
     *
     * ```typescript
     * import ical from 'ical-generator';
     * import {getVtimezoneComponent} from '@touch4it/ical-timezones';
     *
     * const cal = new ICalCalendar();
     * cal.timezone({
     *     name: 'FOO',
     *     generator: getVtimezoneComponent
     * });
     * cal.createEvent({
     *     start: new Date(),
     *     timezone: 'Europe/London'
     * });
     * ```
     *
     * @see https://github.com/sebbo2002/ical-generator#-date-time--timezones
     * @since 2.0.0
     */
    timezone(timezone: ICalTimezone | string | null): this;
    timezone(timezone?: ICalTimezone | string | null): this | string | null {
        if (timezone === undefined) {
            return this.data.timezone?.name || null;
        }

        if(timezone === 'UTC') {
            this.data.timezone = null;
        }
        else if(typeof timezone === 'string') {
            this.data.timezone = {name: timezone};
        }
        else if(timezone === null) {
            this.data.timezone = null;
        }
        else {
            this.data.timezone = timezone;
        }

        return this;
    }


    /**
     * Get current value of the `SOURCE` attribute.
     * @since 2.2.0-develop.1
     */
    source(): string | null;

    /**
     * Use this method to set your feed's `SOURCE` attribute.
     * This tells the client where to refresh your feed.
     *
     * ```javascript
     * cal.source('http://example.com/my/original_source.ical');
     * ```
     *
     * @since 2.2.0-develop.1
     */
    source(source: string | null): this;
    source(source?: string | null): this | string | null {
        if (source === undefined) {
            return this.data.source;
        }

        this.data.source = source || null;
        return this;
    }


    /**
     * Get your feed's URL
     * @since 0.2.5
     */
    url(): string | null;

    /**
     * Set your feed's URL
     *
     * ```javascript
     * calendar.url('http://example.com/my/feed.ical');
     * ```
     *
     * @since 0.2.5
     */
    url(url: string | null): this;
    url(url?: string | null): this | string | null {
        if (url === undefined) {
            return this.data.url;
        }

        this.data.url = url || null;
        return this;
    }


    /**
     * Get current value of the `CALSCALE` attribute. It will
     * return `null` if no value was set. The iCal standard
     * specifies this as `GREGORIAN` if no value is present.
     *
     * @since 1.8.0
     */
    scale(): string | null;

    /**
     * Use this method to set your feed's `CALSCALE` attribute. There is no
     * default value for this property and it will not appear in your iCal
     * file unless set. The iCal standard specifies this as `GREGORIAN` if
     * no value is present.
     *
     * ```javascript
     * cal.scale('gregorian');
     * ```
     *
     * @since 1.8.0
     */
    scale(scale: string | null): this;
    scale(scale?: string | null): this | string | null {
        if (scale === undefined) {
            return this.data.scale;
        }

        if (scale === null) {
            this.data.scale = null;
        }
        else {
            this.data.scale = scale.toUpperCase();
        }

        return this;
    }


    /**
     * Get the current ttl duration in seconds
     * @since 0.2.5
     */
    ttl(): number | null;

    /**
     * Use this method to set your feed's time to live
     * (in seconds). Is used to fill `REFRESH-INTERVAL` and
     * `X-PUBLISHED-TTL` in your iCal.
     *
     * ```javascript
     * const cal = ical().ttl(60 * 60 * 24); // 1 day
     * ```
     *
     * You can also pass a moment.js duration object. Zero, null
     * or negative numbers will reset the `ttl` attribute.
     *
     * @since 0.2.5
     */
    ttl(ttl: number | Duration | null): this;
    ttl(ttl?: number | Duration | null): this | number | null {
        if (ttl === undefined) {
            return this.data.ttl;
        }

        if (isMomentDuration(ttl)) {
            this.data.ttl = ttl.asSeconds();
        }
        else if (ttl && ttl > 0) {
            this.data.ttl = ttl;
        }
        else {
            this.data.ttl = null;
        }

        return this;
    }


    /**
     * Creates a new [[`ICalEvent`]] and returns it. Use options to prefill the event's attributes.
     * Calling this method without options will create an empty event.
     *
     * ```javascript
     * import ical from 'ical-generator';
     *
     * // or use require:
     * // const ical = require('ical-generator');
     *
     * const cal = ical();
     * const event = cal.createEvent({summary: 'My Event'});
     *
     * // overwrite event summary
     * event.summary('Your Event');
     * ```
     *
     * @since 0.2.0
     */
    createEvent(data: ICalEvent | ICalEventData): ICalEvent {
        const event = data instanceof ICalEvent ? data : new ICalEvent(data, this);
        this.data.events.push(event);
        return event;
    }


    /**
     * Returns all events of this calendar.
     *
     * ```javascript
     * const cal = ical();
     *
     * cal.events([
     *     {
     *        start: new Date(),
     *        end: new Date(new Date().getTime() + 3600000),
     *        summary: 'Example Event',
     *        description: 'It works ;)',
     *        url: 'http://sebbo.net/'
     *     }
     * ]);
     *
     * cal.events(); // --> [ICalEvent]
     * ```
     *
     * @since 0.2.0
     */
    events(): ICalEvent[];

    /**
     * Add multiple events to your calendar.
     *
     * ```javascript
     * const cal = ical();
     *
     * cal.events([
     *     {
     *        start: new Date(),
     *        end: new Date(new Date().getTime() + 3600000),
     *        summary: 'Example Event',
     *        description: 'It works ;)',
     *        url: 'http://sebbo.net/'
     *     }
     * ]);
     *
     * cal.events(); // --> [ICalEvent]
     * ```
     *
     * @since 0.2.0
     */
    events(events: (ICalEvent | ICalEventData)[]): this;
    events(events?: (ICalEvent | ICalEventData)[]): this | ICalEvent[] {
        if (!events) {
            return this.data.events;
        }

        events.forEach((e: ICalEvent | ICalEventData) => this.createEvent(e));
        return this;
    }


    /**
     * Remove all events from the calendar without
     * touching any other data like name or prodId.
     *
     * @since 2.0.0-develop.1
     */
    clear(): this {
        this.data.events = [];
        return this;
    }


    /**
     * Save ical file using [`fs/promises`](https://nodejs.org/api/fs.html#fs_fspromises_writefile_file_data_options).
     * Only works in node.js environments.
     *
     * ```javascript
     * await calendar.save('./calendar.ical');
     * ```
     */
    save(path: string): Promise<void>;

    /**
     * Save ical file with [`fs.writeFile`](http://nodejs.org/api/fs.html#fs_fs_writefile_filename_data_options_callback).
     * Only works in node.js environments.
     *
     * ```javascript
     * calendar.save('./calendar.ical', err => {
     *     console.log(err);
     * });
     * ```
     */
    save(path: string, cb?: (err: NodeJS.ErrnoException | null) => void): this;
    save(path: string, cb?: (err: NodeJS.ErrnoException | null) => void): this | Promise<void> {
        if (cb) {
            writeFile(path, this.toString(), cb);
            return this;
        }

        return fsPromises.writeFile(path, this.toString());
    }


    /**
     * Save Calendar to disk synchronously using
     * [fs.writeFileSync](http://nodejs.org/api/fs.html#fs_fs_writefilesync_filename_data_options).
     * Only works in node.js environments.
     *
     * ```javascript
     * calendar.saveSync('./calendar.ical');
     * ```
     */
    saveSync(path: string): this {
        writeFileSync(path, this.toString());
        return this;
    }


    /**
     * Send calendar to the user when using HTTP using the passed `ServerResponse` object.
     * Use second parameter `filename` to change the filename, which defaults to `'calendar.ics'`.
     *
     * @param response HTTP Response object which is used to send the calendar
     * @param [filename = 'calendar.ics'] Filename of the calendar file
     */
    serve(response: ServerResponse, filename = 'calendar.ics'): this {
        response.writeHead(200, {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}"`
        });

        response.end(this.toString());
        return this;
    }


    /**
     * Generates a blob to use for downloads or to generate a download URL.
     * Only supported in browsers supporting the Blob API.
     *
     * Unfortunately, because node.js has no Blob implementation (they have Buffer
     * instead), this method is currently untested. Sorry Dave…
     *
     * @since 1.9.0
     */
    toBlob(): Blob {
        return new Blob([this.toString()], {type: 'text/calendar'});
    }


    /**
     * Returns a URL to download the ical file. Uses the Blob object internally,
     * so it's only supported in browsers supporting the Blob API.
     *
     * Unfortunately, because node.js has no Blob implementation (they have Buffer
     * instead), this can't be tested right now. Sorry Dave…
     *
     * @since 1.9.0
     */
    toURL(): string {
        return URL.createObjectURL(this.toBlob());
    }


    /**
     * Set X-* attributes. Woun't filter double attributes,
     * which are also added by another method (e.g. busystatus),
     * so these attributes may be inserted twice.
     *
     * ```javascript
     * calendar.x([
     *     {
     *         key: "X-MY-CUSTOM-ATTR",
     *         value: "1337!"
     *     }
     * ]);
     *
     * calendar.x([
     *     ["X-MY-CUSTOM-ATTR", "1337!"]
     * ]);
     *
     * calendar.x({
     *     "X-MY-CUSTOM-ATTR": "1337!"
     * });
     * ```
     *
     * @since 1.9.0
     */
    x (keyOrArray: {key: string, value: string}[] | [string, string][] | Record<string, string>): this;

    /**
     * Set a X-* attribute. Woun't filter double attributes,
     * which are also added by another method (e.g. busystatus),
     * so these attributes may be inserted twice.
     *
     * ```javascript
     * calendar.x("X-MY-CUSTOM-ATTR", "1337!");
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
    x (keyOrArray?: {key: string, value: string}[] | [string, string][] | Record<string, string> | string, value?: string): this | void | ({key: string, value: string})[] {
        if(keyOrArray === undefined) {
            return addOrGetCustomAttributes (this.data);
        }

        if(typeof keyOrArray === 'string' && typeof value === 'string') {
            addOrGetCustomAttributes (this.data, keyOrArray, value);
        }
        else if(typeof keyOrArray === 'object') {
            addOrGetCustomAttributes (this.data, keyOrArray);
        }
        else {
            throw new Error('Either key or value is not a string!');
        }

        return this;
    }


    /**
     * Return a shallow copy of the calendar's options for JSON stringification.
     * Third party objects like moment.js values or RRule objects are stringified
     * as well. Can be used for persistence.
     *
     * ```javascript
     * const cal = ical();
     * const json = JSON.stringify(cal);
     *
     * // later: restore calendar data
     * cal = ical(JSON.parse(json));
     * ```
     *
     * @since 0.2.4
     */
    toJSON(): ICalCalendarJSONData {
        return Object.assign({}, this.data, {
            timezone: this.timezone(),
            events: this.data.events.map(event => event.toJSON()),
            x: this.x()
        });
    }


    /**
     * Get the number of events added to your calendar
     */
    length(): number {
        return this.data.events.length;
    }


    /**
     * Return generated calendar as a string.
     *
     * ```javascript
     * const cal = ical();
     * console.log(cal.toString()); // → BEGIN:VCALENDAR…
     * ```
     */
    toString(): string {
        let g = '';

        // VCALENDAR and VERSION
        g = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\n';

        // PRODID
        g += 'PRODID:-' + this.data.prodId + '\r\n';

        // URL
        if (this.data.url) {
            g += 'URL:' + this.data.url + '\r\n';
        }

        // SOURCE
        if (this.data.source) {
            g += 'SOURCE;VALUE=URI:' + this.data.source + '\r\n';
        }

        // CALSCALE
        if (this.data.scale) {
            g += 'CALSCALE:' + this.data.scale + '\r\n';
        }

        // METHOD
        if (this.data.method) {
            g += 'METHOD:' + this.data.method + '\r\n';
        }

        // NAME
        if (this.data.name) {
            g += 'NAME:' + this.data.name + '\r\n';
            g += 'X-WR-CALNAME:' + this.data.name + '\r\n';
        }

        // Description
        if (this.data.description) {
            g += 'X-WR-CALDESC:' + this.data.description + '\r\n';
        }

        // Timezone
        if(this.data.timezone?.generator) {
            const timezones = [...new Set([
                this.timezone(),
                ...this.data.events.map(event => event.timezone())
            ])].filter(tz => tz !== null && !tz.startsWith('/')) as string[];

            timezones.forEach(tz => {
                if(!this.data.timezone?.generator) {
                    return;
                }

                const s = this.data.timezone.generator(tz);
                if(!s) {
                    return;
                }

                g += s.replace(/\r\n/g, '\n')
                    .replace(/\n/g, '\r\n')
                    .trim() + '\r\n';
            });
        }
        if (this.data.timezone?.name) {
            g += 'TIMEZONE-ID:' + this.data.timezone.name + '\r\n';
            g += 'X-WR-TIMEZONE:' + this.data.timezone.name + '\r\n';
        }

        // TTL
        if (this.data.ttl) {
            g += 'REFRESH-INTERVAL;VALUE=DURATION:' + toDurationString(this.data.ttl) + '\r\n';
            g += 'X-PUBLISHED-TTL:' + toDurationString(this.data.ttl) + '\r\n';
        }

        // Events
        this.data.events.forEach(event => g += event.toString());

        // CUSTOM X ATTRIBUTES
        g += generateCustomAttributes(this.data);

        g += 'END:VCALENDAR';

        return foldLines(g);
    }
}
