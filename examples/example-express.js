'use strict';

const ical = require('ical-generator-edtex');
const moment = require('moment');
const express = require('express');

const cal = ical({
    domain: 'example.com',
    prodId: '//superman-industries.com//ical-generator-edtex//EN',
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
