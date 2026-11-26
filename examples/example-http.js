'use strict';

import ical from 'ical-generator';
import moment from 'moment';
import http from 'node:http';

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

http.createServer(function (req, res) {
    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="calendar.ics"',
        'Content-Type': 'text/calendar; charset=utf-8',
    });

    res.end(cal.toString());
}).listen(3000, '127.0.0.1', function () {
    console.log('Server running at http://127.0.0.1:3000/');
});
