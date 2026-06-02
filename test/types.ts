/**
 * Check if stubs are working
 */

import { TZDate } from '@date-fns/tz';
import assert from 'assert';
import dayjs from 'dayjs';
import { DateTime } from 'luxon';
import moment from 'moment';
import momentTz from 'moment-timezone';
import rrule from 'rrule';
import { Temporal } from 'temporal-polyfill';

import {
    type ICalAttendeeData,
    type ICalAttendeeJSONData,
    type ICalCalendarData,
    type ICalCalendarJSONData,
    type ICalCategoryData,
    type ICalCategoryJSONData,
    type ICalDayJsStub,
    type ICalEventJSONData,
    type ICalLuxonDateTimeStub,
    type ICalMomentStub,
    type ICalMomentTimezoneStub,
    type ICalRRuleStub,
    type ICalTemporalInstantStub,
    type ICalTemporalPlainDateStub,
    type ICalTZDateStub,
} from '../src/index.js';

const dayJsTest = dayjs() satisfies ICalDayJsStub;
const luxonTest = DateTime.now() satisfies ICalLuxonDateTimeStub;
const momentTest = moment() satisfies ICalMomentStub;
const momentTimezoneTest = momentTz() satisfies ICalMomentTimezoneStub;
const dateFnsTzTest = new TZDate() satisfies ICalTZDateStub;
const temporalInstantTest = Temporal.Instant.from(
    '2024-01-01T00:00:00Z',
) satisfies ICalTemporalInstantStub;
const temporalPlainDateTest = Temporal.PlainDate.from(
    '2024-01-01',
) satisfies ICalTemporalPlainDateStub;
const temporalPlainDateTimeTest = Temporal.PlainDateTime.from(
    '2024-01-01T00:00:00',
) satisfies ICalTemporalPlainDateStub;
const temporalZonedDateTimeTest = Temporal.ZonedDateTime.from(
    '2024-01-01T00:00:00+00:00[UTC]',
) satisfies ICalTemporalPlainDateStub;

const RRule = rrule.RRule;
const rruleTest = new RRule({
    dtstart: new Date(),
    freq: RRule.WEEKLY,
}) satisfies ICalRRuleStub;

const attendeeJson = {} as ICalAttendeeJSONData satisfies ICalAttendeeData;
const calendarJson = {} as ICalCalendarJSONData satisfies ICalCalendarData;
const categoryJson = {} as ICalCategoryJSONData satisfies ICalCategoryData;
const eventJson = {} as ICalEventJSONData satisfies ICalEventJSONData;

describe('ical-generator Types', function () {
    it('stubs should be compatible with third party libraries', function () {
        assert.ok(dayJsTest, 'day.js stub should be compatible');
        assert.ok(luxonTest, 'luxon stub should be compatible');
        assert.ok(momentTest, 'moment stub should be compatible');
        assert.ok(
            momentTimezoneTest,
            'moment-timezone stub should be compatible',
        );
        assert.ok(rruleTest, 'rrule stub should be compatible');
        assert.ok(dateFnsTzTest, 'date-fns/tz stub should be compatible');
        assert.ok(
            temporalInstantTest,
            'Temporal.Instant stub should be compatible',
        );
        assert.ok(
            temporalPlainDateTest,
            'Temporal.PlainDate stub should be compatible',
        );
        assert.ok(
            temporalPlainDateTimeTest,
            'Temporal.PlainDateTime stub should be compatible',
        );
        assert.ok(
            temporalZonedDateTimeTest,
            'Temporal.ZonedDateTime stub should be compatible',
        );
    });
    it('calendar data should be compatible with calendar json data', function () {
        assert.ok(attendeeJson, 'attendee json data should be compatible');
        assert.ok(calendarJson, 'calendar json data should be compatible');
        assert.ok(categoryJson, 'category json data should be compatible');
        assert.ok(eventJson, 'event json data should be compatible');
    });
});
