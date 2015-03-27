'use strict';


/**
 * @author Sebastian Pekarek
 * @module event
 * @constructor ICalEvent Event
 */
var ICalEvent = function(_data) {
	var vars,
		i,
		data;

	vars = {
		allowedMethods: ['PUBLISH', 'REQUEST', 'REPLY', 'ADD', 'CANCEL', 'REFRESH', 'COUNTER', 'DECLINECOUNTER'],
		allowedRepeatingFreq: ['SECONDLY', 'MINUTELY', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
		allowedStatuses: ['CONFIRMED', 'TENATIVE', 'CANCELLED']
	};

	data = {
		id: ('0000' + (Math.random() * Math.pow(36,4) << 0).toString(36)).substr(-4),
		start: null,
		end: null,
		stamp: new Date(),
		allDay: false,
		floating: false,
		repeating: null,
		summary: '',
		location: null,
		description: null,
		organizer: null,
		attendees: [],
		method: null,
		status: null,
		url: null,
		categories: [],
		alarms: []	
	};

	/**
	 * Set/Get the event's ID
	 *
	 * @param id ID
	 * @since 0.2.0
	 * @returns {ICalEvent|String}
	 */
	this.id = function(id) {
		if(!id) {
			return data.id;
		}

		data.id = id;
		return this;
	};


	/**
	 * Set/Get the event's ID
	 *
	 * @param id ID
	 * @since 0.2.0
	 * @alias id
	 * @returns {ICalEvent|String}
	 */
	this.uid = this.id;


	/**
	 * Set/Get the event's start date
	 *
	 * @param {Date} start
	 * @since 0.2.0
	 * @returns {ICalEvent|Date}
	 */
	this.start = function(start) {
		if(!start) {
			return data.start;
		}

		if(!(start instanceof Date)) {
			throw '`start` must be a Date Object!';
		}
		data.start = start;

		if(data.start && data.end && data.start > data.end) {
			var t = data.start;
			data.start = data.end;
			data.end = t;
		}
		return this;
	};


	/**
	 * Set/Get the event's end date
	 *
	 * @param {Date} end
	 * @since 0.2.0
	 * @returns {ICalEvent|Date}
	 */
	this.end = function(end) {
		if(!end) {
			return data.end;
		}

		if(!(end instanceof Date)) {
			throw '`end` must be a Date Object!';
		}
		data.end = end;

		if(data.start && data.end && data.start > data.end) {
			var t = data.start;
			data.start = data.end;
			data.end = t;
		}
		return this;
	};


	/**
	 * Set/Get the event's timestamp
	 *
	 * @param {Date} stamp
	 * @since 0.2.0
	 * @returns {ICalEvent|Date}
	 */
	this.stamp = function(stamp) {
		if(!stamp) {
			return data.stamp;
		}

		if(!(stamp instanceof Date)) {
			throw '`stamp` must be a Date Object!';
		}
		data.stamp = stamp;
		return this;
	};


	/**
	 * SetGet the event's timestamp
	 *
	 * @param {Date} stamp
	 * @since 0.2.0
	 * @alias stamp
	 * @returns {ICalEvent|Date}
	 */
	this.timestamp = this.stamp;


	/**
	 * Set/Get the event's allDay flag
	 *
	 * @param {Boolean} allDay
	 * @since 0.2.0
	 * @returns {ICalEvent|Boolean}
	 */
	this.allDay = function(allDay) {
		if(!allDay) {
			return data.allDay;
		}

		data.allDay = !!allDay;
		return this;
	};


	/**
	 * Set/Get the event's floating flag
	 * See https://tools.ietf.org/html/rfc5545#section-3.3.12
	 *
	 * @param {Boolean} floating
	 * @since 0.2.0
	 * @returns {ICalEvent|Boolean}
	 */
	this.floating = function(floating) {
		if(!floating) {
			return data.floating;
		}

		data.floating = !!floating;
		return this;
	};


	/**
	 * Set/Get the event's repeating stuff
	 *
	 * @param repeating
	 * @since 0.2.0
	 * @returns {ICalEvent|Object}
	 */
	this.repeating = function(repeating) {
		if(!repeating) {
			return data.repeating;
		}

		if(!repeating.freq || vars.allowedRepeatingFreq.indexOf(repeating.freq.toUpperCase()) === -1) {
			throw '`repeating.freq` is a mandatory item, and must be one of the following: ' + vars.allowedRepeatingFreq.join(', ') + '!';
		}
		data.repeating = {
			freq: repeating.freq.toUpperCase()
		};

		if(repeating.count) {
			if(!isFinite(repeating.count)) {
				throw '`repeating.count` must be a Number!';
			}

			data.repeating.count = repeating.count;
		}

		if(repeating.interval) {
			if(!isFinite(repeating.interval)) {
				throw '`repeating.interval` must be a Number!';
			}

			data.repeating.interval = repeating.interval;
		}

		if(repeating.until) {
			if(!(repeating.until instanceof Date)) {
				throw '`repeating.until` must be a Date Object!';
			}

			data.repeating.until = repeating.until;
		}

		return this;
	};


	/**
	 * Set/Get the event's summary
	 *
	 * @param {String} summary
	 * @since 0.2.0
	 * @returns {ICalEvent|String}
	 */
	this.summary = function(summary) {
		if(!summary) {
			return data.summary;
		}

		data.summary = summary.toString();
		return this;
	};


	/**
	 * Set/Get the event's location
	 *
	 * @param {String} location
	 * @since 0.2.0
	 * @returns {ICalEvent|String}
	 */
	this.location = function(location) {
		if(!location) {
			return data.location;
		}

		data.location = location.toString();
		return this;
	};


	/**
	 * Set/Get the event's description
	 *
	 * @param {String} description
	 * @since 0.2.0
	 * @returns {ICalEvent|String}
	 */
	this.description = function(description) {
		if(!description) {
			return data.description;
		}

		data.description = description.toString();
		return this;
	};


	/**
	 * Set/Get the event's organizer
	 *
	 * @param {Object} organizer
	 * @since 0.2.0
	 * @returns {ICalEvent|String}
	 */
	this.organizer = function(_organizer) {
		if(!_organizer) {
			return data.organizer;
		}

		var organizer = null,
			organizerRegEx = /^(.+) ?<([^>]+)>$/;

		if(typeof _organizer === 'string' && organizerRegEx.test(_organizer)) {
			organizer = {
				name: RegExp.$1.trim(),
				email: RegExp.$2
			};
		}
		else if(typeof _organizer === 'object') {
			organizer = {
				name: _organizer.name,
				email: _organizer.email
			};
		}
		else if(typeof _organizer === 'string') {
			throw '`organizer` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#organizerstringobject-organizer';
		}
		else {
			throw '`organizer` needs to be a valid formed string or an object. See https://github.com/sebbo2002/ical-generator#organizerstringobject-organizer';
		}

		if(!organizer.name) {
			throw '`organizer.name` is empty!';
		}
		if(!organizer.email) {
			throw '`organizer.email` is empty!';
		}

		data.organizer = {
			name: organizer.name,
			email: organizer.email
		};
		return this;
	};


	/**
	 * Create a new Attendee and return the attendee object…
	 *
	 * @param [attendeeData] Attendee-Options
	 * @since 0.2.0
	 * @returns {ICalAttendee}
	 */
	this.createAttendee = function(_attendeeData) {
		var ICalAttendee = require('./attendee.js'),
			attendeeRegEx = /^(.+) ?<([^>]+)>$/,
			attendee;

		if(typeof _attendeeData === 'string' && attendeeRegEx.test(_attendeeData)) {
			attendee = new ICalAttendee({
				name: RegExp.$1.trim(),
				email: RegExp.$2
			}, this);

			data.attendees.push(attendee);
			return attendee;
		}
		if(typeof _attendeeData === 'string') {
			throw '`attendee` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#createattendeeobject-options';
		}

		attendee = new ICalAttendee(_attendeeData, this);
		data.attendees.push(attendee);
		return attendee;
	};


	/**
	 * Get all attendees or add attendees…
	 *
	 * @since 0.2.0
	 * @returns {ICalAttendees[]|ICalEvent}
	 */
	this.attendees = function(attendees) {
		if(!attendees) {
			return data.attendees;
		}

		var cal = this;
		attendees.forEach(function(e) {
			cal.createAttendee(e);
		});
		return cal;
	};

	/**
	 * Create a new Category and return the category object…
	 * @add by Yunier Sosa
	 * @param [categoryData] Category-Options
	 * @since 0.2.0
	 * @returns {ICalCategory}
	 */
	this.createCategory = function(_categoryData) {
		var ICalCategory = require('./category.js'),
			categoryRegEx = /^(.+) ?<([^>]+)>$/,
			category;

		if(typeof _categoryData === 'string' && categoryRegEx.test(_categoryData)) {
			category = new ICalCategory({
				name: RegExp.$1.trim()
			}, this);

			data.categories.push(category);
			return category;
		}
		if(typeof _categoryData === 'string') {
			throw '`category` isn\'t formated correctly. See https://github.com/sebbo2002/ical-generator#createattendeeobject-options';
		}

		category = new ICalCategory(_categoryData, this);
		data.categories.push(category);
		return category;
	};

	/**
	 * Get all categories or add attendees…
	 * @add by Yunier Sosa
	 * @since 0.2.0
	 * @returns {ICalAttendees[]|ICalEvent}
	 */
	this.categories = function(categories) {
		if(!categories) {
			return data.categories;
		}

		var cal = this;
		categories.forEach(function(e) {
			cal.createCategory(e);
		});
		return cal;
	};

	/**
	 * Create a new Alarm and return the alarm object…
	 *
	 * @param [alarmData] Alarm-Options
	 * @since 0.2.0
	 * @returns {ICalAlarm}
	 */
	this.createAlarm = function(_alarmData) {
		var ICalAlarm = require('./alarm.js'),
			alarmRegEx = /^(.+) ?<([^>]+)>$/,
			alarm;

		if(typeof _alarmData === 'string' && alarmRegEx.test(_alarmData)) {
			alarm = new ICalAlarm({
				trigger: RegExp.$1.trim(),
				action: RegExp.$2.trim(),
				description: RegExp.$3.trim()
			}, this);

			data.alarms.push(alarm);
			return alarm;
		}
		if(typeof _alarmData === 'string') {
			throw '`alarm` isn\'t formated correctly.';
		}

		alarm = new ICalAlarm(_alarmData, this);
		data.alarms.push(alarm);
		return alarm;
	};


	/**
	 * Get all alarms or add alarms
	 *
	 * @since 0.2.0
	 * @returns {ICalAttendees[]|ICalEvent}
	 */
	this.alarms = function(alarms) {
		if(!alarms) {
			return data.alarms;
		}

		var cal = this;
		alarms.forEach(function(e) {
			cal.createAlarm(e);
		});
		return cal;
	};


	/**
	 * Set/Get the event's method
	 *
	 * @param {String} method
	 * @since 0.2.0
	 * @returns {ICalEvent|String}
	 */
	this.method = function(method) {
		if(!method) {
			return data.method;
		}

		if(vars.allowedMethods.indexOf(method.toUpperCase()) === -1) {
			throw '`method` must be one of the following: ' + vars.allowedMethods.join(', ') + '!';
		}

		data.method = method.toUpperCase();
		return this;
	};


	/**
	 * Set/Get the event's status
	 *
	 * @param {String} status
	 * @since 0.2.0
	 * @returns {ICalEvent|String}
	 */
	this.status = function(status) {
		if(!status) {
			return data.status;
		}

		if(vars.allowedStatuses.indexOf(status.toUpperCase()) === -1) {
			throw '`status` must be one of the following: ' + vars.allowedStatuses.join(', ') + '!';
		}

		data.status = status.toUpperCase();
		return this;
	};


	/**
	 * Set/Get the event's URL
	 *
	 * @param {String} url URL
	 * @since 0.2.0
	 * @returns {ICalEvent|String}
	 */
	this.url = function(url) {
		if(!url) {
			return data.url;
		}

		data.url = url.toString();
		return this;
	};


	/**
	 * Export Event to iCal
	 *
	 * @param {ICalCalendar}
	 * @since 0.2.0
	 * @returns {String}
	 */
	this.generate = function(calendar) {
		var g = '';

		if(!calendar) {
			throw '`calendar` option required!';
		}
		if(!data.start) {
			throw 'No value for `start` in ICalEvent #' + data.id + ' given!';
		}
		if(!data.end) {
			throw 'No value for `end` in ICalEvent #' + data.id + ' given!';
		}

		function _formatDate(d, dateonly, floating) {
			var s;

			function pad(i) {
				return (i < 10 ? '0': '') + i;
			}

			s = d.getUTCFullYear();
			s += pad(d.getUTCMonth() + 1);
			s += pad(d.getUTCDate());

			if(!dateonly) {
				s += 'T';
				s += pad(d.getUTCHours());
				s += pad(d.getUTCMinutes());
				s += pad(d.getUTCSeconds());

				if(!floating) {
					s += 'Z';
				}
			}

			return s;
		}

		function escape(str) {
			return str.replace(/[\\;,\n]/g, function (match) {
				if (match === '\n') {
					return '\\n';
				}

				return '\\' + match;
			});
		}


		// DATE & TIME
		g += 'BEGIN:VEVENT\n';
		g += 'UID:' + _formatDate(data.start) + '-' + data.id + '@' + calendar.domain() + '\n';
		g += 'DTSTAMP:' + _formatDate(data.stamp) + '\n';
		if(data.allDay) {
			g += 'DTSTART;VALUE=DATE:' + _formatDate(data.start, true) + '\n';
			g += 'DTEND;VALUE=DATE:' + _formatDate(data.end, true) + '\n';
		}else{
			g += 'DTSTART:' + _formatDate(data.start, false, data.floating) + '\n';
			g += 'DTEND:' + _formatDate(data.end, false, data.floating) + '\n';
		}

		// REPEATING
		if(data.repeating) {
			g += 'RRULE:FREQ=' + data.repeating.freq;

			if(data.repeating.count) {
				g += ';COUNT=' + data.repeating.count;
			}

			if(data.repeating.interval) {
				g += ';INTERVAL=' + data.repeating.interval;
			}

			if(data.repeating.until) {
				g += ';UNTIL=' + _formatDate(data.repeating.until);
			}

			g += '\n';
		}

		// SUMMARY
		g += 'SUMMARY:' + escape(data.summary) + '\n';

		// LOCATION
		if(data.location) {
			g += 'LOCATION:' + escape(data.location) + '\n';
		}

		// DESCRIPTION
		if(data.description) {
			g += 'DESCRIPTION:' + escape(data.description )+ '\n';
		}

		// CATEGORIES
		data.categories.forEach(function(category) {
			g += category.generate();
		});

		// ORGANIZER
		if(data.organizer) {
			g += 'ORGANIZER;CN="' + data.organizer.name.replace(/"/g, '\\"') + '":mailto:' + data.organizer.email + '\n';
		}

		// ATTENDEES
		data.attendees.forEach(function(attendee) {
			g += attendee.generate();
		});

		// URL
		if(data.url) {
			g += 'URL;VALUE=URI:' + data.url + '\n';
		}

		// METHOD & STATUS
		if(data.method) {
			g += 'METHOD:' + data.method.toUpperCase() + '\n';
		}
		if(data.status) {
			g += 'STATUS:' + data.status.toUpperCase() + '\n';
		}

		// ALARMS
		data.alarms.forEach(function(alarm) {
			g += alarm.generate();
		});

		g += 'END:VEVENT\n';
		return g;
	};


	for(i in _data) {
		if(_data.hasOwnProperty(i) && ['id', 'uid', 'start', 'end', 'stamp', 'timestamp', 'allDay', 'floating', 'repeating', 'summary', 'location', 'description', 'organizer', 'attendees', 'categories', 'method', 'status', 'url', 'alarms'].indexOf(i) > -1) {
			this[i](_data[i]);
		}
	}
};

module.exports = ICalEvent;