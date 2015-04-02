'use strict';


/**
 * @author Sebastian Pekarek
 * @module attendee
 * @constructor ICalAttendee Attendee
 */
var ICalAttendee = function(_data, event) {
	var vars,
		i,
		data;

	if(!event) {
		throw '`event` option required!';
	}

	vars = {
		allowedRoles: ['REQ-PARTICIPANT', 'NON-PARTICIPANT'],
		allowedStatuses: ['ACCEPTED', 'TENTATIVE', 'DECLINED', 'DELEGATED']
	};

	data = {
		name: null,
		email: null,
		status: null,
		role: 'REQ-PARTICIPANT',
		delegatedTo: null,
		delegatedFrom: null
	};

	/**
	 * Set/Get the attendee's name
	 *
	 * @param name Name
	 * @since 0.2.0
	 * @returns {ICalAttendee|String}
	 */
	this.name = function(name) {
		if(!name) {
			return data.name;
		}

		data.name = name;
		return this;
	};


	/**
	 * Set/Get the attendee's email address
	 *
	 * @param email Email address
	 * @since 0.2.0
	 * @returns {ICalAttendee|String}
	 */
	this.email = function(email) {
		if(!email) {
			return data.email;
		}

		data.email = email;
		return this;
	};


	/**
	 * Set/Get attendee's role
	 *
	 * @param {String} role
	 * @since 0.2.0
	 * @returns {ICalAttendee|String}
	 */
	this.role = function(role) {
		if(!role) {
			return data.role;
		}

		if(vars.allowedRoles.indexOf(role.toUpperCase()) === -1) {
			throw '`role` must be one of the following: ' + vars.allowedRoles.join(', ') + '!';
		}

		data.role = role.toUpperCase();
		return this;
	};


	/**
	 * Set/Get attendee's status
	 *
	 * @param {String} status
	 * @since 0.2.0
	 * @returns {ICalAttendee|String}
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
	 * Set/Get the attendee's delegated-to field
	 *
	 * @param delegatedTo Email address
	 * @since 0.2.0
	 * @returns {ICalAttendee|String}
	 */
	this.delegatedTo = function(delegatedTo) {
		if(!delegatedTo) {
			return data.delegatedTo;
		}

		data.delegatedTo = delegatedTo;
		data.status = 'DELEGATED';
		return this;
	};


	/**
	 * Set/Get the attendee's delegated-from field
	 *
	 * @param delegatedFrom Email address
	 * @since 0.2.0
	 * @returns {ICalAttendee|String}
	 */
	this.delegatedFrom = function(delegatedFrom) {
		if(!delegatedFrom) {
			return data.delegatedFrom;
		}

		data.delegatedFrom = delegatedFrom;
		return this;
	};


	/**
	 * Create a new attendee this attendee delegates to
	 * and returns this new attendee
	 *
	 * @param {Object} options
	 * @since 0.2.0
	 * @returns {ICalAttendee}
	 */
	this.delegatesTo = function(options) {
		var a = options instanceof ICalAttendee ? options : event.createAttendee(options);
		this.delegatedTo(a);
		a.delegatedFrom(this);
		return a;
	};


	/**
	 * Create a new attendee this attendee delegates from
	 * and returns this new attendee
	 *
	 * @param {Object} options
	 * @since 0.2.0
	 * @returns {ICalAttendee}
	 */
	this.delegatesFrom = function(options) {
		var a = options instanceof ICalAttendee ? options : event.createAttendee(options);
		this.delegatedFrom(a);
		a.delegatedTo(this);
		return a;
	};


	/**
	 * Export Event to iCal
	 *
	 * @since 0.2.0
	 * @returns {String}
	 */
	this.generate = function() {
		var g = 'ATTENDEE';

		if(!data.email) {
			throw 'No value for `email` in ICalAttendee given!';
		}

		// ROLE
		g += ';ROLE=' + data.role;

		// PARTSTAT
		if(data.status) {
			g += ';PARTSTAT=' + data.status;
		}

		// DELEGATED-TO
		if(data.delegatedTo) {
			g += ';DELEGATED-TO="' + (data.delegatedTo instanceof ICalAttendee ? data.delegatedTo.email() : data.delegatedTo) + '"';
		}

		// DELEGATED-FROM
		if(data.delegatedFrom) {
			g += ';DELEGATED-FROM="' + (data.delegatedFrom instanceof ICalAttendee ? data.delegatedFrom.email() : data.delegatedFrom) + '"';
		}

		// CN / Name
		if(data.name) {
			g += ';CN="' + data.name + '"';
		}

		g += ':MAILTO:' + data.email + '\r\n';
		return g;
	};


	for(i in _data) {
		if(_data.hasOwnProperty(i) && ['name', 'email', 'role', 'status', 'delegatedTo', 'delegatedFrom', 'delegatesFrom', 'delegatesTo'].indexOf(i) > -1) {
			this[i](_data[i]);
		}
	}
};

module.exports = ICalAttendee;