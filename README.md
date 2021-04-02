![ical-generator Logo](https://d.sebbo.net/ical-generator-logo-AvKRjlfYJe4OlPV9l0zgSDlgyW59bOzFzjUUTG9tGM0ySKQuZ1PbzkZO9XYZ1vjLt8XwRgjZH2CYw22vD9OTzFeTvEWlqPFfyuox.jpg)

# ical-generator

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
![Size](https://img.shields.io/bundlephobia/min/ical-generator?style=flat-square)
[![Status](https://img.shields.io/github/workflow/status/sebbo2002/ical-generator/Tests?style=flat-square)](https://github.com/sebbo2002/ical-generator/actions)
![Dependencies](https://img.shields.io/depfu/sebbo2002/ical-generator?style=flat-square)

`ical-generator` is a small but fine library with which you can very easily create a valid iCal calendars, for example
to generate subscriptionable calendar feeds.

<table><tr><td>
<b>⚠️ Version 2.0.0</b><br /><br />
<p>You are looking at the readme of the new version 2.0.0, which is currently still under development. The new version is
a complete rewrite in Typescript, but I tried to keep most of the API. Nevertheless, there are some changes. You can
install this future version by running <code>npm i ical-generator@next</code>.</p>

<p>If you are looking for the readme of the current version, you can find it
<a href="https://github.com/sebbo2002/ical-generator/blob/master/README.md">here</a>.</p>
<p>If you want to help out or want to know what's in the pipeline with the new version, you're welcome to take a look
<a href="https://github.com/sebbo2002/ical-generator/issues?q=milestone%3A%22v2.0.0+%F0%9F%8E%89%22+">here</a> and get an idea of
what's in the new version.</p>
</td></tr></table>


## 📦 Installation

	npm install ical-generator


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
set, `ical-generator` assumes that the given time matches the time zone. If a `moment-timezone` object or Luxon's
`setZone` method works, `ical-generator` sets it according to the time zone set in the calendar/event.


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
  "node": {
    "fs": "empty"
  }
}
```

### Where's the changelog?
It's [here](https://github.com/sebbo2002/ical-generator/blob/develop/CHANGELOG.md). If you need the changelog for
`ical-generator` 1.x.x and older, you'll find it [here](https://github.com/sebbo2002/ical-generator/blob/25338b8bf98f9afd3c88849e735fa33fa45fb766/CHANGELOG.md).

### I use Typescript and get `TS2307: Cannot find module` errors
`ical-generator` supports some third-party libraries such as moment.js or Day.js. To enable Typescript to do something
with these types, they must of course also be installed. Unfortunately, npm does not install `peerDependencies` in
versions 4-6, so these dependencies have to be installed manually. The best thing to do is to update your npm installation
and reinstall `ical-generator`, which should solve the problem.


## 🙆🏼‍♂️ Copyright and license

Copyright (c) Sebastian Pekarek under the [MIT license](LICENSE).
