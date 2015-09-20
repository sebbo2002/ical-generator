'use strict';


/**
 * @author Sebastian Pekarek
 * @module calendar
 * @constructor ICalCalendar Calendar
 */
var ICalCalendar = function(_data) {
	var data = {},
		attributes = ['domain', 'prodId', 'name', 'timezone', 'events'],
		generate,
		i;


	generate = function(calendar) {
		var g = '';

		// VCALENDAR and VERSION
		g = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\n';

		// PRODID
		g += 'PRODID:-' + data.prodid + '\r\n';

		// NAME
		if(data.name) {
			g += 'X-WR-CALNAME:' + data.name + '\r\n';
		}

		if(data.timezone) {
			g += 'X-WR-TIMEZONE:' + data.timezone + '\r\n';
		}

		// Events
		data.events.forEach(function(event) {
			g += event.generate(calendar);
		});

		g += 'END:VCALENDAR';
		return g;
	};


	/**
	 * Set your feed's domain…
	 *
	 * @param domain Domain
	 * @deprecated since 0.2.0
	 * @returns {ICalCalendar}
	 */
	this.setDomain = function(domain) {
		this.domain(domain);
		return this;
	};


	/**
	 * Set/Get your feed's domain…
	 *
	 * @param [domain] Domain
	 * @since 0.2.0
	 * @returns {ICalCalendar|String}
	 */
	this.domain = function(domain) {
		if(!domain) {
			return data.domain;
		}

		data.domain = domain.toString();
		return this;
	};


	/**
	 * Set your feed's prodid. Can be either a string like
	 * "//sebbo.net//ical-generator//EN" or an object like
	 * {
	 *   "company": "sebbo.net",
	 *   "product": "ical-generator"
	 *   "language": "EN"
	 * }
	 *
	 * `language` is optional and defaults to `EN`.
	 *
	 * @param prodid ProdID
	 * @deprecated since 0.2.0
	 * @returns {ICalCalendar}
	 */
	this.setProdID = function(prodid) {
		if(!prodid || typeof prodid !== 'object') {
			throw '`prodid` is not an object!';
		}

		// update errors to 0.1.x version
		try {
			this.prodId(prodid);
		}
		catch(err) {
			throw err.replace(/`([\w.]+)`/i, 'event.$1');
		}

		return this;
	};


	/**
	 * Set/Get your feed's prodid. `prodid` can be either a
	 * string like "//sebbo.net//ical-generator//EN" or an
	 * object like
	 * {
 *   "company": "sebbo.net",
 *   "product": "ical-generator"
 *   "language": "EN"
 * }
	 *
	 * `language` is optional and defaults to `EN`.
	 *
	 * @param [prodid] ProdID
	 * @since 0.2.0
	 * @returns {ICalCalendar}
	 */
	this.prodId = function(prodid) {
		if(!prodid) {
			return data.prodid;
		}

		var prodIdRegEx = /^\/\/(.+)\/\/(.+)\/\/([A-Z]{1,4})$/,
			language;

		if(typeof prodid === 'string' && prodIdRegEx.test(prodid)) {
			data.prodid = prodid;
			return this;
		}
		if(typeof prodid === 'string') {
			throw '`prodid` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#prodidstringobject-prodid';
		}

		if(typeof prodid !== 'object') {
			throw '`prodid` needs to be a valid formed string or an object!';
		}

		if(!prodid.company) {
			throw '`prodid.company` is a mandatory item!';
		}
		if(!prodid.product) {
			throw '`prodid.product` is a mandatory item!';
		}

		language = (prodid.language || 'EN').toUpperCase();
		data.prodid = '//' + prodid.company + '//' + prodid.product + '//' + language;
		return this;
	};


	/**
	 * Set your feed's name…
	 *
	 * @param name Name
	 * @deprecated since 0.2.0
	 * @returns {ICalCalendar}
	 */
	this.setName = function(name) {
		this.name(name);
		return this;
	};


	/**
	 * Set/Get your feed's name…
	 *
	 * @param [name] Name
	 * @since 0.2.0
	 * @returns {ICalCalendar}
	 */
	this.name = function(name) {
		if(!name) {
			return data.name;
		}

		data.name = name.toString();
		return this;
	};


	/**
	 * Set your feed's timezone.
	 * Used to set `X-WR-TIMEZONE`.
	 *
	 * @param timezone Timezone
	 * @example cal.setTZ('America/New_York');
	 * @deprecated since 0.2.0
	 * @returns {ICalCalendar}
	 */
	this.setTZ = function(timezone) {
		this.timezone(timezone);
		return this;
	};


	/**
	 * Set/Get your feed's timezone.
	 * Used to set `X-WR-TIMEZONE`.
	 *
	 * @param [timezone] Timezone
	 * @example cal.timezone('America/New_York');
	 * @since 0.2.0
	 * @returns {ICalCalendar}
	 */
	this.timezone = function(timezone) {
		if(!timezone) {
			return data.timezone;
		}

		data.timezone = timezone.toString();
		return this;
	};


	/**
	 * Create a new Event and return the calendar object…
	 *
	 * @param option Event event
	 * @deprecated since 0.2.0
	 * @returns {ICalCalendar}
	 */
	this.addEvent = function(event) {
		if(!event || typeof event !== 'object') {
			throw 'event is not an object!';
		}

		// validation: start
		if(!event.start) {
			throw 'event.start is a mandatory item!';
		}

		// validation: end
		if(!event.end) {
			throw 'event.end is a mandatory item!';
		}

		// validation: summary
		if(!event.summary) {
			throw 'event.summary is a mandatory item!';
		}


		var ICalEvent = require('./event.js'),
			e;

		// update errors to 0.1.x version
		try {
			e = new ICalEvent(event);
		}
		catch(err) {
			throw err.replace(/`([\w.]+)`/i, 'event.$1');
		}

		data.events.push(e);
		return this;
	};


	/**
	 * Create a new Event and return the event object…
	 *
	 * @param [eventData] Event eventData
	 * @since 0.2.0
	 * @returns {ICalEvent}
	 */
	this.createEvent = function(eventData) {
		var ICalEvent = require('./event.js'),
			event = new ICalEvent(eventData);

		data.events.push(event);
		return event;
	};


	/**
	 * Get all events or add multiple events…
	 *
	 * @since 0.2.0
	 * @returns {ICalEvent[]|ICalCalendar}
	 */
	this.events = function(events) {
		if(!events) {
			return data.events;
		}

		var cal = this;
		events.forEach(function(e) {
			cal.createEvent(e);
		});
		return cal;
	};


	/**
	 * Save ical file with `fs.save`
	 *
	 * @param path Filepath
	 * @param [cb] Callback
	 * @returns {ICalCalendar}
	 */
	this.save = function(path, cb) {
		require('fs').writeFile(path, generate(this), cb);
		return this;
	};


	/*jslint stupid: true */

	/**
	 * Save ical file with `fs.saveSync`
	 *
	 * @param path Filepath
	 * @returns Number Number of Bytes written
	 */
	this.saveSync = function(path) {
		return require('fs').writeFileSync(path, generate(this));
	};

	/*jslint stupid: false */


	/**
	 * Save ical file with `fs.saveSync`
	 *
	 * @param {http.ServerResponse} response Response
	 * @param String [filename] Filename
	 * @returns Number Number of Bytes written
	 */
	this.serve = function(response, filename) {
		response.writeHead(200, {
			'Content-Type': 'text/calendar; charset=utf-8',
			'Content-Disposition': 'attachment; filename="' + (filename || 'calendar.ics') + '"'
		});
		response.end(generate(this));

		return this;
	};


	/**
	 * Return ical as string…
	 *
	 * @returns String ical
	 */
	this.toString = function() {
		return generate(this);
	};


	/**
	 * Export calender as JSON Object to use it later…
	 *
	 * @since 0.2.4
	 * @returns Object Calendar
	 */
	this.toJSON = function() {
		var tools = require('./_tools.js');
		return tools.toJSON(this, attributes);
	};


	/**
	 * Get number of events in calendar…
	 *
	 * @returns Number Number of events in calendar
	 */
	this.length = function() {
		return data.events.length;
	};


	/**
	 * Reset calendar to default state…
	 *
	 * @returns {ICalCalendar}
	 */
	this.clear = function() {
		data.domain = require('os').hostname();
		data.prodid = '//sebbo.net//ical-generator//EN';
		data.name = null;
		data.timezone = null;

		data.events = [];
		return this;
	};


	/**
	 * Deprecated method, does nothing…
	 *
	 * @deprecated since 0.2.0
	 * @returns {ICalCalendar}
	 */
	this.generate = function() {
		return this;
	};


	if(typeof _data === 'string') {
		_data = JSON.parse(_data);
	}

	this.clear();
	for(i in _data) {
		if(_data.hasOwnProperty(i) && attributes.indexOf(i) > -1) {
			this[i](_data[i]);
		}
	}
};

module.exports = ICalCalendar;
