'use strict';


/**
 * @author Yunier Sosa based on code of Sebastian Pekarek
 * @module alarm
 * @constructor ICalAlarm alarm
 */
var ICalAlarm = function(_data, event) {
	var vars,
		i,
		data;

	if(!event) {
		throw '`event` option required!';
	}

	vars = {
		allowedAction: ['AUDIO', 'DISPLAY', 'EMAIL'],
		allowedRelated: ['START', 'END']
	};

	data = {
		action: null,
		related: null,
		trigger: null,
		duration: null,
		description: null,
		repeat: null,
		attach: [],
		attendee: [],
		summary: null
	};

	/**
	 * Set/Get the alarm's action
	 *
	 * @param {STRING} action
	 * @since 0.2.0
	 * @returns {ICalAlarm|String}
	 */
	this.action = function(action) {
		if(!action) {
			return data.action;			
		}

		if(vars.allowedAction.indexOf(action.toUpperCase()) === -1) {
			throw '`action` must be one of the following: ' + vars.allowedAction.join(', ') + '!';
		}

		data.action = action;
		return this;
	};

	/**
	 * Set/Get the alarm's trigger
	 *
	 * @param {STRING|DATE} trigger
	 * @since 0.2.0
	 * @returns {ICalAlarm|String}
	 */
	this.trigger = function(trigger) {
		if(!trigger) {
			return data.trigger;
		}

		if(trigger==null) {
			throw '`trigger` must be specified';
		}

		data.trigger = trigger;
		return this;
	};

	/**
	 * Set/Get the alarm's duration
	 *
	 * @param {} duration
	 * @since 0.2.0
	 * @returns {ICalAlarm|String}
	 */
	this.duration = function(duration) {
		if(!duration) {
			return data.duration;
		}

		data.duration = duration;
		return this;
	};

	/**
	 * Set/Get the alarm's description
	 *
	 * @param {STRING} description
	 * @since 0.2.0
	 * @returns {ICalAlarm|String}
	 */
	this.description = function(description) {
		if(!description) {
			throw '`description` must be specified';
		}

		data.description = description;
		return this;
	};

	/**
	 * Set/Get the related
	 *
	 * @param {STRING} related
	 * @since 0.2.0
	 * @returns {ICalAlarm|String}
	 */
	this.related = function(related) {
		if(!related) {
			return data.related;
		}

		if(vars.allowedRelated.indexOf(related.toUpperCase()) === -1) {
			throw '`related` must be one of the following: ' + vars.allowedRoles.join(', ') + '!';
		}

		data.related = related.toUpperCase();
		return this;
	};

	/**
	 * Set/Get the alarm's repeat
	 *
	 * @param {INTEGER} repeat
	 * @since 0.2.0
	 * @returns {ICalAlarm|String}
	 */
	this.repeat = function(repeat) {
		if(!repeat) {
			return data.repeat;
		}

		data.repeat = repeat;
		return this;
	};

	/**
	 * Set/Get the alarm's summary for email
	 *
	 * @param {STRING} summary
	 * @since 0.2.0
	 * @returns {ICalAlarm|String}
	 */
	this.summary = function(summary) {
		if(!summary) {
			data.summary = 'New email alert';
		}

		data.summary = summary;
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
	 * Export Event to iCal
	 *
	 * @since 0.2.0
	 * @returns {String}
	 */
	this.generate = function() {
		var g = 'BEGIN:VALARM' + '\n';
		g += 'ACTION:' + data.action + '\n';
		if (data.trigger)
			g += 'TRIGGER;';
		else	throw '`trigger` must be specified';

		// RELATED
		if(data.related) {
			g += 'RELATED:' + data.related;
		}

		// WHEN TRIGGER
		if(data.trigger instanceof Date) {
			g += 'VALUE=DATE-TIME:' + data.trigger + '\n';
		}else{
			g += 'VALUE=DURATION:-PT' + data.trigger + '\n';
		}

		// DURATION
		if(data.duration) {
			g += 'DURATION:PT' + data.duration + '\n';
		}

		// DESCRIPTION
		if(data.description) {
			g += 'DESCRIPTION:' + data.description + '\n';
		}

		// REPEAT
		if(data.repeat) {
			g += 'REPEAT:' + data.repeat + '\n';
		}

		// IF ACTION = AUDIO, can ADD an ATTACH
		if(data.action == 'AUDIO') {
			//g += 'REPEAT:' + data.repeat + '\n';
		}

		g += 'END:VALARM' + '\n';
		return g;
	};


	for(i in _data) {
		if(_data.hasOwnProperty(i) && ['action', 'trigger', 'duration', 'description', 'repeat', 'summary'].indexOf(i) > -1) {
			this[i](_data[i]);
		}
	}
};

module.exports = ICalAlarm;