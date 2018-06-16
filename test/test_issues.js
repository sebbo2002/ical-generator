'use strict';

const assert = require('assert');
const moment = require('moment-timezone');
const ical = require(__dirname + '/../src');

describe('Issues', function () {
    describe('Issue #38', function () {
        it('should work with Europe/Berlin', function() {
            const calendar = ical({
                domain: 'sebbo.net',
                prodId: '//superman-industries.com//ical-generator//EN',
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
                prodId: '//superman-industries.com//ical-generator//EN',
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
});