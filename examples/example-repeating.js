'use strict';

const ical = require('ical-generator');
const cal = ical();

cal.createEvent({
    start: new Date(1969, 6, 20, 20),
    allDay: true,
    summary: 'Apollo 11 - First Man to walk on the Moon (1969)',
    url: 'http://www.nasa.gov/mission_pages/apollo/index.html',
    repeating: {
        freq: 'YEARLY'
    }
});

console.log(cal.toString());
