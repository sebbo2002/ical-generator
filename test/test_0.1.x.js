var assert = require('assert');

describe('ical-generator 0.1.x', function() {
    'use strict';

    describe('setDomain()', function() {
        it('should return all public methods', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.deepEqual(cal, cal.setDomain('localhost'));
        });

        it('should change something', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            cal.setDomain('loremipsum.de');
            cal.addEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            assert(cal.toString().indexOf('loremipsum.de') > -1);
        });
    });


    describe('setName()', function() {
        it('should return all public methods', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.deepEqual(cal, cal.setName('test'));
        });

        it('should change something', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            cal.setName('testfile');
            cal.addEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            assert(cal.toString().indexOf('testfile') > -1);
        });
    });


    describe('setTZ()', function() {
        it('should return all public methods', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.deepEqual(cal, cal.setName('test'));
        });

        it('should change something', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            cal.setTZ('UTC+8');
            cal.addEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });

            assert(cal.toString().indexOf('UTC+8') > -1);
        });
    });


    describe('setProdID()', function() {
        it('should return all public methods', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.deepEqual(cal, cal.setProdID({
                company: 'loremipsum.com',
                product: 'awesome-unit-tests'
            }));
        });

        it('should throw error when not an object', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.setProdID(false);
            }, /not an object/);
        });

        it('should throw error when no company given', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.setProdID({});
            }, /prodid\.company is a mandatory item/);
        });

        it('should throw error when no product given', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.setProdID({
                    company: 'sebbo.net'
                });
            }, /prodid\.product is a mandatory item/);
        });

        it('should change something #1', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            cal.setProdID({
                company: 'loremipsum.com',
                product: 'awesome-unit-tests'
            });

            assert(cal.toString().indexOf('loremipsum.com//awesome-unit-tests//EN') > -1);
        });

        it('should change something #2', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            cal.setProdID({
                company: 'loremipsum.com',
                product: 'awesome-unit-tests',
                language: 'DE'
            });

            assert(cal.toString().indexOf('loremipsum.com//awesome-unit-tests//DE') > -1);
        });
    });


    describe('addEvent()', function() {
        it('should return all public methods', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.deepEqual(cal, cal.addEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            }));
        });

        it('should throw error when not an object', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent(null);
            }, /event is not an object/);
        });

        it('should throw error when no start time given', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({});
            }, /event\.start is a mandatory item/);
        });

        it('should throw error when start time is not a date', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: 'hello',
                    end: new Date(),
                    summary: 'test'
                });
            }, /event\.start must be a Date Object/);
        });

        it('should throw error when no end time given', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: new Date()
                });
            }, /event\.end is a mandatory item/);
        });

        it('should throw error when end time is not a date', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: new Date(),
                    end: 'hello',
                    summary: 'test'
                });
            }, /event\.end must be a Date Object/);
        });

        it('should throw error when time stamp is not a date', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: new Date(),
                    end: new Date(),
                    stamp: 'hello',
                    'summary': 'test'
                });
            }, /event\.stamp must be a Date Object/);
        });

        it('should throw error when repeating without freq', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: new Date(),
                    end: new Date(),
                    repeating: {},
                    summary: 'test'
                });
            }, /event\.repeating\.freq is a mandatory item, and must be one of the following/);
        });

        it('should throw error when repeating when freq is not allowed', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: new Date(),
                    end: new Date(),
                    summary: 'test',
                    repeating: {
                        freq: 'hello'
                    }
                });
            }, /event\.repeating\.freq is a mandatory item, and must be one of the following/);
        });

        it('should throw error when repeating.count is not a number', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: new Date(),
                    end: new Date(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        count: Infinity
                    }
                });
            }, /event\.repeating\.count must be a Number/);
        });

        it('should throw error when repeating.interval is not a number', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: new Date(),
                    end: new Date(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        interval: 'string'
                    }
                });
            }, /event\.repeating\.interval must be a Number/);
        });

        it('should throw error when repeating.until is not a date', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: new Date(),
                    end: new Date(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        until: 1413277003
                    }
                });
            }, /event\.repeating\.until must be a Date Object/);
        });

        it('should throw error when summary is empty', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: new Date(),
                    end: new Date()
                });
            }, /event\.summary is a mandatory item/);
        });

        it('should throw error when event.organizer.name is empty', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: new Date(),
                    end: new Date(),
                    summary: 'hello',
                    organizer: {}
                });
            }, /event\.organizer\.name is empty/);
        });

        it('should throw error when event.organizer.email is empty', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: new Date(),
                    end: new Date(),
                    summary: 'hello',
                    organizer: {
                        name: 'Otto'
                    }
                });
            }, /event\.organizer\.email is empty/);
        });

        it('should throw an error if method is not allowed', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: new Date(),
                    end: new Date(),
                    summary: 'hello',
                    method: 'hello world'
                });
            }, /event\.method must be one of the following/);
        });

        it('should throw an error if status is not allowed', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.throws(function() {
                cal.addEvent({
                    start: new Date(),
                    end: new Date(),
                    summary: 'hello',
                    status: 'hello world'
                });
            }, /event\.status must be one of the following/);
        });
    });


    describe('generate()', function() {
        it('should return all public methods', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.deepEqual(cal, cal.generate());
        });

        it('case #1', function() {
            var fs = require('fs'),
                generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            cal.setDomain('sebbo.net');
            cal.setProdID({
                company: 'sebbo.net',
                product: 'ical-generator.tests'
            });

            cal.addEvent({
                uid: '123',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'Simple Event'
            });

            /*jslint stupid: true */
            assert.equal(cal.toString(), fs.readFileSync(__dirname + '/results/generate_01.ics', 'utf8'));
        });

        it('case #2', function() {
            var fs = require('fs'),
                generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            cal.setDomain('sebbo.net');
            cal.setProdID({
                company: 'sebbo.net',
                product: 'ical-generator.tests'
            });

            cal.addEvent({
                uid: '123',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 04 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'Sample Event',
                location: 'localhost',
                description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\nbeep boop'
            });

            /*jslint stupid: true */
            assert.equal(cal.toString(), fs.readFileSync(__dirname + '/results/generate_02.ics', 'utf8'));
        });

        it('case #3', function() {
            var fs = require('fs'),
                generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            cal.setDomain('sebbo.net');
            cal.setProdID({
                company: 'sebbo.net',
                product: 'ical-generator.tests'
            });

            cal.addEvent({
                uid: '123',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                allDay: true,
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'Sample Event',
                organizer: {
                    name: 'Sebastian Pekarek',
                    email: 'mail@sebbo.net'
                },
                method: 'add',
                status: 'confirmed',
                url: 'http://sebbo.net/'
            });

            /*jslint stupid: true */
            assert.equal(cal.toString(), fs.readFileSync(__dirname + '/results/generate_03.ics', 'utf8'));
        });

        it('case #4 (repeating)', function() {
            var fs = require('fs'),
                generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            cal.setDomain('sebbo.net');
            cal.setProdID({
                company: 'sebbo.net',
                product: 'ical-generator.tests'
            });

            cal.addEvent({
                uid: '1',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'repeating by month',
                repeating: {
                    freq: 'MONTHLY'
                }
            });

            cal.addEvent({
                uid: '2',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'repeating by day, twice',
                repeating: {
                    freq: 'DAILY',
                    count: 2
                }
            });

            cal.addEvent({
                uid: '3',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'repeating by 3 weeks, until 2014',
                repeating: {
                    freq: 'WEEKLY',
                    interval: 3,
                    until: new Date('We Jan 01 2014 00:00:00 UTC')
                }
            });

            /*jslint stupid: true */
            assert.equal(cal.toString(), fs.readFileSync(__dirname + '/results/generate_04.ics', 'utf8'));
        });

        it('case #5 (floating)', function() {
            var fs = require('fs'),
                generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            cal.setDomain('sebbo.net');
            cal.setProdID({
                company: 'sebbo.net',
                product: 'ical-generator.tests'
            });

            cal.addEvent({
                uid: '1',
                start: new Date('Fr Oct 04 2013 22:39:30 UTC'),
                end: new Date('Fr Oct 06 2013 23:15:00 UTC'),
                stamp: new Date('Fr Oct 04 2013 23:34:53 UTC'),
                summary: 'floating',
                floating: true
            });

            /*jslint stupid: true */
            assert.equal(cal.toString(), fs.readFileSync(__dirname + '/results/generate_05.ics', 'utf8'));
        });
    });


    describe('save()', function() {
        it('should return all public methods and save it', function(done) {
            var generator = require(__dirname + '/../lib/index.js'),
                path = require('path'),
                fs = require('fs'),
                file = path.join(__dirname, 'save.ical'),
                cal = generator();

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
    });


    describe('saveSync()', function() {
        it('should save it', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                path = require('path'),
                fs = require('fs'),
                file = path.join(__dirname, 'save_sync.ical'),
                cal = generator();

            /*jslint stupid: true */
            cal.saveSync(file);
            assert.ok(fs.existsSync(file));
            fs.unlinkSync(file);

            cal.saveSync(file);
            assert.ok(fs.existsSync(file));
            fs.unlinkSync(file);
        });
    });


    describe('serve()', function() {
        it('should work', function(done) {
            var generator = require(__dirname + '/../lib/index.js'),
                portfinder = require('portfinder'),
                http = require('http'),
                cal = generator();

            cal.addEvent({
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
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

            assert.equal(cal.length(), 0);

            cal.addEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            });
            assert.equal(cal.length(), 1);
        });
    });


    describe('clear()', function() {
        it('should work', function() {
            var generator = require(__dirname + '/../lib/index.js'),
                cal = generator();

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
