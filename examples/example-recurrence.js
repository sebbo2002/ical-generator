'use strict';

const ical = require('../src/index');
const moment = require('moment');
const cal = ical({domain: 'localhost'});

// overwrite domain
cal.domain('example.com');

cal.createEvent({
    start: moment().add(1, 'hour'),
    end: moment().add(2, 'hours'),
    summary: 'Example Recurrence-Id',
    recurrenceId: moment().add(4, 'hour')
});

console.log(cal.toString());
