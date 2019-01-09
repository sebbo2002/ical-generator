'use strict';

const assert = require('assert');
const ical = require(__dirname + '/../src');

describe('Issues', function () {
    describe('Issue #38', function () {
        it('should work with Europe/Berlin', function() {
            const calendar = ical({
                domain: 'sebbo.net',
                prodId: '//superman-industries.com//ical-generator-edtex//EN',
                timezone: 'Europe/Berlin',
                events: [{
                    start: new Date('Sun May 01 2016 00:00:00 GMT+0200 (CEST)'),
                    summary: 'Example Event',
                    allDay: true
                }]
            });

            const str = calendar.toString();
            assert.ok(str.indexOf('DTSTART;VALUE=DATE:20160501') > -1);
        });
        it('should work with Brazil/East', function() {
            const calendar = ical({
                domain: 'sebbo.net',
                prodId: '//superman-industries.com//ical-generator-edtex//EN',
                timezone: 'Brazil/East',
                events: [{
                    start: new Date('Sun May 01 2016 00:00:00 GMT-3'),
                    summary: 'Example Event',
                    allDay: true
                }]
            });

            const str = calendar.toString();
            assert.ok(str.indexOf('DTSTART;VALUE=DATE:20160501') > -1);
        });
    });

    describe('Issue #123', function () {
        it('should work with repeating bySetPos', function() {
            const calendar = ical({
                domain: 'sebbo.net',
                prodId: '//superman-industries.com//ical-generator-edtex//EN',
                events: [{
                    start: new Date('Sun May 01 2016 00:00:00 GMT+0200 (CEST)'),
                    end: new Date('Sun May 01 2016 02:00:00 GMT+0200 (CEST)'),
                    summary: 'Example Event',
                    allDay: true,
                    repeating: {
                        freq: 'MONTHLY',
                        count: 3,
                        interval: 1,
                        byDay: ['SU'],
                        bySetPos: 3
                    }
                }]
            });

            const str = calendar.toString();
            assert.ok(str.indexOf('RRULE:FREQ=MONTHLY;COUNT=3;INTERVAL=1;BYDAY=SU;BYSETPOS=3') > -1);
        });

        it('should work with repeating bySetPos by taking the first elemnt of the byDay array', function() {
            const calendar = ical({
                domain: 'sebbo.net',
                prodId: '//superman-industries.com//ical-generator-edtex//EN',
                events: [{
                    start: new Date('Sun May 01 2016 00:00:00 GMT+0200 (CEST)'),
                    end: new Date('Sun May 01 2016 02:00:00 GMT+0200 (CEST)'),
                    summary: 'Example Event',
                    allDay: true,
                    repeating: {
                        freq: 'MONTHLY',
                        count: 3,
                        interval: 1,
                        byDay: ['MO', 'FR'],
                        bySetPos: 3
                    }
                }]
            });

            const str = calendar.toString();
            assert.ok(str.indexOf('RRULE:FREQ=MONTHLY;COUNT=3;INTERVAL=1;BYDAY=MO;BYSETPOS=3') > -1);
        });
    });
});