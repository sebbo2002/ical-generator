/**
 * Check if stubs are working
 */
import {
    ICalDayJsStub,
    ICalLuxonDateTimeStub,
    ICalMomentStub,
    ICalMomentTimezoneStub, ICalRRuleStub
} from '../src/types.js';

import assert from 'assert';
import dayjs from 'dayjs';
import { DateTime } from 'luxon';
import moment from 'moment';
import momentTz from 'moment-timezone';
import rrule from 'rrule';

const dayJsTest = dayjs() satisfies ICalDayJsStub;
const luxonTest = DateTime.now() satisfies ICalLuxonDateTimeStub;
const momentTest = moment() satisfies ICalMomentStub;
const momentTimezoneTest = momentTz() satisfies ICalMomentTimezoneStub;

const RRule = rrule.RRule;
const rruleTest = new RRule({ freq: RRule.WEEKLY, dtstart: new Date() }) satisfies ICalRRuleStub;

describe('ical-generator Types', function () {
    it('stubs should be compatible with third party libraries', function () {
        assert.ok(dayJsTest, 'day.js stub should be compatible');
        assert.ok(luxonTest, 'luxon stub should be compatible');
        assert.ok(momentTest, 'moment stub should be compatible');
        assert.ok(momentTimezoneTest, 'moment-timezone stub should be compatible');
        assert.ok(rruleTest, 'rrule stub should be compatible');
    });
});