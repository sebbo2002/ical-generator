const ical = require('../src');
const moment = require('moment');
const cal = ical({domain: 'localhost'});

// overwrite domain
cal.domain('example.com');

const event = cal.createEvent({
    start: moment().add(1, 'hour'),
    end: moment().add(2, 'hours'),
    summary: 'Example Event',
    description: 'It works ;)',
    organizer: 'Organizer\'s Name <organizer@example.com>',
    url: 'http://sebbo.net/'
});

// update event's description
event.description('It still works ;)');

console.log(cal.toString());