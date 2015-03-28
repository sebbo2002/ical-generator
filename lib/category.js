'use strict';

/**
 * @author Yunier Sosa based on code of Sebastian Pekarek
 * @module category
 * @constructor ICalCategory category
 */
var ICalCategory = function(_data, event) {
	var i, data;

	if(!event) {
		throw '`event` option required!';
	}

	data = {
		name: null
	};

	/**
	 * Set/Get the category name
	 *
	 * @param name Name
	 * @since 0.2.0
	 * @returns {ICalCategory|String}
	 */
	this.name = function(name) {
		if(!name) {
			return data.name;
		}

		data.name = name;
		return this;
	};

	/**
	 * Export Event to iCal
	 *
	 * @since 0.2.0
	 * @returns {String}
	 */
	this.generate = function() {
		var g = 'CATEGORIES';

		// CN / Name
		if(data.name) {
			g += ':' + data.name + '\n';
		}

		return g;
	};


	for(i in _data) {
		if(_data.hasOwnProperty(i) && ['name'].indexOf(i) > -1) {
			this[i](_data[i]);
		}
	}
};

module.exports = ICalCategory;