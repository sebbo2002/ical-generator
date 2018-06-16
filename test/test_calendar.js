'use strict';

const assert = require('assert');
const moment = require('moment-timezone');
const ICalCalendar = require('../src/calendar');

describe('ical-generator Calendar', function () {
    describe('constructor()', function () {
        it('shoud set _attributes', function () {
            const cal = new ICalCalendar();
            assert.ok(cal._attributes.length > 0);
        });

        it('shoud load json export', function () {
            const cal = new ICalCalendar('{"name":"hello-world"}');
            assert.equal(cal._data.name, 'hello-world');
        });
    });

    describe('domain()', function () {
        it('getter should return value', function () {
            const cal = new ICalCalendar();
            cal._data.domain = 'loremipsum.de';
            assert.equal(cal.domain(), 'loremipsum.de');
        });

        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepEqual(cal, cal.domain('localhost'));
        });

        it('setter should save value in _data', function () {
            const cal = new ICalCalendar().domain('loremipsum.de');
            assert.equal(cal._data.domain, 'loremipsum.de');
        });
    });

    describe('prodId()', function () {
        it('getter should return value', function () {
            const cal = new ICalCalendar();
            cal._data.prodid = '//loremipsum.de//ical-tests//EN';
            assert.equal(cal.prodId(), '//loremipsum.de//ical-tests//EN');
        });

        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepEqual(cal, cal.prodId('//loremipsum.de//ical-tests//EN'));
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
                cal.prodId(256);
            }, /`prodid`/);
        });

        it('should throw error when no company given', function () {
            const cal = new ICalCalendar();
            assert.throws(function () {
                cal.prodId({
                    product: 'ical-tests'
                });
            }, /`prodid\.company`/);
        });

        it('should throw error when no product given', function () {
            const cal = new ICalCalendar();
            assert.throws(function () {
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

            assert.equal(cal._data.prodid, '//loremipsum.com//awesome-unit-tests//EN');
        });

        it('should change something #2', function () {
            const cal = new ICalCalendar().prodId({
                company: 'loremipsum.com',
                product: 'awesome-unit-tests',
                language: 'DE'
            });

            assert.equal(cal._data.prodid, '//loremipsum.com//awesome-unit-tests//DE');
        });
    });

    describe('method()', function () {
        it('setter should return this', function () {
            const c = new ICalCalendar();
            assert.deepEqual(c, c.method(null), 'method(null)');
            assert.deepEqual(c, c.method('publish'), 'method(string)');
        });

        it('getter should return value', function () {
            const c = new ICalCalendar();
            assert.equal(c.method(), null);
            c.method(null);
            assert.equal(c.method(), null);
            c.method('publish');
            assert.equal(c.method(), 'PUBLISH');
            c.method(null);
            assert.equal(c.method(), null);
        });

        it('should throw error when method not allowed', function () {
            const c = new ICalCalendar();
            assert.throws(function () {
                c.method('KICK ASS');
            }, /`method`/);
        });

        it('should change something', function () {
            const c = new ICalCalendar({method: 'publish'});
            assert.equal(c._data.method, 'PUBLISH');

            c.method('add');
            assert.equal(c._data.method, 'ADD');
        });
    });

    describe('name()', function () {
        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepEqual(cal, cal.name(null));
            assert.deepEqual(cal, cal.name('Testevents'));
        });

        it('getter should return value', function () {
            const cal = new ICalCalendar();
            assert.equal(cal.name(), null);
            cal.name('Testevents');
            assert.equal(cal.name(), 'Testevents');
            cal.name(null);
            assert.equal(cal.name(), null);
        });

        it('should change something', function () {
            const cal = new ICalCalendar().name('Testevents');
            cal.createEvent({
                start: new Date(),
                summary: 'Example Event'
            });
            assert.equal(cal._data.name, 'Testevents');
        });
    });

    describe('description()', function () {
        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepEqual(cal, cal.description(null));
            assert.deepEqual(cal, cal.description('Testbeschreibung'));
        });

        it('getter should return value', function () {
            const cal = new ICalCalendar();
            assert.equal(cal.description(), null);
            cal.description('Testbeschreibung');
            assert.equal(cal.description(), 'Testbeschreibung');
            cal.description(null);
            assert.equal(cal.description(), null);
        });

        it('should change something', function () {
            const cal = new ICalCalendar().description('Testbeschreibung');
            cal.createEvent({
                start: new Date(),
                summary: 'Example Event'
            });

            assert.ok(cal._data.description, 'Testbeschreibung');
        });
    });

    describe('timezone()', function () {
        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepEqual(cal, cal.timezone('Europe/Berlin'));
        });

        it('getter should return value', function () {
            const cal = new ICalCalendar().timezone('Europe/Berlin');
            assert.equal(cal.timezone(), 'Europe/Berlin');

            cal.timezone(null);
            assert.equal(cal.timezone(), null);
        });

        it('should make a difference to iCal output', function () {
            const cal = new ICalCalendar().timezone('Europe/London');
            cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            assert.equal(cal._data.timezone, 'Europe/London');
        });
    });

    describe('ttl()', function () {
        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepEqual(cal.ttl(60 * 60 * 24), cal);
            assert.deepEqual(cal.ttl(moment.duration(2, 'days')), cal);
            assert.deepEqual(cal.ttl(null), cal);
        });

        it('getter should return value', function () {
            const cal = new ICalCalendar();
            assert.equal(cal.ttl(), null);
            cal.ttl(86400);
            assert.equal(cal.ttl().as('seconds'), 86400);
        });

        it('should change something', function () {
            const cal = new ICalCalendar().ttl(86400);
            assert.equal(cal._data.ttl.as('seconds'), 86400);
        });
    });

    describe('url()', function () {
        it('setter should return this', function () {
            const cal = new ICalCalendar();
            assert.deepEqual(cal, cal.url('https://example.com/calendar.ical'));
        });

        it('getter should return value', function () {
            const cal = new ICalCalendar();
            assert.equal(cal.url(), null);
            cal.url('https://example.com/calendar.ical');
            assert.equal(cal.url(), 'https://example.com/calendar.ical');
            cal.url(null);
            assert.equal(cal.url(), null);
        });

        it('should change something', function () {
            const cal = new ICalCalendar().url('https://example.com/calendar.ical');
            cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });
            assert.ok(cal._data.url, 'https://example.com/calendar.ical');
        });
    });

    describe('createEvent()', function () {
        it('should return a ICalEvent instance', function () {
            const cal = new ICalCalendar();
            const ICalEvent = require('../src/event');

            assert.ok(cal.createEvent() instanceof ICalEvent);
        });

        it('should pass data to instance', function () {
            const cal = new ICalCalendar();
            const event = cal.createEvent({summary: 'Patch-Day'});

            assert.equal(event.summary(), 'Patch-Day');
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
            assert.equal(cal.events().length, 0);

            const event = cal.createEvent();
            assert.equal(cal.events().length, 1);
            assert.deepEqual(cal.events()[0], event);
        });

        it('setter should add events and return this', function () {
            const cal = new ICalCalendar();
            assert.equal(cal.length(), 0);

            const cal2 = cal.events([{summary: 'Event A'}, {summary: 'Event B'}]);
            assert.equal(cal.length(), 2);
            assert.deepEqual(cal2, cal);
        });
    });

    describe('save()', function () {
        it('should return all public methods and save it', function (done) {
            const path = require('path');
            const fs = require('fs');
            const file = path.join(__dirname, 'save.ical');
            const cal = new ICalCalendar();

            assert.deepEqual(cal, cal.save(file, function () {
                /*jslint stupid: true */
                assert.ok(fs.existsSync(file));
                fs.unlinkSync(file);

                assert.deepEqual(cal, cal.save(file, function () {
                    assert.ok(fs.existsSync(file));
                    fs.unlinkSync(file);
                    done();
                }));
            }));
        });

        it('should throw error when event invalid', function () {
            const path = require('path');
            const file = path.join(__dirname, 'save.ical');
            const cal = new ICalCalendar();

            cal.createEvent();

            assert.throws(function () {
                cal.save(file);
            }, /`start`/);
        });
    });

    describe('saveSync()', function () {
        it('should save it', function () {
            const fs = require('fs');
            const path = require('path');
            const file = path.join(__dirname, 'save_sync.ical');
            const cal = new ICalCalendar();

            /*jslint stupid: true */
            cal.saveSync(file);
            assert.ok(fs.existsSync(file));
            fs.unlinkSync(file);

            cal.saveSync(file);
            assert.ok(fs.existsSync(file));
            fs.unlinkSync(file);
        });

        it('should throw error when event invalid', function () {
            const path = require('path');
            const file = path.join(__dirname, 'save_sync.ical');
            const cal = new ICalCalendar();

            cal.createEvent();

            assert.throws(function () {
                /*jslint stupid: true */
                cal.saveSync(file);
            }, /`start`/);
        });
    });

    describe('serve()', function () {
        it('should work', function (done) {
            const portfinder = require('portfinder');
            const http = require('http');
            const cal = new ICalCalendar();

            cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + (1000 * 60 * 60)),
                summary: 'HTTP Calendar Event'
            });

            portfinder.getPort(function (err, port) {
                if (err) {
                    assert.fail(err);
                    done();
                }

                // create server
                const server = http.createServer(function (req, res) {
                    cal.serve(res);
                }).listen(port, function () {
                    function request(cb) {
                        // make request
                        const req = http.request({port}, function (res) {
                            let file = '';

                            assert.equal(
                                res.headers['content-type'],
                                'text/calendar; charset=utf-8',
                                'Header: text/calendar; charset=utf-8'
                            );
                            assert.equal(
                                res.headers['content-disposition'],
                                'attachment; filename="calendar.ics"',
                                'Content-Disposition'
                            );

                            res.setEncoding('utf8');
                            res.on('data', function (chunk) {
                                file += chunk;
                            });
                            res.on('end', function () {
                                assert.equal(file, cal.toString());
                                cb();
                            });
                        });

                        req.on('error', function (err) {
                            assert.fail(err);
                        });
                        req.end();
                    }

                    request(function () {
                        request(function () {
                            server.close(function () {
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    describe('toJSON()', function () {
        it('should work', function () {
            const cal = new ICalCalendar();
            assert.ok(cal.toJSON().prodId.length > 0);
            assert.equal(cal.toJSON().events.length, 0);
        });
    });

    describe('length()', function () {
        it('should work', function () {
            const cal = new ICalCalendar();
            assert.equal(cal.length(), 0);

            cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });
            assert.equal(cal.length(), 1);
        });
    });

    describe('clear()', function () {
        it('should work and return this', function () {
            const cal = new ICalCalendar();
            cal.createEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });
            assert.equal(cal.length(), 1);

            assert.deepEqual(cal, cal.clear());
            assert.equal(cal.length(), 0);
        });
    });

    describe('_generate()', function () {
        it('should include the URL', function () {
            const cal = new ICalCalendar();
            cal._data.url = 'https://sebbo.net/foo';
            assert.ok(cal.toString().indexOf('URL:https://sebbo.net/foo') > -1);
        });

        it('should include the method', function () {
            const cal = new ICalCalendar();
            cal._data.method = 'TEST';
            assert.ok(cal.toString().indexOf('METHOD:TEST') > -1);
        });

        it('should include the name', function () {
            const cal = new ICalCalendar();
            cal._data.name = 'TEST';
            assert.ok(cal.toString().indexOf('NAME:TEST') > -1);
            assert.ok(cal.toString().indexOf('X-WR-CALNAME:TEST') > -1);
        });

        it('should include the description', function () {
            const cal = new ICalCalendar();
            cal._data.description = 'TEST';
            assert.ok(cal.toString().indexOf('X-WR-CALDESC:TEST') > -1);
        });

        it('should include the timezone', function () {
            const cal = new ICalCalendar();
            cal._data.timezone = 'TEST';
            assert.ok(cal.toString().indexOf('TIMEZONE-ID:TEST') > -1);
            assert.ok(cal.toString().indexOf('X-WR-TIMEZONE:TEST') > -1);
        });

        it('should include the timezone', function () {
            const cal = new ICalCalendar();
            cal._data.ttl = moment.duration(3, 'days');
            assert.ok(cal.toString().indexOf('REFRESH-INTERVAL;VALUE=DURATION:P3D') > -1);
            assert.ok(cal.toString().indexOf('X-PUBLISHED-TTL:P3D') > -1);
        });
    });
});