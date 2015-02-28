var ical = require('../lib/index.js'),
	http = require('http'),
	cal = ical();

cal.addEvent({
	start: new Date(),
	end: new Date(new Date().getTime() + 3600000),
	summary: 'Example Event',
	description: 'It works ;)',
	url: 'http://sebbo.net/'
});

http.createServer(function(req, res) {
	cal.serve(res);
}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');