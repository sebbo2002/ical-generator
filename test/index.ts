'use strict';

import assert from 'assert';
import ical from '../src';
import ICalCalendar from '../src/calendar';

describe('ical-generator Index', function() {
    it('should be a function', function() {
        assert.strictEqual(typeof ical, 'function');
    });

    it('should return a ICalCalendar', function() {
        assert.ok(ical() instanceof ICalCalendar);
    });
});
