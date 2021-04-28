'use strict';

import assert from 'assert';
import moment from 'moment-timezone';
import ical from '../src';
import {ICalEventRepeatingFreq, ICalWeekday} from '../src/types';

describe('Issues', function () {
    describe('Issue #38', function () {
        it('should work with Europe/Berlin', function () {
            const calendar = ical({
                prodId: '//superman-industries.com//ical-generator//EN',
                timezone: 'Europe/Berlin',
                events: [{
                    start: moment('2016-04-30T22:00:00.000Z'),
                    summary: 'Example Event',
                    allDay: true
                }]
            });

            const str = calendar.toString();
            assert.ok(str.indexOf('DTSTART;VALUE=DATE:20160501') > -1);
        });
        it('should work with Brazil/East', function () {
            const calendar = ical({
                prodId: '//superman-industries.com//ical-generator//EN',
                timezone: 'Brazil/East',
                events: [{
                    start: moment('Sun May 01 2016 00:00:00 GMT-3'),
                    summary: 'Example Event',
                    allDay: true
                }]
            });

            const str = calendar.toString();
            assert.ok(str.indexOf('DTSTART;VALUE=DATE:20160501') > -1);
        });
    });

    describe('Issue #123', function () {
        it('should work with repeating bySetPos', function () {
            const calendar = ical({
                prodId: '//superman-industries.com//ical-generator//EN',
                events: [{
                    start: moment('Sun May 01 2016 00:00:00 GMT+0200 (CEST)'),
                    end: moment('Sun May 01 2016 02:00:00 GMT+0200 (CEST)'),
                    summary: 'Example Event',
                    allDay: true,
                    repeating: {
                        freq: ICalEventRepeatingFreq.MONTHLY,
                        count: 3,
                        interval: 1,
                        byDay: [ICalWeekday.SU],
                        bySetPos: 3
                    }
                }]
            });

            const str = calendar.toString();
            assert.ok(str.indexOf('RRULE:FREQ=MONTHLY;COUNT=3;INTERVAL=1;BYDAY=SU;BYSETPOS=3') > -1);
        });

        it('should work with repeating bySetPos by taking the first elemnt of the byDay array', function () {
            const calendar = ical({
                prodId: '//superman-industries.com//ical-generator//EN',
                events: [{
                    start: moment('Sun May 01 2016 00:00:00 GMT+0200 (CEST)'),
                    end: moment('Sun May 01 2016 02:00:00 GMT+0200 (CEST)'),
                    summary: 'Example Event',
                    allDay: true,
                    repeating: {
                        freq: ICalEventRepeatingFreq.MONTHLY,
                        count: 3,
                        interval: 1,
                        byDay: [ICalWeekday.MO, ICalWeekday.FR],
                        bySetPos: 3
                    }
                }]
            });

            const str = calendar.toString();
            assert.ok(str.indexOf('RRULE:FREQ=MONTHLY;COUNT=3;INTERVAL=1;BYDAY=MO;BYSETPOS=3') > -1);
        });
    });

    describe('Issue #154', function () {
        ['DTSTART', 'DTEND', 'RECURRENCE-ID'].forEach(function (prop) {
            it(`it should correctly set ${prop} when using different timezone in calendar and event`, function () {
                const calendar = ical({
                    timezone: 'America/Buenos_Aires',
                    events: [
                        {
                            start: moment(1553219772000),
                            end: moment(1553219772000),
                            recurrenceId: moment(1553219772000),
                            timezone: 'America/La_Paz'
                        }
                    ]
                });

                const str = calendar.toString();
                assert.ok(str.indexOf(`${prop};TZID=America/La_Paz:20190321T215612`) > -1, str);
            });
        });
    });

    describe('Issue #210', function () {
        it('should repeat/exclude with Europe/Berlin', function () {
            const calendar = ical({
                prodId: '//superman-industries.com//ical-generator//EN',
                timezone: 'Europe/Berlin',
                events: [{
                    start: moment('2020-08-13T00:00:00+01:00'),
                    summary: 'Example Event',
                    repeating: {
                        freq: ICalEventRepeatingFreq.MONTHLY,
                        count: 12,
                        exclude: moment('2020-12-13T00:00:00+01:00')
                    }
                }]
            });

            const str = calendar.toString();
            assert.ok(str.indexOf('EXDATE;TZID=Europe/Berlin:20201213T000000') > -1);
        });
        it('should repeat/exclude with America/New_York', function () {
            const calendar = ical({
                prodId: '//superman-industries.com//ical-generator//EN',
                timezone: 'America/New_York',
                events: [{
                    start: moment('2020-08-13T00:00:00-05:00'),
                    summary: 'Example Event',
                    repeating: {
                        freq: ICalEventRepeatingFreq.MONTHLY,
                        count: 12,
                        exclude: moment('2020-12-13T00:00:00-05:00')
                    }
                }]
            });

            const str = calendar.toString();
            assert.ok(str.indexOf('EXDATE;TZID=America/New_York:20201213T000000') > -1);
        });
    });

    describe('Issue #236', function () {
        it('should look like in the example', function () {
            const calendar = ical({
                events: [{
                    id: 'foo',
                    start: new Date('2020-08-13T00:00:00-05:00'),
                    stamp: new Date('2020-08-13T00:00:00-05:00'),
                    summary: 'Example Event',
                    location: {
                        title: 'Los Angeles, California, United States',
                        geo: {
                            lon: -118.24368,
                            lat: 34.05223,
                        },
                        radius: 400
                    }
                }]
            });

            assert.strictEqual(calendar.toString(), [
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
                'END:VCALENDAR'
            ].join('\r\n'));
        });
    });
});
