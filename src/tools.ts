'use strict';

import {
    type ICalDateTimeValue,
    type ICalDayJsStub,
    type ICalLuxonDateTimeStub,
    type ICalMomentDurationStub,
    type ICalMomentStub,
    type ICalMomentTimezoneStub,
    type ICalOrganizer,
    type ICalRRuleStub,
    type ICalTZDateStub,
} from './types.ts';

export function addOrGetCustomAttributes(
    data: { x: [string, string][] },
    keyOrArray:
        | [string, string][]
        | Record<string, string>
        | { key: string; value: string }[],
): void;

export function addOrGetCustomAttributes(
    data: { x: [string, string][] },
    keyOrArray: string,
    value: string,
): void;

export function addOrGetCustomAttributes(data: {
    x: [string, string][];
}): { key: string; value: string }[];

export function addOrGetCustomAttributes(
    data: { x: [string, string][] },
    keyOrArray?:
        | [string, string][]
        | Record<string, string>
        | string
        | undefined
        | { key: string; value: string }[],
    value?: string | undefined,
): void | { key: string; value: string }[] {
    if (Array.isArray(keyOrArray)) {
        data.x = keyOrArray.map(
            (o: [string, string] | { key: string; value: string }) => {
                if (Array.isArray(o)) {
                    return o;
                }
                if (typeof o.key !== 'string' || typeof o.value !== 'string') {
                    throw new Error('Either key or value is not a string!');
                }
                if (o.key.substr(0, 2) !== 'X-') {
                    throw new Error('Key has to start with `X-`!');
                }

                return [o.key, o.value] as [string, string];
            },
        );
    } else if (typeof keyOrArray === 'object') {
        data.x = Object.entries(keyOrArray).map(([key, value]) => {
            if (typeof key !== 'string' || typeof value !== 'string') {
                throw new Error('Either key or value is not a string!');
            }
            if (key.substr(0, 2) !== 'X-') {
                throw new Error('Key has to start with `X-`!');
            }

            return [key, value];
        });
    } else if (typeof keyOrArray === 'string' && typeof value === 'string') {
        if (keyOrArray.substr(0, 2) !== 'X-') {
            throw new Error('Key has to start with `X-`!');
        }

        data.x.push([keyOrArray, value]);
    } else {
        return data.x.map((a) => ({
            key: a[0],
            value: a[1],
        }));
    }
}

/**
 * Checks if the given input is a valid date and
 * returns the internal representation (= moment object)
 */
export function checkDate(
    value: ICalDateTimeValue,
    attribute: string,
): ICalDateTimeValue {
    // Date & String
    if (
        (value instanceof Date && isNaN(value.getTime())) ||
        (typeof value === 'string' && isNaN(new Date(value).getTime()))
    ) {
        throw new Error(`\`${attribute}\` has to be a valid date!`);
    }
    if (value instanceof Date || typeof value === 'string') {
        return value;
    }

    // Luxon
    if (isLuxonDate(value) && value.isValid === true) {
        return value;
    }

    // Moment / Moment Timezone
    if ((isMoment(value) || isDayjs(value)) && value.isValid()) {
        return value;
    }

    throw new Error(`\`${attribute}\` has to be a valid date!`);
}
/**
 * Checks if the given string `value` is a
 * valid one for the type `type`
 */
export function checkEnum(
    type: Record<string, string>,
    value: unknown,
): unknown {
    const allowedValues = Object.values(type);
    const valueStr = String(value).toUpperCase();

    if (!valueStr || !allowedValues.includes(valueStr)) {
        throw new Error(
            `Input must be one of the following: ${allowedValues.join(', ')}`,
        );
    }

    return valueStr;
}
/**
 * Check the given string or ICalOrganizer. Parses
 * the string for name and email address if possible.
 *
 * @param attribute Attribute name for error messages
 * @param value Value to parse name/email from
 */
export function checkNameAndMail(
    attribute: string,
    value: ICalOrganizer | string,
): ICalOrganizer {
    let result: ICalOrganizer | null = null;

    if (typeof value === 'string') {
        const match = value.match(/^(.+) ?<([^>]+)>$/);
        if (match) {
            result = {
                email: match[2].trim(),
                name: match[1].trim(),
            };
        } else if (value.includes('@')) {
            result = {
                email: value.trim(),
                name: value.trim(),
            };
        }
    } else if (typeof value === 'object') {
        result = {
            email: value.email,
            mailto: value.mailto,
            name: value.name,
            sentBy: value.sentBy,
        };
    }

    if (!result && typeof value === 'string') {
        throw new Error(
            '`' +
                attribute +
                "` isn't formated correctly. See https://sebbo2002.github.io/ical-generator/develop/" +
                'reference/interfaces/ICalOrganizer.html',
        );
    } else if (!result) {
        throw new Error(
            '`' +
                attribute +
                '` needs to be a valid formed string or an object. See https://sebbo2002.github.io/' +
                'ical-generator/develop/reference/interfaces/ICalOrganizer.html',
        );
    }

    if (!result.name) {
        throw new Error('`' + attribute + '.name` is empty!');
    }

    return result;
}
/**
 * Escapes special characters in the given string
 */
export function escape(str: string | unknown, inQuotes: boolean): string {
    return String(str)
        .replace(inQuotes ? /[\\"]/g : /[\\;,]/g, function (match) {
            return '\\' + match;
        })
        .replace(/(?:\r\n|\r|\n)/g, '\\n');
}

/**
 * Trim line length of given string
 */
export function foldLines(input: string): string {
    return input
        .split('\r\n')
        .map(function (line) {
            let result = '';
            let c = 0;
            for (let i = 0; i < line.length; i++) {
                let ch = line.charAt(i);

                // surrogate pair, see https://mathiasbynens.be/notes/javascript-encoding#surrogate-pairs
                if (ch >= '\ud800' && ch <= '\udbff') {
                    ch += line.charAt(++i);
                }

                // TextEncoder is available in browsers and node.js >= 11.0.0
                const charsize = new TextEncoder().encode(ch).length;
                c += charsize;
                if (c > 74) {
                    result += '\r\n ';
                    c = charsize;
                }

                result += ch;
            }
            return result;
        })
        .join('\r\n');
}

/**
 * Converts a valid date/time object supported by this library to a string.
 */
export function formatDate(
    timezone: null | string,
    d: ICalDateTimeValue,
    dateonly?: boolean,
    floating?: boolean,
): string {
    if (timezone?.startsWith('/')) {
        timezone = timezone.substr(1);
    }

    if (typeof d === 'string' || d instanceof Date) {
        // TZDate is an extension of the native Date object.
        // @see https://github.com/date-fns/tz for more information.
        const m = isTZDate(d) ? d.withTimeZone(timezone) : new Date(d);

        // (!dateonly && !floating) || !timezone => utc
        let s =
            m.getUTCFullYear() +
            String(m.getUTCMonth() + 1).padStart(2, '0') +
            m.getUTCDate().toString().padStart(2, '0');

        // (dateonly || floating) && timezone => tz
        if (timezone) {
            s =
                m.getFullYear() +
                String(m.getMonth() + 1).padStart(2, '0') +
                m.getDate().toString().padStart(2, '0');
        }

        if (dateonly) {
            return s;
        }

        if (timezone) {
            s +=
                'T' +
                m.getHours().toString().padStart(2, '0') +
                m.getMinutes().toString().padStart(2, '0') +
                m.getSeconds().toString().padStart(2, '0');

            return s;
        }

        s +=
            'T' +
            m.getUTCHours().toString().padStart(2, '0') +
            m.getUTCMinutes().toString().padStart(2, '0') +
            m.getUTCSeconds().toString().padStart(2, '0') +
            (floating ? '' : 'Z');

        return s;
    } else if (isMoment(d)) {
        // @see https://momentjs.com/timezone/docs/#/using-timezones/parsing-in-zone/
        const m = timezone
            ? isMomentTZ(d) && !d.tz()
                ? d.clone().tz(timezone)
                : d
            : floating || (dateonly && isMomentTZ(d) && d.tz())
              ? d
              : d.utc();

        return (
            m.format('YYYYMMDD') +
            (!dateonly
                ? 'T' + m.format('HHmmss') + (floating || timezone ? '' : 'Z')
                : '')
        );
    } else if (isLuxonDate(d)) {
        const m = timezone
            ? d.setZone(timezone)
            : floating || (dateonly && d.zone.type !== 'system')
              ? d
              : d.setZone('utc');

        return (
            m.toFormat('yyyyLLdd') +
            (!dateonly
                ? 'T' + m.toFormat('HHmmss') + (floating || timezone ? '' : 'Z')
                : '')
        );
    } else {
        // @see https://day.js.org/docs/en/plugin/utc

        let m = d;
        if (timezone) {
            m = typeof d.tz === 'function' ? d.tz(timezone) : d;
        } else if (floating) {
            // m = d;
        } else if (typeof d.utc === 'function') {
            m = d.utc();
        } else {
            throw new Error(
                'Unable to convert dayjs object to UTC value: UTC plugin is not available!',
            );
        }

        return (
            m.format('YYYYMMDD') +
            (!dateonly
                ? 'T' + m.format('HHmmss') + (floating || timezone ? '' : 'Z')
                : '')
        );
    }
}

/**
 * Converts a valid date/time object supported by this library to a string.
 * For information about this format, see RFC 5545, section 3.3.5
 * https://tools.ietf.org/html/rfc5545#section-3.3.5
 */
export function formatDateTZ(
    timezone: null | string,
    property: string,
    date: Date | ICalDateTimeValue | string,
    eventData?: { floating?: boolean | null; timezone?: null | string },
): string {
    let tzParam = '';
    let floating = eventData?.floating || false;

    if (eventData?.timezone) {
        tzParam = ';TZID=' + eventData.timezone;

        // This isn't a 'floating' event because it has a timezone;
        // but we use it to omit the 'Z' UTC specifier in formatDate()
        floating = true;
    }

    return (
        property + tzParam + ':' + formatDate(timezone, date, false, floating)
    );
}

export function generateCustomAttributes(data: {
    x: [string, string][];
}): string {
    const str = data.x
        .map(([key, value]) => key.toUpperCase() + ':' + escape(value, false))
        .join('\r\n');
    return str.length ? str + '\r\n' : '';
}

export function isDayjs(value: ICalDateTimeValue): value is ICalDayJsStub {
    return (
        typeof value === 'object' &&
        value !== null &&
        !(value instanceof Date) &&
        !isMoment(value) &&
        !isLuxonDate(value)
    );
}

export function isLuxonDate(
    value: ICalDateTimeValue,
): value is ICalLuxonDateTimeStub {
    return (
        typeof value === 'object' &&
        value !== null &&
        'toJSDate' in value &&
        typeof value.toJSDate === 'function'
    );
}
export function isMoment(value: ICalDateTimeValue): value is ICalMomentStub {
    // @ts-expect-error _isAMomentObject is a private property
    return value != null && value._isAMomentObject != null;
}
export function isMomentDuration(
    value: unknown,
): value is ICalMomentDurationStub {
    return (
        value !== null &&
        typeof value === 'object' &&
        'asSeconds' in value &&
        typeof value.asSeconds === 'function'
    );
}
export function isMomentTZ(
    value: ICalDateTimeValue,
): value is ICalMomentTimezoneStub {
    return isMoment(value) && 'tz' in value && typeof value.tz === 'function';
}

export function isRRule(value: unknown): value is ICalRRuleStub {
    return (
        value !== null &&
        typeof value === 'object' &&
        'between' in value &&
        typeof value.between === 'function' &&
        typeof value.toString === 'function'
    );
}

export function isTZDate(value: ICalDateTimeValue): value is ICalTZDateStub {
    return (
        value instanceof Date &&
        'internal' in value &&
        value.internal instanceof Date &&
        'withTimeZone' in value &&
        typeof value.withTimeZone === 'function' &&
        'tzComponents' in value &&
        typeof value.tzComponents === 'function'
    );
}

export function toDate(value: ICalDateTimeValue): Date {
    if (typeof value === 'string' || value instanceof Date) {
        return new Date(value);
    }

    if (isLuxonDate(value)) {
        return value.toJSDate();
    }

    return value.toDate();
}

export function toDurationString(seconds: number): string {
    let string = '';

    // < 0
    if (seconds < 0) {
        string = '-';
        seconds *= -1;
    }

    string += 'P';

    // DAYS
    if (seconds >= 86400) {
        string += Math.floor(seconds / 86400) + 'D';
        seconds %= 86400;
    }
    if (!seconds && string.length > 1) {
        return string;
    }

    string += 'T';

    // HOURS
    if (seconds >= 3600) {
        string += Math.floor(seconds / 3600) + 'H';
        seconds %= 3600;
    }

    // MINUTES
    if (seconds >= 60) {
        string += Math.floor(seconds / 60) + 'M';
        seconds %= 60;
    }

    // SECONDS
    if (seconds > 0) {
        string += seconds + 'S';
    } else if (string.length <= 2) {
        string += '0S';
    }

    return string;
}

export function toJSON(
    value: ICalDateTimeValue | null | undefined,
): null | string | undefined {
    if (!value) {
        return null;
    }
    if (typeof value === 'string') {
        return value;
    }

    return value.toJSON();
}
