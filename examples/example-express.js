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
    cal.serve(res);
});

app.listen(3000);
