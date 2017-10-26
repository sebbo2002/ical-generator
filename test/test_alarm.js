'use strict';

const assert = require('assert');
const moment = require('moment');
const ical = require(__dirname + '/../src');

describe('ical-generator Alarm', function () {
    describe('constructor()', function () {
        it('shouldn\'t work without event reference', function () {
            const ICalAlarm = require('../src/alarm');
            assert.throws(function () {
                new ICalAlarm({type: 'display'});
            }, /`event`/);
        });

        it('should ignore unknown data attributes', function () {
            const cal = ical();
            const e = cal.createEvent().createAlarm({unknown: true, type: 'display'});
            assert.equal(e.type(), 'display');
        });
    });

    describe('type()', function () {
        it('setter should return this', function () {
            const a = ical().createEvent().createAlarm();
            assert.deepEqual(a, a.type(null));
            assert.deepEqual(a, a.type('display'));
        });

        it('getter should return value', function () {
            const a = ical().createEvent().createAlarm();
            assert.equal(a.type(), null);

            a.type('display');
            assert.equal(a.type(), 'display');

            a.type(null);
            assert.equal(a.type(), null);
        });

        it('should throw error when type not allowed', function () {
            const a = ical().createEvent().createAlarm();
            assert.throws(function () {
                a.type('BANANA');
            }, /`type`/);
        });

        it('should change something', function () {
            const cal = ical();
            const event = cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            event.createAlarm({type: 'display', trigger: 60 * 10});
            assert.ok(cal.toString().indexOf('ACTION:DISPLAY') > -1);
        });
    });

    describe('trigger()', function () {
        it('setter should return this', function () {
            const a = ical().createEvent().createAlarm();
            assert.deepEqual(a, a.trigger(null));
            assert.deepEqual(a, a.trigger(60 * 10));
        });

        it('getter should return value', function () {
            const a = ical().createEvent().createAlarm();
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
            const a = ical().createEvent().createAlarm();
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

        it('should change something', function () {
            const cal = ical();
            const event = cal.createEvent({
                start: moment(),
                end: moment().add(1, 'hour'),
                summary: 'Example Event'
            });
            const trigger = moment('20150201T133845Z');

            const alarm = event.createAlarm({type: 'display', trigger: 60 * 10});
            assert.ok(cal.toString().indexOf('TRIGGER:-PT10M') > -1);

            alarm.trigger(trigger);
            assert.ok(cal.toString().indexOf('TRIGGER;VALUE=DATE-TIME:20150201T133845Z') > -1);
        });
    });

    describe('triggerAfter()', function () {
        it('setter should return this', function () {
            const a = ical().createEvent().createAlarm();
            assert.deepEqual(a, a.triggerAfter(60 * 10));
        });

        it('getter should return value', function () {
            const e = ical().createEvent().createAlarm().triggerAfter(300);
            assert.equal(e.triggerAfter(), 300);
            assert.equal(e.trigger(), -300);
        });

        it('should throw error when trigger not allowed', function () {
            const a = ical().createEvent().createAlarm();
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
            const cal = ical();
            const event = cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            const trigger = moment('20150201T133845Z');
            const alarm = event.createAlarm({type: 'display', triggerAfter: 60 * 10});
            assert.ok(cal.toString().indexOf('TRIGGER;RELATED=END:PT10M') > -1);

            alarm.triggerAfter(trigger);
            assert.ok(cal.toString().indexOf('TRIGGER;VALUE=DATE-TIME:20150201T133845Z') > -1);
        });
    });

    describe('repeat()', function () {
        it('setter should return this', function () {
            const a = ical().createEvent().createAlarm();
            assert.deepEqual(a, a.repeat(null));
            assert.deepEqual(a, a.repeat(4));
        });

        it('getter should return value', function () {
            const e = ical().createEvent().createAlarm();
            assert.equal(e.repeat(), null);
            e.repeat(100);
            assert.equal(e.repeat(), 100);
            e.repeat(null);
            assert.equal(e.repeat(), null);
        });

        it('should throw error if repeat not allowed', function () {
            const a = ical().createEvent().createAlarm();
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
            const cal = ical(),
                event = cal.createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                });

            event.createAlarm({type: 'display', trigger: 300, repeat: 42, interval: 60});
            assert.ok(cal.toString().indexOf('REPEAT:42') > -1);
        });
    });

    describe('interval()', function () {
        it('setter should return this', function () {
            const a = ical().createEvent().createAlarm();
            assert.deepEqual(a, a.interval(null));
            assert.deepEqual(a, a.interval(60));
        });

        it('getter should return value', function () {
            const e = ical().createEvent().createAlarm();
            assert.equal(e.interval(), null);
            e.interval(30);
            assert.equal(e.interval(), 30);
            e.interval(null);
            assert.equal(e.interval(), null);
        });

        it('should throw error if repeat not allowed', function () {
            const a = ical().createEvent().createAlarm();
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
            const cal = ical();
            const event = cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            event.createAlarm({type: 'display', trigger: 300, repeat: 42, interval: 90});
            assert.ok(cal.toString().indexOf('DURATION:PT1M30S') > -1);
        });
    });

    describe('attach()', function () {
        it('setter should return this', function () {
            const a = ical().createEvent().createAlarm();
            assert.deepEqual(a, a.attach(null));
            assert.deepEqual(a, a.attach('https://sebbo.net/beep.aud'));
        });

        it('getter should return value', function () {
            const t = {uri: 'https://example.com/alarm.aud', mime: 'audio/basic'};
            const e = ical().createEvent().createAlarm();

            assert.equal(e.attach(), null);

            e.attach(t);
            assert.deepEqual(e.attach(), t);

            e.attach('https://www.example.com/beep.aud');
            assert.deepEqual(e.attach(), {
                uri: 'https://www.example.com/beep.aud',
                mime: null
            });

            e.attach({
                uri: 'https://www.example.com/beep.aud'
            });
            assert.deepEqual(e.attach(), {
                uri: 'https://www.example.com/beep.aud',
                mime: null
            });

            e.attach(null);
            assert.equal(e.attach(), null);
        });

        it('should throw error withour uri', function () {
            const a = ical().createEvent().createAlarm();
            assert.throws(function () {
                a.attach({mime: 'audio/basic'});
            }, /`attach.uri`/);
        });

        it('should throw error when unknown format', function () {
            const a = ical().createEvent().createAlarm();
            assert.throws(function () {
                a.attach(Infinity);
            }, /`attach`/);
        });

        it('should change something', function () {
            const cal = ical();
            const e = cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });
            const a = e.createAlarm({
                type: 'audio',
                trigger: 300
            });

            assert.ok(cal.toString().indexOf('\r\nATTACH;VALUE=URI:Basso') > -1);

            a.attach('https://example.com/beep.aud');
            assert.ok(cal.toString().indexOf('\r\nATTACH;VALUE=URI:https://example.com/beep.aud') > -1);

            a.attach({
                uri: 'https://example.com/beep.aud',
                mime: 'audio/basic'
            });
            assert.ok(cal.toString().indexOf('\r\nATTACH;FMTTYPE=audio/basic:https://example.com/beep.aud') > -1);
        });
    });

    describe('description()', function () {
        it('setter should return this', function () {
            const a = ical().createEvent().createAlarm();
            assert.deepEqual(a, a.description(null));
            assert.deepEqual(a, a.description('Hey Ho!'));
        });

        it('getter should return value', function () {
            const e = ical().createEvent().createAlarm();
            assert.deepEqual(e.description(), null);
            e.description('blablabla');
            assert.deepEqual(e.description(), 'blablabla');
            e.description(null);
            assert.deepEqual(e.description(), null);
        });

        it('should change something', function () {
            const cal = ical();
            const event = cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            event.createAlarm({type: 'display', trigger: 300, description: 'Huibuh!'});
            assert.ok(cal.toString().indexOf('\r\nDESCRIPTION:Huibuh') > -1);
        });

        it('should fallback to event summary', function () {
            const cal = ical();
            const event = cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            event.createAlarm({type: 'display', trigger: 300});
            assert.ok(cal.toString().indexOf('\r\nDESCRIPTION:Example Event') > -1);
        });
    });

    describe('generate()', function () {
        it('shoult throw an error without type', function () {
            const a = ical().createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            }).createAlarm({trigger: 300});

            assert.throws(function () {
                a.generate();
            }, /`type`/);
        });

        it('shoult throw an error without trigger', function () {
            const a = ical().createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            }).createAlarm({type: 'display'});

            assert.throws(function () {
                a.generate();
            }, /`trigger`/);
        });

        it('shoult throw an error if repeat is set but interval isn\'t', function () {
            const a = ical().createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            }).createAlarm({type: 'display', trigger: 300, repeat: 4});

            assert.throws(function () {
                a.generate();
            }, /for `interval`/);
        });

        it('shoult throw an error if interval is set but repeat isn\'t', function () {
            const a = ical().createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            }).createAlarm({type: 'display', trigger: 300, interval: 60});

            assert.throws(function () {
                a.generate();
            }, /for `repeat`/);
        });
    });
});