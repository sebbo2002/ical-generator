'use strict';

module.exports = {};

module.exports.formatDate = function formatDate(d, dateonly, floating) {
	var s;

	function pad(i) {
		return (i < 10 ? '0' : '') + i;
	}

	s = d.getUTCFullYear();
	s += pad(d.getUTCMonth() + 1);
	s += pad(d.getUTCDate());

	if(!dateonly) {
		s += 'T';
		s += pad(d.getUTCHours());
		s += pad(d.getUTCMinutes());
		s += pad(d.getUTCSeconds());

		if(!floating) {
			s += 'Z';
		}
	}

	return s;
};

module.exports.escape = function escape(str) {
	return str.replace(/[\\;,\n"]/g, function(match) {
		if(match === '\n') {
			return '\\n';
		}

		return '\\' + match;
	});
};

module.exports.duration = function duration(seconds) {
	var string = '';

	// < 0
	if(seconds < 0) {
		string = '-';
		seconds *= -1;
	}

	string += 'PT';

	// HOURS
	if(seconds >= 3600) {
		string += Math.floor(seconds / 3600) + 'H';
		seconds %= 3600;
	}

	// MINUTES
	if(seconds >= 60) {
		string += Math.floor(seconds / 60) + 'M';
		seconds %= 60;
	}

	// SECONDS
	if(seconds > 0) {
		string += seconds + 'S';
	}
	else if(string.length <= 2) {
		string += '0S';
	}

	return string;
};

module.exports.toJSON = function(object, attributes, options) {
	var result = {};
	options = options || {};
	options.ignoreAttributes = options.ignoreAttributes || [];
	options.hooks = options.hooks || {};

	attributes.forEach(function(attribute) {
		if(options.ignoreAttributes.indexOf(attribute) !== -1) {
			return;
		}

		var value = object[attribute]();
		if(options.hooks[attribute]) {
			value = options.hooks[attribute](value);
		}
		if(!value) {
			return;
		}

		result[attribute] = value;

		if(Array.isArray(result[attribute])) {
			console.log('ARRAY!');
			var newObj = [];
			result[attribute].forEach(function(object) {
				newObj.push(object.toJSON());
			});
			result[attribute] = newObj;
		}
	});

	return result;
};