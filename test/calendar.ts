'use strict';

import assert from 'assert';
import {existsSync, unlinkSync} from 'fs';
import * as http from 'http';
import moment from 'moment';
import {join} from 'path';
import {getPortPromise} from 'portfinder';
import ICalCalendar, {ICalCalendarMethod} from '../src/calendar';
import ICalEvent from '../src/event';

describe('ical-generator Calendar', function () {
    describe('constructor()', function () {
        it('shoud load json export', function () {
            const cal = new ICalCalendar({name: 'hello-world'});
            assert.strictEqual(cal.name(), 'hello-world');
        });
    });

    describe('prodId()', function () {
        it('getter should return value', function () {
            const cal = new ICalCalendar();
            cal.prodId('//loremipsum.de//ical-tests//EN');
            assert.strictEqual(cal.prodId(), '//loremipsum.de//ical-tests//EN');
        });

        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepStrictEqual(cal, cal.prodId('//loremipsum.de//ical-tests//EN'));
        });

        it('should throw error when string misformed', function () {
            const cal = new ICalCalendar();
            assert.throws(function () {
                cal.prodId('enemenemuh!');
            }, /`prodid`/);
        });

        it('should throw error when not string/object', function () {
            const cal = new ICalCalendar();
            assert.throws(function () {
                // @ts-ignore
                cal.prodId(256);
            }, /`prodid`/);
        });

        it('should throw error when no company given', function () {
            const cal = new ICalCalendar();
            assert.throws(function () {
                // @ts-ignore
                cal.prodId({
                    product: 'ical-tests'
                });
            }, /`prodid\.company`/);
        });

        it('should throw error when no product given', function () {
            const cal = new ICalCalendar();
            assert.throws(function () {
                // @ts-ignore
                cal.prodId({
                    company: 'sebbo.net'
                });
            }, /`prodid\.product`/);
        });

        it('should change something #1', function () {
            const cal = new ICalCalendar().prodId({
                company: 'loremipsum.com',
                product: 'awesome-unit-tests'
            });

            assert.strictEqual(cal.prodId(), '//loremipsum.com//awesome-unit-tests//EN');
        });

        it('should change something #2', function () {
            const cal = new ICalCalendar().prodId({
                company: 'loremipsum.com',
                product: 'awesome-unit-tests',
                language: 'DE'
            });

            assert.strictEqual(cal.prodId(), '//loremipsum.com//awesome-unit-tests//DE');
        });
    });

    describe('method()', function () {
        it('setter should return this', function () {
            const c = new ICalCalendar();
            assert.deepStrictEqual(c, c.method(null), 'method(null)');
            assert.deepStrictEqual(c, c.method(ICalCalendarMethod.PUBLISH), 'method(enum)');
        });

        it('getter should return value', function () {
            const c = new ICalCalendar();
            assert.strictEqual(c.method(), null);
            c.method(null);
            assert.strictEqual(c.method(), null);
            c.method(ICalCalendarMethod.PUBLISH);
            assert.strictEqual(c.method(), 'PUBLISH');
            c.method(null);
            assert.strictEqual(c.method(), null);
        });

        it('should throw error when method not allowed', function () {
            const c = new ICalCalendar();
            assert.throws(function () {
                // @ts-ignore
                c.method('KICK ASS');
            }, /Input must be one of the following: PUBLISH, REQUEST, REPLY, ADD, CANCEL, REFRESH, COUNTER, DECLINECOUNTER/);
        });

        it('should change something', function () {
            const c = new ICalCalendar({method: ICalCalendarMethod.PUBLISH});
            assert.strictEqual(c.method(), 'PUBLISH');

            c.method(ICalCalendarMethod.ADD);
            assert.strictEqual(c.method(), 'ADD');
        });
    });

    describe('name()', function () {
        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepStrictEqual(cal, cal.name(null));
            assert.deepStrictEqual(cal, cal.name('Testevents'));
        });

        it('getter should return value', function () {
            const cal = new ICalCalendar();
            assert.strictEqual(cal.name(), null);
            cal.name('Testevents');
            assert.strictEqual(cal.name(), 'Testevents');
            cal.name(null);
            assert.strictEqual(cal.name(), null);
        });

        it('should change something', function () {
            const cal = new ICalCalendar().name('Testevents');
            cal.createEvent({
                start: new Date(),
                summary: 'Example Event'
            });
            assert.strictEqual(cal.name(), 'Testevents');
        });
    });

    describe('description()', function () {
        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepStrictEqual(cal, cal.description(null));
            assert.deepStrictEqual(cal, cal.description('Testbeschreibung'));
        });

        it('getter should return value', function () {
            const cal = new ICalCalendar();
            assert.strictEqual(cal.description(), null);
            cal.description('Testbeschreibung');
            assert.strictEqual(cal.description(), 'Testbeschreibung');
            cal.description(null);
            assert.strictEqual(cal.description(), null);
        });

        it('should change something', function () {
            const cal = new ICalCalendar().description('Testbeschreibung');
            cal.createEvent({
                start: new Date(),
                summary: 'Example Event'
            });

            assert.ok(cal.description(), 'Testbeschreibung');
        });
    });

    describe('timezone()', function () {
        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepStrictEqual(cal, cal.timezone('Europe/Berlin'));
        });

        it('getter should return value', function () {
            const cal = new ICalCalendar().timezone('Europe/Berlin');
            assert.strictEqual(cal.timezone(), 'Europe/Berlin');

            cal.timezone(null);
            assert.strictEqual(cal.timezone(), null);
        });

        it('should make a difference to iCal output', function () {
            const cal = new ICalCalendar().timezone('Europe/London');
            cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            assert.strictEqual(cal.timezone(), 'Europe/London');
        });
    });

    describe('ttl()', function () {
        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepStrictEqual(cal.ttl(60 * 60 * 24), cal);
            assert.deepStrictEqual(cal.ttl(moment.duration(2, 'days')), cal);
            assert.deepStrictEqual(cal.ttl(null), cal);
        });

        it('getter should return value', function () {
            const cal = new ICalCalendar();
            assert.strictEqual(cal.ttl(), null);
            cal.ttl(86400);
            assert.strictEqual(cal.ttl(), 86400);
        });

        it('should change something', function () {
            const cal = new ICalCalendar().ttl(86400);
            assert.strictEqual(cal.ttl(), 86400);
        });
    });

    describe('url()', function () {
        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepStrictEqual(cal, cal.url('https://example.com/calendar.ical'));
        });

        it('getter should return value', function () {
            const cal = new ICalCalendar();
            assert.strictEqual(cal.url(), null);
            cal.url('https://example.com/calendar.ical');
            assert.strictEqual(cal.url(), 'https://example.com/calendar.ical');
            cal.url(null);
            assert.strictEqual(cal.url(), null);
        });

        it('should change something', function () {
            const cal = new ICalCalendar().url('https://example.com/calendar.ical');
            cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });
            assert.ok(cal.url(), 'https://example.com/calendar.ical');
        });
    });

    describe('scale()', function () {
        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepStrictEqual(cal, cal.scale('gregorian'));
        });

        it('getter should return value', function () {
            const cal = new ICalCalendar();
            assert.strictEqual(cal.scale(), null);
            cal.scale('GREGORIAN');
            assert.strictEqual(cal.scale(), 'GREGORIAN');
            cal.scale(null);
            assert.strictEqual(cal.scale(), null);
        });

        it('should change something', function () {
            const cal = new ICalCalendar().scale('gregorian');
            cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });
            assert.ok(cal.scale(), 'GREGORIAN');
        });
    });

    describe('createEvent()', function () {
        it('should return a ICalEvent instance', function () {
            const cal = new ICalCalendar();
            assert.ok(cal.createEvent({}) instanceof ICalEvent);
        });

        it('should pass data to instance', function () {
            const cal = new ICalCalendar();
            const event = cal.createEvent({summary: 'Patch-Day'});

            assert.strictEqual(event.summary(), 'Patch-Day');
        });

        it('should not require optional parameters', function () {
            assert.doesNotThrow(function () {
                new ICalCalendar().createEvent({
                    start: new Date(),
                    summary: 'Patch-Day'
                });
            }, Error);
        });
    });

    describe('events()', function () {
        it('getter should return an array of events…', function () {
            const cal = new ICalCalendar();
            assert.strictEqual(cal.events().length, 0);

            const event = cal.createEvent({});
            assert.strictEqual(cal.events().length, 1);
            assert.deepStrictEqual(cal.events()[0], event);
        });

        it('setter should add events and return this', function () {
            const cal = new ICalCalendar();
            assert.strictEqual(cal.length(), 0);

            const cal2 = cal.events([{summary: 'Event A'}, {summary: 'Event B'}]);
            assert.strictEqual(cal.length(), 2);
            assert.deepStrictEqual(cal2, cal);
        });
    });

    describe('clear()', function () {
        it('should do the job', function () {
            const cal = new ICalCalendar();
            cal.createEvent({});
            assert.strictEqual(cal.events().length, 1);
            assert.deepStrictEqual(cal.clear(), cal);
            assert.strictEqual(cal.events().length, 0);
        });
    });

    describe('save()', function () {
        it('should return all public methods and save it', function (done) {
            const file = join(__dirname, 'save.ical');
            const cal = new ICalCalendar();

            assert.deepStrictEqual(cal, cal.save(file, function () {
                assert.ok(existsSync(file));
                unlinkSync(file);

                assert.deepStrictEqual(cal, cal.save(file, function () {
                    assert.ok(existsSync(file));
                    unlinkSync(file);
                    done();
                }));
            }));
        });

        it('should be usable with promises', async function () {
            const file = join(__dirname, 'save.ical');
            const cal = new ICalCalendar();
            await cal.save(file);

            assert.ok(existsSync(file));
            unlinkSync(file);
        });

        it('should throw error when event invalid', function () {
            const file = join(__dirname, 'save.ical');
            const cal = new ICalCalendar();

            cal.createEvent({});

            assert.throws(function () {
                cal.save(file);
            }, /`start`/);
        });
    });

    describe('saveSync()', function () {
        it('should save it', function () {
            const file = join(__dirname, 'save_sync.ical');
            const cal = new ICalCalendar();

            cal.saveSync(file);
            assert.ok(existsSync(file));
            unlinkSync(file);

            cal.saveSync(file);
            assert.ok(existsSync(file));
            unlinkSync(file);
        });

        it('should throw error when event invalid', function () {
            const file = join(__dirname, 'save_sync.ical');
            const cal = new ICalCalendar();

            cal.createEvent({});

            assert.throws(function () {
                cal.saveSync(file);
            }, /`start`/);
        });
    });

    describe('serve()', function () {
        it('should work', async function () {
            const cal = new ICalCalendar();

            cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + (1000 * 60 * 60)),
                summary: 'HTTP Calendar Event'
            });

            const port = await getPortPromise();

            return new Promise(done => {
                const server = http.createServer((req, res) => {
                    cal.serve(res);
                }).listen(port, function () {
                    function request(cb: () => void) {
                        // make request
                        const req = http.request({port}, function (res) {
                            let file = '';

                            assert.strictEqual(
                                res.headers['content-type'],
                                'text/calendar; charset=utf-8',
                                'Header: text/calendar; charset=utf-8'
                            );
                            assert.strictEqual(
                                res.headers['content-disposition'],
                                'attachment; filename="calendar.ics"',
                                'Content-Disposition'
                            );

                            res.setEncoding('utf8');
                            res.on('data', function (chunk) {
                                file += chunk;
                            });
                            res.on('end', function () {
                                assert.strictEqual(file, cal.toString());
                                cb();
                            });
                        });

                        req.on('error', function (err) {
                            assert.fail(err);
                        });
                        req.end();
                    }

                    request(() => {
                        request(() => {
                            server.close(() => done());
                        });
                    });
                });
            });
        });
    });

    describe('x()', function () {
        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepStrictEqual(cal, cal.x('X-FOO', 'bar'));
        });

        it('setter should work with key and value strings', function () {
            const cal = new ICalCalendar();
            assert.deepStrictEqual(cal, cal.x('X-FOO', 'bar'));
            assert.deepEqual(cal.x(), [{
                key: 'X-FOO',
                value: 'bar'
            }]);

            assert.deepStrictEqual(cal, cal.x('X-LOREM', 'ipsum'));
            assert.deepEqual(cal.x(), [
                {key: 'X-FOO', value: 'bar'},
                {key: 'X-LOREM', value: 'ipsum'}
            ]);

            assert.throws(() => {
                cal.x('LOREM', 'ipsum');
            });

            assert.throws(() => {
                // @ts-ignore
                cal.x('X-LOREM', 1337);
            });

            assert.throws(() => {
                // @ts-ignore
                cal.x(5, 'ipsum');
            });
        });

        it('setter should work with key and value array', function () {
            const cal = new ICalCalendar();
            assert.deepStrictEqual(cal, cal.x([{key: 'X-FOO', value: 'bar'}]));
            assert.deepEqual(cal.x(), [{key: 'X-FOO', value: 'bar'}]);

            assert.deepStrictEqual(cal, cal.x([{key: 'X-LOREM', value: 'ipsum'}]));
            assert.deepEqual(cal.x(), [{key: 'X-LOREM', value: 'ipsum'}]);

            assert.throws(() => {
                cal.x([{key: 'LOREM', value: 'ipsum'}]);
            });

            assert.throws(() => {
                // @ts-ignore
                cal.x([{key: 'X-LOREM', value: 1337}]);
            });

            assert.throws(() => {
                // @ts-ignore
                cal.x([{key: 5, value: 'ipsum'}]);
            });
        });

        it('setter should work with key and value object', function () {
            const cal = new ICalCalendar();
            assert.deepStrictEqual(cal, cal.x({'X-FOO': 'bar'}));
            assert.deepEqual(cal.x(), [{key: 'X-FOO', value: 'bar'}]);

            assert.deepStrictEqual(cal, cal.x({'X-LOREM': 'ipsum'}));
            assert.deepEqual(cal.x(), [{key: 'X-LOREM', value: 'ipsum'}]);

            assert.throws(() => {
                cal.x({'LOREM': 'ipsum'});
            });

            assert.throws(() => {
                // @ts-ignore
                cal.x({'X-LOREM': 1337});
            });

            assert.throws(() => {
                cal.x({5: 'ipsum'});
            });
        });

        it('getter should return value', function () {
            const cal = new ICalCalendar();
            assert.deepEqual(cal.x(), []);
            cal.x('X-FOO', 'BAR');
            assert.deepEqual(cal.x(), [{key: 'X-FOO', value: 'BAR'}]);
            cal.x({});
            assert.deepEqual(cal.x().length, 0);
        });

        it('should change something', function () {
            const cal = new ICalCalendar().x('X-FOO', 'BAR');
            cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });
            assert.ok(cal.toString().includes('X-FOO'));
        });
    });

    describe('toJSON()', function () {
        it('should work', function () {
            const cal = new ICalCalendar();
            const prodId = cal.toJSON().prodId;
            assert.strictEqual(typeof prodId, 'string');
            assert.ok(prodId.length > 0);

            assert.strictEqual(cal.toJSON().events?.length, 0);
        });

        it('should work with params', function () {
            const cal = new ICalCalendar();
            cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + (1000 * 60 * 60)),
                summary: 'HTTP Calendar Event',
                x: [
                    {key: 'X-FOO', value: 'bar'},
                    {key: 'X-LOREM', value: 'ipsum'}
                ]
            });

            const prodId = cal.toJSON().prodId;
            assert.strictEqual(typeof prodId, 'string');
            assert.ok(prodId.length > 0);

            const events = cal.toJSON().events;
            assert.strictEqual(events?.length, 1);
            assert.deepEqual(events[0].x, [
                {'key': 'X-FOO', 'value': 'bar'},
                {'key': 'X-LOREM', 'value': 'ipsum'}
            ]);
        });

        it('should be compatible with constructor (type check)', function () {
            const a = new ICalCalendar();
            new ICalCalendar(a.toJSON());
        });
    });

    describe('length()', function () {
        it('should work', function () {
            const cal = new ICalCalendar();
            assert.strictEqual(cal.length(), 0);

            cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });
            assert.strictEqual(cal.length(), 1);
        });
    });

    describe('toString()', function () {
        it('should include the URL', function () {
            const cal = new ICalCalendar();
            cal.url('https://sebbo.net/foo');
            assert.ok(cal.toString().indexOf('URL:https://sebbo.net/foo') > -1);
        });

        it('should include the method', function () {
            const cal = new ICalCalendar();
            cal.method(ICalCalendarMethod.REFRESH);
            assert.ok(cal.toString().indexOf('METHOD:REFRESH') > -1);
        });

        it('should include the name', function () {
            const cal = new ICalCalendar();
            cal.name('TEST');
            assert.ok(cal.toString().indexOf('NAME:TEST') > -1);
            assert.ok(cal.toString().indexOf('X-WR-CALNAME:TEST') > -1);
        });

        it('should include the description', function () {
            const cal = new ICalCalendar();
            cal.description('TEST');
            assert.ok(cal.toString().indexOf('X-WR-CALDESC:TEST') > -1);
        });

        it('should include the timezone', function () {
            const cal = new ICalCalendar();
            cal.timezone('TEST');
            assert.ok(cal.toString().indexOf('TIMEZONE-ID:TEST') > -1);
            assert.ok(cal.toString().indexOf('X-WR-TIMEZONE:TEST') > -1);
        });

        it('should include the timezone', function () {
            const cal = new ICalCalendar();
            cal.ttl(moment.duration(3, 'days'));
            assert.ok(cal.toString().indexOf('REFRESH-INTERVAL;VALUE=DURATION:P3D') > -1);
            assert.ok(cal.toString().indexOf('X-PUBLISHED-TTL:P3D') > -1);
        });
    });
});
