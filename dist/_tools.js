'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var moment = require('moment-timezone');

/**
 * @author Sebastian Pekarek
 * @module ical-generator
 * @class ICalTools
 */

var ICalTools = function () {
    function ICalTools() {
        _classCallCheck(this, ICalTools);
    }

    _createClass(ICalTools, null, [{
        key: 'formatDate',
        value: function formatDate(timezone, d, dateonly, floating) {
            var m = timezone ? moment(d).tz(timezone) : moment(d).utc();
            var s = m.format('YYYYMMDD');

            if (!dateonly) {
                s += 'T';
                s += m.format('HHmmss');

                if (!floating) {
                    s += 'Z';
                }
            }

            return s;
        }

        // For information about this format, see RFC 5545, section 3.3.5
        // https://tools.ietf.org/html/rfc5545#section-3.3.5

    }, {
        key: 'formatDateTZ',
        value: function formatDateTZ(timezone, property, date, eventData) {
            var tzParam = '';
            var floating = eventData.floating;

            if (eventData.timezone) {
                tzParam = ';TZID=' + eventData.timezone;

                // This isn't a 'floating' event because it has a timezone;
                // but we use it to omit the 'Z' UTC specifier in formatDate()
                floating = true;
            }

            return property + tzParam + ':' + module.exports.formatDate(timezone, date, false, floating);
        }
    }, {
        key: 'escape',
        value: function escape(str) {
            return String(str).replace(/[\\;,"]/g, function (match) {
                return '\\' + match;
            }).replace(/(?:\r\n|\r|\n)/g, '\\n');
        }
    }, {
        key: 'toJSON',
        value: function toJSON(object, attributes, options) {
            var result = {};
            options = options || {};
            options.ignoreAttributes = options.ignoreAttributes || [];
            options.hooks = options.hooks || {};

            attributes.forEach(function (attribute) {
                if (options.ignoreAttributes.indexOf(attribute) !== -1) {
                    return;
                }

                var value = object[attribute](),
                    newObj = void 0;

                if (moment.isMoment(value)) {
                    value = value.toJSON();
                }
                if (options.hooks[attribute]) {
                    value = options.hooks[attribute](value);
                }
                if (!value) {
                    return;
                }

                result[attribute] = value;

                if (Array.isArray(result[attribute])) {
                    newObj = [];
                    result[attribute].forEach(function (object) {
                        newObj.push(object.toJSON());
                    });
                    result[attribute] = newObj;
                }
            });

            return result;
        }
    }, {
        key: 'foldLines',
        value: function foldLines(input) {
            return input.split('\r\n').map(function (line) {
                return line.match(/(.{1,74})/g).join('\r\n ');
            }).join('\r\n');
        }
    }]);

    return ICalTools;
}();

module.exports = ICalTools;