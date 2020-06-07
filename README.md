# ical-generator

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
![Status](https://img.shields.io/github/workflow/status/sebbo2002/ical-generator/Tests?style=flat-square)

ical-generator is a small piece of code which generates ical calendar files. I use this to generate subscriptionable
calendar feeds.


## Installation

	npm install ical-generator


## Quick Start

```javascript
const ical = require('ical-generator');
const http = require('http');
const cal = ical({domain: 'github.com', name: 'my first iCal'});

// overwrite domain
cal.domain('sebbo.net');

cal.createEvent({
    start: moment(),
    end: moment().add(1, 'hour'),
    summary: 'Example Event',
    description: 'It works ;)',
    location: 'my room',
    url: 'http://sebbo.net/'
});

http.createServer(function(req, res) {
    cal.serve(res);
}).listen(3000, '127.0.0.1', function() {
    console.log('Server running at http://127.0.0.1:3000/');
});
```


## Just another example

```javascript
const ical = require('ical-generator');

// Create new Calendar and set optional fields
const cal = ical({
    domain: 'sebbo.net',
    prodId: {company: 'superman-industries.com', product: 'ical-generator'},
    name: 'My Testfeed',
    timezone: 'Europe/Berlin'
});

// You can also set values like this…
cal.domain('sebbo.net');

// … or get values
cal.domain(); // --> "sebbo.net"

// create a new event
const event = cal.createEvent({
    start: moment(),
    end: moment().add(1, 'hour'),
    timestamp: moment(),
    summary: 'My Event',
    organizer: 'Sebastian Pekarek <mail@example.com>'
});

// like above, you can also set/change values like this…
event.summary('My Super Mega Awesome Event');

// get the iCal string
cal.toString(); // --> "BEGIN:VCALENDAR…"


// You can also create events directly with ical()
ical({
    domain: 'sebbo.net',
    prodId: '//superman-industries.com//ical-generator//EN',
    events: [
        {
            start: moment(),
            end: moment().add(1, 'hour'),
            timestamp: moment(),
            summary: 'My Event',
            organizer: 'Sebastian Pekarek <mail@example.com>'
        }
    ]
}).toString();
```


## API

### ical-generator

#### ical([_Object_ options])

Creates a new [Calendar](#calendar) ([`ICalCalendar`](#calendar)).

```javascript
const ical = require('ical-generator');
const cal = ical();
```

You can pass options to setup your calendar or use setters to do this.

```javascript
const ical = require('ical-generator');
const cal = ical({domain: 'sebbo.net'});

// is the same as

const cal = ical().domain('sebbo.net');

// is the same as

const cal = ical();
cal.domain('sebbo.net');
```


### Calendar

#### domain([_String_ domain])

Use this method to set your server's hostname. It will be used to generate the feed's UID. Default hostname is your
server's one (`require('os').hostname()`).


#### prodId([_String_|_Object_ prodId])

Use this method to overwrite the default Product Identifier (`//sebbo.net//ical-generator//EN`). `prodId` can be either
a valid Product Identifier or an object:

```javascript
cal.prodId({
    company: 'My Company',
    product: 'My Product',
    language: 'EN' // optional, defaults to EN
});

// OR

cal.prodId('//My Company//My Product//EN');
```


#### name([_String_ name])

Use this method to set your feed's name. Is used to fill `NAME` and `X-WR-CALNAME` in your iCal file.


#### url([_String_ url])

Use this method to set your feed's URL.

```javascript
const cal = ical().url('https://example.com/calendar.ical');
```

#### scale([_String_ scale])

Use this method to set your feed's CALSCALE. There is no default value for this property and it will not appear in your
iCal file unless set. The iCal standard specifies this as `GREGORIAN` if no value is present.

```javascript
const cal = ical().scale('gregorian');
```


#### timezone([_String_ timezone])

Use this method to set your feed's timezone. Is used to fill `TIMEZONE-ID` and `X-WR-TIMEZONE` in your iCal.

```javascript
const cal = ical().timezone('Europe/Berlin');
```

#### method([_String_ method])

Calendar method. May be any of the following: `publish`, `request`, `reply`, `add`, `cancel`, `refresh`, `counter`, `declinecounter`.


#### ttl([_Number_ ttl])

Use this method to set your feed's time to live (in seconds). Is used to fill `REFRESH-INTERVAL` and `X-PUBLISHED-TTL` in your iCal.

```javascript
const cal = ical().ttl(60 * 60 * 24);
```


#### createEvent([_Object_ options])

Creates a new [Event](#event) ([`ICalEvent`](#event)) and returns it. Use options to prefill the event's attributes.
Calling this method without options will create an empty event.

```javascript
const ical = require('ical-generator');
const cal = ical();
const event = cal.createEvent({summary: 'My Event'});

// overwrite event summary
event.summary('Your Event');
```


#### events([_Object_ events])

Add Events to calendar or return all attached events.

```javascript
const cal = ical();

cal.events([
    {
        start: new Date(),
        end: new Date(new Date().getTime() + 3600000),
        summary: 'Example Event',
        description: 'It works ;)',
        url: 'http://sebbo.net/'
    }
]);

cal.events(); // --> [ICalEvent]
```


#### save(**_String_ file**, _Function_ cb)

Save Calendar to disk asynchronously using [fs.writeFile](http://nodejs.org/api/fs.html#fs_fs_writefile_filename_data_options_callback). Won't work in browsers.


#### saveSync(**_String_ file**)

Save Calendar to disk synchronously using [fs.writeFileSync](http://nodejs.org/api/fs.html#fs_fs_writefilesync_filename_data_options). Won't work in browsers.


#### serve(**_http.ServerResponse_ response**, [_String_ filename])

Send Calendar to the User when using HTTP. See Quick Start above. Won't work in browsers. Defaults to `'calendar.ics'`.


#### x (**_String_ key, _String_ value**) /x (**_Object_ attributes**)

Add a custom `X-` attribute to the generated calendar file.


#### toBlob()

Generates a blob to use for downloads or to generate a download URL. Only supported in browsers supporting the Blob API.


#### toURL()

Returns a download URL using the Blob. Only supported in browsers supporting the Blob API.


#### toString()

Return Calendar as a String.


#### toJSON()

Return a shallow copy of the calendar's options for JSON stringification. Can be used for persistence.
```javascript
const cal = ical();
const json = JSON.stringify(cal);

// later
cal = ical(json);
```

#### length()

Returns the amount of events in the calendar.


#### clear()

Empty the Calender.



### Event

#### uid([_String_|_Number_ uid]) or id([_String_|_Number_ id])

Use this method to set the event's ID. If not set, an UID will be generated randomly.  When output, the ID will be suffixed with '@' + your calendar's domain.


#### sequence([_Number_ sequence])

Use this method to set the event's revision sequence number of the
calendar component within a sequence of revisions.


#### start([_moment_|_Date_ start])

Appointment date of beginning as Date object. This is required for all events!


#### end([_moment_|_Date_ end])

Appointment date of end as Date object.


#### timezone([_String_ timezone])

Use this method to set your event's timezone using the TZID property parameter on start and end dates, as per [date-time form #3 in section 3.3.5 of RFC 554](https://tools.ietf.org/html/rfc5545#section-3.3.5).

This and the 'floating' flag (see below) are mutually exclusive, and setting a timezone will unset the 'floating' flag.  If neither 'timezone' nor 'floating' are set, the date will be output with in UTC format (see [date-time form #2 in section 3.3.5 of RFC 554](https://tools.ietf.org/html/rfc5545#section-3.3.5)).


#### timestamp([_moment_|_Date_ stamp]) or stamp([_moment_|_Date_ stamp])

Appointment date of creation as Date object. Defaults to `new Date()`.


#### allDay([_Boolean_ allDay])

When allDay == true -> appointment is for the whole day


#### floating([_Boolean_ floating])

Appointment is a "floating" time. From [section 3.3.12 of RFC 554](https://tools.ietf.org/html/rfc5545#section-3.3.12):

> Time values of this type are said to be "floating" and are not
> bound to any time zone in particular.  They are used to represent
> the same hour, minute, and second value regardless of which time
> zone is currently being observed.  For example, an event can be
> defined that indicates that an individual will be busy from 11:00
> AM to 1:00 PM every day, no matter which time zone the person is
> in.  In these cases, a local time can be specified.

This and the 'timezone' setting (see above) are mutually exclusive, and setting the floating flag will unset the 'timezone'.  If neither 'timezone' nor 'floating' are set, the date will be output with in UTC format (see [date-time form #2 in section 3.3.5 of RFC 554](https://tools.ietf.org/html/rfc5545#section-3.3.5)).


#### repeating([_Object_ repeating])

Appointment is a repeating event

```javascript
event.repeating({
    freq: 'MONTHLY', // required
    count: 5,
    interval: 2,
    until: new Date('Jan 01 2014 00:00:00 UTC'),
    byDay: ['su', 'mo'], // repeat only sunday and monday
    byMonth: [1, 2], // repeat only in january und february,
    byMonthDay: [1, 15], // repeat only on the 1st and 15th
    bySetPos: 3, // repeat every 3rd sunday (will take the first element of the byDay array)
    exclude: [new Date('Dec 25 2013 00:00:00 UTC')], // exclude these dates
    excludeTimezone: 'Europe/Berlin' // timezone of exclude
});
```


#### recurrenceId([_moment_|_Date_ stamp])

Recurrence date as Date object.


#### summary([_String_ summary])

Appointment summary, defaults to empty string.


#### description([_String_ description])

Appointment description


#### htmlDescription([_String_ htmlDescription])

Some calendar apps may support HTML descriptions. Like in emails, supported HTML tags and styling is limited.


#### location([_String_ location])

Appointment location


#### appleLocation([_Object_ appleLocation])

This method can be used to pass the location as a structured object. The location is then displayed on the map in iCal.
The passed object looks like this:

```
interface AppleLocationData {
  title: string;
  address: string;
  radius: number;
  geo: GeoData;
}

interface GeoData {
  lat: number;
  lon: number;
}
```

An example:

```js
event.appleLocation({
    title: 'My Title',
    address: 'My Address',
    radius: 40,
    geo: {
        lat: '52.063921',
        lon: '5.128511'
    }
});
```

You can either use location() or appleLocation(), but now both. Thanks to [@focux](https://github.com/focux) for the [pull request](https://github.com/sebbo2002/ical-generator/pull/170)


#### geo([_String_|_Object_ geo])

Appointment geo position (gps). See [rfc](https://tools.ietf.org/html/rfc5545#section-3.8.1.6) for more details

```javascript
event.geo({
    lat: 44.4987,
    lon: -6.87667
});

// OR

event.geo('44.4987;-6.87667');
```


#### organizer([_String_|Object organizer])

Appointment organizer

```javascript
event.organizer({
    name: 'Organizer\'s Name',
    email: 'organizer@example.com'
});

// OR

event.organizer('Organizer\'s Name <organizer@example.com>');
```

You can also add an explicit `mailto` email address.

```javascript
event.organizer({
    name: 'Organizer\'s Name',
    email: 'organizer@example.com',
    mailto: 'explicit@mailto.com'
})
```

#### createAttendee([_Object_ options])

Creates a new [Attendee](#attendee) ([`ICalAttendee`](#attendee)) and returns it. Use options to prefill the attendee's attributes.
Calling this method without options will create an empty attendee.

```javascript
const ical = require('ical-generator');
const cal = ical();
const event = cal.createEvent();
const attendee = event.createAttendee({email: 'hui@example.com', name: 'Hui'});

// overwrite attendee's email address
attendee.email('hui@example.net');

// add another attendee
event.createAttendee('Buh <buh@example.net>');
```

As with the organizer, you can also add an explicit `mailto` address.

```javascript
event.createAttendee({email: 'hui@example.com', name: 'Hui', mailto: 'another@mailto.com'});

// overwrite an attendee's mailto address
attendee.mailto('another@mailto.net');
```


#### attendees([_Object_ attendees])

Add Attendees to the event or return all attached attendees.

```javascript
const event = ical().createEvent();

cal.attendees([
    {email: 'a@example.com', name: 'Person A'},
    {email: 'b@example.com', name: 'Person B'}
]);

cal.attendees(); // --> [ICalAttendee, ICalAttendee]
```


#### createAlarm([_Object_ options])

Creates a new [Alarm](#alarm) ([`ICalAlarm`](#alarm)) and returns it. Use options to prefill the alarm's attributes.
Calling this method without options will create an empty alarm.

```javascript
const ical = require('ical-generator');
const cal = ical();
const event = cal.createEvent();
const alarm = event.createAlarm({type: 'display', trigger: 300});

// add another alarm
event.createAlarm({
    type: 'audio',
    trigger: 300, // 5min before event
});
```


#### alarms([_Object_ alarms])

Add alarms to the event or return all attached alarms.

```javascript
const event = ical().createEvent();

cal.alarms([
    {type: 'display', trigger: 600},
    {type: 'audio', trigger: 300}
]);

cal.attendees(); // --> [ICalAlarm, ICalAlarm]
```

#### createCategory([_Object_ options])

Creates a new [Category](#category) ([`ICalCategory`](#category)) and returns it. Use options to prefill the categories' attributes.
Calling this method without options will create an empty category.

```javascript
const ical = require('ical-generator');
const cal = ical();
const event = cal.createEvent();
const category = event.createCategory({name: 'APPOINTMENT'});

// add another alarm
event.createCategory({
    name: 'MEETING'
});
```


#### categories([_Object_ categories])

Add categories to the event or return all selected categories.

```javascript
const event = ical().createEvent();

cal.categories([
    {name: 'APPOINTMENT'},
    {name: 'MEETING'}
]);

cal.categories(); // --> [ICalCategory, ICalCategory]
```


#### url([_String_ url])

Appointment URL


#### transparency([_String_ transparency])

Set the field to `opaque` if the person or resource is no longer available due to this event. If the calendar entry has
no influence on availability, you can set the field to `transparent`. This value is mostly used to find out if a person
has time on a certain date or not (see `TRANSP` in iCal specification).


#### status([_String_ status])

Appointment status. May be any of the following: `confirmed`, `tentative`, `cancelled`.


#### busystatus([_String_ busystatus])

Appointment busystatus. May be any of the following: `free`, `tentative`, `busy`, `oof`.


#### x (**_String_ key, _String_ value**) /x (**_Object_ attributes**)

Add a custom `X-` attribute to the generated calendar file.


#### created([_moment_|_Date_ created])

Date object of the time the appointment was created.


#### lastModified([_moment_|_Date_ lastModified])

Date object of the time the appointent was modified last.


### Attendee

#### name([_String_ name])

Use this method to set the attendee's name.


#### email([_String_ email])

The attendee's email address. An email address is required for every attendee!

#### rsvp([_String_ rsvp])

Set the attendee's RSVP expectation. May be one of the following: `true`, `false`

#### role([_String_ role])

Set the attendee's role, defaults to `REQ-PARTICIPANT`. May be one of the following: `chair`, `req-participant`, `opt-participant`, `non-participant`


#### status([_String_ status])

Set the attendee's status. May be one of the following: `accepted`, `tentative`, `declined`, `delegated`, `needs-action` (See [Section 4.2.12](https://tools.ietf.org/html/rfc2445#section-4.2.12))


#### type([_String_ type])

Set the attendee's type. May be one of the following: `individual`, `group`, `resource`, `room`, `unknown` (See [Section 4.2.3](https://tools.ietf.org/html/rfc2445#section-4.2.3))



#### delegatesTo(**_ICalAttendee_|_Object_ attendee**)

Creates a new Attendee if the passed object is not already an attendee. Will set the delegatedTo and delegatedFrom attributes.

```javascript
const cal = ical();
const event = cal.createEvent();
const attendee = cal.createAttendee();

attendee.delegatesTo({email: 'foo@bar.com', name: 'Foo'});
```


#### delegatesFrom(**_ICalAttendee_|_Object_ attendee**)

Creates a new Attendee if the passed object is not already an attendee. Will set the delegatedTo and delegatedFrom attributes.

```javascript
const cal = ical();
const event = cal.createEvent();
const attendee = cal.createAttendee();

attendee.delegatesFrom({email: 'foo@bar.com', name: 'Foo'});
```


### Alarm

#### type([_String_ type])

Use this method to set the alarm type. Right now, `audio` and `display` are supported.


#### trigger([_Number_|_moment_|_Date_ trigger]) / triggerBefore([_Number_|_moment_|_Date_ trigger])

Use this method to set the alarm time.

```javascript
const cal = ical();
const event = cal.createEvent();
const alarm = cal.createAlarm();

alarm.trigger(600); // -> 10 minutes before event starts
alarm.trigger(new Date()); // -> now
```


#### triggerAfter([_Number_|_moment_|_Date_ trigger])

Use this method to set the alarm time.

```javascript
const cal = ical();
const event = cal.createEvent();
const alarm = cal.createAlarm();

alarm.triggerAfter(600); // -> 10 minutes after the event finishes
alarm.triggerAfter(new Date()); // -> now
```


#### repeat([_Number_ repeat])

Use this method to repeat the alarm.

```javascript
const cal = ical();
const event = cal.createEvent();

// repeat the alarm 4 times every 5 minutes…
cal.createAlarm({
    repeat: 4,
    interval: 300
});
```


#### interval([_Number_ interval])

Use this method to set the alarm's interval.

```javascript
const cal = ical();
const event = cal.createEvent();

// repeat the alarm 4 times every 5 minutes…
cal.createAlarm({
    repeat: 4,
    interval: 300
});
```


#### attach([_String_|_Object_ attach])

Alarm attachment; used to set the alarm sound if type = audio. Defaults to "Basso".

```javascript
const cal = ical();
const event = cal.createEvent();

event.createAlarm({
    attach: 'https://example.com/notification.aud'
});

// OR

event.createAlarm({
    attach: {
        uri: 'https://example.com/notification.aud',
        mime: 'audio/basic'
    }
});
```


#### description([_String_| description])

Alarm description; used to set the alarm message if type = display. Defaults to the event's summary.


#### x (**_String_ key, _String_ value**) /x (**_Object_ attributes**)

Add a custom `X-` attribute to the generated calendar file.



### Category

#### name([_String_ name])

Use this method to set the category name.


## Tests

```
npm test
npm run coverage
npm run browser-test
```


## FAQ

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
It's [here](https://github.com/sebbo2002/ical-generator/blob/develop/CHANGELOG.md).

Thanks [@rally25rs](https://github.com/rally25rs) for this [tip](https://github.com/sebbo2002/ical-generator/issues/64#issuecomment-344637582).


## Copyright and license

Copyright (c) Sebastian Pekarek under the [MIT license](LICENSE).
