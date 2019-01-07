'use strict';

const assert = require('assert');
const fs = require('fs');
const ical = require(__dirname + '/../src');

describe('ical-generator Cases', function() {
    it('case #1', function() {
        const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'});
        cal.createEvent({
            id: '123',
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            created: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            lastModified: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            summary: 'Simple Event'
        });

        /*jslint stupid: true */
        const string = cal.toString();
        assert.strictEqual(string, fs.readFileSync(__dirname + '/results/generate_01.ics', 'utf8'));

        const json = JSON.stringify(cal.toJSON());
        assert.strictEqual(ical(json).toString(), string);
    });

    it('case #2', function() {
        const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'});
        cal.createEvent({
            id: '123',
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            summary: 'Sample Event',
            location: 'localhost',
            description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\nbeep boop',
            htmlDescription: '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\nbeep boop</p>'
        });

        /*jslint stupid: true */
        const string = cal.toString();
        assert.strictEqual(string, fs.readFileSync(__dirname + '/results/generate_02.ics', 'utf8'));

        const json = JSON.stringify(cal.toJSON());
        assert.strictEqual(ical(json).toString(), string);
    });

    it('case #3', function() {
        const cal = ical({domain: 'sebbo.net', method: 'add', prodId: '//sebbo.net//ical-generator.tests//EN'});
        cal.createEvent({
            id: '123',
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
            allDay: true,
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            summary: 'Sample Event',
            organizer: 'Sebastian Pekarek <mail@sebbo.net>',
            status: 'confirmed',
            categories: [{name: 'WORK'}],
            url: 'http://sebbo.net/'
        });

        /*jslint stupid: true */
        const string = cal.toString();
        assert.strictEqual(string, fs.readFileSync(__dirname + '/results/generate_03.ics', 'utf8'), 'toString');

        const json = JSON.stringify(cal.toJSON());
        assert.strictEqual(ical(json).toString(), string, 'toJSON / toString()');
    });

    it('case #4 (repeating)', function() {
        const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'});
        cal.events([
            {
                id: '1',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'repeating by month',
                repeating: {
                    freq: 'monthly',
                    exclude: new Date('Fr Oct 06 2013 23:15:00 UTC')
                }
            },
            {
                id: '2',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'repeating by day, twice',
                repeating: {
                    freq: 'DAILY',
                    count: 2
                }
            },
            {
                id: '3',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'repeating by 3 weeks, until 2014',
                repeating: {
                    freq: 'WEEKLY',
                    interval: 3,
                    until: new Date('We Jan 01 2014 00:00:00 UTC')
                }
            }
        ]);

        /*jslint stupid: true */
        const string = cal.toString();
        assert.strictEqual(string, fs.readFileSync(__dirname + '/results/generate_04.ics', 'utf8'));

        const json = JSON.stringify(cal.toJSON());
        assert.strictEqual(ical(json).toString(), string);
    });

    it('case #5 (floating)', function() {
        const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'});
        cal.createEvent({
            id: '1',
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            summary: 'floating',
            floating: true
        });

        /*jslint stupid: true */
        const string = cal.toString();
        assert.strictEqual(string, fs.readFileSync(__dirname + '/results/generate_05.ics', 'utf8'));

        const json = JSON.stringify(cal.toJSON());
        assert.strictEqual(ical(json).toString(), string);
    });

    it('case #6 (attendee with simple delegation and alarm)', function() {
        const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN', method: 'publish'});
        cal.createEvent({
            id: '123',
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            allDay: true,
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            summary: 'Sample Event',
            organizer: 'Sebastian Pekarek <mail@sebbo.net>',
            attendees: [
                {
                    name: 'Matt',
                    email: 'matt@example.com',
                    delegatesTo: {
                        name: 'John',
                        email: 'john@example.com',
                        status: 'accepted'
                    }
                }
            ],
            alarms: [
                {
                    type: 'display',
                    trigger: 60 * 10,
                    repeat: 2,
                    interval: 60
                },
                {
                    type: 'display',
                    trigger: 60 * 60,
                    description: 'I\'m a reminder :)'
                }
            ],
            status: 'confirmed',
            url: 'http://sebbo.net/'
        });

        /*jslint stupid: true */
        const string = cal.toString();
        assert.strictEqual(string, fs.readFileSync(__dirname + '/results/generate_06.ics', 'utf8'));

        const json = JSON.stringify(cal.toJSON());
        assert.strictEqual(ical(json).toString(), string);
    });

    it('case #7 (repeating: byDay, byMonth, byMonthDay)', function() {
        const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'});
        cal.events([
            {
                id: '1',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'repeating by month',
                repeating: {
                    freq: 'monthly',
                    byMonth: [1, 4, 7, 10]
                }
            },
            {
                id: '2',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'repeating on Mo/We/Fr, twice',
                repeating: {
                    freq: 'DAILY',
                    count: 2,
                    byDay: ['mo', 'we', 'fr']
                }
            },
            {
                id: '3',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'repeating on 1st and 15th',
                repeating: {
                    freq: 'DAILY',
                    interval: 1,
                    byMonthDay: [1, 15]
                }
            }
        ]);

        /*jslint stupid: true */
        const string = cal.toString();
        assert.strictEqual(string, fs.readFileSync(__dirname + '/results/generate_07.ics', 'utf8'));

        const json = JSON.stringify(cal.toJSON());
        assert.strictEqual(ical(json).toString(), string);
    });

    it('case #8', function() {
        const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'});
        cal.createEvent({
            id: '123',
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            created: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            lastModified: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            summary: 'Simple Event',
            attendees: [{
                type: 'individual',
                role: 'req-participant',
                status: 'needs-action',
                email: 'mail@example.com',
                rsvp: 'true'
            }]
        });

        /*jslint stupid: true */
        const string = cal.toString();
        assert.strictEqual(string, fs.readFileSync(__dirname + '/results/generate_08.ics', 'utf8'));

        const json = JSON.stringify(cal.toJSON());
        assert.strictEqual(ical(json).toString(), string);
    });

    it('case #9 (organizer with mailto)', function() {
        const cal = ical({domain: 'sebbo.net', method: 'request', prodId: '//sebbo.net//ical-generator.tests//EN'});
        cal.createEvent({
            id: '123',
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            summary: 'Sample Event',
            organizer: {
                name: 'Sebastian Pekarek',
                email: 'mail@sebbo.net',
                mailto: 'mail2@example2.com'
            },
            attendees: [{
                type: 'individual',
                role: 'req-participant',
                status: 'needs-action',
                email: 'mail@example.com',
                rsvp: 'true'
            }]
        });

        /*jslint stupid: true */
        const string = cal.toString();
        assert.strictEqual(string, fs.readFileSync(__dirname + '/results/generate_09.ics', 'utf8'), 'toString');

        const json = JSON.stringify(cal.toJSON());
        assert.strictEqual(ical(json).toString(), string, 'toJSON / toString()');
    });
});
