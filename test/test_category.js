'use strict';

const assert = require('assert');

const ICalCalendar = require('../src/calendar');
const ICalEvent = require('../src/event');
const ICalCategory = require('../src/category');

describe('ical-generator Category', function () {
    describe('constructor()', function () {
        it('shouldn\'t work without event reference', function () {
            assert.throws(function () {
                new ICalCategory({name: 'FOO'});
            }, /`event`/);
        });

        it('should ignore unknown data attributes', function () {
            const a = new ICalCategory({
                unknown: true,
                name: 'FOO'
            }, new ICalEvent(null, new ICalCalendar()));

            assert.strictEqual(a.name(), 'FOO');
        });
    });

    describe('name()', function () {
        it('setter should return this', function () {
            const c = new ICalCategory(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepStrictEqual(c, c.name(null));
            assert.deepStrictEqual(c, c.name('FOO'));
        });

        it('getter should return value', function () {
            const c = new ICalCategory(null, new ICalEvent(null, new ICalCalendar()));
            assert.strictEqual(c.name(), null);

            c.name('HELLO-WORLD');
            assert.strictEqual(c.name(), 'HELLO-WORLD');

            c.name(null);
            assert.strictEqual(c.name(), null);
        });

        it('should change something', function () {
            const c = new ICalCategory({name: 'BANANA'}, new ICalEvent(null, new ICalCalendar()));
            assert.ok(c._generate().indexOf('BANANA') > -1);
        });
    });

    describe('toJSON()', function () {
        it('should contain valued previously set', function () {
            const c = new ICalCategory({name: 'FOOBAR'}, new ICalEvent(null, new ICalCalendar()));
            assert.deepStrictEqual(c.toJSON(), {name: 'FOOBAR'});
        });
    });

    describe('generate()', function () {
        it('shoult throw an error without name', function () {
            const c = new ICalCategory({}, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                c._generate();
            }, /`name`/);
        });
    });
});
