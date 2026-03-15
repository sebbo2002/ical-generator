'use strict';

import { TZDate } from '@date-fns/tz';
import assert from 'assert';
import dayjs from 'dayjs';
import dayJsTimezonePlugin from 'dayjs/plugin/timezone.js';
import dayJsUTCPlugin from 'dayjs/plugin/utc.js';
import { DateTime } from 'luxon';
import moment from 'moment';
import momentTz from 'moment-timezone';
import { Temporal } from 'temporal-polyfill';

import {
    checkDate,
    escape,
    foldLines,
    formatDate,
    formatDateTZ,
    toDate,
    toDurationString,
    toJSON,
} from '../src/tools.js';

dayjs.extend(dayJsUTCPlugin);
dayjs.extend(dayJsTimezonePlugin);

describe('ICalTools', function () {
    describe('formatDate()', function () {
        describe('Date / String', function () {
            it('timezone=0 dateonly=0 floating=0', function () {
                assert.strictEqual(
                    formatDate(null, '2018-07-05T18:24:00.052Z', false, false),
                    '20180705T182400Z',
                );
            });
            it('timezone=0 dateonly=0 floating=1', function () {
                assert.strictEqual(
                    formatDate(null, '2018-07-05T18:24:00.052Z', false, true),
                    '20180705T182400',
                );
            });
            it('timezone=0 dateonly=1 floating=0', function () {
                assert.strictEqual(
                    formatDate(null, '2018-07-05T18:24:00.052Z', true, false),
                    '20180705',
                );
            });
            it('timezone=0 dateonly=1 floating=1', function () {
                assert.strictEqual(
                    formatDate(null, '2018-07-05T18:24:00.052Z', true, true),
                    '20180705',
                );
            });
            it('timezone=1 dateonly=0 floating=0', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        '2018-07-05T18:24:00.052',
                        false,
                        false,
                    ),
                    '20180705T182400',
                );
            });
            it('timezone=1 dateonly=0 floating=1', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        '2018-07-05T18:24:00.052',
                        false,
                        true,
                    ),
                    '20180705T182400',
                );
            });
            it('timezone=1 dateonly=1 floating=0', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        '2018-07-05T18:24:00.052',
                        true,
                        false,
                    ),
                    '20180705',
                );
            });
            it('timezone=1 dateonly=1 floating=1', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        '2018-07-05T18:24:00.052',
                        true,
                        true,
                    ),
                    '20180705',
                );
            });
            it('should work with / prefixed global timezones', function () {
                assert.strictEqual(
                    formatDate(
                        '/Europe/Berlin',
                        '2018-07-05T18:24:00.052',
                        false,
                        false,
                    ),
                    '20180705T182400',
                );
            });
        });
        describe('TZDate', function () {
            it('timezone=0 dateonly=0 floating=0', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        new TZDate('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T182400Z',
                );
            });
            it('timezone=0 dateonly=0 floating=1', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        new TZDate('2018-07-05T18:24:00.052Z'),
                        false,
                        true,
                    ),
                    '20180705T182400',
                );
            });
            it('timezone=0 dateonly=1 floating=0', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        new TZDate('2018-07-05T18:24:00.052Z'),
                        true,
                        false,
                    ),
                    '20180705',
                );
            });
            it('timezone=0 dateonly=1 floating=1', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        new TZDate('2018-07-05T18:24:00.052Z'),
                        true,
                        true,
                    ),
                    '20180705',
                );
            });
            it('timezone=1 dateonly=0 floating=0', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        new TZDate('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T202400',
                );
            });
            it('timezone=1 dateonly=0 floating=1', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        new TZDate('2018-07-05T18:24:00.052Z'),
                        false,
                        true,
                    ),
                    '20180705T202400',
                );
            });
            it('timezone=1 dateonly=1 floating=0', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        new TZDate('2018-07-05T18:24:00.052Z'),
                        true,
                        false,
                    ),
                    '20180705',
                );
            });
            it('timezone=1 dateonly=1 floating=1', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        new TZDate('2018-07-05T18:24:00.052'),
                        true,
                        true,
                    ),
                    '20180705',
                );
            });
            it('should work with / prefixed global timezones', function () {
                assert.strictEqual(
                    formatDate(
                        '/Europe/Berlin',
                        new TZDate('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T202400',
                );
            });
            it('should ignore TZDate timezone', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        new TZDate(
                            '2018-07-05T18:24:00.052+02:00',
                            'Europe/Berlin',
                        ),
                        false,
                        false,
                    ),
                    '20180705T162400Z',
                );
            });
            it('should work prefer timezone argument over TZDate timezone', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        new TZDate(
                            '2018-07-05T18:24:00.052+02:00',
                            'Asia/Tokyo',
                        ),
                        false,
                        false,
                    ),
                    '20180705T182400',
                );
            });
        });
        describe('moment.js', function () {
            it('should work without setting a timezone', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        moment('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T182400Z',
                );
            });
            it('should work with timezone in event / calendar (with moment-timezone)', function () {
                assert.strictEqual(
                    formatDate(
                        'Canada/Saskatchewan',
                        moment('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T122400',
                );
            });
            it('should work with floating flag', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        moment('2018-07-05T18:24:00.052'),
                        false,
                        true,
                    ),
                    '20180705T182400',
                );
            });
        });
        describe('moment-timezone.js', function () {
            it('should work without setting a timezone', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        momentTz('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T182400Z',
                );
            });
            it('should work with timezone in event / calendar (with moment-timezone)', function () {
                assert.strictEqual(
                    formatDate(
                        'Canada/Saskatchewan',
                        momentTz('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T122400',
                );
            });
            it('should work with floating flag', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        momentTz('2018-07-05T18:24:00.052'),
                        false,
                        true,
                    ),
                    '20180705T182400',
                );
            });
        });
        describe('Luxon', function () {
            it('should work without setting a timezone', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        DateTime.fromISO('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T182400Z',
                );
            });
            it('should work with timezone in event / calendar (with moment-timezone)', function () {
                assert.strictEqual(
                    formatDate(
                        'Canada/Saskatchewan',
                        DateTime.fromISO('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T122400',
                );
            });
            it('should work with floating flag', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        DateTime.fromISO('2018-07-05T18:24:00.052'),
                        false,
                        true,
                    ),
                    '20180705T182400',
                );
            });
            it('should work with dateonly flag', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        DateTime.fromISO('2018-07-05T18:24:00.052'),
                        true,
                        false,
                    ),
                    '20180705',
                );
            });
            it('should work with dateonly flag, non floating, and date with timezone', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        DateTime.fromISO('2024-03-17T00:00:00.000+01:00', {
                            setZone: true,
                        }),
                        true,
                    ),
                    '20240317',
                );
            });
        });
        describe('Day.js', function () {
            it('should work without setting a timezone', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        dayjs('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T182400Z',
                );
            });
            it('should work with timezone in event / calendar (with moment-timezone)', function () {
                assert.strictEqual(
                    formatDate(
                        'Canada/Saskatchewan',
                        dayjs('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T122400',
                );
            });
            it('should work with floating flag', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        dayjs('2018-07-05T18:24:00.052'),
                        false,
                        true,
                    ),
                    '20180705T182400',
                );
            });
            it('should work with dateonly flag', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        dayjs('2018-07-05T18:24:00.052'),
                        true,
                        false,
                    ),
                    '20180705',
                );
            });
        });
        describe('Temporal', function () {
            it('should work without setting a timezone (ZonedDateTime)', function () {
                const zdt = Temporal.ZonedDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    timeZone: 'UTC',
                    year: 2018,
                });
                // ZonedDateTime uses its own timezone, so when timezone is null, it still formats with Z
                const result = formatDate(null, zdt, false, false);
                assert.strictEqual(result, '20180705T182400Z');
            });
            it('should work without setting a timezone (PlainDateTime)', function () {
                const pdt = Temporal.PlainDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    year: 2018,
                });
                // PlainDateTime with timezone=null and floating=false formats as floating time (no Z)
                assert.strictEqual(
                    formatDate(null, pdt, false, false),
                    '20180705T182400Z',
                );
            });
            it('should work without setting a timezone (PlainDate)', function () {
                const pd = Temporal.PlainDate.from({
                    day: 5,
                    month: 7,
                    year: 2018,
                });
                // PlainDate always get 0:00 time if dateonly = false
                assert.strictEqual(
                    formatDate(null, pd, false, false),
                    '20180705T000000Z',
                );
            });
            it('should work without setting a timezone (Instant)', function () {
                const instant = Temporal.Instant.from('2018-07-05T18:24:00Z');
                assert.strictEqual(
                    formatDate(null, instant, false, false),
                    '20180705T182400Z',
                );
            });

            it('should work with timezone in event / calendar (ZonedDateTime)', function () {
                const zdt = Temporal.ZonedDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    timeZone: 'UTC',
                    year: 2018,
                });
                // When a timezone is provided, ZonedDateTime uses its own timezone but formats without Z
                const result = formatDate(
                    'Canada/Saskatchewan',
                    zdt,
                    false,
                    false,
                );
                assert.match(result, /^20180705T\d{6}$/);
            });

            it('should format ZonedDateTime with timezone', function () {
                const zdt = Temporal.ZonedDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    timeZone: 'Europe/Berlin',
                    year: 2018,
                });
                assert.strictEqual(
                    formatDate('Europe/Berlin', zdt, false, false),
                    '20180705T182400',
                );
            });

            it('should work with floating flag (ZonedDateTime)', function () {
                const zdt = Temporal.ZonedDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    timeZone: 'UTC',
                    year: 2018,
                });
                assert.strictEqual(
                    formatDate(null, zdt, false, true),
                    '20180705T182400',
                );
            });
            it('should work with floating flag (PlainDateTime)', function () {
                const pdt = Temporal.PlainDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    year: 2018,
                });
                assert.strictEqual(
                    formatDate(null, pdt, false, true),
                    '20180705T182400',
                );
            });
            it('should work with floating flag (PlainDate)', function () {
                const pd = Temporal.PlainDate.from({
                    day: 5,
                    month: 7,
                    year: 2018,
                });
                // PlainDate always formats as date-only
                assert.strictEqual(
                    formatDate(null, pd, false, true),
                    '20180705T000000',
                );
            });
            it('should work with floating flag (Instant)', function () {
                const instant = Temporal.Instant.from('2018-07-05T18:24:00Z');
                const result = formatDate(null, instant, false, true);
                assert.strictEqual(result, '20180705T182400');
            });

            it('should work with dateonly flag (ZonedDateTime)', function () {
                const zdt = Temporal.ZonedDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    timeZone: 'UTC',
                    year: 2018,
                });
                assert.strictEqual(
                    formatDate(null, zdt, true, false),
                    '20180705',
                );
            });
            it('should work with dateonly flag (PlainDateTime)', function () {
                const pdt = Temporal.PlainDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    year: 2018,
                });
                assert.strictEqual(
                    formatDate(null, pdt, true, false),
                    '20180705',
                );
            });
            it('should work with dateonly flag (PlainDate)', function () {
                const pd = Temporal.PlainDate.from({
                    day: 5,
                    month: 7,
                    year: 2018,
                });
                assert.strictEqual(
                    formatDate(null, pd, true, false),
                    '20180705',
                );
            });
            it('should work with dateonly flag (Instant)', function () {
                const instant = Temporal.Instant.from('2018-07-05T18:24:00Z');
                assert.strictEqual(
                    formatDate(null, instant, true, false),
                    '20180705',
                );
            });
        });
    });

    describe('formatDateTZ()', function () {
        it('should work with timezone', function () {
            const ed = { timezone: 'Europe/Berlin' };
            assert.strictEqual(
                formatDateTZ(
                    'Europe/Berlin',
                    'DSTART',
                    moment('2018-07-02T15:48:05.000Z'),
                    ed,
                ),
                'DSTART;TZID=Europe/Berlin:20180702T174805',
            );
        });
        it('should work without timezone', function () {
            assert.strictEqual(
                formatDateTZ(null, 'DSTART', '2018-07-02T15:48:05.000Z', {}),
                'DSTART:20180702T154805Z',
            );
        });
        it('should work without eventdata parameter', function () {
            assert.strictEqual(
                formatDateTZ(null, 'DSTART', '2018-07-02T15:48:05.000Z'),
                'DSTART:20180702T154805Z',
            );
        });
    });

    describe('escape()', function () {
        it('should escape \\', function () {
            assert.strictEqual(
                escape('Lorem \\ipsum', false),
                'Lorem \\\\ipsum',
            );
        });
        it('should escape ;', function () {
            assert.strictEqual(escape('Lorem ;ipsum', false), 'Lorem \\;ipsum');
        });
        it('should escape ,', function () {
            assert.strictEqual(escape('Lorem, ipsum', false), 'Lorem\\, ipsum');
        });
        it('should escape \\r', function () {
            assert.strictEqual(
                escape('Lorem \ripsum', false),
                'Lorem \\nipsum',
            );
        });
        it('should escape \\n', function () {
            assert.strictEqual(
                escape('Lorem \nipsum', false),
                'Lorem \\nipsum',
            );
        });
        it('should escape \\r\\n', function () {
            assert.strictEqual(
                escape('Lorem \r\nipsum', false),
                'Lorem \\nipsum',
            );
        });
        it('should escape " in text when inQuotes = true', function () {
            assert.strictEqual(escape('Lorem "ipsum', true), 'Lorem \\"ipsum');
        });
        it('should not escape " in text when inQuotes = false', function () {
            assert.strictEqual(escape('Lorem "ipsum', false), 'Lorem "ipsum');
        });
    });

    describe('foldLines()', function () {
        it('should basically work correctly', function () {
            assert.strictEqual(
                foldLines(
                    '12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujzvguhbghbbqwxowidoi21e8981',
                ),
                '12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujz\r\n vguhbghbbqwxowidoi21e8981',
            );
        });
        it('should not split surrogate pairs', function () {
            assert.strictEqual(
                foldLines(
                    '👋🏼12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujvguhbghbbqwxowidoi21e8981',
                ),
                '👋🏼12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcb\r\n iweciujvguhbghbbqwxowidoi21e8981',
            );
        });
    });

    describe('checkDate()', function () {
        describe('Date', function () {
            it('should work with valid Date', function () {
                const date = new Date();
                assert.equal(checkDate(date, 'foo'), date);
            });
            it('should throw error for invalid Date', function () {
                const date = new Date('foo');
                assert.throws(() => {
                    checkDate(date, 'foo');
                }, /`foo` has to be a valid date!/);
            });
        });
        describe('String', function () {
            it('should work with valid String', function () {
                const date = '2021-03-28T13:15:23.587Z';
                assert.equal(checkDate(date, 'foo'), date);
            });
            it('should throw error for invalid String', function () {
                const date = 'foo';
                assert.throws(() => {
                    checkDate(date, 'foo');
                }, /`foo` has to be a valid date!/);
            });
        });
        describe('Luxon', function () {
            it('should work with valid Luxon', function () {
                const date = DateTime.now();
                assert.equal(checkDate(date, 'foo'), date);
            });
            it('should throw error for invalid Luxon', function () {
                const date = DateTime.fromISO('foo');
                assert.throws(() => {
                    checkDate(date, 'foo');
                }, /`foo` has to be a valid date!/);
            });
        });
        describe('Moment', function () {
            it('should work with valid Moment', function () {
                const date = moment();
                assert.equal(checkDate(date, 'foo'), date);
            });
            it('should throw error for invalid Moment', function () {
                const date = moment('foo', 'MM/DD/YYYY', true);
                assert.throws(() => {
                    checkDate(date, 'foo');
                }, /`foo` has to be a valid date!/);
            });
        });
        describe('Day.js', function () {
            it('should work with valid Day.js', function () {
                const date = dayjs();
                assert.equal(checkDate(date, 'foo'), date);
            });
            it('should throw error for invalid Day.js', function () {
                const date = dayjs('foo');
                assert.throws(() => {
                    checkDate(date, 'foo');
                }, /`foo` has to be a valid date!/);
            });
        });
    });

    describe('toDate()', function () {
        it('should work with strings', function () {
            const date = new Date();
            assert.deepStrictEqual(toDate(date.toJSON()), date);
        });
        it('should work with native Date', function () {
            const date = new Date();
            assert.deepStrictEqual(toDate(date), date);
        });
        it('should work with moment object', function () {
            const date = new Date();
            assert.deepStrictEqual(toDate(moment(date)), date);
        });
        it('should work with moment-timezone object', function () {
            const date = new Date();
            assert.deepStrictEqual(toDate(momentTz(date)), date);
        });
        it('should work with Day.js object', function () {
            const date = new Date();
            assert.deepStrictEqual(toDate(dayjs(date)), date);
        });
        it('should work with luxon DateTime object', function () {
            const date = new Date();
            assert.deepStrictEqual(toDate(DateTime.fromJSDate(date)), date);
        });
        it('should work with Temporal.ZonedDateTime', function () {
            const zdt = Temporal.ZonedDateTime.from({
                day: 5,
                hour: 18,
                minute: 24,
                month: 7,
                second: 0,
                timeZone: 'UTC',
                year: 2018,
            });
            const date = toDate(zdt);
            assert(date instanceof Date);
            assert.strictEqual(date.toJSON(), '2018-07-05T18:24:00.000Z');
        });
        it('should work with Temporal.PlainDateTime', function () {
            const pdt = Temporal.PlainDateTime.from({
                day: 5,
                hour: 18,
                minute: 24,
                month: 7,
                second: 0,
                year: 2018,
            });
            const date = toDate(pdt);
            assert(date instanceof Date);
            assert.strictEqual(date.toJSON(), '2018-07-05T18:24:00.000Z');
        });
        it('should work with Temporal.PlainDate', function () {
            const pd = Temporal.PlainDate.from({
                day: 5,
                month: 7,
                year: 2018,
            });
            const date = toDate(pd);
            assert(date instanceof Date);
            assert.strictEqual(date.toJSON(), '2018-07-05T00:00:00.000Z');
        });
        it('should work with Temporal.Instant', function () {
            const instant = Temporal.Instant.from('2018-07-05T18:24:00Z');
            const date = toDate(instant);
            assert(date instanceof Date);
            assert.strictEqual(date.toJSON(), '2018-07-05T18:24:00.000Z');
        });
    });

    describe('toDurationString()', function () {
        it('should work', async function () {
            assert.strictEqual(toDurationString(0), 'PT0S');
            assert.strictEqual(toDurationString(1), 'PT1S');
            assert.strictEqual(toDurationString(60), 'PT1M');
            assert.strictEqual(toDurationString(3600), 'PT1H');
            assert.strictEqual(toDurationString(86400), 'P1D');

            assert.strictEqual(toDurationString(-3600), '-PT1H');
        });
    });

    describe('formatDate()', function () {
        describe('Date / String', function () {
            it('timezone=0 dateonly=0 floating=0', function () {
                assert.strictEqual(
                    formatDate(null, '2018-07-05T18:24:00.052Z', false, false),
                    '20180705T182400Z',
                );
            });
            it('timezone=0 dateonly=0 floating=1', function () {
                assert.strictEqual(
                    formatDate(null, '2018-07-05T18:24:00.052Z', false, true),
                    '20180705T182400',
                );
            });
            it('timezone=0 dateonly=1 floating=0', function () {
                assert.strictEqual(
                    formatDate(null, '2018-07-05T18:24:00.052Z', true, false),
                    '20180705',
                );
            });
            it('timezone=0 dateonly=1 floating=1', function () {
                assert.strictEqual(
                    formatDate(null, '2018-07-05T18:24:00.052Z', true, true),
                    '20180705',
                );
            });
            it('timezone=1 dateonly=0 floating=0', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        '2018-07-05T18:24:00.052',
                        false,
                        false,
                    ),
                    '20180705T182400',
                );
            });
            it('timezone=1 dateonly=0 floating=1', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        '2018-07-05T18:24:00.052',
                        false,
                        true,
                    ),
                    '20180705T182400',
                );
            });
            it('timezone=1 dateonly=1 floating=0', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        '2018-07-05T18:24:00.052',
                        true,
                        false,
                    ),
                    '20180705',
                );
            });
            it('timezone=1 dateonly=1 floating=1', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        '2018-07-05T18:24:00.052',
                        true,
                        true,
                    ),
                    '20180705',
                );
            });
            it('should work with / prefixed global timezones', function () {
                assert.strictEqual(
                    formatDate(
                        '/Europe/Berlin',
                        '2018-07-05T18:24:00.052',
                        false,
                        false,
                    ),
                    '20180705T182400',
                );
            });
        });
        describe('TZDate', function () {
            it('should work with timezone', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        new TZDate('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T202400',
                );
            });
            it('should ignore TZDate timezone', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        new TZDate(
                            '2018-07-05T18:24:00.052+02:00',
                            'Europe/Berlin',
                        ),
                        false,
                        false,
                    ),
                    '20180705T162400Z',
                );
            });
            it('should work prefer timezone argument over TZDate timezone', function () {
                assert.strictEqual(
                    formatDate(
                        'Europe/Berlin',
                        new TZDate(
                            '2018-07-05T18:24:00.052+02:00',
                            'Asia/Tokyo',
                        ),
                        false,
                        false,
                    ),
                    '20180705T182400',
                );
            });
        });
        describe('moment.js', function () {
            it('should work without setting a timezone', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        moment('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T182400Z',
                );
            });
            it('should work with timezone in event / calendar (with moment-timezone)', function () {
                assert.strictEqual(
                    formatDate(
                        'Canada/Saskatchewan',
                        moment('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T122400',
                );
            });
            it('should work with floating flag', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        moment('2018-07-05T18:24:00.052'),
                        false,
                        true,
                    ),
                    '20180705T182400',
                );
            });
        });
        describe('moment-timezone.js', function () {
            it('should work without setting a timezone', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        momentTz('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T182400Z',
                );
            });
            it('should work with timezone in event / calendar (with moment-timezone)', function () {
                assert.strictEqual(
                    formatDate(
                        'Canada/Saskatchewan',
                        momentTz('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T122400',
                );
            });
            it('should work with floating flag', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        momentTz('2018-07-05T18:24:00.052'),
                        false,
                        true,
                    ),
                    '20180705T182400',
                );
            });
        });
        describe('Luxon', function () {
            it('should work without setting a timezone', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        DateTime.fromISO('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T182400Z',
                );
            });
            it('should work with timezone in event / calendar (with moment-timezone)', function () {
                assert.strictEqual(
                    formatDate(
                        'Canada/Saskatchewan',
                        DateTime.fromISO('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T122400',
                );
            });
            it('should work with floating flag', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        DateTime.fromISO('2018-07-05T18:24:00.052'),
                        false,
                        true,
                    ),
                    '20180705T182400',
                );
            });
            it('should work with dateonly flag', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        DateTime.fromISO('2018-07-05T18:24:00.052'),
                        true,
                        false,
                    ),
                    '20180705',
                );
            });
            it('should work with dateonly flag, non floating, and date with timezone', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        DateTime.fromISO('2024-03-17T00:00:00.000+01:00', {
                            setZone: true,
                        }),
                        true,
                    ),
                    '20240317',
                );
            });
        });
        describe('Day.js', function () {
            it('should work without setting a timezone', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        dayjs('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T182400Z',
                );
            });
            it('should work with timezone in event / calendar (with moment-timezone)', function () {
                assert.strictEqual(
                    formatDate(
                        'Canada/Saskatchewan',
                        dayjs('2018-07-05T18:24:00.052Z'),
                        false,
                        false,
                    ),
                    '20180705T122400',
                );
            });
            it('should work with floating flag', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        dayjs('2018-07-05T18:24:00.052'),
                        false,
                        true,
                    ),
                    '20180705T182400',
                );
            });
            it('should work with dateonly flag', function () {
                assert.strictEqual(
                    formatDate(
                        null,
                        dayjs('2018-07-05T18:24:00.052'),
                        true,
                        false,
                    ),
                    '20180705',
                );
            });
        });
        describe('Temporal.ZonedDateTime', function () {
            it('should work without setting a timezone', function () {
                const zdt = Temporal.ZonedDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    timeZone: 'UTC',
                    year: 2018,
                });
                assert.strictEqual(
                    formatDate(null, zdt, false, false),
                    '20180705T182400Z',
                );
            });
            it('should format ZonedDateTime with timezone', function () {
                const zdt = Temporal.ZonedDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    timeZone: 'MET',
                    year: 2018,
                });
                assert.strictEqual(
                    formatDate('UTC', zdt, false, false),
                    '20180705T182400',
                );
            });
            it('should format ZonedDateTime as date-only', function () {
                const zdt = Temporal.ZonedDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    timeZone: 'Europe/Berlin',
                    year: 2018,
                });
                assert.strictEqual(
                    formatDate('Europe/Berlin', zdt, true, false),
                    '20180705',
                );
            });
        });
        describe('Temporal.PlainDateTime', function () {
            it('should format PlainDateTime as floating time', function () {
                const pdt = Temporal.PlainDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    year: 2018,
                });
                assert.strictEqual(
                    formatDate(null, pdt, false, true),
                    '20180705T182400',
                );
            });
            it('should format PlainDateTime with timezone conversion', function () {
                const pdt = Temporal.PlainDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    year: 2018,
                });
                // When timezone is provided, it converts to that timezone
                const result = formatDate('Europe/Berlin', pdt, false, false);
                assert.match(result, /^20180705T\d{6}$/);
            });
            it('should format PlainDateTime as date-only', function () {
                const pdt = Temporal.PlainDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    year: 2018,
                });
                assert.strictEqual(
                    formatDate(null, pdt, true, false),
                    '20180705',
                );
            });
        });
        describe('Temporal.PlainDate', function () {
            it('should format PlainDate', function () {
                const pd = Temporal.PlainDate.from({
                    day: 5,
                    month: 7,
                    year: 2018,
                });
                assert.strictEqual(
                    formatDate(null, pd, false, false),
                    '20180705T000000Z',
                );
            });
            it('should format PlainDate as date-only', function () {
                const pd = Temporal.PlainDate.from({
                    day: 5,
                    month: 7,
                    year: 2018,
                });
                assert.strictEqual(
                    formatDate(null, pd, true, false),
                    '20180705',
                );
            });
        });
        describe('Temporal.Instant', function () {
            it('should format Instant with timezone', function () {
                const instant = Temporal.Instant.from('2018-07-05T18:24:00Z');
                const result = formatDate('UTC', instant, false, false);
                assert.match(result, /^20180705T\d{6}Z?$/);
            });
            it('should format Instant as date-only', function () {
                const instant = Temporal.Instant.from('2018-07-05T18:24:00Z');
                const result = formatDate('UTC', instant, true, false);
                assert.strictEqual(result, '20180705');
            });
        });
    });

    describe('checkDate()', function () {
        describe('Date', function () {
            it('should work with valid Date', function () {
                const date = new Date();
                assert.equal(checkDate(date, 'foo'), date);
            });
            it('should throw error for invalid Date', function () {
                const date = new Date('foo');
                assert.throws(() => {
                    checkDate(date, 'foo');
                }, /`foo` has to be a valid date!/);
            });
        });
        describe('String', function () {
            it('should work with valid String', function () {
                const date = '2021-03-28T13:15:23.587Z';
                assert.equal(checkDate(date, 'foo'), date);
            });
            it('should throw error for invalid String', function () {
                const date = 'foo';
                assert.throws(() => {
                    checkDate(date, 'foo');
                }, /`foo` has to be a valid date!/);
            });
        });
        describe('Luxon', function () {
            it('should work with valid Luxon', function () {
                const date = DateTime.now();
                assert.equal(checkDate(date, 'foo'), date);
            });
            it('should throw error for invalid Luxon', function () {
                const date = DateTime.fromISO('foo');
                assert.throws(() => {
                    checkDate(date, 'foo');
                }, /`foo` has to be a valid date!/);
            });
        });
        describe('Moment', function () {
            it('should work with valid Moment', function () {
                const date = moment();
                assert.equal(checkDate(date, 'foo'), date);
            });
            it('should throw error for invalid Moment', function () {
                const date = moment('foo', 'MM/DD/YYYY', true);
                assert.throws(() => {
                    checkDate(date, 'foo');
                }, /`foo` has to be a valid date!/);
            });
        });
        describe('Day.js', function () {
            it('should work with valid Day.js', function () {
                const date = dayjs();
                assert.equal(checkDate(date, 'foo'), date);
            });
            it('should throw error for invalid Day.js', function () {
                const date = dayjs('foo');
                assert.throws(() => {
                    checkDate(date, 'foo');
                }, /`foo` has to be a valid date!/);
            });
        });
        describe('Temporal.ZonedDateTime', function () {
            it('should accept valid ZonedDateTime', function () {
                const zdt = Temporal.ZonedDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    timeZone: 'Europe/Berlin',
                    year: 2018,
                });
                assert.strictEqual(checkDate(zdt, 'test'), zdt);
            });
        });
        describe('Temporal.PlainDateTime', function () {
            it('should accept valid PlainDateTime', function () {
                const pdt = Temporal.PlainDateTime.from({
                    day: 5,
                    hour: 18,
                    minute: 24,
                    month: 7,
                    second: 0,
                    year: 2018,
                });
                assert.strictEqual(checkDate(pdt, 'test'), pdt);
            });
        });
        describe('Temporal.PlainDate', function () {
            it('should accept valid PlainDate', function () {
                const pd = Temporal.PlainDate.from({
                    day: 5,
                    month: 7,
                    year: 2018,
                });
                assert.strictEqual(checkDate(pd, 'test'), pd);
            });
        });
        describe('Temporal.Instant', function () {
            it('should accept valid Instant', function () {
                const instant = Temporal.Instant.from('2018-07-05T18:24:00Z');
                assert.strictEqual(checkDate(instant, 'test'), instant);
            });
        });
    });

    describe('toDate()', function () {
        it('should work with strings', function () {
            const date = new Date();
            assert.deepStrictEqual(toDate(date.toJSON()), date);
        });
        it('should work with native Date', function () {
            const date = new Date();
            assert.deepStrictEqual(toDate(date), date);
        });
        it('should work with moment object', function () {
            const date = new Date();
            assert.deepStrictEqual(toDate(moment(date)), date);
        });
        it('should work with moment-timezone object', function () {
            const date = new Date();
            assert.deepStrictEqual(toDate(momentTz(date)), date);
        });
        it('should work with Day.js object', function () {
            const date = new Date();
            assert.deepStrictEqual(toDate(dayjs(date)), date);
        });
        it('should work with luxon DateTime object', function () {
            const date = new Date();
            assert.deepStrictEqual(toDate(DateTime.fromJSDate(date)), date);
        });
        it('should work with Temporal.ZonedDateTime', function () {
            const zdt = Temporal.ZonedDateTime.from({
                day: 5,
                hour: 18,
                minute: 24,
                month: 7,
                second: 0,
                timeZone: 'UTC',
                year: 2018,
            });
            const date = toDate(zdt);
            assert(date instanceof Date);
            assert.strictEqual(date.getUTCFullYear(), 2018);
            assert.strictEqual(date.getUTCMonth(), 6); // 0-indexed
            assert.strictEqual(date.getUTCDate(), 5);
        });
        it('should work with Temporal.PlainDateTime', function () {
            const pdt = Temporal.PlainDateTime.from({
                day: 5,
                hour: 18,
                minute: 24,
                month: 7,
                second: 0,
                year: 2018,
            });
            const date = toDate(pdt);
            assert(date instanceof Date);
            assert.strictEqual(date.getUTCFullYear(), 2018);
        });
        it('should work with Temporal.PlainDate', function () {
            const pd = Temporal.PlainDate.from({
                day: 5,
                month: 7,
                year: 2018,
            });
            const date = toDate(pd);
            assert(date instanceof Date);
            assert.strictEqual(date.getUTCFullYear(), 2018);
            assert.strictEqual(date.getUTCMonth(), 6);
            assert.strictEqual(date.getUTCDate(), 5);
        });
        it('should work with Temporal.Instant', function () {
            const instant = Temporal.Instant.from('2018-07-05T18:24:00Z');
            const date = toDate(instant);
            assert(date instanceof Date);
            const expectedEpochSeconds = Math.floor(
                new Date('2018-07-05T18:24:00Z').getTime() / 1000,
            );
            assert.strictEqual(
                Math.floor(date.getTime() / 1000),
                expectedEpochSeconds,
            );
        });
    });

    describe('toJSON()', function () {
        it('should work with Temporal.ZonedDateTime', function () {
            const zdt = Temporal.ZonedDateTime.from({
                day: 5,
                hour: 18,
                minute: 24,
                month: 7,
                second: 0,
                timeZone: 'Europe/Berlin',
                year: 2018,
            });
            const json = toJSON(zdt);
            assert.ok(typeof json === 'string');
            checkDate(json, 'test');
            toDate(json);
        });
        it('should work with Temporal.PlainDateTime', function () {
            const pdt = Temporal.PlainDateTime.from({
                day: 5,
                hour: 18,
                minute: 24,
                month: 7,
                second: 0,
                year: 2018,
            });
            const json = toJSON(pdt);
            assert.ok(typeof json === 'string');
            checkDate(json, 'test');
            toDate(json);
        });
        it('should with Temporal.PlainDate', function () {
            const pd = Temporal.PlainDate.from({
                day: 5,
                month: 7,
                year: 2018,
            });
            const json = toJSON(pd);
            assert.ok(typeof json === 'string');
            checkDate(json, 'test');
            toDate(json);
        });
        it('should with Temporal.Instant', function () {
            const instant = Temporal.Instant.from('2018-07-05T18:24:00Z');
            const json = toJSON(instant);
            assert.ok(typeof json === 'string');
            checkDate(json, 'test');
            toDate(json);
        });
    });
});
