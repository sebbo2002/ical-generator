'use strict';

import assert from 'assert';
import moment from 'moment-timezone';

import ICalCalendar from '../src/calendar.js';
import ICalEvent from '../src/event.js';
import ICalAlarm, { ICalAlarmRelatesTo, ICalAlarmType } from '../src/alarm.js';
import ICalAttendee from '../src/attendee.js';


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
            }, new ICalEvent({
                start: new Date()
            }, new ICalCalendar()));

            assert.strictEqual(a.type(), 'display');
        });
    });

    describe('type()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent({
                start: new Date()
            }, new ICalCalendar()));
            assert.deepStrictEqual(a, a.type(ICalAlarmType.display));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent({
                start: new Date()
            }, new ICalCalendar()));
            assert.strictEqual(a.type(), 'display');

            a.type(ICalAlarmType.audio);
            assert.strictEqual(a.type(), 'audio');
        });

        it('should throw error when type not allowed', function () {
            const a = new ICalAlarm({}, new ICalEvent({
                start: new Date()
            }, new ICalCalendar()));
            assert.throws(function () {
                // @ts-ignore
                a.type('BANANA');
            }, /`type`/);

            assert.throws(function () {
                // @ts-ignore
                a.type(null);
            }, /`type`/);
        });

        it('should change something', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));
            assert.ok(a.toString().indexOf('ACTION:DISPLAY') > -1);
        });
    });

    describe('trigger()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));
            assert.deepStrictEqual(a, a.trigger(60 * 10));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));
            const now = new Date();

            assert.strictEqual(a.trigger(), 600);
            assert.strictEqual(a.triggerAfter(), -600);

            a.trigger(300);
            assert.strictEqual(a.trigger(), 300);
            assert.strictEqual(a.triggerAfter(), -300);

            // Date
            a.trigger(now);
            const dateResult = a.trigger();
            assert.deepStrictEqual(dateResult, now);
        });

        it('should throw error when trigger not allowed', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));
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

        it('setter should work with date', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            a.trigger(new Date());
            assert.ok(a.trigger() instanceof Date);
        });

        it('setter should work with moment instance', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            a.trigger(moment());
            assert.ok(moment.isMoment(a.trigger()));
        });

        it('setter should work with number', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            a.trigger(2 * 60);
            assert.strictEqual(a.trigger(), 120);
        });

        it('should change something', function () {
            const trigger = moment('2015-02-01T13:38:45.000Z');
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.ok(a.toString().includes('TRIGGER:-PT10M'));

            a.trigger(trigger);
            assert.ok(a.toString().includes('TRIGGER;VALUE=DATE-TIME:20150201T133845Z'));
        });
    });

    describe('triggerAfter()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.deepStrictEqual(a, a.triggerAfter(60 * 10));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            )).triggerAfter(300);

            assert.strictEqual(a.triggerAfter(), 300);
            assert.strictEqual(a.trigger(), -300);
        });

        it('setter should work with number', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            a.triggerAfter(120);
            assert.strictEqual(a.trigger(), -120);
        });

        it('setter should throw error when trigger not allowed', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

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
            const a = new ICalAlarm({ triggerAfter: 600 }, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.ok(a.toString().indexOf('TRIGGER;RELATED=END:PT10M') > -1);

            a.triggerAfter(trigger);
            assert.ok(a.toString().indexOf('TRIGGER;VALUE=DATE-TIME:20150201T133845Z') > -1);
        });
    });

    describe('triggerBefore()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.deepStrictEqual(a, a.triggerBefore(60 * 10));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));
            const now = new Date();

            assert.strictEqual(a.triggerBefore(), 600);

            a.trigger(300);
            assert.strictEqual(a.triggerBefore(), 300);

            // Date
            a.trigger(now);
            const dateResult = a.triggerBefore();
            assert.deepStrictEqual(dateResult, now);
        });

        it('should throw error when trigger not allowed', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

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

        it('setter should work with date', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            const now = new Date();
            a.triggerBefore(now);
            assert.deepStrictEqual(a.trigger(), now);
        });

        it('setter should work with moment instance', function () {
            const a = new ICalAlarm({ triggerBefore: moment() }, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.ok(moment.isMoment(a.trigger()));
        });

        it('setter should work with number', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            a.triggerBefore(2 * 60);
            assert.strictEqual(a.trigger(), 120);
        });

        it('should change something', function () {
            const trigger = moment('2015-02-01T13:38:45.000Z');
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.ok(a.toString().indexOf('TRIGGER:-PT10M') > -1);

            a.triggerBefore(trigger);
            assert.ok(a.toString().indexOf('TRIGGER;VALUE=DATE-TIME:20150201T133845Z') > -1);
        });
    });

    describe('relatesTo()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.deepStrictEqual(a, a.relatesTo(null));
            assert.deepStrictEqual(a, a.relatesTo(ICalAlarmRelatesTo.end));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            a.relatesTo(ICalAlarmRelatesTo.end);
            assert.strictEqual(a.relatesTo(), ICalAlarmRelatesTo.end);
            a.relatesTo(null);
            assert.strictEqual(a.relatesTo(), null);
        });

        it('should throw if value is not `null`, "START" or "END"', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.throws(function () {
                // @ts-ignore
                a.relatesTo('hi');
            }, /`relatesTo`/);
            assert.throws(function () {
                // @ts-ignore
                a.relatesTo(true);
            }, /`relatesTo`/);
            assert.throws(function () {
                // @ts-ignore
                a.relatesTo(Infinity);
            }, /`relatesTo`/);
        });

        it('should change RELATED', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.ok(a.toString().indexOf('RELATED=START') === -1);
            
            a.relatesTo(ICalAlarmRelatesTo.start);
            assert.ok(a.toString().indexOf('RELATED=START') > -1);

            a.relatesTo(ICalAlarmRelatesTo.end);
            assert.ok(a.toString().indexOf('RELATED=END') > -1);
        });
    });

    describe('repeat()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.deepStrictEqual(a, a.repeat({
                times: 4,
                interval: 60
            }));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.strictEqual(a.repeat(), null);
            a.repeat({ times: 4, interval: 60 });
            assert.deepStrictEqual(a.repeat(), { times: 4, interval: 60 });
        });

        it('should throw error if repeat not allowed', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.throws(function () {
                a.repeat({
                    times: Infinity,
                    interval: 60
                });
            }, /`repeat.times`/);
            assert.throws(function () {
                a.repeat({
                    // @ts-ignore
                    times: 'hi',
                    interval: 60
                });
            }, /`repeat.times`/);
            assert.throws(function () {
                a.repeat({
                    // @ts-ignore
                    times: true,
                    interval: 60
                });
            }, /`repeat.times`/);

            assert.throws(function () {
                a.repeat({
                    times: 4,
                    interval: Infinity
                });
            }, /`repeat.interval`/);
            assert.throws(function () {
                a.repeat({
                    times: 4,
                    // @ts-ignore
                    interval: 'hi'
                });
            }, /`repeat.interval`/);
            assert.throws(function () {
                a.repeat({
                    times: 4,
                    // @ts-ignore
                    interval: true
                });
            }, /`repeat.interval`/);
        });

        it('should change something', function () {
            const a = new ICalAlarm({
                trigger: 300,
                repeat: {
                    times: 42,
                    interval: 90
                }
            }, new ICalEvent({ start: new Date() }, new ICalCalendar()));
            assert.ok(a.toString().includes('REPEAT:42'));
            assert.ok(a.toString().includes('DURATION:PT1M30S'));

            a.repeat(null);
            assert.ok(!a.toString().includes('REPEAT:42'));
            assert.ok(!a.toString().includes('DURATION:PT1M30S'));
        });

        it('should throw an error if repeat is set but interval isn\'t', function () {
            assert.throws(function () {
                new ICalAlarm(
                    {
                        trigger: 300,
                        repeat: {
                            times: 4,
                            // @ts-ignore
                            interval: null
                        }
                    },
                    new ICalEvent({ start: new Date() }, new ICalCalendar())
                );
            }, /`repeat.interval`/);
        });

        it('should throw an error if interval is set but repeat isn\'t', function () {
            assert.throws(function () {
                new ICalAlarm({
                    trigger: 300,
                    repeat: {
                        // @ts-ignore
                        times: null,
                        interval: 60
                    }
                }, new ICalEvent({ start: new Date() }, new ICalCalendar()));
            }, /`repeat.times`/);
        });

        it('should throw an error if interval is of wrong type', function () {
            assert.throws(function () {
                new ICalAlarm({
                    trigger: 300,
                    // @ts-ignore
                    repeat: true
                }, new ICalEvent({ start: new Date() }, new ICalCalendar()));
            }, /`repeat` is not correct, must be an object!/);
        });
    });

    describe('attach()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.deepStrictEqual(a, a.attach(null));
            assert.deepStrictEqual(a, a.attach('https://sebbo.net/beep.aud'));
        });

        it('getter should return value', function () {
            const t = {uri: 'https://example.com/alarm.aud', mime: 'audio/basic'};
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

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
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.throws(function () {
                // @ts-ignore
                a.attach({mime: 'audio/basic'});
            }, /`attach.uri`/);
        });

        it('should throw error when unknown format', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.throws(function () {
                // @ts-ignore
                a.attach(Infinity);
            }, /`attachment`/);
        });

        it('should change something', function () {
            const a = new ICalAlarm({ type: ICalAlarmType.audio }, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

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
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.deepStrictEqual(a, a.description(null));
            assert.deepStrictEqual(a, a.description('Hey Ho!'));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.deepStrictEqual(a.description(), null);
            a.description('blablabla');
            assert.deepStrictEqual(a.description(), 'blablabla');
            a.description(null);
            assert.deepStrictEqual(a.description(), null);
        });

        it('should change something', function () {
            const a = new ICalAlarm({
                description: 'Huibuh!'
            }, new ICalEvent({ start: new Date() }, new ICalCalendar()));
            assert.ok(a.toString().indexOf('\r\nDESCRIPTION:Huibuh') > -1);
        });

        it('should fallback to event summary', function () {
            const a = new ICalAlarm({ description: 'Example Event' }, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.ok(a.toString().indexOf('\r\nDESCRIPTION:Example Event') > -1);
        });
    });

    describe('summary()', function () {
        it('setter should return this', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.deepStrictEqual(a, a.summary(null));
            assert.deepStrictEqual(a, a.summary('Hey Ho!'));
        });

        it('getter should return value', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.deepStrictEqual(a.summary(), null);
            a.summary('blablabla');
            assert.deepStrictEqual(a.summary(), 'blablabla');
            a.summary(null);
            assert.deepStrictEqual(a.summary(), null);
        });

        it('should change something', function () {
            const a = new ICalAlarm({
                type: ICalAlarmType.email,
                summary: 'Huibuh!'
            }, new ICalEvent({ start: new Date() }, new ICalCalendar()));
            assert.ok(a.toString().indexOf('\r\nSUMMARY:Huibuh') > -1);
        });

        it('should fallback to event summary', function () {
            const a = new ICalAlarm(
                { type: ICalAlarmType.email },
                new ICalEvent({ start: new Date(), summary: 'Example Event' }, new ICalCalendar())
            );

            assert.ok(a.toString().indexOf('\r\nSUMMARY:Example Event') > -1);
        });
    });

    describe('createAttendee()', function () {
        it('if Attendee passed, it should add and return it', function () {
            const alarm = new ICalEvent({ start: new Date() }, new ICalCalendar()).createAlarm({
                type: ICalAlarmType.email
            });

            const attendee = new ICalAttendee({ email: 'mail@example.com' }, alarm);
            assert.strictEqual(alarm.createAttendee(attendee), attendee, 'createAttendee returns attendee');
            assert.deepStrictEqual(alarm.attendees()[0], attendee, 'attendee pushed');
        });

        it('should return a ICalAttendee instance', function () {
            const alarm = new ICalEvent({ start: new Date() }, new ICalCalendar()).createAlarm({
                type: ICalAlarmType.email
            });;

            assert.ok(alarm.createAttendee({ email: 'mail@example.com' }) instanceof ICalAttendee);
            assert.strictEqual(alarm.attendees.length, 1, 'attendee pushed');
        });

        it('should accept string', function () {
            const alarm = new ICalEvent({ start: new Date() }, new ICalCalendar()).createAlarm({
                type: ICalAlarmType.email
            });;
            const attendee = alarm.createAttendee('Zac <zac@example.com>');

            assert.strictEqual(attendee.name(), 'Zac');
            assert.strictEqual(attendee.email(), 'zac@example.com');
            assert.strictEqual(alarm.attendees().length, 1, 'attendee pushed');
        });

        it('should throw error when string misformated', function () {
            const alarm = new ICalEvent({ start: new Date() }, new ICalCalendar()).createAlarm({
                type: ICalAlarmType.email
            });;
            assert.throws(function () {
                alarm.createAttendee('foo bar');
            }, /isn't formated correctly/);
        });

        it('should accept object', function () {
            const alarm = new ICalEvent({ start: new Date() }, new ICalCalendar()).createAlarm({
                type: ICalAlarmType.email
            });
            const attendee = alarm.createAttendee({name: 'Zac', email: 'zac@example.com'});

            assert.strictEqual(attendee.name(), 'Zac');
            assert.strictEqual(attendee.email(), 'zac@example.com');
            assert.strictEqual(alarm.attendees().length, 1, 'attendee pushed');
            assert.ok(alarm.toString().includes('ATTENDEE;ROLE=REQ-PARTICIPANT;CN="Zac":MAILTO:zac@example.com'));
        });
    });

    describe('attendees()', function () {
        it('getter should return an array of attendees…', function () {
            const alarm = new ICalEvent({ start: new Date() }, new ICalCalendar()).createAlarm({
                type: ICalAlarmType.email
            });
            assert.strictEqual(alarm.attendees().length, 0);

            const attendee = alarm.createAttendee({ email: 'mail@example.com' });
            assert.strictEqual(alarm.attendees().length, 1);
            assert.deepStrictEqual(alarm.attendees()[0], attendee);
        });

        it('setter should add attendees and return this', function () {
            const alarm = new ICalEvent({ start: new Date() }, new ICalCalendar()).createAlarm({
                type: ICalAlarmType.email
            });
            const foo = alarm.attendees([
                { name: 'Person A', email: 'a@example.com' },
                { name: 'Person B', email: 'b@example.com' }
            ]);

            assert.strictEqual(alarm.attendees().length, 2);
            assert.deepStrictEqual(foo, alarm);
        });
    });

    describe('x()', function () {
        it('is there', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            assert.deepStrictEqual(a, a.x('X-FOO', 'bar'));
        });
    });

    describe('toJSON()', function () {
        it('should work', function() {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            a.type(ICalAlarmType.display);
            a.trigger(120);

            assert.deepStrictEqual(a.toJSON(), {
                attach: null,
                attendees: [],
                description: null,
                relatesTo: null,
                interval: null,
                repeat: null,
                summary: null,
                trigger: 120,
                type: 'display',
                x: []
            });
        });

        it('should be compatible with constructor (type check)', function () {
            const a = new ICalAlarm({}, new ICalEvent(
                { start: new Date() },
                new ICalCalendar()
            ));

            new ICalAlarm(a.toJSON(), new ICalEvent({ start: new Date() }, new ICalCalendar()));
        });
    });
});
