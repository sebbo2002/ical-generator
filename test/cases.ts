'use strict';

import assert from 'assert';
import {promises as fs} from 'fs';
import ical from '../src';
import {ICalCalendarMethod} from '../src/calendar';
import {ICalEventStatus} from '../src/event';
import {ICalEventRepeatingFreq, ICalWeekday} from '../src/types';
import {ICalAttendeeRole, ICalAttendeeStatus, ICalAttendeeType} from '../src/attendee';
import {ICalAlarmType} from '../src/alarm';

describe('ical-generator Cases', function () {
    it('case #1', async function () {
        const cal = ical({prodId: '//sebbo.net//ical-generator.tests//EN'});
        cal.createEvent({
            id: '123',
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            created: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            lastModified: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            summary: 'Simple Event'
        });

        const string = cal.toString();
        assert.strictEqual(string, await fs.readFile(__dirname + '/results/generate_01.ics', 'utf8'));

        assert.strictEqual(ical(cal.toJSON()).toString(), string);
    });

    it('case #2', async function () {
        const cal = ical({prodId: '//sebbo.net//ical-generator.tests//EN'});
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

        const string = cal.toString();
        assert.strictEqual(string, await fs.readFile(__dirname + '/results/generate_02.ics', 'utf8'));
        assert.strictEqual(ical(cal.toJSON()).toString(), string);
    });

    it('case #3', async function () {
        const cal = ical({
            method: ICalCalendarMethod.ADD,
            prodId: '//sebbo.net//ical-generator.tests//EN'
        });
        cal.createEvent({
            id: '123',
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
            allDay: true,
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            summary: 'Sample Event',
            location: {
                title: 'Apple Store Kurfürstendamm',
                address: 'Kurfürstendamm 26, 10719 Berlin, Deutschland',
                radius: 141.1751386318387,
                geo: {lat: 52.503630, lon: 13.328650}
            },
            organizer: 'Sebastian Pekarek <mail@sebbo.net>',
            status: ICalEventStatus.CONFIRMED,
            categories: [{name: 'WORK'}],
            url: 'http://sebbo.net/'
        });

        const string = cal.toString();
        assert.strictEqual(string, await fs.readFile(__dirname + '/results/generate_03.ics', 'utf8'), 'toString');
        assert.strictEqual(ical(cal.toJSON()).toString(), string, 'toJSON / toString()');
    });

    it('case #4 (repeating)', async function () {
        const cal = ical({prodId: '//sebbo.net//ical-generator.tests//EN'});
        cal.events([
            {
                id: '1',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'repeating by month',
                repeating: {
                    freq: ICalEventRepeatingFreq.MONTHLY,
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
                    freq: ICalEventRepeatingFreq.DAILY,
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
                    freq: ICalEventRepeatingFreq.WEEKLY,
                    interval: 3,
                    until: new Date('We Jan 01 2014 00:00:00 UTC')
                }
            }
        ]);

        const string = cal.toString();
        assert.strictEqual(string, await fs.readFile(__dirname + '/results/generate_04.ics', 'utf8'));
        assert.strictEqual(ical(cal.toJSON()).toString(), string);
    });

    it('case #5 (floating)', async function () {
        const cal = ical({prodId: '//sebbo.net//ical-generator.tests//EN'});
        cal.createEvent({
            id: '1',
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            summary: 'floating',
            floating: true
        });

        const string = cal.toString();
        assert.strictEqual(string, await fs.readFile(__dirname + '/results/generate_05.ics', 'utf8'));
        assert.strictEqual(ical(cal.toJSON()).toString(), string);
    });

    it('case #6 (attendee with simple delegation and alarm)', async function () {
        const cal = ical({prodId: '//sebbo.net//ical-generator.tests//EN', method: ICalCalendarMethod.PUBLISH});
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
                        status: ICalAttendeeStatus.ACCEPTED
                    }
                }
            ],
            alarms: [
                {
                    type: ICalAlarmType.display,
                    trigger: 60 * 10,
                    repeat: 2,
                    interval: 60
                },
                {
                    type: ICalAlarmType.display,
                    trigger: 60 * 60,
                    description: 'I\'m a reminder :)'
                }
            ],
            status: ICalEventStatus.CONFIRMED,
            url: 'http://sebbo.net/'
        });

        const string = cal.toString();
        assert.strictEqual(string, await fs.readFile(__dirname + '/results/generate_06.ics', 'utf8'));
        assert.strictEqual(ical(cal.toJSON()).toString(), string);
    });

    it('case #7 (repeating: byDay, byMonth, byMonthDay)', async function () {
        const cal = ical({prodId: '//sebbo.net//ical-generator.tests//EN'});
        cal.events([
            {
                id: '1',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'repeating by month',
                repeating: {
                    freq: ICalEventRepeatingFreq.MONTHLY,
                    byMonth: [1, 4, 7, 10]
                }
            },
            {
                id: '2',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'repeating on Mo/We/Fr, twice',
                repeating: {
                    freq: ICalEventRepeatingFreq.DAILY,
                    count: 2,
                    byDay: [ICalWeekday.MO, ICalWeekday.WE, ICalWeekday.FR]
                }
            },
            {
                id: '3',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'repeating on 1st and 15th',
                repeating: {
                    freq: ICalEventRepeatingFreq.DAILY,
                    interval: 1,
                    byMonthDay: [1, 15]
                }
            }
        ]);

        const string = cal.toString();
        assert.strictEqual(string, await fs.readFile(__dirname + '/results/generate_07.ics', 'utf8'));
        assert.strictEqual(ical(cal.toJSON()).toString(), string);
    });

    it('case #8', async function () {
        const cal = ical({prodId: '//sebbo.net//ical-generator.tests//EN'});
        cal.createEvent({
            id: '123',
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            created: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            lastModified: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            summary: 'Simple Event',
            attendees: [{
                type: ICalAttendeeType.INDIVIDUAL,
                role: ICalAttendeeRole.REQ,
                status: ICalAttendeeStatus.NEEDSACTION,
                email: 'mail@example.com',
                rsvp: true
            }]
        });

        const string = cal.toString();
        assert.strictEqual(string, await fs.readFile(__dirname + '/results/generate_08.ics', 'utf8'));
        assert.strictEqual(ical(cal.toJSON()).toString(), string);
    });

    it('case #9 (organizer with mailto)', async function () {
        const cal = ical({method: ICalCalendarMethod.REQUEST, prodId: '//sebbo.net//ical-generator.tests//EN'});
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
                type: ICalAttendeeType.INDIVIDUAL,
                role: ICalAttendeeRole.REQ,
                status: ICalAttendeeStatus.NEEDSACTION,
                email: 'mail@example.com',
                rsvp: true
            }]
        });

        const string = cal.toString();
        assert.strictEqual(string, await fs.readFile(__dirname + '/results/generate_09.ics', 'utf8'), 'toString');
        assert.strictEqual(ical(cal.toJSON()).toString(), string, 'toJSON / toString()');
    });
});
