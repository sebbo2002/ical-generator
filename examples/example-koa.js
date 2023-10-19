'use strict';

import ical from 'ical-generator';
import moment from 'moment';
import Koa from 'koa';

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

const app = new Koa();

app.use(ctx => {
    ctx.status = 200;
    ctx.respond = false;

    ctx.set('Content-Type', 'text/calendar; charset=utf-8');
    ctx.set('Content-Disposition', 'attachment; filename="calendar.ics"');

    ctx.body = cal.toString();
});

app.listen(3000);
