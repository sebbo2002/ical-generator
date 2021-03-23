'use strict';

import assert from 'assert';
import moment from 'moment-timezone';

import ICalCalendar from '../src/calendar';
import ICalEvent from '../src/event';
import ICalAlarm, {ICalAlarmType} from '../src/alarm';


describe('ical-generator Alarm', function () {
    describe('constructor()', function () {
        it('shouldn\'t work without event reference', function () {
            assert.throws(function () {
                // @ts-ignore
                new ICalAlarm({type: ICalAlarmType.display}, null);
            }, /`event`/);
        });

        it('should ignore unknown data attributes', function () {
            const a = new ICalAlarm({
                // @ts-ignore
                unknown: true,
                type: ICalAlarmType.display
            }, new ICalEvent({}, new ICalCalendar()));

            assert.strictEqual(a.type(), 'display');
        });
    });

    describe('type()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.type(null));
            assert.deepStrictEqual(a, a.type(ICalAlarmType.display));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.strictEqual(a.type(), null);

            a.type(ICalAlarmType.display);
            assert.strictEqual(a.type(), 'display');

            a.type(null);
            assert.strictEqual(a.type(), null);
        });

        it('should throw error when type not allowed', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                // @ts-ignore
                a.type('BANANA');
            }, /`type`/);
        });

        it('should change something', function () {
            const a = new ICalAlarm({
                type: ICalAlarmType.display,
                trigger: 60 * 10
            }, new ICalEvent({}, new ICalCalendar()));
            assert.ok(a.toString().indexOf('ACTION:DISPLAY') > -1);
        });
    });

    describe('trigger()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.trigger(null));
            assert.deepStrictEqual(a, a.trigger(60 * 10));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            const now = new Date();

            assert.strictEqual(a.trigger(), null);
            assert.strictEqual(a.triggerAfter(), null);

            a.trigger(300);
            assert.strictEqual(a.trigger(), 300);
            assert.strictEqual(a.triggerAfter(), -300);

            // Date
            a.trigger(now);
            const dateResult = a.trigger();
            assert.deepStrictEqual(dateResult, now);

            // Null
            a.trigger(null);
            assert.strictEqual(a.trigger(), null);
            assert.strictEqual(a.triggerAfter(), null);
        });

        it('should throw error when trigger not allowed', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                a.trigger(Infinity);
            }, /`trigger`/);
            assert.throws(function () {
                // @ts-ignore
                a.trigger('hi');
            }, /`trigger`/);
            assert.throws(function () {
                // @ts-ignore
                a.trigger(true);
            }, /`trigger`/);
        });

        it('setter should work with null', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            a.trigger(60 * 10);
            a.trigger(null);
            assert.strictEqual(a.trigger(), null);
        });

        it('setter should work with date', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            a.trigger(new Date());
            assert.ok(a.trigger() instanceof Date);
        });

        it('setter should work with moment instance', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            a.trigger(moment());
            assert.ok(moment.isMoment(a.trigger()));
        });

        it('setter should work with number', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            a.trigger(2 * 60);
            assert.strictEqual(a.trigger(), 120);
        });

        it('should change something', function () {
            const trigger = moment('2015-02-01T13:38:45.000Z');

            const a = new ICalAlarm(
                {type: ICalAlarmType.display, trigger: 60 * 10},
                new ICalEvent({}, new ICalCalendar())
            );
            assert.ok(a.toString().indexOf('TRIGGER:-PT10M') > -1);

            a.trigger(trigger);
            assert.ok(a.toString().indexOf('TRIGGER;VALUE=DATE-TIME:20150201T133845Z') > -1);
        });
    });

    describe('triggerAfter()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.triggerAfter(60 * 10));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar())).triggerAfter(300);
            assert.strictEqual(a.triggerAfter(), 300);
            assert.strictEqual(a.trigger(), -300);
        });

        it('setter should work with number', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            a.triggerAfter(120);
            assert.strictEqual(a.trigger(), -120);
        });

        it('setter should throw error when trigger not allowed', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                a.triggerAfter(Infinity);
            }, /`trigger`/);
            assert.throws(function () {
                // @ts-ignore
                a.triggerAfter('hi');
            }, /`trigger`/);
            assert.throws(function () {
                // @ts-ignore
                a.triggerAfter(true);
            }, /`trigger`/);
        });

        it('should change something', function () {
            const trigger = moment('20150201T133845Z');

            const a = new ICalAlarm(
                {type: ICalAlarmType.display, triggerAfter: 60 * 10},
                new ICalEvent({}, new ICalCalendar())
            );
            assert.ok(a.toString().indexOf('TRIGGER;RELATED=END:PT10M') > -1);

            a.triggerAfter(trigger);
            assert.ok(a.toString().indexOf('TRIGGER;VALUE=DATE-TIME:20150201T133845Z') > -1);
        });
    });

    describe('triggerBefore()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.triggerBefore(null));
            assert.deepStrictEqual(a, a.triggerBefore(60 * 10));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            const now = new Date();

            assert.strictEqual(a.triggerBefore(), null);

            a.trigger(300);
            assert.strictEqual(a.triggerBefore(), 300);

            // Date
            a.trigger(now);
            const dateResult = a.triggerBefore();
            assert.deepStrictEqual(dateResult, now);

            // Null
            a.trigger(null);
            assert.strictEqual(a.triggerBefore(), null);
        });

        it('should throw error when trigger not allowed', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                a.triggerBefore(Infinity);
            }, /`trigger`/);
            assert.throws(function () {
                // @ts-ignore
                a.triggerBefore('hi');
            }, /`trigger`/);
            assert.throws(function () {
                // @ts-ignore
                a.triggerBefore(true);
            }, /`trigger`/);
        });

        it('setter should work with null', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            a.triggerBefore(60 * 10);
            a.triggerBefore(null);
            assert.strictEqual(a.trigger(), null);
        });

        it('setter should work with date', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            const now = new Date();
            a.triggerBefore(now);
            assert.deepStrictEqual(a.trigger(), now);
        });

        it('setter should work with moment instance', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            a.triggerBefore(moment());
            assert.ok(moment.isMoment(a.trigger()));
        });

        it('setter should work with number', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            a.triggerBefore(2 * 60);
            assert.strictEqual(a.trigger(), 120);
        });

        it('should change something', function () {
            const trigger = moment('2015-02-01T13:38:45.000Z');

            const a = new ICalAlarm(
                {type: ICalAlarmType.display, triggerBefore: 60 * 10},
                new ICalEvent({}, new ICalCalendar())
            );
            assert.ok(a.toString().indexOf('TRIGGER:-PT10M') > -1);

            a.triggerBefore(trigger);
            assert.ok(a.toString().indexOf('TRIGGER;VALUE=DATE-TIME:20150201T133845Z') > -1);
        });
    });

    describe('repeat()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.repeat(null));
            assert.deepStrictEqual(a, a.repeat(4));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.strictEqual(a.repeat(), null);
            a.repeat(100);
            assert.strictEqual(a.repeat(), 100);
            a.repeat(null);
            assert.strictEqual(a.repeat(), null);
        });

        it('should throw error if repeat not allowed', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                a.repeat(Infinity);
            }, /`repeat`/);
            assert.throws(function () {
                // @ts-ignore
                a.repeat('hi');
            }, /`repeat`/);
            assert.throws(function () {
                // @ts-ignore
                a.repeat(true);
            }, /`repeat`/);
        });

        it('should change something', function () {
            const a = new ICalAlarm({
                type: ICalAlarmType.display,
                trigger: 300,
                repeat: 42,
                interval: 60
            }, new ICalEvent({}, new ICalCalendar()));
            assert.ok(a.toString().indexOf('REPEAT:42') > -1);
        });
    });

    describe('interval()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.interval(null));
            assert.deepStrictEqual(a, a.interval(60));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.strictEqual(a.interval(), null);
            a.interval(30);
            assert.strictEqual(a.interval(), 30);
            a.interval(null);
            assert.strictEqual(a.interval(), null);
        });

        it('should throw error if repeat not allowed', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                a.interval(Infinity);
            }, /`interval`/);
            assert.throws(function () {
                // @ts-ignore
                a.interval('hi');
            }, /`interval`/);
            assert.throws(function () {
                // @ts-ignore
                a.interval(true);
            }, /`interval`/);
        });

        it('should change something', function () {
            const a = new ICalAlarm({
                type: ICalAlarmType.display,
                trigger: 300,
                repeat: 42,
                interval: 90
            }, new ICalEvent({}, new ICalCalendar()));
            assert.ok(a.toString().indexOf('DURATION:PT1M30S') > -1);
        });
    });

    describe('attach()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.attach(null));
            assert.deepStrictEqual(a, a.attach('https://sebbo.net/beep.aud'));
        });

        it('getter should return value', function () {
            const t = {uri: 'https://example.com/alarm.aud', mime: 'audio/basic'};
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));

            assert.strictEqual(a.attach(), null);

            a.attach(t);
            assert.deepStrictEqual(a.attach(), t);

            a.attach('https://www.example.com/beep.aud');
            assert.deepStrictEqual(a.attach(), {
                uri: 'https://www.example.com/beep.aud',
                mime: null
            });

            a.attach({
                uri: 'https://www.example.com/beep.aud'
            });
            assert.deepStrictEqual(a.attach(), {
                uri: 'https://www.example.com/beep.aud',
                mime: null
            });

            a.attach(null);
            assert.strictEqual(a.attach(), null);
        });

        it('should throw error withour uri', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                // @ts-ignore
                a.attach({mime: 'audio/basic'});
            }, /`attach.uri`/);
        });

        it('should throw error when unknown format', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                // @ts-ignore
                a.attach(Infinity);
            }, /`attach`/);
        });

        it('should change something', function () {
            const a = new ICalAlarm({
                type: ICalAlarmType.audio,
                trigger: 300
            }, new ICalEvent({}, new ICalCalendar()));
            assert.ok(a.toString().indexOf('\r\nATTACH;VALUE=URI:Basso') > -1);

            a.attach('https://example.com/beep.aud');
            assert.ok(a.toString().indexOf('\r\nATTACH;VALUE=URI:https://example.com/beep.aud') > -1);

            a.attach({
                uri: 'https://example.com/beep.aud',
                mime: 'audio/basic'
            });
            assert.ok(a.toString().indexOf('\r\nATTACH;FMTTYPE=audio/basic:https://example.com/beep.aud') > -1);
        });
    });

    describe('description()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.description(null));
            assert.deepStrictEqual(a, a.description('Hey Ho!'));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a.description(), null);
            a.description('blablabla');
            assert.deepStrictEqual(a.description(), 'blablabla');
            a.description(null);
            assert.deepStrictEqual(a.description(), null);
        });

        it('should change something', function () {
            const a = new ICalAlarm({
                type: ICalAlarmType.display,
                trigger: 300,
                description: 'Huibuh!'
            }, new ICalEvent({}, new ICalCalendar()));
            assert.ok(a.toString().indexOf('\r\nDESCRIPTION:Huibuh') > -1);
        });

        it('should fallback to event summary', function () {
            const a = new ICalAlarm({
                type: ICalAlarmType.display,
                trigger: 300
            }, new ICalEvent({
                summary: 'Example Event'
            }, new ICalCalendar()));

            assert.ok(a.toString().indexOf('\r\nDESCRIPTION:Example Event') > -1);
        });
    });

    describe('x()', function () {
        it('is there', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.x('X-FOO', 'bar'));
        });
    });

    describe('toJSON()', function () {
        it('should work', function() {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            a.type(ICalAlarmType.display);
            a.trigger(120);

            assert.deepStrictEqual(a.toJSON(), {
                attach: null,
                description: null,
                interval: null,
                repeat: null,
                trigger: 120,
                type: 'display',
                x: []
            });
        });

        it('should be compatible with constructor (type check)', function () {
            const a = new ICalAlarm({}, new ICalEvent({}, new ICalCalendar()));
            new ICalAlarm(a.toJSON(), new ICalEvent({}, new ICalCalendar()));
        });
    });

    describe('generate()', function () {
        it('shoult throw an error without type', function () {
            const a = new ICalAlarm({trigger: 300}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                a.toString();
            }, /`type`/);
        });

        it('shoult throw an error without trigger', function () {
            const a = new ICalAlarm({type: ICalAlarmType.display}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                a.toString();
            }, /`trigger`/);
        });

        it('shoult throw an error if repeat is set but interval isn\'t', function () {
            const a = new ICalAlarm(
                {type: ICalAlarmType.display, trigger: 300, repeat: 4},
                new ICalEvent({}, new ICalCalendar())
            );
            assert.throws(function () {
                a.toString();
            }, /for `interval`/);
        });

        it('shoult throw an error if interval is set but repeat isn\'t', function () {
            const a = new ICalAlarm({
                type: ICalAlarmType.display,
                trigger: 300,
                interval: 60
            }, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                a.toString();
            }, /for `repeat`/);
        });
    });
});
