module.exports = function() {
	'use strict';

	/**
	 * @type {ICalCalendar}
	 */
	var Calendar = require('./calendar.js');
	return new Calendar();
};
