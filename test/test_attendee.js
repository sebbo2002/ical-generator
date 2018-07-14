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
            assert.equal(a.name(), null);

            a._data.name = 'Sebastian';
            assert.equal(a.name(), 'Sebastian');
        });

        it('setter should return this', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepEqual(a, a.name(null));
            assert.deepEqual(a, a.name('Sebastian'));
        });

        it('setter should change something', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));

            a.name('Sebastian');
            assert.equal(a._data.name, 'Sebastian');

            a.name(null);
            assert.equal(a._data.name, null);
        });
    });

    describe('email()', function () {
        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar())).email('foo@example.com');
            assert.equal(a.email(), 'foo@example.com');
        });

        it('setter should return this', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepEqual(a, a.email('foo@example.com'));
        });

        it('should change something', function () {
            const a = new ICalAttendee({email: 'mail@example.com'}, new ICalEvent(null, new ICalCalendar()));
            assert.ok(a._generate().indexOf('mail@example.com') > -1);
        });
    });

    describe('role()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepEqual(a, a.role('req-participant'));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar())).role('req-participant');
            assert.equal(a.role(), 'REQ-PARTICIPANT');
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
            assert.deepEqual(a, a.rsvp(null));
            assert.deepEqual(a, a.rsvp('TRUE'));
        });

        it('setter should also work with booleans', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));

            a.rsvp(true);
            assert.equal(a._data.rsvp, 'TRUE');

            a.rsvp(false);
            assert.equal(a._data.rsvp, 'FALSE');
        });

        it('getter should return value', function() {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.equal(a.rsvp(), null);
            a.rsvp('false');
            assert.equal(a.rsvp(), 'FALSE');
            a.rsvp(null);
            assert.equal(a.rsvp(), null);
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
            assert.deepEqual(a, a.status(null));
            assert.deepEqual(a, a.status('accepted'));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.equal(a.status(), null);

            a.status('accepted');
            assert.equal(a.status(), 'ACCEPTED');

            a.status(null);
            assert.equal(a.status(), null);
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
    });

    describe('type()', function () {
        it('setter should return this', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.deepEqual(a.type(null), a);
            assert.deepEqual(a.type('individual'), a);
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.equal(a.type(), null);
            a.type('room');
            assert.equal(a.type(), 'ROOM');
            a.type(null);
            assert.equal(a.type(), null);
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
            assert.deepEqual(a, a.delegatedTo(null));
            assert.deepEqual(a, a.delegatedTo('foo@example.com'));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.equal(a.delegatedTo(), null);

            a.delegatedTo('foo@example.com');
            assert.equal(a.delegatedTo(), 'foo@example.com');

            a.delegatedTo(null);
            assert.equal(a.delegatedTo(), null);
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
            assert.deepEqual(a, a.delegatedFrom(null));
            assert.deepEqual(a, a.delegatedFrom('foo@example.com'));
        });

        it('getter should return value', function () {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            assert.equal(a.delegatedFrom(), null);
            a.delegatedFrom('foo@example.com');
            assert.equal(a.delegatedFrom(), 'foo@example.com');
            a.delegatedFrom(null);
            assert.equal(a.delegatedFrom(), null);
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

            assert.deepEqual(new ICalAttendee(null, event).delegatesTo(attendee), attendee);
        });

        it('should pass data to instance', function () {
            const attendee = new ICalAttendee({name: 'Zac'}, new ICalEvent(null, new ICalCalendar()))
                .delegatesTo({name: 'Cody'});

            assert.equal(attendee.name(), 'Cody');
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

            assert.deepEqual(new ICalAttendee(null, event).delegatesFrom(attendee), attendee);
        });

        it('should pass data to instance', function () {
            const a = new ICalAttendee({name: 'Zac'}, new ICalEvent(null, new ICalCalendar())).delegatesFrom({name: 'Cody'});
            assert.equal(a.name(), 'Cody');
        });
    });

    describe('toJSON()', function () {
        it('should work', function() {
            const a = new ICalAttendee(null, new ICalEvent(null, new ICalCalendar()));
            a.name('Max Mustermann');
            a.delegatesTo('Moritz <moritz@example.com>');

            assert.deepEqual(a.toJSON(), {
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