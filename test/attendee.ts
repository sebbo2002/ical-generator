'use strict';

import assert from 'assert';
import ICalCalendar from '../src/calendar';
import ICalEvent from '../src/event';
import ICalAttendee, {ICalAttendeeRole, ICalAttendeeStatus, ICalAttendeeType} from '../src/attendee';

describe('ical-generator Attendee', function () {
    describe('constructor()', function () {
        it('shouldn\'t work without event reference', function () {
            assert.throws(function () {
                // @ts-ignore
                new ICalAttendee({email: 'foo@bar.com'});
            }, /`event`/);
        });
    });

    describe('name()', function () {
        it('getter should return value', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.strictEqual(a.name(), null);

            a.name('Sebastian');
            assert.strictEqual(a.name(), 'Sebastian');
        });

        it('setter should return this', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.name(null));
            assert.deepStrictEqual(a, a.name('Sebastian'));
        });

        it('setter should change something', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));

            a.name('Sebastian');
            assert.strictEqual(a.name(), 'Sebastian');

            a.name(null);
            assert.strictEqual(a.name(), null);
        });
    });

    describe('email()', function () {
        it('getter should return value', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar())).email('foo@example.com');
            assert.strictEqual(a.email(), 'foo@example.com');
        });

        it('setter should return this', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.email('foo@example.com'));
        });

        it('should change something', function () {
            const a = new ICalAttendee({email: 'mail@example.com'}, new ICalEvent({}, new ICalCalendar()));
            assert.ok(a.toString().indexOf('mail@example.com') > -1);
        });
    });

    describe('mailto()', function () {
        it('getter should return value', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.strictEqual(a.mailto(), null);

            a.mailto('foo@example.com');
            assert.strictEqual(a.mailto(), 'foo@example.com');
        });

        it('setter should return this', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.mailto(null));
            assert.deepStrictEqual(a, a.mailto('foo@example.com'));
        });

        it('should change mailto and keep email if present', function () {
            const a = new ICalAttendee({email: 'mail@example.com'}, new ICalEvent({}, new ICalCalendar()));
            a.mailto('mail2@example2.com');
            assert.ok(
                a.toString().indexOf('EMAIL=mail@example.com') > -1 &&
                a.toString().indexOf('MAILTO:mail2@example2.com') > -1
            );
        });
    });

    describe('role()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.role(ICalAttendeeRole.REQ));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar())).role(ICalAttendeeRole.REQ);
            assert.strictEqual(a.role(), 'REQ-PARTICIPANT');
        });

        it('should throw error when method empty', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                // @ts-ignore
                a.role('');
            }, /Input must be one of the following: CHAIR, REQ-PARTICIPANT, OPT-PARTICIPANT, NON-PARTICIPANT/);
        });

        it('should throw error when method not allowed', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                // @ts-ignore
                a.role('COOKING');
            }, /must be one of the following/);
        });

        it('should change something', function () {
            const a = new ICalAttendee({
                email: 'mail@example.com',
                role: ICalAttendeeRole.NON
            }, new ICalEvent({}, new ICalCalendar()));
            assert.ok(a.toString().indexOf('NON-PARTICIPANT') > -1);
        });
    });

    describe('rsvp()', function() {
        it('setter should return this', function() {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.rsvp(null));
            assert.deepStrictEqual(a, a.rsvp(true));
        });

        it('setter should also work with booleans', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));

            a.rsvp(true);
            assert.strictEqual(a.rsvp(), true);

            a.rsvp(false);
            assert.strictEqual(a.rsvp(), false);
        });

        it('getter should return value', function() {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.strictEqual(a.rsvp(), null);
            a.rsvp(false);
            assert.strictEqual(a.rsvp(), false);
            a.rsvp(null);
            assert.strictEqual(a.rsvp(), null);
        });

        it('should change something', function() {
            const a = new ICalAttendee({email: 'mail@example.com', rsvp: true}, new ICalEvent({}, new ICalCalendar()));
            assert.ok(a.toString().indexOf(';RSVP=TRUE') > -1);
        });
    });

    describe('status()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.status(null));
            assert.deepStrictEqual(a, a.status(ICalAttendeeStatus.ACCEPTED));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.strictEqual(a.status(), null);

            a.status(ICalAttendeeStatus.ACCEPTED);
            assert.strictEqual(a.status(), 'ACCEPTED');

            a.status(null);
            assert.strictEqual(a.status(), null);
        });

        it('should throw error when method not allowed', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                // @ts-ignore
                a.status('DRINKING');
            }, /must be one of the following/);
        });

        it('should change something', function () {
            const a = new ICalAttendee(
                {email: 'mail@example.com', status: ICalAttendeeStatus.DECLINED},
                new ICalEvent({}, new ICalCalendar())
            );
            assert.ok(a.toString().indexOf('DECLINED') > -1);
        });

        it('should change something too', function () {
            const a = new ICalAttendee(
                {email: 'mail@example.com', status: ICalAttendeeStatus.NEEDSACTION},
                new ICalEvent({}, new ICalCalendar())
            );
            assert.ok(a.toString().indexOf('NEEDS-ACTION') > -1);
        });
    });

    describe('type()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a.type(null), a);
            assert.deepStrictEqual(a.type(ICalAttendeeType.INDIVIDUAL), a);
        });

        it('getter should return value', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.strictEqual(a.type(), null);
            a.type(ICalAttendeeType.ROOM);
            assert.strictEqual(a.type(), 'ROOM');
            a.type(null);
            assert.strictEqual(a.type(), null);
        });

        it('should throw error when method not allowed', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                // @ts-ignore
                a.type('DRINKING');
            }, /must be one of the following/);
        });

        it('should change something', function () {
            const a = new ICalAttendee({
                email: 'mailing-list@example.com',
                type: ICalAttendeeType.GROUP
            }, new ICalEvent({}, new ICalCalendar()));
            assert.ok(a.toString().indexOf('GROUP') > -1);
        });
    });

    describe('delegatedTo()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.delegatedTo(null));
            assert.deepStrictEqual(a, a.delegatedTo('foo@example.com'));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.strictEqual(a.delegatedTo(), null);

            a.delegatedTo('foo@example.com');
            const result = a.delegatedTo();
            assert.ok(result);
            assert.strictEqual(result.email(), 'foo@example.com');

            a.delegatedTo(null);
            assert.strictEqual(a.delegatedTo(), null);
        });

        it('should change something', function () {
            const a = new ICalAttendee({
                email: 'mail@example.com',
                delegatedTo: 'foo@example.com'
            }, new ICalEvent({}, new ICalCalendar()));
            assert.ok(a.toString().indexOf('foo@example') > -1);
        });
    });

    describe('delegatedFrom()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.deepStrictEqual(a, a.delegatedFrom(null));
            assert.deepStrictEqual(a, a.delegatedFrom('foo@example.com'));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.strictEqual(a.delegatedFrom(), null);

            a.delegatedFrom('foo@example.com');
            const result = a.delegatedFrom();
            assert.ok(result);
            assert.strictEqual(result.email(), 'foo@example.com');

            a.delegatedFrom(null);
            assert.strictEqual(a.delegatedFrom(), null);
        });

        it('should change something', function () {
            const a = new ICalAttendee({email: 'mail@example.com', delegatedFrom: 'foo@example.com'}, new ICalEvent({}, new ICalCalendar()));
            assert.ok(a.toString().indexOf('foo@example.com') > -1);
        });
    });

    describe('delegatesTo()', function () {
        it('should return a new ICalAttendee instance by default', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.ok(a.delegatesTo({}) instanceof ICalAttendee);
        });

        it('should reuse the same ICalAttendee instance if passed', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const attendee = new ICalAttendee({name: 'Muh'}, event);

            assert.deepStrictEqual(new ICalAttendee({}, event).delegatesTo(attendee), attendee);
        });

        it('should pass data to instance', function () {
            const attendee = new ICalAttendee({name: 'Zac'}, new ICalEvent({}, new ICalCalendar()))
                .delegatesTo({name: 'Cody'});

            assert.strictEqual(attendee.name(), 'Cody');
        });
    });

    describe('delegatesFrom()', function () {
        it('should return a new ICalAttendee instance by default', function () {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            assert.ok(a.delegatesFrom({}) instanceof ICalAttendee);
        });

        it('should reuse the same ICalAttendee instance if passed', function () {
            const event = new ICalEvent({}, new ICalCalendar());
            const attendee = new ICalAttendee({name: 'Muh'}, event);

            assert.deepStrictEqual(new ICalAttendee({}, event).delegatesFrom(attendee), attendee);
        });

        it('should pass data to instance', function () {
            const a = new ICalAttendee({name: 'Zac'}, new ICalEvent({}, new ICalCalendar())).delegatesFrom({name: 'Cody'});
            assert.strictEqual(a.name(), 'Cody');
        });
    });

    describe('toJSON()', function () {
        it('should work', function() {
            const a = new ICalAttendee({}, new ICalEvent({}, new ICalCalendar()));
            a.name('Max Mustermann');
            a.delegatesTo('Moritz <moritz@example.com>');

            assert.deepStrictEqual(a.toJSON(), {
                delegatedFrom: null,
                delegatedTo: 'moritz@example.com',
                email: null,
                mailto: null,
                name: 'Max Mustermann',
                role: 'REQ-PARTICIPANT',
                rsvp: null,
                status: 'DELEGATED',
                type: null
            });
        });
    });

    describe('generate()', function () {
        it('should throw an error without email', function () {
            const a = new ICalAttendee({name: 'Testuser'}, new ICalEvent({}, new ICalCalendar()));
            assert.throws(function () {
                a.toString();
            }, /`email`/);
        });
    });
});
