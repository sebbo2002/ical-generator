'use strict';

import assert from 'assert';
import moment from 'moment';
import momentTz from 'moment-timezone';
import {DateTime} from 'luxon';
import dayjs from 'dayjs';
import dayJsUTCPlugin from 'dayjs/plugin/utc.js';
import dayJsTimezonePlugin from 'dayjs/plugin/timezone.js';
import {
    checkDate, 
    escape,
    foldLines,
    formatDate,
    formatDateTZ,
    toDate,
    toDurationString
} from '../src/tools.js';

dayjs.extend(dayJsUTCPlugin);
dayjs.extend(dayJsTimezonePlugin);

describe('ICalTools', function () {
    describe('formatDate()', function () {
        describe('Date / String', function () {
            it('timezone=0 dateonly=0 floating=0', function () {
                assert.strictEqual(
                    formatDate(null, '2018-07-05T18:24:00.052Z', false, false),
                    '20180705T182400Z'
                );
            });
            it('timezone=0 dateonly=0 floating=1', function () {
                assert.strictEqual(
                    formatDate(null, '2018-07-05T18:24:00.052Z', false, true),
                    '20180705T182400'
                );
            });
            it('timezone=0 dateonly=1 floating=0', function () {
                assert.strictEqual(
                    formatDate(null, '2018-07-05T18:24:00.052Z', true, false),
                    '20180705'
                );
            });
            it('timezone=0 dateonly=1 floating=1', function () {
                assert.strictEqual(
                    formatDate(null, '2018-07-05T18:24:00.052Z', true, true),
                    '20180705'
                );
            });
            it('timezone=1 dateonly=0 floating=0', function () {
                assert.strictEqual(
                    formatDate('Europe/Berlin', '2018-07-05T18:24:00.052', false, false),
                    '20180705T182400'
                );
            });
            it('timezone=1 dateonly=0 floating=1', function () {
                assert.strictEqual(
                    formatDate('Europe/Berlin', '2018-07-05T18:24:00.052', false, true),
                    '20180705T182400'
                );
            });
            it('timezone=1 dateonly=1 floating=0', function () {
                assert.strictEqual(
                    formatDate('Europe/Berlin', '2018-07-05T18:24:00.052', true, false),
                    '20180705'
                );
            });
            it('timezone=1 dateonly=1 floating=1', function () {
                assert.strictEqual(
                    formatDate('Europe/Berlin', '2018-07-05T18:24:00.052', true, true),
                    '20180705'
                );
            });
            it('should work with / prefixed global timezones', function () {
                assert.strictEqual(
                    formatDate('/Europe/Berlin', '2018-07-05T18:24:00.052', false, false),
                    '20180705T182400'
                );
            });
        });
        describe('moment.js', function () {
            it('should work without setting a timezone', function () {
                assert.strictEqual(
                    formatDate(null, moment('2018-07-05T18:24:00.052Z'), false, false),
                    '20180705T182400Z'
                );
            });
            it('should work with timezone in event / calendar (with moment-timezone)', function () {
                assert.strictEqual(
                    formatDate('Canada/Saskatchewan', moment('2018-07-05T18:24:00.052Z'), false, false),
                    '20180705T122400'
                );
            });
            it('should work with floating flag', function () {
                assert.strictEqual(
                    formatDate(null, moment('2018-07-05T18:24:00.052'), false, true),
                    '20180705T182400'
                );
            });
        });
        describe('moment-timezone.js', function () {
            it('should work without setting a timezone', function () {
                assert.strictEqual(
                    formatDate(null, momentTz('2018-07-05T18:24:00.052Z'), false, false),
                    '20180705T182400Z'
                );
            });
            it('should work with timezone in event / calendar (with moment-timezone)', function () {
                assert.strictEqual(
                    formatDate('Canada/Saskatchewan', momentTz('2018-07-05T18:24:00.052Z'), false, false),
                    '20180705T122400'
                );
            });
            it('should work with floating flag', function () {
                assert.strictEqual(
                    formatDate(null, momentTz('2018-07-05T18:24:00.052'), false, true),
                    '20180705T182400'
                );
            });
        });
        describe('Luxon', function () {
            it('should work without setting a timezone', function () {
                assert.strictEqual(
                    formatDate(null, DateTime.fromISO('2018-07-05T18:24:00.052Z'), false, false),
                    '20180705T182400Z'
                );
            });
            it('should work with timezone in event / calendar (with moment-timezone)', function () {
                assert.strictEqual(
                    formatDate('Canada/Saskatchewan', DateTime.fromISO('2018-07-05T18:24:00.052Z'), false, false),
                    '20180705T122400'
                );
            });
            it('should work with floating flag', function () {
                assert.strictEqual(
                    formatDate(null, DateTime.fromISO('2018-07-05T18:24:00.052'), false, true),
                    '20180705T182400'
                );
            });
            it('should work with dateonly flag', function () {
                assert.strictEqual(
                    formatDate(null, DateTime.fromISO('2018-07-05T18:24:00.052'), true, false),
                    '20180705'
                );
            });
        });
        describe('Day.js', function () {
            it('should work without setting a timezone', function () {
                assert.strictEqual(
                    formatDate(null, dayjs('2018-07-05T18:24:00.052Z'), false, false),
                    '20180705T182400Z'
                );
            });
            it('should work with timezone in event / calendar (with moment-timezone)', function () {
                assert.strictEqual(
                    formatDate('Canada/Saskatchewan', dayjs('2018-07-05T18:24:00.052Z'), false, false),
                    '20180705T122400'
                );
            });
            it('should work with floating flag', function () {
                assert.strictEqual(
                    formatDate(null, dayjs('2018-07-05T18:24:00.052'), false, true),
                    '20180705T182400'
                );
            });
            it('should work with dateonly flag', function () {
                assert.strictEqual(
                    formatDate(null, dayjs('2018-07-05T18:24:00.052'), true, false),
                    '20180705'
                );
            });
        });
    });

    describe('formatDateTZ()', function () {
        it('should work with timezone', function () {
            const ed = {timezone: 'Europe/Berlin'};
            assert.strictEqual(
                formatDateTZ('Europe/Berlin', 'DSTART', moment('2018-07-02T15:48:05.000Z'), ed),
                'DSTART;TZID=Europe/Berlin:20180702T174805'
            );
        });
        it('should work without timezone', function () {
            assert.strictEqual(
                formatDateTZ(null, 'DSTART', '2018-07-02T15:48:05.000Z', {}),
                'DSTART:20180702T154805Z'
            );
        });
        it('should work without eventdata parameter', function () {
            assert.strictEqual(
                formatDateTZ(null, 'DSTART', '2018-07-02T15:48:05.000Z'),
                'DSTART:20180702T154805Z'
            );
        });
    });

    describe('escape()', function () {
        it('should escape \\', function () {
            assert.strictEqual(
                escape('Lorem \\ipsum', false),
                'Lorem \\\\ipsum'
            );
        });
        it('should escape ;', function () {
            assert.strictEqual(
                escape('Lorem ;ipsum', false),
                'Lorem \\;ipsum'
            );
        });
        it('should escape ,', function () {
            assert.strictEqual(
                escape('Lorem, ipsum', false),
                'Lorem\\, ipsum'
            );
        });
        it('should escape \\r', function () {
            assert.strictEqual(
                escape('Lorem \ripsum', false),
                'Lorem \\nipsum'
            );
        });
        it('should escape \\n', function () {
            assert.strictEqual(
                escape('Lorem \nipsum', false),
                'Lorem \\nipsum'
            );
        });
        it('should escape \\r\\n', function () {
            assert.strictEqual(
                escape('Lorem \r\nipsum', false),
                'Lorem \\nipsum'
            );
        });
        it('should escape " in text when inQuotes = true', function () {
            assert.strictEqual(
                escape('Lorem "ipsum', true),
                'Lorem \\"ipsum'
            );
        });
        it('should not escape " in text when inQuotes = false', function () {
            assert.strictEqual(
                escape('Lorem "ipsum', false),
                'Lorem "ipsum'
            );
        });
    });

    describe('foldLines()', function () {
        it('should basically work correctly', function () {
            assert.strictEqual(
                foldLines('12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujzvguhbghbbqwxowidoi21e8981'),
                '12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujz\r\n vguhbghbbqwxowidoi21e8981'
            );
        });
        it('should not split surrogate pairs', function () {
            assert.strictEqual(
                foldLines('👋🏼12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcbiweciujvguhbghbbqwxowidoi21e8981'),
                '👋🏼12345678ikjhgztrde546rf7g8hjiomkjnhgqfcdxerdftgzuinjhgcfvtzvzvuwcb\r\n iweciujvguhbghbbqwxowidoi21e8981'
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
});
