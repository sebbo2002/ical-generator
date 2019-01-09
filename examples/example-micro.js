'use strict';

const ical = require('ical-generator-edtex');
const moment = require('moment');

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

// start with $ micro example/example-micro.js
module.exports = (req, res) => {
    cal.serve(res);
};


