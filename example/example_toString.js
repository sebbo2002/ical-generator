var ical = require('../lib/ical-generator.js'),
	cal = ical();

cal.setDomain('example.com');

cal.addEvent({
	start: new Date(new Date().getTime() + 3600000),
	end: new Date(new Date().getTime() + 7200000),
	summary: 'Example Event',
	description: 'It works ;)',
	organizer: {
		name: 'Organizer\'s Name',
		email: 'organizer@example.com'
	},
	url: 'http://sebbo.net/'
});

console.log(cal.toString());