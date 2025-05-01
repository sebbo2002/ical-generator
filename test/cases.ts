'use strict';

import { getVtimezoneComponent } from '@touch4it/ical-timezones';
import assert from 'assert';
import { promises as fs } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ICalAlarmType } from '../src/alarm.js';
import {
    ICalAttendeeRole,
    ICalAttendeeStatus,
    ICalAttendeeType,
} from '../src/attendee.js';
import { ICalCalendarMethod } from '../src/calendar.js';
import { ICalEventStatus } from '../src/event.js';
import ical, { ICalEventTransparency } from '../src/index.js';
import { ICalEventRepeatingFreq, ICalWeekday } from '../src/types.js';

describe('ical-generator Cases', function () {
    const resultDir = join(dirname(fileURLToPath(import.meta.url)), 'results');
    it('case #1', async function () {
        const cal = ical({ prodId: '//sebbo.net//ical-generator.tests//EN' });
        cal.createEvent({
            created: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
            id: '123',
            lastModified: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            summary: 'Simple Event',
        });

        const string = cal.toString();
        assert.strictEqual(
            string,
            await fs.readFile(resultDir + '/generate_01.ics', 'utf8'),
        );

        assert.strictEqual(ical(cal.toJSON()).toString(), string);
    });

    it('case #2', async function () {
        const cal = ical({ prodId: '//sebbo.net//ical-generator.tests//EN' });
        cal.createEvent({
            description: {
                html: '<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\nbeep boop</p>',
                plain: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\nbeep boop',
            },
            end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
            id: '123',
            location: 'localhost',
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            summary: 'Sample Event',
            transparency: ICalEventTransparency.OPAQUE,
        });

        const string = cal.toString();
        assert.strictEqual(
            string,
            await fs.readFile(resultDir + '/generate_02.ics', 'utf8'),
        );
        assert.strictEqual(ical(cal.toJSON()).toString(), string);
    });

    it('case #3', async function () {
        const cal = ical({
            method: ICalCalendarMethod.ADD,
            prodId: '//sebbo.net//ical-generator.tests//EN',
        });
        cal.createEvent({
            allDay: true,
            attachments: ['https://files.sebbo.net/calendar/attachments/foo'],
            categories: [{ name: 'WORK' }],
            end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
            id: '123',
            location: {
                address: 'Kurfürstendamm 26, 10719 Berlin, Deutschland',
                geo: { lat: 52.50363, lon: 13.32865 },
                radius: 141.1751386318387,
                title: 'Apple Store Kurfürstendamm',
            },
            organizer: 'Sebastian Pekarek <mail@sebbo.net>',
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            status: ICalEventStatus.CONFIRMED,
            summary: 'Sample Event',
            url: 'http://sebbo.net/',
        });

        const string = cal.toString();
        assert.strictEqual(
            string,
            await fs.readFile(resultDir + '/generate_03.ics', 'utf8'),
            'toString',
        );
        assert.strictEqual(
            ical(cal.toJSON()).toString(),
            string,
            'toJSON / toString()',
        );
    });

    it('case #4 (repeating)', async function () {
        const cal = ical({ prodId: '//sebbo.net//ical-generator.tests//EN' });
        cal.timezone({ generator: getVtimezoneComponent, name: null });
        cal.events([
            {
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                id: '1',
                repeating: {
                    exclude: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                    freq: ICalEventRepeatingFreq.MONTHLY,
                },
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                summary: 'repeating by month',
            },
            {
                end: new Date('Fr Oct 06 2013 23:15:00'),
                id: '2',
                repeating: {
                    count: 2,
                    freq: ICalEventRepeatingFreq.DAILY,
                },
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                start: new Date('Fr Oct 04 2013 22:39:30'),
                summary: 'repeating by day, twice',
                timezone: 'Europe/Berlin',
            },
            {
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                id: '3',
                repeating: {
                    freq: ICalEventRepeatingFreq.WEEKLY,
                    interval: 3,
                    until: new Date('We Jan 01 2014 00:00:00 UTC'),
                },
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                summary: 'repeating by 3 weeks, until 2014',
            },
        ]);

        assert.strictEqual(
            cal.toString(),
            await fs.readFile(resultDir + '/generate_04.ics', 'utf8'),
            'first check',
        );

        // Wount be same, as reference to VTimezone generator is not exported
        // assert.strictEqual(ical(cal.toJSON()).toString(), string);

        cal.timezone(null);
        assert.strictEqual(
            ical(cal.toJSON()).toString(),
            cal.toString(),
            'second check',
        );
    });

    it('case #5 (floating)', async function () {
        const cal = ical({ prodId: '//sebbo.net//ical-generator.tests//EN' });
        cal.createEvent({
            end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
            floating: true,
            id: '1',
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            summary: 'floating',
        });

        const string = cal.toString();
        assert.strictEqual(
            string,
            await fs.readFile(resultDir + '/generate_05.ics', 'utf8'),
        );
        assert.strictEqual(ical(cal.toJSON()).toString(), string);
    });

    it('case #6 (attendee with simple delegation and alarm)', async function () {
        const cal = ical({
            method: ICalCalendarMethod.PUBLISH,
            prodId: '//sebbo.net//ical-generator.tests//EN',
        });
        cal.createEvent({
            alarms: [
                {
                    repeat: {
                        interval: 60,
                        times: 2,
                    },
                    trigger: 60 * 10,
                    type: ICalAlarmType.display,
                },
                {
                    description: "I'm a reminder :)",
                    trigger: 60 * 60,
                    type: ICalAlarmType.display,
                },
            ],
            allDay: true,
            attendees: [
                {
                    delegatesTo: {
                        email: 'john@example.com',
                        name: 'John',
                        status: ICalAttendeeStatus.ACCEPTED,
                    },
                    email: 'matt@example.com',
                    name: 'Smith, Matt; ("Sales")',
                },
            ],
            id: '123',
            organizer: 'Sebastian Pekarek <mail@sebbo.net>',
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            status: ICalEventStatus.CONFIRMED,
            summary: 'Sample Event',
            url: 'http://sebbo.net/',
        });

        const string = cal.toString();
        assert.strictEqual(
            string,
            await fs.readFile(resultDir + '/generate_06.ics', 'utf8'),
        );
        assert.strictEqual(ical(cal.toJSON()).toString(), string);
    });

    it('case #7 (repeating: byDay, byMonth, byMonthDay)', async function () {
        const cal = ical({ prodId: '//sebbo.net//ical-generator.tests//EN' });
        cal.events([
            {
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                id: '1',
                repeating: {
                    byMonth: [1, 4, 7, 10],
                    freq: ICalEventRepeatingFreq.MONTHLY,
                },
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                summary: 'repeating by month',
            },
            {
                id: '2',
                repeating: {
                    byDay: [ICalWeekday.MO, ICalWeekday.WE, ICalWeekday.FR],
                    count: 2,
                    freq: ICalEventRepeatingFreq.DAILY,
                },
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                summary: 'repeating on Mo/We/Fr, twice',
            },
            {
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                id: '3',
                repeating: {
                    byMonthDay: [1, 15],
                    freq: ICalEventRepeatingFreq.DAILY,
                    interval: 1,
                },
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                summary: 'repeating on 1st and 15th',
            },
        ]);

        const string = cal.toString();
        assert.strictEqual(
            string,
            await fs.readFile(resultDir + '/generate_07.ics', 'utf8'),
        );
        assert.strictEqual(ical(cal.toJSON()).toString(), string);
    });

    it('case #8', async function () {
        const cal = ical({ prodId: '//sebbo.net//ical-generator.tests//EN' });
        cal.createEvent({
            attendees: [
                {
                    email: 'mail@example.com',
                    role: ICalAttendeeRole.REQ,
                    rsvp: true,
                    status: ICalAttendeeStatus.NEEDSACTION,
                    type: ICalAttendeeType.INDIVIDUAL,
                },
            ],
            created: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
            id: '123',
            lastModified: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            summary: 'Simple Event',
        });

        const string = cal.toString();
        assert.strictEqual(
            string,
            await fs.readFile(resultDir + '/generate_08.ics', 'utf8'),
        );
        assert.strictEqual(ical(cal.toJSON()).toString(), string);
    });

    it('case #9 (organizer with mailto)', async function () {
        const cal = ical({
            method: ICalCalendarMethod.REQUEST,
            prodId: '//sebbo.net//ical-generator.tests//EN',
        });
        cal.createEvent({
            attendees: [
                {
                    email: 'mail@example.com',
                    role: ICalAttendeeRole.REQ,
                    rsvp: true,
                    status: ICalAttendeeStatus.NEEDSACTION,
                    type: ICalAttendeeType.INDIVIDUAL,
                },
            ],
            end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
            id: '123',
            organizer: {
                email: 'mail@sebbo.net',
                mailto: 'mail2@example2.com',
                name: 'Sebastian Pekarek',
            },
            stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
            start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
            summary: 'Sample Event',
        });

        const string = cal.toString();
        assert.strictEqual(
            string,
            await fs.readFile(resultDir + '/generate_09.ics', 'utf8'),
            'toString',
        );
        assert.strictEqual(
            ical(cal.toJSON()).toString(),
            string,
            'toJSON / toString()',
        );
    });
});
