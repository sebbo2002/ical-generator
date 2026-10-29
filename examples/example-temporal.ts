/**
 * Example: Using Temporal API with ical-generator
 *
 * Note: Temporal is a JavaScript proposal for a modern date/time API.
 * You may need to use a polyfill like temporal-polyfill:
 *   npm install temporal-polyfill
 *
 * In the future, Temporal may be available natively in Node.js.
 */

// Uncomment if using polyfill:
// import { Temporal } from 'temporal-polyfill';

import http from 'node:http';

import ical, { ICalCalendarMethod } from '../src/index.js';

const calendar = ical({ name: 'Temporal Calendar Example' });
calendar.method(ICalCalendarMethod.REQUEST);

// Example 1: Using Temporal.ZonedDateTime
// This represents a specific moment in time with a timezone
const zonedDateTime = Temporal.ZonedDateTime.from({
    day: 15,
    hour: 14,
    minute: 30,
    month: 1,
    second: 0,
    timeZone: 'Europe/Berlin',
    year: 2024,
});

const zonedEndDateTime = zonedDateTime.add({ hours: 1 });

calendar.createEvent({
    description: 'This event uses Temporal.ZonedDateTime',
    end: zonedEndDateTime,
    location: 'Berlin, Germany',
    start: zonedDateTime,
    summary: 'Meeting with Temporal ZonedDateTime',
    timezone: 'Europe/Berlin',
});

// Example 2: Using Temporal.PlainDateTime for floating times
// Floating times are the same time regardless of timezone
const plainDateTime = Temporal.PlainDateTime.from({
    day: 14,
    hour: 20,
    minute: 0,
    month: 2,
    second: 0,
    year: 2024,
});

const plainEndDateTime = plainDateTime.add({ hours: 2 });

calendar.createEvent({
    description: 'This event uses Temporal.PlainDateTime for floating time',
    end: plainEndDateTime,
    floating: true,
    start: plainDateTime,
    summary: "Valentine's Day Dinner (Floating Time)",
});

// Example 3: Using Temporal.PlainDate for all-day events
const plainDate = Temporal.PlainDate.from({
    day: 25,
    month: 12,
    year: 2024,
});

calendar.createEvent({
    allDay: true,
    description: 'This event uses Temporal.PlainDate for an all-day event',
    start: plainDate,
    summary: 'Christmas Day',
});

// Example 4: Using Temporal.Instant
const instant = Temporal.Instant.from('2024-06-15T12:00:00Z');

calendar.createEvent({
    description:
        'This event uses Temporal.Instant representing an absolute point in time',
    start: instant,
    summary: 'Event with Temporal.Instant',
});

// Create HTTP server to serve the calendar
http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Disposition': 'attachment; filename="temporal-calendar.ics"',
        'Content-Type': 'text/calendar; charset=utf-8',
    });

    res.end(calendar.toString());
}).listen(3000, '127.0.0.1', () => {
    console.log('Temporal calendar server running at http://127.0.0.1:3000/');
    console.log('Calendar includes examples of:');
    console.log('  - Temporal.ZonedDateTime (with timezone)');
    console.log('  - Temporal.PlainDateTime (floating time)');
    console.log('  - Temporal.PlainDate (all-day event)');
    console.log('  - Temporal.Instant (absolute time)');
});
