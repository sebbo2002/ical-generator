import ical from 'ical-generator';
import http from 'node:http';

const calendar = ical({name: 'my first iCal'});
const startTime = new Date();
const endTime = new Date();
endTime.setHours(startTime.getHours()+1);
calendar.createEvent({
    start: startTime,
    end: endTime,
    summary: 'Example Event',
    description: 'It works ;)',
    location: 'my room',
    url: 'http://sebbo.net/'
});

http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="calendar.ics"'
    });

    res.end(calendar.toString());
})
    .listen(3000, '127.0.0.1', () => {
        console.log('Server running at http://127.0.0.1:3000/');
    });
