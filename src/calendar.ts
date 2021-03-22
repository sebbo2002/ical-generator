'use strict';

import moment from 'moment-timezone';
import {addOrGetCustomAttributes, checkEnum, foldLines, generateCustomAttributes} from './tools';
import ICalEvent, {ICalEventData} from './event';
import {writeFile, writeFileSync} from 'fs';
import {promises as fsPromises} from 'fs';
import {ServerResponse} from 'http';


export interface ICalCalendarData {
    prodId?: ICalCalendarProdIdData | string;
    method?: ICalCalendarMethod | null;
    name?: string | null;
    description?: string | null;
    timezone?: string | null;
    url?: string | null;
    scale?: string | null;
    ttl?: number | moment.Duration | string | null;
    events?: (ICalEvent | ICalEventData)[];
    x?: [string, string][];
}

interface ICalCalendarInternalData {
    prodId: string;
    method: ICalCalendarMethod | null;
    name: string | null;
    description: string | null;
    timezone: string | null;
    url: string | null;
    scale: string | null;
    ttl: moment.Duration | null;
    events: ICalEvent[];
    x: [string, string][];
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


export default class ICalCalendar {
    private readonly data: ICalCalendarInternalData;

    constructor(data: ICalCalendarData = {}) {
        this.data = {
            prodId: '//sebbo.net//ical-generator//EN',
            method: null,
            name: null,
            description: null,
            timezone: null,
            url: null,
            scale: null,
            ttl: null,
            events: [],
            x: []
        };

        data.prodId && this.prodId(data.prodId);
        data.method && this.method(data.method);
        data.name && this.name(data.name);
        data.description && this.description(data.description);
        data.timezone && this.timezone(data.timezone);
        data.url && this.url(data.url);
        data.scale && this.scale(data.scale);
        data.ttl && this.ttl(data.ttl);
        data.events && this.events(data.events);
        data.x && this.x(data.x);
    }


    /**
     * Set/Get your feed's prodid. `prodid` can be either a
     * string like "//sebbo.net//ical-generator//EN" or an
     * object like
     * {
     *   "company": "sebbo.net",
     *   "product": "ical-generator"
     *   "language": "EN"
     * }
     *
     * `language` is optional and defaults to `EN`.
     *
     * @since 0.2.0
     */
    prodId(): string | null;
    prodId(prodId: ICalCalendarProdIdData | string): this;
    prodId(prodId?: ICalCalendarProdIdData | string): this | string | null {
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
                '`prodid` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#' +
                'prodidstringobject-prodid'
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
     * Set/Get your feed's method
     * @since 0.2.8
     */
    method(): ICalCalendarMethod | null;
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
     * Set/Get your feed's name…
     * @since 0.2.0
     */
    name(): string | null;
    name(name: string | null): this;
    name(name?: string | null): this | string | null {
        if (name === undefined) {
            return this.data.name;
        }

        this.data.name = name ? String(name) : null;
        return this;
    }


    /**
     * Set/Get your feed's description…
     * @since 0.2.7
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
     * Set/Get your feed's timezone.
     * Used to set `X-WR-TIMEZONE`.
     *
     * @example cal.timezone('America/New_York');
     * @since 0.2.0
     */
    timezone(): string | null;
    timezone(timezone: string | null): this;
    timezone(timezone?: string | null): this | string | null {
        if (timezone === undefined) {
            return this.data.timezone;
        }

        this.data.timezone = timezone ? String(timezone) : null;
        return this;
    }


    /**
     * Set/Get your feed's URL
     *
     * @example cal.url('http://example.com/my/feed.ical');
     * @since 0.2.5
     */
    url(): string | null;
    url(url: string | null): this;
    url(url?: string | null): this | string | null {
        if (url === undefined) {
            return this.data.url;
        }

        this.data.url = url || null;
        return this;
    }


    /**
     * Set/Get your feed's CALSCALE
     *
     * @example cal.scale('gregorian');
     * @since 1.8.0
     * @returns {ICalCalendar|String}
     */
    scale(): string | null;
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
     * Set/Get your feed's TTL.
     * Used to set `X-PUBLISHED-TTL` and `REFRESH-INTERVAL`.
     *
     * @example cal.ttl(60 * 60 * 24); // 1 day
     * @since 0.2.5
     */
    ttl(): moment.Duration | null;
    ttl(ttl: number | moment.Duration | string | null): this;
    ttl(ttl?: number | moment.Duration | string | null): this | moment.Duration | null {
        if (ttl === undefined) {
            return this.data.ttl;
        }

        if (moment.isDuration(ttl)) {
            this.data.ttl = ttl;
        }
        else if (typeof ttl === 'string') {
            this.data.ttl = moment.duration(ttl);
        }
        else if (ttl && ttl > 0) {
            this.data.ttl = moment.duration(ttl, 'seconds');
        }
        else {
            this.data.ttl = null;
        }

        return this;
    }


    /**
     * Create a new Event and return the event object…
     * @since 0.2.0
     */
    createEvent(data: ICalEvent | ICalEventData): ICalEvent {
        const event = data instanceof ICalEvent ? data : new ICalEvent(data, this);
        this.data.events.push(event);
        return event;
    }


    /**
     * Get all events or add multiple events. Events
     * that have already been added are retained.
     *
     * @since 0.2.0
     */
    events(): ICalEvent[];
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
     * Save ical file with `fs.save`. Only works in node.js environments.
     * If no callback is specified, `fs/promises` is used and a promise is returned.
     */
    save(path: string): Promise<void>;
    save(path: string, cb?: (err: NodeJS.ErrnoException | null) => void): this;
    save(path: string, cb?: (err: NodeJS.ErrnoException | null) => void): this | Promise<void> {
        if (cb) {
            writeFile(path, this.toString(), cb);
            return this;
        }

        return fsPromises.writeFile(path, this.toString());
    }


    /**
     * Save ical file with `fs.saveSync`. Only works in node.js environments.
     */
    saveSync(path: string): this {
        writeFileSync(path, this.toString());
        return this;
    }


    /**
     * Serve ical file
     *
     * @param {http.ServerResponse} response Response
     * @param {String} [filename = 'calendar.ics'] Filename
     * @returns {Number} Number of Bytes written
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
     * Returns a Blob which you can use to download or to create an url
     * so it's only working on modern browsers supporting the Blob API.
     *
     * Unfortunately, because node.js has no Blob implementation (they have Buffer
     * instead), this can't be tested right now. Sorry Dave…
     *
     * @since 1.9.0
     */
    toBlob(): Blob {
        return new Blob([this.toString()], {type: 'text/calendar'});
    }


    /**
     * Returns a URL to download the ical file. Uses the Blob object internally,
     * so it's only working on modern browsers supporting this API.
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
     * Get/Set X-* attributes. Woun't filter double attributes,
     * which are also added by another method (e.g. busystatus),
     * so these attributes may be inserted twice.
     *
     * @since 1.9.0
     */
    x (keyOrArray: ({key: string, value: string})[] | [string, string][] | Record<string, string>): this;
    x (keyOrArray: string, value: string): this;
    x (): {key: string, value: string}[];
    x (keyOrArray?: ({key: string, value: string})[] | [string, string][] | Record<string, string> | string, value?: string): this | void | ({key: string, value: string})[] {
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
     * Export calender as JSON Object to use it later…
     * @since 0.2.4
     */
    toJSON(): ICalCalendarInternalData {
        return Object.assign({}, this.data, {
            events: this.data.events.map(event => event.toJSON()),
            ttl: this.data.ttl ? this.data.ttl.toString() : null,
            x: this.x()
        });
    }


    /**
     * Get number of events in calendar…
     */
    length(): number {
        return this.data.events.length;
    }


    /**
     * Return ical as string…
     *
     * @returns {string}
     * @private
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
        if (this.data.timezone) {
            g += 'TIMEZONE-ID:' + this.data.timezone + '\r\n';
            g += 'X-WR-TIMEZONE:' + this.data.timezone + '\r\n';
        }

        // TTL
        if (this.data.ttl) {
            g += 'REFRESH-INTERVAL;VALUE=DURATION:' + this.data.ttl.toISOString() + '\r\n';
            g += 'X-PUBLISHED-TTL:' + this.data.ttl.toISOString() + '\r\n';
        }

        // Events
        this.data.events.forEach(event => g += event.toString());

        // CUSTOM X ATTRIBUTES
        g += generateCustomAttributes(this.data);

        g += 'END:VCALENDAR';

        return foldLines(g);
    }
}
