![ical-generator Logo](https://d.sebbo.net/ical-generator-logo-AvKRjlfYJe4OlPV9l0zgSDlgyW59bOzFzjUUTG9tGM0ySKQuZ1PbzkZO9XYZ1vjLt8XwRgjZH2CYw22vD9OTzFeTvEWlqPFfyuox.jpg)

# ical-generator

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
![Size](https://img.shields.io/bundlephobia/min/ical-generator?style=flat-square)
[![Status](https://img.shields.io/github/workflow/status/sebbo2002/ical-generator/Tests?style=flat-square)](https://github.com/sebbo2002/ical-generator/actions)
![Dependencies](https://img.shields.io/depfu/sebbo2002/ical-generator?style=flat-square)

`ical-generator` is a small but fine library with which you can very easily create a valid iCal calendars, for example
to generate subscriptionable calendar feeds.


## 📦 Installation

	npm install ical-generator

    # For TypeScript Users
    # (see "I use Typescript and get TS2307: Cannot find module errors" section below)
    npm i -D @types/node rrule moment-timezone moment dayjs @types/luxon


## ⚡️ Quick Start

```javascript
import ical from 'ical-generator';
import http from 'http';

const calendar = ical({name: 'my first iCal'});
calendar.createEvent({
    start: moment(),
    end: moment().add(1, 'hour'),
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

## 📑 API-Reference

- [Index](https://sebbo2002.github.io/ical-generator/develop/reference/)
    - [ICalCalendar](https://sebbo2002.github.io/ical-generator/develop/reference/classes/icalcalendar.html)
    - [ICalEvent](https://sebbo2002.github.io/ical-generator/develop/reference/classes/icalevent.html)
        - [ICalAlarm](https://sebbo2002.github.io/ical-generator/develop/reference/classes/icalalarm.html)
        - [ICalAttendee](https://sebbo2002.github.io/ical-generator/develop/reference/classes/icalattendee.html)
        - [ICalCategory](https://sebbo2002.github.io/ical-generator/develop/reference/classes/icalcategory.html)

## 🕒 Date, Time & Timezones

ical-generator supports [native Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date),
[moment.js](https://momentjs.com/) (and [moment-timezone](https://momentjs.com/timezone/), [Day.js](https://day.js.org/en/) and
[Luxon's](https://moment.github.io/luxon/) [DateTime](https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html)
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

### I use Typescript and get `TS2307: Cannot find module` errors
`ical-generator` supports some third-party libraries such as moment.js or Day.js. To enable Typescript to do something
with these types, they must of course also be installed. Unfortunately, npm does not install optional `peerDependencies`.
Because these modules are not necessary for JavaScript users, I have marked these modules as optional. So if you use
Typescript, you need the following modules to build the code that uses `ical-calendar':

```bash
npm i -D @types/node rrule moment-timezone moment dayjs @types/luxon
```

For JavaScript users they are not necessary.


## 🙆🏼‍♂️ Copyright and license

Copyright (c) Sebastian Pekarek under the [MIT license](LICENSE).
