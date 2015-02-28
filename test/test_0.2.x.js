var assert = require('assert'),
	ical = require(__dirname + '/../lib/');

describe('ical-generator 0.2.x', function() {
	'use strict';

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
			var cal = ical().prodId('//loremipsum.de//ical-tests//EN');
			cal.createEvent({
				start: new Date(),
				end: new Date(new Date().getTime() + 3600000),
				summary: 'Example Event'
			});
			assert.ok(cal.toString().indexOf('loremipsum.de') > -1);
		});
	});
});
