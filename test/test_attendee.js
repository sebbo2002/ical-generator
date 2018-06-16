'use strict';

const assert = require('assert');
const moment = require('moment-timezone');
const ical = require(__dirname + '/../src');

describe('ical-generator Attendee', function () {
    describe('constructor()', function () {
        it('shouldn\'t work without event reference', function () {
            const ICalAttendee = require('../src/attendee');
            assert.throws(function () {
                new ICalAttendee({email: 'foo@bar.com'});
            }, /`event`/);
        });
    });

    describe('name()', function () {
        it('getter should return value', function () {
            const a = ical().createEvent().createAttendee();
            assert.equal(a.name(), null);

            a._data.name = 'Sebastian';
            assert.equal(a.name(), 'Sebastian');
        });

        it('setter should return this', function () {
            const a = ical().createEvent().createAttendee();
            assert.deepEqual(a, a.name(null));
            assert.deepEqual(a, a.name('Sebastian'));
        });

        it('setter should change something', function () {
            const a = ical().createEvent({start: new Date(), summary: 'Example Event'}).createAttendee();

            a.name('Sebastian');
            assert.equal(a._data.name, 'Sebastian');

            a.name(null);
            assert.equal(a._data.name, null);
        });
    });

    describe('email()', function () {
        it('getter should return value', function () {
            const e = ical().createEvent().createAttendee().email('foo@example.com');
            assert.equal(e.email(), 'foo@example.com');
        });

        it('setter should return this', function () {
            const a = ical().createEvent().createAttendee();
            assert.deepEqual(a, a.email('foo@example.com'));
        });

        it('should change something', function () {
            const cal = ical(),
                event = cal.createEvent({
                    start: moment(),
                    summary: 'Example Event'
                });

            event.createAttendee({email: 'mail@example.com'});
            assert.ok(cal.toString().indexOf('mail@example.com') > -1);
        });
    });

    describe('role()', function () {
        it('setter should return this', function () {
            const a = ical().createEvent().createAttendee();
            assert.deepEqual(a, a.role('req-participant'));
        });

        it('getter should return value', function () {
            const a = ical().createEvent().createAttendee().role('req-participant');
            assert.equal(a.role(), 'REQ-PARTICIPANT');
        });

        it('should throw error when method empty', function () {
            const a = ical().createEvent().createAttendee();
            assert.throws(function () {
                a.role('');
            }, /`role` must be a non-empty string/);
        });

        it('should throw error when method not allowed', function () {
            const a = ical().createEvent().createAttendee();
            assert.throws(function () {
                a.role('COOKING');
            }, /`role` must be one of the following/);
        });

        it('should change something', function () {
            const cal = ical();
            const event = cal.createEvent({
                start: moment(),
                summary: 'Example Event'
            });

            event.createAttendee({email: 'mail@example.com', role: 'non-participant'});
            assert.ok(cal.toString().indexOf('NON-PARTICIPANT') > -1);
        });
    });

    describe('status()', function () {
        it('setter should return this', function () {
            const a = ical().createEvent().createAttendee();
            assert.deepEqual(a, a.status(null));
            assert.deepEqual(a, a.status('accepted'));
        });

        it('getter should return value', function () {
            const a = ical().createEvent().createAttendee();
            assert.equal(a.status(), null);

            a.status('accepted');
            assert.equal(a.status(), 'ACCEPTED');

            a.status(null);
            assert.equal(a.status(), null);
        });

        it('should throw error when method not allowed', function () {
            const a = ical().createEvent().createAttendee();
            assert.throws(function () {
                a.status('DRINKING');
            }, /`status` must be one of the following/);
        });

        it('should change something', function () {
            const cal = ical();
            const event = cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            event.createAttendee({email: 'mail@example.com', status: 'declined'});
            assert.ok(cal.toString().indexOf('DECLINED') > -1);
        });
    });

    describe('type()', function () {
        it('setter should return this', function () {
            const a = ical().createEvent().createAttendee();
            assert.deepEqual(a.type(null), a);
            assert.deepEqual(a.type('individual'), a);
        });

        it('getter should return value', function () {
            const a = ical().createEvent().createAttendee();
            assert.equal(a.type(), null);
            a.type('room');
            assert.equal(a.type(), 'ROOM');
            a.type(null);
            assert.equal(a.type(), null);
        });

        it('should throw error when method not allowed', function () {
            const a = ical().createEvent().createAttendee();
            assert.throws(function () {
                a.type('DRINKING');
            }, /`type` must be one of the following/);
        });

        it('should change something', function () {
            const cal = ical();
            const event = cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            event.createAttendee({email: 'mailing-list@example.com', type: 'group'});
            assert.ok(cal.toString().indexOf('GROUP') > -1);
        });
    });

    describe('delegatedTo()', function () {
        it('setter should return this', function () {
            const a = ical().createEvent().createAttendee();
            assert.deepEqual(a, a.delegatedTo(null));
            assert.deepEqual(a, a.delegatedTo('foo@example.com'));
        });

        it('getter should return value', function () {
            const a = ical().createEvent().createAttendee();
            assert.equal(a.delegatedTo(), null);

            a.delegatedTo('foo@example.com');
            assert.equal(a.delegatedTo(), 'foo@example.com');

            a.delegatedTo(null);
            assert.equal(a.delegatedTo(), null);
        });

        it('should change something', function () {
            const cal = ical();
            const event = cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            event.createAttendee({email: 'mail@example.com', delegatedTo: 'foo@example.com'});
            assert.ok(cal.toString().indexOf('foo@example') > -1);
        });
    });

    describe('delegatedFrom()', function () {
        it('setter should return this', function () {
            const a = ical().createEvent().createAttendee();
            assert.deepEqual(a, a.delegatedFrom(null));
            assert.deepEqual(a, a.delegatedFrom('foo@example.com'));
        });

        it('getter should return value', function () {
            const a = ical().createEvent().createAttendee();
            assert.equal(a.delegatedFrom(), null);
            a.delegatedFrom('foo@example.com');
            assert.equal(a.delegatedFrom(), 'foo@example.com');
            a.delegatedFrom(null);
            assert.equal(a.delegatedFrom(), null);
        });

        it('should change something', function () {
            const cal = ical();
            const event = cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            event.createAttendee({email: 'mail@example.com', delegatedFrom: 'foo@example.com'});
            assert.ok(cal.toString().indexOf('foo@example.com') > -1);
        });
    });

    describe('delegatesTo()', function () {
        it('should return a new ICalAttendee instance by default', function () {
            const event = ical().createEvent();
            const ICalAttendee = require('../src/attendee');

            assert.ok(event.createAttendee().delegatesTo() instanceof ICalAttendee);
        });

        it('should reuse the same ICalAttendee instance if passed', function () {
            const event = ical().createEvent();
            const attendee = event.createAttendee({name: 'Zac'}).delegatesTo({name: 'Cody'});

            assert.deepEqual(event.createAttendee().delegatesTo(attendee), attendee);
        });

        it('should pass data to instance', function () {
            const event = ical().createEvent();
            const attendee = event.createAttendee({name: 'Zac'}).delegatesTo({name: 'Cody'});

            assert.equal(attendee.name(), 'Cody');
        });
    });

    describe('delegatesFrom()', function () {
        it('should return a new ICalAttendee instance by default', function () {
            const event = ical().createEvent();
            const ICalAttendee = require('../src/attendee');

            assert.ok(event.createAttendee().delegatesFrom() instanceof ICalAttendee);
        });

        it('should reuse the same ICalAttendee instance if passed', function () {
            const event = ical().createEvent();
            const attendee = event.createAttendee({name: 'Muh'});

            assert.deepEqual(event.createAttendee().delegatesFrom(attendee), attendee);
        });

        it('should pass data to instance', function () {
            const event = ical().createEvent();
            const attendee = event.createAttendee({name: 'Zac'}).delegatesFrom({name: 'Cody'});

            assert.equal(attendee.name(), 'Cody');
        });
    });

    describe('generate()', function () {
        it('should throw an error without email', function () {
            const a = ical().createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            }).createAttendee({name: 'Testuser'});

            assert.throws(function () {
                a._generate();
            }, /`email`/);
        });
    });
});