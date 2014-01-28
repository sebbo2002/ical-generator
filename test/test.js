var assert = require("assert");

describe('ical-generator', function() {
	describe('setDomain()', function() {
		it('should return all public methods', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.deepEqual(cal, cal.setDomain('localhost'));
		});

		it('should change something', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
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


	describe('setProdID()', function() {
		it('should return all public methods', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.deepEqual(cal, cal.setProdID({
				company: 'loremipsum.com',
				product: 'awesome-unit-tests'
			}));
		});

		it('should throw error when not an object', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.throws(function() {
				cal.setProdID(false);
			}, /not an object/);
		});

		it('should throw error when no company given', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.throws(function() {
				cal.setProdID({});
			}, /prodid.company is a mandatory item/);
		});

		it('should throw error when no product given', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.throws(function() {
				cal.setProdID({
					company: 'sebbo.net'
				});
			}, /prodid.product is a mandatory item/);
		});

		it('should change something #1', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			cal.setProdID({
				company: 'loremipsum.com',
				product: 'awesome-unit-tests'
			});

			assert(cal.toString().indexOf('loremipsum.com//awesome-unit-tests//EN') > -1);
		});

		it('should change something #2', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
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
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.deepEqual(cal, cal.addEvent({
				start: new Date(),
				end: new Date(new Date().getTime() + 3600000),
				summary: 'Example Event'
			}));
		});

		it('should throw error when not an object', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.throws(function() {
				cal.addEvent(null);
			}, /event is not an object/);
		});

		it('should throw error when no start time given', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.throws(function() {
				cal.addEvent({});
			}, /event.start is a mandatory item/);
		});

		it('should throw error when start time is not a date', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.throws(function() {
				cal.addEvent({
					start: 'hello'
				});
			}, /event.start must be a Date Object/);
		});

		it('should throw error when no end time given', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.throws(function() {
				cal.addEvent({
					start: new Date()
				});
			}, /event.end is a mandatory item/);
		});

		it('should throw error when end time is not a date', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.throws(function() {
				cal.addEvent({
					start: new Date(),
					end: 'hello'
				});
			}, /event.end must be a Date Object/);
		});

		it('should throw error when time stamp is not a date', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.throws(function() {
				cal.addEvent({
					start: new Date(),
					end: new Date(),
					stamp: 'hello'
				});
			}, /event.stamp must be a Date Object/);
		});

		it('should throw error when summary is empty', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.throws(function() {
				cal.addEvent({
					start: new Date(),
					end: new Date()
				});
			}, /event.summary is a mandatory item/);
		});

		it('should throw error when event.organizer.name is empty', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.throws(function() {
				cal.addEvent({
					start: new Date(),
					end: new Date(),
					summary: 'hello',
					organizer: {}
				});
			}, /event.organizer.name is empty/);
		});

		it('should throw error when event.organizer.email is empty', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
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
			}, /event.organizer.email is empty/);
		});
	});


	describe('generate()', function() {
		it('should return all public methods', function() {
			var generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			assert.deepEqual(cal, cal.generate());
		});

		it('case #1', function() {
			var fs = require('fs'),
				generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			cal.setDomain('sebbo.net');
			cal.setProdID({
				company: 'sebbo.net',
				product: 'ical-generator.tests'
			});

			cal.addEvent({
				uid: '123',
				start: new Date("Fr Oct 04 2013 22:39:30"),
				end: new Date("Fr Oct 04 2013 23:15:00"),
				stamp: new Date("Fr Oct 04 2013 23:34:53"),
				summary: 'Simple Event'
			});

			assert.equal(cal.toString(), fs.readFileSync(__dirname + '/results/generate_01.ical', 'utf8'));
		});

		it('case #2', function() {
			var fs = require('fs'),
				generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			cal.setDomain('sebbo.net');
			cal.setProdID({
				company: 'sebbo.net',
				product: 'ical-generator.tests'
			});

			cal.addEvent({
				uid: '123',
				start: new Date("Fr Oct 04 2013 22:39:30"),
				end: new Date("Fr Oct 04 2013 23:15:00"),
				stamp: new Date("Fr Oct 04 2013 23:34:53"),
				summary: 'Sample Event',
				location: 'localhost',
				description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'
			});

			assert.equal(cal.toString(), fs.readFileSync(__dirname + '/results/generate_02.ical', 'utf8'));
		});

		it('case #3', function() {
			var fs = require('fs'),
				generator = require(__dirname + '/../lib/ical-generator.js'),
				cal = generator();

			cal.setDomain('sebbo.net');
			cal.setProdID({
				company: 'sebbo.net',
				product: 'ical-generator.tests'
			});

			cal.addEvent({
				uid: '123',
				start: new Date("Fr Oct 04 2013 22:39:30"),
				end: new Date("Fr Oct 04 2013 23:15:00"),
				stamp: new Date("Fr Oct 04 2013 23:34:53"),
				summary: 'Sample Event',
				organizer: {
					name: 'Sebastian Pekarek',
					email: 'mail@sebbo.net'
				},
				url: 'http://sebbo.net/'
			});

			assert.equal(cal.toString(), fs.readFileSync(__dirname + '/results/generate_03.ical', 'utf8'));
		});
	});
});