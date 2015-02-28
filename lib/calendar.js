'use strict';


/**
 * @author Sebastian Pekarek
 * @module obj-calendar
 * @constructor ICalCalendar Calendar
 */
var ICalCalendar = function() {
	this.clear();
};


/**
 * Set your feed's domain…
 *
 * @param domain Domain
 * @deprecated since 0.2.0
 * @returns {ICalCalendar}
 */
ICalCalendar.prototype.setDomain = function(domain) {
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
ICalCalendar.prototype.domain = function(domain) {
	if(!domain) {
		return this.domain;
	}

	this.domain = domain.toString();
	this.generated = null;
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
ICalCalendar.prototype.setProdID = function(prodid) {
	this.prodId(prodid);
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
ICalCalendar.prototype.prodId = function(prodid) {
	if(!prodid) {
		return this.prodid;
	}

	// @todo improve regex
	if(typeof prodid === 'string' && prodid.test(/^\/\/(.+)\/\/(.+)\/\/([A-Z]{1,4})$/)) {
		this.prodid = prodid;
		this.generated = null;
		return this;
	}
	if(typeof prodid === 'string') {
		// @todo URL with Documentation on GitHub
		throw '`prodid` isn\'t formated correctly. See documentation for help…';
	}

	if(!prodid || typeof prodid !== 'object') {
		throw '`prodid` needs to be a valid formed string or an object!';
	}

	if(prodid.company) {
		throw '`prodid.company` is a mandatory item!';
	}
	if(prodid.product) {
		throw '`prodid.product` is a mandatory item!';
	}

	var language = (prodid.language || 'EN').toUpperCase();
	this.prodid = '//' + prodid.company + '//' + prodid.product + '//' + language;
	this.generated = null;
	return this;
};


/**
 * Set your feed's name…
 *
 * @param name Name
 * @deprecated since 0.2.0
 * @returns {ICalCalendar}
 */
ICalCalendar.prototype.setName = function(name) {
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
ICalCalendar.prototype.name = function(name) {
	if(!name) {
		return this.name;
	}

	this.name = name.toString();
	this.generated = null;
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
ICalCalendar.prototype.setTZ = function(timezone) {
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
ICalCalendar.prototype.timezone = function(timezone) {
	if(!timezone) {
		return this.timezone;
	}

	this.timezone = timezone.toString();
	this.generated = null;
	return this;
};


/**
 * Create a new Event and return the calendar object…
 *
 * @param option Event data
 * @deprecated since 0.2.0
 * @returns {ICalCalendar}
 */
ICalCalendar.prototype.addEvent = function(data) {
	var ICalEvent = require('./event.js'),
		event = new ICalEvent(data);

	this.events.push(event);
	this.generated = null;
	return this;
};


/**
 * Create a new Event and return the event object…
 *
 * @param [option] Event data
 * @since 0.2.0
 * @returns {ICalEvent}
 */
ICalCalendar.prototype.createEvent = function(data) {
	var ICalEvent = require('./event.js'),
		event = new ICalEvent(data);

	this.events.push(event);
	this.generated = null;
	return event;
};


/**
 * Get all events or add multiple events…
 *
 * @since 0.2.0
 * @returns {ICalEvent[]|ICalCalendar}
 */
ICalCalendar.prototype.events = function(events) {
	if(!events) {
		return this.events;
	}

	events.forEach(this.createEvent);
	return this;
};


/**
 * Save ical file with `fs.save`
 *
 * @param path Filepath
 * @param [cb] Callback
 * @returns {ICalCalendar}
 */
ICalCalendar.prototype.save = function(path, cb) {
	if(!this.generated) {
		this.generate();
	}

	require('fs').writeFile(path, this.generated, cb);
	return this;
};


/*jslint stupid: true */

/**
 * Save ical file with `fs.saveSync`
 *
 * @param path Filepath
 * @returns Number Number of Bytes written
 */
ICalCalendar.prototype.saveSync = function(path) {
	if(!this.generated) {
		this.generate();
	}

	return require('fs').writeFileSync(path, this.generated);
};

/*jslint stupid: false */


/**
 * Save ical file with `fs.saveSync`
 *
 * @param {http.ServerResponse} response Response
 * @param String [filename] Filename
 * @returns Number Number of Bytes written
 */
ICalCalendar.prototype.serve = function(response, filename) {
	if(!this.generated) {
		this.generate();
	}

	response.writeHead(200, {
		'Content-Type': 'text/calendar',
		'Content-Disposition': 'attachment; filename="' + (filename || 'calendar.ics') + '"'
	});
	response.end(this.generated);

	return this;
};


/**
 * Return ical as string…
 *
 * @returns String ical
 */
ICalCalendar.prototype.toString = function() {
	if(!this.generated) {
		this.generate();
	}

	return this.generated;
};


/**
 * Get number of events in calendar…
 *
 * @returns Number Number of events in calendar
 */
ICalCalendar.prototype.length = function() {
	return this.events.length;
};


/**
 * Reset calendar to default state…
 *
 * @returns {ICalCalendar}
 */
ICalCalendar.prototype.clear = function() {
	this.domain = null;
	this.prodid = '//sebbo.net//ical-generator//EN';
	this.name = null;
	this.timezone = null;

	this.generated = null;
	this.events = [];
	return this;
};


module.exports = ICalCalendar;