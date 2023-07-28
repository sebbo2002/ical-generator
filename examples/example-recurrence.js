'use strict';

import ical from 'ical-generator';
import moment from 'moment';
const cal = ical();

cal.createEvent({
    start: moment().add(1, 'hour'),
    end: moment().add(2, 'hours'),
    summary: 'Example Recurrence-Id',
    recurrenceId: moment().add(4, 'hour')
});

console.log(cal.toString());
