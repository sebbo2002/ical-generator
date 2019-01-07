'use strict';

const assert = require('assert');
const ical = require(__dirname + '/../src');

describe('ical-generator Index', function() {
    it('should be a function', function() {
        assert.strictEqual(typeof ical, 'function');
    });

    it('should return a ICalCalendar', function() {
        const ICalCalendar = require('../src/calendar');
        assert.ok(ical() instanceof ICalCalendar);
    });
});
