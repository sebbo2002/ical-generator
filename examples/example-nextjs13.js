// app/api/calendar/route.ts

import icalendar from 'ical-generator';
import moment from 'moment';

export async function GET(req) {
    if (req.method !== 'GET') {
        return new Response('Method Not Allowed', {
            headers: { Allow: 'GET' },
            status: 405,
        });
    }

    const filename = 'calendar.ics';

    try {
        const calendar = icalendar({
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

        return new Response(calendar.toString(), {
            headers: {
                'Content-Disposition': `attachment; filename='${filename}'`,
                'Content-Type': 'text/calendar; charset=utf-8',
            },
            status: 200,
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify(err), { status: 500 });
    }
}
