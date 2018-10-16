'use strict';

const ical = require('ical-generator');
const moment = require('moment');
const Koa = require('koa');

const cal = ical({
    domain: 'example.com',
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

const app = new Koa();

app.use(ctx => {
    ctx.status = 200; // Koa defaults to 404 when it sees that status is unset
    ctx.respond = false; // mark request as handled for Koa
    cal.serve(ctx.res);
});

app.listen(3000);
