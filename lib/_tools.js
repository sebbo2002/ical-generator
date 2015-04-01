'use strict';

module.exports = {};

module.exports.formatDate = function _formatDate(d, dateonly, floating) {
	var s;

	function pad(i) {
		return (i < 10 ? '0': '') + i;
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
		if (match === '\n') {
			return '\\n';
		}

		return '\\' + match;
	});
};