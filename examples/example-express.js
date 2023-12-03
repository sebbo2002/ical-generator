'use strict';

import ical from 'ical-generator';
import moment from 'moment';
import express from 'express';

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

const app = express();

app.get('/calendar', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="calendar.ics"'
    });

    res.end(cal.toString());
});

app.listen(3000);
