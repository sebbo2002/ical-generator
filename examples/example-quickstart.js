import ical from 'ical-generator';
import http from 'node:http';

const calendar = ical({ name: 'my first iCal' });
const startTime = new Date();
const endTime = new Date();
endTime.setHours(startTime.getHours() + 1);
calendar.createEvent({
    description: 'It works ;)',
    end: endTime,
    location: 'my room',
    start: startTime,
    summary: 'Example Event',
    url: 'http://sebbo.net/',
});

http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="calendar.ics"',
        'Content-Type': 'text/calendar; charset=utf-8',
    });

    res.end(calendar.toString());
}).listen(3000, '127.0.0.1', () => {
    console.log('Server running at http://127.0.0.1:3000/');
});
