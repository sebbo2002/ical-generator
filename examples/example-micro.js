'use strict';

import ical from 'ical-generator';
import moment from 'moment';

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

// start with $ micro example/example-micro.js
module.exports = (req, res) => {
    cal.serve(res);
};


