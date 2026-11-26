import ical from 'ical-generator';
const cal = ical();

const event = cal.createEvent({
    description: 'It works ;)',
    end: new Date(),
    organizer: "Organizer's Name <organizer@example.com>",
    start: new Date(),
    summary: 'Example Event',
    url: 'https://example.com',
});

// update event's description
event.description('It still works ;)');

cal.toString();
