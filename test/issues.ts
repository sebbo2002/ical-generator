'use strict';

import assert from 'assert';
import moment from 'moment-timezone';

import ical from '../src/index.js';
import { ICalEventRepeatingFreq, ICalWeekday } from '../src/types.js';

describe('Issues', function () {
    describe('Issue #38', function () {
        it('should work with Europe/Berlin', function () {
            const calendar = ical({
                events: [
                    {
                        allDay: true,
                        start: moment('2016-04-30T22:00:00.000Z'),
                        summary: 'Example Event',
                    },
                ],
                prodId: '//superman-industries.com//ical-generator//EN',
                timezone: 'Europe/Berlin',
            });

            const str = calendar.toString();
            assert.ok(str.indexOf('DTSTART;VALUE=DATE:20160501') > -1);
        });
        it('should work with Brazil/East', function () {
            const calendar = ical({
                events: [
                    {
                        allDay: true,
                        start: moment('2016-05-01T03:00:00.000Z'),
                        summary: 'Example Event',
                    },
                ],
                prodId: '//superman-industries.com//ical-generator//EN',
                timezone: 'Brazil/East',
            });

            const str = calendar.toString();
            assert.ok(str.indexOf('DTSTART;VALUE=DATE:20160501') > -1);
        });
    });

    describe('Issue #123', function () {
        it('should work with repeating bySetPos', function () {
            const calendar = ical({
                events: [
                    {
                        allDay: true,
                        end: moment('2016-05-01T00:00:00.000Z'),
                        repeating: {
                            byDay: [ICalWeekday.SU],
                            bySetPos: 3,
                            count: 3,
                            freq: ICalEventRepeatingFreq.MONTHLY,
                            interval: 1,
                        },
                        start: moment('2016-04-30T22:00:00.000Z'),
                        summary: 'Example Event',
                    },
                ],
                prodId: '//superman-industries.com//ical-generator//EN',
            });

            const str = calendar.toString();
            assert.ok(
                str.indexOf(
                    'RRULE:FREQ=MONTHLY;COUNT=3;INTERVAL=1;BYDAY=SU;BYSETPOS=3',
                ) > -1,
            );
        });

        it('should work with repeating bySetPos by taking all elements of the byDay array', function () {
            const calendar = ical({
                events: [
                    {
                        allDay: true,
                        end: moment('2016-05-01T00:00:00.000Z'),
                        repeating: {
                            byDay: [ICalWeekday.MO, ICalWeekday.FR],
                            bySetPos: 3,
                            count: 3,
                            freq: ICalEventRepeatingFreq.MONTHLY,
                            interval: 1,
                        },
                        start: moment('2016-04-30T22:00:00.000Z'),
                        summary: 'Example Event',
                    },
                ],
                prodId: '//superman-industries.com//ical-generator//EN',
            });

            const str = calendar.toString();
            assert.ok(
                str.indexOf(
                    'RRULE:FREQ=MONTHLY;COUNT=3;INTERVAL=1;BYDAY=MO,FR;BYSETPOS=3',
                ) > -1,
            );
        });
    });

    describe('Issue #154', function () {
        ['DTSTART', 'DTEND', 'RECURRENCE-ID'].forEach(function (prop) {
            it(`it should correctly set ${prop} when using different timezone in calendar and event`, function () {
                const calendar = ical({
                    events: [
                        {
                            end: moment(1553219772000),
                            recurrenceId: moment(1553219772000),
                            start: moment(1553219772000),
                            timezone: 'America/La_Paz',
                        },
                    ],
                    timezone: 'America/Buenos_Aires',
                });

                const str = calendar.toString();
                assert.ok(
                    str.indexOf(`${prop};TZID=America/La_Paz:20190321T215612`) >
                        -1,
                    str,
                );
            });
        });
    });

    describe('Issue #210', function () {
        it('should repeat/exclude with Europe/Berlin', function () {
            const calendar = ical({
                events: [
                    {
                        repeating: {
                            count: 12,
                            exclude: moment('2020-12-13T00:00:00+01:00'),
                            freq: ICalEventRepeatingFreq.MONTHLY,
                        },
                        start: moment('2020-08-13T00:00:00+01:00'),
                        summary: 'Example Event',
                    },
                ],
                prodId: '//superman-industries.com//ical-generator//EN',
                timezone: 'Europe/Berlin',
            });

            const str = calendar.toString();
            assert.ok(
                str.indexOf('EXDATE;TZID=Europe/Berlin:20201213T000000') > -1,
            );
        });
        it('should repeat/exclude with America/New_York', function () {
            const calendar = ical({
                events: [
                    {
                        repeating: {
                            count: 12,
                            exclude: moment('2020-12-13T00:00:00-05:00'),
                            freq: ICalEventRepeatingFreq.MONTHLY,
                        },
                        start: moment('2020-08-13T00:00:00-05:00'),
                        summary: 'Example Event',
                    },
                ],
                prodId: '//superman-industries.com//ical-generator//EN',
                timezone: 'America/New_York',
            });

            const str = calendar.toString();
            assert.ok(
                str.indexOf('EXDATE;TZID=America/New_York:20201213T000000') >
                    -1,
            );
        });
    });

    describe('Issue #236', function () {
        it('should look like in the example', function () {
            const calendar = ical({
                events: [
                    {
                        id: 'foo',
                        location: {
                            geo: {
                                lat: 34.05223,
                                lon: -118.24368,
                            },
                            radius: 400,
                            title: 'Los Angeles, California, United States',
                        },
                        stamp: new Date('2020-08-13T00:00:00-05:00'),
                        start: new Date('2020-08-13T00:00:00-05:00'),
                        summary: 'Example Event',
                    },
                ],
            });

            assert.strictEqual(
                calendar.toString(),
                [
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'PRODID:-//sebbo.net//ical-generator//EN',
                    'BEGIN:VEVENT',
                    'UID:foo',
                    'SEQUENCE:0',
                    'DTSTAMP:20200813T050000Z',
                    'DTSTART:20200813T050000Z',
                    'SUMMARY:Example Event',
                    'LOCATION:Los Angeles\\, California\\, United States',
                    'X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-APPLE-RADIUS=400;X-TITLE=Los Angel',
                    ' es\\, California\\, United States:geo:34.05223,-118.24368',
                    'GEO:34.05223;-118.24368',
                    'END:VEVENT',
                    'END:VCALENDAR',
                ].join('\r\n'),
            );
        });
    });

    describe('Issue #377', function () {
        it('should not escape quotes in summary', function () {
            const calendar = ical({
                events: [
                    {
                        id: 'foo',
                        stamp: new Date('2020-08-13T00:00:00-05:00'),
                        start: new Date('2020-08-13T00:00:00-05:00'),
                        summary: 'My "quoted" string',
                    },
                ],
            });

            assert.strictEqual(
                calendar.toString(),
                [
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'PRODID:-//sebbo.net//ical-generator//EN',
                    'BEGIN:VEVENT',
                    'UID:foo',
                    'SEQUENCE:0',
                    'DTSTAMP:20200813T050000Z',
                    'DTSTART:20200813T050000Z',
                    'SUMMARY:My "quoted" string',
                    'END:VEVENT',
                    'END:VCALENDAR',
                ].join('\r\n'),
            );
        });
    });

    describe('Issue #442', function () {
        it(
            'should generate floating repeat until value if event is a floating event',
        );
        it(
            'should generate floating repeat exclusion dates if event is a floating event',
        );
    });

    describe('Issue #459', function () {
        it('event.repeating should work with `RRULE:` prefix', function () {
            const calendar = ical({
                events: [
                    {
                        id: 'foo',
                        repeating: 'RRULE:FREQ=MONTHLY;COUNT=3;INTERVAL=1',
                        stamp: new Date('2020-08-13T00:00:00-05:00'),
                        start: new Date('2020-08-13T00:00:00-05:00'),
                        summary: 'Example Event',
                    },
                ],
            });

            assert.strictEqual(
                calendar.toString(),
                [
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'PRODID:-//sebbo.net//ical-generator//EN',
                    'BEGIN:VEVENT',
                    'UID:foo',
                    'SEQUENCE:0',
                    'DTSTAMP:20200813T050000Z',
                    'DTSTART:20200813T050000Z',
                    'RRULE:FREQ=MONTHLY;COUNT=3;INTERVAL=1',
                    'SUMMARY:Example Event',
                    'END:VEVENT',
                    'END:VCALENDAR',
                ].join('\r\n'),
            );
        });
        it('event.repeating should work without `RRULE:` prefix', function () {
            const calendar = ical({
                events: [
                    {
                        id: 'foo',
                        repeating: 'FREQ=MONTHLY;COUNT=3;INTERVAL=1',
                        stamp: new Date('2020-08-13T00:00:00-05:00'),
                        start: new Date('2020-08-13T00:00:00-05:00'),
                        summary: 'Example Event',
                    },
                ],
            });

            assert.strictEqual(
                calendar.toString(),
                [
                    'BEGIN:VCALENDAR',
                    'VERSION:2.0',
                    'PRODID:-//sebbo.net//ical-generator//EN',
                    'BEGIN:VEVENT',
                    'UID:foo',
                    'SEQUENCE:0',
                    'DTSTAMP:20200813T050000Z',
                    'DTSTART:20200813T050000Z',
                    'RRULE:FREQ=MONTHLY;COUNT=3;INTERVAL=1',
                    'SUMMARY:Example Event',
                    'END:VEVENT',
                    'END:VCALENDAR',
                ].join('\r\n'),
            );
        });
    });

    describe('Issue #569 / 570', function () {
        it('event.location should work with `geo` only', function () {
            const event = ical().createEvent({
                end: new Date('2020-06-15T01:00:00Z'),
                id: '12345',
                stamp: new Date('2020-06-15T00:00:00Z'),
                start: new Date('2020-06-15T00:00:00Z'),
                summary: 'Hello',
            });

            event.location({
                geo: {
                    lat: 52.51147570081018,
                    lon: 13.342200696373846,
                },
            });

            assert.strictEqual(
                event.toString(),
                [
                    'BEGIN:VEVENT',
                    'UID:12345',
                    'SEQUENCE:0',
                    'DTSTAMP:20200615T000000Z',
                    'DTSTART:20200615T000000Z',
                    'DTEND:20200615T010000Z',
                    'SUMMARY:Hello',
                    'GEO:52.51147570081018;13.342200696373846',
                    'END:VEVENT',
                    '',
                ].join('\r\n'),
            );
        });
    });

    describe('Issue #581', function () {
        it('event.start and event.end should be swappable', function () {
            const calendar = ical();
            const event = calendar.createEvent({
                end: '2024-02-29T17:20:00.000Z',
                start: '2024-02-29T17:00:00.000Z',
                summary: 'Test Event',
            });

            event.start('2024-02-29T19:00:00.000Z');
            event.end('2024-02-29T19:20:00.000Z');

            const start = event.start();
            assert.ok(typeof start === 'string');
            assert.strictEqual(start, '2024-02-29T19:00:00.000Z');

            const end = event.end();
            assert.ok(typeof end === 'string');
            assert.strictEqual(end, '2024-02-29T19:20:00.000Z');
        });
    });

    describe('Issue #618', function () {
        it('should also produce an error', function () {
            assert.throws(() => {
                const calendar = ical();
                calendar.createEvent({
                    location: {
                        // @ts-ignore
                        address: null,

                        geo: {
                            // @ts-ignore
                            lat: null,

                            // @ts-ignore
                            lon: null,
                        },
                        title: 'Empty Venue',
                    },
                    start: new Date(),
                    summary: 'Test Event',
                });
            }, /`location` isn't formatted correctly/);
        });
    });
});
