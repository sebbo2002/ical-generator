# ical-generator

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![CI Status](https://img.shields.io/travis/sebbo2002/ical-generator.svg?style=flat-square)](https://travis-ci.org/sebbo2002/ical-generator)
[![Test Coverage](https://sebbo.helium.uberspace.de/teamcity-badges/ICalGenerator_UnitTests/coverage-istanbul)](https://ci.sebbo.net/project.html?projectId=ICalGenerator&tab=preport_project1_Test_Coverage&guest=1)

ical-generator is a small piece of code which generates ical calendar files. I use this to generate subscriptionable
calendar feeds.


## Installation

	npm install ical-generator


## Upgrade from 0.1.x

ical-generator 0.2.0 introduces a completely new API, but because you guys used 0.1.x a lot, the old API still works. So
you should be able to upgrade from ical-generator 0.1.x to 0.2.0 without any code changes. In case you need the old API
docs, you can find the deprecated documentation [here](https://github.com/sebbo2002/ical-generator/blob/0.1.10/README.md).

In case you have any issues with the new API, feel free to [create an issue](https://github.com/sebbo2002/ical-generator/issues/new).


## Quick Start

```javascript
var ical = require('ical-generator'),
	http = require('http'),
	cal = ical({domain: 'github.com', name: 'my first iCal'});

// overwrite domain
cal.domain('sebbo.net');

cal.createEvent({
	start: new Date(),
	end: new Date(new Date().getTime() + 3600000),
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
var ical = require('ical-generator'),

    // Create new Calendar and set optional fields
    cal = ical({
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
var event = cal.createEvent({
    start: new Date(),
    end: new Date(new Date().getTime() + 3600000),
    timestamp: new Date(),
    summary: 'My Event',
    organizer: 'Sebastian Pekarek <mail@example.com>'
});

// like above, you can also set/change values like this…
event.summary('My Super Mega Awesome Event');

// get the iCal string
cal.toString(); // --> "BEGIN:VCALENDAR…"


// You can also create events directly with ical()
cal = ical({
    domain: 'sebbo.net',
    prodId: '//superman-industries.com//ical-generator//EN',
    events: [
        {
            start: new Date(),
            end: new Date(new Date().getTime() + 3600000),
            timestamp: new Date(),
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
var ical = require('ical-generator'),
    cal = ical();
```

You can pass options to setup your calendar or use setters to do this.

```javascript
var ical = require('ical-generator'),
    cal = ical({domain: 'sebbo.net'});

// is the same as

cal = ical().domain('sebbo.net');

// is the same as

cal = ical();
cal.domain('sebbo.net');
```


### Calendar

#### domain([_String_ domain])

Use this method to set your server's hostname. It will be used to generate the feed's UID. Default hostname is your
server's one (`require('os').hostname()`).


#### prodId([_String_|_Object_ prodId])

Use this method to overwrite the default Product Identifier (`//sebbo.net//ical-generator//EN`). `prodId` can be ether
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

Use this method to set your feed's name. Is used to fill `X-WR-CALNAME` in your iCal file.


#### timezone([_String_ timezone])

Use this method to set your feed's timezone. Is used to fill `X-WR-TIMEZONE` in your iCal.

```javascript
var cal = ical().timezone('Europe/Berlin');
```


#### createEvent([_Object_ options])

Creates a new [Event](#event) ([`ICalEvent`](#event)) and returns it. Use options to prefill the event's attributes.
Calling this method without options will create an empty event.

```javascript
var ical = require('ical-generator'),
    cal = ical(),
    event = cal.createEvent({summary: 'My Event'});

// overwrite event summary
event.summary('Your Event');
```


#### events([_Object_ events])

Add Events to calendar or return all attached events.

```javascript
var cal = ical();
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


#### save(**_String_ file**[, _Function_ cb])

Save Calendar to disk asynchronously using [fs.writeFile](http://nodejs.org/api/fs.html#fs_fs_writefile_filename_data_options_callback).


#### saveSync(**_String_ file**)

Save Calendar to disk synchronously using [fs.writeFileSync](http://nodejs.org/api/fs.html#fs_fs_writefilesync_filename_data_options).


#### serve(**_http.ServerResponse_ response**)

Send Calendar to the User when using HTTP. See Quick Start above.


#### toString()

Return Calendar as a String.


#### toJSON()

Return a shallow copy of the calendar's options for JSON stringification. Can be used for persistance.
```javascript
var cal = ical(),
    json = JSON.stringify(cal);
```

#### length()

Returns the ammount of events in the calendar.


#### clear()

Empty the Calender.



### Event

#### uid([_String_|_Number_ uid]) or id([_String_|_Number_ id])

Use this method to set the event's ID. If not set, an UID will be generated randomly.


#### start([_Date_ start])

Appointment date of beginning as Date object. This is required for all events!


#### end([_Date_ end])

Appointment date of end as Date object. This is also required for all events!


#### timestamp([_Date_ stamp]) or stamp([_Date_ stamp])

Appointment date of creation as Date object. Default to `new Date()`.


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
    byMonthDay: [1, 15] // repeat only on the 1st and 15th
});
```


#### summary([_String_ summary])

Appointment summary, defaults to empty string.


#### description([_String_ description])

Appointment description


#### location([_String_ location])

Appointment location


#### organizer([_String_|Object organizer])

Appointment organizer

```javascript
cal.organizer({
    name: 'Organizer\'s Name',
    email: 'organizer@example.com'
});

// OR

cal.organizer('Organizer\'s Name <organizer@example.com>');
```


#### createAttendee([_Object_ options])

Creates a new [Attendee](#attendee) ([`ICalAttendee`](#attendee)) and returns it. Use options to prefill the attendee's attributes.
Calling this method without options will create an empty attendee.

```javascript
var ical = require('ical-generator'),
    cal = ical(),
    event = cal.createEvent(),
    attendee = event.createAttendee({email: 'hui@example.com', 'name': 'Hui'});

// overwrite attendee's email address
attendee.email('hui@example.net');

// add another attendee
event.createAttendee('Buh <buh@example.net>');
```


#### attendees([_Object_ attendees])

Add Attendees to the event or return all attached attendees.

```javascript
var event = ical().createEvent();
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
var ical = require('ical-generator'),
    cal = ical(),
    event = cal.createEvent(),
    alarm = event.createAlarm({type: 'display', trigger: 300});

// add another alarm
event.createAlarm({
    type: 'audio',
    trigger: 300, // 5min before event
});
```


#### alarms([_Object_ alarms])

Add alarms to the event or return all attached alarms.

```javascript
var event = ical().createEvent();
cal.alarms([
    {type: 'display', trigger: 600},
    {type: 'audio', trigger: 300}
]);

cal.attendees(); // --> [ICalAlarm, ICalAlarm]
```


#### url([_String_ url])

Appointment URL


#### method([_String_ method])

Appointment method. May be any of the following: `publish`, `request`, `reply`, `add`, `cancel`, `refresh`, `counter`, `declinecounter`.


#### status([_String_ status])

Appointment status. May be any of the following: `confirmed`, `tenative`, `cancelled`.



### Attendee

#### name([_String_ name])

Use this method to set the attendee's name.


#### email([_String_ email])

The attendee's email address. An email address is required for every attendee!


#### role([_String_ role])

Set the attendee's role, defaults to `REQ-PARTICIPANT`. May be one of the following: `req-participant`, `non-participant`


#### status([_String_ status])

Set the attendee's status. May be one of the following: `accepted`, `tentative`, `declined`


#### type([_String_ type])

Set the attendee's type. May be one of the following: `individual`, `group`, `resource`, `room`, `unknown` (See [Section 4.2.3](https://tools.ietf.org/html/rfc2445#section-4.2.3))



#### delegatesTo(**_ICalAttendee_|_Object_ attendee**)

Creates a new Attendee if passed object is not already an attendee. Will set the delegatedTo and delegatedFrom attributes.

```javascript
var cal = ical(),
    event = cal.createEvent(),
    attendee = cal.createAttendee();

attendee.delegatesTo({email: 'foo@bar.com', name: 'Foo'});
```


#### delegatesFrom(**_ICalAttendee_|_Object_ attendee**)

Creates a new Attendee if passed object is not already an attendee. Will set the delegatedTo and delegatedFrom attributes.

```javascript
var cal = ical(),
    event = cal.createEvent(),
    attendee = cal.createAttendee();

attendee.delegatesFrom({email: 'foo@bar.com', name: 'Foo'});
```



### Alarm

#### type([_String_ type])

Use this method to set the alarm type. Right now, `audio` and `display` is supported.


#### trigger([_Number_|_Date_ trigger]) / triggerBefore([_Number_|_Date_ trigger])

Use this method to set the alarm time.

```javascript
var cal = ical(),
    event = cal.createEvent(),
    alarm = cal.createAlarm();

alarm.trigger(600); // -> 10 minutes before event starts
alarm.trigger(new Date()); // -> now
```


#### triggerAfter([_Number_|_Date_ trigger])

Use this method to set the alarm time.

```javascript
var cal = ical(),
    event = cal.createEvent(),
    alarm = cal.createAlarm();

alarm.trigger(600); // -> 10 minutes after the event finishes
alarm.trigger(new Date()); // -> now
```


#### repeat([_Number_ repeat])

Use this method to repeat the alarm.

```javascript
var cal = ical(),
    event = cal.createEvent(),

// repeat the alarm 4 times every 5 minutes…
cal.createAlarm({
    repeat: 4,
    interval: 300
});
```


#### interval([_Number_ interval])

Use this method to set the alarm's interval.

```javascript
var cal = ical(),
    event = cal.createEvent(),

// repeat the alarm 4 times every 5 minutes…
cal.createAlarm({
    repeat: 4,
    interval: 300
});
```


#### attach([_String_|_Object_ attach])

Alarm attachment; used to set the alarm sound if type = audio. Defaults to "Basso".

```javascript
var cal = ical(),
    event = cal.createEvent(),

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




## Tests

```
npm test
```


## Copyright and license

Copyright (c) Sebastian Pekarek under the [MIT license](LICENSE).
