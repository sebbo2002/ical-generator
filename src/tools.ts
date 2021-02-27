'use strict';

import moment from 'moment-timezone';
import {ICalDateTimeValue, ICalOrganizer} from './types';

export function formatDate (timezone: string | null, d: moment.Moment | Date | string, dateonly?: boolean, floating?: boolean): string {
    let m = timezone ? moment(d).tz(timezone) : moment(d).utc();
    if (!dateonly && !floating) {
        m = moment(d).utc();
    }

    let s = m.format('YYYYMMDD');
    if (!dateonly) {
        s += 'T';
        s += m.format('HHmmss');

        if (!floating) {
            s += 'Z';
        }
    }

    return s;
}

// For information about this format, see RFC 5545, section 3.3.5
// https://tools.ietf.org/html/rfc5545#section-3.3.5
export function formatDateTZ (timezone: string | null, property: string, date: moment.Moment | Date | string, eventData?: {floating?: boolean | null, timezone?: string | null}): string {
    let tzParam = '';
    let floating = eventData?.floating || false;

    if (eventData?.timezone) {
        tzParam = ';TZID=' + eventData.timezone;

        // This isn't a 'floating' event because it has a timezone;
        // but we use it to omit the 'Z' UTC specifier in formatDate()
        floating = true;
    }

    return property + tzParam + ':' + module.exports.formatDate(timezone, date, false, floating);
}

export function escape (str: string | unknown): string {
    return String(str).replace(/[\\;,"]/g, function (match) {
        return '\\' + match;
    }).replace(/(?:\r\n|\r|\n)/g, '\\n');
}

export function foldLines (input: string): string {
    return input.split('\r\n').map(function (line) {
        let result = '';
        let c = 0;
        for (let i = 0; i < line.length; i++) {
            let ch = line.charAt(i);

            // surrogate pair, see https://mathiasbynens.be/notes/javascript-encoding#surrogate-pairs
            if (ch >= '\ud800' && ch <= '\udbff') {
                ch += line.charAt(++i);
            }

            const charsize = Buffer.from(ch).length;
            c += charsize;
            if (c > 74) {
                result += '\r\n ';
                c = charsize;
            }

            result += ch;
        }
        return result;
    }).join('\r\n');
}

export function addOrGetCustomAttributes (data: {x: [string, string][]}, keyOrArray: ({key: string, value: string})[] | Record<string, string>): void;
export function addOrGetCustomAttributes (data: {x: [string, string][]}, keyOrArray: string, value: string): void;
export function addOrGetCustomAttributes (data: {x: [string, string][]}): ({key: string, value: string})[];
export function addOrGetCustomAttributes (data: {x: [string, string][]}, keyOrArray?: ({key: string, value: string})[] | Record<string, string> | string  | undefined, value?: string | undefined): void | ({key: string, value: string})[] {
    if (Array.isArray(keyOrArray)) {
        data.x = keyOrArray.map(o => {
            if (typeof o.key !== 'string' || typeof o.value !== 'string') {
                throw new Error('Either key or value is not a string!');
            }
            if (o.key.substr(0, 2) !== 'X-') {
                throw new Error('Key has to start with `X-`!');
            }

            return [o.key, o.value];
        });
    }
    else if (typeof keyOrArray === 'object') {
        data.x = Object.entries(keyOrArray).map(([key, value]) => {
            if (typeof key !== 'string' || typeof value !== 'string') {
                throw new Error('Either key or value is not a string!');
            }
            if (key.substr(0, 2) !== 'X-') {
                throw new Error('Key has to start with `X-`!');
            }

            return [key, value];
        });
    }
    else if (typeof keyOrArray === 'string' && typeof value === 'string') {
        if (keyOrArray.substr(0, 2) !== 'X-') {
            throw new Error('Key has to start with `X-`!');
        }

        data.x.push([keyOrArray, value]);
    }
    else {
        return data.x.map(a => ({
            key: a[0],
            value: a[1]
        }));
    }
}

export function generateCustomAttributes (data: {x: [string, string][]}): string {
    const str = data.x
        .map(([key, value]) => key.toUpperCase() + ':' + escape(value))
        .join('\r\n');
    return str.length ? str + '\r\n' : '';
}

/**
 * Check the given string or ICalOrganizer. Parses
 * the string for name and email address if possible.
 *
 * @param attribute Attribute name for error messages
 * @param value Value to parse name/email from
 */
export function checkNameAndMail (attribute: string, value: string | ICalOrganizer): ICalOrganizer {
    let result: ICalOrganizer | null = null;

    if (typeof value === 'string') {
        const match = value.match(/^(.+) ?<([^>]+)>$/);
        if (match) {
            result = {
                name: match[1].trim(),
                email: match[2].trim()
            };
        }
        else if(value.includes('@')) {
            result = {
                name: value.trim(),
                email: value.trim()
            };
        }
    }
    else if (typeof value === 'object') {
        result = {
            name: value.name,
            email: value.email,
            mailto: value.mailto
        };
    }

    if (!result && typeof value === 'string') {
        throw new Error(
            '`' + attribute + '` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#organizer' +
            'stringobject-organizer'
        );
    }
    else if (!result) {
        throw new Error(
            '`' + attribute + '` needs to be a valid formed string or an object. See https://github.com/sebbo2002/ical-' +
            'generator#organizerstringobject-organizer'
        );
    }

    if (!result.name) {
        throw new Error('`organizer.name` is empty!');
    }
    if (!result.email) {
        throw new Error('`organizer.email` is empty!');
    }

    return result;
}

/**
 * Checks if the given string `value` is a
 * valid one for the type `type`
 */
export function checkEnum(type: Record<string, string>, value: unknown): unknown {
    const allowedValues = Object.values(type);
    const valueStr = String(value).toUpperCase();

    if (!valueStr || !allowedValues.includes(valueStr)) {
        throw new Error(`Input must be one of the following: ${allowedValues.join(', ')}`);
    }

    return valueStr;
}

/**
 * Checks if the given input is a valid date and
 * returns the internal representation (= moment object)
 */
export function checkDate(value: ICalDateTimeValue, attribute: string): moment.Moment {
    if (typeof value === 'string' || value instanceof Date) {
        value = moment(value).utc();
    }
    else if (!moment.isMoment(value)) {
        throw new Error(`\`${attribute}\` must be a Date or a moment object!`);
    }

    if (!value.isValid()) {
        throw new Error(`\`${attribute}\` has to be a valid date!`);
    }

    return value;
}

export function applyInternalData<O, D>(object: O, data: D): void {
    for (const i in data) {
        if (Object.keys(data).includes(i)) {
            // @ts-ignore
            const m = object[i];

            if(typeof m === 'function') {

                // @ts-ignore
                m.call(object, data[i]);
            }
        }
    }
}
