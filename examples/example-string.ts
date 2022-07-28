'use strict';

import ical from 'ical-generator';
import moment from 'moment';

const cal = ical();

const event = cal.createEvent({
    start: moment().add(1, 'hour'),
    end: moment().add(2, 'hours'),
    summary: 'Example Event',
    description: 'It works ;)',
    organizer: 'Organizer\'s Name <organizer@example.com>',
    url: 'https://example.com'
});

// update event's description
event.description('It still works ;)');

console.log(cal.toString());
