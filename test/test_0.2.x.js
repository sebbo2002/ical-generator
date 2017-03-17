var assert = require('assert'),
    ical = require(__dirname + '/../lib/'),
    path = require('path'),
    fs = require('fs');

describe('ical-generator 0.2.x / ICalCalendar', function() {
    'use strict';

    describe('ICalTools', function() {
        describe('duration()', function() {
            it('case #1', function() {
                var tools = require(__dirname + '/../lib/_tools.js');
                assert.equal(tools.duration(5425), 'PT1H30M25S');
            });
            it('case #2', function() {
                var tools = require(__dirname + '/../lib/_tools.js');
                assert.equal(tools.duration(0), 'PT0S');
            });
            it('case #3', function() {
                var tools = require(__dirname + '/../lib/_tools.js');
                assert.equal(tools.duration(178225), 'P2DT1H30M25S');
            });
            it('case #4', function() {
                var tools = require(__dirname + '/../lib/_tools.js');
                assert.equal(tools.duration(259200), 'P3D');
            });
        });
    });

    describe('ICalCalendar', function() {
        it('should ignore unknown data attributes', function() {
            var cal = ical({unknown: true, name: 'test'});
            assert.equal(cal.name(), 'test');
        });

        describe('domain()', function() {
            it('setter should return this', function() {
                var cal = ical();
                assert.deepEqual(cal, cal.domain('localhost'));
            });

            it('getter should return value', function() {
                var cal = ical().domain('loremipsum.de');
                assert.equal(cal.domain(), 'loremipsum.de');
            });

            it('should change something', function() {
                var cal = ical().domain('loremipsum.de');
                cal.createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                });
                assert.ok(cal.toString().indexOf('loremipsum.de') > -1);
            });
        });

        describe('prodId()', function() {
            it('setter should return this', function() {
                var cal = ical();
                assert.deepEqual(cal, cal.prodId('//loremipsum.de//ical-tests//EN'));
            });

            it('getter should return value', function() {
                var cal = ical().prodId({
                    company: 'loremipsum.de',
                    product: 'ical-tests'
                });
                assert.equal(cal.prodId(), '//loremipsum.de//ical-tests//EN');
            });

            it('should throw error when string misformed', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.prodId('enemenemuh!');
                }, /`prodid`/);
            });

            it('should throw error when not string/object', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.prodId(256);
                }, /`prodid`/);
            });

            it('should throw error when no company given', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.prodId({
                        product: 'ical-tests'
                    });
                }, /`prodid\.company`/);
            });

            it('should throw error when no product given', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.prodId({
                        company: 'sebbo.net'
                    });
                }, /`prodid\.product`/);
            });

            it('should change something #1', function() {
                var cal = ical().prodId({
                    company: 'loremipsum.com',
                    product: 'awesome-unit-tests'
                });
                assert.ok(cal.toString().indexOf('loremipsum.com//awesome-unit-tests//EN') > -1);
            });

            it('should change something #2', function() {
                var cal = ical().prodId({
                    company: 'loremipsum.com',
                    product: 'awesome-unit-tests',
                    language: 'DE'
                });
                assert.ok(cal.toString().indexOf('loremipsum.com//awesome-unit-tests//DE') > -1);
            });
        });

        describe('method()', function() {
            it('setter should return this', function() {
                var c = ical();
                assert.deepEqual(c, c.method(null));
                assert.deepEqual(c, c.method('publish'));
            });

            it('getter should return value', function() {
                var c = ical();
                assert.equal(c.method(), null);
                c.method(null);
                assert.equal(c.method(), null);
                c.method('publish');
                assert.equal(c.method(), 'PUBLISH');
                c.method(null);
                assert.equal(c.method(), null);
            });

            it('should throw error when method not allowed', function() {
                var c = ical();
                assert.throws(function() {
                    c.method('KICK ASS');
                }, /`method`/);
            });

            it('should change something', function() {
                var c = ical({method: 'publish'}),
                    str = c.toString();

                c.method('add');
                assert.ok(str !== c.toString());
            });
        });

        describe('name()', function() {
            it('setter should return this', function() {
                var cal = ical();
                assert.deepEqual(cal, cal.name(null));
                assert.deepEqual(cal, cal.name('Testevents'));
            });

            it('getter should return value', function() {
                var cal = ical();
                assert.equal(cal.name(), null);
                cal.name('Testevents');
                assert.equal(cal.name(), 'Testevents');
                cal.name(null);
                assert.equal(cal.name(), null);
            });

            it('should change something', function() {
                var cal = ical().name('Testevents');
                cal.createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                });
                assert.ok(cal.toString().indexOf('Testevents') > -1);
            });
        });

        describe('description()', function() {
            it('setter should return this', function() {
                var cal = ical();
                assert.deepEqual(cal, cal.description(null));
                assert.deepEqual(cal, cal.description('Testbeschreibung'));
            });

            it('getter should return value', function() {
                var cal = ical();
                assert.equal(cal.description(), null);
                cal.description('Testbeschreibung');
                assert.equal(cal.description(), 'Testbeschreibung');
                cal.description(null);
                assert.equal(cal.description(), null);
            });

            it('should change something', function() {
                var cal = ical().description('Testbeschreibung');
                cal.createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                });
                assert.ok(cal.toString().indexOf('Testbeschreibung') > -1);
            });
        });

        describe('timezone()', function() {
            it('setter should return this', function() {
                var cal = ical();
                assert.deepEqual(cal, cal.timezone('Europe/Berlin'));
            });

            it('getter should return value', function() {
                var cal = ical().timezone('Europe/Berlin');
                assert.equal(cal.timezone(), 'Europe/Berlin');
            });

            it('should make a difference to iCal output', function() {
                var cal = ical().timezone('Europe/London');
                cal.createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                });
                assert.ok(cal.toString().indexOf('Europe/London') > -1);
            });

            it('should mark event as not floating', function() {
                var cal = ical().timezone('Europe/London'),
                    evt = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event',
                        floating: true
                    });

                evt.timezone('Europe/Berlin');

                assert.equal(evt.floating(), false);
            });
        });

        describe('ttl()', function() {
            it('setter should return this', function() {
                var cal = ical();
                assert.deepEqual(cal, cal.ttl(60 * 60 * 24));
                assert.deepEqual(cal.ttl(), 86400);
                assert.deepEqual(cal, cal.ttl(null));
                assert.deepEqual(cal.ttl(), null);
            });

            it('getter should return value', function() {
                var cal = ical();
                assert.equal(cal.ttl(), null);
                cal.ttl(86400);
                assert.equal(cal.ttl(), 86400);
            });

            it('should change something', function() {
                var cal = ical().ttl(86400);
                cal.createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                });
                assert.ok(cal.toString().indexOf('P1D') > -1);
            });
        });

        describe('url()', function() {
            it('setter should return this', function() {
                var cal = ical();
                assert.deepEqual(cal, cal.url('https://example.com/calendar.ical'));
            });

            it('getter should return value', function() {
                var cal = ical();
                assert.equal(cal.url(), null);
                cal.url('https://example.com/calendar.ical');
                assert.equal(cal.url(), 'https://example.com/calendar.ical');
                cal.url(null);
                assert.equal(cal.url(), null);
            });

            it('should change something', function() {
                var cal = ical().url('https://example.com/calendar.ical');
                cal.createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                });
                assert.ok(cal.toString().indexOf('https://example.com/calendar.ical') > -1);
            });
        });

        describe('createEvent()', function() {
            it('should return a ICalEvent instance', function() {
                var cal = ical(),
                    ICalEvent = require('../lib/event.js');

                assert.ok(cal.createEvent() instanceof ICalEvent);
            });

            it('should pass data to instance', function() {
                var cal = ical(),
                    event = cal.createEvent({summary: 'Patch-Day'});

                assert.equal(event.summary(), 'Patch-Day');
            });

            it('should not require optional parameters', function() {
                assert.doesNotThrow(function() {
                    ical().addEvent({
                        start: new Date(),
                        summary: 'Patch-Day'
                    });
                }, Error);
            });
        });

        describe('events()', function() {
            it('getter should return an array of events…', function() {
                var cal = ical(), event;
                assert.equal(cal.events().length, 0);

                event = cal.createEvent();
                assert.equal(cal.events().length, 1);
                assert.deepEqual(cal.events()[0], event);
            });

            it('setter should add events and return this', function() {
                var cal = ical(), events, cal2;
                assert.equal(cal.length(), 0);

                cal2 = cal.events([{summary: 'Event A'}, {summary: 'Event B'}]);
                assert.equal(cal.length(), 2);
                assert.deepEqual(cal2, cal);
            });
        });

        describe('save()', function() {
            it('should return all public methods and save it', function(done) {
                var file = path.join(__dirname, 'save.ical'),
                    cal = ical();

                assert.deepEqual(cal, cal.save(file, function() {
                    /*jslint stupid: true */
                    assert.ok(fs.existsSync(file));
                    fs.unlink(file);

                    assert.deepEqual(cal, cal.save(file, function() {
                        assert.ok(fs.existsSync(file));
                        fs.unlink(file);
                        done();
                    }));
                }));
            });

            it('should throw error when event invalid', function() {
                var file = path.join(__dirname, 'save.ical'),
                    cal = ical(),
                    e = cal.createEvent();

                assert.throws(function() {
                    cal.save(file);
                }, /`start`/);
            });
        });

        describe('saveSync()', function() {
            it('should save it', function() {
                var file = path.join(__dirname, 'save_sync.ical'),
                    cal = ical();

                /*jslint stupid: true */
                cal.saveSync(file);
                assert.ok(fs.existsSync(file));
                fs.unlinkSync(file);

                cal.saveSync(file);
                assert.ok(fs.existsSync(file));
                fs.unlinkSync(file);
            });

            it('should throw error when event invalid', function() {
                var file = path.join(__dirname, 'save_sync.ical'),
                    cal = ical(),
                    e = cal.createEvent();

                assert.throws(function() {
                    /*jslint stupid: true */
                    cal.saveSync(file);
                }, /`start`/);
            });
        });

        describe('serve()', function() {
            it('should work', function(done) {
                var portfinder = require('portfinder'),
                    http = require('http'),
                    cal = ical();

                cal.createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + (1000 * 60 * 60)),
                    summary: 'HTTP Calendar Event'
                });

                portfinder.getPort(function(err, port) {
                    if(err) {
                        assert.error(err);
                        done();
                    }

                    // create server
                    var server = http.createServer(function(req, res) {
                        cal.serve(res);
                    }).listen(port, function() {
                        function request(cb) {
                            // make request
                            var req = http.request({
                                port: port
                            }, function(res) {
                                var file = '';

                                assert.equal(res.headers['content-type'], 'text/calendar; charset=utf-8', 'Header: text/calendar; charset=utf-8');
                                assert.equal(res.headers['content-disposition'], 'attachment; filename="calendar.ics"', 'Content-Disposition');

                                res.setEncoding('utf8');
                                res.on('data', function(chunk) {
                                    file += chunk;
                                });
                                res.on('end', function() {
                                    assert.equal(file, cal.toString());
                                    cb();
                                });
                            });

                            req.on('error', function(err) {
                                assert.error(err);
                            });
                            req.end();
                        }

                        request(function() {
                            request(function() {
                                server.close(function() {
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });

        describe('length()', function() {
            it('should work', function() {
                var cal = ical();
                assert.equal(cal.length(), 0);

                cal.createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                });
                assert.equal(cal.length(), 1);
            });
        });

        describe('clear()', function() {
            it('should work and return this', function() {
                var cal = ical();
                cal.addEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                });
                assert.equal(cal.length(), 1);

                assert.deepEqual(cal, cal.clear());
                assert.equal(cal.length(), 0);
            });
        });
    });

    describe('ICalEvent', function() {
        it('shouldn\'t work without calendar reference', function() {
            var ICalEvent = require('../lib/event.js');
            assert.throws(function() {
                new ICalEvent({summary: 'Testevent'});
            }, /`calendar`/);
        });

        it('should ignore unknown data attributes', function() {
            var cal = ical(),
                e = cal.createEvent({unknown: true, summary: 'test'});
            assert.equal(e.summary(), 'test');
        });

        describe('id()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.id(1048));
            });

            it('getter should return value', function() {
                var e = ical().createEvent().id(512);
                assert.equal(e.id(), 512);

                e.id('xyz');
                assert.equal(e.id(), 'xyz');
            });

            it('should change something', function() {
                var cal = ical();
                cal.createEvent({
                    id: 'hufflepuff',
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                });
                assert.ok(cal.toString().indexOf('hufflepuff') > -1);
            });
        });

        describe('sequence()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.sequence(1));
            });

            it('getter should return value', function() {
                var e = ical().createEvent().sequence(1048);
                assert.equal(e.sequence(), 1048);
            });

            it('should change something', function() {
                var cal = ical();
                cal.createEvent({
                    sequence: 512,
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                });
                assert.ok(cal.toString().indexOf('512') > -1);
            });

            it('setter should throw error when sequence is not valid', function() {
                var e = ical().createEvent();
                assert.throws(function() {
                    e.sequence('hello');
                }, /`sequence`/);
            });

            it('setter should work with 0', function() {
                var e = ical().createEvent().sequence(12);
                assert.equal(e.sequence(), 12);

                e.sequence(0);
                assert.equal(e.sequence(), 0);
            });
        });

        describe('start()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.start(new Date()));
            });

            it('getter should return value', function() {
                var now = new Date(),
                    e = ical().createEvent().start(now);
                assert.deepEqual(e.start(), now);
            });

            it('setter should throw error when start time is not a Date', function() {
                var e = ical().createEvent();
                assert.throws(function() {
                    e.start('hallo');
                }, /`start`/);
            });

            it('setter should flip start and end if necessary', function() {
                var a = new Date(),
                    b = new Date(new Date().getTime() + 60000),
                    e = ical().createEvent({end: a, start: b});
                assert.deepEqual(e.start(), a);
                assert.deepEqual(e.end(), b);
            });
        });

        describe('end()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.end(null));
                assert.deepEqual(e, e.end(new Date()));
            });

            it('getter should return value', function() {
                var now = new Date(),
                    e = ical().createEvent();
                assert.deepEqual(e.end(), null);
                e.end(now);
                assert.deepEqual(e.end(), now);
                e.end(null);
                assert.deepEqual(e.end(), null);
            });

            it('should throw error when end time is not a Date', function() {
                var e = ical().createEvent();
                assert.throws(function() {
                    e.end('hallo');
                }, /`end`/);
            });

            it('setter should flip start and end if necessary', function() {
                var a = new Date(),
                    b = new Date(new Date().getTime() + 60000),
                    e = ical().createEvent({start: b, end: a});
                assert.deepEqual(e.start(), a);
                assert.deepEqual(e.end(), b);
            });
        });

        describe('timezone()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.timezone('Europe/Berlin'));
            });

            it('getter should return value', function() {
                var e = ical().createEvent().timezone('Europe/Berlin');
                assert.equal(e.timezone(), 'Europe/Berlin');
            });

            it('should change something', function() {
                var cal = ical(),
                    e = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                e.timezone('Europe/London');
                assert.ok(cal.toString().indexOf('Europe/London') > -1);
            });

            it('should inherit from calendar', function() {
                var cal = ical(),
                    e = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                assert.equal(cal.timezone(), null);
                assert.equal(e.timezone(), null);

                cal.timezone('Europe/London');
                assert.equal(cal.timezone(), 'Europe/London');
                assert.equal(e.timezone(), 'Europe/London');

                e.timezone('Europe/Berlin');
                assert.equal(cal.timezone(), 'Europe/London');
                assert.equal(e.timezone(), 'Europe/Berlin');

                cal.timezone(null);
                assert.equal(cal.timezone(), null);
                assert.equal(e.timezone(), 'Europe/Berlin');

                e.timezone(null);
                assert.equal(cal.timezone(), null);
                assert.ok(!e.timezone());
            });
        });

        describe('stamp()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.stamp(new Date()));
            });

            it('getter should return value', function() {
                var now = new Date(),
                    e = ical().createEvent().stamp(now);
                assert.deepEqual(e.stamp(), now);
            });

            it('should throw error when stamp is not a Date', function() {
                var e = ical().createEvent();
                assert.throws(function() {
                    e.stamp('hallo');
                }, /`stamp`/);
            });
        });

        describe('timestamp()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.timestamp(new Date()));
            });

            it('getter should return value', function() {
                var now = new Date(),
                    e = ical().createEvent().timestamp(now);
                assert.deepEqual(e.timestamp(), now);
            });

            it('should throw error when stamp is not a Date', function() {
                var e = ical().createEvent();
                assert.throws(function() {
                    e.timestamp('hallo');
                }, /`stamp`/);
            });
        });

        describe('allDay()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.allDay(true));
            });

            it('getter should return value', function() {
                var e = ical().createEvent().allDay(true);
                assert.equal(e.allDay(), true);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    }),
                    str = cal.toString();

                event.allDay(true);
                assert.ok(str !== cal.toString());
            });
        });

        describe('floating()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.floating(false));
                assert.deepEqual(e, e.floating(true));
            });

            it('getter should return value', function() {
                var e = ical().createEvent().floating(true);
                assert.equal(e.floating(), true);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    }),
                    str = cal.toString();

                event.floating(true);
                assert.ok(str !== cal.toString());
            });

            it('should mark event as having no time zone', function() {
                var cal = ical().timezone('Europe/London'),
                    evt = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event',
                        timezone: 'Europe/Berlin'
                    });

                evt.floating(true);

                assert.equal(evt.timezone(), null);
            });
        });

        describe('repeating()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.repeating(null));
                assert.deepEqual(e, e.repeating({
                    freq: 'monthly',
                    count: 5,
                    interval: 2,
                    exclude: new Date(),
                    unitl: new Date()
                }));
            });

            it('getter should return value', function() {
                var options = {freq: 'MONTHLY', count: 5, interval: 2, exclude: new Date(), until: new Date()},
                    e = ical().createEvent();
                assert.deepEqual(e.repeating(), null);
                e.repeating(options);
                assert.deepEqual(e.repeating(), options);
                e.repeating(null);
                assert.deepEqual(e.repeating(), null);
            });

            it('should throw error when repeating without freq', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {}
                    });
                }, /`repeating\.freq` is a mandatory item, and must be one of the following/);
            });

            it('should throw error when repeating when freq is not allowed', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'hello'
                        }
                    });
                }, /`repeating\.freq` is a mandatory item, and must be one of the following/);
            });

            it('should throw error when repeating.count is not a number', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'DAILY',
                            count: Infinity
                        }
                    });
                }, /`repeating\.count` must be a Number/);

                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'DAILY',
                            count: 'abc'
                        }
                    });
                }, /`repeating\.count` must be a Number/);
            });

            it('should throw error when repeating.interval is not a number', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'DAILY',
                            interval: Infinity
                        }
                    });
                }, /`repeating\.interval` must be a Number/);

                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'DAILY',
                            interval: 'abc'
                        }
                    });
                }, /`repeating\.interval` must be a Number/);
            });

            it('should throw error when repeating.until is not a date', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'DAILY',
                            until: 1413277003
                        }
                    });
                }, /`repeating\.until` must be a Date Object/);
            });

            it('should throw error when repeating.byDay is not valid', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'DAILY',
                            interval: 2,
                            byDay: 'FOO'
                        }
                    });
                }, /`repeating\.byDay` contains invalid value `FOO`/);

                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'DAILY',
                            interval: 2,
                            byDay: ['SU', 'BAR', 'th']
                        }
                    });
                }, /`repeating\.byDay` contains invalid value `BAR`/);
            });

            it('should throw error when repeating.byMonth is not valid', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'DAILY',
                            interval: 2,
                            byMonth: 'FOO'
                        }
                    });
                }, /`repeating\.byMonth` contains invalid value `FOO`/);

                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'DAILY',
                            interval: 2,
                            byMonth: [1, 14, 7]
                        }
                    });
                }, /`repeating\.byMonth` contains invalid value `14`/);
            });

            it('should throw error when repeating.byMonthDay is not valid', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'DAILY',
                            interval: 2,
                            byMonthDay: 'FOO'
                        }
                    });
                }, /`repeating\.byMonthDay` contains invalid value `FOO`/);

                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'DAILY',
                            interval: 2,
                            byMonthDay: [1, 32, 15]
                        }
                    });
                }, /`repeating\.byMonthDay` contains invalid value `32`/);
            });

            it('should throw error when repeating.exclude is not valid', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'DAILY',
                            interval: 2,
                            byDay: ['SU'],
                            exclude: 'FOO'
                        }
                    });
                }, /`repeating\.exclude` contains invalid value `FOO`/);
            });

            it('should throw error when repeating.exclude is not valid (should throw on first err value', function() {
                var cal = ical();
                assert.throws(function() {
                    cal.createEvent({
                        start: new Date(),
                        end: new Date(),
                        summary: 'test',
                        repeating: {
                            freq: 'DAILY',
                            interval: 2,
                            byDay: ['SU'],
                            exclude: [new Date(), 'BAR', 'FOO']
                        }
                    });
                }, /`repeating\.exclude` contains invalid value `BAR`/);
            });
        });

        describe('summary()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.summary(null));
                assert.deepEqual(e, e.summary('Testevent'));
            });

            it('getter should return value', function() {
                var e = ical().createEvent();
                assert.equal(e.summary(), '');
                e.summary('Testevent');
                assert.equal(e.summary(), 'Testevent');
                e.summary(null);
                assert.equal(e.summary(), '');
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    }),
                    str = cal.toString();

                event.summary('Example Event II');
                assert.ok(str !== cal.toString());
            });

            it('should escape CR/CRLF line breaks', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example with a\rlinebreak'
                    }),
                    str = cal.toString();

                assert.equal(str.indexOf('\rlinebreak'), -1);
            });
        });

        describe('location()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.location(null));
                assert.deepEqual(e, e.location('Test Location'));
            });

            it('getter should return value', function() {
                var e = ical().createEvent();
                assert.equal(e.location(), null);
                e.location('Test Location');
                assert.equal(e.location(), 'Test Location');
                e.location(null);
                assert.equal(e.location(), null);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    }),
                    str = cal.toString();

                event.location('Europa-Park');
                assert.ok(str !== cal.toString());
            });
        });

        describe('description()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.description(null));
                assert.deepEqual(e, e.description('I don\'t need a description. I\'m far to awesome for descriptions…'));
            });

            it('getter should return value', function() {
                var e = ical().createEvent();
                assert.equal(e.description(), null);
                e.description('I don\'t need a description. I\'m far to awesome for descriptions…');
                assert.equal(e.description(), 'I don\'t need a description. I\'m far to awesome for descriptions…');
                e.description(null);
                assert.equal(e.description(), null);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    }),
                    str = cal.toString();

                event.description('Well. But other people need descriptions… :/');
                assert.ok(str !== cal.toString());
            });
        });

        describe('htmlDescription()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.htmlDescription(null));
                assert.deepEqual(e, e.htmlDescription('I don\'t need a description. I\'m far to awesome for descriptions…'));
            });

            it('getter should return value', function() {
                var e = ical().createEvent();
                assert.equal(e.htmlDescription(), null);
                e.htmlDescription('<marquee>I\'m the best HTML tag in this universe!</marquee>');
                assert.equal(e.htmlDescription(), '<marquee>I\'m the best HTML tag in this universe!</marquee>');
                e.htmlDescription(null);
                assert.equal(e.htmlDescription(), null);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    }),
                    str = cal.toString();

                event.htmlDescription('<marquee>I\'m the best HTML tag in this universe!</marquee>');
                assert.ok(str !== cal.toString());
            });
        });

        describe('organizer()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.organizer(null));
                assert.deepEqual(e, e.organizer('Sebastian Pekarek <mail@example.com>'));
            });

            it('getter should return value', function() {
                var e = ical().createEvent();
                assert.equal(e.organizer(), null);
                e.organizer(null);
                assert.equal(e.organizer(), null);
                e.organizer('Sebastian Pekarek <mail@example.com>');
                assert.equal('Sebastian Pekarek', e.organizer().name);
                assert.equal('mail@example.com', e.organizer().email);
                e.organizer(null);
                assert.equal(e.organizer(), null);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    }),
                    str = cal.toString();

                event.organizer({name: 'Sebastian Pekarek', email: 'mail@example.com'});
                assert.ok(str !== cal.toString());
            });

            it('should throw error when string misformated', function() {
                var e = ical().createEvent();
                assert.throws(function() {
                    e.organizer('foo bar');
                }, /`organizer`/);
            });

            it('should throw error when object misformated', function() {
                var e = ical().createEvent();
                assert.throws(function() {
                    e.organizer({name: 'Sebastian Pekarek'});
                }, /`organizer\.email`/);

                assert.throws(function() {
                    e.organizer({email: 'foo'});
                }, /`organizer\.name`/);
            });

            it('should throw error when unknown format', function() {
                var e = ical().createEvent();
                assert.throws(function() {
                    e.organizer(Infinity);
                }, /`organizer`/);
            });
        });

        describe('createAttendee()', function() {
            it('should return a ICalAttendee instance', function() {
                var cal = ical(),
                    event = cal.createEvent(),
                    ICalAttendee = require('../lib/attendee.js');

                assert.ok(event.createAttendee() instanceof ICalAttendee);
            });

            it('should pass data to instance', function() {
                var cal = ical(),
                    event = cal.createEvent(),
                    attendee = event.createAttendee({name: 'Zac'});

                assert.equal(attendee.name(), 'Zac');
            });

            it('getter should return value', function() {
                var a = ical().createEvent().createAttendee('Sebastian Pekarek <mail@example.com>');
                assert.equal('Sebastian Pekarek', a.name());
                assert.equal('mail@example.com', a.email());
            });

            it('should throw error when string misformated', function() {
                var e = ical().createEvent();
                assert.throws(function() {
                    e.createAttendee('foo bar');
                }, /`attendee`/);
            });
        });

        describe('attendees()', function() {
            it('getter should return an array of attendees…', function() {
                var cal = ical(),
                    event = cal.createEvent(),
                    attendee;
                assert.equal(event.attendees().length, 0);

                attendee = event.createAttendee();
                assert.equal(event.attendees().length, 1);
                assert.deepEqual(event.attendees()[0], attendee);
            });

            it('setter should add attendees and return this', function() {
                var cal = ical(),
                    event = cal.createEvent(),
                    foo = event.attendees([{name: 'Person A'}, {name: 'Person B'}]);

                assert.equal(event.attendees().length, 2);
                assert.deepEqual(foo, event);
            });
        });

        describe('createAlarm()', function() {
            it('should return a ICalAlarm instance', function() {
                var cal = ical(),
                    event = cal.createEvent(),
                    ICalAlarm = require('../lib/alarm.js');

                assert.ok(event.createAlarm() instanceof ICalAlarm);
            });

            it('should pass data to instance', function() {
                var cal = ical(),
                    event = cal.createEvent(),
                    attendee = event.createAlarm({type: 'audio'});

                assert.equal(attendee.type(), 'audio');
            });
        });

        describe('alarms()', function() {
            it('getter should return an array of alarms…', function() {
                var cal = ical(),
                    event = cal.createEvent(),
                    alarm;
                assert.equal(event.alarms().length, 0);

                alarm = event.createAlarm();
                assert.equal(event.alarms().length, 1);
                assert.deepEqual(event.alarms()[0], alarm);
            });

            it('setter should add alarms and return this', function() {
                var cal = ical(),
                    event = cal.createEvent(),
                    foo = event.alarms([{type: 'audio'}, {type: 'display'}]);

                assert.equal(event.alarms().length, 2);
                assert.deepEqual(foo, event);
            });
        });

        describe('method()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.method(null));
                assert.deepEqual(e, e.method('publish'));
            });

            it('getter should return value', function() {
                var e = ical().createEvent();
                assert.equal(e.method(), null);
                e.method(null);
                assert.equal(e.method(), null);
                e.method('publish');
                assert.equal(e.method(), 'PUBLISH');
                e.method(null);
                assert.equal(e.method(), null);
            });

            it('should throw error when method not allowed', function() {
                var e = ical().createEvent();
                assert.throws(function() {
                    e.method('KICK ASS');
                }, /`method`/);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    }),
                    str = cal.toString();

                event.method('publish');
                assert.ok(str !== cal.toString());
            });
        });

        describe('status()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.status(null));
                assert.deepEqual(e, e.status('confirmed'));
            });

            it('getter should return value', function() {
                var e = ical().createEvent();
                assert.equal(e.status(), null);
                e.status('confirmed');
                assert.equal(e.status(), 'CONFIRMED');
                e.status(null);
                assert.equal(e.status(), null);
            });

            it('should throw error when method not allowed', function() {
                var e = ical().createEvent();
                assert.throws(function() {
                    e.status('COOKING');
                }, /`status`/);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    }),
                    str = cal.toString();

                event.status('cancelled');
                assert.ok(str !== cal.toString());
            });
        });

        describe('url()', function() {
            it('setter should return this', function() {
                var e = ical().createEvent();
                assert.deepEqual(e, e.url(null));
                assert.deepEqual(e, e.url('http://sebbo.net/'));
            });

            it('getter should return value', function() {
                var e = ical().createEvent();
                assert.equal(e.url(), null);
                e.url('http://sebbo.net/');
                assert.equal(e.url(), 'http://sebbo.net/');
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    }),
                    str = cal.toString();

                event.url('http://github.com/sebbo2002/ical-generator');
                assert.ok(str !== cal.toString());
            });
        });

        describe('generate()', function() {
            it('shoult throw an error without calendar', function() {
                var e = ical().createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                });
                assert.throws(function() {
                    e.generate();
                }, /`calendar`/);
            });

            it('shoult make use of escaping', function() {
                var cal = ical();
                cal.createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Hel\\\\lo\nW;orl,d'
                });

                assert.ok(cal.toString().indexOf('Hel\\\\\\\\lo\\nW\\;orl\\,d') > -1);
            });

            it('case #1', function() {
                var cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'}),
                    string, json;
                cal.createEvent({
                    id: '123',
                    start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                    end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
                    stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                    summary: 'Simple Event'
                });

                /*jslint stupid: true */
                string = cal.toString();
                assert.equal(string, fs.readFileSync(__dirname + '/results/generate_01.ics', 'utf8'));

                json = JSON.stringify(cal.toJSON());
                assert.equal(ical(json).toString(), string);
            });

            it('case #2', function() {
                var cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'}),
                    string, json;
                cal.createEvent({
                    id: '123',
                    start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                    end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
                    stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                    summary: 'Sample Event',
                    location: 'localhost',
                    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\nbeep boop'
                });

                /*jslint stupid: true */
                string = cal.toString();
                assert.equal(string, fs.readFileSync(__dirname + '/results/generate_02.ics', 'utf8'));

                json = JSON.stringify(cal.toJSON());
                assert.equal(ical(json).toString(), string);
            });

            it('case #3', function() {
                var cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'}),
                    string, json;
                cal.createEvent({
                    id: '123',
                    start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                    end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                    allDay: true,
                    stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                    summary: 'Sample Event',
                    organizer: 'Sebastian Pekarek <mail@sebbo.net>',
                    method: 'add',
                    status: 'confirmed',
                    url: 'http://sebbo.net/'
                });

                /*jslint stupid: true */
                string = cal.toString();
                assert.equal(string, fs.readFileSync(__dirname + '/results/generate_03.ics', 'utf8'));

                json = JSON.stringify(cal.toJSON());
                assert.equal(ical(json).toString(), string);
            });

            it('case #4 (repeating)', function() {
                var cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'}),
                    string, json;
                cal.events([
                    {
                        id: '1',
                        start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                        end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                        stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                        summary: 'repeating by month',
                        repeating: {
                            freq: 'monthly',
                            exclude: new Date('Fr Oct 06 2013 23:15:00 UTC')
                        }
                    },
                    {
                        id: '2',
                        start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                        end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                        stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                        summary: 'repeating by day, twice',
                        repeating: {
                            freq: 'DAILY',
                            count: 2
                        }
                    },
                    {
                        id: '3',
                        start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                        end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                        stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                        summary: 'repeating by 3 weeks, until 2014',
                        repeating: {
                            freq: 'WEEKLY',
                            interval: 3,
                            until: new Date('We Jan 01 2014 00:00:00 UTC')
                        }
                    }
                ]);

                /*jslint stupid: true */
                string = cal.toString();
                assert.equal(string, fs.readFileSync(__dirname + '/results/generate_04.ics', 'utf8'));

                json = JSON.stringify(cal.toJSON());
                assert.equal(ical(json).toString(), string);
            });

            it('case #5 (floating)', function() {
                var cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'}),
                    string, json;
                cal.createEvent({
                    id: '1',
                    start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                    end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                    stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                    summary: 'floating',
                    floating: true
                });

                /*jslint stupid: true */
                string = cal.toString();
                assert.equal(string, fs.readFileSync(__dirname + '/results/generate_05.ics', 'utf8'));

                json = JSON.stringify(cal.toJSON());
                assert.equal(ical(json).toString(), string);
            });

            it('case #6 (attendee with simple delegation and alarm)', function() {
                var cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN', method: 'publish'}),
                    string, json;
                cal.createEvent({
                    id: '123',
                    start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                    allDay: true,
                    stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                    summary: 'Sample Event',
                    organizer: 'Sebastian Pekarek <mail@sebbo.net>',
                    attendees: [
                        {
                            name: 'Matt',
                            email: 'matt@example.com',
                            delegatesTo: {
                                name: 'John',
                                email: 'john@example.com',
                                status: 'accepted'
                            }
                        }
                    ],
                    alarms: [
                        {
                            type: 'display',
                            trigger: 60 * 10,
                            repeat: 2,
                            interval: 60
                        },
                        {
                            type: 'display',
                            trigger: 60 * 60,
                            description: 'I\'m a reminder :)'
                        }
                    ],
                    status: 'confirmed',
                    url: 'http://sebbo.net/'
                });

                /*jslint stupid: true */
                string = cal.toString();
                assert.equal(string, fs.readFileSync(__dirname + '/results/generate_06.ics', 'utf8'));

                json = JSON.stringify(cal.toJSON());
                assert.equal(ical(json).toString(), string);
            });

            it('case #7 (repeating: byDay, byMonth, byMonthDay)', function() {
                var cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'}),
                    string, json;
                cal.events([
                    {
                        id: '1',
                        start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                        end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                        stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                        summary: 'repeating by month',
                        repeating: {
                            freq: 'monthly',
                            byMonth: [1, 4, 7, 10]
                        }
                    },
                    {
                        id: '2',
                        start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                        stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                        summary: 'repeating on Mo/We/Fr, twice',
                        repeating: {
                            freq: 'DAILY',
                            count: 2,
                            byDay: ['mo', 'we', 'fr']
                        }
                    },
                    {
                        id: '3',
                        start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                        end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                        stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                        summary: 'repeating on 1st and 15th',
                        repeating: {
                            freq: 'DAILY',
                            interval: 1,
                            byMonthDay: [1, 15]
                        }
                    }
                ]);

                /*jslint stupid: true */
                string = cal.toString();
                assert.equal(string, fs.readFileSync(__dirname + '/results/generate_07.ics', 'utf8'));

                json = JSON.stringify(cal.toJSON());
                assert.equal(ical(json).toString(), string);
            });
        });
    });

    describe('ICalAttendee', function() {
        it('shouldn\'t work without event reference', function() {
            var ICalAttendee = require('../lib/attendee.js');
            assert.throws(function() {
                new ICalAttendee({email: 'foo@bar.com'});
            }, /`event`/);
        });

        it('should ignore unknown data attributes', function() {
            var cal = ical(),
                e = cal.createEvent().createAttendee({unknown: true, name: 'test'});
            assert.equal(e.name(), 'test');
        });

        describe('name()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAttendee();
                assert.deepEqual(a, a.name(null));
                assert.deepEqual(a, a.name('Sebastian'));
            });

            it('getter should return value', function() {
                var a = ical().createEvent().createAttendee();
                assert.equal(a.name(), null);
                a.name('Sebastian');
                assert.equal(a.name(), 'Sebastian');
                a.name(null);
                assert.equal(a.name(), null);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                event.createAttendee({email: 'mail@example.com', name: 'hufflepuff'});
                assert.ok(cal.toString().indexOf('hufflepuff') > -1);
            });
        });

        describe('email()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAttendee();
                assert.deepEqual(a, a.email('foo@example.com'));
            });

            it('getter should return value', function() {
                var e = ical().createEvent().createAttendee().email('foo@example.com');
                assert.equal(e.email(), 'foo@example.com');
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                event.createAttendee({email: 'mail@example.com'});
                assert.ok(cal.toString().indexOf('mail@example.com') > -1);
            });
        });

        describe('role()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAttendee();
                assert.deepEqual(a, a.role('req-participant'));
            });

            it('getter should return value', function() {
                var a = ical().createEvent().createAttendee().role('req-participant');
                assert.equal(a.role(), 'REQ-PARTICIPANT');
            });

            it('should throw error when method empty', function() {
                var a = ical().createEvent().createAttendee();
                assert.throws(function() {
                    a.role('');
                }, /`role` must be a non-empty string/);
            });

            it('should throw error when method not allowed', function() {
                var a = ical().createEvent().createAttendee();
                assert.throws(function() {
                    a.role('COOKING');
                }, /`role` must be one of the following/);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                event.createAttendee({email: 'mail@example.com', role: 'non-participant'});
                assert.ok(cal.toString().indexOf('NON-PARTICIPANT') > -1);
            });
        });

        describe('rsvp()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAttendee();
                assert.deepEqual(a, a.rsvp(null));
                assert.deepEqual(a, a.rsvp('TRUE'));
            });

            it('getter should return value', function() {
                var a = ical().createEvent().createAttendee();
                assert.equal(a.rsvp(), null);
                a.rsvp('false');
                assert.equal(a.rsvp(), 'FALSE');
                a.rsvp(null);
                assert.equal(a.rsvp(), null);
            });

            it('should throw error when method not allowed', function() {
                var a = ical().createEvent().createAttendee();
                assert.throws(function() {
                    a.rsvp('PROBABLY');
                }, /`rsvp` must be one of the following/);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                event.createAttendee({email: 'mail@example.com', rsvp: 'true'});
                assert.ok(cal.toString().indexOf(';RSVP=TRUE') > -1);
            });
        });

        describe('status()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAttendee();
                assert.deepEqual(a, a.status(null));
                assert.deepEqual(a, a.status('accepted'));
            });

            it('getter should return value', function() {
                var a = ical().createEvent().createAttendee();
                assert.equal(a.status(), null);
                a.status('accepted');
                assert.equal(a.status(), 'ACCEPTED');
                a.status(null);
                assert.equal(a.status(), null);
            });

            it('should throw error when method not allowed', function() {
                var a = ical().createEvent().createAttendee();
                assert.throws(function() {
                    a.status('DRINKING');
                }, /`status` must be one of the following/);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                event.createAttendee({email: 'mail@example.com', status: 'declined'});
                assert.ok(cal.toString().indexOf('DECLINED') > -1);
            });
        });

        describe('type()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAttendee();
                assert.deepEqual(a, a.type(null));
                assert.deepEqual(a, a.type('individual'));
            });

            it('getter should return value', function() {
                var a = ical().createEvent().createAttendee();
                assert.equal(a.type(), null);
                a.type('room');
                assert.equal(a.type(), 'ROOM');
                a.type(null);
                assert.equal(a.type(), null);
            });

            it('should throw error when method not allowed', function() {
                var a = ical().createEvent().createAttendee();
                assert.throws(function() {
                    a.type('DRINKING');
                }, /`type` must be one of the following/);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                event.createAttendee({email: 'mailing-list@example.com', type: 'group'});
                assert.ok(cal.toString().indexOf('GROUP') > -1);
            });
        });

        describe('delegatedTo()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAttendee();
                assert.deepEqual(a, a.delegatedTo(null));
                assert.deepEqual(a, a.delegatedTo('foo@example.com'));
            });

            it('getter should return value', function() {
                var a = ical().createEvent().createAttendee();
                assert.equal(a.delegatedTo(), null);
                a.delegatedTo('foo@example.com');
                assert.equal(a.delegatedTo(), 'foo@example.com');
                a.delegatedTo(null);
                assert.equal(a.delegatedTo(), null);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                event.createAttendee({email: 'mail@example.com', delegatedTo: 'foo@example.com'});
                assert.ok(cal.toString().indexOf('foo@example') > -1);
            });
        });

        describe('delegatedFrom()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAttendee();
                assert.deepEqual(a, a.delegatedFrom(null));
                assert.deepEqual(a, a.delegatedFrom('foo@example.com'));
            });

            it('getter should return value', function() {
                var a = ical().createEvent().createAttendee();
                assert.equal(a.delegatedFrom(), null);
                a.delegatedFrom('foo@example.com');
                assert.equal(a.delegatedFrom(), 'foo@example.com');
                a.delegatedFrom(null);
                assert.equal(a.delegatedFrom(), null);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                event.createAttendee({email: 'mail@example.com', delegatedFrom: 'foo@example.com'});
                assert.ok(cal.toString().indexOf('foo@example.com') > -1);
            });
        });

        describe('delegatesTo()', function() {
            it('should return a new ICalAttendee instance by default', function() {
                var event = ical().createEvent(),
                    ICalAttendee = require('../lib/attendee.js');

                assert.ok(event.createAttendee().delegatesTo() instanceof ICalAttendee);
            });

            it('should reuse the same ICalAttendee instance if passed', function() {
                var event = ical().createEvent(),
                    attendee = event.createAttendee({name: 'Muh'});

                assert.deepEqual(event.createAttendee().delegatesTo(attendee), attendee);
            });

            it('should pass data to instance', function() {
                var event = ical().createEvent(),
                    attendee = event.createAttendee({name: 'Zac'}).delegatesTo({name: 'Cody'});

                assert.equal(attendee.name(), 'Cody');
            });
        });

        describe('delegatesFrom()', function() {
            it('should return a new ICalAttendee instance by default', function() {
                var event = ical().createEvent(),
                    ICalAttendee = require('../lib/attendee.js');

                assert.ok(event.createAttendee().delegatesFrom() instanceof ICalAttendee);
            });

            it('should reuse the same ICalAttendee instance if passed', function() {
                var event = ical().createEvent(),
                    attendee = event.createAttendee({name: 'Muh'});

                assert.deepEqual(event.createAttendee().delegatesFrom(attendee), attendee);
            });

            it('should pass data to instance', function() {
                var event = ical().createEvent(),
                    attendee = event.createAttendee({name: 'Zac'}).delegatesFrom({name: 'Cody'});

                assert.equal(attendee.name(), 'Cody');
            });
        });

        describe('generate()', function() {
            it('shoult throw an error without email', function() {
                var a = ical().createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                }).createAttendee({name: 'Testuser'});

                assert.throws(function() {
                    a.generate();
                }, /`email`/);
            });
        });
    });

    describe('ICalAlarm', function() {
        it('shouldn\'t work without event reference', function() {
            var ICalAlarm = require('../lib/alarm.js');
            assert.throws(function() {
                new ICalAlarm({type: 'display'});
            }, /`event`/);
        });

        it('should ignore unknown data attributes', function() {
            var cal = ical(),
                e = cal.createEvent().createAlarm({unknown: true, type: 'display'});
            assert.equal(e.type(), 'display');
        });

        describe('type()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAlarm();
                assert.deepEqual(a, a.type(null));
                assert.deepEqual(a, a.type('display'));
            });

            it('getter should return value', function() {
                var a = ical().createEvent().createAlarm();
                assert.equal(a.type(), null);
                a.type('display');
                assert.equal(a.type(), 'display');
                a.type(null);
                assert.equal(a.type(), null);
            });

            it('should throw error when type not allowed', function() {
                var a = ical().createEvent().createAlarm();
                assert.throws(function() {
                    a.type('BANANA');
                }, /`type`/);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                event.createAlarm({type: 'display', trigger: 60 * 10});
                assert.ok(cal.toString().indexOf('ACTION:DISPLAY') > -1);
            });
        });

        describe('trigger()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAlarm();
                assert.deepEqual(a, a.trigger(null));
                assert.deepEqual(a, a.trigger(60 * 10));
            });

            it('getter should return value', function() {
                var a = ical().createEvent().createAlarm(),
                    now = new Date();

                assert.equal(a.trigger(), null);
                assert.equal(a.triggerAfter(), null);

                a.trigger(300);
                assert.equal(a.trigger(), 300);
                assert.equal(a.triggerAfter(), -300);

                // Date
                a.trigger(now);
                assert.deepEqual(a.trigger(), now);

                // Null
                a.trigger(null);
                assert.equal(a.trigger(), null);
                assert.equal(a.triggerAfter(), null);
            });

            it('should throw error when trigger not allowed', function() {
                var a = ical().createEvent().createAlarm();
                assert.throws(function() {
                    a.trigger(Infinity);
                }, /`trigger`/);
                assert.throws(function() {
                    a.trigger('hi');
                }, /`trigger`/);
                assert.throws(function() {
                    a.trigger(true);
                }, /`trigger`/);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    }),
                    trigger = new Date('2015-02-01T13:38:45Z'),
                    alarm;

                alarm = event.createAlarm({type: 'display', trigger: 60 * 10});
                assert.ok(cal.toString().indexOf('TRIGGER:-PT10M') > -1);

                alarm.trigger(trigger);
                assert.ok(cal.toString().indexOf('TRIGGER;VALUE=DATE-TIME:20150201T133845Z') > -1);
            });
        });

        describe('triggerAfter()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAlarm();
                assert.deepEqual(a, a.triggerAfter(60 * 10));
            });

            it('getter should return value', function() {
                var e = ical().createEvent().createAlarm().triggerAfter(300);
                assert.equal(e.triggerAfter(), 300);
                assert.equal(e.trigger(), -300);
            });

            it('should throw error when trigger not allowed', function() {
                var a = ical().createEvent().createAlarm();
                assert.throws(function() {
                    a.triggerAfter(Infinity);
                }, /`trigger`/);
                assert.throws(function() {
                    a.triggerAfter('hi');
                }, /`trigger`/);
                assert.throws(function() {
                    a.triggerAfter(true);
                }, /`trigger`/);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    }),
                    trigger = new Date('2015-02-01T13:38:45Z'),
                    alarm;

                alarm = event.createAlarm({type: 'display', triggerAfter: 60 * 10});
                assert.ok(cal.toString().indexOf('TRIGGER;RELATED=END:PT10M') > -1);

                alarm.triggerAfter(trigger);
                assert.ok(cal.toString().indexOf('TRIGGER;VALUE=DATE-TIME:20150201T133845Z') > -1);
            });
        });

        describe('repeat()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAlarm();
                assert.deepEqual(a, a.repeat(null));
                assert.deepEqual(a, a.repeat(4));
            });

            it('getter should return value', function() {
                var e = ical().createEvent().createAlarm();
                assert.equal(e.repeat(), null);
                e.repeat(100);
                assert.equal(e.repeat(), 100);
                e.repeat(null);
                assert.equal(e.repeat(), null);
            });

            it('should throw error if repeat not allowed', function() {
                var a = ical().createEvent().createAlarm();
                assert.throws(function() {
                    a.repeat(Infinity);
                }, /`repeat`/);
                assert.throws(function() {
                    a.repeat('hi');
                }, /`repeat`/);
                assert.throws(function() {
                    a.repeat(true);
                }, /`repeat`/);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                event.createAlarm({type: 'display', trigger: 300, repeat: 42, interval: 60});
                assert.ok(cal.toString().indexOf('REPEAT:42') > -1);
            });
        });

        describe('interval()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAlarm();
                assert.deepEqual(a, a.interval(null));
                assert.deepEqual(a, a.interval(60));
            });

            it('getter should return value', function() {
                var e = ical().createEvent().createAlarm();
                assert.equal(e.interval(), null);
                e.interval(30);
                assert.equal(e.interval(), 30);
                e.interval(null);
                assert.equal(e.interval(), null);
            });

            it('should throw error if repeat not allowed', function() {
                var a = ical().createEvent().createAlarm();
                assert.throws(function() {
                    a.interval(Infinity);
                }, /`interval`/);
                assert.throws(function() {
                    a.interval('hi');
                }, /`interval`/);
                assert.throws(function() {
                    a.interval(true);
                }, /`interval`/);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                event.createAlarm({type: 'display', trigger: 300, repeat: 42, interval: 90});
                assert.ok(cal.toString().indexOf('DURATION:PT1M30S') > -1);
            });
        });

        describe('attach()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAlarm();
                assert.deepEqual(a, a.attach(null));
                assert.deepEqual(a, a.attach('https://sebbo.net/beep.aud'));
            });

            it('getter should return value', function() {
                var t = {uri: 'https://example.com/alarm.aud', mime: 'audio/basic'},
                    e = ical().createEvent().createAlarm();

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

            it('should throw error withour uri', function() {
                var a = ical().createEvent().createAlarm();
                assert.throws(function() {
                    a.attach({mime: 'audio/basic'});
                }, /`attach.uri`/);
            });

            it('should throw error when unknown format', function() {
                var a = ical().createEvent().createAlarm();
                assert.throws(function() {
                    a.attach(Infinity);
                }, /`attach`/);
            });

            it('should change something', function() {
                var cal = ical(),
                    e = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    }),
                    a = e.createAlarm({
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

        describe('description()', function() {
            it('setter should return this', function() {
                var a = ical().createEvent().createAlarm();
                assert.deepEqual(a, a.description(null));
                assert.deepEqual(a, a.description('Hey Ho!'));
            });

            it('getter should return value', function() {
                var e = ical().createEvent().createAlarm();
                assert.deepEqual(e.description(), null);
                e.description('blablabla');
                assert.deepEqual(e.description(), 'blablabla');
                e.description(null);
                assert.deepEqual(e.description(), null);
            });

            it('should change something', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                event.createAlarm({type: 'display', trigger: 300, description: 'Huibuh!'});
                assert.ok(cal.toString().indexOf('\r\nDESCRIPTION:Huibuh') > -1);
            });

            it('should fallback to event summary', function() {
                var cal = ical(),
                    event = cal.createEvent({
                        start: new Date(),
                        end: new Date(new Date().getTime() + 3600000),
                        summary: 'Example Event'
                    });

                event.createAlarm({type: 'display', trigger: 300});
                assert.ok(cal.toString().indexOf('\r\nDESCRIPTION:Example Event') > -1);
            });
        });

        describe('generate()', function() {
            it('shoult throw an error without type', function() {
                var a = ical().createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                }).createAlarm({trigger: 300});

                assert.throws(function() {
                    a.generate();
                }, /`type`/);
            });

            it('shoult throw an error without trigger', function() {
                var a = ical().createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                }).createAlarm({type: 'display'});

                assert.throws(function() {
                    a.generate();
                }, /`trigger`/);
            });

            it('shoult throw an error if repeat is set but interval isn\'t', function() {
                var a = ical().createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                }).createAlarm({type: 'display', trigger: 300, repeat: 4});

                assert.throws(function() {
                    a.generate();
                }, /for `interval`/);
            });

            it('shoult throw an error if interval is set but repeat isn\'t', function() {
                var a = ical().createEvent({
                    start: new Date(),
                    end: new Date(new Date().getTime() + 3600000),
                    summary: 'Example Event'
                }).createAlarm({type: 'display', trigger: 300, interval: 60});

                assert.throws(function() {
                    a.generate();
                }, /for `repeat`/);
            });
        });
    });
});
