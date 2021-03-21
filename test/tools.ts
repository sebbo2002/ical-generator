'use strict';

import assert from 'assert';
import moment from 'moment-timezone';
import {DateTime} from 'luxon';
import dayjs from 'dayjs';
import dayJsUTCPlugin from 'dayjs/plugin/utc';
import dayJsTimezonePlugin from 'dayjs/plugin/timezone';
import { formatDate, formatDateTZ, foldLines, escape } from '../src/tools';

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
    });

    describe('escape()', function () {
        it('should escape \\', function () {
            assert.strictEqual(
                escape('Lorem \\ipsum'),
                'Lorem \\\\ipsum'
            );
        });
        it('should escape ;', function () {
            assert.strictEqual(
                escape('Lorem ;ipsum'),
                'Lorem \\;ipsum'
            );
        });
        it('should escape ,', function () {
            assert.strictEqual(
                escape('Lorem, ipsum'),
                'Lorem\\, ipsum'
            );
        });
        it('should escape \\r', function () {
            assert.strictEqual(
                escape('Lorem \ripsum'),
                'Lorem \\nipsum'
            );
        });
        it('should escape \\n', function () {
            assert.strictEqual(
                escape('Lorem \nipsum'),
                'Lorem \\nipsum'
            );
        });
        it('should escape \\r\\n', function () {
            assert.strictEqual(
                escape('Lorem \r\nipsum'),
                'Lorem \\nipsum'
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
});
