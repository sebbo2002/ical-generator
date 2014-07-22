# ical-generator

[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![CI Status](https://sebbo.helium.uberspace.de/teamcity-badges/iCalGenerator_Develop/status)](https://ci.sebbo.net/viewType.html?buildTypeId=iCalGenerator_Develop&guest=1)
[![Code Coverage](https://sebbo.helium.uberspace.de/teamcity-badges/iCalGenerator_Develop/coverage-istanbul)](https://ci.sebbo.net/viewType.html?buildTypeId=iCalGenerator_Develop&guest=1)
[![Dev Dependencies](http://img.shields.io/david/dev/sebbo2002/ical-generator.svg?style=flat)](http://img.shields.io/david/dev/sebbo2002/ical-generator.svg?style=flat)

ical-generator is a small piece of code which generates ical calendar files. I use this to generate subscriptionable calendar feeds.


## Installation

	npm install ical-generator


## Example

```javascript
var ical = require('ical-generator'),
	http = require('http'),
	cal = ical();

cal.setDomain('sebbo.net').setName('my first iCal');

cal.addEvent({
	start: new Date(),
	end: new Date(new Date().getTime() + 3600000),
	summary: 'Example Event',
	description: 'It works ;)',
	location: 'my room',
	url: 'http://sebbo.net/'
});

http.createServer(function(req, res) {
	cal.serve(res);
}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');
```



## API

### setDomain(domain)

Use this method to set your server's hostname. It will be used to generate the feed's UID. Default hostname is localhost.


### setName(name)

Use this method to set your feed's name.


### setProdID(prodID)

This method is used to overwrite the default ProdID:

```javascript
cal.setProdID({
	company: 'My Company',
	product: 'My Product',
	language: 'EN'
});
```


### addEvent(options)
Add an event. Options is an plain object, that configure the event.

#### options.uid (String)
Event UID. If not set, an UID will be generated randomly.

#### options.start (Date Object, required)
Appointment date of beginning

#### options.end (Date Object, required)
Appointment date of end

#### options.allDay (Bool)
Appointment is for the whole day

#### options.stamp (Date Object)
Appointment date of creation

#### options.summary (String, required)
Appointment summary

#### options.description (String)
Appointment description

#### options.location (String)
Appointment location

#### options.organizer (Plain Object)
Appointment organizer

```javascript
cal.addEvent({
	start: new Date(),
	end: new Date(new Date().getTime() + 3600000),
	summary: 'Example Event',
	description: 'Appointment with Organizer',
	location: 'Room 123',
	organizer: {
		name: 'Organizer\'s Name',
		email: 'organizer@example.com'
	}
});
```

#### options.url (String)
Appointment Website


### save(file[, cb])
Save Calendar to disk asynchronously using [fs.writeFile](http://nodejs.org/api/fs.html#fs_fs_writefile_filename_data_options_callback)


### saveSync(file)
Save Calendar to disk synchronously using [fs.writeFileSync](http://nodejs.org/api/fs.html#fs_fs_writefilesync_filename_data_options)


### serve(response)
Send Calendar to the User when using HTTP. See example above.


### toString()
Return Calendar as a String.

### length()
Returns the ammount of events in the calendar.

### clear()
Empty the Calender.


## Tests

```javascript
// simple unit tests
mocha -R spec

// coverage test
istanbul cover _mocha -- -R spec
```


## Copyright and license

Copyright (c) Sebastian Pekarek under the [MIT license](LICENSE).