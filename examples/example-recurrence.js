'use strict';

import ical from 'ical-generator';
import moment from 'moment';
const cal = ical();

cal.createEvent({
    end: moment().add(2, 'hours'),
    recurrenceId: moment().add(4, 'hour'),
    start: moment().add(1, 'hour'),
    summary: 'Example Recurrence-Id',
});

console.log(cal.toString());
