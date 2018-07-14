'use strict';

const assert = require('assert');
const moment = require('moment-timezone');

const ICalCalendar = require('../src/calendar');
const ICalEvent = require('../src/event');
const ICalAlarm = require('../src/alarm');

describe('ical-generator Alarm', function () {
    describe('constructor()', function () {
        it('shouldn\'t work without event reference', function () {
            assert.throws(function () {
                new ICalAlarm({type: 'display'});
            }, /`event`/);
        });

        it('should ignore unknown data attributes', function () {
            const a = new ICalAlarm({
                unknown: true,
                type: 'display'
            }, new ICalEvent(null, new ICalCalendar()));

            assert.equal(a.type(), 'display');
        });
    });

    describe('type()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepEqual(a, a.type(null));
            assert.deepEqual(a, a.type('display'));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.equal(a.type(), null);

            a.type('display');
            assert.equal(a.type(), 'display');

            a.type(null);
            assert.equal(a.type(), null);
        });

        it('should throw error when type not allowed', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a.type('BANANA');
            }, /`type`/);
        });

        it('should change something', function () {
            const a = new ICalAlarm({type: 'display', trigger: 60 * 10}, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('ACTION:DISPLAY') > -1);
        });
    });

    describe('trigger()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepEqual(a, a.trigger(null));
            assert.deepEqual(a, a.trigger(60 * 10));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            const now = new Date();

            assert.equal(a.trigger(), null);
            assert.equal(a.triggerAfter(), null);

            a.trigger(300);
            assert.equal(a.trigger(), 300);
            assert.equal(a.triggerAfter(), -300);

            // Date
            a.trigger(now);
            assert.ok(a.trigger().isSame(now));

            // Null
            a.trigger(null);
            assert.equal(a.trigger(), null);
            assert.equal(a.triggerAfter(), null);
        });

        it('should throw error when trigger not allowed', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a.trigger(Infinity);
            }, /`trigger`/);
            assert.throws(function () {
                a.trigger('hi');
            }, /`trigger`/);
            assert.throws(function () {
                a.trigger(true);
            }, /`trigger`/);
        });

        it('setter should work with null', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            a.trigger(60 * 10);
            a.trigger(null);
            assert.equal(a._data.trigger, null);
        });

        it('setter should work with date', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            a.trigger(new Date());
            assert.ok(moment.isMoment(a._data.trigger));
        });

        it('setter should work with moment instance', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            a.trigger(moment());
            assert.ok(moment.isMoment(a._data.trigger));
        });

        it('setter should work with moment.duration', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            a.trigger(moment.duration(2, 'minutes'));
            assert.equal(a._data.trigger, -120);
        });

        it('setter should work with number', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            a.trigger(2 * 60);
            assert.equal(a._data.trigger, -120);
        });

        it('should change something', function () {
            const trigger = moment('2015-02-01T13:38:45.000Z');

            const a = new ICalAlarm({type: 'display', trigger: 60 * 10}, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('TRIGGER:-PT10M') > -1);

            a.trigger(trigger);
            assert.ok(a._generate().indexOf('TRIGGER;VALUE=DATE-TIME:20150201T133845Z') > -1);
        });
    });

    describe('triggerAfter()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepEqual(a, a.triggerAfter(60 * 10));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar())).triggerAfter(300);
            assert.equal(a.triggerAfter(), 300);
            assert.equal(a.trigger(), -300);
        });

        it('setter should work with moment.duration', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            a.triggerAfter(moment.duration(2, 'minutes'));
            assert.equal(a._data.trigger, -120);
        });

        it('setter should work with number', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            a.triggerAfter(120);
            assert.equal(a._data.trigger, 120);
        });

        it('setter should throw error when trigger not allowed', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a.triggerAfter(Infinity);
            }, /`trigger`/);
            assert.throws(function () {
                a.triggerAfter('hi');
            }, /`trigger`/);
            assert.throws(function () {
                a.triggerAfter(true);
            }, /`trigger`/);
        });

        it('should change something', function () {
            const trigger = moment('20150201T133845Z');

            const a = new ICalAlarm({type: 'display', triggerAfter: 60 * 10}, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('TRIGGER;RELATED=END:PT10M') > -1);

            a.triggerAfter(trigger);
            assert.ok(a._generate().indexOf('TRIGGER;VALUE=DATE-TIME:20150201T133845Z') > -1);
        });
    });

    describe('triggerBefore()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepEqual(a, a.triggerBefore(null));
            assert.deepEqual(a, a.triggerBefore(60 * 10));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            const now = new Date();

            assert.equal(a.triggerBefore(), null);

            a.trigger(300);
            assert.equal(a.triggerBefore(), 300);

            // Date
            a.trigger(now);
            assert.ok(a.triggerBefore().isSame(now));

            // Null
            a.trigger(null);
            assert.equal(a.triggerBefore(), null);
        });

        it('should throw error when trigger not allowed', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a.triggerBefore(Infinity);
            }, /`trigger`/);
            assert.throws(function () {
                a.triggerBefore('hi');
            }, /`trigger`/);
            assert.throws(function () {
                a.triggerBefore(true);
            }, /`trigger`/);
        });

        it('setter should work with null', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            a.triggerBefore(60 * 10);
            a.triggerBefore(null);
            assert.equal(a._data.trigger, null);
        });

        it('setter should work with date', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            a.triggerBefore(new Date());
            assert.ok(moment.isMoment(a._data.trigger));
        });

        it('setter should work with moment instance', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            a.triggerBefore(moment());
            assert.ok(moment.isMoment(a._data.trigger));
        });

        it('setter should work with moment.duration', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            a.triggerBefore(moment.duration(2, 'minutes'));
            assert.equal(a._data.trigger, -120);
        });

        it('setter should work with number', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            a.triggerBefore(2 * 60);
            assert.equal(a._data.trigger, -120);
        });

        it('should change something', function () {
            const trigger = moment('2015-02-01T13:38:45.000Z');

            const a = new ICalAlarm({type: 'display', triggerBefore: 60 * 10}, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('TRIGGER:-PT10M') > -1);

            a.triggerBefore(trigger);
            assert.ok(a._generate().indexOf('TRIGGER;VALUE=DATE-TIME:20150201T133845Z') > -1);
        });
    });

    describe('repeat()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepEqual(a, a.repeat(null));
            assert.deepEqual(a, a.repeat(4));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.equal(a.repeat(), null);
            a.repeat(100);
            assert.equal(a.repeat(), 100);
            a.repeat(null);
            assert.equal(a.repeat(), null);
        });

        it('should throw error if repeat not allowed', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a.repeat(Infinity);
            }, /`repeat`/);
            assert.throws(function () {
                a.repeat('hi');
            }, /`repeat`/);
            assert.throws(function () {
                a.repeat(true);
            }, /`repeat`/);
        });

        it('should change something', function () {
            const a = new ICalAlarm({
                type: 'display',
                trigger: 300,
                repeat: 42,
                interval: 60
            }, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('REPEAT:42') > -1);
        });
    });

    describe('interval()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepEqual(a, a.interval(null));
            assert.deepEqual(a, a.interval(60));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.equal(a.interval(), null);
            a.interval(30);
            assert.equal(a.interval(), 30);
            a.interval(null);
            assert.equal(a.interval(), null);
        });

        it('should throw error if repeat not allowed', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a.interval(Infinity);
            }, /`interval`/);
            assert.throws(function () {
                a.interval('hi');
            }, /`interval`/);
            assert.throws(function () {
                a.interval(true);
            }, /`interval`/);
        });

        it('should change something', function () {
            const a = new ICalAlarm({
                type: 'display',
                trigger: 300,
                repeat: 42,
                interval: 90
            }, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('DURATION:PT1M30S') > -1);
        });
    });

    describe('attach()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepEqual(a, a.attach(null));
            assert.deepEqual(a, a.attach('https://sebbo.net/beep.aud'));
        });

        it('getter should return value', function () {
            const t = {uri: 'https://example.com/alarm.aud', mime: 'audio/basic'};
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));

            assert.equal(a.attach(), null);

            a.attach(t);
            assert.deepEqual(a.attach(), t);

            a.attach('https://www.example.com/beep.aud');
            assert.deepEqual(a.attach(), {
                uri: 'https://www.example.com/beep.aud',
                mime: null
            });

            a.attach({
                uri: 'https://www.example.com/beep.aud'
            });
            assert.deepEqual(a.attach(), {
                uri: 'https://www.example.com/beep.aud',
                mime: null
            });

            a.attach(null);
            assert.equal(a.attach(), null);
        });

        it('should throw error withour uri', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a.attach({mime: 'audio/basic'});
            }, /`attach.uri`/);
        });

        it('should throw error when unknown format', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a.attach(Infinity);
            }, /`attach`/);
        });

        it('should change something', function () {
            const a = new ICalAlarm({
                type: 'audio',
                trigger: 300
            }, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('\r\nATTACH;VALUE=URI:Basso') > -1);

            a.attach('https://example.com/beep.aud');
            assert.ok(a._generate().indexOf('\r\nATTACH;VALUE=URI:https://example.com/beep.aud') > -1);

            a.attach({
                uri: 'https://example.com/beep.aud',
                mime: 'audio/basic'
            });
            assert.ok(a._generate().indexOf('\r\nATTACH;FMTTYPE=audio/basic:https://example.com/beep.aud') > -1);
        });
    });

    describe('description()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepEqual(a, a.description(null));
            assert.deepEqual(a, a.description('Hey Ho!'));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepEqual(a.description(), null);
            a.description('blablabla');
            assert.deepEqual(a.description(), 'blablabla');
            a.description(null);
            assert.deepEqual(a.description(), null);
        });

        it('should change something', function () {
            const a = new ICalAlarm({
                type: 'display',
                trigger: 300,
                description: 'Huibuh!'
            }, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('\r\nDESCRIPTION:Huibuh') > -1);
        });

        it('should fallback to event summary', function () {
            const a = new ICalAlarm({
                type: 'display',
                trigger: 300
            }, new ICalEvent({
                summary: 'Example Event'
            }, new ICalCalendar()));

            assert.ok(a._generate().indexOf('\r\nDESCRIPTION:Example Event') > -1);
        });
    });

    describe('toJSON()', function () {
        it('should work', function() {
            const a = new ICalAlarm(null, new ICalEvent(null, new ICalCalendar()));
            a.type('display');
            a.triggerBefore(120);

            assert.deepEqual(a.toJSON(), {
                type: 'display',
                trigger: 120
            });
        });
    });

    describe('generate()', function () {
        it('shoult throw an error without type', function () {
            const a = new ICalAlarm({trigger: 300}, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a._generate();
            }, /`type`/);
        });

        it('shoult throw an error without trigger', function () {
            const a = new ICalAlarm({type: 'display'}, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a._generate();
            }, /`trigger`/);
        });

        it('shoult throw an error if repeat is set but interval isn\'t', function () {
            const a = new ICalAlarm({type: 'display', trigger: 300, repeat: 4}, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a._generate();
            }, /for `interval`/);
        });

        it('shoult throw an error if interval is set but repeat isn\'t', function () {
            const a = new ICalAlarm({
                type: 'display',
                trigger: 300,
                interval: 60
            }, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a._generate();
            }, /for `repeat`/);
        });
    });
});