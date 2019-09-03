const ical = require('ical-generator');
const cal = ical({domain: 'localhost'});

// overwrite domain
cal.domain('example.com');

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

cal.toString();