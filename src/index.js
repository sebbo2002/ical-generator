/**
 * iCal Generator Entrypoint
 */
'use strict';


const ICalCalendar = require('./calendar');


/**
 * @param {object} [data]
 * @returns {ICalCalendar}
 */
module.exports = function (data) {
    return new ICalCalendar(data);
};