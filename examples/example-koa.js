'use strict';

import ical from 'ical-generator';
import Koa from 'koa';
import moment from 'moment';

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

const app = new Koa();

app.use((ctx) => {
    ctx.status = 200;
    ctx.respond = false;

    ctx.set('Content-Type', 'text/calendar; charset=utf-8');
    ctx.set('Content-Disposition', 'attachment; filename="calendar.ics"');

    ctx.body = cal.toString();
});

app.listen(3000);
