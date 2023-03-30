'use strict';

import assert from 'assert';
import ical, {
    ICalAlarm,
    ICalAlarmType,
    ICalAttendee,
    ICalAttendeeType,
    ICalAttendeeRole,
    ICalAttendeeStatus,
    ICalCategory,
    ICalCalendar,
    ICalCalendarMethod,
    ICalEvent,
    ICalEventStatus,
    ICalEventBusyStatus,
    ICalEventTransparency,
    ICalEventRepeatingFreq,
    ICalWeekday,
    formatDate,
    formatDateTZ,
    escape,
    foldLines
} from '../src/index.js';

describe('ical-generator Index', function() {
    describe('default', function () {
        it('should be a function', function() {
            assert.strictEqual(typeof ical, 'function');
        });
        it('should return a ICalCalendar', function() {
            assert.ok(ical() instanceof ICalCalendar);
        });
    });

    describe('Alarm', function () {
        it('should export ICalAlarm', function () {
            assert.ok(ICalAlarm);
        });
        it('should export ICalAlarmType', function () {
            assert.ok(ICalAlarmType);
        });
    });

    describe('Attendee', function () {
        it('should export ICalAttendee', function () {
            assert.ok(ICalAttendee);
        });
        it('should export ICalAttendeeType', function () {
            assert.ok(ICalAttendeeType);
        });
        it('should export ICalAttendeeRole', function () {
            assert.ok(ICalAttendeeRole);
        });
        it('should export ICalAttendeeStatus', function () {
            assert.ok(ICalAttendeeStatus);
        });
    });

    describe('Calendar', function () {
        it('should export ICalCalendar', function() {
            assert.ok(ICalCalendar);
        });

        it('should export ICalCalendarMethod', function() {
            assert.ok(ICalCalendarMethod);
        });
    });

    describe('Category', function () {
        it('should export ICalCategory', function () {
            assert.ok(ICalCategory);
        });
    });

    describe('Event', function () {
        it('should export ICalEvent', function() {
            assert.ok(ICalEvent);
        });
        it('should export ICalEventStatus', function() {
            assert.ok(ICalEventStatus);
        });
        it('should export ICalEventBusyStatus', function() {
            assert.ok(ICalEventBusyStatus);
        });
        it('should export ICalEventTransparency', function() {
            assert.ok(ICalEventTransparency);
        });
    });

    describe('Type', function () {
        it('should export ICalEventRepeatingFreq', function () {
            assert.ok(ICalEventRepeatingFreq);
        });
        it('should export ICalWeekday', function () {
            assert.ok(ICalWeekday);
        });
    });

    describe('Tools', function () {
        it('should export formatDate', function () {
            assert.ok(typeof formatDate === 'function');
        });
        it('should export formatDateTZ', function () {
            assert.ok(typeof formatDateTZ === 'function');
        });
        it('should export escape', function () {
            assert.ok(typeof escape === 'function');
        });
        it('should export foldLines', function () {
            assert.ok(typeof foldLines === 'function');
        });
    });
});
