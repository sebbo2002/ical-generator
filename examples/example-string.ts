'use strict';

import ical from 'ical-generator';
import moment from 'moment';

const cal = ical();

const event = cal.createEvent({
    description: 'It works ;)',
    end: moment().add(2, 'hours'),
    organizer: "Organizer's Name <organizer@example.com>",
    start: moment().add(1, 'hour'),
    summary: 'Example Event',
    url: 'https://example.com',
});

// update event's description
event.description('It still works ;)');

console.log(cal.toString());
