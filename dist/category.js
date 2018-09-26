'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ICalTools = require('./_tools');

/**
 * @author Sebastian Pekarek
 * @module ical-generator
 * @class ICalCategory
 */

var ICalCategory = function () {
    function ICalCategory(data, event) {
        _classCallCheck(this, ICalCategory);

        this._data = {
            name: null
        };
        this._attributes = ['name'];

        this._event = event;
        if (!event) {
            throw new Error('`event` option required!');
        }

        for (var i in data) {
            if (this._attributes.indexOf(i) > -1) {
                this[i](data[i]);
            }
        }
    }

    /**
     * Set/Get the category name
     *
     * @param name Name
     * @since 0.3.0
     * @returns {ICalCategory|String}
     */


    _createClass(ICalCategory, [{
        key: 'name',
        value: function name(_name) {
            if (_name === undefined) {
                return this._data.name;
            }
            if (!_name) {
                this._data.name = null;
                return this;
            }

            this._data.name = _name;
            return this;
        }

        /**
         * Export calender as JSON Object to use it later…
         *
         * @since 0.2.4
         * @returns {Object}
         */

    }, {
        key: 'toJSON',
        value: function toJSON() {
            return ICalTools.toJSON(this, this._attributes);
        }

        /**
         * Export Event to iCal
         *
         * @since 0.2.0
         * @returns {String}
         */

    }, {
        key: '_generate',
        value: function _generate() {

            // CN / Name
            if (!this._data.name) {
                throw new Error('No value for `name` in ICalCategory given!');
            }

            return ICalTools.escape(this._data.name);
        }
    }]);

    return ICalCategory;
}();

module.exports = ICalCategory;