'use strict';

import ical from 'ical-generator';
const cal = ical();

cal.createEvent({
    allDay: true,
    repeating: {
        freq: 'YEARLY',
    },
    start: new Date(1969, 6, 20, 20),
    summary: 'Apollo 11 - First Man to walk on the Moon (1969)',
    url: 'http://www.nasa.gov/mission_pages/apollo/index.html',
});

console.log(cal.toString());
