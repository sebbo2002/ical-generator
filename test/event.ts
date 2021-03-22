'use strict';

import assert from 'assert';
import moment from 'moment-timezone';
import ICalCalendar from '../src/calendar';
import ICalEvent, {ICalEventBusyStatus, ICalEventStatus, ICalEventTransparency} from '../src/event';
import {ICalEventRepeatingFreq, ICalWeekday} from '../src/types';
import ICalAttendee from '../src/attendee';
import ICalAlarm, {ICalAlarmType} from '../src/alarm';
import ICalCategory from '../src/category';

describe('ical-generator Event', function () {
    describe('constructor()', function () {
        it('shoud set _data', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.ok(event.id(), 'data.id set');
            assert.ok(event.stamp(), 'data.stamp set');
        });

        it('shouldn\'t work without calendar reference', function () {
            assert.throws(function () {
                // @ts-ignore
                new ICalEvent({summary: 'Testevent'}, null);
            }, /`calendar`/);
        });
    });

    describe('id()', function () {
        it('setter should return this', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(event, event.id(1048));
        });

        it('getter should return value', function () {
            const event = new ICalEvent({}, new ICalCalendar()).id(512);
            assert.strictEqual(event.id(), '512');

            event.id('xyz');
            assert.strictEqual(event.id(), 'xyz');
        });
    });

    describe('uid()', function () {
        it('setter should return this', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(event, event.uid(1048));
        });

        it('getter should return value', function () {
            const event = new ICalEvent({}, new ICalCalendar()).uid(512);
            assert.strictEqual(event.uid(), '512');

            event.id('xyz');
            assert.strictEqual(event.uid(), 'xyz');
        });
    });

    describe('sequence()', function () {
        it('setter should return this', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(event, event.sequence(1));
        });

        it('getter should return value', function () {
            const event = new ICalEvent({}, new ICalCalendar()).sequence(1048);
            assert.strictEqual(event.sequence(), 1048);
        });

        it('setter should throw error when sequence is not valid', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                // @ts-ignore
                event.sequence('hello');
            }, /`sequence`/);
        });

        it('setter should work with 0', function () {
            const event = new ICalEvent({}, new ICalCalendar()).sequence(12);
            assert.strictEqual(event.sequence(), 12);

            event.sequence(0);
            assert.strictEqual(event.sequence(), 0);
        });
    });

    describe('start()', function () {
        it('getter should return value', function () {
            const now = moment();
            const event = new ICalEvent({}, new ICalCalendar());
            event.start(now);
            assert.strictEqual(event.start(), now);
        });

        it('setter should parse string if required', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week').toJSON();
            assert.deepStrictEqual(event, event.start(date));
            assert.deepStrictEqual(event.start(), date);
        });

        it('setter should handle Dates if required', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week').toDate();
            assert.deepStrictEqual(event, event.start(date));
            assert.deepStrictEqual(event.start(), date);
        });

        it('setter should throw error when start time is not a Date', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                // @ts-ignore
                event.start(3);
            }, /`start`/, 'Number');
            assert.throws(function () {
                // @ts-ignore
                event.start(null);
            }, /`start`/, 'null');
            assert.throws(function () {
                // @ts-ignore
                event.start(NaN);
            }, /`start`/, 'NaN');
            assert.throws(function () {
                event.start(new Date('hallo'));
            }, /`start`/, 'Invalid Date');
        });

        it('setter should flip start and end if necessary', function () {
            const start = moment().add(5, 'minutes');
            const end = moment();
            const event = new ICalEvent({}, new ICalCalendar())
                .end(end)
                .start(start);

            assert.deepStrictEqual(event.start(), end);
            assert.deepStrictEqual(event.end(), start);
        });

        it('setter should return this', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(event, event.start(moment()));
            assert.deepStrictEqual(event, event.start(new Date()));
        });
    });

    describe('end()', function () {
        it('getter should return value', function () {
            const now = moment();
            const event = new ICalEvent({}, new ICalCalendar());
            event.end(now);
            assert.deepStrictEqual(event.end(), now);
        });

        it('setter should parse string if required', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week').toJSON();
            assert.deepStrictEqual(event, event.end(date));
            assert.deepStrictEqual(event.end(), date);
        });

        it('setter should handle Dates if required', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week').toDate();
            assert.deepStrictEqual(event, event.end(date));
            assert.deepStrictEqual(event.end(), date);
        });

        it('setter should throw error when time is not a Date', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                // @ts-ignore
                event.end(3);
            }, /`end`/, 'Number');
            assert.throws(function () {
                // @ts-ignore
                event.end(NaN);
            }, /`end`/, 'NaN');
            assert.throws(function () {
                event.end(new Date('hallo'));
            }, /`end`/, 'Invalid Date');
        });

        it('setter should flip start and end if necessary', function () {
            const start = moment().add(5, 'minutes');
            const end = moment();
            const event = new ICalEvent({}, new ICalCalendar())
                .start(start)
                .end(end);

            assert.deepStrictEqual(event.start(), end);
            assert.deepStrictEqual(event.end(), start);
        });

        it('setter should return this', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(event, event.end(moment()));
            assert.deepStrictEqual(event, event.end(new Date()));
        });
    });

    describe('recurrenceId()', function () {
        it('getter should return value', function () {
            const now = moment();
            const event = new ICalEvent({}, new ICalCalendar());
            event.recurrenceId(now);
            assert.deepStrictEqual(event.recurrenceId(), now);
        });

        it('setter should parse string if required', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week').toJSON();
            assert.deepStrictEqual(event, event.recurrenceId(date));
            assert.deepStrictEqual(event.recurrenceId(), date);
        });

        it('setter should handle Dates if required', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week').toDate();
            assert.deepStrictEqual(event, event.recurrenceId(date));
            assert.deepStrictEqual(event.recurrenceId(), date);
        });

        it('setter should throw error when time is not a Date', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                // @ts-ignore
                event.recurrenceId(3);
            }, /`recurrenceId`/, 'Number');
            assert.throws(function () {
                // @ts-ignore
                event.recurrenceId(NaN);
            }, /`recurrenceId`/, 'NaN');
            assert.throws(function () {
                event.recurrenceId(new Date('hallo'));
            }, /`recurrenceId`/, 'Invalid Date');
        });

        it('setter should return this', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(event, event.recurrenceId(moment()));
            assert.deepStrictEqual(event, event.recurrenceId(new Date()));
        });
    });

    describe('timezone()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent({}, new ICalCalendar()).timezone('Europe/Berlin');
            assert.strictEqual(e.timezone(), 'Europe/Berlin');
        });

        it('getter should inherit from calendar', function () {
            const cal = new ICalCalendar();
            const e = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, cal);

            assert.strictEqual(cal.timezone(), null);
            assert.strictEqual(e.timezone(), null);

            cal.timezone('Europe/London');
            assert.strictEqual(cal.timezone(), 'Europe/London');
            assert.strictEqual(e.timezone(), 'Europe/London');

            e.timezone('Europe/Berlin');
            assert.strictEqual(cal.timezone(), 'Europe/London');
            assert.strictEqual(e.timezone(), 'Europe/Berlin');

            cal.timezone(null);
            assert.strictEqual(cal.timezone(), null);
            assert.strictEqual(e.timezone(), 'Europe/Berlin');

            e.timezone(null);
            assert.strictEqual(cal.timezone(), null);
            assert.strictEqual(e.timezone(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.timezone('Europe/Berlin'));
        });

        it('should update timezone', function () {
            const e = new ICalEvent({
                start: moment(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            }, new ICalCalendar());

            e.timezone('Europe/London');
            assert.strictEqual(e.timezone(), 'Europe/London');
        });

        it('should disable floating when truthy', function () {
            const e = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            e.floating(true);
            e.timezone('Europe/London');
            assert.strictEqual(e.floating(), false);
        });

        it('should not disable floating when falsy', function () {
            const e = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            e.floating(true);
            e.timezone(null);
            assert.strictEqual(e.floating(), true);
        });
    });

    describe('stamp()', function () {
        it('getter should return value', function () {
            const now = moment().add(1, 'day');
            const e = new ICalEvent({}, new ICalCalendar()).stamp(now);
            assert.deepStrictEqual(e.stamp(), now);
        });

        it('setter should parse string if required', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week').toJSON();
            assert.deepStrictEqual(event, event.stamp(date));
            assert.deepStrictEqual(event.stamp(), date);
        });

        it('setter should handle Dates if required', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week').toDate();
            assert.deepStrictEqual(event, event.stamp(date));
            assert.deepStrictEqual(event.stamp(), date);
        });

        it('setter should throw error when time is not a Date', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                // @ts-ignore
                event.stamp(3);
            }, /`stamp`/, 'Number');
            assert.throws(function () {
                // @ts-ignore
                event.stamp(null);
            }, /`stamp`/, 'null');
            assert.throws(function () {
                // @ts-ignore
                event.stamp(NaN);
            }, /`stamp`/, 'NaN');
            assert.throws(function () {
                event.stamp(new Date('hallo'));
            }, /`stamp`/, 'Invalid Date');
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.stamp(new Date()));
        });
    });

    describe('timestamp()', function () {
        it('getter should return value', function () {
            const now = moment().add(1, 'day');
            const e = new ICalEvent({}, new ICalCalendar()).timestamp(now);
            assert.deepStrictEqual(e.timestamp(), now);
        });

        it('setter should parse string if required', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week').toJSON();
            assert.deepStrictEqual(event, event.timestamp(date));
            assert.deepStrictEqual(event.stamp(), date);
        });

        it('setter should handle Dates if required', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week').toDate();
            assert.deepStrictEqual(event, event.timestamp(date));
            assert.deepStrictEqual(event.stamp(), date);
        });

        it('setter should throw error when time is not a Date', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                // @ts-ignore
                event.timestamp(3);
            }, /`stamp`/, 'Number');
            assert.throws(function () {
                // @ts-ignore
                event.timestamp(null);
            }, /`stamp`/, 'null');
            assert.throws(function () {
                // @ts-ignore
                event.timestamp(NaN);
            }, /`stamp`/, 'NaN');
            assert.throws(function () {
                event.timestamp(new Date('hallo'));
            }, /`stamp`/, 'Invalid Date');
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.timestamp(new Date()));
        });
    });

    describe('allDay()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.allDay(true);
            assert.strictEqual(e.allDay(), true);
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.allDay(true));
        });

        it('should change something', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.allDay(true);
            assert.strictEqual(event.allDay(), true);
        });
    });

    describe('floating()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent({}, new ICalCalendar()).floating(true);
            assert.strictEqual(e.floating(), true);
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.floating(false));
            assert.deepStrictEqual(e, e.floating(true));
        });

        it('should update floating', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.floating(true);
            assert.strictEqual(event.floating(), true);
        });

        it('should remove timezone when truthy', function () {
            const e = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            e.timezone('Europe/London');
            e.floating(true);
            assert.strictEqual(e.timezone(), null);
        });

        it('should not remove timezone when falsy', function () {
            const e = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            e.timezone('Europe/London');
            e.floating(false);
            assert.strictEqual(e.timezone(), 'Europe/London');
        });
    });

    describe('repeating()', function () {
        it('getter should return value', function () {
            const options = {
                freq: ICalEventRepeatingFreq.MONTHLY,
                count: 5,
                interval: 2,
                until: moment(),
                exclude: [moment()]
            };
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e.repeating(), null);

            e.repeating(options);
            assert.strictEqual(
                JSON.stringify(e.repeating(), null, '  '),
                JSON.stringify(options, null, '  ')
            );

            e.repeating(null);
            assert.deepStrictEqual(e.repeating(), null);
        });

        it('setter should handle null', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.repeating(null));
            assert.deepStrictEqual(e.repeating(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.repeating(null), 'repeating(null)');
            assert.deepStrictEqual(e, e.repeating({
                freq: ICalEventRepeatingFreq.MONTHLY
            }), 'repeating({freq: \'MONTHLY\'})');
        });

        it('setter should throw error when repeating without freq', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',

                    // @ts-ignore
                    repeating: {}
                }, new ICalCalendar());
            }, /Input must be one of the following: SECONDLY, MINUTELY, HOURLY, DAILY, WEEKLY, MONTHLY, YEARLY/);
        });

        it('setter should throw error when repeating when freq is not allowed', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        // @ts-ignore
                        freq: 'hello'
                    }
                }, new ICalCalendar());
            }, /must be one of the following/);
        });

        it('setter should update freq', function () {
            const e = new ICalEvent({}, new ICalCalendar());

            e.repeating({freq: ICalEventRepeatingFreq.MONTHLY});
            assert.strictEqual(e.repeating()?.freq, 'MONTHLY');
        });

        it('setter should throw error when repeating.count is not a number', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        count: Infinity
                    }
                }, new ICalCalendar());
            }, /`repeating.count` must be a finite number!/);

            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        // @ts-ignore
                        count: 'abc'
                    }
                }, new ICalCalendar());
            }, /`repeating\.count` must be a finite number!/);
        });

        it('setter should update count', function () {
            const e = new ICalEvent({}, new ICalCalendar());

            e.repeating({freq: ICalEventRepeatingFreq.MONTHLY, count: 5});
            assert.strictEqual(e.repeating()?.count, 5);
        });

        it('should throw error when repeating.interval is not a number', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        interval: Infinity
                    }
                }, new ICalCalendar());
            }, /`repeating.interval` must be a finite number!/);

            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        // @ts-ignore
                        interval: 'abc'
                    }
                }, new ICalCalendar());
            }, /`repeating.interval` must be a finite number!/);
        });

        it('setter should update interval', function () {
            const e = new ICalEvent({}, new ICalCalendar());

            e.repeating({freq: ICalEventRepeatingFreq.MONTHLY, interval: 5});
            assert.strictEqual(e.repeating()?.interval, 5);
        });

        it('should throw error when repeating.until is not a date', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        // @ts-ignore
                        until: null
                    }
                }, new ICalCalendar());
            }, /Error: `repeating\.until` has to be a valid date!/);
        });

        it('setter should parse repeating.until string if required', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week').toJSON();
            event.repeating({freq: ICalEventRepeatingFreq.MONTHLY, until: date});
            assert.deepStrictEqual(event.repeating()?.until, date);
        });

        it('setter should handle repeating.until Dates if required', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week').toDate();
            event.repeating({freq: ICalEventRepeatingFreq.MONTHLY, until: date});
            assert.deepStrictEqual(event.repeating()?.until, date);
        });

        it('setter should handle repeating.until moments', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week');
            event.repeating({freq: ICalEventRepeatingFreq.MONTHLY, until: date});
            assert.deepStrictEqual(event.repeating()?.until, date);
        });

        it('setter should throw error when repeating.until is not a Date', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                // @ts-ignore
                event.repeating({freq: ICalEventRepeatingFreq.MONTHLY, until: 3});
            }, /`repeating.until`/, 'Number');
            assert.throws(function () {
                // @ts-ignore
                event.repeating({freq: ICalEventRepeatingFreq.MONTHLY, until: null});
            }, /`repeating.until`/, 'null');
            assert.throws(function () {
                // @ts-ignore
                event.repeating({freq: ICalEventRepeatingFreq.MONTHLY, until: NaN});
            }, /`repeating.until`/, 'NaN');
            assert.throws(function () {
                event.repeating({freq: ICalEventRepeatingFreq.MONTHLY, until: new Date('foo')});
            }, /`repeating.until`/, 'Invalid Date');
        });

        it('should throw error when repeating.byDay is not valid', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        interval: 2,
                        // @ts-ignore
                        byDay: 'FOO'
                    }
                }, new ICalCalendar());
            }, /Input must be one of the following: SU, MO, TU, WE, TH, FR, SA/);

            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        interval: 2,
                        // @ts-ignore
                        byDay: ['SU', 'BAR', 'th']
                    }
                }, new ICalCalendar());
            }, /Input must be one of the following: SU, MO, TU, WE, TH, FR, SA/);

            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        interval: 2,
                        // @ts-ignore
                        byDay: ['SU', Infinity, 'th']
                    }
                }, new ICalCalendar());
            }, /Input must be one of the following: SU, MO, TU, WE, TH, FR, SA/);
        });

        it('setter should update repeating.byDay', function () {
            const e = new ICalEvent({}, new ICalCalendar());

            e.repeating({
                freq: ICalEventRepeatingFreq.MONTHLY,
                byDay: [ICalWeekday.SU, ICalWeekday.WE, ICalWeekday.TH]
            });

            assert.deepStrictEqual(e.repeating()?.byDay, ['SU', 'WE', 'TH']);
        });

        it('should throw error when repeating.byMonth is not valid', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        interval: 2,
                        // @ts-ignore
                        byMonth: 'FOO'
                    }
                }, new ICalCalendar());
            }, /`repeating\.byMonth` contains invalid value `FOO`/);

            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        interval: 2,
                        byMonth: [1, 14, 7]
                    }
                }, new ICalCalendar());
            }, /`repeating\.byMonth` contains invalid value `14`/);
        });

        it('setter should update repeating.byMonth', function () {
            const e = new ICalEvent({}, new ICalCalendar());

            e.repeating({freq: ICalEventRepeatingFreq.MONTHLY, byMonth: [1, 12, 7]});
            assert.deepStrictEqual(e.repeating()?.byMonth, [1, 12, 7]);
        });

        it('should throw error when repeating.byMonthDay is not valid', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    end: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        interval: 2,
                        // @ts-ignore
                        byMonthDay: 'FOO'
                    }
                }, new ICalCalendar());
            }, /`repeating\.byMonthDay` contains invalid value `FOO`/);

            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    end: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        interval: 2,
                        byMonthDay: [1, 32, 15]
                    }
                }, new ICalCalendar());
            }, /`repeating\.byMonthDay` contains invalid value `32`/);
        });

        it('setter should update repeating.byMonthDay', function () {
            const e = new ICalEvent({}, new ICalCalendar());

            e.repeating({freq: ICalEventRepeatingFreq.MONTHLY, byMonthDay: [1, 15]});
            assert.deepStrictEqual(e.repeating()?.byMonthDay, [1, 15]);
        });

        it('should throw error when repeating.bySetPos is not valid', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    end: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.MONTHLY,
                        interval: 2,
                        byDay: [ICalWeekday.SU],
                        bySetPos: 6
                    }
                }, new ICalCalendar());
            }, /`repeating\.bySetPos` contains invalid value `6`/);

            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    end: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.MONTHLY,
                        interval: 2,
                        byDay: [ICalWeekday.SU],
                        // @ts-ignore
                        bySetPos: 'FOO'
                    }
                }, new ICalCalendar());
            }, /`repeating\.bySetPos` contains invalid value `FOO`/);
        });

        it('should throw error when repeating.byDay is not present with repeating.bySetPos', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    end: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.MONTHLY,
                        interval: 2,
                        bySetPos: 6
                    }
                }, new ICalCalendar());
            }, /`repeating\.bySetPos` must be used along with `repeating\.byDay`/);
        });

        it('setter should update repeating.bySetPos', function () {
            const e = new ICalEvent({}, new ICalCalendar());

            e.repeating({
                freq: ICalEventRepeatingFreq.MONTHLY,
                byDay: [ICalWeekday.SU],
                bySetPos: 2
            });

            assert.strictEqual(e.repeating()?.byDay?.length, 1);
            assert.strictEqual(e.repeating()?.bySetPos, 2);
        });

        it('should throw error when repeating.exclude is not valid', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    end: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        interval: 2,
                        byDay: [ICalWeekday.SU],
                        exclude: new Date('FOO')
                    }
                }, new ICalCalendar());
            }, /has to be a valid date/);
        });

        it('should throw error when repeating.exclude is not valid (should throw on first err value', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    end: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        interval: 2,
                        byDay: [ICalWeekday.SU],
                        exclude: [moment(), new Date('BAR'), 'FOO']
                    }
                }, new ICalCalendar());
            }, /has to be a valid date/);
        });

        it('should throw error when repeating.exclude is not a valid type', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    end: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        interval: 2,
                        byDay: [ICalWeekday.SU],
                        // @ts-ignore
                        exclude: 42
                    }
                }, new ICalCalendar());
            }, /`repeating.exclude\[0\]` has to be a valid date!/);
        });

        it('setter should update repeating.exclude', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            const date = moment().add(1, 'week');

            e.repeating({
                freq: ICalEventRepeatingFreq.MONTHLY,
                exclude: [
                    date.toJSON(),
                    date.toDate(),
                    date
                ]
            });

            const result = e.repeating()?.exclude;
            assert.ok(Array.isArray(result));
            assert.strictEqual(result.length, 3);

            assert.deepStrictEqual(result[0], date.toJSON(), 'String');
            assert.deepStrictEqual(result[1], date.toDate(), 'Date');
            assert.deepStrictEqual(result[2], date, 'Moment');
        });

        it('should throw error when repeating.startOfWeek is not valid', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: ICalEventRepeatingFreq.DAILY,
                        interval: 2,
                        // @ts-ignore
                        startOfWeek: 'FOO'
                    }
                }, new ICalCalendar());
            }, /Input must be one of the following: SU, MO, TU, WE, TH, FR, SA/);
        });

        it('setter should update repeating.wkst', function () {
            const e = new ICalEvent({}, new ICalCalendar());

            e.repeating({
                freq: ICalEventRepeatingFreq.MONTHLY,
                startOfWeek: ICalWeekday.SU
            });
            assert.deepStrictEqual(e.repeating()?.startOfWeek, 'SU');
        });
    });

    describe('summary()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.strictEqual(e.summary(), '');

            e.summary('Testevent');
            assert.strictEqual(e.summary(), 'Testevent');
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.summary(''));
            assert.deepStrictEqual(e, e.summary('Testevent'));
        });

        it('should update summary', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.summary('Example Event II');
            assert.strictEqual(event.summary(), 'Example Event II');

            event.summary('');
            assert.strictEqual(event.summary(), '');
        });
    });

    describe('location()', function () {
        it('getter should return value (string)', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.strictEqual(e.location(), null);

            e.location('Test Location');
            assert.deepStrictEqual(e.location(), {title: 'Test Location'});

            e.location(null);
            assert.strictEqual(e.location(), null);
        });

        it('getter should return value (obj)', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.strictEqual(e.location(), null);

            e.location({
                title: 'Foo',
                geo: {lat: 44.5, lon: -3.4}
            });
            assert.deepStrictEqual(e.location()?.title, 'Foo');
            assert.deepStrictEqual(e.location()?.geo, {lat: 44.5, lon: -3.4});

            e.location(null);
            assert.strictEqual(e.location(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.location(null));
            assert.deepStrictEqual(e, e.location('Test Location'));
        });

        it('should update location', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.location('Europa-Park');
            assert.strictEqual(event.location()?.title, 'Europa-Park');
        });

        it('should throw error when location is not valid', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            // @ts-ignore
            assert.throws(() => event.location({geo: 3}), /`location` isn't formatted correctly/i);

            // @ts-ignore
            assert.throws(() => event.location({}), /`location` isn't formatted correctly/i);
        });
    });

    describe('description()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.strictEqual(e.description(), null);

            e.description('I don\'t need a description. I\'m far to awesome for descriptions…');
            assert.strictEqual(e.description(), 'I don\'t need a description. I\'m far to awesome for descriptions…');

            e.description(null);
            assert.strictEqual(e.description(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.description(null));
            assert.deepStrictEqual(e, e.description('I don\'t need a description. I\'m far to awesome for descriptions…'));
        });

        it('should change something', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.description('Well. But other people need descriptions… :/');
            assert.strictEqual(event.description(), 'Well. But other people need descriptions… :/');
        });
    });

    describe('htmlDescription()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.strictEqual(e.htmlDescription(), null);

            e.htmlDescription('<marquee>I\'m the best HTML tag in this universe!</marquee>');
            assert.strictEqual(e.htmlDescription(), '<marquee>I\'m the best HTML tag in this universe!</marquee>');

            e.htmlDescription(null);
            assert.strictEqual(e.htmlDescription(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.htmlDescription(null));
            assert.deepStrictEqual(e, e.htmlDescription('I don\'t need a description. I\'m far to awesome for descriptions…'));
        });

        it('should change something', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.htmlDescription('<marquee>I\'m the best HTML tag in this universe!</marquee>');
            assert.strictEqual(event.htmlDescription(), '<marquee>I\'m the best HTML tag in this universe!</marquee>');
        });
    });

    describe('organizer()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.strictEqual(e.organizer(), null);

            e.organizer(null);
            assert.strictEqual(e.organizer(), null);

            e.organizer({name: 'Sebastian Pekarek', email: 'mail@example.com'});
            assert.strictEqual('Sebastian Pekarek', e.organizer()?.name);
            assert.strictEqual('mail@example.com', e.organizer()?.email);

            e.organizer({name: 'Sebastian Pekarek', email: 'mail@example.com', mailto: 'mail2@example2.com'});
            assert.strictEqual('Sebastian Pekarek', e.organizer()?.name);
            assert.strictEqual('mail@example.com', e.organizer()?.email);
            assert.strictEqual('mail2@example2.com', e.organizer()?.mailto);
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.organizer(null));
            assert.deepStrictEqual(e, e.organizer('Sebastian Pekarek <mail@example.com>'));
        });

        it('should work with objects', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.organizer({name: 'Sebastian Pekarek', email: 'mail@example.com'});
            assert.deepStrictEqual(event.organizer(), {
                name: 'Sebastian Pekarek',
                email: 'mail@example.com',
                mailto: undefined
            });

            event.organizer({name: 'Sebastian Pekarek', email: 'mail@example.com', mailto: 'mail2@example2.com'});
            assert.deepStrictEqual(event.organizer(), {
                name: 'Sebastian Pekarek',
                email: 'mail@example.com',
                mailto: 'mail2@example2.com'
            });
        });

        it('should work with valid strings', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.organizer('Sebastian Pekarek <mail@example.com>');
            assert.deepStrictEqual(event.organizer(), {name: 'Sebastian Pekarek', email: 'mail@example.com'});
        });

        it('should throw error when string misformated', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                e.organizer('foo bar');
            }, /`organizer`/);
        });

        it('should throw error when object misses data', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                // @ts-ignore
                e.organizer({name: 'Sebastian Pekarek'});
            }, /`organizer\.email`/);

            assert.throws(function () {
                // @ts-ignore
                e.organizer({email: 'foo'});
            }, /`organizer\.name`/);
        });

        it('should throw error when unknown format', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                // @ts-ignore
                e.organizer(Infinity);
            }, /`organizer`/);
            assert.throws(function () {
                // @ts-ignore
                e.organizer(NaN);
            }, /`organizer`/);
        });
    });

    describe('createAttendee()', function () {
        it('if Attendee passed, it should add and return it', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const attendee = new ICalAttendee({}, event);

            assert.strictEqual(event.createAttendee(attendee), attendee, 'createAttendee returns attendee');
            assert.deepStrictEqual(event.attendees()[0], attendee, 'attendee pushed');
        });

        it('should return a ICalAttendee instance', function () {
            const event = new ICalEvent({}, new ICalCalendar());

            assert.ok(event.createAttendee({}) instanceof ICalAttendee);
            assert.strictEqual(event.attendees.length, 1, 'attendee pushed');
        });

        it('should accept string', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const attendee = event.createAttendee('Zac <zac@example.com>');

            assert.strictEqual(attendee.name(), 'Zac');
            assert.strictEqual(attendee.email(), 'zac@example.com');
            assert.strictEqual(event.attendees().length, 1, 'attendee pushed');
        });

        it('should throw error when string misformated', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                e.createAttendee('foo bar');
            }, /isn't formated correctly/);
        });

        it('should accept object', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const attendee = event.createAttendee({name: 'Zac', email: 'zac@example.com'});

            assert.strictEqual(attendee.name(), 'Zac');
            assert.strictEqual(attendee.email(), 'zac@example.com');
            assert.strictEqual(event.attendees().length, 1, 'attendee pushed');
        });
    });

    describe('attendees()', function () {
        it('getter should return an array of attendees…', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.strictEqual(event.attendees().length, 0);

            const attendee = event.createAttendee();
            assert.strictEqual(event.attendees().length, 1);
            assert.deepStrictEqual(event.attendees()[0], attendee);
        });

        it('setter should add attendees and return this', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const foo = event.attendees([{name: 'Person A'}, {name: 'Person B'}]);

            assert.strictEqual(event.attendees().length, 2);
            assert.deepStrictEqual(foo, event);
        });
    });

    describe('createAlarm()', function () {
        it('should return a ICalAlarm instance', function () {
            const event = new ICalEvent({}, new ICalCalendar());

            assert.ok(event.createAlarm() instanceof ICalAlarm);
        });

        it('should pass data to instance', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const alarm = event.createAlarm({type: ICalAlarmType.audio});

            assert.strictEqual(alarm.type(), 'audio');
        });
    });

    describe('alarms()', function () {
        it('getter should return an array of alarms…', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.strictEqual(event.alarms().length, 0);

            const alarm = event.createAlarm();
            assert.strictEqual(event.alarms().length, 1);
            assert.deepStrictEqual(event.alarms()[0], alarm);
        });

        it('setter should add alarms and return this', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const foo = event.alarms([
                {type: ICalAlarmType.audio},
                {type: ICalAlarmType.display}
            ]);

            assert.strictEqual(event.alarms().length, 2);
            assert.deepStrictEqual(foo, event);
        });
    });

    describe('createCategory()', function () {
        it('should return a ICalCategory instance', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.ok(event.createCategory() instanceof ICalCategory);
        });

        it('should pass data to instance', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const category = event.createCategory({name: 'foo'});

            assert.strictEqual(category.name(), 'foo');
        });
    });

    describe('categories()', function () {
        it('getter should return an array of categories…', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.strictEqual(event.categories().length, 0);

            const category = event.createCategory();
            assert.strictEqual(event.categories().length, 1);
            assert.deepStrictEqual(event.categories()[0], category);
        });

        it('setter should add category and return this', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const foo = event.categories([
                {name: 'foo'},
                {name: 'bar'}
            ]);

            assert.strictEqual(event.categories().length, 2);
            assert.deepStrictEqual(foo, event);
        });
    });

    describe('status()', function () {
        it('getter should return value', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.strictEqual(event.status(), null);

            event.status(ICalEventStatus.CONFIRMED);
            assert.strictEqual(event.status(), 'CONFIRMED');

            event.status(null);
            assert.strictEqual(event.status(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.status(null));
            assert.deepStrictEqual(e, e.status(ICalEventStatus.CONFIRMED));
        });

        it('setter should allow setting null', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.status(ICalEventStatus.CONFIRMED);
            e.status(null);
            assert.strictEqual(e.status(), null);
        });

        it('setter should allow setting valid value', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.status(ICalEventStatus.CONFIRMED);
            assert.strictEqual(e.status(), 'CONFIRMED');
            assert.strictEqual(e.status(), ICalEventStatus.CONFIRMED);
        });

        it('should throw error when method not allowed', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                // @ts-ignore
                e.status('COOKING');
            }, /Input must be one of the following: CONFIRMED, TENTATIVE, CANCELLED/);
            assert.throws(function () {
                // @ts-ignore
                e.status(Infinity);
            }, /Input must be one of the following: CONFIRMED, TENTATIVE, CANCELLED/);
            assert.throws(function () {
                // @ts-ignore
                e.status(NaN);
            }, /Input must be one of the following: CONFIRMED, TENTATIVE, CANCELLED/);
            assert.throws(function () {
                // @ts-ignore
                e.status(-1);
            }, /Input must be one of the following: CONFIRMED, TENTATIVE, CANCELLED/);
        });
    });

    describe('busystatus()', function () {
        it('getter should return value', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.strictEqual(event.busystatus(), null);

            event.busystatus(ICalEventBusyStatus.BUSY);
            assert.strictEqual(event.busystatus(), 'BUSY');

            event.busystatus(null);
            assert.strictEqual(event.busystatus(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.busystatus(null));
            assert.deepStrictEqual(e, e.busystatus(ICalEventBusyStatus.BUSY));
        });

        it('setter should allow setting null', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.busystatus(ICalEventBusyStatus.BUSY);
            e.busystatus(null);
            assert.strictEqual(e.busystatus(), null);
        });

        it('setter should allow setting valid value', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.busystatus(ICalEventBusyStatus.BUSY);
            assert.strictEqual(e.busystatus(), 'BUSY');
        });

        it('should throw error when method not allowed', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                // @ts-ignore
                e.busystatus('COOKING');
            }, /FREE, TENTATIVE, BUSY, OOF/);
            assert.throws(function () {
                // @ts-ignore
                e.busystatus(Infinity);
            }, /FREE, TENTATIVE, BUSY, OOF/);
            assert.throws(function () {
                // @ts-ignore
                e.busystatus(NaN);
            }, /FREE, TENTATIVE, BUSY, OOF/);
            assert.throws(function () {
                // @ts-ignore
                e.busystatus(-1);
            }, /FREE, TENTATIVE, BUSY, OOF/);
        });
    });

    describe('url()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.strictEqual(e.url(), null);

            e.url('http://sebbo.net/');
            assert.strictEqual(e.url(), 'http://sebbo.net/');
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.url(null));
            assert.deepStrictEqual(e, e.url('http://sebbo.net/'));
        });

        it('should update value', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.url('http://github.com/sebbo2002/ical-generator');
            assert.strictEqual(event.url(), 'http://github.com/sebbo2002/ical-generator');
        });
    });

    describe('created()', function () {
        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.created(new Date()));
        });

        it('setter should work with moment', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.created(moment());
            assert.ok(moment.isMoment(e.created()));
        });

        it('setter should work with Date', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.created(new Date());
            assert.ok(e.created() instanceof Date);
        });

        it('setter should work with String', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.created(moment().toJSON());
            assert.strictEqual(typeof e.created(), 'string');
        });

        it('setter should work with Number', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.created(new Date());
            assert.ok(e.created() instanceof Date);
        });

        it('getter should return value', function () {
            const now = new Date();
            const e = new ICalEvent({}, new ICalCalendar()).created(now);
            assert.deepStrictEqual(e.created()?.valueOf(), now.getTime());
        });

        it('should throw error when created is not a Date', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                e.created('hallo'); // this will produce a "Deprecation warning", sorry 😇
            }, /`created`/);
        });
    });

    describe('lastModified()', function () {
        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.lastModified(new Date()));
        });

        it('setter should work with moment', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.lastModified(moment());
            assert.ok(moment.isMoment(e.lastModified()));
        });

        it('setter should work with Date', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.lastModified(new Date());
            assert.ok(e.lastModified() instanceof Date);
        });

        it('setter should work with String', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            const date = moment().toJSON();
            e.lastModified(date);
            assert.strictEqual(e.lastModified(), date);
        });

        it('setter should work with Number', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.lastModified(new Date());
            assert.ok(e.lastModified() instanceof Date);
        });

        it('getter should return value', function () {
            const now = new Date();
            const e = new ICalEvent({}, new ICalCalendar()).lastModified(now);
            assert.deepStrictEqual(e.lastModified()?.valueOf(), now.getTime());
        });

        it('should throw error when lastModified is not a Date', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                e.lastModified('hallo');
            }, /`lastModified`/);
        });
    });

    describe('x()', function () {
        it('is there', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.x('X-FOO', 'bar'));
        });
    });

    describe('toJSON()', function () {
        it('should maybe work', function () {
            const date = moment().add(1, 'month');
            const event = new ICalEvent({}, new ICalCalendar()).summary('foo').start(date);

            assert.strictEqual(event.toJSON().summary, 'foo', 'summary is okay');
            assert.deepStrictEqual(event.toJSON().start, date.toJSON(), 'start is okay');
            assert.strictEqual(typeof event.toJSON().start, 'string', 'start is string');
        });
    });

    describe('transparency()', function () {
        it('getter should return value', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            assert.strictEqual(event.transparency(), null);

            event.transparency(ICalEventTransparency.OPAQUE);
            assert.strictEqual(event.transparency(), 'OPAQUE');

            event.transparency(null);
            assert.strictEqual(event.transparency(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.deepStrictEqual(e, e.transparency(null));
            assert.deepStrictEqual(e, e.transparency(ICalEventTransparency.TRANSPARENT));
        });

        it('setter should allow setting null', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.transparency(ICalEventTransparency.OPAQUE);
            e.transparency(null);
            assert.strictEqual(e.transparency(), null);
        });

        it('setter should allow setting valid value', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            e.transparency(ICalEventTransparency.OPAQUE);
            assert.strictEqual(e.transparency(), 'OPAQUE');
        });

        it('should throw error when method not allowed', function () {
            const e = new ICalEvent({}, new ICalCalendar());
            assert.throws(function () {
                // @ts-ignore
                e.transparency('COOKING');
            }, /TRANSPARENT, OPAQUE/);
            assert.throws(function () {
                // @ts-ignore
                e.transparency(Infinity);
            }, /TRANSPARENT, OPAQUE/);
            assert.throws(function () {
                // @ts-ignore
                e.transparency(-1);
            }, /TRANSPARENT, OPAQUE/);
        });
    });


    describe('_generate()', function () {
        it('shoult throw an error without start', function () {
            const e = new ICalEvent({
                summary: 'Example Event'
            }, new ICalCalendar());
            assert.throws(function () {
                e.toString();
            }, /`start`/);
        });

        it('should make use of escaping', function () {
            const e = new ICalEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Hel\\\\lo\nW;orl,d'
            }, new ICalCalendar());

            assert.ok(e.toString().indexOf('Hel\\\\\\\\lo\\nW\\;orl\\,d') > -1);
        });

        it('should render correct UIDs', function () {
            const cal = new ICalCalendar();
            const event = new ICalEvent({
                id: 42,
                start: moment(),
                summary: ':)'
            }, cal);

            assert.ok(event.toString().indexOf('UID:42\r') > -1);
        });

        it('should include wkst only if provided', function () {
            const cal = new ICalCalendar();
            let event = new ICalEvent({
                start: moment(),
                end: moment(),
                repeating: {
                    freq: ICalEventRepeatingFreq.WEEKLY
                }
            }, cal);
            assert.ok(!event.toString().includes('WKST'), 'without WKST');

            event = new ICalEvent({
                start: moment(),
                end: moment(),
                repeating: {
                    freq: ICalEventRepeatingFreq.WEEKLY,
                    startOfWeek: ICalWeekday.SU
                }
            }, cal);
            assert.ok(event.toString().includes('WKST'), 'with WKST');
        });
    });
});
