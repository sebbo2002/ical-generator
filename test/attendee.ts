'use strict';

import assert from 'assert';

import ICalAttendee, {
    type ICalAttendeeData,
    ICalAttendeeRole,
    ICalAttendeeStatus,
    ICalAttendeeType,
} from '../src/attendee.js';
import ICalCalendar from '../src/calendar.js';
import ICalEvent from '../src/event.js';

describe('ical-generator Attendee', function () {
    describe('constructor()', function () {
        it('shoud set data from constructor', function () {
            const data: ICalAttendeeData = {
                delegatedFrom: null,
                delegatedTo: null,
                email: 'john@example.org',
                mailto: 'john+calendar@example.org',
                name: 'John Doe',
                role: ICalAttendeeRole.REQ,
                rsvp: false,
                sentBy: null,
                status: ICalAttendeeStatus.ACCEPTED,
                type: ICalAttendeeType.INDIVIDUAL,
                x: [],
            };
            const event = new ICalAttendee(
                data,
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.deepStrictEqual(event.toJSON(), data);
        });

        it("shouldn't work without event reference", function () {
            assert.throws(function () {
                // @ts-ignore
                new ICalAttendee({ email: 'foo@bar.com' });
            }, /`event`/);
        });

        it('should throw an error without email', function () {
            assert.throws(function () {
                new ICalAttendee(
                    // @ts-ignore
                    { name: 'Testuser' },
                    new ICalEvent({ start: new Date() }, new ICalCalendar()),
                );
            }, /`email`/);
        });
    });

    describe('name()', function () {
        it('getter should return value', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.strictEqual(a.name(), null);

            a.name('Sebastian');
            assert.strictEqual(a.name(), 'Sebastian');
        });

        it('setter should return this', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.deepStrictEqual(a, a.name(null));
            assert.deepStrictEqual(a, a.name('Sebastian'));
        });

        it('setter should change something', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );

            a.name('Sebastian');
            assert.strictEqual(a.name(), 'Sebastian');

            a.name(null);
            assert.strictEqual(a.name(), null);
        });
    });

    describe('email()', function () {
        it('getter should return value', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            ).email('foo@example.com');
            assert.strictEqual(a.email(), 'foo@example.com');
        });

        it('setter should return this', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.deepStrictEqual(a, a.email('foo@example.com'));
        });

        it('should change something', function () {
            const a = new ICalAttendee(
                { email: 'mail@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.ok(a.toString().indexOf('mail@example.com') > -1);
        });
    });

    describe('mailto()', function () {
        it('getter should return value', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.strictEqual(a.mailto(), null);

            a.mailto('foo@example.com');
            assert.strictEqual(a.mailto(), 'foo@example.com');
        });

        it('setter should return this', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.deepStrictEqual(a, a.mailto(null));
            assert.deepStrictEqual(a, a.mailto('foo@example.com'));
        });

        it('should change mailto and keep email if present', function () {
            const a = new ICalAttendee(
                { email: 'mail@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            a.mailto('mail2@example2.com');
            assert.ok(
                a.toString().indexOf('EMAIL=mail@example.com') > -1 &&
                    a.toString().indexOf('MAILTO:mail2@example2.com') > -1,
            );
        });
    });

    describe('sentBy()', function () {
        it('getter should return value', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            ).sentBy('foo@example.com');
            assert.strictEqual(a.sentBy(), 'foo@example.com');
        });

        it('setter should return this', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.deepStrictEqual(a, a.sentBy('foo@example.com'));
        });

        it('should change something', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com', sentBy: 'bar@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.ok(a.toString().includes('bar@example.com'));
        });
    });

    describe('role()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.deepStrictEqual(a, a.role(ICalAttendeeRole.REQ));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            ).role(ICalAttendeeRole.REQ);
            assert.strictEqual(a.role(), 'REQ-PARTICIPANT');
        });

        it('should throw error when method empty', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.throws(function () {
                // @ts-ignore
                a.role('');
            }, /Input must be one of the following: CHAIR, NON-PARTICIPANT, OPT-PARTICIPANT, REQ-PARTICIPANT/);
        });

        it('should throw error when method not allowed', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.throws(function () {
                // @ts-ignore
                a.role('COOKING');
            }, /must be one of the following/);
        });

        it('should change something', function () {
            const a = new ICalAttendee(
                { email: 'mail@example.com', role: ICalAttendeeRole.NON },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.ok(a.toString().indexOf('NON-PARTICIPANT') > -1);
        });
    });

    describe('rsvp()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.deepStrictEqual(a, a.rsvp(null));
            assert.deepStrictEqual(a, a.rsvp(true));
        });

        it('setter should also work with booleans', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );

            a.rsvp(true);
            assert.strictEqual(a.rsvp(), true);

            a.rsvp(false);
            assert.strictEqual(a.rsvp(), false);
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.strictEqual(a.rsvp(), null);
            a.rsvp(false);
            assert.strictEqual(a.rsvp(), false);
            a.rsvp(null);
            assert.strictEqual(a.rsvp(), null);
        });

        it('should change something', function () {
            const a = new ICalAttendee(
                { email: 'mail@example.com', rsvp: true },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.ok(a.toString().indexOf(';RSVP=TRUE') > -1);
        });
    });

    describe('status()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.deepStrictEqual(a, a.status(null));
            assert.deepStrictEqual(a, a.status(ICalAttendeeStatus.ACCEPTED));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.strictEqual(a.status(), null);

            a.status(ICalAttendeeStatus.ACCEPTED);
            assert.strictEqual(a.status(), 'ACCEPTED');

            a.status(null);
            assert.strictEqual(a.status(), null);
        });

        it('should throw error when method not allowed', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.throws(function () {
                // @ts-ignore
                a.status('DRINKING');
            }, /must be one of the following/);
        });

        it('should change something', function () {
            const a = new ICalAttendee(
                {
                    email: 'mail@example.com',
                    status: ICalAttendeeStatus.DECLINED,
                },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.ok(a.toString().indexOf('DECLINED') > -1);
        });

        it('should change something too', function () {
            const a = new ICalAttendee(
                {
                    email: 'mail@example.com',
                    status: ICalAttendeeStatus.NEEDSACTION,
                },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.ok(a.toString().indexOf('NEEDS-ACTION') > -1);
        });
    });

    describe('type()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.deepStrictEqual(a.type(null), a);
            assert.deepStrictEqual(a.type(ICalAttendeeType.INDIVIDUAL), a);
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.strictEqual(a.type(), null);
            a.type(ICalAttendeeType.ROOM);
            assert.strictEqual(a.type(), 'ROOM');
            a.type(null);
            assert.strictEqual(a.type(), null);
        });

        it('should throw error when method not allowed', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.throws(function () {
                // @ts-ignore
                a.type('DRINKING');
            }, /must be one of the following/);
        });

        it('should change something', function () {
            const a = new ICalAttendee(
                {
                    email: 'mailing-list@example.com',
                    type: ICalAttendeeType.GROUP,
                },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.ok(a.toString().indexOf('GROUP') > -1);
        });
    });

    describe('delegatedTo()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.deepStrictEqual(a, a.delegatedTo(null));
            assert.deepStrictEqual(a, a.delegatedTo('foo@example.com'));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.strictEqual(a.delegatedTo(), null);

            a.delegatedTo('foo@example.com');
            const result = a.delegatedTo();
            assert.ok(result);
            assert.strictEqual(result.email(), 'foo@example.com');

            a.delegatedTo(null);
            assert.strictEqual(a.delegatedTo(), null);
        });

        it('should change something', function () {
            const a = new ICalAttendee(
                {
                    delegatedTo: 'foo@example.com',
                    email: 'mail@example.com',
                },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.ok(a.toString().indexOf('foo@example') > -1);
        });
    });

    describe('delegatedFrom()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.deepStrictEqual(a, a.delegatedFrom(null));
            assert.deepStrictEqual(a, a.delegatedFrom('foo@example.com'));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.strictEqual(a.delegatedFrom(), null);

            a.delegatedFrom('foo@example.com');
            let result = a.delegatedFrom();
            assert.ok(result);
            assert.strictEqual(result.email(), 'foo@example.com');

            a.delegatedFrom({
                email: 'max.mustermann@example.com',
                name: 'Max Mustermann',
            });
            result = a.delegatedFrom();
            assert.ok(result);
            assert.strictEqual(result.name(), 'Max Mustermann');
            assert.strictEqual(result.email(), 'max.mustermann@example.com');

            a.delegatedFrom(null);
            assert.strictEqual(a.delegatedFrom(), null);
        });

        it('should change something', function () {
            const a = new ICalAttendee(
                {
                    delegatedFrom: 'foo@example.com',
                    email: 'mail@example.com',
                },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.ok(a.toString().indexOf('foo@example.com') > -1);
        });
    });

    describe('delegatesTo()', function () {
        it('should return a new ICalAttendee instance by default', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.ok(
                a.delegatesTo({ email: 'mail@example.com' }) instanceof
                    ICalAttendee,
            );
        });

        it('should reuse the same ICalAttendee instance if passed', function () {
            const event = new ICalEvent(
                { start: new Date() },
                new ICalCalendar(),
            );
            const attendee = new ICalAttendee(
                {
                    email: 'muh@example.com',
                    name: 'Muh',
                },
                event,
            );

            assert.deepStrictEqual(
                new ICalAttendee(
                    { email: 'foo@example.com' },
                    event,
                ).delegatesTo(attendee),
                attendee,
            );
        });

        it('should pass data to instance', function () {
            const attendee = new ICalAttendee(
                { email: 'zac@example.com', name: 'Zac' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            ).delegatesTo({ email: 'cody@example.com', name: 'Cody' });

            assert.strictEqual(attendee.name(), 'Cody');
        });
    });

    describe('delegatesFrom()', function () {
        it('should return a new ICalAttendee instance by default', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.ok(
                a.delegatesFrom({
                    email: 'bar@example.com',
                }) instanceof ICalAttendee,
            );
        });

        it('should reuse the same ICalAttendee instance if passed', function () {
            const event = new ICalEvent(
                { start: new Date() },
                new ICalCalendar(),
            );
            const attendee = new ICalAttendee(
                {
                    email: 'muh@example.com',
                    name: 'Muh',
                },
                event,
            );

            assert.deepStrictEqual(
                new ICalAttendee(
                    { email: 'bar@example.com' },
                    event,
                ).delegatesFrom(attendee),
                attendee,
            );
        });

        it('should pass data to instance', function () {
            const a = new ICalAttendee(
                { email: 'zac@example.com', name: 'Zac' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            ).delegatesFrom({ email: 'cody@example.com', name: 'Cody' });
            assert.strictEqual(a.name(), 'Cody');

            const b = new ICalAttendee(
                {
                    delegatesFrom: { email: 'cody@example.com', name: 'Cody' },
                    email: 'zac@example.com',
                    name: 'Zac',
                },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.strictEqual(b.name(), 'Zac');
        });
    });

    describe('x()', function () {
        it('works as expected', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.org' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            assert.deepStrictEqual(a, a.x('X-NUM-GUESTS', '5'));
            assert.ok(
                a
                    .toString()
                    .includes(
                        'ATTENDEE;ROLE=REQ-PARTICIPANT;X-NUM-GUESTS=5:MAILTO:foo@example.org',
                    ),
            );
        });
    });

    describe('toJSON()', function () {
        it('should work', function () {
            const a = new ICalAttendee(
                { email: 'max@example.com', name: 'Max Mustermann' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            a.delegatesTo('Moritz <moritz@example.com>');

            assert.deepStrictEqual(a.toJSON(), {
                delegatedFrom: null,
                delegatedTo: 'moritz@example.com',
                email: 'max@example.com',
                mailto: null,
                name: 'Max Mustermann',
                role: 'REQ-PARTICIPANT',
                rsvp: null,
                sentBy: null,
                status: 'DELEGATED',
                type: null,
                x: [],
            });
        });

        it('should be compatible with constructor (type check)', function () {
            const a = new ICalAttendee(
                { email: 'foo@example.com' },
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
            new ICalAttendee(
                a.toJSON(),
                new ICalEvent({ start: new Date() }, new ICalCalendar()),
            );
        });
    });
});
