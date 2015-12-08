var ical = require('../lib/'),
    cal = ical({domain: 'localhost'}),
    event;

// overwrite domain
cal.domain('example.com');

event = cal.createEvent({
    start: new Date(new Date().getTime() + 3600000),
    end: new Date(new Date().getTime() + 7200000),
    summary: 'Example Event',
    description: 'It works ;)',
    organizer: 'Organizer\'s Name <organizer@example.com>',
    url: 'http://sebbo.net/'
});

// update event's description
event.description('It still works ;)');

console.log(cal.toString());