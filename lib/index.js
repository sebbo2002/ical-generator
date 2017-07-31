module.exports = function(data) {
    'use strict';

    /**
     * @type {ICalCalendar}
     */
    var Calendar = require('./calendar.js');
    return new Calendar(data);
};
