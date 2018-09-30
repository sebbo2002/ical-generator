'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ICalTools = require('./_tools');

/**
 * @author Sebastian Pekarek
 * @module ical-generator
 * @class ICalAttendee
 */

var ICalAttendee = function () {
    function ICalAttendee(data, event) {
        _classCallCheck(this, ICalAttendee);

        this._data = {
            name: null,
            email: null,
            status: null,
            role: 'REQ-PARTICIPANT',
            rsvp: null,
            type: null,
            delegatedTo: null,
            delegatedFrom: null
        };
        this._attributes = ['name', 'email', 'role', 'rsvp', 'status', 'type', 'delegatedTo', 'delegatedFrom', 'delegatesFrom', 'delegatesTo'];
        this._vars = {
            allowed: {
                role: ['CHAIR', 'REQ-PARTICIPANT', 'OPT-PARTICIPANT', 'NON-PARTICIPANT'],
                rsvp: ['TRUE', 'FALSE'],
                status: ['ACCEPTED', 'TENTATIVE', 'DECLINED', 'DELEGATED'],
                type: ['INDIVIDUAL', 'GROUP', 'RESOURCE', 'ROOM', 'UNKNOWN'] // ref: https://tools.ietf.org/html/rfc2445#section-4.2.3
            }
        };

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
     * Checks if the given string `str` is a valid one for category `type`
     *
     * @param {String} type
     * @param {String} str
     * @returns {string}
     * @private
     */


    _createClass(ICalAttendee, [{
        key: '_getAllowedStringFor',
        value: function _getAllowedStringFor(type, str) {
            if (!str || typeof str !== 'string') {
                throw new Error('Input for `' + type + '` must be a non-empty string. You gave ' + str);
            }

            str = str.toUpperCase();

            if (this._vars.allowed[type].indexOf(str) === -1) {
                throw new Error('`' + type + '` must be one of the following: ' + this._vars.allowed[type].join(', ') + '!');
            }

            return str;
        }

        /**
         * Set/Get the attendee's name
         *
         * @param {String} [name] Name
         * @since 0.2.0
         * @returns {ICalAttendee|String}
         */

    }, {
        key: 'name',
        value: function name(_name) {
            if (_name === undefined) {
                return this._data.name;
            }

            this._data.name = _name || null;
            return this;
        }

        /**
         * Set/Get the attendee's email address
         *
         * @param {String} [email] Email address
         * @since 0.2.0
         * @returns {ICalAttendee|String}
         */

    }, {
        key: 'email',
        value: function email(_email) {
            if (!_email) {
                return this._data.email;
            }

            this._data.email = _email;
            return this;
        }

        /**
         * Set/Get attendee's role
         *
         * @param {String} role
         * @since 0.2.0
         * @returns {ICalAttendee|String}
         */

    }, {
        key: 'role',
        value: function role(_role) {
            if (_role === undefined) {
                return this._data.role;
            }

            this._data.role = this._getAllowedStringFor('role', _role);
            return this;
        }

        /**
         * Set/Get attendee's RSVP expectation
         *
         * @param {String} rsvp
         * @since 0.2.1
         * @returns {ICalAttendee|String}
         */

    }, {
        key: 'rsvp',
        value: function rsvp(_rsvp) {
            if (_rsvp === undefined) {
                return this._data.rsvp;
            }
            if (_rsvp === null) {
                this._data.rsvp = null;
                return this;
            }

            if (_rsvp === true) {
                _rsvp = 'true';
            }
            if (_rsvp === false) {
                _rsvp = 'false';
            }

            this._data.rsvp = this._getAllowedStringFor('rsvp', _rsvp);
            return this;
        }

        /**
         * Set/Get attendee's status
         *
         * @param {String} [status]
         * @since 0.2.0
         * @returns {ICalAttendee|String}
         */

    }, {
        key: 'status',
        value: function status(_status) {
            if (_status === undefined) {
                return this._data.status;
            }
            if (!_status) {
                this._data.status = null;
                return this;
            }

            this._data.status = this._getAllowedStringFor('status', _status);
            return this;
        }

        /**
         * Set/Get attendee's type (a.k.a. CUTYPE)
         *
         * @param {String} [type]
         * @since 0.2.3
         * @returns {ICalAttendee|String}
         */

    }, {
        key: 'type',
        value: function type(_type) {
            if (_type === undefined) {
                return this._data.type;
            }
            if (!_type) {
                this._data.type = null;
                return this;
            }

            this._data.type = this._getAllowedStringFor('type', _type);
            return this;
        }

        /**
         * Set/Get the attendee's delegated-to field
         *
         * @param {String} [delegatedTo] Email address
         * @since 0.2.0
         * @returns {ICalAttendee|String}
         */

    }, {
        key: 'delegatedTo',
        value: function delegatedTo(_delegatedTo) {
            if (_delegatedTo === undefined) {
                return this._data.delegatedTo;
            }
            if (!_delegatedTo) {
                this._data.delegatedTo = null;
                if (this._data.status === 'DELEGATED') {
                    this._data.status = null;
                }
                return this;
            }

            this._data.delegatedTo = _delegatedTo;
            this._data.status = 'DELEGATED';
            return this;
        }

        /**
         * Set/Get the attendee's delegated-from field
         *
         * @param {String} [delegatedFrom] Email address
         * @since 0.2.0
         * @returns {ICalAttendee|String}
         */

    }, {
        key: 'delegatedFrom',
        value: function delegatedFrom(_delegatedFrom) {
            if (_delegatedFrom === undefined) {
                return this._data.delegatedFrom;
            }

            this._data.delegatedFrom = _delegatedFrom || null;
            return this;
        }

        /**
         * Create a new attendee this attendee delegates to
         * and returns this new attendee
         *
         * @param {String|Object|ICalAttendee} Attendee options
         * @see ICalEvent.createAttendee
         * @since 0.2.0
         * @returns {ICalAttendee}
         */

    }, {
        key: 'delegatesTo',
        value: function delegatesTo(options) {
            var a = this._event.createAttendee(options);
            this.delegatedTo(a);
            a.delegatedFrom(this);
            return a;
        }

        /**
         * Create a new attendee this attendee delegates from
         * and returns this new attendee
         *
         * @param {String|Object|ICalAttendee} Attendee options
         * @see ICalEvent.createAttendee
         * @since 0.2.0
         * @returns {ICalAttendee}
         */

    }, {
        key: 'delegatesFrom',
        value: function delegatesFrom(options) {
            var a = this._event.createAttendee(options);
            this.delegatedFrom(a);
            a.delegatedTo(this);
            return a;
        }

        /**
         * Export calender as JSON Object to use it later…
         *
         * @since 0.2.4
         * @returns {Object} Calendar
         */

    }, {
        key: 'toJSON',
        value: function toJSON() {
            return ICalTools.toJSON(this, this._attributes, {
                ignoreAttributes: ['delegatesTo', 'delegatesFrom'],
                hooks: {
                    delegatedTo: function delegatedTo(value) {
                        return value instanceof ICalAttendee ? value.email() : value;
                    },
                    delegatedFrom: function delegatedFrom(value) {
                        return value instanceof ICalAttendee ? value.email() : value;
                    }
                }
            });
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
            var g = 'ATTENDEE';

            if (!this._data.email) {
                throw new Error('No value for `email` in ICalAttendee given!');
            }

            // ROLE
            g += ';ROLE=' + this._data.role;

            // TYPE
            if (this._data.type) {
                g += ';CUTYPE=' + this._data.type;
            }

            // PARTSTAT
            if (this._data.status) {
                g += ';PARTSTAT=' + this._data.status;
            }

            // RSVP
            if (this._data.rsvp) {
                g += ';RSVP=' + this._data.rsvp;
            }

            // DELEGATED-TO
            if (this._data.delegatedTo) {
                g += ';DELEGATED-TO="' + (this._data.delegatedTo instanceof ICalAttendee ? this._data.delegatedTo.email() : this._data.delegatedTo) + '"';
            }

            // DELEGATED-FROM
            if (this._data.delegatedFrom) {
                g += ';DELEGATED-FROM="' + (this._data.delegatedFrom instanceof ICalAttendee ? this._data.delegatedFrom.email() : this._data.delegatedFrom) + '"';
            }

            // CN / Name
            if (this._data.name) {
                g += ';CN="' + this._data.name + '"';
            }

            g += ':MAILTO:' + this._data.email + '\r\n';
            return g;
        }
    }]);

    return ICalAttendee;
}();

module.exports = ICalAttendee;