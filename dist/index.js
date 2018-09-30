/**
 * iCal Generator Entrypoint
 */
'use strict';

var ICalCalendar = require('./calendar');

/**
 * @param {object} [data]
 * @returns {ICalCalendar}
 */
module.exports = function (data) {
  return new ICalCalendar(data);
};