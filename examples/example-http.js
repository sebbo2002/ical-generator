'use strict';

import ical from 'ical-generator';
import moment from 'moment';
import http from 'node:http';

const cal = ical({
    prodId: '//superman-industries.com//ical-generator//EN',
    events: [
        {
            start: moment(),
            end: moment().add(1, 'hour'),
            summary: 'Example Event',
            description: 'It works ;)',
            url: 'https://example.com'
        }
    ]
});

http.createServer(function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="calendar.ics"'
    });

    res.end(cal.toString());
}).listen(3000, '127.0.0.1', function () {
    console.log('Server running at http://127.0.0.1:3000/');
});
