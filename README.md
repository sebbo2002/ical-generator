<br />
<br />

<p align="center">
    <img src="https://d.sebbo.net/ical-generator-logo-w-dark-2IyGhq7rHoLzQwaNbK7MvxoNpe0bivGDzbjrai56R5YTfQuvfI8DtDfbfnNeRborwoj2y0gS5urh7OKdd4wik9F5PT4LxRnReyXA.svg" alt="ical-generator" />
</p>
<p align="center">
    <a href="https://github.com/sebbo2002/ical-generator/blob/develop/LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License" />
    </a>
    <a href="https://bundlephobia.com/package/ical-generator">
        <img src="https://img.shields.io/bundlephobia/min/ical-generator?style=flat-square" alt="Module Size" />
    </a>
    <a href="https://github.com/sebbo2002/ical-generator/actions">
        <img src="https://img.shields.io/github/workflow/status/sebbo2002/ical-generator/Test%20%26%20Release?style=flat-square" alt="CI Status" />
    </a>
</p>

<br />


`ical-generator` is a small but fine library with which you can very easily create a valid iCal calendars, for example
to generate subscriptionable calendar feeds.

<br />
<br />

## 📦 Installation

	npm install ical-generator

    # For TypeScript Users
    # (see "I use Typescript and get TS2307: Cannot find module errors" section below)
    npm i -D @types/node rrule moment-timezone moment dayjs @types/luxon


## ⚡️ Quick Start

```javascript
const ical = require('ical-generator');
const http = require('http');

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

http.createServer((req, res) => calendar.serve(res))
    .listen(3000, '127.0.0.1', () => {
        console.log('Server running at http://127.0.0.1:3000/');
    });
```
See the [examples](./examples) folder for more examples.

## 📑 API-Reference

- [Index](https://sebbo2002.github.io/ical-generator/develop/reference/)
    - [ICalCalendar](https://sebbo2002.github.io/ical-generator/develop/reference/classes/ICalCalendar.html)
    - [ICalEvent](https://sebbo2002.github.io/ical-generator/develop/reference/classes/ICalEvent.html)
        - [ICalAlarm](https://sebbo2002.github.io/ical-generator/develop/reference/classes/ICalAlarm.html)
        - [ICalAttendee](https://sebbo2002.github.io/ical-generator/develop/reference/classes/ICalAttendee.html)
        - [ICalCategory](https://sebbo2002.github.io/ical-generator/develop/reference/classes/ICalCategory.html)

## 🕒 Date, Time & Timezones

ical-generator supports [native Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date),
[Day.js](https://day.js.org/en/), [Luxon's](https://moment.github.io/luxon/) [DateTime](https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html)
and the older [moment.js](https://momentjs.com/) and [moment-timezone](https://momentjs.com/timezone/)
objects. You can also pass a string which is then passed to javascript's `Date` internally.

It is recommended to use UTC time as far as possible. `ical-generator` will output all time information as UTC time as
long as no time zone is defined. For day.js, a plugin is necessary for this, which is a prerequisite. If a time zone is
set, `ical-generator` assumes that the given time matches the time zone. If a time zone is used, it is also recommended
to use a VTimezone generator. Such a function generates a VTimezone entry and returns it. For example, ical-timezones can
be used for this:

```typescript
import ical from 'ical-generator';
import {getVtimezoneComponent} from '@touch4it/ical-timezones';

const cal = new ICalCalendar();
cal.timezone({
    name: 'FOO',
    generator: getVtimezoneComponent
});
cal.createEvent({
    start: new Date(),
    timezone: 'Europe/London'
});
```

If a `moment-timezone` object or Luxon's `setZone` method works, `ical-generator` sets it according to the time zone set
in the calendar/event.




## 🚦 Tests

```
npm test
npm run coverage
npm run browser-test
```


## 🙋 FAQ

### What's `Error: Can't resolve 'fs'`?
`ical-generator` uses the node.js `fs` module to save your calendar on the filesystem. In browser environments, you usually don't need this, so if you pass `null` for fs in your bundler. In webpack this looks like this:

```json
{
  "resolve": {
    "fallback": {
      "fs": false
    }
  }
}
```

### Where's the changelog?
It's [here](https://github.com/sebbo2002/ical-generator/blob/develop/CHANGELOG.md). If you need the changelog for
`ical-generator` 1.x.x and older, you'll find it [here](https://github.com/sebbo2002/ical-generator/blob/25338b8bf98f9afd3c88849e735fa33fa45fb766/CHANGELOG.md).

### I get a `ReferenceError: TextEncoder is not defined` error (in some browsers)
This library uses [`TextEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder), which
is available in node.js ≥ 11.0.0 and [all modern browsers](https://caniuse.com/?search=textencoder).
Outdated browsers may not have the necessary API and generate this error when generating the calendar.


## 🙆🏼‍♂️ Copyright and license

Copyright (c) Sebastian Pekarek under the [MIT license](LICENSE).
