'use strict';

import ICalEvent from './event.js';
import {
    addOrGetCustomAttributes,
    formatDate,
    escape,
    generateCustomAttributes,
    checkDate,
    toDurationString,
    toJSON
} from './tools.js';
import {ICalDateTimeValue} from './types.js';


export enum ICalAlarmType {
    display = 'display',
    audio = 'audio'
}

export const ICalAlarmRelatesTo = {
    end: 'END',
    start: 'START'
} as const;

export type ICalAlarmRelatesTo = typeof ICalAlarmRelatesTo[keyof typeof ICalAlarmRelatesTo];

export type ICalAlarmTypeValue = keyof ICalAlarmType;

export interface ICalAttachment {
    uri: string;
    mime: string | null;
}

export interface ICalAlarmData {
    type?: ICalAlarmType | null;
    trigger?: number | ICalDateTimeValue | null;
    relatesTo?: ICalAlarmRelatesTo | null;
    triggerBefore?: number | ICalDateTimeValue | null;
    triggerAfter?: number | ICalDateTimeValue | null;
    repeat?: number | null;
    interval?: number | null;
    attach?: string | ICalAttachment | null;
    description?: string | null;
    x?: {key: string, value: string}[] | [string, string][] | Record<string, string>;
}

interface ICalInternalAlarmData {
    type: ICalAlarmType | null;
    trigger: ICalDateTimeValue | number | null;
    relatesTo: ICalAlarmRelatesTo | null;
    repeat: number | null;
    interval: number | null;
    attach: ICalAttachment | null;
    description: string | null;
    x: [string, string][];
}

export interface ICalAlarmJSONData {
    type: ICalAlarmType | null;
    trigger: string | number | null;
    relatesTo: ICalAlarmRelatesTo | null;
    repeat: number | null;
    interval: number | null;
    attach: ICalAttachment | null;
    description: string | null;
    x: {key: string, value: string}[];
}


/**
 * Usually you get an `ICalAlarm` object like this:
 *
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * const event = calendar.createEvent();
 * const alarm = event.createAlarm();
 * ```
 *
 * You can also use the [[`ICalAlarm`]] object directly:
 *
 * ```javascript
 * import ical, {ICalAlarm} from 'ical-generator';
 * const alarm = new ICalAlarm();
 * event.alarms([alarm]);
 * ```
 */
export default class ICalAlarm {
    private readonly data: ICalInternalAlarmData;
    private readonly event: ICalEvent;

    /**
     * Constructor of [[`ICalAttendee`]]. The event reference is required
     * to query the calendar's timezone and summary when required.
     *
     * @param data Alarm Data
     * @param calendar Reference to ICalEvent object
     */
    constructor (data: ICalAlarmData, event: ICalEvent) {
        this.data = {
            type: null,
            trigger: null,
            relatesTo: null,
            repeat: null,
            interval: null,
            attach: null,
            description: null,
            x: []
        };

        this.event = event;
        if (!event) {
            throw new Error('`event` option required!');
        }

        data.type !== undefined && this.type(data.type);
        data.trigger !== undefined && this.trigger(data.trigger);
        data.triggerBefore !== undefined && this.triggerBefore(data.triggerBefore);
        data.triggerAfter !== undefined && this.triggerAfter(data.triggerAfter);
        data.repeat !== undefined && this.repeat(data.repeat);
        data.interval !== undefined && this.interval(data.interval);
        data.attach !== undefined && this.attach(data.attach);
        data.description !== undefined && this.description(data.description);
        data.x !== undefined && this.x(data.x);
    }


    /**
     * Get the alarm type
     * @since 0.2.1
     */
    type (type: ICalAlarmType | null): this;

    /**
     * Set the alarm type. See [[`ICalAlarmType`]]
     * for available status options.
     * @since 0.2.1
     */
    type (): ICalAlarmType | null;
    type (type?: ICalAlarmType | null): this | ICalAlarmType | null {
        if (type === undefined) {
            return this.data.type;
        }
        if (!type) {
            this.data.type = null;
            return this;
        }

        if (!Object.keys(ICalAlarmType).includes(type)) {
            throw new Error('`type` is not correct, must be either `display` or `audio`!');
        }

        this.data.type = type;
        return this;
    }


    /**
     * Get the trigger time for the alarm. Can either
     * be a date and time value ([[`ICalDateTimeValue`]]) or
     * a number, which will represent the seconds between
     * alarm and event start. The number is negative, if the
     * alarm is triggered after the event started.
     *
     * @since 0.2.1
     */
    trigger (): number | ICalDateTimeValue | null;

    /**
     * Use this method to set the alarm time.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const alarm = cal.createAlarm();
     *
     * alarm.trigger(600); // -> 10 minutes before event starts
     * alarm.trigger(new Date()); // -> now
     * ```
     *
     * You can use any supported date object, see
     * [readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * @since 0.2.1
     */
    trigger (trigger: number | ICalDateTimeValue | Date | null): this;
    trigger (trigger?: number | ICalDateTimeValue | Date | null): this | number | ICalDateTimeValue | null {

        // Getter
        if (trigger === undefined && typeof this.data.trigger === 'number') {
            return -1 * this.data.trigger;
        }
        if (trigger === undefined && this.data.trigger) {
            return this.data.trigger;
        }
        if (trigger === undefined) {
            return null;
        }

        // Setter
        if (!trigger) {
            this.data.trigger = null;
        }
        else if (typeof trigger === 'number' && isFinite(trigger)) {
            this.data.trigger = -1 * trigger;
        }
        else if(typeof trigger === 'number') {
            throw new Error('`trigger` is not correct, must be a finite number or a supported date!');
        }
        else {
            this.data.trigger = checkDate(trigger, 'trigger');
        }

        return this;
    }

    /**
     * Get to which time alarm trigger relates to.
     * Can be either `START` or `END`. If the value is
     * `START` the alarm is triggerd relative to the event start time.
     * If the value is `END` the alarm is triggerd relative to the event end time
     * 
     * @since 4.0.1
     */
    relatesTo(): ICalAlarmRelatesTo | null;

    /**
     * Use this method to set to which time alarm trigger relates to.
     * Works only if trigger is a `number`
     * 
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const alarm = cal.createAlarm();
     *
     * alarm.trigger(600); // -> 10 minutes before event starts
     * 
     * alarm.relatesTo('START'); // -> 10 minutes before event starts
     * alarm.relatesTo('END'); // -> 10 minutes before event ends
     * 
     * alarm.trigger(-600); // -> 10 minutes after event starts
     * 
     * alarm.relatesTo('START'); // -> 10 minutes after event starts
     * alarm.relatesTo('END'); // -> 10 minutes after event ends
     * ```
     * @since 4.0.1
     */
    relatesTo(relatesTo: ICalAlarmRelatesTo | null): this;
    relatesTo(relatesTo?: ICalAlarmRelatesTo | null): this | ICalAlarmRelatesTo | null {
        if (relatesTo === undefined) {
            return this.data.relatesTo;
        }
        if (!relatesTo) {
            this.data.relatesTo = null;
            return this;
        }

        if (!Object.values(ICalAlarmRelatesTo).includes(relatesTo)) {
            throw new Error('`relatesTo` is not correct, must be either `START` or `END`!');
        }

        this.data.relatesTo = relatesTo;
        return this;
    }


    /**
     * Get the trigger time for the alarm. Can either
     * be a date and time value ([[`ICalDateTimeValue`]]) or
     * a number, which will represent the seconds between
     * alarm and event start. The number is negative, if the
     * alarm is triggered before the event started.
     *
     * @since 0.2.1
     */
    triggerAfter (): number | ICalDateTimeValue | null;

    /**
     * Use this method to set the alarm time. Unlike `trigger`, this time
     * the alarm takes place after the event has started.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const alarm = cal.createAlarm();
     *
     * alarm.trigger(600); // -> 10 minutes after event starts
     * ```
     *
     * You can use any supported date object, see
     * [readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * @since 0.2.1
     */
    triggerAfter (trigger: number | ICalDateTimeValue | null): this;
    triggerAfter (trigger?: number | ICalDateTimeValue | null): this | number | ICalDateTimeValue | null {
        if (trigger === undefined) {
            return this.data.trigger;
        }

        return this.trigger(typeof trigger === 'number' ? -1 * trigger : trigger);
    }


    /**
     * Get the trigger time for the alarm. Can either
     * be a date and time value ([[`ICalDateTimeValue`]]) or
     * a number, which will represent the seconds between
     * alarm and event start. The number is negative, if the
     * alarm is triggered after the event started.
     *
     * @since 0.2.1
     * @alias trigger
     */
    triggerBefore (trigger: number | ICalDateTimeValue | null): this;

    /**
     * Use this method to set the alarm time.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const alarm = cal.createAlarm();
     *
     * alarm.trigger(600); // -> 10 minutes before event starts
     * alarm.trigger(new Date()); // -> now
     * ```
     *
     * You can use any supported date object, see
     * [readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * @since 0.2.1
     * @alias trigger
     */
    triggerBefore (): number | ICalDateTimeValue | null;
    triggerBefore (trigger?: number | ICalDateTimeValue | null): this | number | ICalDateTimeValue | null {
        if(trigger === undefined) {
            return this.trigger();
        }

        return this.trigger(trigger);
    }


    /**
     * Get Alarm Repetitions
     * @since 0.2.1
     */
    repeat(): number | null;

    /**
     * Set Alarm Repetitions. Use this to repeat the alarm.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     *
     * // repeat the alarm 4 times every 5 minutes…
     * cal.createAlarm({
     *     repeat: 4,
     *     interval: 300
     * });
     * ```
     *
     * @since 0.2.1
     */
    repeat(repeat: number | null): this;
    repeat (repeat?: number | null): this | number | null {
        if (repeat === undefined) {
            return this.data.repeat;
        }
        if (!repeat) {
            this.data.repeat = null;
            return this;
        }

        if (typeof repeat !== 'number' || !isFinite(repeat)) {
            throw new Error('`repeat` is not correct, must be numeric!');
        }

        this.data.repeat = repeat;
        return this;
    }


    /**
     * Get Repeat Interval
     * @since 0.2.1
     */
    interval (interval: number | null): this;

    /**
     * Set Repeat Interval
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     *
     * // repeat the alarm 4 times every 5 minutes…
     * cal.createAlarm({
     *     repeat: 4,
     *     interval: 300
     * });
     * ```
     *
     * @since 0.2.1
     */
    interval(): number | null;
    interval (interval?: number | null): this | number | null {
        if (interval === undefined) {
            return this.data.interval || null;
        }
        if (!interval) {
            this.data.interval = null;
            return this;
        }

        if (typeof interval !== 'number' || !isFinite(interval)) {
            throw new Error('`interval` is not correct, must be numeric!');
        }

        this.data.interval = interval;
        return this;
    }


    /**
     * Get Attachment
     * @since 0.2.1
     */
    attach (): {uri: string, mime: string | null} | null;

    /**
     * Set Alarm attachment. Used to set the alarm sound
     * if alarm type is audio. Defaults to "Basso".
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     *
     * event.createAlarm({
     *     attach: 'https://example.com/notification.aud'
     * });
     *
     * // OR
     *
     * event.createAlarm({
     *     attach: {
     *         uri: 'https://example.com/notification.aud',
     *         mime: 'audio/basic'
     *     }
     * });
     * ```
     *
     * @since 0.2.1
     */
    attach (attachment: {uri: string, mime?: string | null} | string | null): this;
    attach (attachment?: {uri: string, mime?: string | null} | string | null): this | {uri: string, mime: string | null} | null {
        if (attachment === undefined) {
            return this.data.attach;
        }
        if (!attachment) {
            this.data.attach = null;
            return this;
        }

        let _attach = null;
        if (typeof attachment === 'string') {
            _attach = {
                uri: attachment,
                mime: null
            };
        }
        else if (typeof attachment === 'object') {
            _attach = {
                uri: attachment.uri,
                mime: attachment.mime || null
            };
        }
        else {
            throw new Error(
                '`attachment` needs to be a valid formed string or an object. See https://sebbo2002.github.io/' +
                'ical-generator/develop/reference/classes/ICalAlarm.html#attach'
            );
        }

        if (!_attach.uri) {
            throw new Error('`attach.uri` is empty!');
        }

        this.data.attach = {
            uri: _attach.uri,
            mime: _attach.mime
        };
        return this;
    }


    /**
     * Get the alarm description. Used to set the alarm message
     * if alarm type is display. Defaults to the event's summary.
     *
     * @since 0.2.1
     */
    description (): string | null;

    /**
     * Set the alarm description. Used to set the alarm message
     * if alarm type is display. Defaults to the event's summary.
     *
     * @since 0.2.1
     */
    description (description: string | null): this;
    description (description?: string | null): this | string | null {
        if (description === undefined) {
            return this.data.description;
        }
        if (!description) {
            this.data.description = null;
            return this;
        }

        this.data.description = description;
        return this;
    }


    /**
     * Set X-* attributes. Woun't filter double attributes,
     * which are also added by another method (e.g. type),
     * so these attributes may be inserted twice.
     *
     * ```javascript
     * alarm.x([
     *     {
     *         key: "X-MY-CUSTOM-ATTR",
     *         value: "1337!"
     *     }
     * ]);
     *
     * alarm.x([
     *     ["X-MY-CUSTOM-ATTR", "1337!"]
     * ]);
     *
     * alarm.x({
     *     "X-MY-CUSTOM-ATTR": "1337!"
     * });
     * ```
     *
     * @since 1.9.0
     */
    x (keyOrArray: {key: string, value: string}[] | [string, string][] | Record<string, string>): this;

    /**
     * Set a X-* attribute. Woun't filter double attributes,
     * which are also added by another method (e.g. type),
     * so these attributes may be inserted twice.
     *
     * ```javascript
     * alarm.x("X-MY-CUSTOM-ATTR", "1337!");
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
     * Return a shallow copy of the alarm's options for JSON stringification.
     * Third party objects like moment.js values are stringified as well. Can
     * be used for persistence.
     *
     * @since 0.2.4
     */
    toJSON (): ICalAlarmJSONData {
        const trigger = this.trigger();
        return Object.assign({}, this.data, {
            trigger: typeof trigger === 'number' ? trigger : toJSON(trigger),
            x: this.x()
        });
    }


    /**
     * Return generated event as a string.
     *
     * ```javascript
     * const alarm = event.createAlarm();
     * console.log(alarm.toString()); // → BEGIN:VALARM…
     * ```
     */
    toString (): string {
        let g = 'BEGIN:VALARM\r\n';

        if (!this.data.type) {
            throw new Error('No value for `type` in ICalAlarm given!');
        }
        if (!this.data.trigger) {
            throw new Error('No value for `trigger` in ICalAlarm given!');
        }

        // ACTION
        g += 'ACTION:' + this.data.type.toUpperCase() + '\r\n';

        if (typeof this.data.trigger === 'number' && this.data.relatesTo === null) {
            if (this.data.trigger > 0) {
                g += 'TRIGGER;RELATED=END:' + toDurationString(this.data.trigger) + '\r\n';
            }
            else {
                g += 'TRIGGER:' + toDurationString(this.data.trigger) + '\r\n';
            }
        } 
        else if (typeof this.data.trigger === 'number') {
            g += 'TRIGGER;RELATED=' + this.data.relatesTo.toUpperCase() + ':' + toDurationString(this.data.trigger) + '\r\n';
        }
        else {
            g += 'TRIGGER;VALUE=DATE-TIME:' + formatDate(this.event.timezone(), this.data.trigger) + '\r\n';
        }

        // REPEAT
        if (this.data.repeat && !this.data.interval) {
            throw new Error('No value for `interval` in ICalAlarm given, but required for `repeat`!');
        }
        if (this.data.repeat) {
            g += 'REPEAT:' + this.data.repeat + '\r\n';
        }

        // INTERVAL
        if (this.data.interval && !this.data.repeat) {
            throw new Error('No value for `repeat` in ICalAlarm given, but required for `interval`!');
        }
        if (this.data.interval) {
            g += 'DURATION:' + toDurationString(this.data.interval) + '\r\n';
        }

        // ATTACH
        if (this.data.type === 'audio' && this.data.attach && this.data.attach.mime) {
            g += 'ATTACH;FMTTYPE=' + escape(this.data.attach.mime, false) + ':' + escape(this.data.attach.uri, false) + '\r\n';
        }
        else if (this.data.type === 'audio' && this.data.attach) {
            g += 'ATTACH;VALUE=URI:' + escape(this.data.attach.uri, false) + '\r\n';
        }
        else if (this.data.type === 'audio') {
            g += 'ATTACH;VALUE=URI:Basso\r\n';
        }

        // DESCRIPTION
        if (this.data.type === 'display' && this.data.description) {
            g += 'DESCRIPTION:' + escape(this.data.description, false) + '\r\n';
        }
        else if (this.data.type === 'display') {
            g += 'DESCRIPTION:' + escape(this.event.summary(), false) + '\r\n';
        }

        // CUSTOM X ATTRIBUTES
        g += generateCustomAttributes(this.data);

        g += 'END:VALARM\r\n';
        return g;
    }
}
