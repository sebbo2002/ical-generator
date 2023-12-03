'use strict';

import ical from 'npm:ical-generator';

const cal = ical();
const event = cal.createEvent({
    start: new Date(),
    end: new Date(),
    summary: 'Example Event',
    description: 'It works ;)',
    organizer: 'Organizer\'s Name <organizer@example.com>',
    url: 'https://example.com'
});

// update event's description
event.description('It still works ;)');

console.log(cal.toString());
