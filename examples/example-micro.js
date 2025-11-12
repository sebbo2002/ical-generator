'use strict';

import ical from 'ical-generator';
import moment from 'moment';

const cal = ical({
    events: [
        {
            description: 'It works ;)',
            end: moment().add(1, 'hour'),
            start: moment(),
            summary: 'Example Event',
            url: 'https://example.com',
        },
    ],
    prodId: '//superman-industries.com//ical-generator//EN',
});

// start with $ micro example/example-micro.js
module.exports = (req, res) => {
    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="calendar.ics"',
        'Content-Type': 'text/calendar; charset=utf-8',
    });

    res.end(cal.toString());
};
