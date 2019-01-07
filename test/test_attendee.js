'use strict';

const assert = require('assert');
const ICalCalendar = require('../src/calendar');
const ICalEvent = require('../src/event');
const ICalAttendee = require('../src/attendee');

describe('ical-generator Attendee', function () {
    describe('constructor()', function () {
        it('shouldn\'t work without event reference', function () {
            assert.throws(function () {
                new ICalAttendee({email: 'foo@bar.com'});
            }, /`event`/);
        });
    });

    describe('name()', function () {
        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.strictEqual(a.name(), null);

            a._data.name = 'Sebastian';
            assert.strictEqual(a.name(), 'Sebastian');
        });

        it('setter should return this', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepStrictEqual(a, a.name(null));
            assert.deepStrictEqual(a, a.name('Sebastian'));
        });

        it('setter should change something', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));

            a.name('Sebastian');
            assert.strictEqual(a._data.name, 'Sebastian');

            a.name(null);
            assert.strictEqual(a._data.name, null);
        });
    });

    describe('email()', function () {
        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar())).email('foo@example.com');
            assert.strictEqual(a.email(), 'foo@example.com');
        });

        it('setter should return this', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepStrictEqual(a, a.email('foo@example.com'));
        });

        it('should change something', function () {
            const a = new ICalAttendee({email: 'mail@example.com'}, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('mail@example.com') > -1);
        });
    });

    describe('mailto()', function () {
        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.strictEqual(a.mailto(), null);

            a._data.mailto = 'foo@example.com';
            assert.strictEqual(a.mailto(), 'foo@example.com');
        });

        it('setter should return this', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepStrictEqual(a, a.mailto(null));
            assert.deepStrictEqual(a, a.mailto('foo@example.com'));
        });

        it('should change mailto and keep email if present', function () {
            const a = new ICalAttendee({email: 'mail@example.com'}, new ICalEvent(null, new ICalCalendar()));
            a.mailto('mail2@example2.com');
            assert.ok(
                a._generate().indexOf('EMAIL=mail@example.com') > -1 &&
                a._generate().indexOf('MAILTO:mail2@example2.com') > -1
            );
        });
    });

    describe('role()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepStrictEqual(a, a.role('req-participant'));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar())).role('req-participant');
            assert.strictEqual(a.role(), 'REQ-PARTICIPANT');
        });

        it('should throw error when method empty', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a.role('');
            }, /`role` must be a non-empty string/);
        });

        it('should throw error when method not allowed', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a.role('COOKING');
            }, /`role` must be one of the following/);
        });

        it('should change something', function () {
            const a = new ICalAttendee({
                email: 'mail@example.com',
                role: 'non-participant'
            }, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('NON-PARTICIPANT') > -1);
        });
    });

    describe('rsvp()', function() {
        it('setter should return this', function() {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepStrictEqual(a, a.rsvp(null));
            assert.deepStrictEqual(a, a.rsvp('TRUE'));
        });

        it('setter should also work with booleans', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));

            a.rsvp(true);
            assert.strictEqual(a._data.rsvp, 'TRUE');

            a.rsvp(false);
            assert.strictEqual(a._data.rsvp, 'FALSE');
        });

        it('getter should return value', function() {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.strictEqual(a.rsvp(), null);
            a.rsvp('false');
            assert.strictEqual(a.rsvp(), 'FALSE');
            a.rsvp(null);
            assert.strictEqual(a.rsvp(), null);
        });

        it('should throw error when method not allowed', function() {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function() {
                a.rsvp('PROBABLY');
            }, /`rsvp` must be one of the following/);
        });

        it('should change something', function() {
            const a = new ICalAttendee({email: 'mail@example.com', rsvp: 'true'}, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf(';RSVP=TRUE') > -1);
        });
    });

    describe('status()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepStrictEqual(a, a.status(null));
            assert.deepStrictEqual(a, a.status('accepted'));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.strictEqual(a.status(), null);

            a.status('accepted');
            assert.strictEqual(a.status(), 'ACCEPTED');

            a.status(null);
            assert.strictEqual(a.status(), null);
        });

        it('should throw error when method not allowed', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a.status('DRINKING');
            }, /`status` must be one of the following/);
        });

        it('should change something', function () {
            const a = new ICalAttendee({email: 'mail@example.com', status: 'declined'}, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('DECLINED') > -1);
        });

        it('should change something too', function () {
            const a = new ICalAttendee({email: 'mail@example.com', status: 'needs-action'}, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('NEEDS-ACTION') > -1);
        });
    });

    describe('type()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepStrictEqual(a.type(null), a);
            assert.deepStrictEqual(a.type('individual'), a);
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.strictEqual(a.type(), null);
            a.type('room');
            assert.strictEqual(a.type(), 'ROOM');
            a.type(null);
            assert.strictEqual(a.type(), null);
        });

        it('should throw error when method not allowed', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a.type('DRINKING');
            }, /`type` must be one of the following/);
        });

        it('should change something', function () {
            const a = new ICalAttendee({
                email: 'mailing-list@example.com',
                type: 'group'
            }, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('GROUP') > -1);
        });
    });

    describe('delegatedTo()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepStrictEqual(a, a.delegatedTo(null));
            assert.deepStrictEqual(a, a.delegatedTo('foo@example.com'));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.strictEqual(a.delegatedTo(), null);

            a.delegatedTo('foo@example.com');
            assert.strictEqual(a.delegatedTo(), 'foo@example.com');

            a.delegatedTo(null);
            assert.strictEqual(a.delegatedTo(), null);
        });

        it('should change something', function () {
            const a = new ICalAttendee({
                email: 'mail@example.com',
                delegatedTo: 'foo@example.com'
            }, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('foo@example') > -1);
        });
    });

    describe('delegatedFrom()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepStrictEqual(a, a.delegatedFrom(null));
            assert.deepStrictEqual(a, a.delegatedFrom('foo@example.com'));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.strictEqual(a.delegatedFrom(), null);
            a.delegatedFrom('foo@example.com');
            assert.strictEqual(a.delegatedFrom(), 'foo@example.com');
            a.delegatedFrom(null);
            assert.strictEqual(a.delegatedFrom(), null);
        });

        it('should change something', function () {
            const a = new ICalAttendee({email: 'mail@example.com', delegatedFrom: 'foo@example.com'}, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('foo@example.com') > -1);
        });
    });

    describe('delegatesTo()', function () {
        it('should return a new ICalAttendee instance by default', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a.delegatesTo() instanceof ICalAttendee);
        });

        it('should reuse the same ICalAttendee instance if passed', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const attendee = new ICalAttendee({name: 'Muh'}, event);

            assert.deepStrictEqual(new ICalAttendee(null, event).delegatesTo(attendee), attendee);
        });

        it('should pass data to instance', function () {
            const attendee = new ICalAttendee({name: 'Zac'}, new ICalEvent(null, new ICalCalendar()))
                .delegatesTo({name: 'Cody'});

            assert.strictEqual(attendee.name(), 'Cody');
        });
    });

    describe('delegatesFrom()', function () {
        it('should return a new ICalAttendee instance by default', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a.delegatesFrom() instanceof ICalAttendee);
        });

        it('should reuse the same ICalAttendee instance if passed', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const attendee = new ICalAttendee({name: 'Muh'}, event);

            assert.deepStrictEqual(new ICalAttendee(null, event).delegatesFrom(attendee), attendee);
        });

        it('should pass data to instance', function () {
            const a = new ICalAttendee({name: 'Zac'}, new ICalEvent(null, new ICalCalendar())).delegatesFrom({name: 'Cody'});
            assert.strictEqual(a.name(), 'Cody');
        });
    });

    describe('toJSON()', function () {
        it('should work', function() {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            a.name('Max Mustermann');
            a.delegatesTo('Moritz <moritz@example.com>');

            assert.deepStrictEqual(a.toJSON(), {
                role: 'REQ-PARTICIPANT',
                name: 'Max Mustermann',
                delegatedTo: 'moritz@example.com',
                status: 'DELEGATED'
            });
        });
    });

    describe('generate()', function () {
        it('should throw an error without email', function () {
            const a = new ICalAttendee({name: 'Testuser'}, new ICalEvent(null, new ICalCalendar()));
            assert.throws(function () {
                a._generate();
            }, /`email`/);
        });
    });
});
