'use strict';

var ical = require('../lib/'),
    http = require('http'),
    cal = ical({
        domain: 'sebbo.net',
        prodId: '//superman-industries.com//ical-generator//EN',
        events: [
            {
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event',
                description: 'It works ;)',
                url: 'http://sebbo.net/'
            }
        ]
    });

http.createServer(function(req, res) {
    cal.serve(res);
}).listen(3000, '127.0.0.1', function() {
    console.log('Server running at http://127.0.0.1:3000/');
});